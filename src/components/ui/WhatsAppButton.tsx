import React from 'react';
import { MessageCircle } from 'lucide-react';
import { env } from '../../utils/env';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'float' | 'inline';
  showText?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message = 'مرحباً، أحتاج مساعدة في خدماتكم',
  className = '',
  size = 'md',
  variant = 'float',
  showText = true
}) => {
  const phoneNumber = env.WHATSAPP_NUMBER || '+201062453344';
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  const sizeClasses = {
    sm: variant === 'float' ? 'w-12 h-12' : 'px-4 py-2 text-sm',
    md: variant === 'float' ? 'w-14 h-14' : 'px-6 py-3 text-base',
    lg: variant === 'float' ? 'w-16 h-16' : 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7'
  };

  if (variant === 'float') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          fixed bottom-6 left-6 z-50
          ${sizeClasses[size]}
          bg-green-500 hover:bg-green-600 
          text-white rounded-full
          flex items-center justify-center
          shadow-lg hover:shadow-xl
          transition-all duration-300
          transform hover:scale-110
          animate-bounce-slow
          group
          ${className}
        `}
        title="تواصل معنا عبر واتساب"
      >
        <MessageCircle className={`${iconSizes[size]} group-hover:scale-110 transition-transform`} />
        
        {/* Pulse effect */}
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          تواصل معنا عبر واتساب
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        bg-green-500 hover:bg-green-600
        text-white font-semibold rounded-xl
        shadow-lg hover:shadow-xl
        transition-all duration-300
        transform hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50
        group
        ${className}
      `}
    >
      <MessageCircle className={`${iconSizes[size]} ${showText ? 'ml-2' : ''} group-hover:scale-110 transition-transform`} />
      {showText && (
        <span>تواصل عبر واتساب</span>
      )}
    </a>
  );
};

export default WhatsAppButton;
