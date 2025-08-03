import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Shield, Bell, Settings, Eye, EyeOff, 
  Camera, Save, History,
  AlertTriangle, Check, X, Clock, Key,
  UserCheck, Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  hashPassword, 
  verifyPassword, 
  validatePasswordStrength,
  generateSecurePassword 
} from '../../utils/auth';
import * as databaseService from '../../services/database';

interface AdminProfile {
  // Personal Information
  username: string;
  displayName: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  location: string;
  timezone: string;
  
  // Security Settings
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  allowedIPs: string[];
  lastPasswordChange: string;
  
  // Preferences
  language: string;
  theme: 'light' | 'dark' | 'auto';
  dashboardLayout: 'grid' | 'list' | 'compact';
  itemsPerPage: number;
  enableSounds: boolean;
  enableAnimations: boolean;
  
  // Notifications
  emailNotifications: {
    newOrders: boolean;
    systemAlerts: boolean;
    securityWarnings: boolean;
    maintenanceUpdates: boolean;
    weeklyReports: boolean;
  };
  
  // Activity Tracking
  lastLogin: string;
  loginCount: number;
  activityLog: Array<{
    action: string;
    timestamp: string;
    ip: string;
    userAgent: string;
  }>;
  
  // Role & Permissions
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export const AdminSettingsManager: React.FC = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState<any>(null);

  useEffect(() => {
    const loadAdminProfile = async () => {
      setIsLoading(true);
      try {
        const adminProfile = await databaseService.getAdminProfile();
        setProfile(adminProfile);
      } catch (error) {
        console.error('خطأ في تحميل ملف المدير:', error);
        toast.error('فشل في تحميل بيانات المدير');
      } finally {
        setIsLoading(false);
      }
    };
    loadAdminProfile();
  }, []);

