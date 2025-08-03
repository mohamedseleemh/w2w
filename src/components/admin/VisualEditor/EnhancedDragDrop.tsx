import React, { useState, useCallback, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { 
  Move, RotateCw, Copy, Trash2, Eye, EyeOff, Lock, Unlock
} from 'lucide-react';
import { PageElement } from '../../../context/CustomizationContext';

interface EnhancedDragDropProps {
  element: PageElement;
  isSelected: boolean;
  isLocked?: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<PageElement>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
  onToggleLock?: () => void;
  children: React.ReactNode;
}

interface DragState {
  isDragging: boolean;
  isResizing: boolean;
  isRotating: boolean;
  dragStart: { x: number; y: number };
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  initialRotation: number;
  resizeHandle: string | null;
}

const EnhancedDragDrop: React.FC<EnhancedDragDropProps> = ({
  element,
  isSelected,
  isLocked = false,
  onSelect,
  onUpdate,
  onDuplicate,
  onDelete,
  onToggleVisibility,
  onToggleLock,
  children
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isResizing: false,
    isRotating: false,
    dragStart: { x: 0, y: 0 },
    initialPosition: { x: 0, y: 0 },
    initialSize: { width: 0, height: 0 },
    initialRotation: 0,
    resizeHandle: null
  });

  const [{ opacity }, drag, dragPreview] = useDrag(() => ({
    type: 'element',
    item: () => {
      setDragState(prev => ({ ...prev, isDragging: true }));
      return { 
        id: element.id, 
        type: 'element',
        elementType: element.type
      };
    },
    end: () => {
      setDragState(prev => ({ ...prev, isDragging: false }));
    },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1
    }),
    canDrag: !isLocked
  }), [element.id, isLocked]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSelected) return;

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          onDelete();
          break;
        case 'c':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onDuplicate();
          }
          break;
        case 'v':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onToggleVisibility();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          onUpdate({
            position: {
              ...element.position,
              y: Math.max(0, element.position.y - (e.shiftKey ? 10 : 1))
            }
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          onUpdate({
            position: {
              ...element.position,
              y: element.position.y + (e.shiftKey ? 10 : 1)
            }
          });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onUpdate({
            position: {
              ...element.position,
              x: Math.max(0, element.position.x - (e.shiftKey ? 10 : 1))
            }
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          onUpdate({
            position: {
              ...element.position,
              x: element.position.x + (e.shiftKey ? 10 : 1)
            }
          });
          break;
      }
    };

    if (isSelected) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isSelected, element.position, onUpdate, onDelete, onDuplicate, onToggleVisibility]);

  // Mouse interactions
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isLocked) return;
    
    e.preventDefault();
    onSelect();

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosition = { ...element.position };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      onUpdate({
        position: {
          x: Math.max(0, startPosition.x + deltaX),
          y: Math.max(0, startPosition.y + deltaY)
        }
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setDragState(prev => ({ ...prev, isDragging: false }));
    };

    setDragState(prev => ({
      ...prev,
      isDragging: true,
      dragStart: { x: startX, y: startY },
      initialPosition: startPosition
    }));

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element.position, onSelect, onUpdate, isLocked]);

  // Resize handling
  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    if (isLocked) return;
    
    e.preventDefault();
    e.stopPropagation();

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
        case 'se':
          newSize.width = Math.max(50, startSize.width + deltaX);
          newSize.height = Math.max(30, startSize.height + deltaY);
          break;
        case 'sw':
          newSize.width = Math.max(50, startSize.width - deltaX);
          newSize.height = Math.max(30, startSize.height + deltaY);
          newPosition.x = startPosition.x + deltaX;
          break;
        case 'ne':
          newSize.width = Math.max(50, startSize.width + deltaX);
          newSize.height = Math.max(30, startSize.height - deltaY);
          newPosition.y = startPosition.y + deltaY;
          break;
        case 'nw':
          newSize.width = Math.max(50, startSize.width - deltaX);
          newSize.height = Math.max(30, startSize.height - deltaY);
          newPosition.x = startPosition.x + deltaX;
          newPosition.y = startPosition.y + deltaY;
          break;
        case 'n':
          newSize.height = Math.max(30, startSize.height - deltaY);
          newPosition.y = startPosition.y + deltaY;
          break;
        case 's':
          newSize.height = Math.max(30, startSize.height + deltaY);
          break;
        case 'e':
          newSize.width = Math.max(50, startSize.width + deltaX);
          break;
        case 'w':
          newSize.width = Math.max(50, startSize.width - deltaX);
          newPosition.x = startPosition.x + deltaX;
          break;
      }

      onUpdate({ size: newSize, position: newPosition });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setDragState(prev => ({ ...prev, isResizing: false, resizeHandle: null }));
    };

    setDragState(prev => ({
      ...prev,
      isResizing: true,
      resizeHandle: handle,
      initialSize: startSize,
      initialPosition: startPosition
    }));

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element.size, element.position, onUpdate, isLocked]);

  // Resize handles
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

  const elementStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
    opacity: element.visible ? opacity : 0.3,
    zIndex: isSelected ? 1000 : 1,
    transform: `rotate(${element.styles.rotation || 0}deg)`,
    cursor: isLocked ? 'not-allowed' : dragState.isDragging ? 'grabbing' : 'grab',
    transition: dragState.isDragging || dragState.isResizing ? 'none' : 'all 0.1s ease',
    ...element.styles
  };

  return (
    <div
      ref={elementRef}
      style={elementStyle}
      className={`group relative border-2 transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 border-opacity-75 shadow-lg' 
          : 'border-transparent hover:border-blue-300 hover:border-opacity-50'
      } ${!element.visible ? 'opacity-50' : ''} ${isLocked ? 'cursor-not-allowed' : ''}`}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      ref={dragPreview}
    >
      {/* Element Content */}
      <div className="w-full h-full overflow-hidden">
        {children}
      </div>

      {/* Selection Overlay */}
      {isSelected && (
        <>
          {/* Toolbar */}
          <div className="absolute -top-12 left-0 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-2 shadow-lg z-10">
            <div ref={drag} className="cursor-move">
              <Move className="h-3 w-3" />
            </div>
            <span>{element.type}</span>
            <span className="text-blue-200">•</span>
            <span>{Math.round(element.size.width)}×{Math.round(element.size.height)}</span>
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-1 ml-2 border-l border-blue-400 pl-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility();
                }}
                className="hover:bg-blue-700 p-1 rounded"
                title={element.visible ? 'Hide' : 'Show'}
              >
                {element.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>
              
              {onToggleLock && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock();
                  }}
                  className="hover:bg-blue-700 p-1 rounded"
                  title={isLocked ? 'Unlock' : 'Lock'}
                >
                  {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="hover:bg-blue-700 p-1 rounded"
                title="Duplicate"
              >
                <Copy className="h-3 w-3" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="hover:bg-red-600 p-1 rounded"
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Resize Handles */}
          {!isLocked && resizeHandles.map((handle) => (
            <div
              key={handle.position}
              className={`absolute w-3 h-3 bg-blue-500 border border-white rounded-sm ${handle.className} hover:bg-blue-600 transition-colors`}
              style={{ cursor: handle.cursor }}
              onMouseDown={(e) => handleResizeStart(e, handle.position)}
            />
          ))}

          {/* Rotation Handle */}
          {!isLocked && (
            <div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 border border-white rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors"
              title="Rotate"
            >
              <RotateCw className="h-3 w-3 text-white" />
            </div>
          )}

          {/* Alignment Guides */}
          <div className="absolute -inset-1 pointer-events-none">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-2 bg-blue-400"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-2 bg-blue-400"></div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-px w-2 bg-blue-400"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-px w-2 bg-blue-400"></div>
          </div>
        </>
      )}

      {/* Hover Overlay */}
      {!isSelected && !isLocked && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 pointer-events-none" />
      )}

      {/* Lock Indicator */}
      {isLocked && (
        <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded">
          <Lock className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};

export default EnhancedDragDrop;
