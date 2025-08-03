import React, { useState, useEffect } from 'react';
import {
  Save, Eye, RefreshCw, Settings, Palette, Layout, 
  Monitor, Smartphone, Tablet, Plus, Edit3, Trash2,
  FileText, Image, Video, Type, Grid, Target, Star,
  Upload, Download, Copy, RotateCcw, Globe, Users,
  Phone, Mail, Clock, Facebook, Twitter, Instagram,
  Linkedin, ArrowUp, ArrowDown, EyeOff, MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    secondaryButtonText: string;
    backgroundImage: string;
    backgroundOverlay: string;
    visible: boolean;
  };
  navigation: {
    logo: string;
    items: Array<{
      label: string;
      url: string;
      active: boolean;
    }>;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    visible: boolean;
  };
  services: {
    title: string;
    subtitle: string;
    displayStyle: 'grid' | 'carousel' | 'list';
    showPrices: boolean;
    visible: boolean;
  };
  stats: {
    title: string;
    items: Array<{
      label: string;
      value: number;
      suffix: string;
      icon: string;
      color: string;
    }>;
    visible: boolean;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Array<{
      name: string;
      role: string;
      text: string;
      rating: number;
      image: string;
      company: string;
    }>;
    visible: boolean;
  };
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    secondaryButtonText: string;
    backgroundColor: string;
    visible: boolean;
  };
  contact: {
    title: string;
    subtitle: string;
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    socialLinks: {
      twitter: string;
      linkedin: string;
      facebook: string;
      instagram: string;
    };
    visible: boolean;
  };
  footer: {
    copyright: string;
    links: Array<{
      label: string;
      url: string;
    }>;
    visible: boolean;
  };
}

