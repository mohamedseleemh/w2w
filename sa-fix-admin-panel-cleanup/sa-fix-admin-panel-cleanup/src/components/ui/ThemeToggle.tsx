import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-16 h-8 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group ${
        theme === 'dark'
          ? 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
          : 'bg-gray-200 hover:bg-gray-300 border border-gray-300'
      }`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs">
        <Sun className={`h-3 w-3 transition-all duration-300 ${
          theme === 'light' ? 'text-yellow-600' : 'text-gray-400'
        }`} />
        <Moon className={`h-3 w-3 transition-all duration-300 ${
          theme === 'dark' ? 'text-blue-400' : 'text-gray-400'
        }`} />
      </div>

      {/* Toggle Circle */}
      <div
        className={`absolute top-0.5 w-7 h-7 rounded-full transition-all duration-500 flex items-center justify-center shadow-lg transform ${
          theme === 'dark'
            ? 'translate-x-8 bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:scale-110'
            : 'translate-x-0.5 bg-gradient-to-br from-yellow-400 to-orange-500 group-hover:scale-110'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="h-4 w-4 text-white drop-shadow-sm" />
        ) : (
          <Sun className="h-4 w-4 text-white drop-shadow-sm" />
        )}
      </div>

      {/* Subtle Glow Effect */}
      <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
        theme === 'dark'
          ? 'shadow-inner shadow-blue-500/20'
          : 'shadow-inner shadow-yellow-500/20'
      }`} />
    </button>
  );
};

export default ThemeToggle;