  useEffect(() => {
    if (newPassword) {
      const strength = validatePasswordStrength(newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  }, [newPassword]);

  const saveProfile = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const { ...updates } = profile;
      await databaseService.updateAdminProfile(updates.user_id, updates);
      
      setSaveMessage('تم حفظ الملف الشخصي بنجاح');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('خطأ في حفظ الملف الشخصي:', error);
      setSaveMessage('حدث خطأ أثناء حفظ الملف الشخصي');
      toast.error('فشل في حفظ الملف الشخصي');
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('كلمة المرور الجديدة وتأكيدها غير متطابقتين');
      return;
    }

    if (!passwordStrength?.isValid) {
      toast.error('كلمة المرور الجديدة غير قوية بما فيه الكفاية');
      return;
    }

    try {
      // Verify current password
      const storedHash = localStorage.getItem('kyctrust_admin_password_hash');
      if (storedHash) {
        const isCurrentValid = await verifyPassword(currentPassword, storedHash);
        if (!isCurrentValid) {
          toast.error('كلمة المرور الحالية غير صحيحة');
          return;
        }
      }

      // Hash and save new password
      const newHash = await hashPassword(newPassword);
      localStorage.setItem('kyctrust_admin_password_hash', newHash);

      // Update profile
      if (profile) {
        const updatedProfile = {
          ...profile,
          lastPasswordChange: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProfile(updatedProfile);
        localStorage.setItem('kyc-admin-profile', JSON.stringify(updatedProfile));
      }

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStrength(null);

      toast.success('تم تغيير كلمة المرور بنجاح');
    } catch (error) {
      console.error('خطأ في تغيير كلمة المرور:', error);
      toast.error('حدث خطأ أثناء تغيير كلمة المرور');
    }
  };

  const generateRandomPassword = () => {
    const generated = generateSecurePassword();
    setNewPassword(generated);
    setConfirmPassword(generated);
    toast.success('تم إنشاء كلمة مرور قوية تلقائياً');
  };

  const updateProfile = (field: string, value: string | number | boolean) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const updateNestedProfile = (section: string, field: string, value: boolean) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [section]: {
        ...profile[section as keyof AdminProfile] as object,
        [field]: value
      }
    });
  };

  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'preferences', label: 'التفضيلات', icon: Settings },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'activity', label: 'سجل النشاط', icon: History },
    { id: 'permissions', label: 'الصلاحيات', icon: Key }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">حدث خطأ في تحميل الملف الشخصي</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            إعدادات المدير
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة الملف الشخصي والأمان والتفضيلات
          </p>
        </div>
        
        <button
          onClick={saveProfile}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
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
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6 space-x-reverse">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                    {profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt={profile.displayName}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border border-gray-200 dark:border-gray-700">
                    <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {profile.displayName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{profile.username}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {profile.role === 'super_admin' ? 'مدير عام' : 
                     profile.role === 'admin' ? 'مدير' : 'مشرف'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اسم المستخدم
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => updateProfile('username', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => updateProfile('displayName', e.target.value)}
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
                    value={profile.email}
                    onChange={(e) => updateProfile('email', e.target.value)}
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
                    value={profile.phone}
                    onChange={(e) => updateProfile('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الموقع
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => updateProfile('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المنطقة الزمنية
                  </label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => updateProfile('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                    <option value="Asia/Dubai">دبي (GMT+4)</option>
                    <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                    <option value="Europe/London">لندن (GMT+0)</option>
                    <option value="America/New_York">نيويورك (GMT-5)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  النبذة الشخصية
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => updateProfile('bio', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Password Change Section */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  تغيير كلمة المرور
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      كلمة المرور الحالية
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg
                                 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        كلمة المرور الجديدة
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        إنشاء كلمة مرور قوية
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg
                                 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {passwordStrength && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">قوة كلمة المرور:</span>
                          <span className={`font-medium ${
                            passwordStrength.score >= 4 ? 'text-green-600' :
                            passwordStrength.score >= 3 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {passwordStrength.score >= 4 ? 'قوية جداً' :
                             passwordStrength.score >= 3 ? 'قوية' :
                             passwordStrength.score >= 2 ? 'متوسطة' : 'ضعيفة'}
                          </span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.score >= 4 ? 'bg-green-500' :
                              passwordStrength.score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                          />
                        </div>
                        <div className="mt-2 space-y-1">
                          {passwordStrength.requirements.map((req: { met: boolean; text: string }, index: number) => (
                            <div key={index} className="flex items-center text-xs">
                              {req.met ? (
                                <Check className="h-3 w-3 text-green-500 mr-1" />
                              ) : (
                                <X className="h-3 w-3 text-red-500 mr-1" />
                              )}
                              <span className={req.met ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                {req.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      تأكيد كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg
                                 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={changePassword}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    تغيير كلمة المرور
                  </button>
                </div>
              </div>

              {/* Security Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  إعدادات الأمان
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        المصادقة الثنائية
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        تفعيل المصادقة الثنائية لحماية إضافية
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.twoFactorEnabled}
                      onChange={(e) => updateProfile('twoFactorEnabled', e.target.checked)}
                      className="toggle"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        إشعارات تسجيل الدخول
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        تلقي إشعار عند تسجيل دخول جديد
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.loginNotifications}
                      onChange={(e) => updateProfile('loginNotifications', e.target.checked)}
                      className="toggle"
                    />
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    مهلة انتهاء الجلسة (دقيقة)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={profile.sessionTimeout}
                    onChange={(e) => updateProfile('sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اللغة
                  </label>
                  <select
                    value={profile.language}
                    onChange={(e) => updateProfile('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نمط المظهر
                  </label>
                  <select
                    value={profile.theme}
                    onChange={(e) => updateProfile('theme', e.target.value as 'light' | 'dark' | 'auto')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="light">فاتح</option>
                    <option value="dark">مظلم</option>
                    <option value="auto">تلقائي</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تخطيط لوحة التحكم
                  </label>
                  <select
                    value={profile.dashboardLayout}
                    onChange={(e) => updateProfile('dashboardLayout', e.target.value as 'grid' | 'list' | 'compact')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="grid">شبكة</option>
                    <option value="list">قائمة</option>
                    <option value="compact">مضغوط</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عدد العناصر لكل صفحة
                  </label>
                  <select
                    value={profile.itemsPerPage}
                    onChange={(e) => updateProfile('itemsPerPage', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.enableSounds}
                    onChange={(e) => updateProfile('enableSounds', e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    تفعيل الأصوات
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.enableAnimations}
                    onChange={(e) => updateProfile('enableAnimations', e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    تفعيل الرسوم المتحركة
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                إعدادات الإشعارات
              </h3>
              
              {Object.entries(profile.emailNotifications).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {key === 'newOrders' && 'إشعارات الطلبات الجديدة'}
                      {key === 'systemAlerts' && 'تنبيهات النظام'}
                      {key === 'securityWarnings' && 'تحذيرات الأمان'}
                      {key === 'maintenanceUpdates' && 'تحديثات الصيانة'}
                      {key === 'weeklyReports' && 'التقارير الأسبوعية'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateNestedProfile('emailNotifications', key, e.target.checked)}
                    className="toggle"
                  />
                </label>
              ))}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div className="mr-3">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        آخر تسجيل دخول
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        {new Date(profile.lastLogin).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <div className="mr-3">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        عدد مرات تسجيل الدخول
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        {profile.loginCount.toLocaleString('ar-SA')} مرة
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <div className="mr-3">
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                        عضو منذ
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        {new Date(profile.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                  سجل النشاط الأخير
                </h4>
                <div className="space-y-3">
                  {profile.activityLog.slice(0, 10).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(activity.timestamp).toLocaleString('ar-SA')}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        IP: {activity.ip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                  الدور الحالي: {profile.role === 'super_admin' ? 'مدير عام' : 
                                 profile.role === 'admin' ? 'مدير' : 'مشرف'}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  هذا المستخدم لديه صلاحيات كاملة في النظام
                </p>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                  الصلاحيات المتاحة
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                      <span className="text-sm text-green-800 dark:text-green-200">
                        {permission === 'manage_users' && 'إدارة المستخدمين'}
                        {permission === 'manage_settings' && 'إدارة الإعدادات'}
                        {permission === 'manage_orders' && 'إدارة الطلبات'}
                        {permission === 'manage_services' && 'إدارة الخدمات'}
                        {permission === 'view_analytics' && 'عرض التحليلات'}
                        {permission === 'system_admin' && 'إدارة النظام'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsManager;
