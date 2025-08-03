import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Users, Package, CreditCard, Eye,
  Clock, Calendar, Target, Award, Zap, Activity, ArrowUp,
  ArrowDown, MoreVertical, Refresh, Download, Share
} from 'lucide-react';
import { EnhancedCard, SuperButton } from '../ui';

interface WidgetData {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  data?: number[];
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

const DashboardWidgets: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetData[]>([
    {
      id: 'users',
      title: 'إجمالي المستخدمين',
      value: '2,547',
      change: 12.3,
      changeType: 'increase',
      trend: 'up',
      icon: <Users className="h-6 w-6" />,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500 to-cyan-500',
      data: [20, 45, 32, 60, 75, 85, 90]
    },
    {
      id: 'orders',
      title: 'الطلبات اليوم',
      value: '1,823',
      change: 8.7,
      changeType: 'increase',
      trend: 'up',
      icon: <Package className="h-6 w-6" />,
      color: 'text-green-600',
      bgGradient: 'from-green-500 to-emerald-500',
      data: [15, 25, 35, 45, 55, 70, 82]
    },
    {
      id: 'revenue',
      title: 'الإيرادات الشهرية',
      value: '285,600 ج.م',
      change: 15.2,
      changeType: 'increase',
      trend: 'up',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'text-purple-600',
      bgGradient: 'from-purple-500 to-pink-500',
      data: [30, 40, 35, 50, 65, 80, 95]
    },
    {
      id: 'conversion',
      title: 'معدل التحويل',
      value: '4.8%',
      change: 2.1,
      changeType: 'increase',
      trend: 'up',
      icon: <Target className="h-6 w-6" />,
      color: 'text-orange-600',
      bgGradient: 'from-orange-500 to-red-500',
      data: [3.2, 3.8, 4.1, 4.3, 4.5, 4.6, 4.8]
    },
    {
      id: 'views',
      title: 'مشاهدات الصفحة',
      value: '45,231',
      change: -3.2,
      changeType: 'decrease',
      trend: 'down',
      icon: <Eye className="h-6 w-6" />,
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-500 to-blue-600',
      data: [100, 95, 90, 85, 82, 78, 75]
    },
    {
      id: 'engagement',
      title: 'معدل التفاعل',
      value: '68.4%',
      change: 5.8,
      changeType: 'increase',
      trend: 'up',
      icon: <Activity className="h-6 w-6" />,
      color: 'text-teal-600',
      bgGradient: 'from-teal-500 to-cyan-600',
      data: [50, 55, 60, 62, 65, 67, 68]
    }
  ]);

  const [chartData, setChartData] = useState<ChartData[]>([
    { label: 'خدمات KYC', value: 35, color: '#3B82F6' },
    { label: 'التحقق من الهوية', value: 25, color: '#10B981' },
    { label: 'الامتثال القانوني', value: 20, color: '#8B5CF6' },
    { label: 'الاستشارات', value: 15, color: '#F59E0B' },
    { label: 'أخرى', value: 5, color: '#EF4444' }
  ]);

