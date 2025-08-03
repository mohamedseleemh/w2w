import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' }
];

const EnhancedLanguageToggle: React.FC = () => {
  const { language, toggleLanguage, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = async (newLanguage: string) => {
    if (newLanguage === language) {
      setIsOpen(false);
      return;
    }

    setIsAnimating(true);
    
    // Add a smooth transition effect
    setTimeout(() => {
      toggleLanguage();
      setIsAnimating(false);
      setIsOpen(false);
    }, 200);
  };

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
          theme === 'dark'
            ? 'text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600/50 hover:border-gray-500'
            : 'text-gray-600 hover:text-gray-900 bg-white/70 hover:bg-white/90 border border-gray-200/70 hover:border-gray-300 shadow-sm hover:shadow-md'
        } ${isAnimating ? 'animate-pulse' : ''}`}
        aria-label="Select language"
      >
        {/* Animated Background Glow */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
            : 'bg-gradient-to-r from-blue-500/5 to-purple-500/5'
        }`} />

        {/* Content */}
        <div className="relative flex items-center space-x-2 space-x-reverse">
          <div className="flex items-center space-x-1.5 space-x-reverse">
            <Globe className={`h-4 w-4 transition-all duration-300 ${
              isAnimating ? 'animate-spin' : 'group-hover:rotate-12'
            }`} />
            <span className="text-lg">{currentLanguage.flag}</span>
          </div>
          
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium leading-tight">
              {currentLanguage.nativeName}
            </span>
            <span className="text-xs opacity-70 leading-tight">
              {currentLanguage.name}
            </span>
          </div>

          <ChevronDown className={`h-4 w-4 transition-all duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`absolute top-full left-0 mt-2 w-56 z-50 rounded-xl shadow-xl border animate-in slide-in-from-top-2 duration-200 ${
            theme === 'dark'
              ? 'bg-gray-800/95 border-gray-600/50 backdrop-blur-lg'
              : 'bg-white/95 border-gray-200/70 backdrop-blur-lg shadow-lg'
          }`}>
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 transition-all duration-200 hover:scale-[1.02] ${
                    lang.code === language
                      ? theme === 'dark'
                        ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-500'
                        : 'bg-blue-50 text-blue-600 border-r-2 border-blue-500'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-sm font-medium">
                      {lang.nativeName}
                    </span>
                    <span className="text-xs opacity-70">
                      {lang.name}
                    </span>
                  </div>
                  {lang.code === language && (
                    <div className={`w-2 h-2 rounded-full ${
                      theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
                    }`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedLanguageToggle;
