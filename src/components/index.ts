// Main Components Export
// This file provides a centralized export for all components in the application

// Core UI Components
export { default as EnhancedButton } from './ui/EnhancedButton';
export { default as EnhancedCard } from './ui/EnhancedCard';
export { default as WhatsAppButton } from './ui/WhatsAppButton';
export { default as ThemeToggle } from './ui/ThemeToggle';
export { default as LanguageToggle } from './ui/LanguageToggle';
export { default as LoadingSpinner } from './ui/LoadingSpinner';
export { default as ErrorMessage } from './ui/ErrorMessage';

// Advanced UI Components (Next Generation)
export { default as SuperThemeToggle } from './ui/SuperThemeToggle';
export { default as SuperLanguageToggle } from './ui/SuperLanguageToggle';
export { default as UltraButton } from './ui/UltraButton';
export { 
  SuperButton, 
  EnhancedDropdownButton, 
  FloatingActionButton 
} from './ui/EnhancedButtonSystem';

// Layout Components
export { default as AdminLayout } from './layouts/AdminLayout';

// Form Components
export {
  EnhancedInput,
  EnhancedTextarea,
  EnhancedFileInput
} from './forms/EnhancedForm';

// Modal Components
export { 
  AdvancedModal,
  ModalProvider,
  useModal,
  useConfirmModal,
  useAlertModal
} from './modals/AdvancedModal';

// Notification System
export {
  NotificationProvider,
  useNotifications,
  useSuccessNotification,
  useErrorNotification,
  useInfoNotification,
  useCustomNotification
} from './notifications/NotificationSystem';

// Admin Components
export { default as SuperAdminPanel } from './admin/SuperAdminPanel';
export { default as AdvancedContentManager } from './admin/AdvancedContentManager';
export { default as EnhancedSettingsManager } from './admin/EnhancedSettingsManager';
export { default as EnhancedPaymentMethodsManager } from './admin/EnhancedPaymentMethodsManager';
export { default as EnhancedAdminPanel } from './admin/EnhancedAdminPanel';
export { default as BackupManager } from './admin/BackupManager';
export { default as AnalyticsPanel } from './admin/AnalyticsPanel';

// Landing Page Components
export { default as DynamicLandingPage } from './DynamicLandingPage';
export { default as LandingPage } from './LandingPage';
export { default as ModernLandingPage } from './landing/ModernLandingPage';

// Animation Components
export { default as CounterAnimation } from './animations/CounterAnimation';
export { default as AnimatedBackground } from './animations/AnimatedBackground';

// Optimization Components
export { default as SEOOptimizer } from './optimization/SEOOptimizer';
export { default as PerformanceTracker } from './optimization/PerformanceTracker';

// Modal Components (Legacy)
export { default as OrderModal } from './modals/OrderModal';
export { default as ServicesShowcase } from './modals/ServicesShowcase';

// Rendering Components
export { default as HeaderRenderer } from './rendering/HeaderRenderer';
export { default as FooterRenderer } from './rendering/FooterRenderer';
export { default as CustomElementsRenderer } from './CustomElementsRenderer';

// Advanced Components (Next Gen Collection)
export * from './advanced';

// Type exports for TypeScript support
export type { 
  ButtonVariant, 
  ButtonSize, 
  ButtonAnimation 
} from './ui/EnhancedButtonSystem';

export type { 
  UltraButtonVariant, 
  UltraButtonSize, 
  UltraButtonAnimation 
} from './ui/UltraButton';

export type { 
  ModalSize, 
  ModalAnimation 
} from './modals/AdvancedModal';

export type { 
  NotificationType, 
  NotificationPosition 
} from './notifications/NotificationSystem';

export type { 
  InputVariant, 
  InputSize 
} from './forms/EnhancedForm';
