/**
 * Advanced API Service
 * خدمة API المتقدمة
 * 
 * Comprehensive API management for data operations
 * إدارة شاملة لواجهة برمجة التطبيقات لعمليات البيانات
 */

import { supabase } from '../lib/supabase';
import { authService } from './authService';

// Types and Interfaces
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
  dateFrom?: string;
  dateTo?: string;
}

export interface BulkOperation {
  operation: 'create' | 'update' | 'delete';
  table: string;
  data: any[];
  batchSize?: number;
}

export interface APIMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastRequestTime?: Date;
  errorRate: number;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache entries
  strategy: 'lru' | 'fifo' | 'ttl';
}

// API Service Class
export class APIService {
  private static instance: APIService;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private metrics: APIMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    errorRate: 0
  };
  private requestTimes: number[] = [];

  private defaultConfig: CacheConfig = {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    strategy: 'lru'
  };

  private constructor() {
    this.initializeInterceptors();
    this.startCacheCleanup();
  }

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  /**
   * Initialize API interceptors
   * تهيئة اعتراضات API
   */
  private initializeInterceptors(): void {
    // Request interceptor
    this.addRequestInterceptor((request: APIRequest) => {
      const user = authService.getCurrentUser();
      if (user) {
        request.headers = {
          ...request.headers,
          'Authorization': `Bearer ${authService.getCurrentSession()?.sessionToken}`,
          'X-User-ID': user.id
        };
      }
      return request;
    });

    // Response interceptor
    this.addResponseInterceptor((response: APIResponse) => {
      this.updateMetrics(true);
      return response;
    }, (error: any) => {
      this.updateMetrics(false);
      return this.handleError(error);
    });
  }

  /**
   * Generic API request method
   * طريقة طلب API عامة
   */
  async request<T = any>(apiRequest: APIRequest): Promise<APIResponse<T>> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      if (apiRequest.method === 'GET') {
        const cached = this.getFromCache(apiRequest.endpoint);
        if (cached) {
          return { success: true, data: cached };
        }
      }

      // Apply request interceptors
      const processedRequest = this.applyRequestInterceptors(apiRequest);

      // Make the actual request
      const response = await this.executeRequest<T>(processedRequest);

      // Cache GET responses
      if (apiRequest.method === 'GET' && response.success) {
        this.setCache(apiRequest.endpoint, response.data);
      }

      // Apply response interceptors
      return this.applyResponseInterceptors(response);

    } catch (error) {
      return this.handleError(error);
    } finally {
      const endTime = Date.now();
      this.recordRequestTime(endTime - startTime);
    }
  }

  /**
   * GET request
   * طلب GET
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'GET',
      endpoint,
      params
    });
  }

  /**
   * POST request
   * طلب POST
   */
  async post<T = any>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'POST',
      endpoint,
      data
    });
  }

  /**
   * PUT request
   * طلب PUT
   */
  async put<T = any>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      endpoint,
      data
    });
  }

  /**
   * DELETE request
   * طلب DELETE
   */
  async delete<T = any>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      endpoint
    });
  }

  /**
   * PATCH request
   * طلب PATCH
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      endpoint,
      data
    });
  }

  /**
   * Get paginated data
   * الحصول على البيانات مع ترقيم الصفحات
   */
  async getPaginated<T = any>(
    endpoint: string, 
    pagination: PaginationParams = {},
    filters: FilterParams = {}
  ): Promise<APIResponse<T[]>> {
    const params = {
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      sortBy: pagination.sortBy || 'created_at',
      sortOrder: pagination.sortOrder || 'desc',
      ...filters
    };

    return this.get<T[]>(endpoint, params);
  }

  /**
   * Bulk operations
   * العمليات المجمعة
   */
  async bulkOperation(operation: BulkOperation): Promise<APIResponse<any>> {
    try {
      const batchSize = operation.batchSize || 100;
      const batches = this.chunkArray(operation.data, batchSize);
      const results = [];

      for (const batch of batches) {
        let batchResult;
        
        switch (operation.operation) {
          case 'create':
            batchResult = await this.bulkCreate(operation.table, batch);
            break;
          case 'update':
            batchResult = await this.bulkUpdate(operation.table, batch);
            break;
          case 'delete':
            batchResult = await this.bulkDelete(operation.table, batch);
            break;
          default:
            throw new Error('عملية غير مدعومة');
        }

        results.push(batchResult);
      }

      return {
        success: true,
        data: results,
        message: `تم تنفيذ ${operation.operation} على ${operation.data.length} عنصر بنجاح`
      };

    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Upload file
   * رفع ملف
   */
  async uploadFile(file: File, folder?: string): Promise<APIResponse<{ url: string; filename: string }>> {
    try {
      if (!supabase) {
        // Fallback for local development
        const url = URL.createObjectURL(file);
        return {
          success: true,
          data: {
            url,
            filename: file.name
          }
        };
      }

      const filename = `${Date.now()}_${file.name}`;
      const filePath = folder ? `${folder}/${filename}` : filename;

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      return {
        success: true,
        data: {
          url: urlData.publicUrl,
          filename: data.path
        }
      };

    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Download file
   * تحميل ملف
   */
  async downloadFile(filePath: string): Promise<APIResponse<Blob>> {
    try {
      if (!supabase) {
        throw new Error('تحميل الملفات غير متاح في الوضع المحلي');
      }

      const { data, error } = await supabase.storage
        .from('uploads')
        .download(filePath);

      if (error) throw error;

      return {
        success: true,
        data
      };

    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get database statistics
   * الحصول على إحصائيات قاعدة البيانات
   */
  async getDatabaseStats(): Promise<APIResponse<Record<string, any>>> {
    try {
      const stats: Record<string, any> = {};
      
      const tables = [
        'admin_users',
        'services', 
        'orders', 
        'payment_methods',
        'content_management',
        'analytics_events'
      ];

      if (supabase) {
        for (const table of tables) {
          try {
            const { count, error } = await supabase
              .from(table)
              .select('*', { count: 'exact', head: true });

            if (!error) {
              stats[table] = count || 0;
            }
          } catch (error) {
            stats[table] = 0;
          }
        }
      } else {
        // Fallback for localStorage
        for (const table of tables) {
          const data = localStorage.getItem(`kyctrust_${table}`);
          const items = data ? JSON.parse(data) : [];
          stats[table] = Array.isArray(items) ? items.length : 0;
        }
      }

      return {
        success: true,
        data: stats
      };

    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Health check
   * فحص صحة النظام
   */
  async healthCheck(): Promise<APIResponse<{ status: string; timestamp: string; version: string }>> {
    try {
      const startTime = Date.now();
      
      // Test database connectivity
      let dbStatus = 'unknown';
      if (supabase) {
        try {
          const { error } = await supabase
            .from('site_settings')
            .select('id')
            .limit(1);
          
          dbStatus = error ? 'error' : 'ok';
        } catch {
          dbStatus = 'error';
        }
      } else {
        dbStatus = 'local';
      }

      const responseTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          status: dbStatus === 'ok' || dbStatus === 'local' ? 'healthy' : 'degraded',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          database: dbStatus,
          responseTime: `${responseTime}ms`
        }
      };

    } catch (error) {
      return {
        success: false,
        error: 'فشل في فحص صحة النظام',
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      };
    }
  }

  /**
   * Get API metrics
   * الحصول على مقاييس API
   */
  getMetrics(): APIMetrics {
    return { ...this.metrics };
  }

  /**
   * Clear cache
   * مسح التخزين المؤقت
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Configure cache
   * تكوين التخزين المؤقت
   */
  configureCaching(config: Partial<CacheConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  // Private helper methods
  private async executeRequest<T>(request: APIRequest): Promise<APIResponse<T>> {
    if (!supabase) {
      return this.executeLocalRequest<T>(request);
    }

    try {
      let result;
      
      switch (request.method) {
        case 'GET':
          result = await this.executeSupabaseGet(request);
          break;
        case 'POST':
          result = await this.executeSupabasePost(request);
          break;
        case 'PUT':
          result = await this.executeSupabasePut(request);
          break;
        case 'DELETE':
          result = await this.executeSupabaseDelete(request);
          break;
        case 'PATCH':
          result = await this.executeSupabasePatch(request);
          break;
        default:
          throw new Error('HTTP method not supported');
      }

      return {
        success: true,
        data: result.data,
        meta: result.meta
      };

    } catch (error) {
      throw error;
    }
  }

  private async executeSupabaseGet(request: APIRequest): Promise<{ data: any; meta?: any }> {
    const tableName = this.extractTableName(request.endpoint);
    let query = supabase.from(tableName).select('*');

    // Apply filters and pagination
    if (request.params) {
      query = this.applyQueryParams(query, request.params);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data,
      meta: {
        total: count,
        count: data?.length || 0
      }
    };
  }

  private async executeSupabasePost(request: APIRequest): Promise<{ data: any }> {
    const tableName = this.extractTableName(request.endpoint);
    const { data, error } = await supabase
      .from(tableName)
      .insert(request.data)
      .select();

    if (error) throw error;
    return { data };
  }

  private async executeSupabasePut(request: APIRequest): Promise<{ data: any }> {
    const { tableName, id } = this.extractTableAndId(request.endpoint);
    const { data, error } = await supabase
      .from(tableName)
      .update(request.data)
      .eq('id', id)
      .select();

    if (error) throw error;
    return { data };
  }

  private async executeSupabaseDelete(request: APIRequest): Promise<{ data: any }> {
    const { tableName, id } = this.extractTableAndId(request.endpoint);
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    return { data };
  }

  private async executeSupabasePatch(request: APIRequest): Promise<{ data: any }> {
    return this.executeSupabasePut(request);
  }

  private async executeLocalRequest<T>(request: APIRequest): Promise<APIResponse<T>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    const tableName = this.extractTableName(request.endpoint);
    const storageKey = `kyctrust_${tableName}`;

    switch (request.method) {
      case 'GET':
        return this.executeLocalGet<T>(storageKey, request);
      case 'POST':
        return this.executeLocalPost<T>(storageKey, request);
      case 'PUT':
        return this.executeLocalPut<T>(storageKey, request);
      case 'DELETE':
        return this.executeLocalDelete<T>(storageKey, request);
      default:
        throw new Error('Method not supported in local mode');
    }
  }

  private executeLocalGet<T>(storageKey: string, request: APIRequest): APIResponse<T> {
    const data = localStorage.getItem(storageKey);
    const items = data ? JSON.parse(data) : [];
    
    // Apply filtering and pagination
    let filtered = this.applyLocalFilters(items, request.params || {});
    
    return {
      success: true,
      data: filtered as T,
      meta: {
        total: items.length,
        count: filtered.length
      }
    };
  }

  private executeLocalPost<T>(storageKey: string, request: APIRequest): APIResponse<T> {
    const data = localStorage.getItem(storageKey);
    const items = data ? JSON.parse(data) : [];
    
    const newItem = {
      id: Date.now().toString(),
      ...request.data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    items.push(newItem);
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    return {
      success: true,
      data: newItem as T
    };
  }

  private executeLocalPut<T>(storageKey: string, request: APIRequest): APIResponse<T> {
    const { id } = this.extractTableAndId(request.endpoint);
    const data = localStorage.getItem(storageKey);
    const items = data ? JSON.parse(data) : [];
    
    const index = items.findIndex((item: any) => item.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    items[index] = {
      ...items[index],
      ...request.data,
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    return {
      success: true,
      data: items[index] as T
    };
  }

  private executeLocalDelete<T>(storageKey: string, request: APIRequest): APIResponse<T> {
    const { id } = this.extractTableAndId(request.endpoint);
    const data = localStorage.getItem(storageKey);
    const items = data ? JSON.parse(data) : [];
    
    const index = items.findIndex((item: any) => item.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    const deletedItem = items[index];
    items.splice(index, 1);
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    return {
      success: true,
      data: deletedItem as T
    };
  }

  private applyQueryParams(query: any, params: Record<string, any>): any {
    // Apply search
    if (params.search) {
      query = query.ilike('name', `%${params.search}%`);
    }

    // Apply filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });
    }

    // Apply date filters
    if (params.dateFrom) {
      query = query.gte('created_at', params.dateFrom);
    }
    if (params.dateTo) {
      query = query.lte('created_at', params.dateTo);
    }

    // Apply sorting
    if (params.sortBy) {
      query = query.order(params.sortBy, { 
        ascending: params.sortOrder === 'asc' 
      });
    }

    // Apply pagination
    if (params.page && params.limit) {
      const offset = (params.page - 1) * params.limit;
      query = query.range(offset, offset + params.limit - 1);
    }

    return query;
  }

  private applyLocalFilters(items: any[], params: Record<string, any>): any[] {
    let filtered = [...items];

    // Apply search
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          filtered = filtered.filter(item => item[key] === value);
        }
      });
    }

    // Apply date filters
    if (params.dateFrom) {
      filtered = filtered.filter(item => 
        new Date(item.created_at) >= new Date(params.dateFrom)
      );
    }
    if (params.dateTo) {
      filtered = filtered.filter(item => 
        new Date(item.created_at) <= new Date(params.dateTo)
      );
    }

    // Apply sorting
    if (params.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[params.sortBy];
        const bValue = b[params.sortBy];
        
        if (params.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    if (params.page && params.limit) {
      const offset = (params.page - 1) * params.limit;
      filtered = filtered.slice(offset, offset + params.limit);
    }

    return filtered;
  }

  private async bulkCreate(table: string, data: any[]): Promise<any> {
    if (supabase) {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();

      if (error) throw error;
      return result;
    } else {
      // Local implementation
      const storageKey = `kyctrust_${table}`;
      const existing = localStorage.getItem(storageKey);
      const items = existing ? JSON.parse(existing) : [];
      
      const newItems = data.map(item => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      items.push(...newItems);
      localStorage.setItem(storageKey, JSON.stringify(items));
      return newItems;
    }
  }

  private async bulkUpdate(table: string, data: any[]): Promise<any> {
    const results = [];
    
    for (const item of data) {
      try {
        const result = await this.put(`${table}/${item.id}`, item);
        results.push(result.data);
      } catch (error) {
        console.error(`Failed to update item ${item.id}:`, error);
      }
    }
    
    return results;
  }

  private async bulkDelete(table: string, ids: string[]): Promise<any> {
    const results = [];
    
    for (const id of ids) {
      try {
        const result = await this.delete(`${table}/${id}`);
        results.push(result.data);
      } catch (error) {
        console.error(`Failed to delete item ${id}:`, error);
      }
    }
    
    return results;
  }

  private extractTableName(endpoint: string): string {
    return endpoint.split('/')[0];
  }

  private extractTableAndId(endpoint: string): { tableName: string; id: string } {
    const parts = endpoint.split('/');
    return {
      tableName: parts[0],
      id: parts[1]
    };
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Caching methods
  private getFromCache(key: string): any | null {
    if (!this.defaultConfig.enabled) return null;

    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now > cached.timestamp + cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any): void {
    if (!this.defaultConfig.enabled) return;

    // Check cache size limit
    if (this.cache.size >= this.defaultConfig.maxSize) {
      this.evictCacheEntry();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: this.defaultConfig.ttl
    });
  }

  private evictCacheEntry(): void {
    switch (this.defaultConfig.strategy) {
      case 'lru':
        // Remove least recently used (first entry)
        const firstKey = this.cache.keys().next().value;
        if (firstKey) this.cache.delete(firstKey);
        break;
      case 'fifo':
        // Remove first in, first out (first entry)
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey) this.cache.delete(oldestKey);
        break;
      case 'ttl':
        // Remove expired entries
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
          if (now > value.timestamp + value.ttl) {
            this.cache.delete(key);
            break;
          }
        }
        break;
    }
  }

  private startCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.cache.entries()) {
        if (now > value.timestamp + value.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Cleanup every minute
  }

  // Interceptor methods
  private requestInterceptors: Array<(request: APIRequest) => APIRequest> = [];
  private responseInterceptors: Array<{
    fulfilled: (response: APIResponse) => APIResponse;
    rejected?: (error: any) => APIResponse;
  }> = [];

  private addRequestInterceptor(interceptor: (request: APIRequest) => APIRequest): void {
    this.requestInterceptors.push(interceptor);
  }

  private addResponseInterceptor(
    fulfilled: (response: APIResponse) => APIResponse,
    rejected?: (error: any) => APIResponse
  ): void {
    this.responseInterceptors.push({ fulfilled, rejected });
  }

  private applyRequestInterceptors(request: APIRequest): APIRequest {
    return this.requestInterceptors.reduce((req, interceptor) => {
      return interceptor(req);
    }, request);
  }

  private applyResponseInterceptors(response: APIResponse): APIResponse {
    return this.responseInterceptors.reduce((res, interceptor) => {
      return interceptor.fulfilled(res);
    }, response);
  }

  // Metrics and error handling
  private updateMetrics(success: boolean): void {
    this.metrics.totalRequests++;
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }
    this.metrics.errorRate = this.metrics.failedRequests / this.metrics.totalRequests;
    this.metrics.lastRequestTime = new Date();
  }

  private recordRequestTime(duration: number): void {
    this.requestTimes.push(duration);
    
    // Keep only last 100 request times
    if (this.requestTimes.length > 100) {
      this.requestTimes.shift();
    }
    
    // Calculate average
    this.metrics.averageResponseTime = 
      this.requestTimes.reduce((sum, time) => sum + time, 0) / this.requestTimes.length;
  }

  private handleError(error: any): APIResponse {
    console.error('API Error:', error);
    
    let errorMessage = 'حدث خطأ غير متوقع';
    
    if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

// Export singleton instance
export const apiService = APIService.getInstance();
export default apiService;