  const MiniChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    return (
      <div className="flex items-end space-x-1 h-12 w-24">
        {data.map((point, index) => {
          const height = range === 0 ? 6 : ((point - min) / range) * 40 + 6;
          return (
            <div
              key={index}
              className={`flex-1 rounded-t transition-all duration-300 hover:opacity-80`}
              style={{
                height: `${height}px`,
                backgroundColor: color
              }}
            />
          );
        })}
      </div>
    );
  };

  const DonutChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="relative w-40 h-40 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
          <circle
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke="#E5E7EB"
            strokeWidth="2"
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = -cumulativePercentage;
            cumulativePercentage += percentage;

            return (
              <circle
                key={index}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={item.color}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 hover:stroke-width-4"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">اكتمال</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* KPI Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget) => (
          <EnhancedCard 
            key={widget.id} 
            variant="elevated" 
            className="group hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${widget.bgGradient} opacity-5 rounded-full transform translate-x-16 -translate-y-16`} />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${widget.bgGradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {widget.icon}
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className={`text-sm font-bold flex items-center ${
                    widget.changeType === 'increase' ? 'text-green-600' : 
                    widget.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {widget.changeType === 'increase' ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : widget.changeType === 'decrease' ? (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    ) : null}
                    {Math.abs(widget.change)}%
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {widget.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {widget.value}
                </p>
              </div>

              {/* Mini Chart */}
              {widget.data && (
                <div className="flex justify-end">
                  <MiniChart data={widget.data} color={widget.color.replace('text-', '#')} />
                </div>
              )}
            </div>
          </EnhancedCard>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services Distribution */}
        <EnhancedCard variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">توزيع الخدمات</h3>
            <SuperButton variant="ghost" size="sm" icon={<MoreVertical className="h-4 w-4" />} />
          </div>
          
          <DonutChart data={chartData} />
          
          <div className="mt-6 space-y-3">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </EnhancedCard>

        {/* Performance Metrics */}
        <EnhancedCard variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">مؤشرات الأداء</h3>
            <div className="flex items-center space-x-2 space-x-reverse">
              <SuperButton variant="ghost" size="sm" icon={<Download className="h-4 w-4" />} />
              <SuperButton variant="ghost" size="sm" icon={<Refresh className="h-4 w-4" />} />
            </div>
          </div>

          <div className="space-y-6">
            {[
              { label: 'معدل الاستجابة', value: 95, color: 'bg-green-500', target: 90 },
              { label: 'رضا العملاء', value: 88, color: 'bg-blue-500', target: 85 },
              { label: 'جودة الخدمة', value: 92, color: 'bg-purple-500', target: 90 },
              { label: 'السرعة', value: 87, color: 'bg-orange-500', target: 80 },
              { label: 'الأمان', value: 98, color: 'bg-red-500', target: 95 }
            ].map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {metric.label}
                  </span>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {metric.value}%
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      الهدف: {metric.target}%
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${metric.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                  {/* Target line */}
                  <div
                    className="absolute top-0 h-2 w-0.5 bg-gray-400 dark:bg-gray-500"
                    style={{ left: `${metric.target}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </EnhancedCard>
      </div>

      {/* Recent Activity Timeline */}
      <EnhancedCard variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Activity className="h-6 w-6 text-blue-500 mr-2" />
            سجل النشاط المفصل
          </h3>
          <SuperButton variant="outline" size="sm">
            عرض الكل
          </SuperButton>
        </div>

        <div className="space-y-4">
          {[
            {
              time: 'منذ 2 دقيقة',
              action: 'تم إنشاء طلب جديد',
              details: 'طلب خدمة التحقق من الهوية للعميل أحمد محمد',
              type: 'order',
              icon: Package,
              color: 'text-blue-500',
              bg: 'bg-blue-100 dark:bg-blue-900/20'
            },
            {
              time: 'منذ 8 دقائق',
              action: 'تم تأكيد دفعة',
              details: 'دفعة بقيمة 2,500 جنيه مصري عبر فودافون كاش',
              type: 'payment',
              icon: CreditCard,
              color: 'text-green-500',
              bg: 'bg-green-100 dark:bg-green-900/20'
            },
            {
              time: 'منذ 15 دقيقة',
              action: 'تحديث بيانات العميل',
              details: 'تم تحديث الملف الشخصي للعميل سارة أحمد',
              type: 'update',
              icon: Users,
              color: 'text-purple-500',
              bg: 'bg-purple-100 dark:bg-purple-900/20'
            },
            {
              time: 'منذ 32 دقيقة',
              action: 'إضافة خدمة جديدة',
              details: 'خدمة "التحقق المتقدم للشركات" تم إضافتها بنجاح',
              type: 'service',
              icon: Zap,
              color: 'text-orange-500',
              bg: 'bg-orange-100 dark:bg-orange-900/20'
            },
            {
              time: 'منذ ساعة',
              action: 'نسخة احتياطية تلقائية',
              details: 'تم إنشاء نسخة احتياطية تلقائية بحجم 45.2 ميجابايت',
              type: 'backup',
              icon: Activity,
              color: 'text-indigo-500',
              bg: 'bg-indigo-100 dark:bg-indigo-900/20'
            }
          ].map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <div key={index} className="flex items-start space-x-4 space-x-reverse p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                <div className={`p-2 rounded-full ${activity.bg} ${activity.color} flex-shrink-0`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {activity.action}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {activity.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </EnhancedCard>
    </div>
  );
};

export default DashboardWidgets;
