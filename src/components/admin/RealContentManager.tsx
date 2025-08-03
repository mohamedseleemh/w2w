import React, { useState, useEffect } from 'react';
import {
  Save, Eye, RefreshCw, Settings, Palette, Layout, 
  Monitor, Smartphone, Tablet, Plus, Edit3, Trash2,
  FileText, Image, Video, Type, Grid, Target, Star,
  Upload, Download, Copy, RotateCcw, Globe, Users,
  Phone, Mail, Clock, Facebook, Twitter, Instagram,
  Linkedin, ArrowUp, ArrowDown, EyeOff, MoreVertical,
  Zap, CheckCircle, AlertCircle, ExternalLink
} from 'lucide-react';
import {
  SuperButton,
  EnhancedCard,
  UltraButton
} from '../ui';
import { EnhancedInput, EnhancedTextarea, EnhancedFileInput } from '../forms/EnhancedForm';
import toast from 'react-hot-toast';

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    backgroundImage: string;
    backgroundVideo: string;
    backgroundOverlay: string;
    visible: boolean;
    style: 'modern' | 'classic' | 'minimal' | 'gradient';
  };
  navigation: {
    logo: string;
    logoImage: string;
    items: Array<{
      id: string;
      label: string;
      url: string;
      active: boolean;
      order: number;
    }>;
    showLanguage: boolean;
    showTheme: boolean;
  };
  services: {
    title: string;
    subtitle: string;
    visible: boolean;
    layout: 'grid' | 'list' | 'carousel';
    itemsPerRow: number;
    showPrices: boolean;
    showDescriptions: boolean;
  };
  about: {
    title: string;
    content: string;
    image: string;
    features: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      active: boolean;
    }>;
    visible: boolean;
    layout: 'side-by-side' | 'centered' | 'split';
  };
  testimonials: {
    title: string;
    subtitle: string;
    visible: boolean;
    autoPlay: boolean;
    showRatings: boolean;
    items: Array<{
      id: string;
      name: string;
      role: string;
      content: string;
      rating: number;
      avatar: string;
      active: boolean;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    workingHours: string;
    socialMedia: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
      youtube: string;
    };
    showMap: boolean;
    mapUrl: string;
    visible: boolean;
  };
  footer: {
    companyName: string;
    description: string;
    copyright: string;
    links: Array<{
      id: string;
      title: string;
      url: string;
      active: boolean;
    }>;
    showSocialMedia: boolean;
    visible: boolean;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    author: string;
    ogImage: string;
  };
  analytics: {
    googleAnalytics: string;
    facebookPixel: string;
    hotjar: string;
  };
}

