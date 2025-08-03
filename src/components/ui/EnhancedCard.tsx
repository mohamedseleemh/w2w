import React, { ReactNode } from 'react';

interface EnhancedCardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  hover?: boolean;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  hover = false,
  glow = false,
  className = '',
  onClick
}) => {
  const baseClasses = `
    transition-all duration-300 ease-in-out
    ${onClick ? 'cursor-pointer' : ''}
    ${hover ? 'transform hover:scale-105 hover:-translate-y-1' : ''}
    ${glow ? 'hover:shadow-2xl' : ''}
  `;

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full'
  };

  const variantClasses = {
    default: `
      bg-white dark:bg-gray-800 
      border border-gray-200 dark:border-gray-700
      shadow-lg hover:shadow-xl
    `,
    elevated: `
      bg-white dark:bg-gray-800
      shadow-xl hover:shadow-2xl
      border-0
    `,
    bordered: `
      bg-white dark:bg-gray-800
      border-2 border-gray-300 dark:border-gray-600
      shadow-md hover:shadow-lg
      hover:border-blue-500 dark:hover:border-blue-400
    `,
    glass: `
      bg-white/80 dark:bg-gray-800/80
      backdrop-blur-lg
      border border-white/20 dark:border-gray-700/20
      shadow-xl hover:shadow-2xl
    `,
    gradient: `
      bg-gradient-to-br from-white via-blue-50 to-purple-50
      dark:from-gray-800 dark:via-gray-800 dark:to-gray-900
      border border-gray-200 dark:border-gray-700
      shadow-lg hover:shadow-xl
    `
  };

  const combinedClasses = `
    ${baseClasses}
    ${paddingClasses[padding]}
    ${roundedClasses[rounded]}
    ${variantClasses[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default EnhancedCard;
