import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Sparkles, Zap, Flame } from 'lucide-react';

export type UltraButtonVariant = 
  | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' 
  | 'gradient' | 'ghost' | 'outline' | 'glass' | 'neon' | 'minimal'
  | 'cosmic' | 'rainbow' | 'holographic' | 'plasma' | 'aurora' | 'quantum';

export type UltraButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type UltraButtonAnimation = 
  | 'none' | 'bounce' | 'scale' | 'pulse' | 'glow' | 'slide' | 'rotate' 
  | 'shake' | 'ripple' | 'float' | 'sparkle' | 'lightning' | 'magnetic';

interface UltraButtonProps {
  variant?: UltraButtonVariant;
  size?: UltraButtonSize;
  animation?: UltraButtonAnimation;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  glow?: boolean;
  ripple?: boolean;
  magnetic?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  soundEffect?: boolean;
  hapticFeedback?: boolean;
}

const getVariantClasses = (variant: UltraButtonVariant, disabled: boolean): string => {
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
    minimal: 'bg-transparent hover:bg-gray-50 active:bg-gray-100 text-gray-600 border-transparent hover:text-gray-800 dark:hover:bg-gray-800/50 dark:text-gray-400 dark:hover:text-gray-200',
    cosmic: 'bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 hover:from-purple-800 hover:via-blue-800 hover:to-purple-800 text-white border-0 shadow-purple-500/50 relative overflow-hidden',
    rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 hover:animate-pulse text-white border-0 shadow-rainbow relative overflow-hidden',
    holographic: 'bg-gradient-to-45deg from-cyan-400 via-purple-500 to-pink-500 hover:bg-gradient-to-45deg hover:from-pink-500 hover:via-purple-500 hover:to-cyan-400 text-white border-0 shadow-cyan-500/50 relative overflow-hidden',
    plasma: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-yellow-500 hover:via-red-500 hover:to-pink-500 text-white border-0 shadow-pink-500/50 relative overflow-hidden animate-pulse',
    aurora: 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:via-blue-500 hover:to-green-400 text-white border-0 shadow-green-500/50 relative overflow-hidden',
    quantum: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white border-0 shadow-indigo-500/50 relative overflow-hidden'
  };

  return variants[variant];
};

const getSizeClasses = (size: UltraButtonSize): string => {
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
    xxl: 'px-12 py-6 text-xl'
  };

  return sizes[size];
};

const getAnimationClasses = (animation: UltraButtonAnimation): string => {
  const animations = {
    none: '',
    bounce: 'hover:animate-bounce',
    scale: 'transform hover:scale-105 active:scale-95 transition-transform duration-150',
    pulse: 'hover:animate-pulse',
    glow: 'hover:shadow-lg transition-shadow duration-300',
    slide: 'transform hover:-translate-y-0.5 transition-transform duration-200',
    rotate: 'hover:rotate-3 transition-transform duration-300',
    shake: 'hover:animate-shake',
    ripple: 'relative overflow-hidden',
    float: 'hover:animate-float',
    sparkle: 'relative overflow-hidden sparkle-effect',
    lightning: 'relative overflow-hidden lightning-effect',
    magnetic: 'magnetic-button'
  };

  return animations[animation];
};

export const UltraButton: React.FC<UltraButtonProps> = ({
  variant = 'primary',
  size = 'md',
  animation = 'scale',
  loading = false,
  disabled = false,
  fullWidth = false,
  rounded = false,
  shadow = true,
  glow = false,
  ripple = false,
  magnetic = false,
  children,
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  soundEffect = false,
  hapticFeedback = false,
  ...props
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) return;
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);

    // Ripple effect
    if (ripple && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    // Haptic feedback (if supported)
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Sound effect (optional)
    if (soundEffect) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBig=');
      audio.volume = 0.1;
      audio.play().catch(() => {});
    }
    
    onClick?.(e);
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative overflow-hidden';
  const variantClasses = getVariantClasses(variant, disabled);
  const sizeClasses = getSizeClasses(size);
  const animationClasses = getAnimationClasses(animation);
  const roundedClasses = rounded ? 'rounded-full' : 'rounded-lg';
  const widthClasses = fullWidth ? 'w-full' : '';
  const shadowClasses = shadow ? 'shadow-md hover:shadow-lg' : '';
  const glowClasses = glow ? 'hover:shadow-2xl' : '';
  const clickedClasses = isClicked ? 'ring-2 ring-offset-2 ring-blue-500' : '';
  const magneticClasses = magnetic ? 'magnetic-button' : '';

  // Special effects for cosmic variants
  const hasSpecialEffects = ['cosmic', 'rainbow', 'holographic', 'plasma', 'aurora', 'quantum'].includes(variant);

  return (
    <button
      ref={buttonRef}
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
        ${magneticClasses}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {/* Special background effects */}
      {hasSpecialEffects && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </>
      )}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 100,
            height: 100,
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      
      {/* Icon */}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2 animate-pulse">{icon}</span>
      )}
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
      
      {/* Right icon */}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2 animate-pulse">{icon}</span>
      )}

      {/* Special effect icons for cosmic variants */}
      {variant === 'cosmic' && (
        <Sparkles className="absolute top-1 right-1 w-3 h-3 text-white/60 animate-pulse" />
      )}
      {variant === 'plasma' && (
        <Zap className="absolute top-1 right-1 w-3 h-3 text-white/60 animate-pulse" />
      )}
      {variant === 'quantum' && (
        <Flame className="absolute top-1 right-1 w-3 h-3 text-white/60 animate-pulse" />
      )}
    </button>
  );
};

export default UltraButton;
