import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Eye, Trash2, Phone, Mail, Calendar,
  DollarSign, CheckCircle, Clock, XCircle, AlertCircle, Download, 
  MessageCircle, User, Package
} from 'lucide-react';
import { useData } from '../../context/DataContext';

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
  attachments?: string[];
  paymentMethod?: string;
  estimatedCompletion?: string;
}

export const OrdersManager: React.FC = () => {
  const { orders, updateOrders } = useData();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const applyFilters = useCallback(() => {
    if (!orders) return;

    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone?.includes(searchTerm) ||
        order.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(order => order.priority === priorityFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'amount':
          aValue = a.amount || 0;
          bValue = b.amount || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  }, [dateFilter, orders, priorityFilter, sortBy, sortOrder, statusFilter, searchTerm]);

  useEffect(() => {
    if (orders) {
      applyFilters();
    }
  }, [orders, applyFilters]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'في الانتظار' };
      case 'processing':
        return { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900', text: 'قيد التنفيذ' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900', text: 'مكتمل' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900', text: 'ملغي' };
      default:
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900', text: 'غير محدد' };
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return { color: 'text-red-600', text: 'عالية' };
      case 'medium':
        return { color: 'text-yellow-600', text: 'متوسطة' };
      case 'low':
        return { color: 'text-green-600', text: 'منخفضة' };
      default:
        return { color: 'text-gray-600', text: 'غير محدد' };
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: "pending" | "processing" | "completed" | "cancelled") => {
    if (!orders) return;

    const updatedOrders = orders.map(order =>
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    );

    updateOrders(updatedOrders);
  };

  const updateOrderPriority = async (orderId: string, newPriority: "low" | "medium" | "high") => {
    if (!orders) return;

    const updatedOrders = orders.map(order =>
      order.id === orderId 
        ? { ...order, priority: newPriority, updatedAt: new Date().toISOString() }
        : order
    );

    updateOrders(updatedOrders);
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
    if (!orders) return;

    const updatedOrders = orders.filter(order => order.id !== orderId);
    updateOrders(updatedOrders);
  };

  const exportOrders = () => {
    if (!filteredOrders.length) {
      alert('لا توجد طلبات للتصدير');
      return;
    }

    const csvContent = [
      ['ID', 'اسم العميل', 'البريد الإلكتروني', 'الهاتف', 'الخدمة', 'المبلغ', 'الحالة', 'الأولوية', 'تاريخ الإنشاء'],
      ...filteredOrders.map(order => [
        order.id,
        order.customerName || '',
        order.customerEmail || '',
        order.customerPhone || '',
        order.serviceName || '',
        order.amount || 0,
        getStatusInfo(order.status).text,
        getPriorityInfo(order.priority).text,
        new Date(order.createdAt).toLocaleDateString('ar-SA')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const openWhatsApp = (phone: string, orderReference: string) => {
    const message = `مرحباً، بخصوص طلبكم رقم ${orderReference}`;
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            إدارة الطلبات
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            عرض وإدارة جميع طلبات العملاء
          </p>
        </div>
        
        <button
          onClick={exportOrders}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          تصدير البيانات
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">في الانتظار</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders?.filter(o => o.status === 'pending').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">قيد التنفيذ</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders?.filter(o => o.status === 'processing').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">مكتملة</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders?.filter(o => o.status === 'completed').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="البحث في الطلبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">في الانتظار</option>
            <option value="processing">قيد التنفيذ</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">جميع الأولويات</option>
            <option value="high">عالية</option>
            <option value="medium">متوسطة</option>
            <option value="low">منخفضة</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">جميع التواريخ</option>
            <option value="today">اليوم</option>
            <option value="week">آخر أسبوع</option>
            <option value="month">آخر شهر</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="date-desc">الأحدث أولاً</option>
            <option value="date-asc">الأقدم أولاً</option>
            <option value="amount-desc">أعلى مبلغ</option>
            <option value="amount-asc">أقل مبلغ</option>
            <option value="status-asc">ترتيب الحالة</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  رقم الطلب
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
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {orders?.length === 0 ? 'لا توجد طلبات بعد' : 'لا توجد طلبات تطابق الفلترة المحددة'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const priorityInfo = getPriorityInfo(order.priority);

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{order.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.customerName || 'غير محدد'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {order.customerEmail || order.customerPhone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {order.serviceName || 'غير محدد'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {order.amount ? `${order.amount.toLocaleString('ar-SA')} ر.س` : 'غير محدد'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`${statusInfo.bg} ${statusInfo.color} text-xs font-medium px-2 py-1 rounded-full border-0`}
                          >
                            <option value="pending">في الانتظار</option>
                            <option value="processing">قيد التنفيذ</option>
                            <option value="completed">مكتمل</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.priority}
                          onChange={(e) => updateOrderPriority(order.id, e.target.value)}
                          className={`${priorityInfo.color} text-xs font-medium px-2 py-1 rounded border-0 bg-transparent`}
                        >
                          <option value="low">منخفضة</option>
                          <option value="medium">متوسطة</option>
                          <option value="high">عالية</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsViewModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {order.customerPhone && (
                            <button
                              onClick={() => openWhatsApp(order.customerPhone, order.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400"
                              title="واتساب"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Modal */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  تفاصيل الطلب #{selectedOrder.id.slice(-6)}
                </h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">معلومات العميل</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedOrder.customerName || 'غير مح��د'}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedOrder.customerEmail || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedOrder.customerPhone || 'غير محدد'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">تفاصيل الطلب</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedOrder.serviceName || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedOrder.amount ? `${selectedOrder.amount.toLocaleString('ar-SA')} ر.س` : 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">ملاحظات</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
