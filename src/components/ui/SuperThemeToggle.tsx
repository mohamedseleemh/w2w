import React, { useState, useEffect } from 'react';
import { Sun, Moon, Laptop, Palette, Stars, CloudMoon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeOption {
  mode: ThemeMode;
  icon: React.ReactNode;
  label: string;
  description: string;
  gradient: string;
  shadow: string;
}

const themeOptions: ThemeOption[] = [
  {
    mode: 'light',
    icon: <Sun className="h-3.5 w-3.5" />,
    label: 'فاتح',
    description: 'مظهر مشرق ونظيف',
    gradient: 'from-yellow-400 via-orange-400 to-red-400',
    shadow: 'shadow-yellow-500/30'
  },
  {
    mode: 'dark',
    icon: <Moon className="h-3.5 w-3.5" />,
    label: 'مظلم',
    description: 'مظهر داكن ومريح للعين',
    gradient: 'from-blue-600 via-purple-600 to-indigo-700',
    shadow: 'shadow-blue-500/30'
  },
  {
    mode: 'auto',
    icon: <Laptop className="h-3.5 w-3.5" />,
    label: 'تلقائي',
    description: 'يتبع إعدادات النظام',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    shadow: 'shadow-emerald-500/30'
  }
];

const SuperThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<ThemeMode>('light');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCurrentMode(theme as ThemeMode);
  }, [theme]);

  const handleThemeChange = async (newTheme: ThemeMode) => {
    if (newTheme === currentMode) {
      setIsOpen(false);
      return;
    }

    setIsAnimating(true);
    
    setTimeout(() => {
      toggleTheme();
      setCurrentMode(newTheme);
      setIsAnimating(false);
      setIsOpen(false);
    }, 300);
  };

  const currentOption = themeOptions.find(option => option.mode === currentMode) || themeOptions[0];

  return (
    <div className="relative">
      {/* Main Toggle Button - Fixed positioning */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          theme === 'dark'
            ? 'bg-gray-800/80 hover:bg-gray-700/90 border border-gray-600/50 hover:border-gray-500/70'
            : 'bg-white/80 hover:bg-white/95 border border-gray-200/70 hover:border-gray-300/90 shadow-sm hover:shadow-md'
        } ${isAnimating ? 'animate-pulse' : ''} backdrop-blur-sm`}
        aria-label={`Current theme: ${currentOption.label}`}
        title={currentOption.description}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0.5 rounded-lg bg-gradient-to-br ${currentOption.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
        
        {/* Main icon container */}
        <div className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br ${currentOption.gradient} text-white ${currentOption.shadow} group-hover:shadow-lg transition-all duration-300 ${isAnimating ? 'animate-spin' : 'group-hover:scale-110'}`}>
          {currentOption.icon}
          
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Indicator dots */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
          {themeOptions.map((option, index) => (
            <div
              key={option.mode}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                option.mode === currentMode
                  ? `bg-gradient-to-r ${option.gradient} scale-125`
                  : 'bg-gray-400/50 scale-75'
              }`}
            />
          ))}
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
          
          {/* Theme Options Dropdown */}
          <div className={`absolute top-full left-0 mt-2 w-72 z-50 rounded-2xl ${currentOption.shadow} border backdrop-blur-lg animate-in slide-in-from-top-2 duration-200 ${
            theme === 'dark'
              ? 'bg-gray-800/95 border-gray-600/50 shadow-xl'
              : 'bg-white/95 border-gray-200/70 shadow-xl'
          }`}>
            <div className="p-4">
              {/* Header */}
              <div className={`flex items-center justify-center space-x-2 space-x-reverse mb-4 p-3 rounded-xl ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/80'
              }`}>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${currentOption.gradient} text-white`}>
                  <Palette className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <span className={`text-sm font-semibold block ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    اختر مظهر المنصة
                  </span>
                  <span className={`text-xs opacity-70 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    المظهر الحالي: {currentOption.label}
                  </span>
                </div>
              </div>

              {/* Theme Options */}
              <div className="space-y-2">
                {themeOptions.map((option) => (
                  <button
                    key={option.mode}
                    onClick={() => handleThemeChange(option.mode)}
                    className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] group ${
                      option.mode === currentMode
                        ? theme === 'dark'
                          ? `bg-gradient-to-r ${option.gradient} bg-opacity-20 border-2 border-opacity-30`
                          : `bg-gradient-to-r ${option.gradient} bg-opacity-10 border-2 border-opacity-30`
                        : theme === 'dark'
                          ? 'hover:bg-gray-700/50 border-2 border-transparent'
                          : 'hover:bg-gray-50/80 border-2 border-transparent'
                    }`}
                  >
                    {/* Icon with gradient background */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${option.gradient} text-white ${option.shadow} group-hover:shadow-lg transition-all duration-300 ${
                      option.mode === currentMode ? 'scale-110' : 'group-hover:scale-105'
                    }`}>
                      {option.icon}
                      {option.mode === currentMode && (
                        <div className="absolute inset-0 rounded-xl animate-pulse bg-white/20" />
                      )}
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex flex-col items-start flex-1">
                      <span className={`text-sm font-semibold ${
                        option.mode === currentMode
                          ? 'text-white'
                          : theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {option.label}
                      </span>
                      <span className={`text-xs leading-tight ${
                        option.mode === currentMode
                          ? 'text-white/80'
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {option.description}
                      </span>
                    </div>

                    {/* Active Indicator */}
                    {option.mode === currentMode && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Footer info */}
              <div className={`mt-4 p-3 rounded-xl text-center ${
                theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/50'
              }`}>
                <div className="flex items-center justify-center space-x-1 space-x-reverse">
                  <Stars className="h-3 w-3 text-yellow-500" />
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    التبديل السريع: اضغط على الزر مباشرة
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SuperThemeToggle;
