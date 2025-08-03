import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EnhancedButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean;
  elevation?: boolean;
  glow?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  elevation = false,
  glow = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold
    transition-all duration-300 transform active:scale-95
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
    ${rounded ? 'rounded-full' : 'rounded-xl'}
    ${elevation ? 'shadow-lg hover:shadow-xl' : 'shadow-md hover:shadow-lg'}
    ${glow ? 'hover:shadow-2xl' : ''}
  `;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
      text-white border-2 border-blue-600 hover:border-blue-700
      focus:ring-blue-500 shadow-blue-200
      ${glow ? 'hover:shadow-blue-500/50' : ''}
    `,
    secondary: `
      bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800
      text-white border-2 border-gray-600 hover:border-gray-700
      focus:ring-gray-500 shadow-gray-200
      ${glow ? 'hover:shadow-gray-500/50' : ''}
    `,
    success: `
      bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800
      text-white border-2 border-green-600 hover:border-green-700
      focus:ring-green-500 shadow-green-200
      ${glow ? 'hover:shadow-green-500/50' : ''}
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
      text-white border-2 border-red-600 hover:border-red-700
      focus:ring-red-500 shadow-red-200
      ${glow ? 'hover:shadow-red-500/50' : ''}
    `,
    warning: `
      bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700
      text-white border-2 border-yellow-500 hover:border-yellow-600
      focus:ring-yellow-500 shadow-yellow-200
      ${glow ? 'hover:shadow-yellow-500/50' : ''}
    `,
    info: `
      bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700
      text-white border-2 border-cyan-500 hover:border-cyan-600
      focus:ring-cyan-500 shadow-cyan-200
      ${glow ? 'hover:shadow-cyan-500/50' : ''}
    `,
    gradient: `
      bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600
      hover:from-purple-700 hover:via-pink-700 hover:to-blue-700
      text-white border-2 border-transparent
      focus:ring-purple-500 shadow-purple-200
      ${glow ? 'hover:shadow-purple-500/50' : ''}
    `
  };

  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className={`h-5 w-5 ${children ? 'ml-2' : ''}`} />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className={`h-5 w-5 ${children ? 'mr-2' : ''}`} />
      )}
    </button>
  );
};

export default EnhancedButton;
