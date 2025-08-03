import React, { useState } from 'react';
import {
  Settings, Shield, Bell, Globe, Palette, Database, Cloud,
  Users, Lock, Eye, EyeOff, Save, RefreshCw, Download,
  Upload, Trash2, Plus, Edit, Check, X, AlertTriangle,
  Mail, Phone, MessageCircle, Wifi, Server, Cpu, HardDrive
} from 'lucide-react';
import {
  SuperButton,
  EnhancedCard,
  SuperThemeToggle,
  SuperLanguageToggle
} from '../ui';
import { EnhancedInput, EnhancedTextarea } from '../forms/EnhancedForm';

interface SettingCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface SecuritySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  type: 'toggle' | 'input' | 'select';
  value?: string;
  options?: string[];
}

const AdvancedSettingsPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'KYC Trust Platform',
    siteDescription: 'منصة موثوقة للتحقق من الهوية والامتثال',
    siteUrl: 'https://kyctrust.com',
    adminEmail: 'admin@kyctrust.com',
    supportEmail: 'support@kyctrust.com',
    timezone: 'Africa/Cairo',
    language: 'ar',
    currency: 'EGP'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: 'two-factor',
      title: 'المصادقة الثنائية',
      description: 'تفعيل المصادقة الثنائية لحسابات الإدارة',
      enabled: true,
      type: 'toggle'
    },
    {
      id: 'session-timeout',
      title: 'انتهاء صلاحية الجلسة',
      description: 'المدة بالدقائق قبل انتهاء صلاحية الجلسة',
      enabled: true,
      type: 'input',
      value: '30'
    },
    {
      id: 'password-complexity',
      title: 'تعقيد كلمة المرور',
      description: 'مستوى التعقيد المطلوب لكلمات المرور',
      enabled: true,
      type: 'select',
      value: 'high',
      options: ['low', 'medium', 'high', 'very-high']
    },
    {
      id: 'login-attempts',
      title: 'محاولات تسجيل الدخول',
      description: 'عدد المحاولات المسموحة قبل حظر الحساب',
      enabled: true,
      type: 'input',
      value: '5'
    },
    {
      id: 'ip-whitelist',
      title: 'قائمة IP المسموحة',
      description: 'السماح بالوصول من عناوين IP محددة فقط',
      enabled: false,
      type: 'toggle'
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    orderAlerts: true,
    systemAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    monthlyReports: true
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    compressionEnabled: true,
    backupFrequency: 'daily',
    logRetention: '30',
    maxFileSize: '10',
    allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx'
  });

  const categories: SettingCategory[] = [
    {
      id: 'general',
      title: 'الإعدادات العامة',
      description: 'إعدادات الموقع الأساسية',
      icon: <Settings className="h-5 w-5" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'security',
      title: 'الأمان والحماية',
      description: 'إعدادات الأمان والخصوصية',
      icon: <Shield className="h-5 w-5" />,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'notifications',
      title: 'الإشعارات',
      description: 'إعدادات الإشعارات والتنبيهات',
      icon: <Bell className="h-5 w-5" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'system',
      title: 'النظام',
      description: 'إعدادات النظام المتقدمة',
      icon: <Server className="h-5 w-5" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'appearance',
      title: 'المظهر',
      description: 'إعدادات المظهر والثيم',
      icon: <Palette className="h-5 w-5" />,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'backup',
      title: 'النسخ الاحتياطية',
      description: 'إعدادات النسخ الاحتيا��ية',
      icon: <Database className="h-5 w-5" />,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    // Show success notification
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <EnhancedCard variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          معلومات الموقع الأساسية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnhancedInput
            label="اسم الموقع"
            value={generalSettings.siteName}
            onChange={(value) => setGeneralSettings(prev => ({ ...prev, siteName: value }))}
            placeholder="اسم الموقع"
          />
          <EnhancedInput
            label="رابط الموقع"
            value={generalSettings.siteUrl}
            onChange={(value) => setGeneralSettings(prev => ({ ...prev, siteUrl: value }))}
            placeholder="https://example.com"
            type="url"
          />
          <EnhancedInput
            label="بريد المدير"
            value={generalSettings.adminEmail}
            onChange={(value) => setGeneralSettings(prev => ({ ...prev, adminEmail: value }))}
            placeholder="admin@example.com"
            type="email"
          />
          <EnhancedInput
            label="بريد الدعم"
            value={generalSettings.supportEmail}
            onChange={(value) => setGeneralSettings(prev => ({ ...prev, supportEmail: value }))}
            placeholder="support@example.com"
            type="email"
          />
        </div>
        <div className="mt-6">
          <EnhancedTextarea
            label="وصف الموقع"
            value={generalSettings.siteDescription}
            onChange={(value) => setGeneralSettings(prev => ({ ...prev, siteDescription: value }))}
            placeholder="وصف مختصر عن الموقع"
            rows={3}
          />
        </div>
      </EnhancedCard>

      <EnhancedCard variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          الإعدادات الإقليمية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              المنطقة الزمنية
            </label>
            <select
              value={generalSettings.timezone}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="Africa/Cairo">القاهرة (GMT+2)</option>
              <option value="Asia/Riyadh">الرياض (GMT+3)</option>
              <option value="Asia/Dubai">دبي (GMT+4)</option>
              <option value="UTC">توقيت عالمي (UTC)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اللغة الافتراضية
            </label>
            <select
              value={generalSettings.language}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              العملة الافتراضية
            </label>
            <select
              value={generalSettings.currency}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, currency: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="EGP">جنيه مصري (EGP)</option>
              <option value="SAR">ريال سعودي (SAR)</option>
              <option value="USD">دولار أمريكي (USD)</option>
              <option value="EUR">يورو (EUR)</option>
            </select>
          </div>
        </div>
      </EnhancedCard>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <EnhancedCard variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          إعدادات الأمان
        </h3>
        <div className="space-y-4">
          {securitySettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {setting.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {setting.description}
                </p>
              </div>
              <div className="ml-4">
                {setting.type === 'toggle' && (
                  <button
                    onClick={() => {
                      setSecuritySettings(prev => 
                        prev.map(s => s.id === setting.id ? { ...s, enabled: !s.enabled } : s)
                      );
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      setting.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}
                {setting.type === 'input' && (
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => {
                      setSecuritySettings(prev => 
                        prev.map(s => s.id === setting.id ? { ...s, value: e.target.value } : s)
                      );
                    }}
                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  />
                )}
                {setting.type === 'select' && setting.options && (
                  <select
                    value={setting.value}
                    onChange={(e) => {
                      setSecuritySettings(prev => 
                        prev.map(s => s.id === setting.id ? { ...s, value: e.target.value } : s)
                      );
                    }}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  >
                    {setting.options.map(option => (
                      <option key={option} value={option}>
                        {option === 'low' ? 'منخفض' : 
                         option === 'medium' ? 'متوسط' : 
                         option === 'high' ? 'عالي' : 
                         option === 'very-high' ? 'عالي جداً' : option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </EnhancedCard>

      <EnhancedCard variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          مفاتيح API
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">مفتاح API الرئيسي</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {showApiKey ? 'sk_live_1234567890abcdef' : '••••••••••••••••'}
              </p>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <SuperButton
                variant="ghost"
                size="sm"
                icon={showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                onClick={() => setShowApiKey(!showApiKey)}
              />
              <SuperButton
                variant="ghost"
                size="sm"
                icon={<RefreshCw className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      </EnhancedCard>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <EnhancedCard variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          إعدادات المظهر والثيم
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">مبدل المظهر</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">تبديل بين الوضع الفاتح والمظلم</p>
            </div>
            <SuperThemeToggle />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">مبدل اللغة</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">اختيار لغة الواجهة</p>
            </div>
            <SuperLanguageToggle />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">ألوان النظام</h4>
            <div className="grid grid-cols-6 gap-3">
              {[
                { name: 'أزرق', color: '#3B82F6' },
                { name: 'أخضر', color: '#10B981' },
                { name: 'بنفسجي', color: '#8B5CF6' },
                { name: 'برتقالي', color: '#F59E0B' },
                { name: 'أحمر', color: '#EF4444' },
                { name: 'رمادي', color: '#6B7280' }
              ].map((colorOption) => (
                <button
                  key={colorOption.name}
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: colorOption.color }}
                  title={colorOption.name}
                />
              ))}
            </div>
          </div>
        </div>
      </EnhancedCard>
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return (
          <EnhancedCard variant="elevated" className="p-12 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              قسم قيد التطوير
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              هذا القسم قيد التطوير وسيكون متاحاً قريباً
            </p>
          </EnhancedCard>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">الإعدادات المتقدمة</h1>
          <p className="text-gray-600 dark:text-gray-400">إدارة وتخصيص إعدادات النظام</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <SuperButton
            variant="outline"
            icon={<Download className="h-4 w-4" />}
          >
            تصدير الإعدادات
          </SuperButton>
          <SuperButton
            variant="primary"
            icon={<Save className="h-4 w-4" />}
            loading={isSaving}
            onClick={handleSave}
          >
            حفظ التغييرات
          </SuperButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <EnhancedCard variant="elevated" className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              أقسام الإعدادات
            </h3>
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center space-x-3 space-x-reverse px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={activeCategory === category.id ? 'text-white' : 'text-gray-500'}>
                    {category.icon}
                  </div>
                  <div className="flex-1 text-right">
                    <div className="font-semibold">{category.title}</div>
                    <div className={`text-xs ${
                      activeCategory === category.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {category.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </EnhancedCard>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettingsPanel;
