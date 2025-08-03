import React from 'react';
import { type PageElement } from './../VisualLandingEditor';

interface ElementPropertiesEditorProps {
  selectedElement: PageElement | null;
  onUpdateElement: (id: string, updates: Partial<PageElement>) => void;
}

const ElementPropertiesEditor: React.FC<ElementPropertiesEditorProps> = ({ selectedElement, onUpdateElement }) => {
  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        حدد عنصراً لبدء التحرير
      </div>
    );
  }

  const handleStyleChange = (property: string, value: string | number) => {
    if (selectedElement) {
      const newStyles = { ...selectedElement.styles, [property]: value };
      onUpdateElement(selectedElement.id, { styles: newStyles });
    }
  };

  const handleContentChange = (content: string | Record<string, unknown>) => {
    if (selectedElement) {
      onUpdateElement(selectedElement.id, { content });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          خصائص العنصر: {selectedElement.type}
        </h3>
      </div>

      {/* Content Editor */}
      {(selectedElement.type === 'text' || selectedElement.type === 'header' || selectedElement.type === 'paragraph' || selectedElement.type === 'button') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            المحتوى
          </label>
          <textarea
            value={selectedElement.content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </div>
      )}

      {/* Header Editor */}
      {selectedElement.type === 'header' && (
        <div className="space-y-4">
          <h4 className="text-md font-medium">Header Settings</h4>
          <div>
            <label className="block text-sm font-medium">Logo URL</label>
            <input
              type="text"
              value={selectedElement.content.logoUrl || ''}
              onChange={(e) => handleContentChange({ ...selectedElement.content, logoUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Style Editor */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">التصميم</h4>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium">حجم الخط</label>
          <input
            type="range"
            min="8"
            max="72"
            value={selectedElement.styles.fontSize || 16}
            onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Font Weight */}
        <div>
          <label className="block text-sm font-medium">وزن الخط</label>
          <select
            value={selectedElement.styles.fontWeight || 'normal'}
            onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="normal">عادي</option>
            <option value="bold">عريض</option>
            <option value="lighter">خفيف</option>
          </select>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium">لون الخط</label>
          <input
            type="color"
            value={selectedElement.styles.textColor || '#000000'}
            onChange={(e) => handleStyleChange('textColor', e.target.value)}
            className="w-full h-10"
          />
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium">لون الخلفية</label>
          <input
            type="color"
            value={selectedElement.styles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="w-full h-10"
          />
        </div>

        {/* Padding */}
        <div>
          <label className="block text-sm font-medium">الهامش الداخلي (Padding)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={selectedElement.styles.padding || 0}
            onChange={(e) => handleStyleChange('padding', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Margin */}
        <div>
          <label className="block text-sm font-medium">الهامش الخارجي (Margin)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={selectedElement.styles.margin || 0}
            onChange={(e) => handleStyleChange('margin', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Border Radius */}
        <div>
          <label className="block text-sm font-medium">تدوير الحواف</label>
          <input
            type="range"
            min="0"
            max="50"
            value={selectedElement.styles.borderRadius || 0}
            onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ElementPropertiesEditor;