const RealContentManager: React.FC = () => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    try {
      const saved = localStorage.getItem('kyc-site-content');
      if (saved) {
        setContent(JSON.parse(saved));
      } else {
        setContent(getDefaultContent());
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContent(getDefaultContent());
      toast.error('خطأ في تحميل المحتوى، تم تحميل المحتوى الافتراضي');
    }
  };

  const getDefaultContent = (): SiteContent => ({
    hero: {
      title: 'KYC Trust - منصة التحقق الرقمية المتطورة',
      subtitle: 'حلول شاملة للتحقق من الهوية والامتثال',
      description: 'نقدم خدمات التحقق الرقمية الأكثر تطوراً وأماناً في المنطقة، مع تقنيات حديثة وفريق خبراء متخصص لضمان الامتثال الكامل للمعايير الدولية.',
      primaryButtonText: 'ابدأ الآن',
      secondaryButtonText: 'تعرف على خدماتنا',
      backgroundImage: '',
      backgroundVideo: '',
      backgroundOverlay: 'rgba(59, 130, 246, 0.8)',
      visible: true,
      style: 'gradient'
    },
    navigation: {
      logo: 'KYC Trust',
      logoImage: '',
      items: [
        { id: '1', label: 'الرئيسية', url: '#home', active: true, order: 1 },
        { id: '2', label: 'خدماتنا', url: '#services', active: true, order: 2 },
        { id: '3', label: 'من نحن', url: '#about', active: true, order: 3 },
        { id: '4', label: 'آراء العملاء', url: '#testimonials', active: true, order: 4 },
        { id: '5', label: 'تواصل معنا', url: '#contact', active: true, order: 5 }
      ],
      showLanguage: true,
      showTheme: true
    },
    services: {
      title: 'خدماتنا المتميزة',
      subtitle: 'حلول شاملة للتحقق والامتثال الرقمي',
      visible: true,
      layout: 'grid',
      itemsPerRow: 3,
      showPrices: true,
      showDescriptions: true
    },
    about: {
      title: 'من نحن',
      content: 'نحن فريق من الخبراء المتخصصين في مجال التحقق الرقمي والامتثال، نعمل على تقديم أفضل الحلول التقنية للشركات والأفراد. نتميز بالخبرة الواسعة والتقنيات المتطورة التي تضمن الأمان والموثوقية في جميع خدماتنا.',
      image: '',
      features: [
        {
          id: '1',
          title: 'أمان عالي',
          description: 'تقنيات تشفير متقدمة لحماية بياناتك',
          icon: 'shield',
          active: true
        },
        {
          id: '2',
          title: 'سرعة الاستجابة',
          description: 'خدمة عملاء متاحة 24/7 لمساعدتك',
          icon: 'zap',
          active: true
        },
        {
          id: '3',
          title: 'موثوقية عالية',
          description: 'شراكات مع أفضل الجهات المعتمدة',
          icon: 'award',
          active: true
        }
      ],
      visible: true,
      layout: 'side-by-side'
    },
    testimonials: {
      title: 'آراء عملائنا',
      subtitle: 'تجارب حقيقية من عملائنا الكرام',
      visible: true,
      autoPlay: true,
      showRatings: true,
      items: [
        {
          id: '1',
          name: 'أحمد محمد',
          role: 'مدير تنفيذي',
          content: 'خدمة ممتازة وسريعة، تم التحقق من جميع الوثائق في وقت قياسي',
          rating: 5,
          avatar: '',
          active: true
        },
        {
          id: '2',
          name: 'فاطمة علي',
          role: 'صاحبة شركة',
          content: 'فريق محترف ومتعاون، أنصح بالتعامل معهم',
          rating: 5,
          avatar: '',
          active: true
        }
      ]
    },
    contact: {
      title: 'تواصل معنا',
      subtitle: 'نحن هنا لمساعدتك في أي وقت',
      phone: '+201062453344',
      whatsapp: '+201062453344',
      email: 'info@kyctrust.com',
      address: 'القاهرة، مصر',
      workingHours: 'الأحد - الخميس: 9:00 ص - 6:00 م',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      },
      showMap: true,
      mapUrl: '',
      visible: true
    },
    footer: {
      companyName: 'KYC Trust',
      description: 'منصة رائدة في خدمات التحقق الرقمي والامتثال',
      copyright: '© 2024 KYC Trust. جميع الحقوق محفوظة.',
      links: [
        { id: '1', title: 'سياسة الخصوصية', url: '#privacy', active: true },
        { id: '2', title: 'شروط الاستخدام', url: '#terms', active: true },
        { id: '3', title: 'الدعم الفني', url: '#support', active: true }
      ],
      showSocialMedia: true,
      visible: true
    },
    seo: {
      title: 'KYC Trust - منصة التحقق الرقمية المتطورة',
      description: 'حلول شاملة للتحقق من الهوية والامتثال الرقمي مع تقنيات متطورة وأمان عالي',
      keywords: 'KYC, التحقق الرقمي, الامتثال, الهوية الرقمية, الأمان السيبراني',
      author: 'KYC Trust Team',
      ogImage: ''
    },
    analytics: {
      googleAnalytics: '',
      facebookPixel: '',
      hotjar: ''
    }
  });

  const saveContent = async () => {
    if (!content) return;
    
    setSaving(true);
    try {
      localStorage.setItem('kyc-site-content', JSON.stringify(content));
      setLastSaved(new Date());
      setHasChanges(false);
      toast.success('تم حفظ المحتوى بنجاح');
      
      // Trigger a custom event to update the landing page
      window.dispatchEvent(new CustomEvent('contentUpdated', { detail: content }));
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('خطأ في حفظ المحتوى');
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (section: string, updates: any) => {
    if (!content) return;
    
    setContent(prev => ({
      ...prev!,
      [section]: { ...prev![section as keyof SiteContent], ...updates }
    }));
    setHasChanges(true);
  };

  const previewLandingPage = () => {
    // Open landing page in new tab
    const landingUrl = window.location.origin;
    window.open(landingUrl, '_blank');
  };

  const sections = [
    { id: 'hero', title: 'القسم الرئيسي', icon: Zap, color: 'from-blue-500 to-cyan-500' },
    { id: 'navigation', title: 'شريط التنقل', icon: Layout, color: 'from-green-500 to-emerald-500' },
    { id: 'services', title: 'الخدمات', icon: Grid, color: 'from-purple-500 to-pink-500' },
    { id: 'about', title: 'من نحن', icon: Users, color: 'from-orange-500 to-red-500' },
    { id: 'testimonials', title: 'آراء العملاء', icon: Star, color: 'from-yellow-500 to-orange-500' },
    { id: 'contact', title: 'تواصل معنا', icon: Phone, color: 'from-teal-500 to-cyan-500' },
    { id: 'footer', title: 'الفوتر', icon: Globe, color: 'from-indigo-500 to-purple-500' },
    { id: 'seo', title: 'السيو', icon: Target, color: 'from-pink-500 to-rose-500' }
  ];

  const renderHeroEditor = () => {
    if (!content) return null;
    
    return (
      <div className="space-y-6">
        <EnhancedCard variant="elevated" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">المحتوى الأساسي</h3>
          <div className="space-y-4">
            <EnhancedInput
              label="العنوان الرئيسي"
              value={content.hero.title}
              onChange={(value) => updateContent('hero', { title: value })}
              placeholder="العنوان الرئيسي للموقع"
            />
            <EnhancedInput
              label="العنوان الفرعي"
              value={content.hero.subtitle}
              onChange={(value) => updateContent('hero', { subtitle: value })}
              placeholder="العنوان الفرعي"
            />
            <EnhancedTextarea
              label="الوصف"
              value={content.hero.description}
              onChange={(value) => updateContent('hero', { description: value })}
              placeholder="وصف تفصيلي عن الموقع"
              rows={4}
            />
          </div>
        </EnhancedCard>

        <EnhancedCard variant="elevated" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">الأزرار</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedInput
              label="نص الزر ال��ساسي"
              value={content.hero.primaryButtonText}
              onChange={(value) => updateContent('hero', { primaryButtonText: value })}
              placeholder="ابدأ الآن"
            />
            <EnhancedInput
              label="نص الزر الثانوي"
              value={content.hero.secondaryButtonText}
              onChange={(value) => updateContent('hero', { secondaryButtonText: value })}
              placeholder="تعرف على المزيد"
            />
          </div>
        </EnhancedCard>

        <EnhancedCard variant="elevated" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">الخلفية والمظهر</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                نمط القسم
              </label>
              <select
                value={content.hero.style}
                onChange={(e) => updateContent('hero', { style: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="modern">حدي��</option>
                <option value="classic">كلاسيكي</option>
                <option value="minimal">بسيط</option>
                <option value="gradient">متدرج</option>
              </select>
            </div>
            <EnhancedInput
              label="لون التراكب (rgba)"
              value={content.hero.backgroundOverlay}
              onChange={(value) => updateContent('hero', { backgroundOverlay: value })}
              placeholder="rgba(59, 130, 246, 0.8)"
            />
          </div>
        </EnhancedCard>
      </div>
    );
  };

  const renderNavigationEditor = () => {
    if (!content) return null;
    
    return (
      <div className="space-y-6">
        <EnhancedCard variant="elevated" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">الشعار والهوية</h3>
          <div className="space-y-4">
            <EnhancedInput
              label="نص الشعار"
              value={content.navigation.logo}
              onChange={(value) => updateContent('navigation', { logo: value })}
              placeholder="اسم الموقع"
            />
            <div className="flex items-center space-x-4 space-x-reverse">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={content.navigation.showLanguage}
                  onChange={(e) => updateContent('navigation', { showLanguage: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">عرض مبدل اللغة</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={content.navigation.showTheme}
                  onChange={(e) => updateContent('navigation', { showTheme: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">عرض مبدل المظهر</span>
              </label>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="elevated" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">عناصر القائمة</h3>
          <div className="space-y-4">
            {content.navigation.items.map((item, index) => (
              <div key={item.id} className="flex items-center space-x-3 space-x-reverse p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const newItems = [...content.navigation.items];
                    newItems[index].label = e.target.value;
                    updateContent('navigation', { items: newItems });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="اسم العنصر"
                />
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => {
                    const newItems = [...content.navigation.items];
                    newItems[index].url = e.target.value;
                    updateContent('navigation', { items: newItems });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="الرابط"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={(e) => {
                      const newItems = [...content.navigation.items];
                      newItems[index].active = e.target.checked;
                      updateContent('navigation', { items: newItems });
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">مفعل</span>
                </label>
              </div>
            ))}
          </div>
        </EnhancedCard>
      </div>
    );
  };

  const renderContactEditor = () => {
    if (!content) return null;
    
    return (
      <div className="space-y-6">
        <EnhancedCard variant="elevated" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">معلومات الاتصال</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedInput
              label="رقم الهاتف"
              value={content.contact.phone}
              onChange={(value) => updateContent('contact', { phone: value })}
              placeholder="+20xxxxxxxxx"
              type="tel"
            />
            <EnhancedInput
              label="رقم الواتساب"
              value={content.contact.whatsapp}
              onChange={(value) => updateContent('contact', { whatsapp: value })}
              placeholder="+20xxxxxxxxx"
              type="tel"
            />
            <EnhancedInput
              label="البريد الإلكتروني"
              value={content.contact.email}
              onChange={(value) => updateContent('contact', { email: value })}
              placeholder="info@example.com"
              type="email"
            />
            <EnhancedInput
              label="ساعات العمل"
              value={content.contact.workingHours}
              onChange={(value) => updateContent('contact', { workingHours: value })}
              placeholder="الأحد - الخميس: 9:00 ص - 6:00 م"
            />
          </div>
          <div className="mt-4">
            <EnhancedTextarea
              label="العنوان"
              value={content.contact.address}
              onChange={(value) => updateContent('contact', { address: value })}
              placeholder="العنوان الكامل"
              rows={2}
            />
          </div>
        </EnhancedCard>

        <EnhancedCard variant="elevated" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">وسائل التواصل الاجتماعي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedInput
              label="فيسبوك"
              value={content.contact.socialMedia.facebook}
              onChange={(value) => updateContent('contact', { 
                socialMedia: { ...content.contact.socialMedia, facebook: value }
              })}
              placeholder="https://facebook.com/page"
              type="url"
            />
            <EnhancedInput
              label="تويتر"
              value={content.contact.socialMedia.twitter}
              onChange={(value) => updateContent('contact', { 
                socialMedia: { ...content.contact.socialMedia, twitter: value }
              })}
              placeholder="https://twitter.com/account"
              type="url"
            />
            <EnhancedInput
              label="إنستجرام"
              value={content.contact.socialMedia.instagram}
              onChange={(value) => updateContent('contact', { 
                socialMedia: { ...content.contact.socialMedia, instagram: value }
              })}
              placeholder="https://instagram.com/account"
              type="url"
            />
            <EnhancedInput
              label="لينكد إن"
              value={content.contact.socialMedia.linkedin}
              onChange={(value) => updateContent('contact', { 
                socialMedia: { ...content.contact.socialMedia, linkedin: value }
              })}
              placeholder="https://linkedin.com/company/name"
              type="url"
            />
          </div>
        </EnhancedCard>
      </div>
    );
  };

  const renderSEOEditor = () => {
    if (!content) return null;
    
    return (
      <div className="space-y-6">
        <EnhancedCard variant="elevated" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">إعدادات السيو (SEO)</h3>
          <div className="space-y-4">
            <EnhancedInput
              label="عنوان الصفحة"
              value={content.seo.title}
              onChange={(value) => updateContent('seo', { title: value })}
              placeholder="عنوان الصفحة في محركات البحث"
              maxLength={60}
            />
            <EnhancedTextarea
              label="وصف الصفحة"
              value={content.seo.description}
              onChange={(value) => updateContent('seo', { description: value })}
              placeholder="وصف مختصر للصفحة في محركات البحث"
              rows={3}
              maxLength={160}
            />
            <EnhancedInput
              label="الكلمات المفتاحية"
              value={content.seo.keywords}
              onChange={(value) => updateContent('seo', { keywords: value })}
              placeholder="كلمة1, كلمة2, كلمة3"
            />
            <EnhancedInput
              label="المؤلف"
              value={content.seo.author}
              onChange={(value) => updateContent('seo', { author: value })}
              placeholder="اسم المؤلف أو الشركة"
            />
          </div>
        </EnhancedCard>

        <EnhancedCard variant="elevated" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">أدوات التحليل</h3>
          <div className="space-y-4">
            <EnhancedInput
              label="Google Analytics ID"
              value={content.analytics.googleAnalytics}
              onChange={(value) => updateContent('analytics', { googleAnalytics: value })}
              placeholder="G-XXXXXXXXXX"
            />
            <EnhancedInput
              label="Facebook Pixel ID"
              value={content.analytics.facebookPixel}
              onChange={(value) => updateContent('analytics', { facebookPixel: value })}
              placeholder="123456789012345"
            />
            <EnhancedInput
              label="Hotjar Site ID"
              value={content.analytics.hotjar}
              onChange={(value) => updateContent('analytics', { hotjar: value })}
              placeholder="1234567"
            />
          </div>
        </EnhancedCard>
      </div>
    );
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'hero':
        return renderHeroEditor();
      case 'navigation':
        return renderNavigationEditor();
      case 'contact':
        return renderContactEditor();
      case 'seo':
        return renderSEOEditor();
      default:
        return (
          <EnhancedCard variant="elevated" className="p-12 text-center">
            <Edit3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {sections.find(s => s.id === activeSection)?.title} - قيد التطوير
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              محرر هذا القسم سيكون متاحاً قريباً
            </p>
          </EnhancedCard>
        );
    }
  };

  if (!content) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mr-3" />
        <span className="text-gray-600 dark:text-gray-400">جاري تحميل المحتوى...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إدارة محتوى الموقع</h1>
          <p className="text-gray-600 dark:text-gray-400">تحرير وتخصيص محتوى صفحة الهبوط</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <SuperButton
            variant="outline"
            icon={<ExternalLink className="h-4 w-4" />}
            onClick={previewLandingPage}
          >
            معاينة الموقع
          </SuperButton>
          <SuperButton
            variant="primary"
            icon={<Save className="h-4 w-4" />}
            loading={isSaving}
            onClick={saveContent}
            disabled={!hasChanges}
          >
            حفظ التغييرات
          </SuperButton>
        </div>
      </div>

      {/* Status Bar */}
      {(hasChanges || lastSaved) && (
        <EnhancedCard variant="default" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              {hasChanges ? (
                <>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600 dark:text-orange-400">
                    لديك تغييرات غير محفوظة
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">
                    جميع التغييرات محفوظة
                  </span>
                </>
              )}
            </div>
            {lastSaved && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                آخر حفظ: {lastSaved.toLocaleTimeString('ar-SA')}
              </span>
            )}
          </div>
        </EnhancedCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sections Sidebar */}
        <div className="lg:col-span-1">
          <EnhancedCard variant="elevated" className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              أقسام الموقع
            </h3>
            <nav className="space-y-2">
              {sections.map((section) => {
                const SectionIcon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 space-x-reverse px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSection === section.id
                        ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <SectionIcon className="h-5 w-5" />
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </EnhancedCard>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default RealContentManager;
