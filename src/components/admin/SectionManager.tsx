import React, { useState, useEffect } from 'react';
import {
  Save, Eye, EyeOff, ArrowUp, ArrowDown, Plus, Trash2, Edit3,
  Copy, Settings, Palette, Type, Image, Layout, Grid, Star,
  Users, Phone, Target, Globe, MessageCircle, Clock, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Section {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  order: number;
  component: string;
  props: any;
  customizable: boolean;
}

const SectionManager: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSectionType, setNewSectionType] = useState('');

  const availableSections = [
    { id: 'hero', name: 'القسم الرئيسي', icon: Target, description: 'صورة كبيرة مع عنوان وأزرار' },
    { id: 'about', name: 'من نحن', icon: Users, description: 'معلومات عن الشركة والمميزات' },
    { id: 'services', name: 'الخدمات', icon: Grid, description: 'عرض الخدمات المتاحة' },
    { id: 'stats', name: 'الإحصائيات', icon: Star, description: 'أرقام ومعلومات إحصائية' },
    { id: 'testimonials', name: 'آراء العملاء', icon: MessageCircle, description: 'تقييمات وتجارب العملاء' },
    { id: 'cta', name: 'دعوة للعمل', icon: CheckCircle, description: 'قسم لتشجيع الزوار على اتخاذ إجراء' },
    { id: 'contact', name: 'تواصل معنا', icon: Phone, description: 'معلومات التواصل ونموذج الاتصال' },
    { id: 'custom', name: 'قسم مخصص', icon: Edit3, description: 'قسم قابل للتخصيص بالكامل' }
  ];

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = () => {
    const savedSections = localStorage.getItem('kyc-sections');
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    } else {
      // Default sections
      const defaultSections: Section[] = [
        {
          id: 'navigation',
          name: 'شريط التنقل',
          type: 'navigation',
          visible: true,
          order: 0,
          component: 'Navigation',
          props: {},
          customizable: true
        },
        {
          id: 'hero',
          name: 'القسم الرئيسي',
          type: 'hero',
          visible: true,
          order: 1,
          component: 'HeroSection',
          props: {},
          customizable: true
        },
        {
          id: 'about',
          name: 'من نحن',
          type: 'about',
          visible: true,
          order: 2,
          component: 'AboutSection',
          props: {},
          customizable: true
        },
        {
          id: 'services',
          name: 'الخدمات',
          type: 'services',
          visible: true,
          order: 3,
          component: 'ServicesSection',
          props: {},
          customizable: true
        },
        {
          id: 'stats',
          name: 'الإحصائيات',
          type: 'stats',
          visible: true,
          order: 4,
          component: 'StatsSection',
          props: {},
          customizable: true
        },
        {
          id: 'testimonials',
          name: 'آراء العملاء',
          type: 'testimonials',
          visible: true,
          order: 5,
          component: 'TestimonialsSection',
          props: {},
          customizable: true
        },
        {
          id: 'cta',
          name: 'دعوة للعمل',
          type: 'cta',
          visible: true,
          order: 6,
          component: 'CTASection',
          props: {},
          customizable: true
        },
        {
          id: 'contact',
          name: 'تواصل معنا',
          type: 'contact',
          visible: true,
          order: 7,
          component: 'ContactSection',
          props: {},
          customizable: true
        },
        {
          id: 'footer',
          name: 'الفوتر',
          type: 'footer',
          visible: true,
          order: 8,
          component: 'Footer',
          props: {},
          customizable: true
        }
      ];
      setSections(defaultSections);
      saveSections(defaultSections);
    }
  };

  const saveSections = (sectionsToSave: Section[]) => {
    localStorage.setItem('kyc-sections', JSON.stringify(sectionsToSave));
    toast.success('تم حفظ ترتيب الأقسام');
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId
        ? { ...section, visible: !section.visible }
        : section
    );
    setSections(updatedSections);
    saveSections(updatedSections);
  };

  const moveSectionUp = (sectionId: string) => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex <= 0) return;

    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];
    const prevSection = updatedSections[sectionIndex - 1];

    // Swap orders
    const tempOrder = section.order;
    section.order = prevSection.order;
    prevSection.order = tempOrder;

    // Swap positions
    updatedSections[sectionIndex] = prevSection;
    updatedSections[sectionIndex - 1] = section;

    setSections(updatedSections);
    saveSections(updatedSections);
  };

  const moveSectionDown = (sectionId: string) => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex >= sections.length - 1) return;

    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];
    const nextSection = updatedSections[sectionIndex + 1];

    // Swap orders
    const tempOrder = section.order;
    section.order = nextSection.order;
    nextSection.order = tempOrder;

    // Swap positions
    updatedSections[sectionIndex] = nextSection;
    updatedSections[sectionIndex + 1] = section;

    setSections(updatedSections);
    saveSections(updatedSections);
  };

  const duplicateSection = (sectionId: string) => {
    const sectionToDuplicate = sections.find(s => s.id === sectionId);
    if (!sectionToDuplicate) return;

    const newSection: Section = {
      ...sectionToDuplicate,
      id: `${sectionToDuplicate.id}-copy-${Date.now()}`,
      name: `${sectionToDuplicate.name} (نسخة)`,
      order: sectionToDuplicate.order + 0.5
    };

    const updatedSections = [...sections, newSection].sort((a, b) => a.order - b.order);
    
    // Reorder all sections
    updatedSections.forEach((section, index) => {
      section.order = index;
    });

    setSections(updatedSections);
    saveSections(updatedSections);
  };

  const deleteSection = (sectionId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟')) {
      const updatedSections = sections.filter(s => s.id !== sectionId);
      setSections(updatedSections);
      saveSections(updatedSections);
    }
  };

  const addNewSection = () => {
    if (!newSectionType) {
      toast.error('يرجى اختيار نوع القسم');
      return;
    }

    const selectedType = availableSections.find(s => s.id === newSectionType);
    if (!selectedType) return;

    const newSection: Section = {
      id: `${newSectionType}-${Date.now()}`,
      name: selectedType.name,
      type: newSectionType,
      visible: true,
      order: sections.length,
      component: `${newSectionType.charAt(0).toUpperCase() + newSectionType.slice(1)}Section`,
      props: {},
      customizable: true
    };

    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    saveSections(updatedSections);
    setShowAddForm(false);
    setNewSectionType('');
  };

  const getSectionIcon = (type: string) => {
    const section = availableSections.find(s => s.id === type);
    return section?.icon || Layout;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              إدارة أقسام الصفحة
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              تحكم في ترتيب وظهور أقسام صفحة الهبوط
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            إضافة قسم
          </button>
        </div>

        {/* Section Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Layout className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">إجمالي الأقسام</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{sections.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">الأقسام المرئية</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {sections.filter(s => s.visible).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">قابلة للتخصيص</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {sections.filter(s => s.customizable).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Section Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            إضافة قسم جديد
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {availableSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setNewSectionType(section.id)}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    newSectionType === section.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {section.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {section.description}
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="flex justify-end space-x-3 space-x-reverse">
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewSectionType('');
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              إلغاء
            </button>
            <button
              onClick={addNewSection}
              disabled={!newSectionType}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
            >
              إضافة القسم
            </button>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            أقسام الصفحة الحالية
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sections
            .sort((a, b) => a.order - b.order)
            .map((section, index) => {
              const IconComponent = getSectionIcon(section.type);
              
              return (
                <div
                  key={section.id}
                  className={`p-6 transition-all ${
                    selectedSection === section.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">#{section.order + 1}</span>
                        <div className="flex space-x-1 space-x-reverse">
                          <button
                            onClick={() => moveSectionUp(section.id)}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => moveSectionDown(section.id)}
                            disabled={index === sections.length - 1}
                            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {section.name}
                        </h4>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 dark:text-gray-400">
                          <span>نوع: {section.type}</span>
                          <span>•</span>
                          <span>مكون: {section.component}</span>
                          {section.customizable && (
                            <>
                              <span>•</span>
                              <span className="text-green-600">قابل للتخصيص</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          section.visible ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {section.visible ? 'مرئي' : 'مخفي'}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => toggleSectionVisibility(section.id)}
                        className={`p-2 rounded-lg ${
                          section.visible
                            ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                            : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={section.visible ? 'إخفاء' : 'إظهار'}
                      >
                        {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      
                      {section.customizable && (
                        <button
                          onClick={() => setSelectedSection(
                            selectedSection === section.id ? null : section.id
                          )}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg"
                          title="تخصيص"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => duplicateSection(section.id)}
                        className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg"
                        title="نسخ"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section Customization Panel */}
                  {selectedSection === section.id && section.customizable && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-4">
                        إعدادات القسم: {section.name}
                      </h5>
                      
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          لتخصيص هذا القسم بالتفصيل، استخدم "إدارة محتوى الموقع المتقدمة" من قائمة "تصميم المحتوى".
                        </p>
                        
                        <div className="flex space-x-3 space-x-reverse">
                          <button
                            onClick={() => {
                              // Navigate to advanced content manager
                              window.location.hash = '#advanced-content';
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                          >
                            فتح محرر المحتوى المتقدم
                          </button>
                          
                          <button
                            onClick={() => setSelectedSection(null)}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
                          >
                            إغلاق
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        
        {sections.length === 0 && (
          <div className="p-12 text-center">
            <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              لا توجد أقسام
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ابدأ بإضافة أقسام لصفحة الهبوط
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              إضافة قسم جديد
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionManager;
