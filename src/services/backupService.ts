/**
 * Advanced Backup and Restore Service
 * خدمة النسخ الاحتياطي والاستعادة المتقدمة
 * 
 * Comprehensive backup and restore system for database and files
 * نظام شامل للنسخ الاحتياطي والاستعادة للقاعدة والملفات
 */

import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { authService } from './authService';

// Types and Interfaces
export interface BackupItem {
  id: string;
  backupName: string;
  backupType: BackupType;
  filePath?: string;
  fileSize: number;
  checksum: string;
  status: BackupStatus;
  progress: number;
  errorMessage?: string;
  startedBy?: string;
  tablesIncluded: string[];
  compressionType: CompressionType;
  retentionDays: number;
  metadata: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
}

export type BackupType = 'full' | 'incremental' | 'manual' | 'scheduled' | 'emergency';
export type BackupStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'expired';
export type CompressionType = 'none' | 'gzip' | 'zip' | 'tar';

export interface BackupConfig {
  autoBackup: boolean;
  scheduleType: 'daily' | 'weekly' | 'monthly';
  scheduleTime: string; // HH:MM format
  retentionDays: number;
  compressionType: CompressionType;
  includeFiles: boolean;
  includeDatabase: boolean;
  maxBackups: number;
  emailNotifications: boolean;
}

export interface RestoreOptions {
  backupId: string;
  restoreData: boolean;
  restoreFiles: boolean;
  restoreStructure: boolean;
  targetTables?: string[];
  confirmOverwrite: boolean;
}

export interface BackupProgress {
  backupId: string;
  currentStep: string;
  progress: number;
  totalSteps: number;
  currentStepProgress: number;
  estimatedTimeRemaining?: number;
  bytesProcessed: number;
  totalBytes: number;
}

export interface BackupValidation {
  isValid: boolean;
  checksum: string;
  fileSize: number;
  errors: string[];
  warnings: string[];
  tablesVerified: number;
  recordsVerified: number;
}

// Backup Service Class
export class BackupService {
  private static instance: BackupService;
  private currentBackup: BackupItem | null = null;
  private backupProgress: BackupProgress | null = null;
  private progressCallbacks: ((progress: BackupProgress) => void)[] = [];

  private constructor() {
    this.initializeBackupScheduler();
  }

  public static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  /**
   * Initialize backup scheduler
   * تهيئة مجدول النسخ الاحتياطية
   */
  private initializeBackupScheduler(): void {
    // Check for scheduled backups every hour
    setInterval(() => {
      this.checkScheduledBackups();
    }, 60 * 60 * 1000);

    // Initial check
    setTimeout(() => {
      this.checkScheduledBackups();
    }, 5000);
  }

