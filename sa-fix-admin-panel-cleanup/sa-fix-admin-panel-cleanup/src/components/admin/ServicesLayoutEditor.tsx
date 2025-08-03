import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, EyeOff, Save, RefreshCw,
  Grid, Plus, Trash2, Edit3, Copy, Move,
  Star, Package, Zap, Shield, Heart,
  TrendingUp, Award, Target, Clock, Users, CheckCircle,
  ArrowUp, ArrowDown, Search
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

interface ServiceLayoutItem {
  id: string;
  name: string;
  price: number;
  order: number;
  active: boolean;
  featured: boolean;
  category: string;
  description: string;
  icon: string;
  color: string;
  layout: 'card' | 'list' | 'minimal' | 'detailed';
  animation: 'none' | 'fadeIn' | 'slideUp' | 'zoom' | 'bounce';
  customStyles: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderRadius: string;
    padding: string;
    shadow: string;
  };
}

interface ServiceCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  services: ServiceLayoutItem[];
  layout: 'grid' | 'carousel' | 'masonry' | 'tabs';
  columns: number;
  gap: string;
  visible: boolean;
}

const iconOptions = [
  { value: 'shield', label: 'درع', icon: Shield },
  { value: 'star', label: 'نجمة', icon: Star },
  { value: 'zap', label: 'صاعقة', icon: Zap },
  { value: 'heart', label: 'قلب', icon: Heart },
  { value: 'award', label: 'جائزة', icon: Award },
  { value: 'target', label: 'هدف', icon: Target },
  { value: 'trending-up', label: 'صاعد', icon: TrendingUp },
  { value: 'clock', label: 'ساعة', icon: Clock },
  { value: 'users', label: 'مستخدمين', icon: Users },
  { value: 'package', label: 'حزمة', icon: Package }
];

const layoutOptions = [
  { value: 'card', label: 'بطاقة', description: 'تصميم بطاقات جذاب' },
  { value: 'list', label: 'قائمة', description: 'تصميم قائمة مرتبة' },
  { value: 'minimal', label: 'بسيط', description: 'تصميم بسيط ونظيف' },
  { value: 'detailed', label: 'مفصل', description: 'تصميم مع تفاصيل كاملة' }
];

const animationOptions = [
  { value: 'none', label: 'بدون رسوم متحركة' },
  { value: 'fadeIn', label: 'تلاشي' },
  { value: 'slideUp', label: 'انزلاق لأعلى' },
  { value: 'zoom', label: 'تكبير' },
  { value: 'bounce', label: 'ارتداد' }
];

const DraggableService: React.FC<{
  service: ServiceLayoutItem;
  index: number;
  categoryId: string;
  moveService: (dragIndex: number, hoverIndex: number, sourceCategoryId: string, targetCategoryId: string) => void;
  onEdit: (service: ServiceLayoutItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (service: ServiceLayoutItem) => void;
  onToggle: (id: string, field: 'active' | 'featured') => void;
}> = ({ service, index, categoryId, moveService, onEdit, onDelete, onDuplicate, onToggle }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'service',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number; categoryId: string }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragCategoryId = item.categoryId;
      const hoverCategoryId = categoryId;
      
      if (dragIndex === hoverIndex && dragCategoryId === hoverCategoryId) return;
      
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      
      moveService(dragIndex, hoverIndex, dragCategoryId, hoverCategoryId);
      item.index = hoverIndex;
      item.categoryId = hoverCategoryId;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'service',
    item: () => ({ id: service.id, index, categoryId }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const getIcon = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Package;
  };

  const IconComponent = getIcon(service.icon);

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`group relative p-4 border-2 border-dashed rounded-lg transition-all duration-200 cursor-move ${
        isDragging ? 'opacity-50 rotate-1 scale-95' : 'opacity-100'
      } ${
        service.active 
          ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600' 
          : 'border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600'
      } hover:border-blue-400 dark:hover:border-blue-500`}
      style={{ borderColor: service.color + '50', backgroundColor: service.color + '10' }}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Move className="h-4 w-4 text-gray-400" />
      </div>

      {/* Featured Badge */}
      {service.featured && (
        <div className="absolute top-2 left-2">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
        </div>
      )}

      {/* Service Content */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 space-x-reverse flex-1">
          <div 
            className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ backgroundColor: service.color, color: 'white' }}
          >
            <IconComponent className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white truncate">
              {service.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {service.description}
            </p>
            <div className="flex items-center space-x-2 space-x-reverse mt-2">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ${service.price}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                {service.category}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggle(service.id, 'active')}
            className={`p-1 rounded ${
              service.active 
                ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50' 
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={service.active ? 'إلغاء التفعيل' : 'تفعيل'}
          >
            {service.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </button>
          
          <button
            onClick={() => onToggle(service.id, 'featured')}
            className={`p-1 rounded ${
              service.featured 
                ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/50' 
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={service.featured ? 'إزالة من المميزة' : 'إضافة للمميزة'}
          >
            <Star className="h-3 w-3" />
          </button>
          
          <button
            onClick={() => onEdit(service)}
            className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded"
            title="تعديل"
          >
            <Edit3 className="h-3 w-3" />
          </button>
          
          <button
            onClick={() => onDuplicate(service)}
            className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 rounded"
            title="نسخ"
          >
            <Copy className="h-3 w-3" />
          </button>
          
          <button
            onClick={() => onDelete(service.id)}
            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
            title="حذف"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Layout Preview */}
      <div className="mt-3 p-2 bg-white dark:bg-gray-900 rounded border text-xs">
        <div className="flex justify-between items-center">
          <span>التخطيط: {layoutOptions.find(l => l.value === service.layout)?.label}</span>
          <span>الرسوم المتحركة: {animationOptions.find(a => a.value === service.animation)?.label}</span>
        </div>
      </div>
    </div>
  );
};

