import React, { useState, useEffect } from 'react';
import { 
  Globe, Save,
  MessageCircle, Shield,
  Settings, Palette,
  AlertCircle, Check, X
} from 'lucide-react';

interface SiteSettings {
  // Company Information
  companyName: string;
  companyDescription: string;
  companyLogo: string;
  companyAddress: string;
  companyCity: string;
  companyCountry: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  
  // Business Hours
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  
  // Social Media
  socialMedia: {
    whatsapp: string;
    telegram: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    facebook: string;
  };
  
  // SEO Settings
  seo: {
    title: string;
    description: string;
    keywords: string;
    favicon: string;
    ogImage: string;
  };
  
  // Appearance
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
    rtl: boolean;
    language: string;
  };
  
  // Features
  features: {
    enableRegistration: boolean;
    enableComments: boolean;
    enableNotifications: boolean;
    enableAnalytics: boolean;
    enableMultiLanguage: boolean;
    enableDarkMode: boolean;
  };
  
  // Security
  security: {
    enableCaptcha: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
    enableTwoFactor: boolean;
    enableSSL: boolean;
  };
  
  // Notifications
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    whatsappNotifications: boolean;
    newOrderNotification: boolean;
    paymentNotification: boolean;
  };
  
  // Maintenance
  maintenance: {
    enabled: boolean;
    message: string;
    allowedIPs: string[];
  };
}

