import React, { useState, useEffect, useRef } from 'react';
import {
  Eye, Save, RefreshCw, Settings, Palette, Type, Layout,
  Image, Video, Grid, Plus, Trash2, Edit3, Copy, Move,
  Monitor, Smartphone, Tablet, Code, Download, Upload,
  Layers, Sliders, Sparkles, Target, TrendingUp, Star,
  Users, Clock, Shield, ArrowRight, Heart, Zap,
  ChevronUp, ChevronDown, MoreVertical, RotateCcw,
  Paintbrush, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Link, ImageIcon, FileText,
  Circle, Square, Triangle, MousePointer, Hand,
  Maximize, Minimize, RotateCw, FlipHorizontal,
  FlipVertical, Scissors, Clipboard, Undo, Redo
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast from 'react-hot-toast';
import { landingPageService, type LandingPageSection } from '../../services/landingPageService';
import ElementPropertiesEditor from './VisualEditor/ElementPropertiesEditor';

interface ElementStyle {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  borderWidth?: number;
  borderColor?: string;
  boxShadow?: string;
  opacity?: number;
  transform?: string;
  transition?: string;
  background?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  letterSpacing?: number;
  textDecoration?: string;
  animation?: string;
}

interface PageElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'container' | 'header' | 'footer' | 'paragraph' | 'icon' | 'video' | 'form';
  content: string;
  styles: ElementStyle;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  locked: boolean;
  visible: boolean;
  parent?: string;
  children?: string[];
}

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  elements: PageElement[];
  styles: any;
}

