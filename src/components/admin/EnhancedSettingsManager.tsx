import React, { useState, useEffect } from 'react';
import {
  Save, Settings, Globe, Phone, Mail, MapPin, Building,
  User, Shield, Palette, Bell, Download, Upload, RefreshCw,
  Eye, EyeOff, Copy, CheckCircle, AlertCircle, Info
} from 'lucide-react';
import EnhancedButton from '../ui/EnhancedButton';
import EnhancedCard from '../ui/EnhancedCard';
import { env } from '../../utils/env';
import toast from 'react-hot-toast';

interface GeneralSettings {
  site: {
    name: string;
    description: string;
    logo: string;
    favicon: string;
    language: 'ar' | 'en';
    timezone: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    workingHours: string;
  };
  company: {
    name: string;
    registration: string;
    taxId: string;
    country: string;
    city: string;
  };
  social: {
    website: string;
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    orderNotifications: boolean;
    systemNotifications: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
    compactMode: boolean;
  };
}

export const EnhancedSettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<GeneralSettings>({
    site: {
      name: 'KYCtrust',
      description: 'منصة رائدة في الخدمات المالية الرقمية',
      logo: '',
      favicon: '',
      language: 'ar',
      timezone: 'Asia/Riyadh'
    },
    contact: {
      phone: '+201062453344',
      whatsapp: '+201062453344',
      email: 'info@kyctrust.com',
      address: 'القاهرة، جمهورية مصر العربية',
      workingHours: 'الأحد - الخميس: 9:00 ص - 6:00 م'
    },
    company: {
      name: 'KYCtrust',
      registration: '',
      taxId: '',
      country: 'مصر',
      city: 'القاهرة'
    },
    social: {
      website: 'https://kyctrust.com',
      facebook: 'https://facebook.com/kyctrust',
      twitter: 'https://twitter.com/kyctrust',
      instagram: 'https://instagram.com/kyctrust',
      linkedin: 'https://linkedin.com/company/kyctrust',
      youtube: ''
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      orderNotifications: true,
      systemNotifications: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8
    },
    appearance: {
      primaryColor: '#3B82F6',
      secondaryColor: '#6366F1',
      darkMode: false,
      compactMode: false
    }
  });

  const [activeTab, setActiveTab] = useState('site');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('kyc-general-settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('kyc-general-settings', JSON.stringify(settings));
      setHasChanges(false);
      toast.success('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (category: keyof GeneralSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const resetSettings = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات للقيم الافتراضية؟')) {
      localStorage.removeItem('kyc-general-settings');
      window.location.reload();
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kyctrust-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير الإعدادات');
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        setHasChanges(true);
        toast.success('تم استيراد الإعدادات بنجاح');
      } catch (error) {
        toast.error('ملف غير صالح');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('تم نسخ النص');
  };

  const tabs = [
    { id: 'site', label: 'الموقع', icon: Globe },
    { id: 'contact', label: 'التواصل', icon: Phone },
    { id: 'company', label: 'الشركة', icon: Building },
    { id: 'social', label: 'وسائل التواصل', icon: User },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'appearance', label: 'المظهر', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <EnhancedCard variant="elevated" padding="lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              الإعدادات العامة
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              إدارة إعدادات الموقع والشركة والتواصل
            </p>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            {hasChanges && (
              <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 rounded-full text-sm">
                تغييرات غير محفوظة
              </span>
            )}
            
            <EnhancedButton
              variant="secondary"
              onClick={resetSettings}
              icon={RefreshCw}
            >
              إعادة تعيين
            </EnhancedButton>
            
            <EnhancedButton
              variant="info"
              onClick={exportSettings}
              icon={Download}
            >
              تصدير
            </EnhancedButton>
            
            <label>
              <EnhancedButton
                variant="success"
                as="span"
                icon={Upload}
              >
                استيراد
              </EnhancedButton>
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="hidden"
              />
            </label>
            
            <EnhancedButton
              variant="primary"
              onClick={saveSettings}
              loading={isLoading}
              disabled={!hasChanges}
              icon={Save}
              glow
            >
              حفظ التغييرات
            </EnhancedButton>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-6">
          {tabs.map(tab => (
            <EnhancedButton
              key={tab.id}
              variant={activeTab === tab.id ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              icon={tab.icon}
            >
              {tab.label}
            </EnhancedButton>
          ))}
        </div>
      </EnhancedCard>

      {/* Tab Content */}
      <EnhancedCard variant="elevated" padding="lg">
        {/* Site Settings */}
        {activeTab === 'site' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              إعدادات الموقع
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اسم الموقع
                </label>
                <input
                  type="text"
                  value={settings.site.name}
                  onChange={(e) => updateSetting('site', 'name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اللغة الافتراضية
                </label>
                <select
                  value={settings.site.language}
                  onChange={(e) => updateSetting('site', 'language', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف الموقع
                </label>
                <textarea
                  value={settings.site.description}
                  onChange={(e) => updateSetting('site', 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact Settings */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              معلومات التواصل
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.contact.phone}
                    onChange={(e) => updateSetting('contact', 'phone', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(settings.contact.phone)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  واتساب
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.contact.whatsapp}
                    onChange={(e) => updateSetting('contact', 'whatsapp', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(settings.contact.whatsapp)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={settings.contact.email}
                  onChange={(e) => updateSetting('contact', 'email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ساعات العمل
                </label>
                <input
                  type="text"
                  value={settings.contact.workingHours}
                  onChange={(e) => updateSetting('contact', 'workingHours', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  العنوان
                </label>
                <textarea
                  value={settings.contact.address}
                  onChange={(e) => updateSetting('contact', 'address', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              إعدادات المظهر
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اللون الأساسي
                </label>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                    className="w-16 h-12 border border-gray-300 dark:border-gray-700 rounded-lg"
                  />
                  <input
                    type="text"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اللون الثانوي
                </label>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="color"
                    value={settings.appearance.secondaryColor}
                    onChange={(e) => updateSetting('appearance', 'secondaryColor', e.target.value)}
                    className="w-16 h-12 border border-gray-300 dark:border-gray-700 rounded-lg"
                  />
                  <input
                    type="text"
                    value={settings.appearance.secondaryColor}
                    onChange={(e) => updateSetting('appearance', 'secondaryColor', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">الوضع المظلم</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">تفعيل الوضع المظلم افتراضياً</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.appearance.darkMode}
                  onChange={(e) => updateSetting('appearance', 'darkMode', e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">الوضع المضغوط</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">عرض مضغوط للواجهة</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.appearance.compactMode}
                  onChange={(e) => updateSetting('appearance', 'compactMode', e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Add other tab contents as needed */}
      </EnhancedCard>

      {/* Quick Actions */}
      <EnhancedCard variant="glass" padding="md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Info className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ستظهر التغييرات في الموقع فوراً بعد الحفظ
            </span>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-xs text-gray-500">
              آخر تحديث: {new Date().toLocaleString('ar-EG')}
            </span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        </div>
      </EnhancedCard>
    </div>
  );
};

export default EnhancedSettingsManager;
