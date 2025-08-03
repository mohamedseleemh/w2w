import React, { useState, useMemo } from 'react';
import { Users, UserPlus, Shield, Search, Edit2, Trash2, UserCheck, UserX, Calendar, Activity, Award, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'inactive' | 'banned';
  createdAt: Date;
  lastLogin: Date;
  orders: number;
  avatar?: string;
  permissions: string[];
}

const UsersManager: React.FC = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date(),
      orders: 25,
      permissions: ['all']
    },
    {
      id: '2',
      name: 'فاطمة سالم',
      email: 'fatima@example.com',
      role: 'moderator',
      status: 'active',
      createdAt: new Date('2024-02-10'),
      lastLogin: new Date(Date.now() - 3600000),
      orders: 12,
      permissions: ['manage_orders', 'view_analytics']
    },
    {
      id: '3',
      name: 'خالد العلي',
      email: 'khalid@example.com',
      role: 'user',
      status: 'active',
      createdAt: new Date('2024-03-01'),
      lastLogin: new Date(Date.now() - 86400000),
      orders: 3,
      permissions: ['place_orders']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(user => user.id !== userId));
      toast.success('تم حذف المستخدم بنجاح');
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    toast.success('تم تحديث حالة المستخدم');
  };

  const roleColors = {
    admin: 'bg-red-100 text-red-800 border-red-200',
    moderator: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    user: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    banned: 'bg-red-100 text-red-800 border-red-200'
  };

  const roleLabels = {
    admin: 'مدير',
    moderator: 'مشرف',
    user: 'مستخدم'
  };

  const statusLabels = {
    active: 'نشط',
    inactive: 'غير نشط',
    banned: 'محظور'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            إدارة المستخدمين
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            إدارة المستخدمين والصلاحيات والأدوار
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-reverse space-x-2"
        >
          <UserPlus className="h-5 w-5" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {users.length}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                إجمالي المستخدمين
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {users.filter(u => u.status === 'active').length}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                مستخدمين نشطين
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {users.filter(u => u.role === 'admin' || u.role === 'moderator').length}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                مشرفين
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {users.reduce((total, user) => total + user.orders, 0)}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                إجمالي الطلبات
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`p-6 rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="البحث بالاسم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`px-4 py-3 pr-10 rounded-xl border focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">جميع الأدوار</option>
              <option value="admin">مدير</option>
              <option value="moderator">مشرف</option>
              <option value="user">مستخدم</option>
            </select>
            <ChevronDown className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-3 pr-10 rounded-xl border focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="banned">محظور</option>
            </select>
            <ChevronDown className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-xl border overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-4 text-right text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  المستخدم
                </th>
                <th className={`px-6 py-4 text-right text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  الدور
                </th>
                <th className={`px-6 py-4 text-right text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  الحالة
                </th>
                <th className={`px-6 py-4 text-right text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  الطلبات
                </th>
                <th className={`px-6 py-4 text-right text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  آخر دخول
                </th>
                <th className={`px-6 py-4 text-right text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-reverse space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {user.name}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[user.status]}`}>
                      {statusLabels[user.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {user.orders}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {user.lastLogin.toLocaleDateString('ar-EG')}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user.lastLogin.toLocaleTimeString('ar-EG')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        title="تعديل"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === 'active'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.status === 'active' ? 'إلغاء التنشيط' : 'تنشيط'}
                      >
                        {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className={`h-12 w-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              لم يتم العثور على ��ستخدمين
            </p>
          </div>
        )}
      </div>

      {/* Performance Analytics */}
      <div className={`p-6 rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          تحليل أداء المستخدمين
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              المستخدمين الأكثر نشاطاً
            </h4>
            {users
              .sort((a, b) => b.orders - a.orders)
              .slice(0, 3)
              .map((user, index) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {user.name}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {user.orders} طلب
                  </span>
                </div>
              ))}
          </div>
          
          <div className="space-y-3">
            <h4 className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              توزيع الأدوار
            </h4>
            {['admin', 'moderator', 'user'].map(role => {
              const count = users.filter(u => u.role === role).length;
              const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
              
              return (
                <div key={role} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {roleLabels[role as keyof typeof roleLabels]}
                    </span>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {count}
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="space-y-3">
            <h4 className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              نشاط المستخدمين
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  متصلين اليوم
                </span>
                <span className={`text-sm font-medium text-green-600`}>
                  {users.filter(u => {
                    const today = new Date();
                    const loginDate = new Date(u.lastLogin);
                    return loginDate.toDateString() === today.toDateString();
                  }).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  متصلين هذا الأسبوع
                </span>
                <span className={`text-sm font-medium text-blue-600`}>
                  {users.filter(u => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(u.lastLogin) >= weekAgo;
                  }).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  غير نشطين لأكثر من شهر
                </span>
                <span className={`text-sm font-medium text-orange-600`}>
                  {users.filter(u => {
                    const monthAgo = new Date();
                    monthAgo.setDate(monthAgo.getDate() - 30);
                    return new Date(u.lastLogin) < monthAgo;
                  }).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManager;
