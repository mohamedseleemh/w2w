import React, { useState } from 'react';
import { Globe, ChevronDown, Languages, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  gradient: string;
}

const languages: Language[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl', gradient: 'from-green-500 to-emerald-600' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr', gradient: 'from-blue-500 to-cyan-600' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr', gradient: 'from-indigo-500 to-purple-600' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr', gradient: 'from-red-500 to-pink-600' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr', gradient: 'from-yellow-500 to-orange-600' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', direction: 'ltr', gradient: 'from-green-500 to-teal-600' }
];

const SuperLanguageToggle: React.FC = () => {
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
    
    setTimeout(() => {
      toggleLanguage();
      setIsAnimating(false);
      setIsOpen(false);
    }, 300);
  };

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          theme === 'dark'
            ? 'bg-gray-800/80 hover:bg-gray-700/90 border border-gray-600/50 hover:border-gray-500/70 text-gray-300 hover:text-white'
            : 'bg-white/80 hover:bg-white/95 border border-gray-200/70 hover:border-gray-300/90 text-gray-600 hover:text-gray-900 shadow-sm hover:shadow-md'
        } ${isAnimating ? 'animate-pulse' : ''} backdrop-blur-sm`}
        aria-label="Select language"
      >
        {/* Animated Background Glow */}
        <div className={`absolute inset-0.5 rounded-lg bg-gradient-to-r ${currentLanguage.gradient} opacity-0 group-hover:opacity-10 transition-all duration-300`} />

        {/* Content */}
        <div className="relative flex items-center space-x-2 space-x-reverse">
          {/* Globe icon with animation */}
          <div className="relative">
            <Globe className={`h-4 w-4 transition-all duration-300 ${
              isAnimating ? 'animate-spin' : 'group-hover:rotate-12'
            }`} />
            {/* Orbital ring */}
            <div className={`absolute inset-0 rounded-full border border-current opacity-20 scale-150 ${
              isAnimating ? 'animate-ping' : ''
            }`} />
          </div>
          
          {/* Flag with shine effect */}
          <div className="relative">
            <span className="text-lg group-hover:scale-110 transition-transform duration-300">
              {currentLanguage.flag}
            </span>
            {/* Shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
          </div>
          
          {/* Language info */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold leading-tight">
              {currentLanguage.nativeName}
            </span>
            <span className="text-xs opacity-70 leading-tight">
              {currentLanguage.name}
            </span>
          </div>

          {/* Chevron with rotation */}
          <ChevronDown className={`h-3 w-3 transition-all duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          } group-hover:scale-110`} />
        </div>

        {/* Active language indicator */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r ${currentLanguage.gradient} border-2 ${
          theme === 'dark' ? 'border-gray-800' : 'border-white'
        } animate-pulse`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Language Options Dropdown */}
          <div className={`absolute top-full left-0 mt-2 w-80 z-50 rounded-2xl shadow-xl border backdrop-blur-lg animate-in slide-in-from-top-2 duration-200 ${
            theme === 'dark'
              ? 'bg-gray-800/95 border-gray-600/50'
              : 'bg-white/95 border-gray-200/70'
          }`}>
            <div className="p-4">
              {/* Header */}
              <div className={`flex items-center justify-center space-x-2 space-x-reverse mb-4 p-3 rounded-xl ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/80'
              }`}>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${currentLanguage.gradient} text-white`}>
                  <Languages className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <span className={`text-sm font-semibold block ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    اختر لغة المنصة
                  </span>
                  <span className={`text-xs opacity-70 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    اللغة الحالية: {currentLanguage.nativeName}
                  </span>
                </div>
              </div>

              {/* Language Options Grid */}
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`group flex items-center space-x-3 space-x-reverse p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                      lang.code === language
                        ? theme === 'dark'
                          ? `bg-gradient-to-r ${lang.gradient} bg-opacity-20 border border-opacity-30`
                          : `bg-gradient-to-r ${lang.gradient} bg-opacity-10 border border-opacity-30`
                        : theme === 'dark'
                          ? 'hover:bg-gray-700/50'
                          : 'hover:bg-gray-50/80'
                    }`}
                  >
                    {/* Flag with glow effect */}
                    <div className="relative">
                      <span className={`text-2xl transition-transform duration-300 ${
                        lang.code === language ? 'scale-110' : 'group-hover:scale-105'
                      }`}>
                        {lang.flag}
                      </span>
                      {/* Active glow */}
                      {lang.code === language && (
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${lang.gradient} blur-sm opacity-30 animate-pulse`} />
                      )}
                    </div>
                    
                    {/* Language info */}
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className={`text-sm font-semibold truncate w-full ${
                        lang.code === language
                          ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                          : theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {lang.nativeName}
                      </span>
                      <span className={`text-xs truncate w-full ${
                        lang.code === language
                          ? theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {lang.name}
                      </span>
                    </div>

                    {/* Direction indicator */}
                    <div className={`text-xs px-2 py-1 rounded-md ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/80'
                    }`}>
                      {lang.direction.toUpperCase()}
                    </div>

                    {/* Active indicator */}
                    {lang.code === language && (
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-white bg-green-500 rounded-full p-0.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Footer info */}
              <div className={`mt-4 p-3 rounded-xl text-center ${
                theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/50'
              }`}>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  💡 تلميح: بعض الميزات قد تتطلب إعادة تحميل الصفحة
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SuperLanguageToggle;
