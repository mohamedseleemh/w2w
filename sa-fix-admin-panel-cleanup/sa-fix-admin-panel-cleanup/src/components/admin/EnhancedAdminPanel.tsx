import React, { useState, useEffect } from 'react';
import {
  Shield, Settings, Package, CreditCard, Inbox, BarChart3, RefreshCw,
  Users, FileText, Database, Edit3, User, Move, Paintbrush,
  Sliders, Grip, Layers, Activity, Zap, Bell, Search,
  Globe, Star,
  Cloud, Server, Cpu, HardDrive, Wifi, Lock, AlertTriangle, BookOpen
} from 'lucide-react';
import LoginForm from './LoginForm';
import AdvancedDashboard from './AdvancedDashboard';
import VisualLandingEditor from './VisualLandingEditor';
import ServicesManager from './ServicesManager';
import PaymentMethodsManager from './PaymentMethodsManager';
import OrdersManager from './OrdersManager';
import SiteSettingsManager from './SiteSettingsManager';
import AdminSettingsManager from './AdminSettingsManager';
import DragDropManager from './DragDropManager';
import ThemeManager from './ThemeManager';
import ServicesLayoutEditor from './ServicesLayoutEditor';
import { AnalyticsPanel } from './AnalyticsPanel';
import UsersManager from './UsersManager';
import ReportsManager from './ReportsManager';
import { BackupManager } from './BackupManager';
import { TemplatesManager } from './TemplatesManager';
import { useData } from '../../context/DataContext';

type TabType = 
  | 'dashboard' 
  | 'visual-editor'
  | 'services' 
  | 'services-layout' 
  | 'payments' 
  | 'orders' 
  | 'analytics' 
  | 'users' 
  | 'reports' 
  | 'backup' 
  | 'drag-drop' 
  | 'themes' 
  | 'admin-settings' 
  | 'settings'
  | 'system-monitor'
  | 'security'
  | 'integrations'
  | 'ai-assistant'
  | 'workflow'
  | 'templates';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
}