const VisualLandingEditor: React.FC = () => {
  const [elements, setElements] = useState<PageElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editorMode, setEditorMode] = useState<'design' | 'code' | 'preview'>('design');
  const [tool, setTool] = useState<'select' | 'text' | 'image' | 'shape' | 'hand'>('select');
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [history, setHistory] = useState<PageElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [clipboard, setClipboard] = useState<PageElement[]>([]);
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [globalStyles, setGlobalStyles] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    fontFamily: 'Cairo',
    spacing: 16
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const loadPage = async () => {
      try {
        const template = await landingPageService.getActiveLandingPageTemplate();
        if (template && template.template_data && template.template_data.length > 0) {
          const pageData = template.template_data[0] as any;
          setElements(pageData.elements || []);
          setGlobalStyles(pageData.styles || globalStyles);
          setCanvasSize(pageData.settings?.canvasSize || { width: 1200, height: 800 });
          saveToHistory(pageData.elements || []);
        }
      } catch (error) {
        toast.error('فشل في تحميل بيانات الصفحة');
        console.error('Error loading page data:', error);
      }
    };
    loadPage();
  }, []);

  // Templates
  const templates: Template[] = [
    {
      id: 'modern-hero',
      name: 'بطل عصري',
      thumbnail: '/templates/modern-hero.jpg',
      category: 'hero',
      elements: [],
      styles: {}
    },
    {
      id: 'business-landing',
      name: 'صفحة أعمال',
      thumbnail: '/templates/business.jpg',
      category: 'full-page',
      elements: [],
      styles: {}
    },
    {
      id: 'portfolio-showcase',
      name: 'عرض أعمال',
      thumbnail: '/templates/portfolio.jpg',
      category: 'showcase',
      elements: [],
      styles: {}
    }
  ];

  // Save to history for undo/redo
  const saveToHistory = (newElements: PageElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newElements)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo/Redo functions
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  // Add new element
  const addElement = (type: PageElement['type'], position?: { x: number; y: number }) => {
    const newElement: PageElement = {
      id: `element-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      position: position || { x: 100, y: 100 },
      size: getDefaultSize(type),
      zIndex: elements.length + 1,
      locked: false,
      visible: true
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedElement(newElement.id);
    toast.success(`تم إضافة ${getElementTypeLabel(type)}`);
  };

  // Get default content based on element type
  const getDefaultContent = (type: PageElement['type']): string => {
    switch (type) {
      case 'text':
      case 'header':
        return 'نص جديد';
      case 'paragraph':
        return 'فقرة نصية جديدة. يمكنك تحرير هذا النص وتخصيصه حسب احتياجاتك.';
      case 'button':
        return 'زر جديد';
      case 'image':
        return '/placeholder-image.jpg';
      case 'video':
        return '/placeholder-video.mp4';
      default:
        return '';
    }
  };

  // Get default styles based on element type
  const getDefaultStyles = (type: PageElement['type']): ElementStyle => {
    const baseStyles: ElementStyle = {
      backgroundColor: 'transparent',
      textColor: '#1F2937',
      fontSize: 16,
      fontWeight: 'normal',
      fontFamily: globalStyles.fontFamily,
      borderRadius: 4,
      padding: 12,
      margin: 0,
      textAlign: 'right'
    };

    switch (type) {
      case 'header':
        return {
          ...baseStyles,
          fontSize: 32,
          fontWeight: 'bold',
          textColor: '#1F2937'
        };
      case 'button':
        return {
          ...baseStyles,
          backgroundColor: globalStyles.primaryColor,
          textColor: '#FFFFFF',
          borderRadius: 8,
          padding: 16,
          fontWeight: 'semibold',
          textAlign: 'center'
        };
      case 'container':
        return {
          ...baseStyles,
          backgroundColor: '#F9FAFB',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 8,
          padding: 24
        };
      default:
        return baseStyles;
    }
  };

  // Get default size based on element type
  const getDefaultSize = (type: PageElement['type']) => {
    switch (type) {
      case 'header':
        return { width: 300, height: 50 };
      case 'button':
        return { width: 120, height: 40 };
      case 'image':
        return { width: 200, height: 150 };
      case 'video':
        return { width: 300, height: 200 };
      case 'container':
        return { width: 400, height: 300 };
      default:
        return { width: 200, height: 30 };
    }
  };

  // Get element type label in Arabic
  const getElementTypeLabel = (type: PageElement['type']): string => {
    const labels = {
      text: 'نص',
      image: 'صورة',
      button: 'زر',
      container: 'حاوية',
      header: 'عنوان',
      paragraph: 'فقرة',
      icon: 'أيقونة',
      video: 'فيديو',
      form: 'نموذج'
    };
    return labels[type] || type;
  };

  // Update element
  const updateElement = (id: string, updates: Partial<PageElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
  };

  // Delete element
  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    saveToHistory(newElements);
    if (selectedElement === id) {
      setSelectedElement(null);
    }
    toast.success('تم حذف العنصر');
  };

  // Duplicate element
  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement: PageElement = {
        ...element,
        id: `element-${Date.now()}`,
        position: { x: element.position.x + 20, y: element.position.y + 20 }
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      saveToHistory(newElements);
      setSelectedElement(newElement.id);
      toast.success('تم نسخ العنصر');
    }
  };

  // Copy/Paste functions
  const copyElements = () => {
    const selectedElements = elements.filter(el => selectedElement === el.id);
    setClipboard(selectedElements);
    toast.success(`تم نسخ ${selectedElements.length} عنصر`);
  };

  const pasteElements = () => {
    if (clipboard.length === 0) return;

    const newElements = clipboard.map(el => ({
      ...el,
      id: `element-${Date.now()}-${Math.random()}`,
      position: { x: el.position.x + 20, y: el.position.y + 20 }
    }));

    const updatedElements = [...elements, ...newElements];
    setElements(updatedElements);
    saveToHistory(updatedElements);
    toast.success(`تم لصق ${newElements.length} عنصر`);
  };

  // Layer management
  const moveLayer = (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    const element = elements.find(el => el.id === id);
    if (!element) return;

    let newZIndex = element.zIndex;
    const maxZ = Math.max(...elements.map(el => el.zIndex));
    const minZ = Math.min(...elements.map(el => el.zIndex));

    switch (direction) {
      case 'up':
        newZIndex = Math.min(element.zIndex + 1, maxZ);
        break;
      case 'down':
        newZIndex = Math.max(element.zIndex - 1, minZ);
        break;
      case 'top':
        newZIndex = maxZ + 1;
        break;
      case 'bottom':
        newZIndex = minZ - 1;
        break;
    }

    updateElement(id, { zIndex: newZIndex });
  };

  // Save page
  const savePage = async () => {
    try {
      const pageData = {
        elements,
        styles: globalStyles,
        settings: {
          canvasSize,
          previewMode
        }
      };

      const activeTemplate = await landingPageService.getActiveLandingPageTemplate();
      if (activeTemplate) {
        await landingPageService.updatePageTemplate(activeTemplate.id, {
          template_data: [pageData] as any,
          theme_config: globalStyles,
        });
      } else {
        await landingPageService.savePageTemplate({
          name: 'صفحة الهبوط الافتراضية',
          page_type: 'landing',
          template_data: [pageData] as any,
          theme_config: globalStyles,
          active: true,
        }, true); // Make it default
      }

      toast.success('تم حفظ الصفحة بنجاح');
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('فشل في حفظ الصفحة');
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!newTemplateName.trim()) {
      toast.error('يرجى إدخال اسم للقالب');
      return;
    }
    try {
      const pageData = {
        elements,
        styles: globalStyles,
        settings: {
          canvasSize,
          previewMode
        }
      };
      await landingPageService.savePageTemplate({
        name: newTemplateName,
        page_type: 'landing',
        template_data: [pageData] as any,
        theme_config: globalStyles,
        active: true,
      }, false); // is_default = false
      toast.success(`تم حفظ القالب "${newTemplateName}" بنجاح`);
      setIsSaveAsModalOpen(false);
      setNewTemplateName('');
    } catch (error) {
      toast.error('فشل في حفظ القالب');
      console.error('Error saving as template:', error);
    }
  };

  // Render element on canvas
  const renderElement = (element: PageElement) => {
    const isSelected = selectedElement === element.id;
    const style: React.CSSProperties = {
      position: 'absolute',
      left: element.position.x,
      top: element.position.y,
      width: element.size.width,
      height: element.size.height,
      zIndex: element.zIndex,
      opacity: element.visible ? (element.styles.opacity || 1) : 0.5,
      transform: element.styles.transform || 'none',
      transition: element.styles.transition || 'none',
      ...element.styles,
      border: isSelected ? '2px solid #3B82F6' : 'none',
      cursor: tool === 'select' ? 'pointer' : 'default'
    };

    const content = () => {
      switch (element.type) {
        case 'text':
        case 'header':
        case 'paragraph':
          return (
            <div
              style={style}
              onClick={() => setSelectedElement(element.id)}
              className="select-none"
            >
              {element.content}
            </div>
          );
        case 'button':
          return (
            <button
              style={style}
              onClick={() => setSelectedElement(element.id)}
              className="select-none"
            >
              {element.content}
            </button>
          );
        case 'image':
          return (
            <img
              src={element.content || '/placeholder-image.jpg'}
              alt="Element"
              style={style}
              onClick={() => setSelectedElement(element.id)}
              className="select-none object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
              }}
            />
          );
        case 'container':
          return (
            <div
              style={style}
              onClick={() => setSelectedElement(element.id)}
              className="select-none"
            >
              {/* Container content */}
            </div>
          );
        default:
          return (
            <div
              style={style}
              onClick={() => setSelectedElement(element.id)}
              className="select-none border-dashed border-2 border-gray-300 flex items-center justify-center text-gray-500"
            >
              {getElementTypeLabel(element.type)}
            </div>
          );
      }
    };

    return (
      <div key={element.id} className="relative">
        {content()}
        {isSelected && (
          <div className="absolute -top-6 left-0 bg-blue-600 text-white px-2 py-1 rounded text-xs">
            {getElementTypeLabel(element.type)}
          </div>
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
        {/* Left Sidebar - Tools and Elements */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                محرر الصفحة المرئي
              </h2>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <Undo className="h-4 w-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <Redo className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tool Selection */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[
                { tool: 'select', icon: MousePointer, label: 'تحديد' },
                { tool: 'text', icon: Type, label: 'نص' },
                { tool: 'image', icon: ImageIcon, label: 'صورة' },
                { tool: 'shape', icon: Square, label: 'شكل' },
                { tool: 'hand', icon: Hand, label: 'يد' }
              ].map(({ tool: toolName, icon: Icon, label }) => (
                <button
                  key={toolName}
                  onClick={() => setTool(toolName as any)}
                  className={`p-3 rounded-lg transition-colors ${
                    tool === toolName
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={copyElements}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Copy className="h-4 w-4 mx-auto" />
              </button>
              <button
                onClick={pasteElements}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Clipboard className="h-4 w-4 mx-auto" />
              </button>
              <button
                onClick={() => selectedElement && deleteElement(selectedElement)}
                className="flex-1 px-3 py-2 bg-red-100 dark:bg-red-900 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                <Trash2 className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>

          {/* Elements Panel */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Add Elements */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  إضافة عناصر
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'header', icon: Type, label: 'عنوان' },
                    { type: 'paragraph', icon: FileText, label: 'فقرة' },
                    { type: 'button', icon: Square, label: 'زر' },
                    { type: 'image', icon: ImageIcon, label: 'صورة' },
                    { type: 'video', icon: Video, label: 'فيديو' },
                    { type: 'container', icon: Layout, label: 'حاوية' }
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => addElement(type as PageElement['type'])}
                      className="flex flex-col items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Icon className="h-5 w-5 mb-2 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-700 dark:text-gray-300">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  القوالب الجاهزة
                </h3>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-reverse space-x-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {template.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {template.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layers Panel */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  الطبقات ({elements.length})
                </h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {elements
                    .sort((a, b) => b.zIndex - a.zIndex)
                    .map((element) => (
                      <div
                        key={element.id}
                        className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                          selectedElement === element.id
                            ? 'bg-blue-100 dark:bg-blue-900'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setSelectedElement(element.id)}
                      >
                        <div className="flex items-center space-x-reverse space-x-2">
                          <Eye className={`h-4 w-4 ${
                            element.visible ? 'text-gray-600' : 'text-gray-300'
                          }`} />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {getElementTypeLabel(element.type)}
                          </span>
                        </div>
                        <div className="flex space-x-1 space-x-reverse">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLayer(element.id, 'up');
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLayer(element.id, 'down');
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-reverse space-x-4">
                {/* Preview Mode */}
                <div className="flex items-center space-x-reverse space-x-2">
                  {[
                    { mode: 'desktop', icon: Monitor },
                    { mode: 'tablet', icon: Tablet },
                    { mode: 'mobile', icon: Smartphone }
                  ].map(({ mode, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setPreviewMode(mode as any)}
                      className={`p-2 rounded-lg transition-colors ${
                        previewMode === mode
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center space-x-reverse space-x-2">
                  <button
                    onClick={() => setZoom(Math.max(25, zoom - 25))}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Minimize className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>

                {/* View Options */}
                <div className="flex items-center space-x-reverse space-x-2">
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`p-2 rounded-lg transition-colors ${
                      showGrid
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-reverse space-x-4">
                <button
                  onClick={() => setEditorMode('preview')}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Eye className="h-4 w-4 ml-2" />
                  معاينة
                </button>
                <button
                  onClick={savePage}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التغييرات
                </button>
                <button
                  onClick={() => setIsSaveAsModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  حفظ كقالب
                </button>
              </div>
            </div>
          </div>

          {/* Save As Template Modal */}
          {isSaveAsModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                <h3 className="text-lg font-semibold mb-4">حفظ القالب الجديد</h3>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="أدخل اسم القالب"
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                />
                <div className="flex justify-end space-x-2 space-x-reverse">
                  <button
                    onClick={() => setIsSaveAsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSaveAsTemplate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    حفظ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-auto p-8">
            <div className="mx-auto" style={{ width: 'fit-content' }}>
              <div
                ref={canvasRef}
                className="relative bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
                style={{
                  width: canvasSize.width * (zoom / 100),
                  height: canvasSize.height * (zoom / 100),
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top left'
                }}
              >
                {/* Grid */}
                {showGrid && (
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  />
                )}

                {/* Render Elements */}
                {elements.map(renderElement)}

                {/* Canvas click handler for deselection */}
                <div
                  className="absolute inset-0"
                  onClick={() => setSelectedElement(null)}
                  style={{ zIndex: -1 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <ElementPropertiesEditor
            selectedElement={elements.find(el => el.id === selectedElement) || null}
            onUpdateElement={updateElement}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default VisualLandingEditor;
