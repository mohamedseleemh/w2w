import React, { useState, useEffect } from 'react';
import {
  Plus, Edit3, Trash2, Save, Move, Eye, EyeOff,
  ChevronDown, ChevronRight, Home, Settings, Link,
  ExternalLink, Menu, ArrowUp, ArrowDown, Copy
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  isExternal: boolean;
  visible: boolean;
  order: number;
  children?: MenuItem[];
  parentId?: string;
}

interface MenuSection {
  id: string;
  name: string;
  position: 'header' | 'footer' | 'sidebar';
  items: MenuItem[];
  visible: boolean;
}

const DraggableMenuItem: React.FC<{
  item: MenuItem;
  index: number;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}> = ({ item, index, onMove, onEdit, onDelete, onToggleVisibility }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'menuItem',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'menuItem',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-move ${
        isDragging ? 'opacity-50' : ''
      } ${!item.visible ? 'bg-gray-50 dark:bg-gray-900' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Move className="h-4 w-4 text-gray-400" />
          
          <div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className={`font-medium ${item.visible ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                {item.label}
              </span>
              {item.isExternal && (
                <ExternalLink className="h-3 w-3 text-gray-400" />
              )}
            </div>
            <p className={`text-sm ${item.visible ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'}`}>
              {item.url}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            ترتيب: {item.order}
          </span>
          
          <button
            onClick={() => onToggleVisibility(item.id)}
            className={`p-1 rounded ${
              item.visible 
                ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={item.visible ? 'إخفاء' : 'إظهار'}
          >
            {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => onEdit(item)}
            className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
            title="تعديل"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
            title="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const MenuManager: React.FC = () => {
  const [menus, setMenus] = useState<MenuSection[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<string>('header');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = () => {
    // Load from localStorage or initialize default menus
    const savedMenus = localStorage.getItem('kyc-menus');
    if (savedMenus) {
      setMenus(JSON.parse(savedMenus));
    } else {
      const defaultMenus: MenuSection[] = [
        {
          id: 'header',
          name: 'قائمة الهيدر',
          position: 'header',
          visible: true,
          items: [
            {
              id: '1',
              label: 'الرئيسية',
              url: '/',
              icon: 'home',
              isExternal: false,
              visible: true,
              order: 1
            },
            {
              id: '2',
              label: 'خدماتنا',
              url: '#services',
              icon: 'package',
              isExternal: false,
              visible: true,
              order: 2
            },
            {
              id: '3',
              label: 'من نحن',
              url: '#about',
              icon: 'info',
              isExternal: false,
              visible: true,
              order: 3
            },
            {
              id: '4',
              label: 'تواصل معنا',
              url: '#contact',
              icon: 'phone',
              isExternal: false,
              visible: true,
              order: 4
            }
          ]
        },
        {
          id: 'footer',
          name: 'قائمة الفوتر',
          position: 'footer',
          visible: true,
          items: [
            {
              id: '5',
              label: 'الخصوصية',
              url: '/privacy',
              isExternal: false,
              visible: true,
              order: 1
            },
            {
              id: '6',
              label: 'الشروط والأحكام',
              url: '/terms',
              isExternal: false,
              visible: true,
              order: 2
            }
          ]
        }
      ];
      setMenus(defaultMenus);
      localStorage.setItem('kyc-menus', JSON.stringify(defaultMenus));
    }
  };

  const saveMenus = () => {
    localStorage.setItem('kyc-menus', JSON.stringify(menus));
    setHasChanges(false);
    toast.success('تم حفظ القوائم بنجاح');
  };

  const addMenuItem = () => {
    if (!editForm.label || !editForm.url) {
      toast.error('يرجى إدخال اسم العنصر والرابط');
      return;
    }

    const currentMenu = menus.find(m => m.id === selectedMenu);
    if (!currentMenu) return;

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      label: editForm.label,
      url: editForm.url,
      icon: editForm.icon,
      isExternal: editForm.isExternal || false,
      visible: true,
      order: currentMenu.items.length + 1
    };

    setMenus(prev => prev.map(menu => 
      menu.id === selectedMenu
        ? { ...menu, items: [...menu.items, newItem] }
        : menu
    ));

    setEditForm({});
    setShowAddForm(false);
    setHasChanges(true);
    toast.success('تم إضافة العنصر');
  };

  const updateMenuItem = () => {
    if (!editForm.id || !editForm.label || !editForm.url) {
      toast.error('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    setMenus(prev => prev.map(menu => ({
      ...menu,
      items: menu.items.map(item =>
        item.id === editForm.id
          ? { ...item, ...editForm }
          : item
      )
    })));

    setEditForm({});
    setIsEditing(null);
    setHasChanges(true);
    toast.success('تم تحديث العنصر');
  };

  const deleteMenuItem = (itemId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      setMenus(prev => prev.map(menu => ({
        ...menu,
        items: menu.items.filter(item => item.id !== itemId)
      })));
      setHasChanges(true);
      toast.success('تم حذف العنصر');
    }
  };

  const toggleItemVisibility = (itemId: string) => {
    setMenus(prev => prev.map(menu => ({
      ...menu,
      items: menu.items.map(item =>
        item.id === itemId
          ? { ...item, visible: !item.visible }
          : item
      )
    })));
    setHasChanges(true);
  };

  const moveMenuItem = (menuId: string, dragIndex: number, hoverIndex: number) => {
    setMenus(prev => prev.map(menu => {
      if (menu.id !== menuId) return menu;
      
      const items = [...menu.items];
      const draggedItem = items[dragIndex];
      items.splice(dragIndex, 1);
      items.splice(hoverIndex, 0, draggedItem);
      
      // Update order
      items.forEach((item, index) => {
        item.order = index + 1;
      });
      
      return { ...menu, items };
    }));
    setHasChanges(true);
  };

  const currentMenu = menus.find(m => m.id === selectedMenu);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                إدارة القوائم
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                تخصيص قوائم التنقل في الموقع
              </p>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              {hasChanges && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  تغييرات غير محفوظة
                </span>
              )}
              
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة عنصر
              </button>
              
              <button
                onClick={saveMenus}
                disabled={!hasChanges}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                حفظ التغييرات
              </button>
            </div>
          </div>

          {/* Menu Selector */}
          <div className="flex space-x-2 space-x-reverse">
            {menus.map(menu => (
              <button
                key={menu.id}
                onClick={() => setSelectedMenu(menu.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMenu === menu.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Menu className="h-4 w-4 inline mr-2" />
                {menu.name}
              </button>
            ))}
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || isEditing) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {isEditing ? 'تعديل عنصر القائمة' : 'إضافة عنصر جديد'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اسم العنصر *
                </label>
                <input
                  type="text"
                  value={editForm.label || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="مثال: الرئيسية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الرابط *
                </label>
                <input
                  type="text"
                  value={editForm.url || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="مثال: / أو #section أو https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الأيقونة (اختياري)
                </label>
                <input
                  type="text"
                  value={editForm.icon || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="مثال: home, package, info"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.isExternal || false}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isExternal: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    رابط خارجي (يفتح في تبويب جديد)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setIsEditing(null);
                  setEditForm({});
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                إلغاء
              </button>
              
              <button
                onClick={isEditing ? updateMenuItem : addMenuItem}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {isEditing ? 'تحد��ث' : 'إضافة'}
              </button>
            </div>
          </div>
        )}

        {/* Menu Items */}
        {currentMenu && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                عناصر {currentMenu.name}
              </h3>
              
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentMenu.items.length} عنصر
              </span>
            </div>

            {currentMenu.items.length === 0 ? (
              <div className="text-center py-8">
                <Menu className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  لا توجد عناصر في هذه القائمة
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  إضافة عنصر جديد
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentMenu.items
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => (
                    <DraggableMenuItem
                      key={item.id}
                      item={item}
                      index={index}
                      onMove={(dragIndex, hoverIndex) => 
                        moveMenuItem(currentMenu.id, dragIndex, hoverIndex)
                      }
                      onEdit={(item) => {
                        setEditForm(item);
                        setIsEditing(item.id);
                        setShowAddForm(false);
                      }}
                      onDelete={deleteMenuItem}
                      onToggleVisibility={toggleItemVisibility}
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            معاينة القائمة
          </h3>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-wrap gap-2">
              {currentMenu?.items
                .filter(item => item.visible)
                .sort((a, b) => a.order - b.order)
                .map(item => (
                  <div
                    key={item.id}
                    className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  >
                    {item.icon && (
                      <span className="mr-2">
                        {item.icon === 'home' && <Home className="h-4 w-4" />}
                        {item.icon === 'package' && <Menu className="h-4 w-4" />}
                        {item.icon === 'settings' && <Settings className="h-4 w-4" />}
                      </span>
                    )}
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                    {item.isExternal && (
                      <ExternalLink className="h-3 w-3 text-gray-400 mr-1" />
                    )}
                  </div>
                ))}
            </div>
            
            {(!currentMenu?.items || currentMenu.items.filter(item => item.visible).length === 0) && (
              <p className="text-gray-500 text-center py-4">
                لا توجد عناصر مرئية في هذه القائمة
              </p>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default MenuManager;