const AdvancedContentManager: React.FC = () => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<'sections' | 'design' | 'preview'>('sections');
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    try {
      const saved = localStorage.getItem('kyc-site-content');
      if (saved) {
        setContent(JSON.parse(saved));
      } else {
        // Load default content
        const defaultContent: SiteContent = {
          hero: {
            title: 'KYCtrust - خدمات التحقق الرقمية المتطورة',
            subtitle: 'منصة رائدة في خدمات التحقق الرقمية والخدمات المالية المتطورة مع تقنيات حديثة وأمان عالي',
            buttonText: 'ابدأ الآن',
            secondaryButtonText: 'تعرف على المزيد',
            backgroundImage: '',
            backgroundOverlay: 'rgba(0, 0, 0, 0.4)',
            visible: true
          },
          navigation: {
            logo: 'KYCtrust',
            items: [
              { label: 'الرئيسية', url: '#home', active: true },
              { label: 'خدماتنا', url: '#services', active: true },
              { label: 'من نحن', url: '#about', active: true },
              { label: 'آراء العملاء', url: '#testimonials', active: true },
              { label: 'تواصل معنا', url: '#contact', active: true }
            ]
          },
          about: {
            title: 'من نحن',
            subtitle: 'رواد في عالم الخدمات المالية الرقمية',
            description: 'نحن منصة متطورة تقدم خدمات التحقق الرقمي والحلول المالية بأعلى معايير الأمان والجودة. نفخر بخدمة آلاف العملاء حول العالم.',
            features: [
              { title: 'أمان عالي', description: 'حماية متقدمة لبياناتك', icon: 'shield' },
              { title: 'سرعة في التنفيذ', description: 'معالجة فورية للطلبات', icon: 'zap' },
              { title: 'دعم فني 24/7', description: 'فريق دعم متاح دائماً', icon: 'clock' },
              { title: 'واجهات سهلة', description: 'تجربة مستخدم متميزة', icon: 'users' }
            ],
            visible: true
          },
          services: {
            title: 'خدماتنا المتميزة',
            subtitle: 'نقدم مجموعة شاملة من الخدمات المالية الرقمية المتطورة',
            displayStyle: 'grid',
            showPrices: true,
            visible: true
          },
          stats: {
            title: 'أرقامنا تتحدث',
            items: [
              { label: 'عميل راضي', value: 10000, suffix: '+', icon: '👥', color: '#3B82F6' },
              { label: 'معاملة يومية', value: 5000, suffix: '+', icon: '💳', color: '#10B981' },
              { label: 'سنة خبرة', value: 15, suffix: '', icon: '⭐', color: '#F59E0B' },
              { label: 'دولة مخدومة', value: 25, suffix: '+', icon: '🌍', color: '#8B5CF6' }
            ],
            visible: true
          },
          testimonials: {
            title: 'ماذا يقول عملاؤنا',
            subtitle: 'تجارب حقيقية من عملائنا الكرام',
            items: [
              {
                name: 'أحمد محمد',
                role: 'رجل أعمال',
                text: 'خدمة ممتازة وسريعة، أنصح بها بشدة. فريق العمل محترف جداً',
                rating: 5,
                image: '',
                company: 'شركة التقنية المتقدمة'
              },
              {
                name: 'فاطمة علي',
                role: 'مديرة مشاريع',
                text: 'أفضل منصة للخدمات المالية الرقمية، أمان و��رعة لا مثيل لهما',
                rating: 5,
                image: '',
                company: 'مجموعة الابتكار'
              },
              {
                name: 'محمد خالد',
                role: 'مستثمر',
                text: 'تجربة رائعة، خدمة عملاء متميزة ونتائج سريعة ومضمونة',
                rating: 5,
                image: '',
                company: 'صندوق الاستثمار'
              }
            ],
            visible: true
          },
          cta: {
            title: 'ابدأ رحلتك معنا اليوم',
            subtitle: 'انضم إلى آلاف العملاء الراضين واحصل على أفضل الخدمات المالية الرقمية',
            buttonText: 'ابدأ الآن',
            secondaryButtonText: 'تواصل معنا',
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            visible: true
          },
          contact: {
            title: 'تواصل معنا',
            subtitle: 'نحن هنا لمساعدتك في أي وقت',
            address: 'الرياض، المملكة العربية السعودية',
            phone: '+201062453344',
            email: 'info@kyctrust.com',
            workingHours: 'الأحد - الخميس: 9:00 ص - 6:00 م',
            socialLinks: {
              twitter: 'https://twitter.com/kyctrust',
              linkedin: 'https://linkedin.com/company/kyctrust',
              facebook: 'https://facebook.com/kyctrust',
              instagram: 'https://instagram.com/kyctrust'
            },
            visible: true
          },
          footer: {
            copyright: '© 2024 KYCtrust. جميع الحقوق محفوظة.',
            links: [
              { label: 'سياسة الخصوصية', url: '/privacy' },
              { label: 'الشروط والأحكام', url: '/terms' },
              { label: 'اتفاقية الاستخدام', url: '/usage' }
            ],
            visible: true
          }
        };
        setContent(defaultContent);
        saveContent(defaultContent);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('حدث خطأ في تحميل المحتوى');
    }
  };

  const saveContent = (newContent: SiteContent) => {
    try {
      localStorage.setItem('kyc-site-content', JSON.stringify(newContent));
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('حدث خطأ في حفظ المحتوى');
    }
  };

  const updateSection = (section: string, updates: any) => {
    if (!content) return;
    
    const newContent = {
      ...content,
      [section]: { ...content[section as keyof SiteContent], ...updates }
    };
    setContent(newContent);
    setHasChanges(true);
  };

  const publishChanges = async () => {
    if (!content || !hasChanges) {
      toast.info('لا توجد تغييرات للنشر');
      return;
    }

    setIsPublishing(true);
    try {
      saveContent(content);
      toast.success('تم نشر التغييرات بنجاح! ستظهر في الصفحة فوراً.');
      
      // Refresh the preview
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error publishing changes:', error);
      toast.error('حدث خطأ أثناء نشر التغييرات');
    } finally {
      setIsPublishing(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات للقيم الافتراضية؟')) {
      loadContent();
      setHasChanges(true);
      toast.success('تم إعادة تعيين الإعدادات');
    }
  };

  const exportContent = () => {
    if (!content) return;
    
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kyctrust-content-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير المحتوى');
  };

  const importContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedContent = JSON.parse(e.target?.result as string);
        setContent(importedContent);
        setHasChanges(true);
        toast.success('تم استيراد المحتوى بنجاح');
      } catch (error) {
        toast.error('ملف غير صالح');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const getPreviewFrameClass = () => {
    switch (previewMode) {
      case 'tablet': return 'w-768 h-1024 max-w-full';
      case 'mobile': return 'w-375 h-667 max-w-full';
      default: return 'w-full h-full';
    }
  };

  if (!content) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              إدارة محتوى الموقع المتقدمة
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              تحكم كامل في كل جزء من صفحة الهبوط
            </p>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            {hasChanges && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                تغييرات غير محفوظة
              </span>
            )}
            
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              إعادة تعيين
            </button>
            
            <button
              onClick={exportContent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              تصدير
            </button>
            
            <label className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              استيراد
              <input
                type="file"
                accept=".json"
                onChange={importContent}
                className="hidden"
              />
            </label>
            
            <button
              onClick={publishChanges}
              disabled={isPublishing || !hasChanges}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center"
            >
              {isPublishing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isPublishing ? 'جاري النشر...' : 'نشر التغييرات'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 space-x-reverse bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {[
            { id: 'sections', label: 'الأقسام', icon: Layout },
            { id: 'design', label: 'التصميم', icon: Palette },
            { id: 'preview', label: 'معاينة', icon: Eye }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections Tab */}
      {activeTab === 'sections' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sections List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              أقسام الصفحة
            </h3>
            <div className="space-y-2">
              {[
                { id: 'navigation', label: 'شريط التنقل', icon: Globe },
                { id: 'hero', label: 'القسم الرئيسي', icon: Target },
                { id: 'about', label: 'من نحن', icon: Users },
                { id: 'services', label: 'الخدمات', icon: Grid },
                { id: 'stats', label: 'الإحصائيات', icon: Star },
                { id: 'testimonials', label: 'آراء العملاء', icon: Star },
                { id: 'cta', label: 'دعوة للعمل', icon: Target },
                { id: 'contact', label: 'تواصل معنا', icon: Phone },
                { id: 'footer', label: 'الفوتر', icon: Layout }
              ].map(section => {
                const sectionContent = content[section.id as keyof SiteContent] as any;
                const isVisible = sectionContent?.visible !== false;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-right transition-colors ${
                      selectedSection === section.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <section.icon className="h-4 w-4 ml-3" />
                      {section.label}
                    </div>
                    <div className="flex items-center">
                      {isVisible ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Editor */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            {/* Hero Section Editor */}
            {selectedSection === 'hero' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    تحرير القسم الرئيسي
                  </h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={content.hero.visible}
                      onChange={(e) => updateSection('hero', { visible: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">مرئي</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      العنوان الرئيسي
                    </label>
                    <input
                      type="text"
                      value={content.hero.title}
                      onChange={(e) => updateSection('hero', { title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      العنوان الفرعي
                    </label>
                    <textarea
                      value={content.hero.subtitle}
                      onChange={(e) => updateSection('hero', { subtitle: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نص الزر الأساسي
                    </label>
                    <input
                      type="text"
                      value={content.hero.buttonText}
                      onChange={(e) => updateSection('hero', { buttonText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نص الزر الثانوي
                    </label>
                    <input
                      type="text"
                      value={content.hero.secondaryButtonText}
                      onChange={(e) => updateSection('hero', { secondaryButtonText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      صورة الخلفية (رابط)
                    </label>
                    <input
                      type="url"
                      value={content.hero.backgroundImage}
                      onChange={(e) => updateSection('hero', { backgroundImage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      طبقة الخلفية
                    </label>
                    <input
                      type="text"
                      value={content.hero.backgroundOverlay}
                      onChange={(e) => updateSection('hero', { backgroundOverlay: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="rgba(0, 0, 0, 0.4)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* About Section Editor */}
            {selectedSection === 'about' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    تحرير قسم من نحن
                  </h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={content.about.visible}
                      onChange={(e) => updateSection('about', { visible: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">مرئي</span>
                  </label>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      العنوان
                    </label>
                    <input
                      type="text"
                      value={content.about.title}
                      onChange={(e) => updateSection('about', { title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      العنوان الفرعي
                    </label>
                    <input
                      type="text"
                      value={content.about.subtitle}
                      onChange={(e) => updateSection('about', { subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الوصف
                    </label>
                    <textarea
                      value={content.about.description}
                      onChange={(e) => updateSection('about', { description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      المميزات
                    </label>
                    <div className="space-y-3">
                      {content.about.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 space-x-reverse">
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => {
                              const newFeatures = [...content.about.features];
                              newFeatures[index] = { ...feature, title: e.target.value };
                              updateSection('about', { features: newFeatures });
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="عنوان الميزة"
                          />
                          <input
                            type="text"
                            value={feature.description}
                            onChange={(e) => {
                              const newFeatures = [...content.about.features];
                              newFeatures[index] = { ...feature, description: e.target.value };
                              updateSection('about', { features: newFeatures });
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="وصف الميزة"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Section Editor */}
            {selectedSection === 'contact' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    تحرير معلومات التواصل
                  </h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={content.contact.visible}
                      onChange={(e) => updateSection('contact', { visible: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">مرئي</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      العنوان
                    </label>
                    <input
                      type="text"
                      value={content.contact.title}
                      onChange={(e) => updateSection('contact', { title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      العنوان الفرعي
                    </label>
                    <input
                      type="text"
                      value={content.contact.subtitle}
                      onChange={(e) => updateSection('contact', { subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="text"
                      value={content.contact.phone}
                      onChange={(e) => updateSection('contact', { phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الب��يد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={content.contact.email}
                      onChange={(e) => updateSection('contact', { email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      العنوان
                    </label>
                    <input
                      type="text"
                      value={content.contact.address}
                      onChange={(e) => updateSection('contact', { address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ساعات العمل
                    </label>
                    <input
                      type="text"
                      value={content.contact.workingHours}
                      onChange={(e) => updateSection('contact', { workingHours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      تويتر
                    </label>
                    <input
                      type="url"
                      value={content.contact.socialLinks.twitter}
                      onChange={(e) => updateSection('contact', { 
                        socialLinks: { ...content.contact.socialLinks, twitter: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      لينكد إن
                    </label>
                    <input
                      type="url"
                      value={content.contact.socialLinks.linkedin}
                      onChange={(e) => updateSection('contact', { 
                        socialLinks: { ...content.contact.socialLinks, linkedin: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Add other section editors... */}
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              معاينة مباشرة
            </h3>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              {[
                { mode: 'desktop', icon: Monitor, label: 'سطح مكتب' },
                { mode: 'tablet', icon: Tablet, label: 'تابلت' },
                { mode: 'mobile', icon: Smartphone, label: 'موبايل' }
              ].map(device => (
                <button
                  key={device.mode}
                  onClick={() => setPreviewMode(device.mode as any)}
                  className={`p-2 rounded-lg flex items-center ${
                    previewMode === device.mode
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={device.label}
                >
                  <device.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 p-4">
            <div className={`mx-auto transition-all duration-300 ${getPreviewFrameClass()}`}>
              <iframe
                src="/"
                className="w-full h-96 border-0 rounded"
                title="Landing Page Preview"
                key={JSON.stringify(content)} // Force reload when content changes
              />
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Eye className="h-4 w-4 mr-2" />
              فتح في تبويب جديد
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedContentManager;
