/**
 * Advanced Content Management Service
 * خدمة إدارة المحتوى المتقدمة
 * 
 * Comprehensive content and page management system
 * نظام شامل لإدارة المحتوى والصفحات
 */

import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Types and Interfaces
export interface ContentItem {
  id: string;
  contentKey: string;
  contentType: ContentType;
  title?: string;
  titleAr?: string;
  content: Record<string, any>;
  images: string[];
  metadata: Record<string, any>;
  seoData: SEOData;
  isPublished: boolean;
  publishDate?: Date;
  expireDate?: Date;
  version: number;
  parentId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ContentType = 
  | 'hero' 
  | 'about' 
  | 'services' 
  | 'contact' 
  | 'footer' 
  | 'navigation'
  | 'page'
  | 'component'
  | 'section'
  | 'blog'
  | 'news'
  | 'faq'
  | 'testimonial'
  | 'team';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  robots?: string;
  schema?: Record<string, any>;
}

export interface PageTemplate {
  id: string;
  templateName: string;
  templateNameAr: string;
  description?: string;
  descriptionAr?: string;
  templateType: TemplateType;
  templateData: Record<string, any>;
  previewImage?: string;
  category: string;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  usageCount: number;
  createdBy?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateType = 'page' | 'component' | 'section' | 'layout' | 'widget';

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  content: Record<string, any>;
  createdBy?: string;
  createdAt: Date;
  changeNote?: string;
}

export interface ContentFilter {
  contentType?: ContentType;
  isPublished?: boolean;
  search?: string;
  createdBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'title' | 'contentType' | 'createdAt' | 'updatedAt' | 'publishDate';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  description?: string;
  tags: string[];
  folder?: string;
  uploadedBy?: string;
  createdAt: Date;
}

// Content Management Service Class
export class ContentManagementService {
  private static instance: ContentManagementService;

  private constructor() {}

  public static getInstance(): ContentManagementService {
    if (!ContentManagementService.instance) {
      ContentManagementService.instance = new ContentManagementService();
    }
    return ContentManagementService.instance;
  }

