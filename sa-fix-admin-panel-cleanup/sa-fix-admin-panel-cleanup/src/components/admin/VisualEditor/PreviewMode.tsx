import React from 'react';
import { X, Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';
import { PageElement, PageTheme } from './PageBuilder';
import ElementRenderer from './ElementRenderer';

interface PreviewModeProps {
  elements: PageElement[];
  theme: PageTheme | null;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onClose: () => void;
}

const PreviewMode: React.FC<PreviewModeProps> = ({ elements, theme, viewMode, onClose }) => {
  const getViewportSize = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: 375, height: 812 };
      case 'tablet':
        return { width: 768, height: 1024 };
      case 'desktop':
      default:
        return { width: 1200, height: 800 };
    }
  };

  const viewport = getViewportSize();

  const sortedElements = [...elements]
    .filter(el => el.visible)
    .sort((a, b) => a.position.y - b.position.y);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">Preview Mode</h2>
          
          <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
            {viewMode === 'desktop' && <Monitor className="h-4 w-4" />}
            {viewMode === 'tablet' && <Tablet className="h-4 w-4" />}
            {viewMode === 'mobile' && <Smartphone className="h-4 w-4" />}
            <span className="text-sm font-medium capitalize">{viewMode}</span>
            <span className="text-xs text-gray-500">
              {viewport.width} × {viewport.height}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              // Open current page in new tab
              const currentUrl = window.location.origin;
              window.open(currentUrl, '_blank', 'noopener,noreferrer');
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open in New Tab</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 min-h-0">
        <div
          className="bg-white shadow-2xl relative overflow-auto"
          style={{
            width: viewport.width,
            height: viewport.height,
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          {/* Page Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: theme?.colors.background || '#ffffff',
              fontFamily: theme?.fonts.body || 'Inter, sans-serif'
            }}
          />

          {/* Elements */}
          {sortedElements.map((element) => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: element.position.x,
                top: element.position.y,
                width: element.size.width,
                height: element.size.height,
                zIndex: 1
              }}
            >
              <ElementRenderer
                element={element}
                theme={theme}
                isEditing={false}
              />
            </div>
          ))}

          {/* Empty State */}
          {elements.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Monitor className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No Content Yet</h3>
                <p>Add some elements to see your page preview</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="h-12 bg-white border-t border-gray-200 flex items-center justify-center">
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <div>Elements: {elements.filter(el => el.visible).length}</div>
          <div>Theme: {theme?.name || 'Default'}</div>
          <div>Last updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
};

export default PreviewMode;
