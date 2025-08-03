import React from 'react';
import { Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage, theme } = useTheme();

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-all duration-200 ${
        theme === 'dark'
          ? 'text-gray-300 hover:text-white hover:bg-gray-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
      aria-label="Toggle language"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">
        {language === 'ar' ? 'EN' : 'العربية'}
      </span>
    </button>
  );
};

export default LanguageToggle;
