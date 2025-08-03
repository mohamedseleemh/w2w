import React, { useState, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Save, Eye, Undo, Redo, Settings, Palette, Monitor, 
  Smartphone, Tablet, Plus, Grid, Type, Image as ImageIcon,
  Video, Quote, Star, CreditCard, Users, Calendar
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useCustomization } from '../../../context/CustomizationContext';
import DragDropCanvas from './DragDropCanvas';
import ComponentLibrary from './ComponentLibrary';
import StyleEditor from './StyleEditor';
import ThemeSelector from './ThemeSelector';
import PreviewMode from './PreviewMode';
import toast from 'react-hot-toast';

export interface PageElement {
  id: string;
  type: 'hero' | 'services' | 'features' | 'testimonials' | 'stats' | 'cta' | 'text' | 'image' | 'video';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: any;
  styles: {
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    padding?: number;
    margin?: number;
    animation?: string;
  };
  visible: boolean;
  order: number;
}

export interface PageTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
}

const PageBuilder: React.FC = () => {
  const { theme } = useTheme();
  const {
    customization,
    updatePageElements,
    addPageElement,
    updatePageElement,
    deletePageElement,
    publishPage,
    loading
  } = useCustomization();

  const [elements, setElements] = useState<PageElement[]>(customization.pageElements || []);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<PageTheme | null>(null);
  const [history, setHistory] = useState<PageElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync elements with customization context
  React.useEffect(() => {
    setElements(customization.pageElements || []);
  }, [customization.pageElements]);

  // Built-in themes
  const themes: PageTheme[] = [
    {
      id: 'modern',
      name: 'Modern Blue',
      colors: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#F59E0B',
        background: '#F8FAFC',
        text: '#1F2937'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      spacing: {
        small: 8,
        medium: 16,
        large: 32
      }
    },
    {
      id: 'elegant',
      name: 'Elegant Purple',
      colors: {
        primary: '#8B5CF6',
        secondary: '#7C3AED',
        accent: '#EC4899',
        background: '#FEFBFF',
        text: '#374151'
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Inter'
      },
      spacing: {
        small: 12,
        medium: 24,
        large: 48
      }
    },
    {
      id: 'corporate',
      name: 'Corporate Gray',
      colors: {
        primary: '#374151',
        secondary: '#111827',
        accent: '#059669',
        background: '#F9FAFB',
        text: '#1F2937'
      },
      fonts: {
        heading: 'Roboto',
        body: 'Roboto'
      },
      spacing: {
        small: 6,
        medium: 12,
        large: 24
      }
    }
  ];

  // Component templates
  const componentTemplates = [
    {
      id: 'hero-modern',
      name: 'Modern Hero',
      type: 'hero' as const,
      icon: Grid,
      preview: '/previews/hero-modern.png',
      defaultContent: {
        title: 'Welcome to Our Platform',
        subtitle: 'Build amazing experiences with our tools',
        buttonText: 'Get Started',
        backgroundImage: '',
        showStats: true
      }
    },
    {
      id: 'services-grid',
      name: 'Services Grid',
      type: 'services' as const,
      icon: CreditCard,
      preview: '/previews/services-grid.png',
      defaultContent: {
        title: 'Our Services',
        subtitle: 'Everything you need to succeed',
        layout: 'grid',
        columns: 3
      }
    },
    {
      id: 'testimonials-slider',
      name: 'Testimonials Slider',
      type: 'testimonials' as const,
      icon: Quote,
      preview: '/previews/testimonials-slider.png',
      defaultContent: {
        title: 'What Our Clients Say',
        layout: 'slider',
        autoplay: true
      }
    },
    {
      id: 'stats-counter',
      name: 'Stats Counter',
      type: 'stats' as const,
      icon: Users,
      preview: '/previews/stats-counter.png',
      defaultContent: {
        layout: 'horizontal',
        animated: true,
        stats: [
          { value: 1000, label: 'Happy Clients', icon: 'users' },
          { value: 99, label: 'Success Rate', suffix: '%', icon: 'target' },
          { value: 24, label: 'Support', suffix: '/7', icon: 'clock' }
        ]
      }
    }
  ];

  const addElement = useCallback(async (template: typeof componentTemplates[0]) => {
    const newElement: PageElement = {
      id: `element-${Date.now()}`,
      type: template.type,
      position: { x: 50, y: 50 },
      size: { width: 800, height: 400 },
      content: template.defaultContent,
      styles: {
        backgroundColor: currentTheme?.colors.background || customization.globalSettings.primaryColor || '#ffffff',
        textColor: currentTheme?.colors.text || '#000000',
        borderRadius: 8,
        padding: 24,
        margin: 16
      },
      visible: true,
      order: elements.length
    };

    try {
      await addPageElement(newElement);
      saveToHistory([...elements, newElement]);
      toast.success('تم إضافة العنصر بنجاح');
    } catch (error) {
      toast.error('فشل في إضافة العنصر');
    }
  }, [elements, currentTheme, customization, addPageElement]);

  const updateElement = useCallback(async (id: string, updates: Partial<PageElement>) => {
    try {
      await updatePageElement(id, updates);
      toast.success('تم تحديث العنصر بنجاح');
    } catch (error) {
      toast.error('فشل في تحديث العنصر');
    }
  }, [updatePageElement]);

  const deleteElement = useCallback(async (id: string) => {
    try {
      await deletePageElement(id);
      if (selectedElement === id) {
        setSelectedElement(null);
      }
      toast.success('تم حذف العنصر بنجاح');
    } catch (error) {
      toast.error('فشل في حذف العنصر');
    }
  }, [selectedElement, deletePageElement]);

  const duplicateElement = useCallback((id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `element-${Date.now()}`,
        position: { 
          x: element.position.x + 20, 
          y: element.position.y + 20 
        }
      };
      setElements(prev => [...prev, newElement]);
    }
  }, [elements]);

  const saveToHistory = useCallback((newElements: PageElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  }, [history, historyIndex]);

  const saveLayout = useCallback(async () => {
    try {
      await updatePageElements(elements);
      toast.success('تم حفظ التخطيط بنجاح');
    } catch (error) {
      toast.error('فشل في حفظ التخطيط');
    }
  }, [elements, updatePageElements]);

  const handlePublishPage = useCallback(async () => {
    try {
      await publishPage();
      toast.success('تم نشر الصفحة بنجا��! ستظهر التغييرات في الصفحة الرئيسية');
    } catch (error) {
      toast.error('فشل في نشر الصفحة');
    }
  }, [publishPage]);

  if (isPreviewMode) {
    return (
      <PreviewMode
        elements={elements}
        theme={currentTheme}
        viewMode={viewMode}
        onClose={() => setIsPreviewMode(false)}
      />
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`h-screen flex ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Toolbar */}
        <div className={`w-16 flex flex-col items-center py-4 space-y-4 border-r ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={saveLayout}
            className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            title="Save Layout"
          >
            <Save className="h-5 w-5" />
          </button>

          <button
            onClick={() => setIsPreviewMode(true)}
            className="p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            title="Preview"
          >
            <Eye className="h-5 w-5" />
          </button>

          <div className="w-full h-px bg-gray-300" />

          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
            title="Undo"
          >
            <Undo className="h-5 w-5" />
          </button>

          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
            title="Redo"
          >
            <Redo className="h-5 w-5" />
          </button>

          <div className="w-full h-px bg-gray-300" />

          {/* Device Preview Buttons */}
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-3 rounded-lg transition-colors ${
              viewMode === 'desktop' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Desktop View"
          >
            <Monitor className="h-5 w-5" />
          </button>

          <button
            onClick={() => setViewMode('tablet')}
            className={`p-3 rounded-lg transition-colors ${
              viewMode === 'tablet' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Tablet View"
          >
            <Tablet className="h-5 w-5" />
          </button>

          <button
            onClick={() => setViewMode('mobile')}
            className={`p-3 rounded-lg transition-colors ${
              viewMode === 'mobile' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Mobile View"
          >
            <Smartphone className="h-5 w-5" />
          </button>
        </div>

        {/* Component Library */}
        <ComponentLibrary
          templates={componentTemplates}
          onAddComponent={addElement}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className={`h-16 flex items-center justify-between px-6 border-b ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center space-x-4">
              <h1 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Page Builder
              </h1>
              
              <div className={`px-3 py-1 rounded-full text-sm ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSelector
                themes={themes}
                currentTheme={currentTheme}
                onThemeChange={setCurrentTheme}
              />

              <button
                onClick={handlePublishPage}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <span>Publish Page</span>
                )}
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-auto">
            <DragDropCanvas
              ref={canvasRef}
              elements={elements}
              selectedElement={selectedElement}
              viewMode={viewMode}
              theme={currentTheme}
              onSelectElement={setSelectedElement}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
              onDuplicateElement={duplicateElement}
            />
          </div>
        </div>

        {/* Style Editor */}
        {selectedElement && (
          <StyleEditor
            element={elements.find(el => el.id === selectedElement)!}
            theme={currentTheme}
            onUpdateElement={updateElement}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default PageBuilder;
