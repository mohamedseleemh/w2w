import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Language = 'ar' | 'en';

interface ThemeContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [language, setLanguageState] = useState<Language>('ar');

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('kyctrust_theme') as Theme;
      if (savedTheme) {
        setThemeState(savedTheme);
      } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setThemeState('dark');
        }
      }

      const savedLanguage = localStorage.getItem('kyctrust_language') as Language;
      if (savedLanguage) {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.warn('Failed to load theme/language from localStorage:', error);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('kyctrust_theme', newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }

    // Apply theme to document
    try {
      if (typeof document !== 'undefined') {
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (error) {
      console.warn('Failed to apply theme to document:', error);
    }
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    try {
      localStorage.setItem('kyctrust_language', newLanguage);
    } catch (error) {
      console.warn('Failed to save language to localStorage:', error);
    }
    
    // Apply language to document
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLanguage;
        document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
      }
    } catch (error) {
      console.warn('Failed to apply language to document:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  // Apply theme on component mount
  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (error) {
      console.warn('Failed to apply initial theme:', error);
    }
  }, []);

  // Apply language on component mount
  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      }
    } catch (error) {
      console.warn('Failed to apply initial language:', error);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
          try {
            if (!localStorage.getItem('kyctrust_theme')) {
              setTheme(e.matches ? 'dark' : 'light');
            }
          } catch (error) {
            console.warn('Failed to read theme preference:', error);
          }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    } catch (error) {
      console.warn('Failed to setup theme listener:', error);
    }
  }, []);

  const value: ThemeContextType = {
    theme,
    language,
    toggleTheme,
    toggleLanguage,
    setTheme,
    setLanguage,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