export const SiteSettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Try to load from localStorage first
      const stored = localStorage.getItem('kyc-site-settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      } else {
        // Initialize with default settings
        const defaultSettings: SiteSettings = {
          companyName: 'KYCtrust للخدمات الرقمية',
          companyDescription: 'منصة متخصصة في تقديم خدمات التحقق من الهوية وحلول KYC المبتكرة',
          companyLogo: '',
          companyAddress: 'الرياض، المملكة العربية السعودية',
          companyCity: 'الرياض',
          companyCountry: 'المملكة العربية السعودية',
          companyPhone: '+966501234567',
          companyEmail: 'info@kyctrust.com',
          companyWebsite: 'https://kyctrust.com',
          
          businessHours: {
            sunday: { open: '09:00', close: '17:00', isOpen: true },
            monday: { open: '09:00', close: '17:00', isOpen: true },
            tuesday: { open: '09:00', close: '17:00', isOpen: true },
            wednesday: { open: '09:00', close: '17:00', isOpen: true },
            thursday: { open: '09:00', close: '17:00', isOpen: true },
            friday: { open: '09:00', close: '17:00', isOpen: false },
            saturday: { open: '09:00', close: '17:00', isOpen: false }
          },
          
          socialMedia: {
            whatsapp: '+966501234567',
            telegram: '@kyctrust',
            twitter: '@kyctrust',
            instagram: 'kyctrust',
            linkedin: 'company/kyctrust',
            facebook: 'kyctrust'
          },
          
          seo: {
            title: 'KYCtrust - خدمات التحقق من الهوية',
            description: 'منصة متخصصة في تقديم خدمات ا��تحقق من الهوية وحلول KYC المبتكرة للشركات والأفراد',
            keywords: 'KYC, التحقق من الهوية, خدمات رقمية, أمان, مصادقة',
            favicon: '/favicon.ico',
            ogImage: ''
          },
          
          theme: {
            primaryColor: '#3B82F6',
            secondaryColor: '#10B981',
            accentColor: '#F59E0B',
            darkMode: true,
            rtl: true,
            language: 'ar'
          },
          
          features: {
            enableRegistration: true,
            enableComments: false,
            enableNotifications: true,
            enableAnalytics: true,
            enableMultiLanguage: true,
            enableDarkMode: true
          },
          
          security: {
            enableCaptcha: false,
            maxLoginAttempts: 5,
            sessionTimeout: 30,
            enableTwoFactor: false,
            enableSSL: true
          },
          
          notifications: {
            emailNotifications: true,
            smsNotifications: false,
            whatsappNotifications: true,
            newOrderNotification: true,
            paymentNotification: true
          },
          
          maintenance: {
            enabled: false,
            message: 'الموقع تحت الصيانة. سنعود قريباً!',
            allowedIPs: []
          }
        };
        
        setSettings(defaultSettings);
        localStorage.setItem('kyc-site-settings', JSON.stringify(defaultSettings));
      }
    } catch (error) {
      console.error('خطأ في تحميل الإعدادات:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('kyc-site-settings', JSON.stringify(settings));
      
      // Try to save to API if available
      try {
        await fetch('/api/site-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
      } catch (e) {
        // API fallback - settings saved locally only
      }
      
      setSaveMessage('تم حفظ الإعدادات بنجاح');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      setSaveMessage('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (section: keyof SiteSettings, field: string, value: string | number | boolean) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value
      }
    }));
  };

  const updateNestedSetting = (section: keyof SiteSettings, subsection: string, field: string, value: string | boolean) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [subsection]: {
          ...(prev![section] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  const tabs = [
    { id: 'company', label: 'معلومات الشركة', icon: Globe },
    { id: 'social', label: 'وسائل التواصل', icon: MessageCircle },
    { id: 'seo', label: 'تحسين محركات البحث', icon: Globe },
    { id: 'appearance', label: 'المظهر', icon: Palette },
    { id: 'features', label: 'المميزات', icon: Settings },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'notifications', label: 'الإشعارات', icon: AlertCircle },
    { id: 'maintenance', label: 'الصيانة', icon: Settings }
  ];

  const daysOfWeek = [
    { key: 'sunday', name: 'الأحد' },
    { key: 'monday', name: 'الإثنين' },
    { key: 'tuesday', name: 'الثلاثاء' },
    { key: 'wednesday', name: 'الأربعاء' },
    { key: 'thursday', name: 'الخميس' },
    { key: 'friday', name: 'الجمعة' },
    { key: 'saturday', name: 'السبت' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">حدث خطأ في تحميل الإعدادات</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            إعدادات الموقع
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة الإعدادات العامة للموقع والتطبيق
          </p>
        </div>
        
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg flex items-center ${
          saveMessage.includes('نجاح') 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
        }`}>
          {saveMessage.includes('نجاح') ? (
            <Check className="h-5 w-5 mr-2" />
          ) : (
            <X className="h-5 w-5 mr-2" />
          )}
          {saveMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Company Information Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اسم الشركة
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => setSettings({...settings, companyEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={settings.companyPhone}
                    onChange={(e) => setSettings({...settings, companyPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الموقع الإلكتروني
                  </label>
                  <input
                    type="url"
                    value={settings.companyWebsite}
                    onChange={(e) => setSettings({...settings, companyWebsite: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف الشركة
                </label>
                <textarea
                  value={settings.companyDescription}
                  onChange={(e) => setSettings({...settings, companyDescription: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={settings.companyAddress}
                    onChange={(e) => setSettings({...settings, companyAddress: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المدينة
                  </label>
                  <input
                    type="text"
                    value={settings.companyCity}
                    onChange={(e) => setSettings({...settings, companyCity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الدولة
                  </label>
                  <input
                    type="text"
                    value={settings.companyCountry}
                    onChange={(e) => setSettings({...settings, companyCountry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">ساعات العمل</h3>
                <div className="space-y-3">
                  {daysOfWeek.map((day) => (
                    <div key={day.key} className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-20">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {day.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.businessHours[day.key]?.isOpen || false}
                          onChange={(e) => updateNestedSetting('businessHours', day.key, 'isOpen', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-4">مفتوح</span>
                      </div>
                      
                      {settings.businessHours[day.key]?.isOpen && (
                        <>
                          <input
                            type="time"
                            value={settings.businessHours[day.key]?.open || '09:00'}
                            onChange={(e) => updateNestedSetting('businessHours', day.key, 'open', e.target.value)}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded
                                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                          />
                          <span className="text-gray-500">إلى</span>
                          <input
                            type="time"
                            value={settings.businessHours[day.key]?.close || '17:00'}
                            onChange={(e) => updateNestedSetting('businessHours', day.key, 'close', e.target.value)}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded
                                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  واتساب
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.whatsapp}
                  onChange={(e) => updateSetting('socialMedia', 'whatsapp', e.target.value)}
                  placeholder="+966501234567"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تليجرام
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.telegram}
                  onChange={(e) => updateSetting('socialMedia', 'telegram', e.target.value)}
                  placeholder="@username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تويتر
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.twitter}
                  onChange={(e) => updateSetting('socialMedia', 'twitter', e.target.value)}
                  placeholder="@username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  إنستاجرام
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.instagram}
                  onChange={(e) => updateSetting('socialMedia', 'instagram', e.target.value)}
                  placeholder="username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  لينكد إن
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.linkedin}
                  onChange={(e) => updateSetting('socialMedia', 'linkedin', e.target.value)}
                  placeholder="company/name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  فيسبوك
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.facebook}
                  onChange={(e) => updateSetting('socialMedia', 'facebook', e.target.value)}
                  placeholder="pagename"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان الموقع
                </label>
                <input
                  type="text"
                  value={settings.seo.title}
                  onChange={(e) => updateSetting('seo', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف الموقع
                </label>
                <textarea
                  value={settings.seo.description}
                  onChange={(e) => updateSetting('seo', 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الكلمات المفتاحية (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={settings.seo.keywords}
                  onChange={(e) => updateSetting('seo', 'keywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اللون الأساسي
                  </label>
                  <input
                    type="color"
                    value={settings.theme.primaryColor}
                    onChange={(e) => updateSetting('theme', 'primaryColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 dark:border-gray-700 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اللون الثانوي
                  </label>
                  <input
                    type="color"
                    value={settings.theme.secondaryColor}
                    onChange={(e) => updateSetting('theme', 'secondaryColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 dark:border-gray-700 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    لون التمييز
                  </label>
                  <input
                    type="color"
                    value={settings.theme.accentColor}
                    onChange={(e) => updateSetting('theme', 'accentColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 dark:border-gray-700 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اللغة الافتراضية
                  </label>
                  <select
                    value={settings.theme.language}
                    onChange={(e) => updateSetting('theme', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.theme.rtl}
                      onChange={(e) => updateSetting('theme', 'rtl', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      اتجاه النص من اليمين لليسار (RTL)
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.theme.darkMode}
                      onChange={(e) => updateSetting('theme', 'darkMode', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      الوضع المظلم افتراضياً
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(settings.features).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSetting('features', key, e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {key === 'enableRegistration' && 'تفعيل التسجيل'}
                    {key === 'enableComments' && 'تفعيل التعليقات'}
                    {key === 'enableNotifications' && 'تفعيل الإشعارات'}
                    {key === 'enableAnalytics' && 'تفعيل التحليلات'}
                    {key === 'enableMultiLanguage' && 'تفعيل تعدد اللغات'}
                    {key === 'enableDarkMode' && 'تفعيل الوضع المظلم'}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عدد محاولات تسجيل الدخول المسموحة
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    مهلة انتهاء الجلسة (دق��قة)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                {Object.entries(settings.security).filter(([key]) => typeof settings.security[key as keyof typeof settings.security] === 'boolean').map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value as boolean}
                      onChange={(e) => updateSetting('security', key, e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {key === 'enableCaptcha' && 'تفعيل الكابتشا'}
                      {key === 'enableTwoFactor' && 'تفعيل المصادقة الثنائية'}
                      {key === 'enableSSL' && 'تفعيل الاتصال الآمن SSL'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {key === 'emailNotifications' && 'إشعارات البريد الإلكتروني'}
                    {key === 'smsNotifications' && 'إشعارات الرسائل النصية'}
                    {key === 'whatsappNotifications' && 'إشعارات الواتساب'}
                    {key === 'newOrderNotification' && 'إشعار الطلبات الجديدة'}
                    {key === 'paymentNotification' && 'إشعار المدفوعات'}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.maintenance.enabled}
                  onChange={(e) => updateSetting('maintenance', 'enabled', e.target.checked)}
                  className="mr-3"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  تفعيل وضع الصيانة
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رسالة الصيانة
                </label>
                <textarea
                  value={settings.maintenance.message}
                  onChange={(e) => updateSetting('maintenance', 'message', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عناوين IP المسموحة (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={settings.maintenance.allowedIPs.join(', ')}
                  onChange={(e) => updateSetting('maintenance', 'allowedIPs', e.target.value.split(',').map(ip => ip.trim()))}
                  placeholder="192.168.1.1, 10.0.0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              {settings.maintenance.enabled && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      وضع الصيانة مفعل. الزوار سيرون رسالة الصيانة بدلاً من الموقع.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
