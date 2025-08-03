import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Settings, Package, CreditCard, Users, BarChart3,
  FileText, Database, Globe, Star, MessageCircle, Image, Menu,
  Paintbrush, Shield, Bell, Search, User, LogOut, RefreshCw,
  Zap, Target, Award, TrendingUp, Activity, Clock, Eye,
  ChevronRight, ChevronDown, Plus, Edit, Trash2, Filter,
  Download, Upload, Share, Copy, Heart, Bookmark, Calendar,
  Mail, Phone, MapPin, Wifi, Cpu, HardDrive, Cloud, Server,
  Lock, AlertTriangle, CheckCircle, XCircle, Info, Layers,
  Move, Grip, Layout, BookOpen, Video, Music, Monitor,
  Smartphone, Tablet, MousePointer, Palette, Type, Image as ImageIcon
} from 'lucide-react';
import {
  SuperButton,
  SuperThemeToggle,
  SuperLanguageToggle,
  EnhancedCard,
  FloatingActionButton,
  UltraButton
} from '../ui';

// Import admin components
import AdvancedDashboard from './AdvancedDashboard';
import RealContentManager from './RealContentManager';
import EnhancedSettingsManager from './EnhancedSettingsManager';
import EnhancedPaymentMethodsManager from './EnhancedPaymentMethodsManager';
import { BackupManager } from './BackupManager';
import { AnalyticsPanel } from './AnalyticsPanel';
import RealServicesManager from './RealServicesManager';
import RealOrdersManager from './RealOrdersManager';

interface DashboardMetrics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalServices: number;
  activeUsers: number;
  pendingOrders: number;
  conversionRate: number;
  growthRate: number;
  serverUptime: string;
  responseTime: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
  gradient: string;
}

const UltraAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 2547,
    totalOrders: 1823,
    totalRevenue: 285600,
    totalServices: 24,
    activeUsers: 156,
    pendingOrders: 23,
    conversionRate: 4.8,
    growthRate: 18.5,
    serverUptime: '99.9%',
    responseTime: 145
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'طلب جديد',
      message: 'تم استلام طلب جديد من العميل أحمد محمد',
      type: 'info',
      time: 'منذ 5 دقائق',
      read: false
    },
    {
      id: '2',
      title: 'دفعة جديدة',
      message: 'تم تأكيد دفعة بقيمة 2500 جنيه',
      type: 'success',
      time: 'منذ 15 دقيقة',
      read: false
    },
    {
      id: '3',
      title: 'تحذير ��لنظام',
      message: 'استخدام الذاكرة وصل إلى 85%',
      type: 'warning',
      time: 'منذ 30 دقيقة',
      read: true
    }
  ]);

  const menuCategories = [
    {
      id: 'overview',
      title: 'نظرة عامة',
      icon: LayoutDashboard,
      items: [
        { id: 'dashboard', title: 'لوحة القيادة', icon: LayoutDashboard, description: 'إحصائيات ونظرة عامة', color: 'from-blue-500 to-cyan-500' },
        { id: 'analytics', title: 'التحليلات', icon: BarChart3, description: 'تقارير وإحصائيات مفصلة', color: 'from-green-500 to-emerald-500' },
        { id: 'activity', title: 'النشاط', icon: Activity, description: 'سجل العمليات والأنشطة', color: 'from-purple-500 to-pink-500' }
      ]
    },
    {
      id: 'content',
      title: 'إدارة المحتوى',
      icon: FileText,
      items: [
        { id: 'content', title: 'المحتوى', icon: FileText, description: 'إدارة وتحرير المحتوى', color: 'from-orange-500 to-red-500' },
        { id: 'services', title: 'الخدمات', icon: Package, description: 'إضافة وإدارة الخدمات', color: 'from-indigo-500 to-purple-500' },
        { id: 'media', title: 'الوسائط', icon: ImageIcon, description: 'مكتبة الصور والفيديوهات', color: 'from-teal-500 to-cyan-500' }
      ]
    },
    {
      id: 'ecommerce',
      title: 'التجارة الإلكترونية',
      icon: CreditCard,
      items: [
        { id: 'orders', title: 'الطلبات', icon: Package, description: 'إدارة ومتابعة الطلبات', color: 'from-blue-500 to-indigo-500' },
        { id: 'payments', title: 'المدفوعات', icon: CreditCard, description: 'طرق الدفع والمعاملات', color: 'from-green-500 to-teal-500' },
        { id: 'customers', title: 'العملاء', icon: Users, description: 'قاعدة بيانات العملاء', color: 'from-pink-500 to-rose-500' }
      ]
    },
    {
      id: 'system',
      title: 'النظام',
      icon: Settings,
      items: [
        { id: 'settings', title: 'الإعدادات', icon: Settings, description: 'إعدادات النظام العامة', color: 'from-gray-500 to-slate-600' },
        { id: 'backup', title: 'النسخ الاحتياطية', icon: Database, description: 'حفظ واستعادة البيانات', color: 'from-yellow-500 to-orange-500' },
        { id: 'security', title: 'الأمان', icon: Shield, description: 'إعدادات الحماية والأمان', color: 'from-red-500 to-pink-500' }
      ]
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'new-service',
      title: 'خدمة جديدة',
      description: 'إضافة خدمة للعملاء',
      icon: <Plus className="h-5 w-5" />,
      action: () => setActiveTab('services'),
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'view-orders',
      title: 'عرض الطلبات',
      description: 'مراجعة الطلبات الجديدة',
      icon: <Eye className="h-5 w-5" />,
      action: () => setActiveTab('orders'),
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'backup-now',
      title: 'نسخة احتياطية',
      description: 'إنشاء نسخة احتياطية الآن',
      icon: <Database className="h-5 w-5" />,
      action: () => setActiveTab('backup'),
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'settings',
      title: 'الإعدادات',
      description: 'تكوين النظام',
      icon: <Settings className="h-5 w-5" />,
      action: () => setActiveTab('settings'),
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: metrics.totalUsers.toLocaleString(),
      change: '+12.3%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bg: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'الطلبات اليوم',
      value: metrics.totalOrders.toLocaleString(),
      change: '+8.7%',
      trend: 'up',
      icon: Package,
      color: 'text-green-600',
      bg: 'from-green-500 to-emerald-500'
    },
    {
      title: 'الإيرادات',
      value: `${metrics.totalRevenue.toLocaleString()} ج.م`,
      change: '+15.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'from-purple-500 to-pink-500'
    },
    {
      title: 'معدل التحويل',
      value: `${metrics.conversionRate}%`,
      change: '+0.8%',
      trend: 'up',
      icon: Target,
      color: 'text-orange-600',
      bg: 'from-orange-500 to-red-500'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'content':
        return <RealContentManager />;
      case 'services':
        return <RealServicesManager />;
      case 'orders':
        return <RealOrdersManager />;
      case 'payments':
        return <EnhancedPaymentMethodsManager />;
      case 'settings':
        return <EnhancedSettingsManager />;
      case 'backup':
        return <BackupManager />;
      default:
        return <DashboardContent />;
    }
  };

  const DashboardContent = () => (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">مرحباً بك في لوحة الإدارة المتطورة</h1>
          <p className="text-blue-100 text-lg">إدارة شاملة وذكية لمنصة KYC Trust</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <EnhancedCard 
              key={index} 
              variant="elevated" 
              className="group hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.bg} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </EnhancedCard>
          );
        })}
      </div>

      {/* Quick Actions */}
      <EnhancedCard variant="elevated" className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Zap className="h-6 w-6 text-yellow-500 mr-2" />
          إجراءات سريعة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className={`group relative p-6 rounded-2xl border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 text-left hover:scale-105 bg-gradient-to-br ${action.gradient} bg-opacity-5 hover:bg-opacity-10`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${action.gradient} text-white shadow-lg`}>
                  {action.icon}
                </div>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {action.description}
              </p>
              <ChevronRight className="absolute top-6 right-6 h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </EnhancedCard>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <EnhancedCard variant="elevated" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Activity className="h-6 w-6 text-green-500 mr-2" />
            النشاط الأخير
          </h3>
          <div className="space-y-4">
            {[
              { action: 'إضافة خدمة جديدة: خدمة التحقق المتقدم', time: 'منذ 5 دقائق', icon: Plus, color: 'text-green-500' },
              { action: 'طلب جديد من العميل: أحمد محمد', time: 'منذ 12 دقيقة', icon: Package, color: 'text-blue-500' },
              { action: 'تحديث إعدادات الدفع: فودافون كاش', time: 'منذ 25 دقيقة', icon: CreditCard, color: 'text-purple-500' },
              { action: 'نسخة احتياطية تلقائية مكتملة', time: 'منذ ساعة', icon: Database, color: 'text-orange-500' },
              { action: 'تسجيل دخول إداري جديد', time: 'منذ ساعتين', icon: User, color: 'text-indigo-500' }
            ].map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="flex items-center space-x-4 space-x-reverse p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${activity.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </EnhancedCard>

        {/* System Status */}
        <EnhancedCard variant="elevated" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Server className="h-6 w-6 text-blue-500 mr-2" />
            حالة النظام
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Cpu className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">المعالج</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-green-600">45%</span>
                <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                  <div className="w-9 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <HardDrive className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">الذاكرة</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-purple-600">62%</span>
                <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                  <div className="w-12 h-2 bg-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Wifi className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">الشبكة</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-green-600">{metrics.responseTime}ms</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">وقت التشغيل</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-orange-600">{metrics.serverUptime}</span>
              </div>
            </div>
          </div>
        </EnhancedCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-80'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">KYC Admin</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">نظام إدارة متطور</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {menuCategories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.id} className="space-y-2">
                {!isSidebarCollapsed && (
                  <div className="flex items-center space-x-2 space-x-reverse px-3 py-2">
                    <CategoryIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {category.title}
                    </span>
                  </div>
                )}
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full group flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'px-3 py-3'} rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                        }`}
                      >
                        <div className={`${isSidebarCollapsed ? '' : 'mr-3'} ${isActive ? 'text-white' : ''}`}>
                          <ItemIcon className="h-5 w-5" />
                        </div>
                        {!isSidebarCollapsed && (
                          <div className="flex-1 text-right">
                            <div className="font-semibold">{item.title}</div>
                            <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                              {item.description}
                            </div>
                          </div>
                        )}
                        {isActive && !isSidebarCollapsed && (
                          <ChevronRight className="h-4 w-4 text-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3 space-x-reverse'}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">مدير النظام</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@kyctrust.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {menuCategories.flatMap(cat => cat.items).find(item => item.id === activeTab)?.title || 'لوحة القيادة'}
              </h2>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Theme Toggle */}
              <SuperThemeToggle />
              
              {/* Language Toggle */}
              <SuperLanguageToggle />

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">الإشعارات</h3>
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 space-x-reverse p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">الملف الشخصي</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">الإعدادات</span>
                      </button>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button className="w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-red-600">
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mr-3" />
              <span className="text-gray-600 dark:text-gray-400">جاري التحميل...</span>
            </div>
          ) : (
            renderTabContent()
          )}
        </main>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<Plus className="h-6 w-6" />}
        onClick={() => setActiveTab('content')}
        variant="cosmic"
        tooltip="إضافة محتوى جديد"
        position="bottom-right"
      />
    </div>
  );
};

export default UltraAdminPanel;
