import React, { useState, useEffect } from 'react';
import { 
  Palette, Monitor, Smartphone, Tablet, Eye, Save, Download,
  Copy,
  Layout, Type, Grid,
  CheckCircle, X, Plus, Trash2, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface Typography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

interface BorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

interface Shadow {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'light' | 'dark' | 'modern' | 'classic' | 'custom';
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadow;
  animations: {
    duration: string;
    easing: string;
    enabled: boolean;
  };
  layout: {
    containerMaxWidth: string;
    gridGap: string;
    sidebarWidth: string;
  };
  components: {
    button: {
      borderRadius: string;
      padding: string;
      fontSize: string;
    };
    card: {
      borderRadius: string;
      padding: string;
      shadow: string;
    };
    input: {
      borderRadius: string;
      padding: string;
      borderWidth: string;
    };
  };
  featured: boolean;
  lastModified: string;
  author: string;
}

const defaultThemes: Theme[] = [
  {
    id: 'default-light',
    name: 'الافتراضي الفاتح',
    description: 'التصميم الافتراضي مع الألوان الفاتحة',
    category: 'light',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    },
    typography: {
      fontFamily: 'Cairo, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75'
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    animations: {
      duration: '200ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      enabled: true
    },
    layout: {
      containerMaxWidth: '1200px',
      gridGap: '1rem',
      sidebarWidth: '256px'
    },
    components: {
      button: {
        borderRadius: '0.5rem',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem'
      },
      card: {
        borderRadius: '0.75rem',
        padding: '1.5rem',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      },
      input: {
        borderRadius: '0.5rem',
        padding: '0.75rem',
        borderWidth: '1px'
      }
    },
    featured: true,
    lastModified: new Date().toISOString(),
    author: 'فريق KYCtrust'
  },
  {
    id: 'modern-dark',
    name: 'المودرن المظلم',
    description: 'تصميم حديث ومتطور مع الألوان المظلمة',
    category: 'dark',
    colors: {
      primary: '#6366F1',
      secondary: '#06D6A0',
      accent: '#FFB800',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: '#334155',
      success: '#06D6A0',
      warning: '#FFB800',
      error: '#F87171',
      info: '#6366F1'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75'
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.375rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    },
    animations: {
      duration: '300ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      enabled: true
    },
    layout: {
      containerMaxWidth: '1280px',
      gridGap: '1.5rem',
      sidebarWidth: '280px'
    },
    components: {
      button: {
        borderRadius: '0.75rem',
        padding: '0.75rem 1.5rem',
        fontSize: '0.875rem'
      },
      card: {
        borderRadius: '1rem',
        padding: '2rem',
        shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
      },
      input: {
        borderRadius: '0.75rem',
        padding: '0.875rem',
        borderWidth: '1px'
      }
    },
    featured: true,
    lastModified: new Date().toISOString(),
    author: 'فريق KYCtrust'
  }
];

export const ThemeManager: React.FC = () => {
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  const [activeTheme, setActiveTheme] = useState<Theme>(themes[0]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedTab, setSelectedTab] = useState<'colors' | 'typography' | 'spacing' | 'components' | 'preview'>('colors');
  const [isEditing, setIsEditing] = useState(false);
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Load saved themes from localStorage
    const savedThemes = localStorage.getItem('kyc-themes');
    if (savedThemes) {
      setThemes(JSON.parse(savedThemes));
    }

    const savedActiveTheme = localStorage.getItem('kyc-active-theme');
    if (savedActiveTheme) {
      const theme = JSON.parse(savedActiveTheme);
      setActiveTheme(theme);
      applyTheme(theme);
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    root.style.setProperty('--font-family', theme.typography.fontFamily);
    root.style.setProperty('--animation-duration', theme.animations.duration);
    root.style.setProperty('--animation-easing', theme.animations.easing);

    // Apply to body classes for immediate effect
    document.body.style.fontFamily = theme.typography.fontFamily;
    
    setActiveTheme(theme);
    localStorage.setItem('kyc-active-theme', JSON.stringify(theme));
  };

  const saveThemes = (updatedThemes: Theme[]) => {
    setThemes(updatedThemes);
    localStorage.setItem('kyc-themes', JSON.stringify(updatedThemes));
  };

  const createCustomTheme = () => {
    const newTheme: Theme = {
      ...activeTheme,
      id: `custom-${Date.now()}`,
      name: 'ثيم مخصص جديد',
      description: 'ثيم مخصص تم إنشاؤه بواسطة المستخدم',
      category: 'custom',
      lastModified: new Date().toISOString(),
      author: 'مخصص'
    };
    
    setCustomTheme(newTheme);
    setIsEditing(true);
  };

  const saveCustomTheme = () => {
    if (!customTheme) return;
    
    const updatedThemes = [...themes, customTheme];
    saveThemes(updatedThemes);
    applyTheme(customTheme);
    setIsEditing(false);
    setCustomTheme(null);
    toast.success('تم حفظ الثيم المخصص');
  };

  const deleteTheme = (themeId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الثيم؟')) {
      const updatedThemes = themes.filter(t => t.id !== themeId);
      saveThemes(updatedThemes);
      
      if (activeTheme.id === themeId) {
        applyTheme(themes[0]);
      }
      
      toast.success('تم حذف ال��يم');
    }
  };

  const exportTheme = (theme: Theme) => {
    const data = {
      theme,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-${theme.name.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('تم تصدير الثيم');
  };

  const duplicateTheme = (theme: Theme) => {
    const duplicated: Theme = {
      ...theme,
      id: `${theme.id}-copy-${Date.now()}`,
      name: `${theme.name} (نسخة)`,
      lastModified: new Date().toISOString()
    };
    
    const updatedThemes = [...themes, duplicated];
    saveThemes(updatedThemes);
    toast.success('تم نسخ الثيم');
  };

  const updateThemeProperty = (path: string, value: string | number | boolean) => {
    if (!customTheme) return;
    
    const pathArray = path.split('.');
    const updatedTheme = { ...customTheme };
    let current: any = updatedTheme;
    
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }
    
    current[pathArray[pathArray.length - 1]] = value;
    updatedTheme.lastModified = new Date().toISOString();
    
    setCustomTheme(updatedTheme);
    applyTheme(updatedTheme);
  };

  const previewDevices = [
    { id: 'desktop', name: 'سطح المكتب', icon: Monitor, width: '100%' },
    { id: 'tablet', name: 'الجهاز اللوحي', icon: Tablet, width: '768px' },
    { id: 'mobile', name: 'الهاتف المحمول', icon: Smartphone, width: '375px' }
  ];

  const tabs = [
    { id: 'colors', name: 'الألوان', icon: Palette },
    { id: 'typography', name: 'الخطوط', icon: Type },
    { id: 'spacing', name: 'المسافات', icon: Layout },
    { id: 'components', name: 'المكونات', icon: Grid },
    { id: 'preview', name: 'المعاينة', icon: Eye }
  ];

  const currentTheme = customTheme || activeTheme;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            إدارة الثيمات
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            تخصيص المظهر والألوان والتصميم العام للموقع
          </p>
        </div>
        
        <div className="flex items-center space-x-3 space-x-reverse">
          <button
            onClick={createCustomTheme}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            ثيم جديد
          </button>
          
          <button
            onClick={() => exportTheme(activeTheme)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </button>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          اختيار الثيم
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                activeTheme.id === theme.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => applyTheme(theme)}
            >
              {/* Theme Preview */}
              <div className="mb-3">
                <div className="flex space-x-1 space-x-reverse mb-2">
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: theme.colors.background }}
                  />
                </div>
              </div>
              
              {/* Theme Info */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {theme.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {theme.description}
                  </p>
                  
                  <div className="flex items-center mt-2 space-x-2 space-x-reverse">
                    <span className={`text-xs px-2 py-1 rounded ${
                      theme.category === 'light' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      theme.category === 'dark' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                      theme.category === 'modern' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      theme.category === 'classic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {theme.category === 'light' ? 'فاتح' :
                       theme.category === 'dark' ? 'مظلم' :
                       theme.category === 'modern' ? 'حديث' :
                       theme.category === 'classic' ? 'كلاسيكي' : 'مخصص'}
                    </span>
                    
                    {theme.featured && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-1 space-x-reverse">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateTheme(theme);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded"
                    title="نسخ"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      exportTheme(theme);
                    }}
                    className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 rounded"
                    title="تصدير"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                  {theme.category === 'custom' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTheme(theme.id);
                      }}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Active Indicator */}
              {activeTheme.id === theme.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Theme Editor */}
      {isEditing && customTheme && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Editor Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  تحرير الثيم: {customTheme.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  قم بتخصيص الألوان والمظهر حسب رغبتك
                </p>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <button
                  onClick={() => {setIsEditing(false); setCustomTheme(null);}}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  إلغاء
                </button>
                
                <button
                  onClick={saveCustomTheme}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  حفظ الثيم
                </button>
              </div>
            </div>
          </div>

          {/* Device Preview Toggle */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                {previewDevices.map((device) => {
                  const IconComponent = device.icon;
                  return (
                    <button
                      key={device.id}
                      onClick={() => setPreviewMode(device.id as 'desktop' | 'tablet' | 'mobile')}
                      className={`flex items-center px-3 py-2 rounded-lg ${
                        previewMode === device.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {device.name}
                    </button>
                  );
                })}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                العرض: {previewDevices.find(d => d.id === previewMode)?.width}
              </div>
            </div>
          </div>

          {/* Editor Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as 'colors' | 'typography' | 'spacing' | 'components' | 'preview')}
                    className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                      selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Editor Content */}
          <div className="p-6">
            {/* Colors Tab */}
            {selectedTab === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    الألوان الأساسية
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(currentTheme.colors).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {key === 'primary' ? 'اللون الأساسي' :
                           key === 'secondary' ? 'اللون الثانوي' :
                           key === 'accent' ? 'لون التميي��' :
                           key === 'background' ? 'الخلفية' :
                           key === 'surface' ? 'السطح' :
                           key === 'text' ? 'النص' :
                           key === 'textSecondary' ? 'النص الثانوي' :
                           key === 'border' ? 'الحدود' :
                           key === 'success' ? 'النجاح' :
                           key === 'warning' ? 'التحذير' :
                           key === 'error' ? 'الخطأ' :
                           key === 'info' ? 'المعلومات' : key}
                        </label>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => updateThemeProperty(`colors.${key}`, e.target.value)}
                            className="w-12 h-10 border border-gray-300 dark:border-gray-700 rounded-lg"
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateThemeProperty(`colors.${key}`, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div 
                          className="w-full h-8 rounded border border-gray-300 dark:border-gray-700"
                          style={{ backgroundColor: value }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Typography Tab */}
            {selectedTab === 'typography' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    إعدادات الخطوط
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نوع الخط
                      </label>
                      <select
                        value={currentTheme.typography.fontFamily}
                        onChange={(e) => updateThemeProperty('typography.fontFamily', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                                 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      >
                        <option value="Cairo, system-ui, sans-serif">Cairo</option>
                        <option value="Inter, system-ui, sans-serif">Inter</option>
                        <option value="Roboto, system-ui, sans-serif">Roboto</option>
                        <option value="Open Sans, system-ui, sans-serif">Open Sans</option>
                        <option value="Lato, system-ui, sans-serif">Lato</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(currentTheme.typography.fontSize).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            حجم الخط ({key})
                          </label>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateThemeProperty(`typography.fontSize.${key}`, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Tab */}
            {selectedTab === 'preview' && (
              <div className="space-y-6">
                <div 
                  className="mx-auto border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
                  style={{ 
                    width: previewDevices.find(d => d.id === previewMode)?.width,
                    maxWidth: '100%'
                  }}
                >
                  <div className="bg-gray-100 dark:bg-gray-900 p-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      معاينة الثيم
                    </div>
                  </div>
                  
                  <div 
                    className="p-6 min-h-96"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      color: currentTheme.colors.text,
                      fontFamily: currentTheme.typography.fontFamily
                    }}
                  >
                    {/* Sample Content */}
                    <div className="space-y-6">
                      <h1 
                        className="text-3xl font-bold"
                        style={{ color: currentTheme.colors.primary }}
                      >
                        مرحباً بك في KYCtrust
                      </h1>
                      
                      <p style={{ color: currentTheme.colors.textSecondary }}>
                        هذا نص تجريبي لعرض شكل الثيم الجديد. يمكنك رؤية كيف تبدو الألوان والخطوط في التطبيق الفعلي.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                          className="p-4 rounded-lg"
                          style={{ 
                            backgroundColor: currentTheme.colors.surface,
                            border: `1px solid ${currentTheme.colors.border}`,
                            borderRadius: currentTheme.borderRadius.lg
                          }}
                        >
                          <h3 className="font-medium mb-2">بطاقة تجريبية</h3>
                          <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                            محتوى البطاقة هنا
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <button
                            className="w-full py-2 px-4 rounded font-medium"
                            style={{
                              backgroundColor: currentTheme.colors.primary,
                              color: 'white',
                              borderRadius: currentTheme.components.button.borderRadius
                            }}
                          >
                            زر أساسي
                          </button>
                          
                          <button
                            className="w-full py-2 px-4 rounded font-medium border"
                            style={{
                              backgroundColor: 'transparent',
                              color: currentTheme.colors.secondary,
                              borderColor: currentTheme.colors.secondary,
                              borderRadius: currentTheme.components.button.borderRadius
                            }}
                          >
                            زر ثانوي
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div 
                          className="px-3 py-1 rounded text-sm"
                          style={{ 
                            backgroundColor: currentTheme.colors.success + '20',
                            color: currentTheme.colors.success 
                          }}
                        >
                          نجح
                        </div>
                        <div 
                          className="px-3 py-1 rounded text-sm"
                          style={{ 
                            backgroundColor: currentTheme.colors.warning + '20',
                            color: currentTheme.colors.warning 
                          }}
                        >
                          تحذير
                        </div>
                        <div 
                          className="px-3 py-1 rounded text-sm"
                          style={{ 
                            backgroundColor: currentTheme.colors.error + '20',
                            color: currentTheme.colors.error 
                          }}
                        >
                          خطأ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeManager;