  /**
   * Get all content items with filtering
   * الحصول على جميع عناصر المحتوى مع التصفية
   */
  async getContentItems(filter: ContentFilter = {}): Promise<ContentItem[]> {
    try {
      if (supabase) {
        let query = supabase
          .from('content_management')
          .select('*');

        // Apply filters
        if (filter.contentType) {
          query = query.eq('content_type', filter.contentType);
        }
        if (filter.isPublished !== undefined) {
          query = query.eq('is_published', filter.isPublished);
        }
        if (filter.search) {
          query = query.or(`title.ilike.%${filter.search}%,title_ar.ilike.%${filter.search}%,content_key.ilike.%${filter.search}%`);
        }
        if (filter.createdBy) {
          query = query.eq('created_by', filter.createdBy);
        }
        if (filter.dateFrom) {
          query = query.gte('created_at', filter.dateFrom.toISOString());
        }
        if (filter.dateTo) {
          query = query.lte('created_at', filter.dateTo.toISOString());
        }

        // Apply sorting
        const sortBy = filter.sortBy || 'updated_at';
        const sortOrder = filter.sortOrder || 'desc';
        query = query.order(this.mapSortField(sortBy), { ascending: sortOrder === 'asc' });

        // Apply pagination
        if (filter.limit) {
          query = query.limit(filter.limit);
        }
        if (filter.offset) {
          query = query.range(filter.offset, filter.offset + (filter.limit || 50) - 1);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data.map(this.mapContentFromDB);
      } else {
        // Fallback to localStorage
        const content = this.getStoredContent();
        return this.applyLocalFilters(content, filter);
      }
    } catch (error) {
      console.error('Error fetching content items:', error);
      throw error;
    }
  }

  /**
   * Get content item by ID
   * الحصول على عنصر المحتوى بالمعرف
   */
  async getContentById(id: string): Promise<ContentItem | null> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('content_management')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data ? this.mapContentFromDB(data) : null;
      } else {
        const content = this.getStoredContent();
        return content.find(item => item.id === id) || null;
      }
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      return null;
    }
  }

  /**
   * Get content item by key
   * الحصول على عنصر المحتوى بالمفتاح
   */
  async getContentByKey(contentKey: string): Promise<ContentItem | null> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('content_management')
          .select('*')
          .eq('content_key', contentKey)
          .eq('is_published', true)
          .single();

        if (error) throw error;
        return data ? this.mapContentFromDB(data) : null;
      } else {
        const content = this.getStoredContent();
        return content.find(item => item.contentKey === contentKey && item.isPublished) || null;
      }
    } catch (error) {
      console.error('Error fetching content by key:', error);
      return null;
    }
  }

  /**
   * Create new content item
   * إنشاء عنصر محتوى جديد
   */
  async createContent(contentData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<ContentItem> {
    try {
      const id = uuidv4();
      const now = new Date();
      
      const newContent: ContentItem = {
        ...contentData,
        id,
        version: 1,
        createdAt: now,
        updatedAt: now,
      };

      if (supabase) {
        const { data, error } = await supabase
          .from('content_management')
          .insert({
            id: newContent.id,
            content_key: newContent.contentKey,
            content_type: newContent.contentType,
            title: newContent.title,
            title_ar: newContent.titleAr,
            content: newContent.content,
            images: newContent.images,
            metadata: newContent.metadata,
            seo_data: newContent.seoData,
            is_published: newContent.isPublished,
            publish_date: newContent.publishDate?.toISOString(),
            expire_date: newContent.expireDate?.toISOString(),
            version: newContent.version,
            parent_id: newContent.parentId,
            created_by: newContent.createdBy,
            updated_by: newContent.updatedBy,
          })
          .select()
          .single();

        if (error) throw error;
        
        // Create version history
        await this.createContentVersion(newContent.id, newContent.content, newContent.createdBy, 'Initial version');
        
        return this.mapContentFromDB(data);
      } else {
        // Fallback to localStorage
        const content = this.getStoredContent();
        content.push(newContent);
        localStorage.setItem('kyctrust_content', JSON.stringify(content));
        return newContent;
      }
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  }

  /**
   * Update content item
   * تحديث عنصر المحتوى
   */
  async updateContent(id: string, updates: Partial<ContentItem>, userId?: string, changeNote?: string): Promise<ContentItem> {
    try {
      const existingContent = await this.getContentById(id);
      if (!existingContent) {
        throw new Error('Content item not found');
      }

      const updatedContent = {
        ...existingContent,
        ...updates,
        version: existingContent.version + 1,
        updatedBy: userId,
        updatedAt: new Date(),
      };

      if (supabase) {
        const { data, error } = await supabase
          .from('content_management')
          .update({
            content_key: updatedContent.contentKey,
            content_type: updatedContent.contentType,
            title: updatedContent.title,
            title_ar: updatedContent.titleAr,
            content: updatedContent.content,
            images: updatedContent.images,
            metadata: updatedContent.metadata,
            seo_data: updatedContent.seoData,
            is_published: updatedContent.isPublished,
            publish_date: updatedContent.publishDate?.toISOString(),
            expire_date: updatedContent.expireDate?.toISOString(),
            version: updatedContent.version,
            parent_id: updatedContent.parentId,
            updated_by: updatedContent.updatedBy,
            updated_at: updatedContent.updatedAt.toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        // Create version history if content changed
        if (updates.content) {
          await this.createContentVersion(id, updatedContent.content, userId, changeNote);
        }

        return this.mapContentFromDB(data);
      } else {
        // Fallback to localStorage
        const content = this.getStoredContent();
        const index = content.findIndex(item => item.id === id);
        if (index !== -1) {
          content[index] = updatedContent;
          localStorage.setItem('kyctrust_content', JSON.stringify(content));
        }
        return updatedContent;
      }
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  }

  /**
   * Delete content item
   * حذف عنصر المحتوى
   */
  async deleteContent(id: string): Promise<void> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('content_management')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } else {
        // Fallback to localStorage
        const content = this.getStoredContent();
        const filtered = content.filter(item => item.id !== id);
        localStorage.setItem('kyctrust_content', JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }

  /**
   * Duplicate content item
   * نسخ عنصر المحتوى
   */
  async duplicateContent(id: string, newKey?: string, userId?: string): Promise<ContentItem> {
    try {
      const originalContent = await this.getContentById(id);
      if (!originalContent) {
        throw new Error('Content item not found');
      }

      const duplicatedContent = {
        ...originalContent,
        contentKey: newKey || `${originalContent.contentKey}_copy`,
        title: `${originalContent.title} (نسخة)`,
        titleAr: `${originalContent.titleAr} (نسخة)`,
        isPublished: false,
        createdBy: userId,
        updatedBy: userId,
      };

      delete (duplicatedContent as any).id;
      delete (duplicatedContent as any).createdAt;
      delete (duplicatedContent as any).updatedAt;
      delete (duplicatedContent as any).version;

      return await this.createContent(duplicatedContent);
    } catch (error) {
      console.error('Error duplicating content:', error);
      throw error;
    }
  }

  /**
   * Publish/Unpublish content
   * نشر/إلغاء نشر المحتوى
   */
  async toggleContentPublish(id: string, isPublished: boolean, userId?: string): Promise<ContentItem> {
    try {
      const publishDate = isPublished ? new Date() : undefined;
      
      return await this.updateContent(id, { 
        isPublished, 
        publishDate 
      }, userId, `Content ${isPublished ? 'published' : 'unpublished'}`);
    } catch (error) {
      console.error('Error toggling content publish status:', error);
      throw error;
    }
  }

  /**
   * Get content version history
   * الحصول على تاريخ إصدارات المحتوى
   */
  async getContentVersions(contentId: string): Promise<ContentVersion[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('content_versions')
          .select('*')
          .eq('content_id', contentId)
          .order('version', { ascending: false });

        if (error) throw error;
        return data.map(this.mapVersionFromDB);
      } else {
        // Fallback to localStorage
        const versions = this.getStoredVersions();
        return versions
          .filter(v => v.contentId === contentId)
          .sort((a, b) => b.version - a.version);
      }
    } catch (error) {
      console.error('Error fetching content versions:', error);
      return [];
    }
  }

  /**
   * Restore content from version
   * استعادة المحتوى من إصدار
   */
  async restoreContentVersion(contentId: string, version: number, userId?: string): Promise<ContentItem> {
    try {
      const versions = await this.getContentVersions(contentId);
      const targetVersion = versions.find(v => v.version === version);
      
      if (!targetVersion) {
        throw new Error('Version not found');
      }

      return await this.updateContent(
        contentId, 
        { content: targetVersion.content }, 
        userId, 
        `Restored from version ${version}`
      );
    } catch (error) {
      console.error('Error restoring content version:', error);
      throw error;
    }
  }

  /**
   * Get page templates
   * الحصول على قوالب الصفحات
   */
  async getPageTemplates(category?: string, isActive?: boolean): Promise<PageTemplate[]> {
    try {
      if (supabase) {
        let query = supabase
          .from('page_templates')
          .select('*');

        if (category) {
          query = query.eq('category', category);
        }
        if (isActive !== undefined) {
          query = query.eq('is_active', isActive);
        }

        query = query.order('sort_order', { ascending: true });

        const { data, error } = await query;
        if (error) throw error;

        return data.map(this.mapTemplateFromDB);
      } else {
        // Fallback to localStorage
        const templates = this.getStoredTemplates();
        return templates.filter(t => 
          (!category || t.category === category) &&
          (isActive === undefined || t.isActive === isActive)
        ).sort((a, b) => a.sortOrder - b.sortOrder);
      }
    } catch (error) {
      console.error('Error fetching page templates:', error);
      return [];
    }
  }

  /**
   * Create page template
   * إنشاء قالب صفحة
   */
  async createPageTemplate(templateData: Omit<PageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<PageTemplate> {
    try {
      const id = uuidv4();
      const now = new Date();
      
      const newTemplate: PageTemplate = {
        ...templateData,
        id,
        usageCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      if (supabase) {
        const { data, error } = await supabase
          .from('page_templates')
          .insert({
            id: newTemplate.id,
            template_name: newTemplate.templateName,
            template_name_ar: newTemplate.templateNameAr,
            description: newTemplate.description,
            description_ar: newTemplate.descriptionAr,
            template_type: newTemplate.templateType,
            template_data: newTemplate.templateData,
            preview_image: newTemplate.previewImage,
            category: newTemplate.category,
            is_default: newTemplate.isDefault,
            is_active: newTemplate.isActive,
            sort_order: newTemplate.sortOrder,
            usage_count: newTemplate.usageCount,
            created_by: newTemplate.createdBy,
            metadata: newTemplate.metadata,
          })
          .select()
          .single();

        if (error) throw error;
        return this.mapTemplateFromDB(data);
      } else {
        // Fallback to localStorage
        const templates = this.getStoredTemplates();
        templates.push(newTemplate);
        localStorage.setItem('kyctrust_templates', JSON.stringify(templates));
        return newTemplate;
      }
    } catch (error) {
      console.error('Error creating page template:', error);
      throw error;
    }
  }

  /**
   * Upload media file
   * رفع ملف وسائط
   */
  async uploadMedia(file: File, folder?: string, userId?: string): Promise<MediaFile> {
    try {
      const id = uuidv4();
      const filename = `${id}_${file.name}`;
      const url = `https://example.com/media/${filename}`; // This would be actual upload logic
      
      const mediaFile: MediaFile = {
        id,
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url,
        folder: folder || 'uploads',
        tags: [],
        uploadedBy: userId,
        createdAt: new Date(),
      };

      // Store in localStorage for demo
      const mediaFiles = this.getStoredMediaFiles();
      mediaFiles.push(mediaFile);
      localStorage.setItem('kyctrust_media', JSON.stringify(mediaFiles));

      return mediaFile;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  /**
   * Get media files
   * الحصول على ملفات الوسائط
   */
  async getMediaFiles(folder?: string): Promise<MediaFile[]> {
    try {
      const mediaFiles = this.getStoredMediaFiles();
      return mediaFiles.filter(file => !folder || file.folder === folder);
    } catch (error) {
      console.error('Error fetching media files:', error);
      return [];
    }
  }

  /**
   * Generate SEO-friendly URL slug
   * توليد رابط صديق لمحركات البحث
   */
  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  /**
   * Validate content data
   * التحقق من صحة بيانات المحتوى
   */
  validateContentData(contentData: Partial<ContentItem>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!contentData.contentKey) {
      errors.push('مفتاح المحتوى مطلوب');
    }

    if (!contentData.contentType) {
      errors.push('نوع المحتوى مطلوب');
    }

    if (!contentData.content || Object.keys(contentData.content).length === 0) {
      errors.push('محتوى البيانات مطلوب');
    }

    // Validate SEO data
    if (contentData.seoData) {
      if (contentData.seoData.title && contentData.seoData.title.length > 60) {
        errors.push('عنوان SEO يجب أن يكون أقل من 60 حرف');
      }
      if (contentData.seoData.description && contentData.seoData.description.length > 160) {
        errors.push('وصف SEO يجب أن يكون أقل من 160 حرف');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Private helper methods
  private async createContentVersion(contentId: string, content: Record<string, any>, userId?: string, changeNote?: string): Promise<void> {
    try {
      const versions = await this.getContentVersions(contentId);
      const newVersion = versions.length > 0 ? Math.max(...versions.map(v => v.version)) + 1 : 1;
      
      const version: ContentVersion = {
        id: uuidv4(),
        contentId,
        version: newVersion,
        content,
        createdBy: userId,
        createdAt: new Date(),
        changeNote,
      };

      if (supabase) {
        await supabase
          .from('content_versions')
          .insert({
            id: version.id,
            content_id: version.contentId,
            version: version.version,
            content: version.content,
            created_by: version.createdBy,
            change_note: version.changeNote,
          });
      } else {
        const versions = this.getStoredVersions();
        versions.push(version);
        localStorage.setItem('kyctrust_content_versions', JSON.stringify(versions));
      }
    } catch (error) {
      console.error('Error creating content version:', error);
    }
  }

  private mapSortField(sortBy: string): string {
    const fieldMap: Record<string, string> = {
      'title': 'title',
      'contentType': 'content_type',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at',
      'publishDate': 'publish_date',
    };
    return fieldMap[sortBy] || 'updated_at';
  }

  private applyLocalFilters(content: ContentItem[], filter: ContentFilter): ContentItem[] {
    let filtered = [...content];

    if (filter.contentType) {
      filtered = filtered.filter(item => item.contentType === filter.contentType);
    }
    if (filter.isPublished !== undefined) {
      filtered = filtered.filter(item => item.isPublished === filter.isPublished);
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchLower) ||
        item.titleAr?.toLowerCase().includes(searchLower) ||
        item.contentKey.toLowerCase().includes(searchLower)
      );
    }
    if (filter.createdBy) {
      filtered = filtered.filter(item => item.createdBy === filter.createdBy);
    }
    if (filter.dateFrom) {
      filtered = filtered.filter(item => item.createdAt >= filter.dateFrom!);
    }
    if (filter.dateTo) {
      filtered = filtered.filter(item => item.createdAt <= filter.dateTo!);
    }

    // Apply sorting
    const sortBy = filter.sortBy || 'updatedAt';
    const sortOrder = filter.sortOrder || 'desc';
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title || '';
          bValue = b.title || '';
          break;
        case 'contentType':
          aValue = a.contentType;
          bValue = b.contentType;
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'updatedAt':
          aValue = a.updatedAt;
          bValue = b.updatedAt;
          break;
        case 'publishDate':
          aValue = a.publishDate || new Date(0);
          bValue = b.publishDate || new Date(0);
          break;
        default:
          aValue = a.updatedAt;
          bValue = b.updatedAt;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply pagination
    if (filter.offset || filter.limit) {
      const start = filter.offset || 0;
      const end = start + (filter.limit || 50);
      filtered = filtered.slice(start, end);
    }

    return filtered;
  }

  private mapContentFromDB(data: any): ContentItem {
    return {
      id: data.id,
      contentKey: data.content_key,
      contentType: data.content_type,
      title: data.title,
      titleAr: data.title_ar,
      content: data.content || {},
      images: data.images || [],
      metadata: data.metadata || {},
      seoData: data.seo_data || {},
      isPublished: data.is_published,
      publishDate: data.publish_date ? new Date(data.publish_date) : undefined,
      expireDate: data.expire_date ? new Date(data.expire_date) : undefined,
      version: data.version,
      parentId: data.parent_id,
      createdBy: data.created_by,
      updatedBy: data.updated_by,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private mapTemplateFromDB(data: any): PageTemplate {
    return {
      id: data.id,
      templateName: data.template_name,
      templateNameAr: data.template_name_ar,
      description: data.description,
      descriptionAr: data.description_ar,
      templateType: data.template_type,
      templateData: data.template_data || {},
      previewImage: data.preview_image,
      category: data.category,
      isDefault: data.is_default,
      isActive: data.is_active,
      sortOrder: data.sort_order,
      usageCount: data.usage_count,
      createdBy: data.created_by,
      metadata: data.metadata || {},
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private mapVersionFromDB(data: any): ContentVersion {
    return {
      id: data.id,
      contentId: data.content_id,
      version: data.version,
      content: data.content || {},
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      changeNote: data.change_note,
    };
  }

  private getStoredContent(): ContentItem[] {
    try {
      const content = localStorage.getItem('kyctrust_content');
      return content ? JSON.parse(content) : [];
    } catch {
      return [];
    }
  }

  private getStoredTemplates(): PageTemplate[] {
    try {
      const templates = localStorage.getItem('kyctrust_templates');
      return templates ? JSON.parse(templates) : [];
    } catch {
      return [];
    }
  }

  private getStoredVersions(): ContentVersion[] {
    try {
      const versions = localStorage.getItem('kyctrust_content_versions');
      return versions ? JSON.parse(versions) : [];
    } catch {
      return [];
    }
  }

  private getStoredMediaFiles(): MediaFile[] {
    try {
      const mediaFiles = localStorage.getItem('kyctrust_media');
      return mediaFiles ? JSON.parse(mediaFiles) : [];
    } catch {
      return [];
    }
  }
}

// Export singleton instance
export const contentManagementService = ContentManagementService.getInstance();
export default contentManagementService;
