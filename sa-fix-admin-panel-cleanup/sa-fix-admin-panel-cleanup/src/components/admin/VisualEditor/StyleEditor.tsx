import React, { useState } from 'react';
import {
  Palette, Type, Layout, Move, Square, Eye,
  ChevronDown, ChevronRight, Settings, Brush, Box
} from 'lucide-react';
import { PageElement, PageTheme } from './PageBuilder';
import { useTheme } from '../../../context/ThemeContext';

interface StyleEditorProps {
  element: PageElement;
  theme: PageTheme | null;
  onUpdateElement: (id: string, updates: Partial<PageElement>) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ element, theme, onUpdateElement }) => {
  const { theme: appTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['colors', 'typography', 'spacing']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateStyles = (newStyles: Partial<typeof element.styles>) => {
    onUpdateElement(element.id, {
      styles: { ...element.styles, ...newStyles }
    });
  };

  const updateContent = (newContent: Partial<typeof element.content>) => {
    onUpdateElement(element.id, {
      content: { ...element.content, ...newContent }
    });
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'content', label: 'Content', icon: Type },
    { id: 'animation', label: 'Animation', icon: Eye }
  ];

  const colorPresets = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  const fontFamilies = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
    'Poppins', 'Source Sans Pro', 'Nunito', 'Raleway', 'Ubuntu'
  ];

  const animations = [
    'none', 'fadeIn', 'slideUp', 'slideDown', 'slideLeft', 'slideRight',
    'zoomIn', 'zoomOut', 'bounce', 'pulse', 'shake', 'rotate'
  ];

  return (
    <div className={`w-80 border-l flex flex-col ${
      appTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className={`font-semibold ${appTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Style Editor
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Editing: {element.type}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'appearance' && (
          <>
            {/* Colors Section */}
            <div>
              <button
                onClick={() => toggleSection('colors')}
                className="flex items-center justify-between w-full py-2 text-left"
              >
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span className="font-medium">Colors</span>
                </div>
                {expandedSections.has('colors') ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {expandedSections.has('colors') && (
                <div className="mt-4 space-y-4">
                  {/* Background Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={element.styles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                        className="w-12 h-8 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={element.styles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    
                    {/* Color Presets */}
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {colorPresets.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateStyles({ backgroundColor: color })}
                          className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={element.styles.textColor || '#000000'}
                        onChange={(e) => updateStyles({ textColor: e.target.value })}
                        className="w-12 h-8 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={element.styles.textColor || '#000000'}
                        onChange={(e) => updateStyles({ textColor: e.target.value })}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Typography Section */}
            <div>
              <button
                onClick={() => toggleSection('typography')}
                className="flex items-center justify-between w-full py-2 text-left"
              >
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4" />
                  <span className="font-medium">Typography</span>
                </div>
                {expandedSections.has('typography') ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {expandedSections.has('typography') && (
                <div className="mt-4 space-y-4">
                  {/* Font Family */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Font Family
                    </label>
                    <select
                      value={element.styles.fontFamily || 'Inter'}
                      onChange={(e) => updateStyles({ fontFamily: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      {fontFamilies.map((font) => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Font Size
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="12"
                        max="72"
                        value={element.styles.fontSize || 16}
                        onChange={(e) => updateStyles({ fontSize: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">
                        {element.styles.fontSize || 16}px
                      </span>
                    </div>
                  </div>

                  {/* Font Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Font Weight
                    </label>
                    <select
                      value={element.styles.fontWeight || 'normal'}
                      onChange={(e) => updateStyles({ fontWeight: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="medium">Medium</option>
                      <option value="semibold">Semibold</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Border & Radius */}
            <div>
              <button
                onClick={() => toggleSection('border')}
                className="flex items-center justify-between w-full py-2 text-left"
              >
                <div className="flex items-center space-x-2">
                  <Square className="h-4 w-4" />
                  <span className="font-medium">Border & Radius</span>
                </div>
                {expandedSections.has('border') ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {expandedSections.has('border') && (
                <div className="mt-4 space-y-4">
                  {/* Border Radius */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Border Radius
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={element.styles.borderRadius || 0}
                        onChange={(e) => updateStyles({ borderRadius: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">
                        {element.styles.borderRadius || 0}px
                      </span>
                    </div>
                  </div>

                  {/* Border Width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Border Width
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={element.styles.borderWidth || 0}
                        onChange={(e) => updateStyles({ borderWidth: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">
                        {element.styles.borderWidth || 0}px
                      </span>
                    </div>
                  </div>

                  {/* Border Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Border Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={element.styles.borderColor || '#000000'}
                        onChange={(e) => updateStyles({ borderColor: e.target.value })}
                        className="w-12 h-8 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={element.styles.borderColor || '#000000'}
                        onChange={(e) => updateStyles({ borderColor: e.target.value })}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'layout' && (
          <>
            {/* Spacing Section */}
            <div>
              <button
                onClick={() => toggleSection('spacing')}
                className="flex items-center justify-between w-full py-2 text-left"
              >
                <div className="flex items-center space-x-2">
                  <Move className="h-4 w-4" />
                  <span className="font-medium">Spacing</span>
                </div>
                {expandedSections.has('spacing') ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {expandedSections.has('spacing') && (
                <div className="mt-4 space-y-4">
                  {/* Padding */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Padding
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={element.styles.padding || 0}
                        onChange={(e) => updateStyles({ padding: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">
                        {element.styles.padding || 0}px
                      </span>
                    </div>
                  </div>

                  {/* Margin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Margin
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={element.styles.margin || 0}
                        onChange={(e) => updateStyles({ margin: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">
                        {element.styles.margin || 0}px
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">X Position</label>
                  <input
                    type="number"
                    value={element.position.x}
                    onChange={(e) => onUpdateElement(element.id, {
                      position: { ...element.position, x: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Y Position</label>
                  <input
                    type="number"
                    value={element.position.y}
                    onChange={(e) => onUpdateElement(element.id, {
                      position: { ...element.position, y: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Width</label>
                  <input
                    type="number"
                    value={element.size.width}
                    onChange={(e) => onUpdateElement(element.id, {
                      size: { ...element.size, width: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Height</label>
                  <input
                    type="number"
                    value={element.size.height}
                    onChange={(e) => onUpdateElement(element.id, {
                      size: { ...element.size, height: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            {element.type === 'text' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Text Content
                  </label>
                  <textarea
                    value={element.content.text || ''}
                    onChange={(e) => updateContent({ text: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Text Alignment
                  </label>
                  <select
                    value={element.content.alignment || 'left'}
                    onChange={(e) => updateContent({ alignment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                  </select>
                </div>
              </>
            )}

            {(element.type === 'hero' || element.type === 'cta') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={element.content.title || ''}
                    onChange={(e) => updateContent({ title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subtitle
                  </label>
                  <textarea
                    value={element.content.subtitle || ''}
                    onChange={(e) => updateContent({ subtitle: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={element.content.buttonText || ''}
                    onChange={(e) => updateContent({ buttonText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {element.type === 'image' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={element.content.imageUrl || ''}
                    onChange={(e) => updateContent({ imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={element.content.altText || ''}
                    onChange={(e) => updateContent({ altText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'animation' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Animation Type
              </label>
              <select
                value={element.styles.animation || 'none'}
                onChange={(e) => updateStyles({ animation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                {animations.map((animation) => (
                  <option key={animation} value={animation}>
                    {animation.charAt(0).toUpperCase() + animation.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Animation Duration (ms)
              </label>
              <input
                type="number"
                min="100"
                max="3000"
                step="100"
                value={element.styles.animationDuration || 300}
                onChange={(e) => updateStyles({ animationDuration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Animation Delay (ms)
              </label>
              <input
                type="number"
                min="0"
                max="2000"
                step="100"
                value={element.styles.animationDelay || 0}
                onChange={(e) => updateStyles({ animationDelay: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleEditor;
