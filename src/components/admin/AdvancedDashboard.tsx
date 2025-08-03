import React, { useState, useEffect } from 'react';
import {
  Activity, Users, DollarSign, TrendingUp, BarChart3, PieChart,
  Zap, Shield, Star, Award,
  ArrowUpRight, ArrowDownRight, ChevronRight, Download,
  Settings, RefreshCw, Bell,
  FileText, Database, Server
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import CounterAnimation from '../animations/CounterAnimation';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
  color: string;
  description: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const AdvancedDashboard: React.FC = () => {
  const { orders } = useData();
  const [timeRange, setTimeRange] = useState('7d');
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 127,
    serverLoad: 23,
    apiCalls: 1847,
    errorRate: 0.02
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        serverLoad: Math.max(0, Math.min(100, prev.serverLoad + Math.floor(Math.random() * 6) - 3)),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 20),
        errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() * 0.01 - 0.005)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const metrics: MetricCard[] = [
    {
      title: 'إجمالي الإيرادات',
      value: '247,580',
      change: 12.5,
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      description: 'دولار أمريكي هذا الشهر'
    },
    {
      title: 'العملاء الجدد',
      value: '1,429',
      change: 8.2,
      changeType: 'increase',
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      description: 'عميل جديد هذا الأسبوع'
    },
    {
      title: 'معدل التحويل',
      value: '24.8%',
      change: -3.1,
      changeType: 'decrease',
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      description: 'من الزوار إلى عملاء'
    },
    {
      title: 'رضا العملاء',
      value: '98.2%',
      change: 2.4,
      changeType: 'increase',
      icon: Star,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      description: 'تقييم متوسط 4.9/5'
    },
    {
      title: 'الطلبات المكتملة',
      value: orders.filter(o => o.status === 'completed').length.toString(),
      change: 15.7,
      changeType: 'increase',
      icon: Award,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      description: 'طلب مكتمل بنجاح'
    },
    {
      title: 'متوسط وقت الاستجابة',
      value: '1.2s',
      change: -12.3,
      changeType: 'increase',
      icon: Zap,
      color: 'bg-gradient-to-r from-red-500 to-pink-600',
      description: 'أداء ممتاز للنظام'
    }
  ];

  const chartData: ChartData[] = [
    { name: 'خدمات KYC', value: 45, color: '#3B82F6' },
    { name: 'التحقق المتقدم', value: 30, color: '#8B5CF6' },
    { name: 'الشركات', value: 15, color: '#10B981' },
    { name: 'خدمات أخرى', value: 10, color: '#F59E0B' }
  ];

  const recentActivities = [
    { id: 1, type: 'order', message: 'طلب جديد من أحمد محمد - خدمة التحقق الأساسي', time: 'منذ دقيقتين', icon: FileText },
    { id: 2, type: 'user', message: 'مستخدم جديد سارة أحمد انضم للمنصة', time: 'منذ 5 دقائق', icon: Users },
    { id: 3, type: 'payment', message: 'تم استلام دفعة بقيمة 299 دولار', time: 'منذ 12 دقيقة', icon: DollarSign },
    { id: 4, type: 'system', message: 'تم تحديث إعدادا�� الأمان', time: 'منذ 20 دقيقة', icon: Shield },
    { id: 5, type: 'service', message: 'تم إضافة خدمة جديدة - التحقق السريع', time: 'منذ ساعة', icon: Zap }
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              لوحة التحكم المتقدمة
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              نظرة شاملة على أداء المنصة والإحصائيات الحية
            </p>
          </div>
          
          <div className="flex items-center space-x-reverse space-x-4 mt-4 lg:mt-0">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="24h">آخر 24 ساعة</option>
              <option value="7d">آخر 7 أيام</option>
              <option value="30d">آخر 30 يوم</option>
              <option value="90d">آخر 3 أشهر</option>
            </select>
            
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4 ml-2" />
              تصدير التقرير
            </button>
            
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">المستخدمون النشطون</p>
              <p className="text-2xl font-bold text-green-600">
                <CounterAnimation value={realTimeData.activeUsers} />
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">مباشر</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">حمولة الخادم</p>
              <p className="text-2xl font-bold text-blue-600">{realTimeData.serverLoad}%</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${realTimeData.serverLoad}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">استدعاءات API</p>
              <p className="text-2xl font-bold text-purple-600">
                <CounterAnimation value={realTimeData.apiCalls} />
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">في الساعة الأخيرة</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">معدل الأخطاء</p>
              <p className="text-2xl font-bold text-red-600">{(realTimeData.errorRate * 100).toFixed(2)}%</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-green-500 mt-2">ضمن المعدل الطبيعي</p>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </h3>
                  <div className={`p-2 rounded-lg ${metric.color}`}>
                    <metric.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                
                <div className="flex items-baseline space-x-reverse space-x-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {typeof metric.value === 'number' ? (
                      <CounterAnimation value={metric.value} />
                    ) : (
                      metric.value
                    )}
                  </p>
                  <div className={`flex items-center text-sm ${
                    metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.changeType === 'increase' ? (
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 ml-1" />
                    )}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {metric.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Service Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              توزيع الخدمات
            </h3>
            <PieChart className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.value}%
                  </span>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: item.color 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              الأنشطة الحديثة
            </h3>
            <Bell className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-reverse space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <activity.icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
            عرض جميع ال��نشطة
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          إجراءات سريعة
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'إضافة خدمة', icon: Zap, color: 'bg-blue-500' },
            { name: 'إدارة المستخدمين', icon: Users, color: 'bg-green-500' },
            { name: 'تقارير مفصلة', icon: BarChart3, color: 'bg-purple-500' },
            { name: 'إعدادات الموقع', icon: Settings, color: 'bg-orange-500' },
            { name: 'النسخ الاحتياطي', icon: Database, color: 'bg-red-500' },
            { name: 'مراقبة الأداء', icon: Activity, color: 'bg-indigo-500' }
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className={`p-3 rounded-full ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 text-center">
                {action.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;
