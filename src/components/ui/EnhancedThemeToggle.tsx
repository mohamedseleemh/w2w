import React, { useState, useEffect } from 'react';
import { Sun, Moon, Laptop, Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeOption {
  mode: ThemeMode;
  icon: React.ReactNode;
  label: string;
  description: string;
  colors: string;
}

const themeOptions: ThemeOption[] = [
  {
    mode: 'light',
    icon: <Sun className="h-4 w-4" />,
    label: 'فاتح',
    description: 'مظهر مشرق ونظيف',
    colors: 'from-yellow-400 to-orange-500'
  },
  {
    mode: 'dark',
    icon: <Moon className="h-4 w-4" />,
    label: 'مظلم',
    description: 'مظهر داكن ومريح للعين',
    colors: 'from-blue-500 to-indigo-600'
  },
  {
    mode: 'auto',
    icon: <Laptop className="h-4 w-4" />,
    label: 'تلقائي',
    description: 'يتبع إعدادات النظام',
    colors: 'from-purple-500 to-pink-500'
  }
];

const EnhancedThemeToggle: React.FC = () => {
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
    
    // Add transition effect
    setTimeout(() => {
      toggleTheme();
      setCurrentMode(newTheme);
      setIsAnimating(false);
      setIsOpen(false);
    }, 200);
  };

  const currentOption = themeOptions.find(option => option.mode === currentMode) || themeOptions[0];

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-20 h-10 rounded-full transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border border-gray-600 hover:border-gray-500 shadow-lg'
            : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg'
        } ${isAnimating ? 'animate-pulse' : ''}`}
        aria-label={`Current theme: ${currentOption.label}`}
        title={currentOption.description}
      >
        {/* Background Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <Sun className={`h-3 w-3 transition-all duration-500 ${
            currentMode === 'light' ? 'text-yellow-500 scale-110 drop-shadow-sm' : 'text-gray-400 scale-90'
          }`} />
          <Moon className={`h-3 w-3 transition-all duration-500 ${
            currentMode === 'dark' ? 'text-blue-400 scale-110 drop-shadow-sm' : 'text-gray-400 scale-90'
          }`} />
        </div>

        {/* Main Toggle Circle */}
        <div
          className={`absolute top-0.5 w-9 h-9 rounded-full transition-all duration-500 flex items-center justify-center shadow-lg transform group-hover:scale-110 ${
            currentMode === 'dark'
              ? 'translate-x-10 bg-gradient-to-br from-blue-500 to-indigo-600'
              : currentMode === 'auto'
                ? 'translate-x-5 bg-gradient-to-br from-purple-500 to-pink-500'
                : 'translate-x-0.5 bg-gradient-to-br from-yellow-400 to-orange-500'
          }`}
        >
          <div className="relative">
            {currentOption.icon}
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentOption.colors} opacity-20 blur-sm group-hover:opacity-40 transition-all duration-300`} />
          </div>
        </div>

        {/* Ambient Glow */}
        <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
          theme === 'dark'
            ? 'shadow-inner shadow-blue-500/10 group-hover:shadow-blue-500/20'
            : 'shadow-inner shadow-yellow-500/10 group-hover:shadow-yellow-500/20'
        }`} />

        {/* Indicator Dots */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {themeOptions.map((option, index) => (
            <div
              key={option.mode}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                option.mode === currentMode
                  ? 'bg-white scale-125 shadow-sm'
                  : 'bg-gray-400 scale-75'
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
          <div className={`absolute top-full left-0 mt-3 w-64 z-50 rounded-xl shadow-xl border animate-in slide-in-from-top-2 duration-200 ${
            theme === 'dark'
              ? 'bg-gray-800/95 border-gray-600/50 backdrop-blur-lg'
              : 'bg-white/95 border-gray-200/70 backdrop-blur-lg shadow-lg'
          }`}>
            <div className="p-2">
              {/* Header */}
              <div className={`px-3 py-2 mb-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Palette className="h-4 w-4 text-blue-500" />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    اختر المظهر
                  </span>
                </div>
              </div>

              {/* Theme Options */}
              {themeOptions.map((option) => (
                <button
                  key={option.mode}
                  onClick={() => handleThemeChange(option.mode)}
                  className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                    option.mode === currentMode
                      ? theme === 'dark'
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {/* Icon with gradient background */}
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${option.colors} text-white shadow-sm`}>
                    {option.icon}
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-sm font-medium">
                      {option.label}
                    </span>
                    <span className="text-xs opacity-70">
                      {option.description}
                    </span>
                  </div>

                  {/* Active Indicator */}
                  {option.mode === currentMode && (
                    <div className={`w-2 h-2 rounded-full ${
                      theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
                    } animate-pulse`} />
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

export default EnhancedThemeToggle;
