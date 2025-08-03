import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Plus, Edit2, Trash2, Check, X, 
  DollarSign, Smartphone, Globe, Building, 
  Eye, EyeOff, Save
} from 'lucide-react';
import { databaseService } from '../../services/database';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'wallet' | 'crypto' | 'card' | 'cash';
  details: {
    accountNumber?: string;
    iban?: string;
    beneficiaryName?: string;
    bankName?: string;
    walletNumber?: string;
    cryptoAddress?: string;
    qrCode?: string;
    instructions?: string;
  };
  isActive: boolean;
  fees?: {
    fixed?: number;
    percentage?: number;
  };
  limits?: {
    min?: number;
    max?: number;
  };
  icon?: string;
  color?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const PaymentMethodsManager: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const methods = await databaseService.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error('خطأ في تحميل طرق الدفع:', error);
      toast.error('فشل في تحميل طرق الدفع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (method: PaymentMethod) => {
    const isNew = !method.id || method.id === 'new';
    
    try {
      if (isNew) {
        await databaseService.createPaymentMethod(method);
      } else {
        await databaseService.updatePaymentMethod(method.id, method);
      }
      setIsModalOpen(false);
      setEditingMethod(null);
      loadPaymentMethods(); // Refresh the list
      toast.success('تم حفظ طريقة الدفع بنجاح');
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error('فشل في حفظ طريقة الدفع');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف طريقة الدفع هذه؟')) return;
    
    try {
      await databaseService.deletePaymentMethod(id);
      loadPaymentMethods();
      toast.success('تم حذف طريقة الدفع بنجاح');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('فشل في حذف طريقة الدفع');
    }
  };

  const toggleActive = async (id: string) => {
    const method = paymentMethods.find(pm => pm.id === id);
    if (!method) return;

    try {
      await databaseService.updatePaymentMethod(id, { isActive: !method.isActive });
      loadPaymentMethods();
      toast.success(`تم ${method.isActive ? 'تعطيل' : 'تفعيل'} طريقة الدفع`);
    } catch (error) {
      console.error('Error toggling payment method:', error);
      toast.error('فشل في تغيير حالة طريقة الدفع');
    }
  };

  const moveMethod = async (id: string, direction: 'up' | 'down') => {
    const index = paymentMethods.findIndex(pm => pm.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === paymentMethods.length - 1)
    ) return;

    const newMethods = [...paymentMethods];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newMethods[index], newMethods[newIndex]] = [newMethods[newIndex], newMethods[index]];
    
    try {
      // Update order values for both swapped items
      await Promise.all([
        databaseService.updatePaymentMethod(newMethods[index].id, { order: index + 1 }),
        databaseService.updatePaymentMethod(newMethods[newIndex].id, { order: newIndex + 1 })
      ]);
      loadPaymentMethods();
      toast.success('تم تحديث ترتيب طرق الدفع');
    } catch (error) {
      console.error('Error moving payment method:', error);
      toast.error('فشل في تحديث ترتيب طرق الدفع');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bank': return Building;
      case 'wallet': return Smartphone;
      case 'crypto': return Globe;
      case 'card': return CreditCard;
      case 'cash': return DollarSign;
      default: return CreditCard;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bank': return 'تحويل بنكي';
      case 'wallet': return 'محفظة إلكترونية';
      case 'crypto': return 'عملة رقمية';
      case 'card': return 'بطاقة ائتمانية';
      case 'cash': return 'نقداً';
      default: return 'غير محدد';
    }
  };

  const toggleSensitiveInfo = (methodId: string) => {
    setShowSensitive(prev => ({
      ...prev,
      [methodId]: !prev[methodId]
    }));
  };

  const maskSensitiveData = (data: string) => {
    if (data.length <= 4) return data;
    return data.slice(0, 2) + '*'.repeat(data.length - 4) + data.slice(-2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            إدارة طرق الدفع
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            إضافة وتعديل طرق الدفع المتاحة للعملاء
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditingMethod({
              id: 'new',
              name: '',
              type: 'bank',
              details: {},
              isActive: true,
              order: paymentMethods.length + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          إضافة طريقة دفع
        </button>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => {
          const TypeIcon = getTypeIcon(method.type);
          
          return (
            <div
              key={method.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all ${
                method.isActive 
                  ? 'border-green-200 dark:border-green-800' 
                  : 'border-gray-200 dark:border-gray-700 opacity-60'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div 
                      className="p-3 rounded-full"
                      style={{ backgroundColor: method.color + '20' }}
                    >
                      <TypeIcon 
                        className="h-6 w-6" 
                        style={{ color: method.color }}
                      />
                    </div>
                    <div className="mr-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {method.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTypeLabel(method.type)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => toggleActive(method.id)}
                      className={`p-2 rounded-lg ${
                        method.isActive 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                      title={method.isActive ? 'تعطيل' : 'تفعيل'}
                    >
                      {method.isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-3 mb-4">
                  {method.details.iban && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">IBAN</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-mono">
                          {showSensitive[method.id] ? method.details.iban : maskSensitiveData(method.details.iban)}
                        </p>
                        <button
                          onClick={() => toggleSensitiveInfo(method.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showSensitive[method.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {method.details.walletNumber && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">رقم المحفظة</p>
                      <p className="text-sm font-mono">
                        {showSensitive[method.id] ? method.details.walletNumber : maskSensitiveData(method.details.walletNumber)}
                      </p>
                    </div>
                  )}
                  
                  {method.details.beneficiaryName && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">اسم المستفيد</p>
                      <p className="text-sm">{method.details.beneficiaryName}</p>
                    </div>
                  )}
                  
                  {method.details.bankName && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">البنك</p>
                      <p className="text-sm">{method.details.bankName}</p>
                    </div>
                  )}
                </div>

                {/* Fees and Limits */}
                {(method.fees || method.limits) && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-4">
                    {method.fees && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        الرسوم: {method.fees.fixed ? `${method.fees.fixed} ر.س` : ''} 
                        {method.fees.percentage ? ` + ${method.fees.percentage}%` : ''}
                      </div>
                    )}
                    {method.limits && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        الحدود: {method.limits.min ? `من ${method.limits.min}` : ''} 
                        {method.limits.max ? ` إلى ${method.limits.max} ر.س` : ''}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => moveMethod(method.id, 'up')}
                      disabled={method.order === 1}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30"
                      title="تحريك لأعلى"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveMethod(method.id, 'down')}
                      disabled={method.order === paymentMethods.length}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30"
                      title="تحريك لأسفل"
                    >
                      ↓
                    </button>
                  </div>
                  
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => {
                        setEditingMethod(method);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      title="تعديل"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingMethod.id === 'new' ? 'إضافة طريقة دفع جديدة' : 'تعديل طريقة الدفع'}
              </h3>
            </div>
            
            <div className="p-6">
              <PaymentMethodForm
                method={editingMethod}
                onSave={handleSave}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingMethod(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Payment Method Form Component
interface PaymentMethodFormProps {
  method: PaymentMethod;
  onSave: (method: PaymentMethod) => void;
  onCancel: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ method, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PaymentMethod>(method);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('يرجى إدخال اسم طريقة الدفع');
      return;
    }
    onSave(formData);
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateDetails = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      details: { ...prev.details, [field]: value }
    }));
  };

  const updateFees = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      fees: { ...prev.fees, [field]: value }
    }));
  };

  const updateLimits = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      limits: { ...prev.limits, [field]: value }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اسم طريقة الدفع *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="مثال: تحويل بنكي - الراجحي"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            نوع طريقة الدفع
          </label>
          <select
            value={formData.type}
            onChange={(e) => updateField('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="bank">تحويل بنكي</option>
            <option value="wallet">محفظة إلكترونية</option>
            <option value="card">بطاقة ائتمانية</option>
            <option value="crypto">عملة رقمية</option>
            <option value="cash">نقداً</option>
          </select>
        </div>
      </div>

      {/* Payment Details */}
      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">تفاصيل الدفع</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.type === 'bank' && (
            <>
              <input
                type="text"
                placeholder="رقم الآيبان (IBAN)"
                value={formData.details.iban || ''}
                onChange={(e) => updateDetails('iban', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="اسم المستفيد"
                value={formData.details.beneficiaryName || ''}
                onChange={(e) => updateDetails('beneficiaryName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="اسم البنك"
                value={formData.details.bankName || ''}
                onChange={(e) => updateDetails('bankName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </>
          )}
          
          {formData.type === 'wallet' && (
            <input
              type="text"
              placeholder="رقم المحفظة"
              value={formData.details.walletNumber || ''}
              onChange={(e) => updateDetails('walletNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          )}
          
          {formData.type === 'crypto' && (
            <input
              type="text"
              placeholder="عنوان المحفظة"
              value={formData.details.cryptoAddress || ''}
              onChange={(e) => updateDetails('cryptoAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          )}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            تعليمات الدفع
          </label>
          <textarea
            value={formData.details.instructions || ''}
            onChange={(e) => updateDetails('instructions', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            rows={3}
            placeholder="تعليمات للعميل حول كيفية الدفع"
          />
        </div>
      </div>

      {/* Fees and Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">الرسوم</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                رسوم ثابتة (ر.س)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.fees?.fixed || ''}
                onChange={(e) => updateFees('fixed', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                رسوم نسبية (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.fees?.percentage || ''}
                onChange={(e) => updateFees('percentage', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">حدود المبالغ</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                الحد الأدنى (ر.س)
              </label>
              <input
                type="number"
                min="0"
                value={formData.limits?.min || ''}
                onChange={(e) => updateLimits('min', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                الحد الأقصى (ر.س)
              </label>
              <input
                type="number"
                min="0"
                value={formData.limits?.max || ''}
                onChange={(e) => updateLimits('max', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            لون طريقة الدفع
          </label>
          <input
            type="color"
            value={formData.color || '#6366F1'}
            onChange={(e) => updateField('color', e.target.value)}
            className="w-full h-10 border border-gray-300 dark:border-gray-700 rounded-lg"
          />
        </div>
        
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => updateField('isActive', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
            طريقة دفع نشطة
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 space-x-reverse">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          حفظ
        </button>
      </div>
    </form>
  );
};

export default PaymentMethodsManager;
