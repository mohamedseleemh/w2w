import React, { useState } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

export type ButtonVariant = 
  | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' 
  | 'gradient' | 'ghost' | 'outline' | 'glass' | 'neon' | 'minimal';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonAnimation = 'none' | 'bounce' | 'scale' | 'pulse' | 'glow' | 'slide';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  animation?: ButtonAnimation;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  glow?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const getVariantClasses = (variant: ButtonVariant, disabled: boolean): string => {
  if (disabled) {
    return 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 dark:bg-gray-700 dark:text-gray-400';
  }

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-blue-600 hover:border-blue-700 shadow-blue-500/25',
    secondary: 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white border-gray-600 hover:border-gray-700 shadow-gray-500/25',
    success: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-green-600 hover:border-green-700 shadow-green-500/25',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-red-600 hover:border-red-700 shadow-red-500/25',
    warning: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white border-yellow-500 hover:border-yellow-600 shadow-yellow-500/25',
    info: 'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white border-cyan-600 hover:border-cyan-700 shadow-cyan-500/25',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-blue-500/25',
    ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 border-transparent dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:text-gray-300',
    outline: 'bg-transparent hover:bg-blue-50 active:bg-blue-100 text-blue-600 border-blue-600 hover:border-blue-700 dark:hover:bg-blue-900/20 dark:active:bg-blue-900/30',
    glass: 'bg-white/10 hover:bg-white/20 active:bg-white/30 text-gray-800 border-white/20 backdrop-blur-md dark:text-white dark:border-white/10',
    neon: 'bg-black hover:bg-gray-900 text-cyan-400 border-cyan-400 hover:border-cyan-300 shadow-cyan-400/50 hover:shadow-cyan-400/75',
    minimal: 'bg-transparent hover:bg-gray-50 active:bg-gray-100 text-gray-600 border-transparent hover:text-gray-800 dark:hover:bg-gray-800/50 dark:text-gray-400 dark:hover:text-gray-200'
  };

  return variants[variant];
};

const getSizeClasses = (size: ButtonSize): string => {
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  return sizes[size];
};

const getAnimationClasses = (animation: ButtonAnimation): string => {
  const animations = {
    none: '',
    bounce: 'hover:animate-bounce',
    scale: 'transform hover:scale-105 active:scale-95 transition-transform duration-150',
    pulse: 'hover:animate-pulse',
    glow: 'hover:shadow-lg transition-shadow duration-300',
    slide: 'transform hover:-translate-y-0.5 transition-transform duration-200'
  };

  return animations[animation];
};

export const EnhancedButton: React.FC<BaseButtonProps> = ({
  variant = 'primary',
  size = 'md',
  animation = 'scale',
  loading = false,
  disabled = false,
  fullWidth = false,
  rounded = false,
  shadow = true,
  glow = false,
  children,
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (disabled || loading) return;
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    
    onClick?.();
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-95';
  const variantClasses = getVariantClasses(variant, disabled);
  const sizeClasses = getSizeClasses(size);
  const animationClasses = getAnimationClasses(animation);
  const roundedClasses = rounded ? 'rounded-full' : 'rounded-lg';
  const widthClasses = fullWidth ? 'w-full' : '';
  const shadowClasses = shadow ? 'shadow-md hover:shadow-lg' : '';
  const glowClasses = glow ? 'hover:shadow-2xl' : '';
  const clickedClasses = isClicked ? 'ring-2 ring-offset-2 ring-blue-500' : '';

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses}
        ${sizeClasses}
        ${animationClasses}
        ${roundedClasses}
        ${widthClasses}
        ${shadowClasses}
        ${glowClasses}
        ${clickedClasses}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      <span>{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

interface DropdownButtonProps extends BaseButtonProps {
  options: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export const EnhancedDropdownButton: React.FC<DropdownButtonProps> = ({
  options,
  onSelect,
  placeholder = 'اختر خيار',
  variant = 'outline',
  size = 'md',
  ...buttonProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    onSelect(value);
  };

  const selectedOption = options.find(opt => opt.value === selected);

  return (
    <div className="relative">
      <EnhancedButton
        {...buttonProps}
        variant={variant}
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        icon={<ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
        iconPosition="right"
      >
        {selectedOption ? selectedOption.label : placeholder}
      </EnhancedButton>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-full min-w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                disabled={option.disabled}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  variant = 'primary',
  position = 'bottom-right',
  size = 'md',
  tooltip
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <EnhancedButton
        variant={variant}
        onClick={onClick}
        rounded
        shadow
        glow
        animation="scale"
        className={`${sizeClasses[size]} p-0`}
        title={tooltip}
      >
        {icon}
      </EnhancedButton>
    </div>
  );
};

export default EnhancedButton;
