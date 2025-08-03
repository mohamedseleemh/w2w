import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, 
  Search, Filter, Save, X, RefreshCw, Package, DollarSign,
  BarChart3, Star, Users, Zap, CheckCircle, AlertCircle,
  Settings, Globe, Target, Award
} from 'lucide-react';
import { 
  SuperButton, 
  EnhancedCard, 
  UltraButton 
} from '../ui';
import { EnhancedInput, EnhancedTextarea } from '../forms/EnhancedForm';
import toast from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  duration: string;
  features: string[];
  popular: boolean;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  icon: string;
  color: string;
  tags: string[];
  requirements: string[];
  deliverables: string[];
}

const RealServicesManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    description: '',
    price: 0,
    category: 'kyc',
    duration: '1-3 أيام',
    features: [''],
    popular: false,
    active: true,
    icon: 'shield',
    color: 'blue',
    tags: [''],
    requirements: [''],
    deliverables: ['']
  });

  const categories = [
    { id: 'kyc', label: 'خدمات KYC', color: 'from-blue-500 to-cyan-500' },
    { id: 'compliance', label: 'الامتثال القانوني', color: 'from-green-500 to-emerald-500' },
    { id: 'verification', label: 'التحقق من الهوية', color: 'from-purple-500 to-pink-500' },
    { id: 'consulting', label: 'الاستشارات', color: 'from-orange-500 to-red-500' },
    { id: 'audit', label: 'المراجعة والتدقيق', color: 'from-indigo-500 to-purple-500' },
    { id: 'training', label: 'التدريب', color: 'from-yellow-500 to-orange-500' }
  ];

  const icons = [
    'shield', 'check', 'star', 'award', 'zap', 'users', 
    'globe', 'settings', 'target', 'eye', 'lock', 'book'
  ];

  const colors = [
    'blue', 'green', 'purple', 'orange', 'red', 'indigo', 
    'yellow', 'pink', 'cyan', 'emerald', 'violet', 'amber'
  ];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem('kyc-services');
      if (saved) {
        setServices(JSON.parse(saved));
      } else {
        const defaultServices = generateDefaultServices();
        setServices(defaultServices);
        localStorage.setItem('kyc-services', JSON.stringify(defaultServices));
      }
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('خطأ في تحميل الخدمات');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDefaultServices = (): Service[] => [
    {
      id: '1',
      name: 'خدمة التحقق الأساسية',
      description: 'خدمة التحقق من الهوية الأساسية للأفراد مع التقنيات الحديثة والأمان العالي',
      price: 500,
      originalPrice: 600,
      category: 'kyc',
      duration: '1-2 أيام',
      features: [
        'التحقق من الهوية الشخصية',
        'فحص الوثائق الرسمية',
        'التحقق من العنوان',
        'تقرير مفصل',
        'دعم فني 24/7'
      ],
      popular: true,
      active: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: 'shield',
      color: 'blue',
      tags: ['أساسي', 'سريع', 'موثوق'],
      requirements: [
        'صورة من الهوية الشخصية',
        'إثبات العنوان',
        'صورة شخصية حديثة'
      ],
      deliverables: [
        'تقرير التحقق المفصل',
        'شهادة التحقق',
        'ملف PDF محمي'
      ]
    },
    {
      id: '2',
      name: 'خدمة التحقق المتقدمة',
      description: 'خدمة شاملة للتحقق من الهوية مع فحص متقدم وتقارير تفصيلية',
      price: 800,
      originalPrice: 1000,
      category: 'verification',
      duration: '2-3 أيام',
      features: [
        'جميع مميزات الباقة الأساسية',
        'فحص السجل الجنائي',
        'التحقق من المؤهلات',
        'فحص التاريخ المهني',
        'تقرير مفصل مع توصيات'
      ],
      popular: false,
      active: true,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: 'star',
      color: 'purple',
      tags: ['متقدم', 'شامل', 'مفصل'],
      requirements: [
        'جميع متطلبات الباقة الأساسية',
        'السيرة الذاتية',
        'شهادات الخبرة',
        'المؤهلات الأكاديمية'
      ],
      deliverables: [
        'تقرير شامل متقدم',
        'شهادة التحقق المعتمدة',
        'ملف تفصيلي محمي',
        'توصيات الامتثال'
      ]
    },
    {
      id: '3',
      name: 'خدمة KYC للشركات',
      description: 'حلول KYC متخصصة للشركات والمؤسسات مع أعلى معايير الامتثال',
      price: 2500,
      category: 'compliance',
      duration: '5-7 أيام',
      features: [
        'التحقق من تسجيل الشركة',
        'فحص المالكين المستفيدين',
        'تقييم مخاطر غسيل الأموال',
        'تقرير امتثال شامل',
        'استشارة قانونية',
        'دعم مخصص للشركات'
      ],
      popular: true,
      active: true,
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: 'award',
      color: 'green',
      tags: ['شركات', 'امتثال', 'احترافي'],
      requirements: [
        'السجل التجاري',
        'عقد التأسيس',
        'هويات المالكين',
        'القوائم المالية',
        'تراخيص النشاط'
      ],
      deliverables: [
        'تقرير امتثال شامل',
        'شهادة KYC للشركات',
        'دليل الامتثال',
        'استشارة قانونية',
        'خطة المخاطر'
      ]
    },
    {
      id: '4',
      name: 'الاستشارات القانونية',
      description: 'استشارات متخصصة في قوانين مكافحة غسيل الأموال والامتثال',
      price: 1200,
      category: 'consulting',
      duration: '3-5 أيام',
      features: [
        'استشارة قانونية متخصصة',
        'مراجعة السياسات',
        'إعداد دليل الا��تثال',
        'تدريب الفريق',
        'متابعة دورية'
      ],
      popular: false,
      active: true,
      order: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: 'users',
      color: 'orange',
      tags: ['استشارات', 'قانوني', 'تخصصي'],
      requirements: [
        'وصف الخدمة المطلوبة',
        'معلومات الشركة',
        'السياسات الحالية'
      ],
      deliverables: [
        'تقرير الاستشارة',
        'دليل الامتثال',
        'خطة العمل',
        'جلسات التدريب'
      ]
    }
  ];

  const saveServices = (updatedServices: Service[]) => {
    try {
      localStorage.setItem('kyc-services', JSON.stringify(updatedServices));
      setServices(updatedServices);
    } catch (error) {
      console.error('Error saving services:', error);
      toast.error('خطأ في حفظ الخدمات');
    }
  };

  const handleSaveService = () => {
    if (!formData.name || !formData.description || !formData.price) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const newService: Service = {
      id: editingService?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: formData.price,
      originalPrice: formData.originalPrice,
      category: formData.category || 'kyc',
      duration: formData.duration || '1-3 أيام',
      features: formData.features?.filter(f => f.trim()) || [],
      popular: formData.popular || false,
      active: formData.active ?? true,
      order: formData.order || services.length + 1,
      createdAt: editingService?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: formData.icon || 'shield',
      color: formData.color || 'blue',
      tags: formData.tags?.filter(t => t.trim()) || [],
      requirements: formData.requirements?.filter(r => r.trim()) || [],
      deliverables: formData.deliverables?.filter(d => d.trim()) || []
    };

    let updatedServices;
    if (editingService) {
      updatedServices = services.map(s => s.id === editingService.id ? newService : s);
      toast.success('تم تحديث الخدمة بنجاح');
    } else {
      updatedServices = [...services, newService];
      toast.success('تم إضافة الخدمة بنجاح');
    }

    saveServices(updatedServices);
    closeModal();
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('هل ��نت متأكد من حذف هذه الخدمة؟')) {
      const updatedServices = services.filter(s => s.id !== serviceId);
      saveServices(updatedServices);
      toast.success('تم حذف الخدمة بنجاح');
    }
  };

  const toggleServiceActive = (serviceId: string) => {
    const updatedServices = services.map(s => 
      s.id === serviceId ? { ...s, active: !s.active, updatedAt: new Date().toISOString() } : s
    );
    saveServices(updatedServices);
  };

  const updateServiceOrder = (serviceId: string, direction: 'up' | 'down') => {
    const serviceIndex = services.findIndex(s => s.id === serviceId);
    if (serviceIndex === -1) return;

    const newServices = [...services];
    const targetIndex = direction === 'up' ? serviceIndex - 1 : serviceIndex + 1;

    if (targetIndex >= 0 && targetIndex < services.length) {
      [newServices[serviceIndex], newServices[targetIndex]] = [newServices[targetIndex], newServices[serviceIndex]];
      
      // Update order numbers
      newServices.forEach((service, index) => {
        service.order = index + 1;
        service.updatedAt = new Date().toISOString();
      });

      saveServices(newServices);
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      ...service,
      features: [...service.features],
      tags: [...service.tags],
      requirements: [...service.requirements],
      deliverables: [...service.deliverables]
    });
    setShowAddModal(true);
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'kyc',
      duration: '1-3 أيام',
      features: [''],
      popular: false,
      active: true,
      icon: 'shield',
      color: 'blue',
      tags: [''],
      requirements: [''],
      deliverables: ['']
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingService(null);
    setFormData({});
  };

  const updateArrayField = (field: keyof Service, index: number, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: keyof Service) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData({ ...formData, [field]: [...currentArray, ''] });
  };

  const removeArrayItem = (field: keyof Service, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStats = () => {
    return {
      total: services.length,
      active: services.filter(s => s.active).length,
      popular: services.filter(s => s.popular).length,
      totalRevenue: services.reduce((sum, s) => sum + s.price, 0)
    };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mr-3" />
        <span className="text-gray-600 dark:text-gray-400">جاري تحميل الخدمات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إدارة الخدمات</h1>
          <p className="text-gray-600 dark:text-gray-400">إضافة وتحرير وإدارة خدمات المنصة</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <SuperButton
            variant="outline"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={loadServices}
          >
            تحديث
          </SuperButton>
          <SuperButton
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={openAddModal}
          >
            إضافة خدمة جديدة
          </SuperButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي الخدمات', value: stats.total, color: 'from-blue-500 to-cyan-500', icon: Package },
          { label: 'الخدمات النشطة', value: stats.active, color: 'from-green-500 to-emerald-500', icon: CheckCircle },
          { label: 'الخدمات المميزة', value: stats.popular, color: 'from-yellow-500 to-orange-500', icon: Star },
          { label: 'متوسط الأسعار', value: `${Math.round(stats.totalRevenue / stats.total || 0)} ج.م`, color: 'from-purple-500 to-pink-500', icon: DollarSign }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <EnhancedCard key={index} variant="elevated" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}>
                  <IconComponent className="h-6 w-6" />
                </div>
              </div>
            </EnhancedCard>
          );
        })}
      </div>

      {/* Filters */}
      <EnhancedCard variant="elevated" className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <EnhancedInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="البحث في الخدمات..."
                className="pl-10"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="all">جميع الفئات</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
          </div>
        </div>
      </EnhancedCard>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <EnhancedCard 
            key={service.id} 
            variant="elevated" 
            className={`group transition-all duration-300 hover:scale-105 ${!service.active ? 'opacity-60' : ''}`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${
                  categories.find(c => c.id === service.category)?.color || 'from-blue-500 to-cyan-500'
                } text-white`}>
                  {service.icon === 'shield' && <Shield className="h-6 w-6" />}
                  {service.icon === 'star' && <Star className="h-6 w-6" />}
                  {service.icon === 'award' && <Award className="h-6 w-6" />}
                  {service.icon === 'users' && <Users className="h-6 w-6" />}
                  {service.icon === 'zap' && <Zap className="h-6 w-6" />}
                  {service.icon === 'check' && <CheckCircle className="h-6 w-6" />}
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  {service.popular && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      مميز
                    </span>
                  )}
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <button
                      onClick={() => updateServiceOrder(service.id, 'up')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="رفع"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => updateServiceOrder(service.id, 'down')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="خفض"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Category and Duration */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {categories.find(c => c.id === service.category)?.label}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {service.duration}
                  </span>
                </div>

                {/* Tags */}
                {service.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {service.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Features */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">المميزات:</h4>
                  <ul className="space-y-1">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{service.features.length - 3} مميزات أخرى
                      </li>
                    )}
                  </ul>
                </div>

                {/* Price */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      {service.originalPrice && service.originalPrice > service.price && (
                        <span className="text-sm text-gray-500 line-through mr-2">
                          {service.originalPrice.toLocaleString()} ج.م
                        </span>
                      )}
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {service.price.toLocaleString()} ج.م
                      </span>
                    </div>
                    <button
                      onClick={() => toggleServiceActive(service.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        service.active 
                          ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' 
                          : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      title={service.active ? 'إلغاء التفعيل' : 'تفعيل'}
                    >
                      {service.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 space-x-reverse mt-6 pt-4 border-t">
                <button
                  onClick={() => openEditModal(service)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                  title="تحرير"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                  title="حذف"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <EnhancedCard variant="elevated" className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            لا توجد خدمات
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || categoryFilter !== 'all' 
              ? 'لا توجد خدمات مطابقة للفلاتر المحددة' 
              : 'ابدأ بإضافة خدمة جديدة'}
          </p>
          <SuperButton
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={openAddModal}
          >
            إضافة خدمة جديدة
          </SuperButton>
        </EnhancedCard>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingService ? 'تحرير الخدمة' : 'إضافة خدمة جديدة'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedInput
                    label="اسم الخدمة *"
                    value={formData.name || ''}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    placeholder="مثال: خدمة التحقق الأساسية"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الفئة *
                    </label>
                    <select
                      value={formData.category || 'kyc'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <EnhancedTextarea
                  label="وصف الخدمة *"
                  value={formData.description || ''}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  placeholder="وصف تفصيلي للخدمة ومميزاتها"
                  rows={3}
                />

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <EnhancedInput
                    label="السعر الحالي *"
                    type="number"
                    value={formData.price?.toString() || ''}
                    onChange={(value) => setFormData({ ...formData, price: parseInt(value) || 0 })}
                    placeholder="500"
                  />
                  
                  <EnhancedInput
                    label="السعر الأصلي (اختياري)"
                    type="number"
                    value={formData.originalPrice?.toString() || ''}
                    onChange={(value) => setFormData({ ...formData, originalPrice: parseInt(value) || undefined })}
                    placeholder="600"
                  />
                  
                  <EnhancedInput
                    label="مدة التنفيذ"
                    value={formData.duration || ''}
                    onChange={(value) => setFormData({ ...formData, duration: value })}
                    placeholder="1-3 أيام"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    مميزات الخدمة
                  </label>
                  <div className="space-y-2">
                    {(formData.features || ['']).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateArrayField('features', index, e.target.value)}
                          placeholder="مميزة جديدة"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => removeArrayItem('features', index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('features')}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      إضافة مميزة
                    </button>
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center space-x-6 space-x-reverse">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.popular || false}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">خدمة مميزة</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.active ?? true}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">نشطة</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse mt-8 pt-6 border-t">
                <SuperButton
                  variant="outline"
                  onClick={closeModal}
                >
                  إلغاء
                </SuperButton>
                <SuperButton
                  variant="primary"
                  icon={<Save className="h-4 w-4" />}
                  onClick={handleSaveService}
                >
                  {editingService ? 'حفظ التغييرات' : 'إضافة الخدمة'}
                </SuperButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealServicesManager;
