import React, { useState, useMemo } from 'react';
import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart, Mail, Printer, Share2, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const ReportsManager: React.FC = () => {
  const { orders, services } = useData();
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'generate' | 'scheduled' | 'history'>('generate');
  const [selectedReportType, setSelectedReportType] = useState<string>('orders');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'orders',
      name: 'تقرير الطلبات',
      description: 'تقرير شامل عن جميع الطلبات والمعاملات',
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'services',
      name: 'تقرير الخدمات',
      description: 'إحصائيات الخدمات الأكثر طلباً والأداء',
      icon: BarChart3,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'financial',
      name: 'التقرير المالي',
      description: 'تقرير الإيرادات والأرباح والمصروفات',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'analytics',
      name: 'تقرير التحليلات',
      description: 'تحليل شامل لسلوك المستخدمين والأداء',
      icon: PieChart,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const scheduledReports = [
    {
      id: '1',
      name: 'تقرير الطلبات الأسبوعي',
      type: 'orders',
      frequency: 'weekly',
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: '2',
      name: 'التقرير المالي الشهري',
      type: 'financial',
      frequency: 'monthly',
      nextRun: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'active'
    }
  ];

  const reportHistory = [
    {
      id: '1',
      name: 'تقرير الطلبات - نوفمبر 2024',
      type: 'orders',
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      size: '2.4 MB',
      format: 'pdf'
    },
    {
      id: '2',
      name: 'تقرير الخدمات - أكتوبر 2024',
      type: 'services',
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      size: '1.8 MB',
      format: 'excel'
    }
  ];

  // حساب الإحصائيات للتقارير
  const reportStats = useMemo(() => {
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= dateRange.start && orderDate <= dateRange.end;
    });

    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;
    const pendingOrders = totalOrders - completedOrders;
    
    const serviceStats = services.map(service => ({
      name: service.name,
      orders: filteredOrders.filter(order => order.serviceName === service.name).length,
      revenue: filteredOrders.filter(order => order.serviceName === service.name).reduce((acc, o) => acc + o.amount, 0)
    }));

    const dailyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(dateRange.end);
      date.setDate(date.getDate() - i);
      const dayOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      
      return {
        date: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((acc, o) => acc + o.amount, 0)
      };
    }).reverse();

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue: filteredOrders.reduce((acc, o) => acc + o.amount, 0),
      serviceStats,
      dailyStats
    };
  }, [orders, services, dateRange]);

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // محاكاة عملية إنشاء التقرير
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // محاكاة تحميل الملف
      const fileName = `${reportTypes.find(r => r.id === selectedReportType)?.name || 'تقرير'}_${new Date().toISOString().split('T')[0]}.${reportFormat}`;
      
      toast.success(`تم إنشاء التقرير بنجاح: ${fileName}`);
    } catch (e) {
      toast.error('فشل في إنشاء التقرير');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            إدارة التقارير
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            إنشاء وإدارة التقارير والتحليلات المختلفة
          </p>
        </div>
        
        <div className="flex items-center space-x-reverse space-x-3">
          <button
            onClick={() => window.print()}
            className={`p-3 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            title="طباعة"
          >
            <Printer className="h-5 w-5" />
          </button>
          
          <button
            className={`p-3 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            title="مشاركة"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {reportStats.totalOrders}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                إجمالي الطلبات
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ${reportStats.totalRevenue}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                إجمالي الإيرادات
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {reportStats.completedOrders}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                طلبات مكتملة
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <RefreshCw className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {reportStats.pendingOrders}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                طلبات معلقة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <nav className="flex space-x-reverse space-x-8">
          {[
            { id: 'generate', name: 'إنشاء تقرير', icon: FileText },
            { id: 'scheduled', name: 'التقارير المجدولة', icon: Calendar },
            { id: 'history', name: 'سجل التقارير', icon: Download },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-reverse space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : theme === 'dark'
                  ? 'border-transparent text-gray-400 hover:text-gray-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Generate Report Tab */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Configuration */}
          <div className={`p-6 rounded-xl border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              إعداد التقرير
            </h3>

            {/* Report Type Selection */}
            <div className="space-y-4 mb-6">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                نوع التقرير
              </label>
              <div className="grid grid-cols-1 gap-3">
                {reportTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedReportType(type.id)}
                    className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                      selectedReportType === type.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : theme === 'dark'
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${type.color} mr-4`}>
                      <type.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right flex-1">
                      <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {type.name}
                      </h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {type.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-4 mb-6">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                فترة التقرير
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    من تاريخ
                  </label>
                  <input
                    type="date"
                    value={dateRange.start.toISOString().split('T')[0]}
                    onChange={(e) => setDateRange({
                      ...dateRange,
                      start: new Date(e.target.value)
                    })}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    إلى تاريخ
                  </label>
                  <input
                    type="date"
                    value={dateRange.end.toISOString().split('T')[0]}
                    onChange={(e) => setDateRange({
                      ...dateRange,
                      end: new Date(e.target.value)
                    })}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-4 mb-6">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                تنسيق التقرير
              </label>
              <div className="flex space-x-reverse space-x-3">
                {[
                  { id: 'pdf', name: 'PDF', icon: '📄' },
                  { id: 'excel', name: 'Excel', icon: '📊' },
                  { id: 'csv', name: 'CSV', icon: '📋' },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setReportFormat(format.id as any)}
                    className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                      reportFormat === format.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        : theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="ml-2">{format.icon}</span>
                    <span>{format.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-reverse space-x-2 ${
                isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>جاري الإنشاء...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>إنشاء وتحميل التقرير</span>
                </>
              )}
            </button>
          </div>

          {/* Preview */}
          <div className={`p-6 rounded-xl border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              معاينة البيانات
            </h3>

            {/* Daily Chart */}
            <div className="mb-6">
              <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                الطلبات اليومية
              </h4>
              <div className="space-y-3">
                {reportStats.dailyStats.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {day.date}
                    </span>
                    <div className="flex items-center space-x-reverse space-x-3">
                      <div className={`w-24 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ 
                            width: `${Math.max((day.orders / Math.max(...reportStats.dailyStats.map(d => d.orders))) * 100, 5)}%` 
                          }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {day.orders}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Services */}
            <div>
              <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                أهم الخدمات
              </h4>
              <div className="space-y-3">
                {reportStats.serviceStats
                  .sort((a, b) => b.orders - a.orders)
                  .slice(0, 5)
                  .map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} truncate flex-1`}>
                      {service.name}
                    </span>
                    <div className="flex items-center space-x-reverse space-x-3">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        ${service.revenue}
                      </span>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {service.orders}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Reports Tab */}
      {activeTab === 'scheduled' && (
        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              التقارير المجدولة
            </h3>
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              جدولة تقرير جديد
            </button>
          </div>

          <div className="space-y-4">
            {scheduledReports.map((report) => (
              <div key={report.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center space-x-reverse space-x-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {report.name}
                    </h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      التشغيل التالي: {report.nextRun.toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-reverse space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status === 'active' ? 'نشط' : 'معطل'}
                  </span>
                  
                  <button className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}>
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            سجل التقارير
          </h3>

          <div className="space-y-4">
            {reportHistory.map((report) => (
              <div key={report.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center space-x-reverse space-x-4">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {report.name}
                    </h4>
                    <div className="flex items-center space-x-reverse space-x-4 text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {report.generatedAt.toLocaleDateString('ar-EG')}
                      </span>
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {report.size}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {report.format.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-reverse space-x-2">
                  <Download className="h-4 w-4" />
                  <span>تحميل</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManager;
