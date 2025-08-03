import React, { useState, useEffect } from 'react';
import {
  Save, Eye, RefreshCw, Settings, Palette, Layout, 
  Monitor, Smartphone, Tablet, Plus, Edit3, Trash2,
  FileText, Image, Video, Type, Grid, Target, Star,
  Upload, Download, Copy, RotateCcw
} from 'lucide-react';
import { useCustomization } from '../../context/CustomizationContext';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

interface LandingPageSection {
  id: string;
  type: 'hero' | 'services' | 'features' | 'stats' | 'testimonials' | 'cta' | 'about' | 'contact';
  title: string;
  content: any;
  visible: boolean;
  order: number;
  styles: any;
}

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    backgroundImage?: string;
    overlayColor?: string;
  };
  about: {
    title: string;
    description: string;
    features: string[];
  };
  services: {
    title: string;
    subtitle: string;
    displayStyle: 'grid' | 'carousel' | 'list';
  };
  stats: {
    enabled: boolean;
    items: Array<{
      label: string;
      value: number;
      icon: string;
    }>;
  };
  testimonials: {
    enabled: boolean;
    items: Array<{
      name: string;
      text: string;
      rating: number;
      image?: string;
    }>;
  };
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    backgroundColor: string;
  };
  contact: {
    title: string;
    address: string;
    phone: string;
    email: string;
    socialLinks: any;
  };
}

