import React, { useState } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import type { PageTheme } from './PageBuilder';

interface ThemeSelectorProps {
  themes: PageTheme[];
  currentTheme: PageTheme | null;
  onThemeChange: (theme: PageTheme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  currentTheme,
  onThemeChange
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-reverse space-x-2 px-4 py-2 rounded-lg border transition-colors ${
          theme === 'dark'
            ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Palette className="h-4 w-4" />
        <span className="text-sm font-medium">
          {currentTheme ? currentTheme.name : 'Select Theme'}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`absolute top-full right-0 mt-2 w-80 rounded-xl shadow-lg border z-20 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="p-4">
              <h3 className={`text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Choose Theme
              </h3>
              
              <div className="space-y-3">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      onThemeChange(themeOption);
                      setIsOpen(false);
                    }}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      currentTheme?.id === themeOption.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : theme === 'dark'
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {themeOption.name}
                      </span>
                      
                      {currentTheme?.id === themeOption.id && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    
                    {/* Color Preview */}
                    <div className="flex space-x-reverse space-x-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: themeOption.colors.primary }}
                        title="Primary Color"
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: themeOption.colors.secondary }}
                        title="Secondary Color"
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: themeOption.colors.accent }}
                        title="Accent Color"
                      />
                    </div>
                    
                    {/* Theme Details */}
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Font: {themeOption.fonts.heading}</div>
                      <div>Spacing: {themeOption.spacing.medium}px</div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Custom Theme Option */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => {
                    // Create a custom theme entry
                    const customThemeName = prompt('Enter custom theme name:', 'Custom Theme');
                    if (customThemeName && onThemeChange) {
                      onThemeChange({ name: customThemeName, config: {
                        primary: '#3b82f6', secondary: '#8b5cf6', accent: '#f59e0b'
                      }});
                    }
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 rounded-lg border-2 border-dashed transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300'
                      : 'border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-reverse space-x-2">
                    <Palette className="h-4 w-4" />
                    <span className="text-sm font-medium">Create Custom Theme</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
