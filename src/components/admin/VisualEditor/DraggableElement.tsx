import React, { useRef, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { PageElement, PageTheme } from './PageBuilder';
import { Move, MoreVertical } from 'lucide-react';
import ElementRenderer from './ElementRenderer';

interface DraggableElementProps {
  element: PageElement;
  isSelected: boolean;
  theme: PageTheme | null;
  onSelect: () => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  isSelected,
  theme,
  onSelect,
  onMove,
  onResize,
  onContextMenu
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { isDragging } = useDrag(() => ({
    type: 'element',
    item: { id: element.id, type: 'element' },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1
    })
  }), [element.id]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      e.preventDefault();
      onSelect();

      const startX = e.clientX;
      const startY = e.clientY;
      const startPosition = { ...element.position };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        onMove(element.id, {
          x: Math.max(0, startPosition.x + deltaX),
          y: Math.max(0, startPosition.y + deltaY)
        });
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }, [element, onSelect, onMove]);

  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeHandle(handle);

    const startX = e.clientX;
    const startY = e.clientY;
    const startSize = { ...element.size };
    const startPosition = { ...element.position };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newSize = { ...startSize };
      const newPosition = { ...startPosition };

      switch (handle) {
        case 'se': // Southeast
          newSize.width = Math.max(100, startSize.width + deltaX);
          newSize.height = Math.max(50, startSize.height + deltaY);
          break;
        case 'sw': // Southwest
          newSize.width = Math.max(100, startSize.width - deltaX);
          newSize.height = Math.max(50, startSize.height + deltaY);
          newPosition.x = startPosition.x + deltaX;
          break;
        case 'ne': // Northeast
          newSize.width = Math.max(100, startSize.width + deltaX);
          newSize.height = Math.max(50, startSize.height - deltaY);
          newPosition.y = startPosition.y + deltaY;
          break;
        case 'nw': // Northwest
          newSize.width = Math.max(100, startSize.width - deltaX);
          newSize.height = Math.max(50, startSize.height - deltaY);
          newPosition.x = startPosition.x + deltaX;
          newPosition.y = startPosition.y + deltaY;
          break;
        case 'n': // North
          newSize.height = Math.max(50, startSize.height - deltaY);
          newPosition.y = startPosition.y + deltaY;
          break;
        case 's': // South
          newSize.height = Math.max(50, startSize.height + deltaY);
          break;
        case 'e': // East
          newSize.width = Math.max(100, startSize.width + deltaX);
          break;
        case 'w': // West
          newSize.width = Math.max(100, startSize.width - deltaX);
          newPosition.x = startPosition.x + deltaX;
          break;
      }

      onResize(element.id, newSize);
      if (newPosition.x !== startPosition.x || newPosition.y !== startPosition.y) {
        onMove(element.id, newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element, onMove, onResize]);

  const resizeHandles = [
    { position: 'nw', cursor: 'nw-resize', className: '-top-1 -left-1' },
    { position: 'n', cursor: 'n-resize', className: '-top-1 left-1/2 transform -translate-x-1/2' },
    { position: 'ne', cursor: 'ne-resize', className: '-top-1 -right-1' },
    { position: 'e', cursor: 'e-resize', className: 'top-1/2 transform -translate-y-1/2 -right-1' },
    { position: 'se', cursor: 'se-resize', className: '-bottom-1 -right-1' },
    { position: 's', cursor: 's-resize', className: '-bottom-1 left-1/2 transform -translate-x-1/2' },
    { position: 'sw', cursor: 'sw-resize', className: '-bottom-1 -left-1' },
    { position: 'w', cursor: 'w-resize', className: 'top-1/2 transform -translate-y-1/2 -left-1' }
  ];

  const elementStyle = {
    position: 'absolute' as const,
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
    opacity,
    zIndex: isSelected ? 1000 : 1,
    ...element.styles
  };

  return (
    <div
      ref={elementRef}
      style={elementStyle}
      className={`group transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onContextMenu={onContextMenu}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Element Content */}
      <div className="w-full h-full overflow-hidden" ref={dragPreview}>
        <ElementRenderer
          element={element}
          theme={theme}
          isEditing={true}
        />
      </div>

      {/* Selection Overlay */}
      {isSelected && (
        <>
          {/* Toolbar */}
          <div className="absolute -top-10 left-0 bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium flex items-center space-x-2 shadow-lg">
            <Move className="h-3 w-3 drag-handle cursor-move" ref={drag} />
            <span>{element.type}</span>
            <button
              onClick={onContextMenu}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <MoreVertical className="h-3 w-3" />
            </button>
          </div>

          {/* Resize Handles */}
          {resizeHandles.map((handle) => (
            <div
              key={handle.position}
              className={`absolute w-3 h-3 bg-blue-500 border border-white rounded-sm ${handle.className}`}
              style={{ cursor: handle.cursor }}
              onMouseDown={(e) => handleResizeStart(e, handle.position)}
            />
          ))}

          {/* Size Display */}
          <div className="absolute -bottom-8 right-0 bg-gray-800 text-white px-2 py-1 rounded text-xs">
            {Math.round(element.size.width)} × {Math.round(element.size.height)}
          </div>
        </>
      )}

      {/* Hover Overlay */}
      {!isSelected && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 pointer-events-none" />
      )}
    </div>
  );
};

export default DraggableElement;
