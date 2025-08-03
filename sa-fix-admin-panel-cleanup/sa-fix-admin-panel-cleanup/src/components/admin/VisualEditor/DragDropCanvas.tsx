import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Copy, Trash2, Edit3 } from 'lucide-react';
import { PageElement, PageTheme } from './PageBuilder';
import DraggableElement from './DraggableElement';
import GridOverlay from './GridOverlay';

interface DragDropCanvasProps {
  elements: PageElement[];
  selectedElement: string | null;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  theme: PageTheme | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<PageElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}

const DragDropCanvas = forwardRef<HTMLDivElement, DragDropCanvasProps>(({
  elements,
  selectedElement,
  viewMode,
  theme,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement
}, ref) => {
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    elementId: string | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    elementId: null
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Get canvas dimensions based on view mode
  const getCanvasSize = () => {
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

  const canvasSize = getCanvasSize();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: PageElement, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (offset && canvasRect) {
        const x = Math.max(0, offset.x - canvasRect.left);
        const y = Math.max(0, offset.y - canvasRect.top);
        
        // Snap to grid if enabled
        const finalX = snapToGrid ? Math.round(x / 20) * 20 : x;
        const finalY = snapToGrid ? Math.round(y / 20) * 20 : y;

        // Create new element
        const newElement: PageElement = {
          id: `element-${Date.now()}`,
          type: item.type,
          position: { x: finalX, y: finalY },
          size: { width: 400, height: 200 },
          content: item.defaultContent,
          styles: {
            backgroundColor: theme?.colors.background || '#ffffff',
            textColor: theme?.colors.text || '#000000',
            borderRadius: 8,
            padding: 24,
            margin: 16
          },
          visible: true
        };

        onUpdateElement(newElement.id, newElement);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), [theme, snapToGrid]);

  const handleElementMove = useCallback((id: string, newPosition: { x: number; y: number }) => {
    let finalPosition = newPosition;
    
    if (snapToGrid) {
      finalPosition = {
        x: Math.round(newPosition.x / 20) * 20,
        y: Math.round(newPosition.y / 20) * 20
      };
    }

    onUpdateElement(id, { position: finalPosition });
  }, [onUpdateElement, snapToGrid]);

  const handleElementResize = useCallback((id: string, newSize: { width: number; height: number }) => {
    onUpdateElement(id, { size: newSize });
  }, [onUpdateElement]);

  const handleContextMenu = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      elementId
    });
  }, []);

  const hideContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
      hideContextMenu();
    }
  }, [onSelectElement, hideContextMenu]);

  // Context menu actions
  const contextMenuActions = [
    {
      icon: Edit3,
      label: 'Edit',
      action: (id: string) => onSelectElement(id)
    },
    {
      icon: Copy,
      label: 'Duplicate',
      action: (id: string) => onDuplicateElement(id)
    },
    {
      icon: Trash2,
      label: 'Delete',
      action: (id: string) => onDeleteElement(id),
      danger: true
    }
  ];

  return (
    <div className="relative w-full h-full overflow-auto bg-gray-100 dark:bg-gray-800">
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            showGrid 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Grid
        </button>
        
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            snapToGrid 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Snap
        </button>

        <div className="px-3 py-1 bg-white rounded text-sm text-gray-600 border border-gray-300">
          {canvasSize.width} x {canvasSize.height}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex items-center justify-center min-h-full p-8">
        <div
          ref={(node) => {
            canvasRef.current = node;
            if (ref) {
              if (typeof ref === 'function') {
                ref(node);
              } else {
                ref.current = node;
              }
            }
            drop(node);
          }}
          className={`relative bg-white shadow-2xl border border-gray-300 transition-all duration-300 ${
            isOver ? 'ring-4 ring-blue-300 ring-opacity-50' : ''
          }`}
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            minHeight: canvasSize.height
          }}
          onClick={handleCanvasClick}
        >
          {/* Grid Overlay */}
          {showGrid && <GridOverlay gridSize={20} />}

          {/* Drop Zone Indicator */}
          {isOver && (
            <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 flex items-center justify-center z-10">
              <div className="text-blue-600 text-lg font-medium">
                Drop component here
              </div>
            </div>
          )}

          {/* Elements */}
          {elements.map((element) => (
            <DraggableElement
              key={element.id}
              element={element}
              isSelected={selectedElement === element.id}
              theme={theme}
              onSelect={() => onSelectElement(element.id)}
              onMove={handleElementMove}
              onResize={handleElementResize}
              onContextMenu={(e) => handleContextMenu(e, element.id)}
            />
          ))}

          {/* Canvas Info */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
            Elements: {elements.length}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && contextMenu.elementId && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={hideContextMenu}
          />
          <div
            className="fixed z-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-[120px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y
            }}
          >
            {contextMenuActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.action(contextMenu.elementId!);
                  hideContextMenu();
                }}
                className={`w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  action.danger ? 'text-red-600 hover:text-red-700' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <action.icon className="h-4 w-4" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

DragDropCanvas.displayName = 'DragDropCanvas';

export default DragDropCanvas;