const CategorySection: React.FC<{
  category: ServiceCategory;
  onUpdateCategory: (categoryId: string, updates: Partial<ServiceCategory>) => void;
  onMoveService: (dragIndex: number, hoverIndex: number, sourceCategoryId: string, targetCategoryId: string) => void;
  onEditService: (service: ServiceLayoutItem) => void;
  onDeleteService: (serviceId: string) => void;
  onDuplicateService: (service: ServiceLayoutItem) => void;
  onToggleService: (serviceId: string, field: 'active' | 'featured') => void;
  onAddService: (categoryId: string) => void;
}> = ({ 
  category, 
  onUpdateCategory, 
  onMoveService, 
  onEditService, 
  onDeleteService, 
  onDuplicateService, 
  onToggleService,
  onAddService 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Category Header */}
      <div 
        className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ backgroundColor: category.color + '10' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: category.color }}
            >
              <span className="text-white text-lg">{category.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {category.services.length} خدمة | ال��خطيط: {category.layout}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateCategory(category.id, { visible: !category.visible });
              }}
              className={`p-2 rounded ${
                category.visible 
                  ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50' 
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddService(category.id);
              }}
              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded"
            >
              <Plus className="h-4 w-4" />
            </button>
            
            <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              {isCollapsed ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Content */}
      {!isCollapsed && (
        <div className="p-4">
          {/* Category Settings */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  تخطيط الفئة
                </label>
                <select
                  value={category.layout}
                    onChange={(e) => onUpdateCategory(category.id, { layout: e.target.value as 'grid' | 'carousel' | 'masonry' | 'tabs' })}
                  className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 rounded
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="grid">شبكة</option>
                  <option value="carousel">شريط التمرير</option>
                  <option value="masonry">بناء متدرج</option>
                  <option value="tabs">تبويبات</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  عدد الأعمدة
                </label>
                <select
                  value={category.columns}
                  onChange={(e) => onUpdateCategory(category.id, { columns: parseInt(e.target.value) })}
                  className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 rounded
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  المسافة بين العناصر
                </label>
                <select
                  value={category.gap}
                  onChange={(e) => onUpdateCategory(category.id, { gap: e.target.value })}
                  className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 rounded
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="0.5rem">صغيرة</option>
                  <option value="1rem">متوسطة</option>
                  <option value="1.5rem">كبيرة</option>
                  <option value="2rem">كبيرة جداً</option>
                </select>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          {category.services.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 mb-3">لا توجد خدمات في هذه الفئة</p>
              <button
                onClick={() => onAddService(category.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إضافة خدمة جديدة
              </button>
            </div>
          ) : (
            <div 
              className="grid gap-3"
              style={{ 
                gridTemplateColumns: `repeat(${Math.min(category.columns, 3)}, 1fr)`,
                gap: category.gap
              }}
            >
              {category.services.map((service, index) => (
                <DraggableService
                  key={service.id}
                  service={service}
                  index={index}
                  categoryId={category.id}
                  moveService={onMoveService}
                  onEdit={onEditService}
                  onDelete={onDeleteService}
                  onDuplicate={onDuplicateService}
                  onToggle={onToggleService}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ServicesLayoutEditor: React.FC = () => {
  const { services, refreshData } = useData();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceLayoutItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editForm, setEditForm] = useState<Partial<ServiceLayoutItem>>({});
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Convert services to categorized layout items
    const serviceItems: ServiceLayoutItem[] = services.map((service, index) => ({
      id: service.id,
      name: service.name,
      price: service.price,
      order: service.order || index,
      active: service.active ?? true,
      featured: false,
      category: 'general',
      description: `خدمة ${service.name}`,
      icon: 'package',
      color: '#3B82F6',
      layout: 'card',
      animation: 'fadeIn',
      customStyles: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderRadius: '0.5rem',
        padding: '1rem',
        shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }
    }));

    const defaultCategories: ServiceCategory[] = [
      {
        id: 'active',
        name: 'الخدمات النشطة',
        color: '#10B981',
        icon: '✅',
        services: serviceItems.filter(item => item.active),
        layout: 'grid',
        columns: 3,
        gap: '1rem',
        visible: true
      },
      {
        id: 'inactive',
        name: 'الخدمات غير النشطة',
        color: '#EF4444',
        icon: '❌',
        services: serviceItems.filter(item => !item.active),
        layout: 'grid',
        columns: 2,
        gap: '1rem',
        visible: true
      },
      {
        id: 'featured',
        name: 'الخدمات المميزة',
        color: '#F59E0B',
        icon: '⭐',
        services: [],
        layout: 'carousel',
        columns: 4,
        gap: '1.5rem',
        visible: true
      }
    ];

    setCategories(defaultCategories);
  }, [services]);

  const moveService = (dragIndex: number, hoverIndex: number, sourceCategoryId: string, targetCategoryId: string) => {
    const newCategories = [...categories];
    const sourceCategory = newCategories.find(cat => cat.id === sourceCategoryId);
    const targetCategory = newCategories.find(cat => cat.id === targetCategoryId);
    
    if (!sourceCategory || !targetCategory) return;

    const [draggedService] = sourceCategory.services.splice(dragIndex, 1);
    targetCategory.services.splice(hoverIndex, 0, draggedService);

    // Update orders
    sourceCategory.services.forEach((service, index) => {
      service.order = index;
    });
    targetCategory.services.forEach((service, index) => {
      service.order = index;
    });

    setCategories(newCategories);
    toast.success(`تم نقل "${draggedService.name}" إلى "${targetCategory.name}"`);
  };

  const editService = (service: ServiceLayoutItem) => {
    setSelectedService(service);
    setEditForm(service);
    setShowEditModal(true);
  };

  const saveServiceEdit = () => {
    if (!selectedService || !editForm) return;

    const newCategories = categories.map(category => ({
      ...category,
      services: category.services.map(service =>
        service.id === selectedService.id ? { ...service, ...editForm } : service
      )
    }));

    setCategories(newCategories);
    setShowEditModal(false);
    setSelectedService(null);
    setEditForm({});
    toast.success('تم حفظ التغييرات');
  };

  const deleteService = (serviceId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      const newCategories = categories.map(category => ({
        ...category,
        services: category.services.filter(service => service.id !== serviceId)
      }));
      setCategories(newCategories);
      toast.success('تم حذف الخدمة');
    }
  };

  const duplicateService = (service: ServiceLayoutItem) => {
    const newService: ServiceLayoutItem = {
      ...service,
      id: `${service.id}-copy-${Date.now()}`,
      name: `${service.name} (نسخة)`,
      order: service.order + 1
    };

    const categoryIndex = categories.findIndex(cat => 
      cat.services.some(s => s.id === service.id)
    );

    if (categoryIndex !== -1) {
      const newCategories = [...categories];
      const serviceIndex = newCategories[categoryIndex].services.findIndex(s => s.id === service.id);
      newCategories[categoryIndex].services.splice(serviceIndex + 1, 0, newService);
      setCategories(newCategories);
      toast.success('تم نسخ الخدمة');
    }
  };

  const toggleService = (serviceId: string, field: 'active' | 'featured') => {
    const newCategories = categories.map(category => ({
      ...category,
      services: category.services.map(service =>
        service.id === serviceId 
          ? { ...service, [field]: !service[field] }
          : service
      )
    }));
    setCategories(newCategories);
  };

  const updateCategory = (categoryId: string, updates: Partial<ServiceCategory>) => {
    const newCategories = categories.map(category =>
      category.id === categoryId ? { ...category, ...updates } : category
    );
    setCategories(newCategories);
  };

  const addService = (categoryId: string) => {
    const newService: ServiceLayoutItem = {
      id: `service-${Date.now()}`,
      name: 'خدمة جديدة',
      price: 0,
      order: 0,
      active: true,
      featured: false,
      category: 'general',
      description: 'وصف الخدمة الجديدة',
      icon: 'package',
      color: '#3B82F6',
      layout: 'card',
      animation: 'fadeIn',
      customStyles: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderRadius: '0.5rem',
        padding: '1rem',
        shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }
    };

    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex !== -1) {
      const newCategories = [...categories];
      newCategories[categoryIndex].services.unshift(newService);
      setCategories(newCategories);
      editService(newService);
    }
  };

  const exportLayout = () => {
    const data = {
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `services-layout-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('تم تصدير التخطيط');
  };

  const totalServices = categories.reduce((sum, cat) => sum + cat.services.length, 0);
  const activeServices = categories.reduce((sum, cat) => sum + cat.services.filter(s => s.active).length, 0);
  const featuredServices = categories.reduce((sum, cat) => sum + cat.services.filter(s => s.featured).length, 0);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              محرر تخطيط الخدمات
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              تنظيم وترتيب الخدمات في فئات مختلفة باستخدام السحب والإفلات
            </p>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              تحديث البيانات
            </button>
            
            <button
              onClick={exportLayout}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              تصدير التخطيط
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">إجمالي الخدمات</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalServices}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="bg-green-600 p-2 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">الخدمات النشطة</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeServices}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="bg-yellow-600 p-2 rounded-lg mr-3">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">الخدمات المميزة</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{featuredServices}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="bg-purple-600 p-2 rounded-lg mr-3">
                <Grid className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">الفئات</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الخدمات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="all">جميع الفئات</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categories
            .filter(category => filterCategory === 'all' || category.id === filterCategory)
            .map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                onUpdateCategory={updateCategory}
                onMoveService={moveService}
                onEditService={editService}
                onDeleteService={deleteService}
                onDuplicateService={duplicateService}
                onToggleService={toggleService}
                onAddService={addService}
              />
            ))}
        </div>

        {/* Edit Service Modal */}
        {showEditModal && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                تحرير الخدمة: {selectedService.name}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      اسم الخدمة
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                               bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      السعر
                    </label>
                    <input
                      type="number"
                      value={editForm.price || 0}
                      onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                               bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الأيقونة
                    </label>
                    <select
                      value={editForm.icon || 'package'}
                      onChange={(e) => setEditForm({...editForm, icon: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                               bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                      {iconOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      التخطيط
                    </label>
                    <select
                      value={editForm.layout || 'card'}
                      onChange={(e) => setEditForm({...editForm, layout: e.target.value as 'card' | 'list' | 'minimal' | 'detailed'})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                               bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                      {layoutOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الرسوم المتحركة
                    </label>
                    <select
                      value={editForm.animation || 'fadeIn'}
                      onChange={(e) => setEditForm({...editForm, animation: e.target.value as 'none' | 'fadeIn' | 'slideUp' | 'zoom' | 'bounce'})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                               bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                      {animationOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اللون
                  </label>
                  <input
                    type="color"
                    value={editForm.color || '#3B82F6'}
                    onChange={(e) => setEditForm({...editForm, color: e.target.value})}
                    className="w-full h-10 border border-gray-300 dark:border-gray-700 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  إلغاء
                </button>
                <button
                  onClick={saveServiceEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default ServicesLayoutEditor;
