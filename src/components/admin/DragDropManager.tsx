import React, { useState, useEffect } from 'react';
import { 
  GripVertical, Plus, Edit3, Trash2, Eye, EyeOff, Copy,
  RefreshCw, Download, Settings, Move,
  Search,
  CheckCircle, XCircle, Star, DollarSign
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

interface DragDropItem {
  id: string;
  name: string;
  type: 'service' | 'category' | 'section';
  content?: any;
  order: number;
  active: boolean;
  featured?: boolean;
  price?: number;
  description?: string;
  category?: string;
  tags?: string[];
  lastModified: string;
}

interface DragDropCategory {
  id: string;
  name: string;
  items: DragDropItem[];
  color: string;
  icon: string;
  collapsed: boolean;
}

export const DragDropManager: React.FC = () => {
  const { services, refreshData } = useData();
  const [categories, setCategories] = useState<DragDropCategory[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<DragDropItem | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive' | 'featured'>('all');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DragDropItem>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const initializeCategories = React.useCallback(() => {
    // Convert services to drag and drop items
    const serviceItems: DragDropItem[] = services.map((service, index) => ({
      id: service.id,
      name: service.name,
      type: 'service' as const,
      content: service,
      order: service.order || index,
      active: service.active ?? true,
      price: service.price,
      description: `خدمة ${service.name}`,
      category: 'services',
      tags: ['خدمة', 'رقمية'],
      lastModified: new Date().toISOString()
    }));

    const defaultCategories: DragDropCategory[] = [
      {
        id: 'active-services',
        name: 'الخدمات النشطة',
        items: serviceItems.filter(item => item.active),
        color: '#10B981',
        icon: '✅',
        collapsed: false
      },
      {
        id: 'inactive-services',
        name: 'الخدمات غير النشطة',
        items: serviceItems.filter(item => !item.active),
        color: '#EF4444',
        icon: '❌',
        collapsed: true
      },
      {
        id: 'featured',
        name: 'الخدمات المميزة',
        items: [],
        color: '#F59E0B',
        icon: '⭐',
        collapsed: false
      },
      {
        id: 'archive',
        name: 'الأرشيف',
        items: [],
        color: '#6B7280',
        icon: '📦',
        collapsed: true
      }
    ];

    setCategories(defaultCategories);
  };

  const handleDragStart = (e: React.DragEvent, item: DragDropItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    setDragOverCategory(null);
    
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategory(categoryId);
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string, targetIndex?: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    // Find source category
    const sourceCategoryIndex = categories.findIndex(cat => 
      cat.items.some(item => item.id === draggedItem.id)
    );
    
    const targetCategoryIndex = categories.findIndex(cat => cat.id === targetCategoryId);
    
    if (sourceCategoryIndex === -1 || targetCategoryIndex === -1) return;

    const newCategories = [...categories];
    const sourceCategory = newCategories[sourceCategoryIndex];
    const targetCategory = newCategories[targetCategoryIndex];
    
    // Remove item from source
    const itemIndex = sourceCategory.items.findIndex(item => item.id === draggedItem.id);
    const [item] = sourceCategory.items.splice(itemIndex, 1);
    
    // Add item to target
    const insertIndex = targetIndex ?? targetCategory.items.length;
    targetCategory.items.splice(insertIndex, 0, {
      ...item,
      lastModified: new Date().toISOString()
    });
    
    // Update orders
    targetCategory.items.forEach((item, idx) => {
      item.order = idx;
    });
    
    setCategories(newCategories);
    setDragOverCategory(null);
    
    toast.success(`تم نقل "${item.name}" إل�� "${targetCategory.name}"`);
  };

  const handleItemAction = (action: 'edit' | 'delete' | 'toggle' | 'duplicate' | 'feature', item: DragDropItem) => {
    switch (action) {
      case 'edit':
        setIsEditing(item.id);
        setEditForm(item);
        break;
        
      case 'delete': {
        if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
          const newCategories = categories.map(cat => ({
            ...cat,
            items: cat.items.filter(i => i.id !== item.id)
          }));
          setCategories(newCategories);
          toast.success('تم حذف العنصر بنجاح');
        }
        break;
      }
        
      case 'toggle': {
        const newCategories = categories.map(cat => ({
          ...cat,
          items: cat.items.map(i => 
            i.id === item.id ? { ...i, active: !i.active, lastModified: new Date().toISOString() } : i
          )
        }));
        setCategories(newCategories);
        toast.success(`تم ${item.active ? 'إلغاء تفعيل' : 'تفعيل'} العنصر`);
        break;
      }
        
      case 'duplicate': {
        const duplicatedItem: DragDropItem = {
          ...item,
          id: `${item.id}-copy-${Date.now()}`,
          name: `${item.name} (نسخة)`,
          order: item.order + 1,
          lastModified: new Date().toISOString()
        };
        
        const categoryIndex = categories.findIndex(cat => 
          cat.items.some(i => i.id === item.id)
        );
        
        if (categoryIndex !== -1) {
          const updatedCategories = [...categories];
          const itemIndex = updatedCategories[categoryIndex].items.findIndex(i => i.id === item.id);
          updatedCategories[categoryIndex].items.splice(itemIndex + 1, 0, duplicatedItem);
          setCategories(updatedCategories);
          toast.success('تم ��نشاء نسخة من العنصر');
        }
        break;
      }
        
      case 'feature': {
        // Move to featured category
        const featureCategories = [...categories];
        const sourceIndex = featureCategories.findIndex(cat => 
          cat.items.some(i => i.id === item.id)
        );
        const featuredIndex = featureCategories.findIndex(cat => cat.id === 'featured');
        
        if (sourceIndex !== -1 && featuredIndex !== -1) {
          const sourceCategory = featureCategories[sourceIndex];
          const featuredCategory = featureCategories[featuredIndex];
          
          const itemIndex = sourceCategory.items.findIndex(i => i.id === item.id);
          const [featuredItem] = sourceCategory.items.splice(itemIndex, 1);
          
          featuredCategory.items.push({
            ...featuredItem,
            featured: true,
            lastModified: new Date().toISOString()
          });
          
          setCategories(featureCategories);
          toast.success('تم إضافة العنصر للمميزة');
        }
        break;
      }
    }
  };

  const saveEditForm = () => {
    if (!editForm.id) return;
    
    const newCategories = categories.map(cat => ({
      ...cat,
      items: cat.items.map(item => 
        item.id === editForm.id 
          ? { ...item, ...editForm, lastModified: new Date().toISOString() }
          : item
      )
    }));
    
    setCategories(newCategories);
    setIsEditing(null);
    setEditForm({});
    toast.success('تم حفظ التغييرات');
  };

  const addNewItem = (categoryId: string) => {
    const newItem: DragDropItem = {
      id: `item-${Date.now()}`,
      name: 'عنصر جديد',
      type: 'service',
      order: 0,
      active: true,
      description: 'وصف العنصر الجديد',
      price: 0,
      category: categoryId,
      tags: ['جديد'],
      lastModified: new Date().toISOString()
    };
    
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex !== -1) {
      const updatedCategories = [...categories];
      updatedCategories[categoryIndex].items.unshift(newItem);
      setCategories(updatedCategories);
      setIsEditing(newItem.id);
      setEditForm(newItem);
    }
  };

  const exportData = () => {
    const data = {
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drag-drop-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('تم تصدير البيانات');
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' ||
                           (filterType === 'active' && item.active) ||
                           (filterType === 'inactive' && !item.active) ||
                           (filterType === 'featured' && item.featured);
      
      return matchesSearch && matchesFilter;
    })
  }));

  const selectedCount = selectedItems.size;
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            إدارة السحب والإفلات
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            تنظيم وترتيب الخدمات والعناصر باستخدام السحب والإفلات
          </p>
        </div>
        
        <div className="flex items-center space-x-3 space-x-reverse">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {viewMode === 'grid' ? 'عرض قائمة' : 'عرض شبكة'}
          </button>
          
          <button
            onClick={exportData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </button>
          
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <Move className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                إجمالي العناصر
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalItems}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-green-600 p-2 rounded-lg mr-3">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                العناصر النشطة
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {categories.reduce((sum, cat) => sum + cat.items.filter(item => item.active).length, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-yellow-600 p-2 rounded-lg mr-3">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                العناصر المميزة
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {categories.find(cat => cat.id === 'featured')?.items.length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-purple-600 p-2 rounded-lg mr-3">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                المحددة
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {selectedCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في العناصر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="all">جميع العناصر</option>
              <option value="active">النشطة فقط</option>
              <option value="inactive">غير النشطة فقط</option>
              <option value="featured">المميزة فقط</option>
            </select>
            
            {selectedCount > 0 && (
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCount} محدد
                </span>
                <button
                  onClick={() => setSelectedItems(new Set())}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  إلغاء التحديد
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag and Drop Categories */}
      <div className="space-y-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-200 ${
              dragOverCategory === category.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onDragOver={(e) => handleDragOver(e, category.id)}
            onDrop={(e) => handleDrop(e, category.id)}
          >
            {/* Category Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      const updatedCategories = categories.map(cat =>
                        cat.id === category.id ? { ...cat, collapsed: !cat.collapsed } : cat
                      );
                      setCategories(updatedCategories);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-2"
                  >
                    {category.collapsed ? '▶' : '▼'}
                  </button>
                  
                  <span className="text-2xl mr-2">{category.icon}</span>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.items.length} عنصر
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => addNewItem(category.id)}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
              </div>
            </div>

            {/* Category Items */}
            {!category.collapsed && (
              <div className="p-4">
                {category.items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Move className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>اسحب العناصر هنا أو أضف عنصر جديد</p>
                  </div>
                ) : (
                  <div className={`grid gap-4 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {category.items.map((item, index) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                        className={`group relative p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 
                                   rounded-lg cursor-move hover:border-blue-400 dark:hover:border-blue-500 
                                   transition-all duration-200 ${
                                     selectedItems.has(item.id) 
                                       ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                       : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                   }`}
                      >
                        {/* Drag Handle */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                        </div>

                        {/* Item Content */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            {isEditing === item.id ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={editForm.name || ''}
                                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                  className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded
                                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                />
                                <input
                                  type="number"
                                  value={editForm.price || 0}
                                  onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                                  className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded
                                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                  placeholder="السعر"
                                />
                                <div className="flex space-x-2 space-x-reverse">
                                  <button
                                    onClick={saveEditForm}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                  >
                                    حفظ
                                  </button>
                                  <button
                                    onClick={() => {setIsEditing(null); setEditForm({});}}
                                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                    {item.name}
                                  </h4>
                                  <div className="flex items-center space-x-1 space-x-reverse">
                                    {item.featured && (
                                      <Star className="h-4 w-4 text-yellow-500" />
                                    )}
                                    {item.active ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                  </div>
                                </div>
                                
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {item.description}
                                </p>
                                
                                {item.price !== undefined && (
                                  <div className="flex items-center text-sm">
                                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      ${item.price}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                                  <span>الترتيب: {item.order}</span>
                                  <span>{new Date(item.lastModified).toLocaleDateString('ar-SA')}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing !== item.id && (
                          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <button
                                onClick={() => handleItemAction('edit', item)}
                                className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded"
                                title="تعديل"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              
                              <button
                                onClick={() => handleItemAction('toggle', item)}
                                className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900/50 rounded"
                                title={item.active ? 'إلغاء التفعيل' : 'تفعيل'}
                              >
                                {item.active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </button>
                              
                              <button
                                onClick={() => handleItemAction('duplicate', item)}
                                className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 rounded"
                                title="نسخ"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              
                              <button
                                onClick={() => handleItemAction('feature', item)}
                                className="p-1 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 rounded"
                                title="إضافة للمميزة"
                              >
                                <Star className="h-3 w-3" />
                              </button>
                              
                              <button
                                onClick={() => handleItemAction('delete', item)}
                                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                                title="حذف"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default DragDropManager;
