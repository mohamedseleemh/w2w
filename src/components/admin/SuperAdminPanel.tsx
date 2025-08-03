import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Settings, Users, BarChart3, FileText, 
  CreditCard, Globe, Shield, Bell, Database, Palette,
  Smartphone, Mail, MessageCircle, TrendingUp, Activity,
  Package, Zap, Target, Award, Clock, Filter, Search,
  Download, Upload, RefreshCw, Plus, Edit, Trash2,
  Eye, MoreVertical, ChevronRight, Star, Heart
} from 'lucide-react';
import { 
  SuperButton, 
  EnhancedCard, 
  SuperThemeToggle, 
  SuperLanguageToggle,
  FloatingActionButton 
} from '../ui';

// Import admin components
import AdvancedContentManager from './AdvancedContentManager';
import EnhancedSettingsManager from './EnhancedSettingsManager';
import EnhancedPaymentMethodsManager from './EnhancedPaymentMethodsManager';
import BackupManager from './BackupManager';
import AnalyticsPanel from './AnalyticsPanel';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalServices: number;
  growthRate: number;
  conversionRate: number;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  action: () => void;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  gradient: string;
}

const SuperAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 1250,
    totalOrders: 856,
    totalRevenue: 125000,
    totalServices: 12,
    growthRate: 15.8,
    conversionRate: 3.2
  });

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'لوحة القيادة', 
      icon: LayoutDashboard, 
      gradient: 'from-blue-500 to-cyan-500',
      description: 'نظرة عامة على أداء المنصة'
    },
    { 
      id: 'content', 
      label: 'إدارة المحتوى', 
      icon: FileText, 
      gradient: 'from-purple-500 to-pink-500',
      description: 'تخصيص محتوى الموقع والصفحات'
    },
    { 
      id: 'analytics', 
      label: 'التحليلات', 
      icon: BarChart3, 
      gradient: 'from-green-500 to-emerald-500',
      description: 'إحصائيات مفصلة وتقارير'
    },
    { 
      id: 'payments', 
      label: 'طرق الدفع', 
      icon: CreditCard, 
      gradient: 'from-orange-500 to-red-500',
      description: 'إدارة طرق الدفع والمعاملات'
    },
    { 
      id: 'settings', 
      label: 'الإعدادات', 
      icon: Settings, 
      gradient: 'from-gray-500 to-slate-600',
      description: 'إعدادات النظام والأمان'
    },
    { 
      id: 'backup', 
      label: 'النسخ الاحتياطية', 
      icon: Database, 
      gradient: 'from-indigo-500 to-blue-600',
      description: 'إدارة النسخ الاحتياطية'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'new-service',
      label: 'إضافة خدمة جديدة',
      icon: <Plus className="h-5 w-5" />,
      description: 'إنشاء خدمة جديدة للعملاء',
      action: () => setActiveTab('content'),
      variant: 'primary',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'view-analytics',
      label: 'عرض التحليلات',
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'مراجعة إحصائيات الأداء',
      action: () => setActiveTab('analytics'),
      variant: 'success',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'backup-data',
      label: 'إنشاء نسخة احتياطية',
      icon: <Database className="h-5 w-5" />,
      description: 'حفظ نسخة من البيانات',
      action: () => setActiveTab('backup'),
      variant: 'warning',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'payment-settings',
      label: 'إعدادات الدفع',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'تكوين طرق الدفع',
      action: () => setActiveTab('payments'),
      variant: 'secondary',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const statsCards = [
    {
      title: 'إجمالي المستخدمين',
      value: dashboardStats.totalUsers.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'إجمالي الطلبات',
      value: dashboardStats.totalOrders.toLocaleString(),
      change: '+8%',
      icon: Package,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/20',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'إجمالي الإيرادات',
      value: `${dashboardStats.totalRevenue.toLocaleString()} جنيه`,
      change: '+15%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'الخدمات المتاحة',
      value: dashboardStats.totalServices.toLocaleString(),
      change: '+2%',
      icon: Zap,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <EnhancedCard 
                    key={index} 
                    variant="elevated" 
                    className="p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          {stat.change} من الشهر الماضي
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                    {/* Progress indicator */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-500`}
                          style={{ width: `${65 + (index * 10)}%` }}
                        />
                      </div>
                    </div>
                  </EnhancedCard>
                );
              })}
            </div>

            {/* Quick Actions */}
            <EnhancedCard variant="default" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                إجراءات سريعة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className={`group relative p-4 rounded-xl border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 text-left hover:scale-105 bg-gradient-to-br ${action.gradient} bg-opacity-10 hover:bg-opacity-20`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} text-white mr-3`}>
                        {action.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {action.label}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                    <ChevronRight className="absolute top-4 right-4 h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300" />
                  </button>
                ))}
              </div>
            </EnhancedCard>

            {/* Recent Activity */}
            <EnhancedCard variant="default" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-500" />
                النشاط الأخير
              </h3>
              <div className="space-y-4">
                {[
                  { action: 'تم إنشاء خدمة جديدة', time: 'منذ 5 دقائق', icon: Plus, color: 'text-green-500' },
                  { action: 'طلب جديد من العميل أحمد', time: 'منذ 12 دقيقة', icon: Package, color: 'text-blue-500' },
                  { action: 'تم تحديث إعدادات الدفع', time: 'منذ 30 دقيقة', icon: CreditCard, color: 'text-purple-500' },
                  { action: 'نسخة احتياطية تلقائية', time: 'منذ ساعة', icon: Database, color: 'text-orange-500' }
                ].map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                      <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${activity.color}`}>
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
          </div>
        );

      case 'content':
        return <AdvancedContentManager />;
      
      case 'analytics':
        return <AnalyticsPanel />;
      
      case 'payments':
        return <EnhancedPaymentMethodsManager />;
      
      case 'settings':
        return <EnhancedSettingsManager />;
      
      case 'backup':
        return <BackupManager />;

      default:
        return (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              محتوى هذا القسم قيد التطوير
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  لوحة الإدارة المتقدمة
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  إدارة شاملة لمنصة KYC Trust
                </p>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Theme and Language */}
              <SuperThemeToggle />
              <SuperLanguageToggle />

              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 space-y-4">
            <EnhancedCard variant="elevated" className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                القوائم الرئيسية
              </h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg transform scale-105`
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mr-3 ${
                        activeTab === tab.id 
                          ? 'bg-white/20' 
                          : `bg-gradient-to-r ${tab.gradient} bg-opacity-10 group-hover:bg-opacity-20`
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="font-semibold">{tab.label}</div>
                        <div className={`text-xs ${
                          activeTab === tab.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {tab.description}
                        </div>
                      </div>
                      {activeTab === tab.id && (
                        <ChevronRight className="h-4 w-4 text-white" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </EnhancedCard>

            {/* Quick Stats */}
            <EnhancedCard variant="default" className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                إحصائيات سريعة
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">معدل النمو</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    +{dashboardStats.growthRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">معدل التحويل</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {dashboardStats.conversionRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">المراجعات</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">4.8</span>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-400">جاري التحميل...</span>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<Plus className="h-6 w-6" />}
        onClick={() => setActiveTab('content')}
        variant="gradient"
        tooltip="إضافة محتوى جديد"
        position="bottom-right"
      />
    </div>
  );
};

export default SuperAdminPanel;
