import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { X, Maximize2, Minimize2, Move } from 'lucide-react';
import { SuperButton } from '../ui';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'auto';
export type ModalAnimation = 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'flip' | 'rotate';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  animation?: ModalAnimation;
  closable?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  maximizable?: boolean;
  backdrop?: boolean;
  backdropBlur?: boolean;
  persistent?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onMaximize?: () => void;
  onMinimize?: () => void;
}

interface ModalContextType {
  openModal: (modal: Omit<ModalProps, 'isOpen' | 'onClose'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModal: (id: string, updates: Partial<ModalProps>) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

const getSizeClasses = (size: ModalSize): string => {
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full w-full h-full',
    auto: 'max-w-max'
  };
  return sizes[size];
};

const getAnimationClasses = (animation: ModalAnimation, isOpen: boolean): string => {
  const animations = {
    fade: isOpen ? 'opacity-100' : 'opacity-0',
    'slide-up': isOpen 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-8',
    'slide-down': isOpen 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 -translate-y-8',
    scale: isOpen 
      ? 'opacity-100 scale-100' 
      : 'opacity-0 scale-95',
    flip: isOpen 
      ? 'opacity-100 rotateY-0' 
      : 'opacity-0 rotateY-90',
    rotate: isOpen 
      ? 'opacity-100 rotate-0' 
      : 'opacity-0 rotate-12'
  };
  return animations[animation];
};

interface DraggableModalProps extends ModalProps {
  id?: string;
}

const DraggableModal: React.FC<DraggableModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  animation = 'scale',
  closable = true,
  draggable = false,
  resizable = false,
  maximizable = false,
  backdrop = true,
  backdropBlur = true,
  persistent = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  children,
  header,
  footer,
  onMaximize,
  onMinimize,
  id
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !persistent && closable) {
      onClose();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !draggable) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      onMaximize?.();
    } else {
      onMinimize?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        backdrop ? 'bg-black/50' : ''
      } ${backdropBlur ? 'backdrop-blur-sm' : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-out
          ${getSizeClasses(isMaximized ? 'full' : size)}
          ${getAnimationClasses(animation, isOpen)}
          ${draggable ? 'cursor-move' : ''}
          ${className}
        `}
        style={{
          transform: draggable && !isMaximized 
            ? `translate(${position.x}px, ${position.y}px)` 
            : undefined
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || header || maximizable || closable) && (
          <div
            className={`
              flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700
              ${draggable ? 'cursor-move' : ''}
              ${headerClassName}
            `}
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              {header || (
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
              )}
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              {/* Draggable indicator */}
              {draggable && (
                <div className="p-1 rounded cursor-move hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Move className="h-4 w-4 text-gray-500" />
                </div>
              )}

              {/* Maximize/Minimize */}
              {maximizable && (
                <button
                  onClick={toggleMaximize}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {isMaximized ? (
                    <Minimize2 className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Maximize2 className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              )}

              {/* Close button */}
              {closable && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div className={`p-6 max-h-96 overflow-y-auto ${bodyClassName}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`p-6 border-t border-gray-200 dark:border-gray-700 ${footerClassName}`}>
            {footer}
          </div>
        )}

        {/* Resize handle */}
        {resizable && !isMaximized && (
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
            <div className="w-full h-full bg-gray-300 dark:bg-gray-600 opacity-50 rounded-tl-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

interface ModalProviderProps {
  children: React.ReactNode;
}

interface ManagedModal extends DraggableModalProps {
  id: string;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<ManagedModal[]>([]);

  const openModal = (modal: Omit<ModalProps, 'isOpen' | 'onClose'>): string => {
    const id = Date.now().toString();
    const newModal: ManagedModal = {
      ...modal,
      id,
      isOpen: true,
      onClose: () => closeModal(id)
    };

    setModals(prev => [...prev, newModal]);
    return id;
  };

  const closeModal = (id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  const updateModal = (id: string, updates: Partial<ModalProps>) => {
    setModals(prev => 
      prev.map(modal => 
        modal.id === id ? { ...modal, ...updates } : modal
      )
    );
  };

  const contextValue: ModalContextType = {
    openModal,
    closeModal,
    closeAllModals,
    updateModal
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      
      {/* Render managed modals */}
      {modals.map(modal => (
        <DraggableModal key={modal.id} {...modal} />
      ))}
    </ModalContext.Provider>
  );
};

// Convenience hooks
export const useConfirmModal = () => {
  const { openModal } = useModal();
  
  return (title: string, message: string, onConfirm: () => void) => {
    return openModal({
      title,
      size: 'sm',
      children: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      ),
      footer: (
        <div className="flex justify-end space-x-3 space-x-reverse">
          <SuperButton variant="outline" onClick={() => {}}>
            إلغاء
          </SuperButton>
          <SuperButton variant="danger" onClick={onConfirm}>
            تأكيد
          </SuperButton>
        </div>
      )
    });
  };
};

export const useAlertModal = () => {
  const { openModal } = useModal();
  
  return (title: string, message: string) => {
    return openModal({
      title,
      size: 'sm',
      children: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      ),
      footer: (
        <div className="flex justify-end">
          <SuperButton variant="primary" onClick={() => {}}>
            موافق
          </SuperButton>
        </div>
      )
    });
  };
};

export { DraggableModal as AdvancedModal };
export default DraggableModal;