const EnhancedAdminPanel: React.FC = () => {
  const { refreshData, loading } = useData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'طلب جديد',
      message: 'تم استلام طلب جديد من أحمد محمد',
      type: 'info',
      time: 'منذ دقيقتين',
      read: false
    },
    {
      id: '2',
      title: 'تحديث النظام',
      message: 'تم تحديث النظام بنجاح إلى الإصدار 2.1',
      type: 'success',
      time: 'منذ ساعة',
      read: false
    },
    {
      id: '3',
      title: 'تحذير أمني',
      message: 'محاولة دخول غير مصرح بها من IP مجهول',
      type: 'warning',
      time: 'منذ 3 ساعات',
      read: true
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system theme preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const tabCategories = [
    {
      name: 'لوحة التحكم',
      icon: Shield,
      tabs: [
        { id: 'dashboard' as TabType, name: 'لوحة التحكم المتقدمة', icon: Activity, color: 'text-blue-600' },
        { id: 'analytics' as TabType, name: 'التحليلات والإحصائيات', icon: BarChart3, color: 'text-green-600' },
        { id: 'system-monitor' as TabType, name: 'مراقبة النظام', icon: Server, color: 'text-purple-600' }
      ]
    },
    {
      name: 'تصميم المحتوى',
      icon: Edit3,
      tabs: [
        { id: 'visual-editor' as TabType, name: 'محرر الصفحة المرئي', icon: Layers, color: 'text-indigo-600' },
        { id: 'themes' as TabType, name: 'إدارة الثيمات', icon: Paintbrush, color: 'text-red-600' },
        { id: 'templates' as TabType, name: 'مكتبة القوالب', icon: BookOpen, color: 'text-teal-600' }
      ]
    },
    {
      name: 'إدارة المحتوى',
      icon: Package,
      tabs: [
        { id: 'services' as TabType, name: 'إدارة الخدمات', icon: Package, color: 'text-blue-600' },
        { id: 'services-layout' as TabType, name: 'تخطيط الخدمات', icon: Grip, color: 'text-green-600' },
        { id: 'drag-drop' as TabType, name: 'السحب والإفلات', icon: Move, color: 'text-purple-600' }
      ]
    },
    {
      name: 'الطلبات والمبيعات',
      icon: Inbox,
      tabs: [
        { id: 'orders' as TabType, name: 'إدارة الطلبات', icon: Inbox, color: 'text-blue-600' },
        { id: 'payments' as TabType, name: 'طرق الدفع', icon: CreditCard, color: 'text-green-600' }
      ]
    },
    {
      name: 'المستخدمون وا��أمان',
      icon: Users,
      tabs: [
        { id: 'users' as TabType, name: 'إدارة المستخدمين', icon: Users, color: 'text-blue-600' },
        { id: 'security' as TabType, name: 'الأمان والحماية', icon: Lock, color: 'text-red-600' },
        { id: 'admin-settings' as TabType, name: 'إعدادات المدير', icon: User, color: 'text-purple-600' }
      ]
    },
    {
      name: 'التقارير والنسخ',
      icon: FileText,
      tabs: [
        { id: 'reports' as TabType, name: 'التقارير المفصلة', icon: FileText, color: 'text-blue-600' },
        { id: 'backup' as TabType, name: 'النسخ الاحتياطية', icon: Database, color: 'text-green-600' }
      ]
    },
    {
      name: 'الإعدادات المتقدمة',
      icon: Settings,
      tabs: [
        { id: 'settings' as TabType, name: 'إعدادات الموقع', icon: Settings, color: 'text-blue-600' },
        { id: 'integrations' as TabType, name: 'التكاملات الخارجية', icon: Globe, color: 'text-green-600' },
        { id: 'ai-assistant' as TabType, name: 'المساعد الذكي', icon: Star, color: 'text-purple-600' },
        { id: 'workflow' as TabType, name: 'سير العمل الآلي', icon: Zap, color: 'text-orange-600' }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdvancedDashboard />;
      case 'visual-editor':
        return <VisualLandingEditor />;
      case 'services':
        return <ServicesManager />;
      case 'services-layout':
        return <ServicesLayoutEditor />;
      case 'payments':
        return <PaymentMethodsManager />;
      case 'orders':
        return <OrdersManager />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'drag-drop':
        return <DragDropManager />;
      case 'themes':
        return <ThemeManager />;
      case 'users':
        return <UsersManager />;
      case 'reports':
        return <ReportsManager />;
      case 'backup':
        return <BackupManager />;
      case 'admin-settings':
        return <AdminSettingsManager />;
      case 'settings':
        return <SiteSettingsManager />;
      case 'system-monitor':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              مراقبة الن��ام
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">استخدام المعالج</p>
                    <p className="text-2xl font-bold text-blue-600">23%</p>
                  </div>
                  <Cpu className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">استخدام الذاكرة</p>
                    <p className="text-2xl font-bold text-green-600">67%</p>
                  </div>
                  <HardDrive className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">سرعة الشبكة</p>
                    <p className="text-2xl font-bold text-purple-600">45 Mbps</p>
                  </div>
                  <Wifi className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">حالة الخادم</p>
                    <p className="text-2xl font-bold text-green-600">متصل</p>
                  </div>
                  <Server className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              الأمان والحماية
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  حالة الأمان
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">جدار الحماية</span>
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm">نشط</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">SSL Certificate</span>
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm">صالح</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">مكافحة البرمجيات الخبيثة</span>
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm">محدث</span>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  التهديدات المحتملة
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-600 dark:text-gray-400">3 محاولات دخول فاشلة</span>
                  </div>
                  <div className="flex items-center space-x-reverse space-x-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">لا توجد تهديدات نشطة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              التكاملات الخارجية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Google Analytics', status: 'متصل', icon: BarChart3, color: 'text-blue-600' },
                { name: 'WhatsApp Business', status: 'متصل', icon: MessageCircle, color: 'text-green-600' },
                { name: 'Supabase Database', status: 'متصل', icon: Database, color: 'text-purple-600' },
                { name: 'CloudFlare CDN', status: 'متصل', icon: Cloud, color: 'text-orange-600' },
                { name: 'Stripe Payment', status: 'غير متصل', icon: CreditCard, color: 'text-gray-400' },
                { name: 'SendGrid Email', status: 'غير متصل', icon: FileText, color: 'text-gray-400' }
              ].map((integration, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <integration.icon className={`h-8 w-8 ${integration.color}`} />
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      integration.status === 'متصل' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {integration.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {integration.name}
                  </h3>
                  <button className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    إدارة
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ai-assistant':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              المساعد الذكي
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-center">
                <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  المساعد الذكي غير متاح حالياً
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  سيتم تفعيل المساعد الذكي قريباً لمساعدتك في إدارة الموقع والحصول على اقتراحات ذكية
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  اشترك في الإشعارات
                </button>
              </div>
            </div>
          </div>
        );
      case 'workflow':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              سير العمل ال��لي
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-center">
                <Zap className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  أتمتة سير العمل
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  قم بإنشاء وإدارة سير عمل آلي لتحسين كفاءة العمليات وتوفير الوقت
                </p>
                <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  إنشاء سير عمل جديد
                </button>
              </div>
            </div>
          </div>
        );
      case 'templates':
        return <TemplatesManager />;
      default:
        return <AdvancedDashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex bg-gray-50 dark:bg-gray-900">
        {/* Enhanced Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 flex flex-col`}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">KYCtrust</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">لوحة تحكم متقدمة</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Sliders className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            {!sidebarCollapsed && (
              <div className="mt-4 relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في لوحة التحكم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-2">
              {tabCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-6">
                  {!sidebarCollapsed && (
                    <div className="flex items-center space-x-reverse space-x-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <category.icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    {category.tabs
                      .filter(tab => 
                        searchQuery === '' || 
                        tab.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 border-l-4 border-blue-700 shadow-lg'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <tab.icon className={`${sidebarCollapsed ? 'mx-auto' : 'ml-3'} h-5 w-5 ${
                            activeTab === tab.id ? tab.color : 'text-gray-400'
                          }`} />
                          {!sidebarCollapsed && (
                            <span className="truncate">{tab.name}</span>
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-reverse space-x-4">
                  <button
                    onClick={refreshData}
                    disabled={loading}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors disabled:opacity-50"
                    title="تحديث البيانات"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors relative"
                      title="الإشعارات"
                    >
                      <Bell className="h-4 w-4" />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadNotifications}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className={`${sidebarCollapsed ? 'w-full' : ''} px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors`}
              >
                {sidebarCollapsed ? <User className="h-4 w-4 mx-auto" /> : 'تسجيل الخروج'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="fixed top-20 left-4 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">الإشعارات</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-reverse space-x-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'success' ? 'bg-green-100 text-green-600' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      notification.type === 'error' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors">
                عرض جميع الإشعارات
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAdminPanel;
