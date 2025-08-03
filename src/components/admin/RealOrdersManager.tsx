import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, Trash2, Phone, Mail, Calendar, Edit,
  DollarSign, CheckCircle, Clock, XCircle, AlertCircle, Download, 
  MessageCircle, User, Package, Filter, MoreVertical, Star,
  ArrowUp, ArrowDown, RefreshCw, Plus, FileText
} from 'lucide-react';
import { 
  SuperButton, 
  EnhancedCard, 
  UltraButton 
} from '../ui';
import { EnhancedInput } from '../forms/EnhancedForm';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  servicePrice: number;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  paymentMethod?: string;
  assignedTo?: string;
}

const RealOrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem('kyc-orders');
      if (saved) {
        setOrders(JSON.parse(saved));
      } else {
        // Generate sample orders
        const sampleOrders = generateSampleOrders();
        setOrders(sampleOrders);
        localStorage.setItem('kyc-orders', JSON.stringify(sampleOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('خطأ في تحميل الطلبات');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleOrders = (): Order[] => {
    const sampleOrders: Order[] = [
      {
        id: '1',
        customerName: 'أحمد محمد علي',
        customerEmail: 'ahmed.mohamed@email.com',
        customerPhone: '+201234567890',
        serviceName: 'خدمة التحقق الأساسية',
        servicePrice: 500,
        amount: 500,
        status: 'pending',
        priority: 'high',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        notes: 'عميل جديد، يحتاج متابعة سريعة',
        paymentMethod: 'vodafone_cash',
        assignedTo: 'فريق الدعم الفني'
      },
      {
        id: '2',
        customerName: 'فاطمة أحمد',
        customerEmail: 'fatma.ahmed@email.com',
        customerPhone: '+201123456789',
        serviceName: 'خدمة التحقق المتقدمة',
        servicePrice: 800,
        amount: 800,
        status: 'processing',
        priority: 'medium',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        notes: 'في المراجعة الأخيرة',
        paymentMethod: 'credit_card',
        assignedTo: 'فريق المراجعة'
      },
      {
        id: '3',
        customerName: 'محمد السيد',
        customerEmail: 'mohamed.elsayed@email.com',
        customerPhone: '+201012345678',
        serviceName: 'خدمة الامتثال الشامل',
        servicePrice: 1200,
        amount: 1200,
        status: 'completed',
        priority: 'low',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        notes: 'تم بنجاح، العميل راضٍ جداً',
        paymentMethod: 'usdt',
        assignedTo: 'فريق الخبراء'
      },
      {
        id: '4',
        customerName: 'سارة محمود',
        customerEmail: 'sara.mahmoud@email.com',
        customerPhone: '+201567890123',
        serviceName: 'خدمة التحقق السريع',
        servicePrice: 300,
        amount: 300,
        status: 'cancelled',
        priority: 'low',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        notes: 'ألغى العميل الطلب لأسباب شخصية',
        paymentMethod: 'bank_transfer',
        assignedTo: ''
      },
      {
        id: '5',
        customerName: 'خالد عبدالله',
        customerEmail: 'khaled.abdullah@email.com',
        customerPhone: '+201987654321',
        serviceName: 'خدمة KYC للشركات',
        servicePrice: 2500,
        amount: 2500,
        status: 'processing',
        priority: 'high',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        notes: 'شركة كبيرة، يحتاج إتمام سريع',
        paymentMethod: 'credit_card',
        assignedTo: 'فريق الشركات'
      }
    ];
    return sampleOrders;
  };

  const saveOrders = (updatedOrders: Order[]) => {
    try {
      localStorage.setItem('kyc-orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error saving orders:', error);
      toast.error('خطأ في حفظ الطلبات');
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    );
    saveOrders(updatedOrders);
    toast.success(`تم تحديث حالة الطلب إلى: ${getStatusLabel(newStatus)}`);
  };

  const deleteOrder = (orderId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      saveOrders(updatedOrders);
      toast.success('تم حذف الطلب بنجاح');
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: 'في الانتظار',
      processing: 'قيد المعالجة',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    };
    return labels[status];
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
      processing: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      completed: 'text-green-600 bg-green-100 dark:bg-green-900/20',
      cancelled: 'text-red-600 bg-red-100 dark:bg-red-900/20'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Order['priority']) => {
    const colors = {
      low: 'text-gray-600 bg-gray-100 dark:bg-gray-900/20',
      medium: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
      high: 'text-red-600 bg-red-100 dark:bg-red-900/20'
    };
    return colors[priority];
  };

  const getPriorityLabel = (priority: Order['priority']) => {
    const labels = {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية'
    };
    return labels[priority];
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const handleBulkAction = (action: string) => {
    if (selectedOrders.length === 0) {
      toast.error('يرجى اختيار طلبات أولاً');
      return;
    }

    switch (action) {
      case 'delete':
        if (confirm(`هل أنت متأكد من حذف ${selectedOrders.length} طلب؟`)) {
          const updatedOrders = orders.filter(order => !selectedOrders.includes(order.id));
          saveOrders(updatedOrders);
          setSelectedOrders([]);
          toast.success(`تم حذف ${selectedOrders.length} طلب`);
        }
        break;
      case 'export':
        exportOrders(orders.filter(order => selectedOrders.includes(order.id)));
        break;
    }
  };

  const exportOrders = (ordersToExport: Order[]) => {
    const csv = convertToCSV(ordersToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('تم تصدير الطلبات بنجاح');
  };

  const convertToCSV = (orders: Order[]) => {
    const headers = ['ID', 'اسم العميل', 'البريد الإلكتروني', 'الهاتف', 'اسم الخدمة', 'المبلغ', 'الحالة', 'الأولوية', 'تاريخ الإنشاء'];
    const rows = orders.map(order => [
      order.id,
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      order.serviceName,
      order.amount,
      getStatusLabel(order.status),
      getPriorityLabel(order.priority),
      new Date(order.createdAt).toLocaleString('ar-SA')
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0)
    };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mr-3" />
        <span className="text-gray-600 dark:text-gray-400">جاري تحميل الطلبات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إدارة الطلبات</h1>
          <p className="text-gray-600 dark:text-gray-400">متابعة وإدارة طلبات العملاء</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <SuperButton
            variant="outline"
            icon={<Download className="h-4 w-4" />}
            onClick={() => exportOrders(orders)}
          >
            تصدير الكل
          </SuperButton>
          <SuperButton
            variant="primary"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={loadOrders}
          >
            تحديث
          </SuperButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'إجمالي الطلبات', value: stats.total, color: 'from-blue-500 to-cyan-500', icon: Package },
          { label: 'في الانتظار', value: stats.pending, color: 'from-yellow-500 to-orange-500', icon: Clock },
          { label: 'قيد المعالجة', value: stats.processing, color: 'from-blue-500 to-indigo-500', icon: RefreshCw },
          { label: 'مكتملة', value: stats.completed, color: 'from-green-500 to-emerald-500', icon: CheckCircle },
          { label: 'ملغية', value: stats.cancelled, color: 'from-red-500 to-pink-500', icon: XCircle },
          { label: 'إجمالي الإيرادات', value: `${stats.totalRevenue.toLocaleString()} ج.م`, color: 'from-purple-500 to-pink-500', icon: DollarSign }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <EnhancedCard key={index} variant="elevated" className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </div>
            </EnhancedCard>
          );
        })}
      </div>

      {/* Filters and Search */}
      <EnhancedCard variant="elevated" className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <EnhancedInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="البحث في الطلبات..."
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="processing">قيد المعالجة</option>
              <option value="completed">مكتملة</option>
              <option value="cancelled">ملغية</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="all">جميع الأولويات</option>
              <option value="high">عالية</option>
              <option value="medium">متوسطة</option>
              <option value="low">منخفضة</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'status')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="date">ترتيب بالتاريخ</option>
              <option value="amount">ترتيب بالمبلغ</option>
              <option value="status">ترتيب بالحالة</option>
            </select>
          </div>
        </div>

        {selectedOrders.length > 0 && (
          <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              تم اختيار {selectedOrders.length} طلب
            </span>
            <div className="flex items-center space-x-2 space-x-reverse">
              <SuperButton
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('export')}
                icon={<Download className="h-4 w-4" />}
              >
                تصدير
              </SuperButton>
              <SuperButton
                variant="danger"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                icon={<Trash2 className="h-4 w-4" />}
              >
                حذف
              </SuperButton>
            </div>
          </div>
        )}
      </EnhancedCard>

      {/* Orders Table */}
      <EnhancedCard variant="elevated">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === sortedOrders.length && sortedOrders.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(sortedOrders.map(o => o.id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الخدمة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الأولوية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders([...selectedOrders, order.id]);
                        } else {
                          setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                        }
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.customerEmail}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.customerPhone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.serviceName}
                    </div>
                    {order.paymentMethod && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        طريقة الدفع: {order.paymentMethod}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {order.amount.toLocaleString()} ج.م
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                      {getPriorityLabel(order.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="pending">في الانتظار</option>
                        <option value="processing">قيد المعالجة</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                      
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'لا توجد طلبات مطابقة للفلاتر المحددة' 
                  : 'لا توجد طلبات حتى الآن'}
              </p>
            </div>
          )}
        </div>
      </EnhancedCard>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  تفاصيل الطلب #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">معلومات العميل</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900 dark:text-white">{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">{selectedOrder.customerEmail}</span>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">{selectedOrder.customerPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">تفاصيل الطلب</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">الخدمة:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{selectedOrder.serviceName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">المبلغ:</span>
                        <span className="text-gray-900 dark:text-white font-bold">{selectedOrder.amount.toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">طريقة الدفع:</span>
                        <span className="text-gray-900 dark:text-white">{selectedOrder.paymentMethod || 'غير محدد'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">المسؤول:</span>
                        <span className="text-gray-900 dark:text-white">{selectedOrder.assignedTo || 'غير محدد'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">الحالة والأولوية</h4>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(selectedOrder.priority)}`}>
                      أولوية {getPriorityLabel(selectedOrder.priority)}
                    </span>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">الملاحظات</h4>
                    <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">التواريخ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">تاريخ الإنشاء:</span>
                      <p className="text-gray-900 dark:text-white">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">آخر تحديث:</span>
                      <p className="text-gray-900 dark:text-white">{formatDate(selectedOrder.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse mt-8">
                <SuperButton
                  variant="outline"
                  onClick={() => setShowOrderDetails(false)}
                >
                  إغلاق
                </SuperButton>
                <SuperButton
                  variant="primary"
                  icon={<MessageCircle className="h-4 w-4" />}
                  onClick={() => {
                    window.open(`https://wa.me/${selectedOrder.customerPhone.replace('+', '')}`, '_blank');
                  }}
                >
                  تواصل مع العميل
                </SuperButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealOrdersManager;
