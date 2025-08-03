import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Upload, Download, RefreshCw, Eye, EyeOff,
  Globe, Palette, Shield, Bell, Database, Smartphone,
  Mail, Phone, MapPin, Clock, Users, CreditCard,
  Facebook, Twitter, Instagram, Youtube, Linkedin,
  AlertCircle, CheckCircle, X, Plus, Trash2
} from 'lucide-react';
import { 
  SuperButton, 
  EnhancedCard, 
  EnhancedLanguageToggle, 
  EnhancedThemeToggle 
} from '../ui';

interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
}

interface CompanyInfo {
  name: string;
  description: string;
  logo: string;
  slogan: string;
  establishedYear: string;
  employeesCount: string;
}

interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  telegram: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  orderAlerts: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginAttempts: number;
  ipWhitelist: string[];
}

interface AppearanceSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius: number;
  fontSize: string;
  fontFamily: string;
  animation: boolean;
  darkModeDefault: boolean;
}

interface PaymentSettings {
  currency: string;
  paymentMethods: string[];
  taxRate: number;
  processingFee: number;
  minimumOrder: number;
  maximumOrder: number;
}

const EnhancedSettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Settings States
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '+201062453344',
    whatsapp: '+201062453344',
    email: 'info@kyctrust.com',
    address: 'القاهرة، مصر',
    workingHours: '9:00 ص - 6:00 م'
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'KYC Trust Platform',
    description: 'منصة موثوقة للتحقق من الهوية والامتثال',
    logo: '',
    slogan: 'الثقة والأمان في التحقق',
    establishedYear: '2024',
    employeesCount: '10-50'
  });

  const [socialMedia, setSocialMedia] = useState<SocialMedia>({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    telegram: ''
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    orderAlerts: true,
    systemUpdates: true,
    marketingEmails: false
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: []
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    primaryColor: '#3B82F6',
    secondaryColor: '#6B7280',
    accentColor: '#8B5CF6',
    borderRadius: 8,
    fontSize: 'medium',
    fontFamily: 'system',
    animation: true,
    darkModeDefault: false
  });

  const [payment, setPayment] = useState<PaymentSettings>({
    currency: 'EGP',
    paymentMethods: ['credit_card', 'vodafone_cash', 'usdt'],
    taxRate: 14,
    processingFee: 2.5,
    minimumOrder: 100,
    maximumOrder: 50000
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const savedSettings = localStorage.getItem('kyc-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setContactInfo(settings.contactInfo || contactInfo);
        setCompanyInfo(settings.companyInfo || companyInfo);
        setSocialMedia(settings.socialMedia || socialMedia);
        setNotifications(settings.notifications || notifications);
        setSecurity(settings.security || security);
        setAppearance(settings.appearance || appearance);
        setPayment(settings.payment || payment);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settings = {
        contactInfo,
        companyInfo,
        socialMedia,
        notifications,
        security,
        appearance,
        payment,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('kyc-settings', JSON.stringify(settings));
      
      // Update environment variables
      if (contactInfo.whatsapp) {
        localStorage.setItem('VITE_WHATSAPP_NUMBER', contactInfo.whatsapp);
      }
      
      setHasChanges(false);
      alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const exportSettings = () => {
    const settings = {
      contactInfo,
      companyInfo,
      socialMedia,
      notifications,
      security,
      appearance,
      payment,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kyc-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        setContactInfo(settings.contactInfo || contactInfo);
        setCompanyInfo(settings.companyInfo || companyInfo);
        setSocialMedia(settings.socialMedia || socialMedia);
        setNotifications(settings.notifications || notifications);
        setSecurity(settings.security || security);
        setAppearance(settings.appearance || appearance);
        setPayment(settings.payment || payment);
        setHasChanges(true);
        alert('تم استيراد الإعدادات بنجاح');
      } catch (error) {
        alert('ملف الإعدادات غير صالح');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const resetToDefaults = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
      localStorage.removeItem('kyc-settings');
      loadSettings();
      setHasChanges(true);
    }
  };

  const tabs = [
    { id: 'general', label: 'عام', icon: Settings },
    { id: 'contact', label: 'معلومات الاتصال', icon: Phone },
    { id: 'company', label: 'معلومات الشركة', icon: Users },
    { id: 'social', label: 'وسائل التواصل', icon: Globe },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'appearance', label: 'المظهر', icon: Palette },
    { id: 'payment', label: 'الدفع', icon: CreditCard }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <EnhancedCard variant="default" className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                الإعدادات العامة
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">اللغة</label>
                    <EnhancedLanguageToggle />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">المظهر</label>
                    <EnhancedThemeToggle />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">المنطقة الزمنية</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                      <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                      <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                      <option value="UTC">توقيت عالمي (UTC)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">تنسيق التاريخ</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <EnhancedCard variant="default" className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                معلومات الاتصال
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => {
                      setContactInfo(prev => ({ ...prev, phone: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="+20xxxxxxxxx"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">رقم الواتساب</label>
                  <input
                    type="tel"
                    value={contactInfo.whatsapp}
                    onChange={(e) => {
                      setContactInfo(prev => ({ ...prev, whatsapp: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="+20xxxxxxxxx"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => {
                      setContactInfo(prev => ({ ...prev, email: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="info@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ساعات العمل</label>
                  <input
                    type="text"
                    value={contactInfo.workingHours}
                    onChange={(e) => {
                      setContactInfo(prev => ({ ...prev, workingHours: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="9:00 ص - 6:00 م"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">العنوان</label>
                  <textarea
                    value={contactInfo.address}
                    onChange={(e) => {
                      setContactInfo(prev => ({ ...prev, address: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="العنوان الكامل"
                  />
                </div>
              </div>
            </EnhancedCard>
          </div>
        );

      case 'company':
        return (
          <div className="space-y-6">
            <EnhancedCard variant="default" className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                معلومات الشركة
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">اسم الشركة</label>
                    <input
                      type="text"
                      value={companyInfo.name}
                      onChange={(e) => {
                        setCompanyInfo(prev => ({ ...prev, name: e.target.value }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">الشعار</label>
                    <input
                      type="text"
                      value={companyInfo.slogan}
                      onChange={(e) => {
                        setCompanyInfo(prev => ({ ...prev, slogan: e.target.value }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">سنة التأسيس</label>
                    <input
                      type="number"
                      value={companyInfo.establishedYear}
                      onChange={(e) => {
                        setCompanyInfo(prev => ({ ...prev, establishedYear: e.target.value }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">عدد الموظفين</label>
                    <select
                      value={companyInfo.employeesCount}
                      onChange={(e) => {
                        setCompanyInfo(prev => ({ ...prev, employeesCount: e.target.value }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                      <option value="1-10">1-10</option>
                      <option value="10-50">10-50</option>
                      <option value="50-100">50-100</option>
                      <option value="100+">100+</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">وصف الشركة</label>
                  <textarea
                    value={companyInfo.description}
                    onChange={(e) => {
                      setCompanyInfo(prev => ({ ...prev, description: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={4}
                    placeholder="وصف مختصر عن الشركة وخدماتها"
                  />
                </div>
              </div>
            </EnhancedCard>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <EnhancedCard variant="default" className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                إعدادات الدفع
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">العملة</label>
                  <select
                    value={payment.currency}
                    onChange={(e) => {
                      setPayment(prev => ({ ...prev, currency: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="EUR">يورو (EUR)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">معدل الضريبة (%)</label>
                  <input
                    type="number"
                    value={payment.taxRate}
                    onChange={(e) => {
                      setPayment(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">رسوم المعالجة (%)</label>
                  <input
                    type="number"
                    value={payment.processingFee}
                    onChange={(e) => {
                      setPayment(prev => ({ ...prev, processingFee: parseFloat(e.target.value) }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">الحد الأدنى للطلب</label>
                  <input
                    type="number"
                    value={payment.minimumOrder}
                    onChange={(e) => {
                      setPayment(prev => ({ ...prev, minimumOrder: parseFloat(e.target.value) }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium mb-3">طرق الدفع المفعلة</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'credit_card', label: 'بطاقة ائتمان' },
                    { id: 'vodafone_cash', label: 'فودافون كاش' },
                    { id: 'usdt', label: 'USDT' },
                    { id: 'bank_transfer', label: 'تحويل بنكي' },
                    { id: 'instapay', label: 'إنستاباي' },
                    { id: 'paypal', label: 'PayPal' }
                  ].map((method) => (
                    <label key={method.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={payment.paymentMethods.includes(method.id)}
                        onChange={(e) => {
                          const methods = e.target.checked
                            ? [...payment.paymentMethods, method.id]
                            : payment.paymentMethods.filter(m => m !== method.id);
                          setPayment(prev => ({ ...prev, paymentMethods: methods }));
                          setHasChanges(true);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </EnhancedCard>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">محتوى هذا القسم قيد التطوير</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="mr-3 text-gray-600 dark:text-gray-400">جاري تحميل الإعدادات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            إعدادات النظام
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة وتخصيص إعدادات المنصة
          </p>
        </div>
        
        <div className="flex items-center space-x-3 space-x-reverse">
          <SuperButton
            variant="outline"
            size="sm"
            onClick={exportSettings}
            icon={<Download className="h-4 w-4" />}
          >
            تصدير
          </SuperButton>
          
          <label>
            <SuperButton
              variant="outline"
              size="sm"
              icon={<Upload className="h-4 w-4" />}
              className="cursor-pointer"
            >
              استيراد
            </SuperButton>
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
            />
          </label>
          
          <SuperButton
            variant={hasChanges ? 'primary' : 'secondary'}
            size="sm"
            onClick={saveSettings}
            loading={isSaving}
            disabled={!hasChanges}
            icon={<Save className="h-4 w-4" />}
          >
            حفظ
          </SuperButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 space-x-reverse overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {renderTabContent()}
      </div>

      {/* Footer Actions */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <EnhancedCard variant="elevated" className="p-4 shadow-lg">
            <div className="flex items-center space-x-3 space-x-reverse">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                لديك تغييرات غير محفوظة
              </span>
              <SuperButton
                variant="primary"
                size="sm"
                onClick={saveSettings}
                loading={isSaving}
                icon={<Save className="h-4 w-4" />}
              >
                حفظ
              </SuperButton>
            </div>
          </EnhancedCard>
        </div>
      )}
    </div>
  );
};

export default EnhancedSettingsManager;
