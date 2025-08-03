import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  CheckCircle, AlertCircle, Info, XCircle, X, Bell,
  Zap, Star, Heart, Gift, Shield, Clock
} from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'custom';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  position?: NotificationPosition;
  animation?: 'slide' | 'fade' | 'bounce' | 'scale';
  sound?: boolean;
  vibration?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

const getNotificationIcon = (type: NotificationType, customIcon?: React.ReactNode): React.ReactNode => {
  if (customIcon) return customIcon;
  
  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    custom: <Bell className="h-5 w-5" />
  };
  
  return icons[type];
};

const getNotificationColors = (type: NotificationType): string => {
  const colors = {
    success: 'bg-green-500 text-white border-green-600',
    error: 'bg-red-500 text-white border-red-600',
    warning: 'bg-yellow-500 text-white border-yellow-600',
    info: 'bg-blue-500 text-white border-blue-600',
    custom: 'bg-purple-500 text-white border-purple-600'
  };
  
  return colors[type];
};

const getPositionClasses = (position: NotificationPosition): string => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };
  
  return positions[position];
};

const getAnimationClasses = (animation: string, isVisible: boolean): string => {
  const animations = {
    slide: isVisible 
      ? 'translate-x-0 opacity-100' 
      : 'translate-x-full opacity-0',
    fade: isVisible 
      ? 'opacity-100' 
      : 'opacity-0',
    bounce: isVisible 
      ? 'scale-100 opacity-100' 
      : 'scale-75 opacity-0',
    scale: isVisible 
      ? 'scale-100 opacity-100' 
      : 'scale-110 opacity-0'
  };
  
  return animations[animation as keyof typeof animations] || animations.slide;
};

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Show notification
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto remove if not persistent
    let removeTimer: NodeJS.Timeout;
    if (!notification.persistent && notification.duration !== 0) {
      removeTimer = setTimeout(() => {
        handleRemove();
      }, notification.duration || 5000);
    }

    // Sound effect
    if (notification.sound) {
      playNotificationSound(notification.type);
    }

    // Vibration
    if (notification.vibration && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    return () => {
      clearTimeout(showTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setIsVisible(false);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const playNotificationSound = (type: NotificationType) => {
    // Simple beep sounds for different notification types
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different types
    const frequencies = {
      success: 800,
      error: 300,
      warning: 600,
      info: 500,
      custom: 700
    };
    
    oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  return (
    <div
      className={`
        fixed z-50 max-w-sm w-full transition-all duration-300 ease-in-out
        ${getPositionClasses(notification.position || 'top-right')}
        ${getAnimationClasses(notification.animation || 'slide', isVisible && !isRemoving)}
      `}
    >
      <div className={`
        rounded-xl border shadow-lg backdrop-blur-sm p-4 m-2
        ${getNotificationColors(notification.type)}
        ${isVisible ? 'transform scale-100' : 'transform scale-95'}
        transition-all duration-300
      `}>
        <div className="flex items-start">
          {/* Icon */}
          <div className="flex-shrink-0 mr-3">
            <div className="p-1 rounded-full bg-white/20">
              {getNotificationIcon(notification.type, notification.icon)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold truncate">
                {notification.title}
              </h4>
              
              {!notification.persistent && (
                <button
                  onClick={handleRemove}
                  className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {notification.message && (
              <p className="text-sm opacity-90 mt-1">
                {notification.message}
              </p>
            )}

            {notification.action && (
              <button
                onClick={() => {
                  notification.action!.onClick();
                  handleRemove();
                }}
                className="mt-2 px-3 py-1 text-xs font-medium bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
              >
                {notification.action.label}
              </button>
            )}
          </div>
        </div>

        {/* Progress bar for auto-dismiss */}
        {!notification.persistent && notification.duration !== 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-xl overflow-hidden">
            <div 
              className="h-full bg-white/40 transition-all duration-300 ease-linear"
              style={{
                animation: `shrink ${notification.duration || 5000}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  maxNotifications = 5 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>): string => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
      position: notification.position ?? 'top-right',
      animation: notification.animation ?? 'slide'
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });

    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const updateNotification = (id: string, updates: Partial<Notification>) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, ...updates } : n)
    );
  };

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    updateNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Render Notifications */}
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .shadow-rainbow {
          box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

// Convenience hooks for common notification types
export const useSuccessNotification = () => {
  const { addNotification } = useNotifications();
  return (title: string, message?: string) => addNotification({
    type: 'success',
    title,
    message,
    icon: <CheckCircle className="h-5 w-5" />,
    sound: true
  });
};

export const useErrorNotification = () => {
  const { addNotification } = useNotifications();
  return (title: string, message?: string) => addNotification({
    type: 'error',
    title,
    message,
    icon: <XCircle className="h-5 w-5" />,
    sound: true,
    vibration: true,
    persistent: true
  });
};

export const useInfoNotification = () => {
  const { addNotification } = useNotifications();
  return (title: string, message?: string) => addNotification({
    type: 'info',
    title,
    message,
    icon: <Info className="h-5 w-5" />
  });
};

export const useCustomNotification = () => {
  const { addNotification } = useNotifications();
  return (notification: Omit<Notification, 'id'>) => addNotification(notification);
};

export default NotificationSystem;
