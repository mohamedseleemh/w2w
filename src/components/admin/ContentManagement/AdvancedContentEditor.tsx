/**
 * Advanced Content Editor Component
 * مكون محرر المحتوى المتقدم
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ContentItem, 
  ContentType, 
  SEOData, 
  PageTemplate,
  contentManagementService,
  ContentFilter 
} from '../../../services/contentManagementService';
import { authService } from '../../../services/authService';

interface AdvancedContentEditorProps {
  contentId?: string;
  contentType?: ContentType;
  onSave?: (content: ContentItem) => void;
  onCancel?: () => void;
}

const AdvancedContentEditor: React.FC<AdvancedContentEditorProps> = ({
  contentId,
  contentType = 'page',
  onSave,
  onCancel
}) => {
  // State management
  const [content, setContent] = useState<Partial<ContentItem>>({
    contentKey: '',
    contentType,
    title: '',
    titleAr: '',
    content: {},
    images: [],
    metadata: {},
    seoData: {},
    isPublished: false,
  });

  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings' | 'preview'>('content');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Content sections state
  const [sections, setSections] = useState<Record<string, any>>({
    hero: {
      heading: '',
      subheading: '',
      ctaText: '',
      backgroundImage: '',
      enabled: false
    },
    about: {
      title: '',
      description: '',
      features: [],
      enabled: false
    },
    services: {
      title: '',
      description: '',
      services: [],
      enabled: false
    },
    contact: {
      title: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      enabled: false
    },
    footer: {
      companyName: '',
      description: '',
      socialLinks: {},
      quickLinks: [],
      enabled: false
    }
  });

  // SEO state
  const [seoData, setSeoData] = useState<SEOData>({
    title: '',
    description: '',
    keywords: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    robots: 'index,follow',
  });

  // Load content on mount
  useEffect(() => {
    if (contentId) {
      loadContent();
    }
    loadTemplates();
  }, [contentId]);

  /**
   * Load existing content for editing
   * تحميل المحتوى الموجود للتحرير
   */
  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const existingContent = await contentManagementService.getContentById(contentId!);
      if (existingContent) {
        setContent(existingContent);
        setSections({ ...sections, ...existingContent.content });
        setSeoData({ ...seoData, ...existingContent.seoData });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تحميل المحتوى');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load available templates
   * تحميل القوالب المتاحة
   */
  const loadTemplates = async () => {
    try {
      const availableTemplates = await contentManagementService.getPageTemplates();
      setTemplates(availableTemplates);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  /**
   * Apply template to content
   * تطبيق القالب على المحتوى
   */
  const applyTemplate = (template: PageTemplate) => {
    setSelectedTemplate(template);
    setSections({ ...sections, ...template.templateData });
    setContent(prev => ({
      ...prev,
      content: { ...prev.content, ...template.templateData }
    }));
  };

  /**
   * Update content section
   * تحديث قسم المحتوى
   */
  const updateSection = useCallback((sectionKey: string, sectionData: any) => {
    const updatedSections = {
      ...sections,
      [sectionKey]: {
        ...sections[sectionKey],
        ...sectionData
      }
    };
    
    setSections(updatedSections);
    setContent(prev => ({
      ...prev,
      content: updatedSections
    }));
  }, [sections]);

  /**
   * Update SEO data
   * تحديث بيانات SEO
   */
  const updateSeoData = useCallback((field: keyof SEOData, value: any) => {
    const updatedSeo = {
      ...seoData,
      [field]: value
    };
    
    setSeoData(updatedSeo);
    setContent(prev => ({
      ...prev,
      seoData: updatedSeo
    }));
  }, [seoData]);

  /**
   * Save content
   * حفظ المحتوى
   */
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const currentUser = authService.getCurrentUser();
      
      // Validate content
      const validation = contentManagementService.validateContentData(content);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      let savedContent: ContentItem;
      
      if (contentId) {
        // Update existing content
        savedContent = await contentManagementService.updateContent(
          contentId, 
          content, 
          currentUser?.id,
          'Content updated via editor'
        );
      } else {
        // Create new content
        savedContent = await contentManagementService.createContent({
          ...content,
          createdBy: currentUser?.id,
          updatedBy: currentUser?.id,
        } as ContentItem);
      }

      onSave?.(savedContent);
      alert('تم حفظ المحتوى بنجاح');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في حفظ المحتوى');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Preview content
   * معاينة المحتوى
   */
  const renderPreview = () => {
    return (
      <div className="space-y-8 p-6 bg-gray-50 rounded-lg">
        {/* Hero Section Preview */}
        {sections.hero?.enabled && (
          <div className="bg-blue-600 text-white p-8 rounded-lg">
            <h1 className="text-3xl font-bold mb-4">{sections.hero.heading}</h1>
            <p className="text-xl mb-6">{sections.hero.subheading}</p>
            {sections.hero.ctaText && (
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
                {sections.hero.ctaText}
              </button>
            )}
          </div>
        )}

        {/* About Section Preview */}
        {sections.about?.enabled && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">{sections.about.title}</h2>
            <p className="text-gray-600 mb-4">{sections.about.description}</p>
            {sections.about.features?.length > 0 && (
              <ul className="list-disc list-inside space-y-2">
                {sections.about.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Services Section Preview */}
        {sections.services?.enabled && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">{sections.services.title}</h2>
            <p className="text-gray-600 mb-4">{sections.services.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.services.services?.map((service: any, index: number) => (
                <div key={index} className="border p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <p className="font-bold text-blue-600 mt-2">{service.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Section Preview */}
        {sections.contact?.enabled && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">{sections.contact.title}</h2>
            <p className="text-gray-600 mb-4">{sections.contact.description}</p>
            <div className="space-y-2">
              {sections.contact.email && <p>البريد الإلكتروني: {sections.contact.email}</p>}
              {sections.contact.phone && <p>الهاتف: {sections.contact.phone}</p>}
              {sections.contact.address && <p>العنوان: {sections.contact.address}</p>}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="mr-2">تحميل المحرر...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col" dir="rtl">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {contentId ? 'تحرير المحتوى' : 'إنشاء محتوى جديد'}
            </h2>
            <p className="text-gray-600 mt-1">
              {content.title || 'محتوى جديد'}
            </p>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              disabled={saving}
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 space-x-reverse px-6">
          {[
            { key: 'content', label: 'المحتوى' },
            { key: 'seo', label: 'SEO' },
            { key: 'settings', label: 'الإعدادات' },
            { key: 'preview', label: 'معاينة' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Basic Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مفتاح المحتوى *
                </label>
                <input
                  type="text"
                  value={content.contentKey}
                  onChange={(e) => setContent(prev => ({ 
                    ...prev, 
                    contentKey: contentManagementService.generateSlug(e.target.value) 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="content-key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع المحتوى
                </label>
                <select
                  value={content.contentType}
                  onChange={(e) => setContent(prev => ({ ...prev, contentType: e.target.value as ContentType }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="page">صفحة</option>
                  <option value="hero">قسم البطل</option>
                  <option value="about">حول</option>
                  <option value="services">الخدمات</option>
                  <option value="contact">اتصال</option>
                  <option value="footer">التذييل</option>
                  <option value="blog">مدونة</option>
                  <option value="news">أخبار</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان (إنجليزي)
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان (عربي)
                </label>
                <input
                  type="text"
                  value={content.titleAr}
                  onChange={(e) => setContent(prev => ({ ...prev, titleAr: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={content.isPublished}
                onChange={(e) => setContent(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="mr-2 block text-sm text-gray-900">
                نشر المحتوى
              </label>
            </div>

            {/* Templates Section */}
            {templates.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">القوالب المتاحة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map(template => (
                    <div
                      key={template.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => applyTemplate(template)}
                    >
                      <h4 className="font-medium mb-2">{template.templateNameAr}</h4>
                      <p className="text-sm text-gray-600">{template.descriptionAr}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {template.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="p-6 space-y-8">
            {/* Hero Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">قسم البطل</h3>
                <input
                  type="checkbox"
                  checked={sections.hero?.enabled}
                  onChange={(e) => updateSection('hero', { enabled: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              {sections.hero?.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">العنوان الرئيسي</label>
                    <input
                      type="text"
                      value={sections.hero?.heading || ''}
                      onChange={(e) => updateSection('hero', { heading: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">العنوان الفرعي</label>
                    <textarea
                      value={sections.hero?.subheading || ''}
                      onChange={(e) => updateSection('hero', { subheading: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نص الزر</label>
                    <input
                      type="text"
                      value={sections.hero?.ctaText || ''}
                      onChange={(e) => updateSection('hero', { ctaText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">قسم حول</h3>
                <input
                  type="checkbox"
                  checked={sections.about?.enabled}
                  onChange={(e) => updateSection('about', { enabled: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              {sections.about?.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                    <input
                      type="text"
                      value={sections.about?.title || ''}
                      onChange={(e) => updateSection('about', { title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                    <textarea
                      value={sections.about?.description || ''}
                      onChange={(e) => updateSection('about', { description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">قسم الاتصال</h3>
                <input
                  type="checkbox"
                  checked={sections.contact?.enabled}
                  onChange={(e) => updateSection('contact', { enabled: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              {sections.contact?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                    <input
                      type="text"
                      value={sections.contact?.title || ''}
                      onChange={(e) => updateSection('contact', { title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={sections.contact?.email || ''}
                      onChange={(e) => updateSection('contact', { email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الهاتف</label>
                    <input
                      type="tel"
                      value={sections.contact?.phone || ''}
                      onChange={(e) => updateSection('contact', { phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                    <input
                      type="text"
                      value={sections.contact?.address || ''}
                      onChange={(e) => updateSection('contact', { address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان SEO
                  <span className="text-xs text-gray-500 mr-1">(60 حرف أو أقل)</span>
                </label>
                <input
                  type="text"
                  value={seoData.title}
                  onChange={(e) => updateSeoData('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  maxLength={60}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {(seoData.title?.length || 0)} / 60
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكلمات المفتاحية
                </label>
                <input
                  type="text"
                  value={seoData.keywords?.join(', ')}
                  onChange={(e) => updateSeoData('keywords', e.target.value.split(',').map(k => k.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="كلمة1, كلمة2, كلمة3"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف SEO
                  <span className="text-xs text-gray-500 mr-1">(160 حرف أو أقل)</span>
                </label>
                <textarea
                  value={seoData.description}
                  onChange={(e) => updateSeoData('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  maxLength={160}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {(seoData.description?.length || 0)} / 160
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان Open Graph
                </label>
                <input
                  type="text"
                  value={seoData.ogTitle}
                  onChange={(e) => updateSeoData('ogTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة Open Graph
                </label>
                <input
                  type="url"
                  value={seoData.ogImage}
                  onChange={(e) => updateSeoData('ogImage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">معاينة المحتوى</h3>
            {renderPreview()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedContentEditor;