  /**
   * Get backup configuration
   * الحصول على إعدادات النسخ الاحتياطي
   */
  async getBackupConfig(): Promise<BackupConfig> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'backup_config')
          .single();

        if (error || !data) {
          return this.getDefaultBackupConfig();
        }

        return JSON.parse(data.setting_value);
      } else {
        const config = localStorage.getItem('kyctrust_backup_config');
        return config ? JSON.parse(config) : this.getDefaultBackupConfig();
      }
    } catch (error) {
      console.error('Error fetching backup config:', error);
      return this.getDefaultBackupConfig();
    }
  }

  /**
   * Update backup configuration
   * تحديث إعدادات النسخ الاحتياطي
   */
  async updateBackupConfig(config: BackupConfig): Promise<void> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            setting_key: 'backup_config',
            setting_value: JSON.stringify(config),
            setting_type: 'json',
            description: 'Backup configuration settings',
            category: 'backup',
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      } else {
        localStorage.setItem('kyctrust_backup_config', JSON.stringify(config));
      }

      // Log configuration change
      await this.logBackupActivity('config_updated', { config });
    } catch (error) {
      console.error('Error updating backup config:', error);
      throw error;
    }
  }

  /**
   * Create backup
   * إنشاء نسخة احتياطية
   */
  async createBackup(
    backupType: BackupType = 'manual',
    backupName?: string,
    options: Partial<BackupItem> = {}
  ): Promise<BackupItem> {
    try {
      const currentUser = authService.getCurrentUser();
      const config = await this.getBackupConfig();
      
      const backupId = uuidv4();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const generatedName = backupName || `backup-${backupType}-${timestamp}`;

      const backup: BackupItem = {
        id: backupId,
        backupName: generatedName,
        backupType,
        fileSize: 0,
        checksum: '',
        status: 'pending',
        progress: 0,
        startedBy: currentUser?.id,
        tablesIncluded: options.tablesIncluded || await this.getDefaultTables(),
        compressionType: options.compressionType || config.compressionType,
        retentionDays: options.retentionDays || config.retentionDays,
        metadata: {
          version: '1.0',
          source: 'kyctrust_admin',
          includeFiles: config.includeFiles,
          includeDatabase: config.includeDatabase,
          ...options.metadata
        },
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + (options.retentionDays || config.retentionDays) * 24 * 60 * 60 * 1000),
        ...options
      };

      this.currentBackup = backup;

      // Save backup record
      await this.saveBackupRecord(backup);

      // Start backup process
      this.performBackup(backup);

      return backup;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  /**
   * Perform the actual backup process
   * تنفيذ عملية النسخ الاحتياطي الفعلية
   */
  private async performBackup(backup: BackupItem): Promise<void> {
    try {
      await this.updateBackupStatus(backup.id, 'running');

      this.backupProgress = {
        backupId: backup.id,
        currentStep: 'Initializing backup',
        progress: 0,
        totalSteps: 5,
        currentStepProgress: 0,
        bytesProcessed: 0,
        totalBytes: 0
      };

      this.notifyProgress();

      // Step 1: Prepare backup
      await this.updateProgress('Preparing backup...', 1, 20);
      const backupData = await this.prepareBackupData(backup);

      // Step 2: Export database
      await this.updateProgress('Exporting database...', 2, 40);
      const databaseData = await this.exportDatabase(backup.tablesIncluded);

      // Step 3: Export files (if enabled)
      await this.updateProgress('Exporting files...', 3, 60);
      const filesData = backup.metadata.includeFiles ? await this.exportFiles() : {};

      // Step 4: Compress data
      await this.updateProgress('Compressing data...', 4, 80);
      const compressedData = await this.compressBackupData({
        metadata: backupData,
        database: databaseData,
        files: filesData
      }, backup.compressionType);

      // Step 5: Finalize backup
      await this.updateProgress('Finalizing backup...', 5, 100);
      const checksum = await this.calculateChecksum(compressedData);
      const fileSize = this.getDataSize(compressedData);
      
      // Save backup file
      const filePath = await this.saveBackupFile(backup.id, compressedData);

      // Update backup record
      await this.updateBackupRecord(backup.id, {
        status: 'completed',
        progress: 100,
        fileSize,
        checksum,
        filePath,
        completedAt: new Date()
      });

      // Clean up old backups
      await this.cleanupOldBackups();

      // Log success
      await this.logBackupActivity('backup_completed', { 
        backupId: backup.id, 
        fileSize, 
        duration: Date.now() - backup.startedAt.getTime() 
      });

    } catch (error) {
      console.error('Backup process failed:', error);
      
      await this.updateBackupRecord(backup.id, {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      await this.logBackupActivity('backup_failed', { 
        backupId: backup.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });

      throw error;
    } finally {
      this.currentBackup = null;
      this.backupProgress = null;
    }
  }

  /**
   * Restore from backup
   * الاستعادة من النسخة الاحتياطية
   */
  async restoreFromBackup(options: RestoreOptions): Promise<void> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.hasPermission('backup.restore')) {
        throw new Error('صلاحية غير كافية للاستعادة');
      }

      const backup = await this.getBackupById(options.backupId);
      if (!backup) {
        throw new Error('النسخة الاحتياطية غير موجودة');
      }

      if (backup.status !== 'completed') {
        throw new Error('النسخة الاحتياطية غير مكتملة');
      }

      // Validate backup before restore
      const validation = await this.validateBackup(backup);
      if (!validation.isValid) {
        throw new Error(`النسخة الاحتياطية تالفة: ${validation.errors.join(', ')}`);
      }

      // Load backup data
      const backupData = await this.loadBackupFile(backup.filePath!);
      const decompressedData = await this.decompressBackupData(backupData, backup.compressionType);

      // Restore database
      if (options.restoreData) {
        await this.restoreDatabase(decompressedData.database, options);
      }

      // Restore files
      if (options.restoreFiles && decompressedData.files) {
        await this.restoreFiles(decompressedData.files);
      }

      // Log successful restore
      await this.logBackupActivity('restore_completed', { 
        backupId: options.backupId,
        restoredBy: currentUser.id,
        options 
      });

    } catch (error) {
      await this.logBackupActivity('restore_failed', { 
        backupId: options.backupId,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Get all backups
   * الحصول على جميع النسخ الاحتياطية
   */
  async getBackups(limit?: number, offset?: number): Promise<BackupItem[]> {
    try {
      if (supabase) {
        let query = supabase
          .from('backup_logs')
          .select('*')
          .order('started_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }
        if (offset) {
          query = query.range(offset, offset + (limit || 50) - 1);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data.map(this.mapBackupFromDB);
      } else {
        const backups = this.getStoredBackups();
        return backups
          .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
          .slice(offset || 0, (offset || 0) + (limit || 50));
      }
    } catch (error) {
      console.error('Error fetching backups:', error);
      return [];
    }
  }

  /**
   * Get backup by ID
   * الحصول على النسخة الاحتياطية بالمعرف
   */
  async getBackupById(id: string): Promise<BackupItem | null> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('backup_logs')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) return null;
        return this.mapBackupFromDB(data);
      } else {
        const backups = this.getStoredBackups();
        return backups.find(backup => backup.id === id) || null;
      }
    } catch (error) {
      console.error('Error fetching backup by ID:', error);
      return null;
    }
  }

  /**
   * Delete backup
   * حذف النسخة الاحتياطية
   */
  async deleteBackup(id: string): Promise<void> {
    try {
      const backup = await this.getBackupById(id);
      if (!backup) {
        throw new Error('النسخة الاحتياطية غير موجودة');
      }

      // Delete backup file
      if (backup.filePath) {
        await this.deleteBackupFile(backup.filePath);
      }

      // Delete backup record
      if (supabase) {
        const { error } = await supabase
          .from('backup_logs')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } else {
        const backups = this.getStoredBackups();
        const filtered = backups.filter(b => b.id !== id);
        localStorage.setItem('kyctrust_backups', JSON.stringify(filtered));
      }

      await this.logBackupActivity('backup_deleted', { backupId: id });
    } catch (error) {
      console.error('Error deleting backup:', error);
      throw error;
    }
  }

  /**
   * Validate backup integrity
   * التحقق من سلامة النسخة الاحتياطية
   */
  async validateBackup(backup: BackupItem): Promise<BackupValidation> {
    try {
      const validation: BackupValidation = {
        isValid: true,
        checksum: '',
        fileSize: 0,
        errors: [],
        warnings: [],
        tablesVerified: 0,
        recordsVerified: 0
      };

      if (!backup.filePath) {
        validation.isValid = false;
        validation.errors.push('مسار الملف غير موجود');
        return validation;
      }

      // Load and verify file
      const backupData = await this.loadBackupFile(backup.filePath);
      validation.fileSize = this.getDataSize(backupData);
      validation.checksum = await this.calculateChecksum(backupData);

      // Verify checksum
      if (validation.checksum !== backup.checksum) {
        validation.isValid = false;
        validation.errors.push('checksum غير متطابق - الملف قد يكون تالفاً');
      }

      // Verify file size
      if (Math.abs(validation.fileSize - backup.fileSize) > 1024) { // Allow 1KB difference
        validation.warnings.push('حجم الملف مختلف عن المسجل');
      }

      // Decompress and validate content
      try {
        const decompressedData = await this.decompressBackupData(backupData, backup.compressionType);
        
        if (decompressedData.database) {
          validation.tablesVerified = Object.keys(decompressedData.database).length;
          validation.recordsVerified = Object.values(decompressedData.database)
            .reduce((total, table: any) => total + (table.length || 0), 0);
        }
      } catch (error) {
        validation.isValid = false;
        validation.errors.push('فشل في إلغاء ضغط البيانات');
      }

      return validation;
    } catch (error) {
      return {
        isValid: false,
        checksum: '',
        fileSize: 0,
        errors: [`خطأ في التحقق: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
        tablesVerified: 0,
        recordsVerified: 0
      };
    }
  }

  /**
   * Subscribe to backup progress updates
   * الاشتراك في تحديثات تقدم النسخ الاحتياطي
   */
  onProgress(callback: (progress: BackupProgress) => void): () => void {
    this.progressCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.progressCallbacks.indexOf(callback);
      if (index > -1) {
        this.progressCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get current backup progress
   * الحصول على تقدم النسخ الاحتياطي الحالي
   */
  getCurrentProgress(): BackupProgress | null {
    return this.backupProgress;
  }

  /**
   * Cancel current backup
   * إلغاء النسخ الاحتياطي الحالي
   */
  async cancelCurrentBackup(): Promise<void> {
    if (this.currentBackup) {
      await this.updateBackupStatus(this.currentBackup.id, 'cancelled');
      this.currentBackup = null;
      this.backupProgress = null;
      
      await this.logBackupActivity('backup_cancelled', { 
        backupId: this.currentBackup?.id 
      });
    }
  }

  // Private helper methods
  private getDefaultBackupConfig(): BackupConfig {
    return {
      autoBackup: true,
      scheduleType: 'daily',
      scheduleTime: '02:00',
      retentionDays: 30,
      compressionType: 'gzip',
      includeFiles: true,
      includeDatabase: true,
      maxBackups: 10,
      emailNotifications: false
    };
  }

  private async getDefaultTables(): Promise<string[]> {
    return [
      'admin_users',
      'admin_sessions',
      'services',
      'payment_methods',
      'orders',
      'site_settings',
      'content_management',
      'page_templates',
      'analytics_events',
      'system_logs'
    ];
  }

  private async saveBackupRecord(backup: BackupItem): Promise<void> {
    if (supabase) {
      const { error } = await supabase
        .from('backup_logs')
        .insert({
          id: backup.id,
          backup_type: backup.backupType,
          backup_name: backup.backupName,
          file_path: backup.filePath,
          file_size: backup.fileSize,
          checksum: backup.checksum,
          status: backup.status,
          progress: backup.progress,
          error_message: backup.errorMessage,
          started_by: backup.startedBy,
          tables_included: backup.tablesIncluded,
          compression_type: backup.compressionType,
          retention_days: backup.retentionDays,
          metadata: backup.metadata,
          started_at: backup.startedAt.toISOString(),
          expires_at: backup.expiresAt?.toISOString()
        });

      if (error) throw error;
    } else {
      const backups = this.getStoredBackups();
      backups.push(backup);
      localStorage.setItem('kyctrust_backups', JSON.stringify(backups));
    }
  }

  private async updateBackupRecord(id: string, updates: Partial<BackupItem>): Promise<void> {
    if (supabase) {
      const updateData: any = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.progress !== undefined) updateData.progress = updates.progress;
      if (updates.fileSize !== undefined) updateData.file_size = updates.fileSize;
      if (updates.checksum) updateData.checksum = updates.checksum;
      if (updates.filePath) updateData.file_path = updates.filePath;
      if (updates.errorMessage) updateData.error_message = updates.errorMessage;
      if (updates.completedAt) updateData.completed_at = updates.completedAt.toISOString();

      const { error } = await supabase
        .from('backup_logs')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } else {
      const backups = this.getStoredBackups();
      const index = backups.findIndex(b => b.id === id);
      if (index !== -1) {
        backups[index] = { ...backups[index], ...updates };
        localStorage.setItem('kyctrust_backups', JSON.stringify(backups));
      }
    }
  }

  private async updateBackupStatus(id: string, status: BackupStatus): Promise<void> {
    await this.updateBackupRecord(id, { status });
  }

  private async updateProgress(step: string, stepNumber: number, progress: number): Promise<void> {
    if (this.backupProgress) {
      this.backupProgress.currentStep = step;
      this.backupProgress.progress = progress;
      this.backupProgress.currentStepProgress = stepNumber;
      this.notifyProgress();
    }

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private notifyProgress(): void {
    if (this.backupProgress) {
      this.progressCallbacks.forEach(callback => {
        try {
          callback(this.backupProgress!);
        } catch (error) {
          console.error('Error in progress callback:', error);
        }
      });
    }
  }

  private async prepareBackupData(backup: BackupItem): Promise<Record<string, any>> {
    return {
      version: '1.0',
      createdAt: backup.startedAt.toISOString(),
      backupType: backup.backupType,
      compression: backup.compressionType,
      tables: backup.tablesIncluded,
      metadata: backup.metadata
    };
  }

  private async exportDatabase(tables: string[]): Promise<Record<string, any[]>> {
    const databaseData: Record<string, any[]> = {};

    if (supabase) {
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*');

          if (error) {
            console.warn(`Failed to export table ${table}:`, error);
            databaseData[table] = [];
          } else {
            databaseData[table] = data || [];
          }
        } catch (error) {
          console.warn(`Error exporting table ${table}:`, error);
          databaseData[table] = [];
        }
      }
    } else {
      // Export from localStorage
      for (const table of tables) {
        const key = `kyctrust_${table}`;
        const data = localStorage.getItem(key);
        databaseData[table] = data ? JSON.parse(data) : [];
      }
    }

    return databaseData;
  }

  private async exportFiles(): Promise<Record<string, any>> {
    // In a real implementation, this would export actual files
    // For now, return metadata about files
    return {
      media: await this.getMediaFilesList(),
      uploads: await this.getUploadsList()
    };
  }

  private async getMediaFilesList(): Promise<any[]> {
    try {
      const mediaFiles = localStorage.getItem('kyctrust_media');
      return mediaFiles ? JSON.parse(mediaFiles) : [];
    } catch {
      return [];
    }
  }

  private async getUploadsList(): Promise<any[]> {
    // Return list of uploaded files
    return [];
  }

  private async compressBackupData(data: any, compressionType: CompressionType): Promise<string> {
    const jsonData = JSON.stringify(data);
    
    switch (compressionType) {
      case 'gzip':
        // In a real implementation, use actual gzip compression
        return btoa(jsonData);
      case 'zip':
        // In a real implementation, use actual zip compression
        return btoa(jsonData);
      default:
        return jsonData;
    }
  }

  private async decompressBackupData(data: string, compressionType: CompressionType): Promise<any> {
    switch (compressionType) {
      case 'gzip':
      case 'zip':
        // In a real implementation, use actual decompression
        return JSON.parse(atob(data));
      default:
        return JSON.parse(data);
    }
  }

  private async calculateChecksum(data: string): Promise<string> {
    // Simple checksum calculation for demo
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private getDataSize(data: string): number {
    return new Blob([data]).size;
  }

  private async saveBackupFile(backupId: string, data: string): Promise<string> {
    // In a real implementation, save to actual file system or cloud storage
    const filePath = `backups/${backupId}.backup`;
    localStorage.setItem(`backup_file_${backupId}`, data);
    return filePath;
  }

  private async loadBackupFile(filePath: string): Promise<string> {
    // In a real implementation, load from actual file system or cloud storage
    const backupId = filePath.split('/').pop()?.replace('.backup', '');
    const data = localStorage.getItem(`backup_file_${backupId}`);
    if (!data) {
      throw new Error('ملف النسخة الاحتياطية غير موجود');
    }
    return data;
  }

  private async deleteBackupFile(filePath: string): Promise<void> {
    // In a real implementation, delete from actual file system or cloud storage
    const backupId = filePath.split('/').pop()?.replace('.backup', '');
    localStorage.removeItem(`backup_file_${backupId}`);
  }

  private async restoreDatabase(databaseData: Record<string, any[]>, options: RestoreOptions): Promise<void> {
    if (!options.confirmOverwrite) {
      throw new Error('يجب تأكيد الكتابة فوق البيانات الموجودة');
    }

    if (supabase) {
      for (const [table, records] of Object.entries(databaseData)) {
        if (options.targetTables && !options.targetTables.includes(table)) {
          continue;
        }

        try {
          // Clear existing data
          await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');

          // Insert restored data
          if (records.length > 0) {
            await supabase.from(table).insert(records);
          }
        } catch (error) {
          console.error(`Error restoring table ${table}:`, error);
        }
      }
    } else {
      // Restore to localStorage
      for (const [table, records] of Object.entries(databaseData)) {
        if (options.targetTables && !options.targetTables.includes(table)) {
          continue;
        }

        const key = `kyctrust_${table}`;
        localStorage.setItem(key, JSON.stringify(records));
      }
    }
  }

  private async restoreFiles(filesData: Record<string, any>): Promise<void> {
    // In a real implementation, restore actual files
    if (filesData.media) {
      localStorage.setItem('kyctrust_media', JSON.stringify(filesData.media));
    }
  }

  private async checkScheduledBackups(): Promise<void> {
    try {
      const config = await this.getBackupConfig();
      
      if (!config.autoBackup) {
        return;
      }

      const now = new Date();
      const scheduleTime = config.scheduleTime.split(':');
      const scheduleHour = parseInt(scheduleTime[0]);
      const scheduleMinute = parseInt(scheduleTime[1]);

      const lastBackup = await this.getLastBackup();
      const shouldBackup = this.shouldCreateScheduledBackup(now, lastBackup, config);

      if (shouldBackup && now.getHours() === scheduleHour && now.getMinutes() === scheduleMinute) {
        await this.createBackup('scheduled', `scheduled-${now.toISOString().split('T')[0]}`);
      }
    } catch (error) {
      console.error('Error checking scheduled backups:', error);
    }
  }

  private async getLastBackup(): Promise<BackupItem | null> {
    const backups = await this.getBackups(1);
    return backups.length > 0 ? backups[0] : null;
  }

  private shouldCreateScheduledBackup(now: Date, lastBackup: BackupItem | null, config: BackupConfig): boolean {
    if (!lastBackup) {
      return true;
    }

    const lastBackupDate = lastBackup.startedAt;
    const hoursSinceLastBackup = (now.getTime() - lastBackupDate.getTime()) / (1000 * 60 * 60);

    switch (config.scheduleType) {
      case 'daily':
        return hoursSinceLastBackup >= 24;
      case 'weekly':
        return hoursSinceLastBackup >= 24 * 7;
      case 'monthly':
        return hoursSinceLastBackup >= 24 * 30;
      default:
        return false;
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      const config = await this.getBackupConfig();
      const allBackups = await this.getBackups();
      
      // Sort by date and keep only the most recent ones
      const sortedBackups = allBackups.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
      
      // Delete old backups beyond max count
      const backupsToDelete = sortedBackups.slice(config.maxBackups);
      
      for (const backup of backupsToDelete) {
        await this.deleteBackup(backup.id);
      }

      // Delete expired backups
      const now = new Date();
      const expiredBackups = allBackups.filter(backup => 
        backup.expiresAt && backup.expiresAt < now
      );

      for (const backup of expiredBackups) {
        await this.deleteBackup(backup.id);
      }
    } catch (error) {
      console.error('Error cleaning up old backups:', error);
    }
  }

  private async logBackupActivity(activity: string, metadata: any): Promise<void> {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (supabase) {
        await supabase
          .from('analytics_events')
          .insert({
            event_type: activity,
            event_category: 'backup',
            user_id: currentUser?.id,
            metadata,
            page_url: window.location.href,
          });
      }
    } catch (error) {
      console.error('Failed to log backup activity:', error);
    }
  }

  private mapBackupFromDB(data: any): BackupItem {
    return {
      id: data.id,
      backupName: data.backup_name,
      backupType: data.backup_type,
      filePath: data.file_path,
      fileSize: data.file_size,
      checksum: data.checksum,
      status: data.status,
      progress: data.progress,
      errorMessage: data.error_message,
      startedBy: data.started_by,
      tablesIncluded: data.tables_included || [],
      compressionType: data.compression_type,
      retentionDays: data.retention_days,
      metadata: data.metadata || {},
      startedAt: new Date(data.started_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
    };
  }

  private getStoredBackups(): BackupItem[] {
    try {
      const backups = localStorage.getItem('kyctrust_backups');
      return backups ? JSON.parse(backups).map((backup: any) => ({
        ...backup,
        startedAt: new Date(backup.startedAt),
        completedAt: backup.completedAt ? new Date(backup.completedAt) : undefined,
        expiresAt: backup.expiresAt ? new Date(backup.expiresAt) : undefined,
      })) : [];
    } catch {
      return [];
    }
  }
}

// Export singleton instance
export const backupService = BackupService.getInstance();
export default backupService;
