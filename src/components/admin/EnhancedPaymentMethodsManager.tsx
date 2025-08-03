import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Plus, Edit2, Trash2, Check, X, 
  DollarSign, Smartphone, Globe, Building, 
  Eye, EyeOff, Save, Coins, Wallet, ArrowUp, ArrowDown
} from 'lucide-react';
import { databaseService } from '../../services/database';
import EnhancedButton from '../ui/EnhancedButton';
import EnhancedCard from '../ui/EnhancedCard';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'wallet' | 'crypto' | 'card' | 'cash' | 'vodafone' | 'usdt';
  details: {
    accountNumber?: string;
    iban?: string;
    beneficiaryName?: string;
    bankName?: string;
    walletNumber?: string;
    cryptoAddress?: string;
    vodafoneNumber?: string;
    usdtAddress?: string;
    network?: string;
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

const defaultPaymentMethods: Partial<PaymentMethod>[] = [
  {
    name: 'فودافون كاش',
    type: 'vodafone',
    color: '#E60012',
    details: {
      vodafoneNumber: '+201062453344',
      instructions: 'قم بإرسال المبلغ المطلوب إلى رقم فودافون كاش، ثم أرسل صورة إيصال التحويل'
    }
  },
  {
    name: 'USDT (TRC20)',
    type: 'usdt',
    color: '#26A17B',
    details: {
      usdtAddress: 'TBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      network: 'TRC20',
      instructions: 'أرسل USDT إلى العنوان المحدد على شبكة TRC20 فقط'
    }
  }
];

export const EnhancedPaymentMethodsManager: React.FC = () => {
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
      let methods = await databaseService.getPaymentMethods();
      
      // Add default payment methods if they don't exist
      if (methods.length === 0) {
        for (const defaultMethod of defaultPaymentMethods) {
          try {
            await databaseService.createPaymentMethod({
              ...defaultMethod,
              id: '',
              isActive: true,
              order: methods.length + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            } as PaymentMethod);
          } catch (error) {
            console.error('Error creating default payment method:', error);
          }
        }
        methods = await databaseService.getPaymentMethods();
      }
      
      setPaymentMethods(methods);
    } catch (error) {
      console.error('خطأ في تحميل طرق الدفع:', error);
      // Fallback to localStorage
      const savedMethods = localStorage.getItem('kyc-payment-methods');
      if (savedMethods) {
        setPaymentMethods(JSON.parse(savedMethods));
      } else {
        // Create default methods in localStorage
        const methods = defaultPaymentMethods.map((method, index) => ({
          ...method,
          id: `pm-${Date.now()}-${index}`,
          isActive: true,
          order: index + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })) as PaymentMethod[];
        setPaymentMethods(methods);
        localStorage.setItem('kyc-payment-methods', JSON.stringify(methods));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (method: PaymentMethod) => {
    const isNew = !method.id || method.id === 'new';
    
    try {
      if (isNew) {
        const newMethod = {
          ...method,
          id: `pm-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          order: paymentMethods.length + 1
        };
        
        try {
          await databaseService.createPaymentMethod(newMethod);
        } catch (error) {
          // Fallback to localStorage
          const updatedMethods = [...paymentMethods, newMethod];
          setPaymentMethods(updatedMethods);
          localStorage.setItem('kyc-payment-methods', JSON.stringify(updatedMethods));
        }
      } else {
        try {
          await databaseService.updatePaymentMethod(method.id, {
            ...method,
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          // Fallback to localStorage
          const updatedMethods = paymentMethods.map(pm => 
            pm.id === method.id ? { ...method, updatedAt: new Date().toISOString() } : pm
          );
          setPaymentMethods(updatedMethods);
          localStorage.setItem('kyc-payment-methods', JSON.stringify(updatedMethods));
        }
      }
      
      setIsModalOpen(false);
      setEditingMethod(null);
      loadPaymentMethods();
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
      // Fallback to localStorage
      const updatedMethods = paymentMethods.filter(pm => pm.id !== id);
      setPaymentMethods(updatedMethods);
      localStorage.setItem('kyc-payment-methods', JSON.stringify(updatedMethods));
      toast.success('تم حذف طريقة الدفع بنجاح');
    }
  };

  const toggleActive = async (id: string) => {
    const method = paymentMethods.find(pm => pm.id === id);
    if (!method) return;

    try {
      await databaseService.updatePaymentMethod(id, { 
        isActive: !method.isActive,
        updatedAt: new Date().toISOString()
      });
      loadPaymentMethods();
      toast.success(`تم ${method.isActive ? 'تعطيل' : 'تفعيل'} طريقة الدفع`);
    } catch (error) {
      // Fallback to localStorage
      const updatedMethods = paymentMethods.map(pm =>
        pm.id === id ? { ...pm, isActive: !pm.isActive, updatedAt: new Date().toISOString() } : pm
      );
      setPaymentMethods(updatedMethods);
      localStorage.setItem('kyc-payment-methods', JSON.stringify(updatedMethods));
      toast.success(`تم ${method.isActive ? 'تعطيل' : 'تفعيل'} طريقة الدفع`);
    }
  };

  const moveMethod = (id: string, direction: 'up' | 'down') => {
    const index = paymentMethods.findIndex(pm => pm.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === paymentMethods.length - 1)
    ) return;

    const newMethods = [...paymentMethods];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newMethods[index], newMethods[newIndex]] = [newMethods[newIndex], newMethods[index]];
    
    // Update order values
    newMethods.forEach((method, idx) => {
      method.order = idx + 1;
    });
    
    setPaymentMethods(newMethods);
    localStorage.setItem('kyc-payment-methods', JSON.stringify(newMethods));
    toast.success('تم تحديث ترتيب طرق الدفع');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bank': return Building;
      case 'wallet': return Smartphone;
      case 'crypto': return Globe;
      case 'card': return CreditCard;
      case 'cash': return DollarSign;
      case 'vodafone': return Smartphone;
      case 'usdt': return Coins;
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
      case 'vodafone': return 'فودافون كاش';
      case 'usdt': return 'USDT';
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
      <EnhancedCard variant="elevated" padding="lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              إدارة طرق الدفع
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              إضافة وتعديل طرق الدفع المتاحة للعملاء
            </p>
          </div>
          
          <EnhancedButton
            variant="primary"
            size="lg"
            icon={Plus}
            glow
            onClick={() => {
              setEditingMethod({
                id: 'new',
                name: '',
                type: 'vodafone',
                details: {},
                isActive: true,
                order: paymentMethods.length + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
              setIsModalOpen(true);
            }}
          >
            إضافة طريقة دفع
          </EnhancedButton>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-600 ml-3" />
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">إجمالي الطرق</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {paymentMethods.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-600 ml-3" />
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">النشطة</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {paymentMethods.filter(pm => pm.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
            <div className="flex items-center">
              <Smartphone className="h-8 w-8 text-purple-600 ml-3" />
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">المحافظ</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {paymentMethods.filter(pm => pm.type === 'wallet' || pm.type === 'vodafone').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-yellow-600 ml-3" />
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">العملات الرقمية</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {paymentMethods.filter(pm => pm.type === 'crypto' || pm.type === 'usdt').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </EnhancedCard>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods
          .sort((a, b) => a.order - b.order)
          .map((method) => {
            const TypeIcon = getTypeIcon(method.type);
            
            return (
              <EnhancedCard
                key={method.id}
                variant={method.isActive ? "elevated" : "bordered"}
                hover
                glow={method.isActive}
                className={`transition-all ${
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
                      <EnhancedButton
                        variant={method.isActive ? "success" : "secondary"}
                        size="sm"
                        onClick={() => toggleActive(method.id)}
                        title={method.isActive ? 'تعطيل' : 'تفعيل'}
                      >
                        {method.isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </EnhancedButton>
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
                          <EnhancedButton
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleSensitiveInfo(method.id)}
                          >
                            {showSensitive[method.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </EnhancedButton>
                        </div>
                      </div>
                    )}
                    
                    {method.details.vodafoneNumber && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">رقم فودافون كاش</p>
                        <p className="text-sm font-mono text-red-600 font-semibold">
                          {method.details.vodafoneNumber}
                        </p>
                      </div>
                    )}
                    
                    {method.details.usdtAddress && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">عنوان USDT ({method.details.network})</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-mono text-green-600">
                            {showSensitive[method.id] ? method.details.usdtAddress : maskSensitiveData(method.details.usdtAddress)}
                          </p>
                          <EnhancedButton
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleSensitiveInfo(method.id)}
                          >
                            {showSensitive[method.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </EnhancedButton>
                        </div>
                      </div>
                    )}
                    
                    {method.details.beneficiaryName && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">اسم المستفيد</p>
                        <p className="text-sm">{method.details.beneficiaryName}</p>
                      </div>
                    )}
                    
                    {method.details.instructions && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">التعليمات</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {method.details.instructions}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2 space-x-reverse">
                      <EnhancedButton
                        variant="secondary"
                        size="sm"
                        onClick={() => moveMethod(method.id, 'up')}
                        disabled={method.order === 1}
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </EnhancedButton>
                      <EnhancedButton
                        variant="secondary"
                        size="sm"
                        onClick={() => moveMethod(method.id, 'down')}
                        disabled={method.order === paymentMethods.length}
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </EnhancedButton>
                    </div>
                    
                    <div className="flex space-x-2 space-x-reverse">
                      <EnhancedButton
                        variant="info"
                        size="sm"
                        onClick={() => {
                          setEditingMethod(method);
                          setIsModalOpen(true);
                        }}
                        title="تعديل"
                      >
                        <Edit2 className="h-4 w-4" />
                      </EnhancedButton>
                      <EnhancedButton
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(method.id)}
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </EnhancedButton>
                    </div>
                  </div>
                </div>
              </EnhancedCard>
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

// Enhanced Payment Method Form Component
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
      toast.error('يرجى إدخال اسم طريقة الدفع');
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
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="مثال: فودافون كاش"
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
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="bank">تحويل بنكي</option>
            <option value="wallet">محفظة إلكترونية</option>
            <option value="vodafone">فودافون كاش</option>
            <option value="card">بطاقة ائتمانية</option>
            <option value="crypto">عملة رقمية</option>
            <option value="usdt">USDT</option>
            <option value="cash">نقداً</option>
          </select>
        </div>
      </div>

      {/* Payment Details */}
      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">تفاصيل الدفع</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Vodafone Cash */}
          {formData.type === 'vodafone' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رقم فودافون كاش
              </label>
              <input
                type="text"
                placeholder="+201062453344"
                value={formData.details.vodafoneNumber || ''}
                onChange={(e) => updateDetails('vodafoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          )}

          {/* USDT */}
          {formData.type === 'usdt' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان USDT
                </label>
                <input
                  type="text"
                  placeholder="TBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={formData.details.usdtAddress || ''}
                  onChange={(e) => updateDetails('usdtAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الشبكة
                </label>
                <select
                  value={formData.details.network || 'TRC20'}
                  onChange={(e) => updateDetails('network', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="TRC20">TRC20</option>
                  <option value="ERC20">ERC20</option>
                  <option value="BEP20">BEP20</option>
                </select>
              </div>
            </>
          )}

          {/* Bank Transfer */}
          {formData.type === 'bank' && (
            <>
              <input
                type="text"
                placeholder="رقم الآيبان (IBAN)"
                value={formData.details.iban || ''}
                onChange={(e) => updateDetails('iban', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="اسم المستفيد"
                value={formData.details.beneficiaryName || ''}
                onChange={(e) => updateDetails('beneficiaryName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="اسم البنك"
                value={formData.details.bankName || ''}
                onChange={(e) => updateDetails('bankName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          )}
          
          {formData.type === 'crypto' && (
            <input
              type="text"
              placeholder="عنوان المحفظة"
              value={formData.details.cryptoAddress || ''}
              onChange={(e) => updateDetails('cryptoAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="تعليمات للعميل حول كيفية الدفع"
          />
        </div>
      </div>

      {/* Style and Settings */}
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
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
            طريقة دفع نشطة
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200 dark:border-gray-700">
        <EnhancedButton
          variant="secondary"
          onClick={onCancel}
          type="button"
        >
          إلغاء
        </EnhancedButton>
        <EnhancedButton
          variant="primary"
          type="submit"
          icon={Save}
          glow
        >
          حفظ
        </EnhancedButton>
      </div>
    </form>
  );
};

export default EnhancedPaymentMethodsManager;
