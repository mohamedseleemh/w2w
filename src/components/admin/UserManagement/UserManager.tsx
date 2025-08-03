/**
 * Advanced User Management Component
 * مكون إدارة المستخدمين المتقدم
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  UserRole, 
  authService, 
  RegisterData,
  TwoFactorSetup 
} from '../../../services/authService';

interface UserManagerProps {
  onUserSelect?: (user: User) => void;
}

interface UserFilters {
  search: string;
  role: UserRole | 'all';
  status: 'all' | 'active' | 'inactive' | 'locked';
  sortBy: 'name' | 'email' | 'role' | 'lastLogin' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

const UserManager: React.FC<UserManagerProps> = ({ onUserSelect }) => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Form states
  const [newUser, setNewUser] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'viewer',
    permissions: []
  });

  const [editUser, setEditUser] = useState<Partial<User>>({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Available permissions
  const [availablePermissions, setAvailablePermissions] = useState<string[]>([
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'orders.view', 'orders.create', 'orders.edit', 'orders.delete',
    'services.view', 'services.create', 'services.edit', 'services.delete',
    'content.view', 'content.create', 'content.edit', 'content.delete',
    'settings.view', 'settings.edit',
    'analytics.view',
    'backup.create', 'backup.restore'
  ]);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Apply filters when users or filters change
  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  /**
   * Load users from backend
   * تحميل المستخدمين من الخادم
   */
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would fetch from an API
      // For now, we'll simulate with some mock data
      const mockUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          email: 'admin@kyctrust.com',
          fullName: 'مدير النظام',
          role: 'super_admin',
          permissions: availablePermissions,
          language: 'ar',
          timezone: 'UTC',
          isActive: true,
          twoFactorEnabled: false,
          loginAttempts: 0,
          emailVerified: true,
          preferences: {},
          metadata: {},
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          lastLogin: new Date()
        }
      ];

      setUsers(mockUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  }, [availablePermissions]);

  /**
   * Apply current filters to users list
   * تطبيق المرشحات الحالية على قائمة المستخدمين
   */
  const applyFilters = useCallback(() => {
    let filtered = [...users];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.fullName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Status filter
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'active':
          filtered = filtered.filter(user => user.isActive && !user.lockedUntil);
          break;
        case 'inactive':
          filtered = filtered.filter(user => !user.isActive);
          break;
        case 'locked':
          filtered = filtered.filter(user => user.lockedUntil && user.lockedUntil > new Date());
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.fullName;
          bValue = b.fullName;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'lastLogin':
          aValue = a.lastLogin || new Date(0);
          bValue = b.lastLogin || new Date(0);
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(filtered);
  }, [users, filters]);

  /**
   * Handle user creation
   * التعامل مع إنشاء مستخدم
   */
  const handleCreateUser = async () => {
    try {
      setError(null);
      
      // Validate form
      if (!newUser.username || !newUser.email || !newUser.password || !newUser.fullName) {
        throw new Error('جميع الحقول مطلوبة');
      }

      // Create user
      const createdUser = await authService.register(newUser);
      
      // Add to local state
      setUsers(prev => [...prev, createdUser]);
      
      // Reset form and close modal
      setNewUser({
        username: '',
        email: '',
        password: '',
        fullName: '',
        role: 'viewer',
        permissions: []
      });
      setShowCreateModal(false);
      
      alert('تم إنشاء المستخدم بنجاح');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في إنشاء المستخدم');
    }
  };

  /**
   * Handle user update
   * التعامل مع تحديث المستخدم
   */
  const handleUpdateUser = async () => {
    try {
      if (!selectedUser) return;
      
      setError(null);
      
      // Update user in local state
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { ...user, ...editUser } : user
      ));
      
      setShowEditModal(false);
      setEditUser({});
      setSelectedUser(null);
      
      alert('تم تحديث المستخدم بنجاح');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تحديث المستخدم');
    }
  };

  /**
   * Handle user deletion
   * التعامل مع حذف المستخدم
   */
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    
    try {
      setError(null);
      
      // Remove from local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      alert('تم حذف المستخدم بنجاح');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في حذف المستخدم');
    }
  };

  /**
   * Handle password change
   * التعامل مع تغيير كلمة المرور
   */
  const handlePasswordChange = async () => {
    try {
      if (!selectedUser) return;
      
      setError(null);
      
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('كلمات المرور غير متطابقة');
      }

      await authService.changePassword(
        selectedUser.id, 
        passwordForm.currentPassword, 
        passwordForm.newPassword
      );
      
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      setSelectedUser(null);
      
      alert('تم تغيير كلمة المرور بنجاح');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تغيير كلمة المرور');
    }
  };

  /**
   * Toggle user active status
   * تبديل حالة نشاط المستخدم
   */
  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      setError(null);
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive: !isActive } : user
      ));
      
      alert(`تم ${!isActive ? 'تفعيل' : 'إلغاء تفعيل'} المستخدم بنجاح`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تغيير حالة المستخدم');
    }
  };

  /**
   * Get role display name in Arabic
   * الحصول على اسم الدور باللغة العربية
   */
  const getRoleDisplayName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      'super_admin': 'مدير عام',
      'admin': 'مدير',
      'editor': 'محرر',
      'viewer': 'مشاهد'
    };
    return roleNames[role] || role;
  };

  /**
   * Get status display
   * الحصول على عرض الحالة
   */
  const getStatusDisplay = (user: User): { text: string; color: string } => {
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return { text: 'مقفل', color: 'text-red-600' };
    }
    if (!user.isActive) {
      return { text: 'غير نشط', color: 'text-gray-600' };
    }
    return { text: 'نشط', color: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="mr-2">تحميل المستخدمين...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + إضافة مستخدم جديد
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <input
            type="text"
            placeholder="البحث بالاسم أو البريد الإلكتروني..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Role Filter */}
        <select
          value={filters.role}
          onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as UserRole | 'all' }))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">جميع الأدوار</option>
          <option value="super_admin">مدير عام</option>
          <option value="admin">مدير</option>
          <option value="editor">محرر</option>
          <option value="viewer">مشاهد</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
          <option value="locked">مقفل</option>
        </select>

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            setFilters(prev => ({ 
              ...prev, 
              sortBy: sortBy as any, 
              sortOrder: sortOrder as any 
            }));
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="createdAt-desc">الأحدث أولاً</option>
          <option value="createdAt-asc">الأقدم أولاً</option>
          <option value="name-asc">الاسم (أ-ي)</option>
          <option value="name-desc">الاسم (ي-أ)</option>
          <option value="lastLogin-desc">آخر تسجيل دخول</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المستخدم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الدور
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                آخر تسجيل دخول
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => {
              const status = getStatusDisplay(user);
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.fullName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${status.color}`}>
                      {status.text}
                    </span>
                    {user.twoFactorEnabled && (
                      <span className="mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        2FA
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? user.lastLogin.toLocaleDateString('ar-SA') : 'لم يسجل دخول'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setEditUser({
                            fullName: user.fullName,
                            email: user.email,
                            role: user.role,
                            permissions: user.permissions
                          });
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPasswordModal(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        كلمة المرور
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={user.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                      >
                        {user.isActive ? 'إلغاء تفعيل' : 'تفعيل'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد مستخدمين مطابقين للمرشحات المحددة</p>
        </div>
      )}

      {/* Modals */}
      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">إضافة مستخدم جديد</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="اسم المستخدم"
                  value={newUser.username}
                  onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="viewer">مشاهد</option>
                  <option value="editor">محرر</option>
                  <option value="admin">مدير</option>
                  <option value="super_admin">مدير عام</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 space-x-reverse mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCreateUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  إنشاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">تعديل المستخدم</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={editUser.fullName || ''}
                  onChange={(e) => setEditUser(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={editUser.email || ''}
                  onChange={(e) => setEditUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                
                <select
                  value={editUser.role || selectedUser.role}
                  onChange={(e) => setEditUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="viewer">مشاهد</option>
                  <option value="editor">محرر</option>
                  <option value="admin">مدير</option>
                  <option value="super_admin">مدير عام</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 space-x-reverse mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">تغيير كلمة المرور</h3>
              
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="كلمة المرور الحالية"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                
                <input
                  type="password"
                  placeholder="كلمة المرور الجديدة"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                
                <input
                  type="password"
                  placeholder="تأكيد كلمة المرور الجديدة"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="flex justify-end space-x-2 space-x-reverse mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  إلغاء
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  تغيير
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
