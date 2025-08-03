import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Eye, Globe } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AnalyticsData {
  visits: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  avgOrderValue: number;
  topServices: { name: string; count: number }[];
  monthlyStats: { month: string; orders: number; revenue: number }[];
  visitorsByCountry: { country: string; count: number }[];
  deviceStats: { device: string; percentage: number }[];
}

export const AnalyticsPanel: React.FC = () => {
  const { orders, services } = useData();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const calculateAnalytics = useCallback(() => {
    if (!orders || orders.length === 0) {
      setAnalytics({
        visits: 1250,
        orders: 0,
        revenue: 0,
        conversionRate: 0,
        avgOrderValue: 0,
        topServices: [],
        monthlyStats: generateDummyMonthlyStats(),
        visitorsByCountry: generateDummyCountryStats(),
        deviceStats: generateDummyDeviceStats()
      });
      return;
    }

    const now = new Date();
    const timeRangeMs = getTimeRangeMs(timeRange);
    const startDate = new Date(now.getTime() - timeRangeMs);

    const filteredOrders = orders.filter(order => 
      new Date(order.createdAt) >= startDate
    );

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const visits = Math.floor(filteredOrders.length * 15 + Math.random() * 500 + 500);

    const serviceStats = filteredOrders.reduce((acc, order) => {
      const serviceName = order.serviceName || 'خدمة غير محددة';
      acc[serviceName] = (acc[serviceName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topServices = Object.entries(serviceStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setAnalytics({
      visits,
      orders: filteredOrders.length,
      revenue: totalRevenue,
      conversionRate: visits > 0 ? (filteredOrders.length / visits) * 100 : 0,
      avgOrderValue: filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0,
      topServices,
      monthlyStats: generateMonthlyStats(filteredOrders),
      visitorsByCountry: generateDummyCountryStats(),
      deviceStats: generateDummyDeviceStats()
    });
  }, [orders, timeRange]);

  useEffect(() => {
    calculateAnalytics();
  }, [calculateAnalytics]);

  const getTimeRangeMs = (range: string) => {
    switch (range) {
      case '7d': return 7 * 24 * 60 * 60 * 1000;
      case '30d': return 30 * 24 * 60 * 60 * 1000;
      case '90d': return 90 * 24 * 60 * 60 * 1000;
      case '1y': return 365 * 24 * 60 * 60 * 1000;
      default: return 30 * 24 * 60 * 60 * 1000;
    }
  };

  const generateMonthlyStats = (orders: { createdAt: string | number | Date; amount: number; }[]) => {
    const monthlyData: Record<string, { orders: number; revenue: number }> = {};
    
    orders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleString('ar-SA', { 
        month: 'long',
        year: 'numeric'
      });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { orders: 0, revenue: 0 };
      }
      
      monthlyData[month].orders += 1;
      monthlyData[month].revenue += order.amount || 0;
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .slice(-6);
  };

  const generateDummyMonthlyStats = () => [
    { month: 'يناير 2024', orders: 45, revenue: 22500 },
    { month: 'فبراير 2024', orders: 38, revenue: 19000 },
    { month: 'مارس 2024', orders: 52, revenue: 26000 },
    { month: 'أبريل 2024', orders: 41, revenue: 20500 },
    { month: 'مايو 2024', orders: 49, revenue: 24500 },
    { month: 'يونيو 2024', orders: 56, revenue: 28000 }
  ];

  const generateDummyCountryStats = () => [
    { country: 'السعودية', count: 45 },
    { country: '��لإمارات', count: 23 },
    { country: 'الكويت', count: 18 },
    { country: 'قطر', count: 12 },
    { country: 'البحرين', count: 8 }
  ];

  const generateDummyDeviceStats = () => [
    { device: 'الهاتف المحمول', percentage: 65 },
    { device: 'سطح المكتب', percentage: 28 },
    { device: 'التابلت', percentage: 7 }
  ];

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            التحليلات والإحصائيات
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            متابعة الأداء والمبيعات
          </p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="7d">آخر 7 أيام</option>
          <option value="30d">آخر 30 يوم</option>
          <option value="90d">آخر 90 يوم</option>
          <option value="1y">آخر سنة</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الزيارات</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.visits.toLocaleString('ar-SA')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الطلبات</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.orders.toLocaleString('ar-SA')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الإيرادات</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.revenue.toLocaleString('ar-SA')} ر.س
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">معدل التحويل</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.conversionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            الأداء الشهري
          </h3>
          <div className="space-y-4">
            {analytics.monthlyStats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.month}
                </span>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {stat.orders} طلب
                  </span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {stat.revenue.toLocaleString('ar-SA')} ر.س
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            أهم الخدمات
          </h3>
          <div className="space-y-4">
            {analytics.topServices.length > 0 ? (
              analytics.topServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {service.name}
                  </span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(service.count / (analytics.topServices[0]?.count || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                لا توجد بيانات متاحة
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors by Country */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            الزوار حسب البلد
          </h3>
          <div className="space-y-3">
            {analytics.visitorsByCountry.map((country, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {country.country}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {country.count}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            الأجهزة المستخدمة
          </h3>
          <div className="space-y-3">
            {analytics.deviceStats.map((device, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-900 dark:text-white">
                  {device.device}
                </span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