export const LandingPageManager: React.FC = () => {
  const { customization, updateCustomization } = useCustomization();
  const { siteSettings, updateSiteSettings } = useData();
  
  const [sections, setSections] = useState<LandingPageSection[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'preview'>('content');
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent>({
    hero: {
      title: 'KYCtrust - خدمات التحقق الرقمية المتطورة',
      subtitle: 'منصة رائدة في خدمات التحقق الرقمية والخدمات المالية المتطورة مع تقنيات حديثة وأمان عالي',
      buttonText: 'ابدأ الآن',
      backgroundImage: '',
      overlayColor: 'rgba(0, 0, 0, 0.4)'
    },
    about: {
      title: 'من نحن',
      description: 'نحن منصة رائدة في مجال الخدمات المالية الرقمية، نقدم حلول متطورة وآمنة للتحقق الرقمي والخدمات المالية.',
      features: ['أمان عالي', 'سرعة في التنفيذ', 'دعم فني 24/7', 'واجهات سهلة الاستخدام']
    },
    services: {
      title: 'خدماتنا',
      subtitle: 'نقدم مجموعة شاملة من الخدمات المالية الرقمية',
      displayStyle: 'grid'
    },
    stats: {
      enabled: true,
      items: [
        { label: 'العملاء الراضين', value: 10000, icon: '👥' },
        { label: 'المعاملات اليومية', value: 5000, icon: '💳' },
        { label: 'سنوات الخبرة', value: 15, icon: '⭐' },
        { label: 'الدول المخدومة', value: 25, icon: '🌍' }
      ]
    },
    testimonials: {
      enabled: true,
      items: [
        {
          name: 'أحمد محمد',
          text: 'خدمة ممتازة وسريعة، أنصح بها بشدة',
          rating: 5,
          image: ''
        },
        {
          name: 'فاطمة علي',
          text: 'أفضل منصة للخدمات المالية الرقمية',
          rating: 5,
          image: ''
        }
      ]
    },
    cta: {
      title: 'ابدأ رحلتك معنا اليوم',
      subtitle: 'انضم إلى آلاف العملاء الراضين',
      buttonText: 'ابدأ الآن',
      backgroundColor: '#3B82F6'
    },
    contact: {
      title: 'تواصل معنا',
      address: 'الرياض، المملكة العربية السعودية',
      phone: '+966501234567',
      email: 'info@kyctrust.com',
      socialLinks: {
        twitter: '',
        linkedin: '',
        facebook: ''
      }
    }
  });

  useEffect(() => {
    loadSiteContent();
  }, []);

  const loadSiteContent = async () => {
    try {
      // Load existing content from customization context
      if (customization.heroSection) {
        setSiteContent(prev => ({
          ...prev,
          hero: {
            ...prev.hero,
            title: customization.heroSection.title,
            subtitle: customization.heroSection.subtitle,
            buttonText: customization.heroSection.button1Text
          }
        }));
      }
    } catch (error) {
      console.error('Error loading site content:', error);
    }
  };

  const handleContentUpdate = (section: string, updates: any) => {
    setSiteContent(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof SiteContent], ...updates }
    }));
    setHasChanges(true);
  };

  const publishChanges = async () => {
    if (!hasChanges) {
      toast.info('لا توجد تغييرات للنشر');
      return;
    }

    setIsPublishing(true);
    try {
      // Update hero section in customization context
      await updateCustomization({
        heroSection: {
          title: siteContent.hero.title,
          titleGradient: '',
          subtitle: siteContent.hero.subtitle,
          button1Text: siteContent.hero.buttonText,
          button2Text: '',
          badgeText: ''
        }
      });

      // Update site settings
      if (updateSiteSettings) {
        await updateSiteSettings({
          company_name: siteContent.hero.title,
          description: siteContent.hero.subtitle,
          contact_email: siteContent.contact.email,
          contact_phone: siteContent.contact.phone
        });
      }

      // Save to localStorage as backup
      localStorage.setItem('kyc-site-content', JSON.stringify(siteContent));
      
      setHasChanges(false);
      toast.success('تم نشر التغييرات بنجاح! سيتم تحديث الصفحة خلال ثوانِ.');
      
      // Refresh the page to show changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error publishing changes:', error);
      toast.error('حدث خطأ أثناء نشر التغييرات');
    } finally {
      setIsPublishing(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات للقيم الافتراضية؟')) {
      setSiteContent({
        hero: {
          title: 'KYCtrust - خدمات التحقق الرقمية المتطورة',
          subtitle: 'منصة رائدة في خدمات التحقق الرقمية والخدمات المالية المتطورة مع تقنيات حديثة وأمان عالي',
          buttonText: 'ابدأ الآن',
          backgroundImage: '',
          overlayColor: 'rgba(0, 0, 0, 0.4)'
        },
        about: {
          title: 'من نحن',
          description: 'نحن منصة رائدة في مجال الخدمات المالية الرقمية، نقدم حلول متطورة وآمنة للتحقق الرقمي والخدمات المالية.',
          features: ['أمان عالي', 'سرعة في التنفيذ', 'دعم فني 24/7', 'واجهات سهلة الاستخدام']
        },
        services: {
          title: 'خدماتنا',
          subtitle: 'نقدم مجموعة شاملة من الخدمات المالية الرقمية',
          displayStyle: 'grid'
        },
        stats: {
          enabled: true,
          items: [
            { label: 'العملاء الراضين', value: 10000, icon: '👥' },
            { label: 'المعاملات اليومية', value: 5000, icon: '💳' },
            { label: 'سنوات الخبرة', value: 15, icon: '⭐' },
            { label: 'الدول المخدومة', value: 25, icon: '🌍' }
          ]
        },
        testimonials: {
          enabled: true,
          items: [
            {
              name: 'أحمد محمد',
              text: 'خدمة ممتازة وسريعة، أنصح بها بشدة',
              rating: 5,
              image: ''
            },
            {
              name: 'فاطمة علي',
              text: 'أفضل منصة للخدمات المالية الرقمية',
              rating: 5,
              image: ''
            }
          ]
        },
        cta: {
          title: 'ابدأ رحلتك معنا اليوم',
          subtitle: 'انضم إلى آلاف العملاء الراضين',
          buttonText: 'ابدأ الآن',
          backgroundColor: '#3B82F6'
        },
        contact: {
          title: 'تواصل معنا',
          address: 'الرياض، المملكة العربية السعودية',
          phone: '+966501234567',
          email: 'info@kyctrust.com',
          socialLinks: {
            twitter: '',
            linkedin: '',
            facebook: ''
          }
        }
      });
      setHasChanges(true);
      toast.success('تم إعادة تعيين الإعدادات');
    }
  };

  const exportContent = () => {
    const dataStr = JSON.stringify(siteContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'landing-page-content.json';
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
        const content = JSON.parse(e.target?.result as string);
        setSiteContent(content);
        setHasChanges(true);
        toast.success('تم استير��د المحتوى بنجاح');
      } catch (error) {
        toast.error('ملف غير صالح');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const getPreviewFrameClass = () => {
    switch (previewMode) {
      case 'tablet': return 'w-768 h-1024';
      case 'mobile': return 'w-375 h-667';
      default: return 'w-full h-full';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              إدارة صفحة الهبوط
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              تخصيص وتحرير محتوى الصفحة الرئيسية
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
            { id: 'content', label: 'المحتوى', icon: FileText },
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

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sections List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              أقسام الصفحة
            </h3>
            <div className="space-y-2">
              {[
                { id: 'hero', label: 'القسم الرئيسي', icon: Target },
                { id: 'about', label: 'من نحن', icon: FileText },
                { id: 'services', label: 'الخدمات', icon: Grid },
                { id: 'stats', label: 'الإحصائيات', icon: TrendingUp },
                { id: 'testimonials', label: 'آراء العملاء', icon: Star },
                { id: 'cta', label: 'دعوة للعمل', icon: Target },
                { id: 'contact', label: 'تواصل معنا', icon: Users }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full flex items-center p-3 rounded-lg text-right transition-colors ${
                    selectedSection === section.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <section.icon className="h-4 w-4 ml-3" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Editor */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            {selectedSection === 'hero' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  تحرير القسم الرئيسي
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    العنوان الرئيسي
                  </label>
                  <input
                    type="text"
                    value={siteContent.hero.title}
                    onChange={(e) => handleContentUpdate('hero', { title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    العنوان الفرعي
                  </label>
                  <textarea
                    value={siteContent.hero.subtitle}
                    onChange={(e) => handleContentUpdate('hero', { subtitle: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نص الزر
                  </label>
                  <input
                    type="text"
                    value={siteContent.hero.buttonText}
                    onChange={(e) => handleContentUpdate('hero', { buttonText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {selectedSection === 'about' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  تحرير قسم من نحن
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={siteContent.about.title}
                    onChange={(e) => handleContentUpdate('about', { title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={siteContent.about.description}
                    onChange={(e) => handleContentUpdate('about', { description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المميزات (واحدة في كل سطر)
                  </label>
                  <textarea
                    value={siteContent.about.features.join('\n')}
                    onChange={(e) => handleContentUpdate('about', { 
                      features: e.target.value.split('\n').filter(f => f.trim()) 
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {selectedSection === 'contact' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  تحرير معلومات التواصل
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="text"
                      value={siteContent.contact.phone}
                      onChange={(e) => handleContentUpdate('contact', { phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={siteContent.contact.email}
                      onChange={(e) => handleContentUpdate('contact', { email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact.address}
                    onChange={(e) => handleContentUpdate('contact', { address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Add other sections as needed */}
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              معاينة الصفحة
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
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
            <div className={`mx-auto transition-all duration-300 ${getPreviewFrameClass()}`}>
              <iframe
                src="/"
                className="w-full h-96 border-0"
                title="Landing Page Preview"
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

export default LandingPageManager;
