import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { landingPageService } from '../services/landingPageService';

export interface HeroSection {
  title: string;
  titleGradient: string;
  subtitle: string;
  button1Text: string;
  button2Text?: string;
  badgeText: string;
  showStats: boolean;
  statsData: {
    clients: string;
    successRate: string;
    support: string;
    speed: string;
  };
}

export interface GlobalSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
  spacing: string;
}

export interface PageElement {
  id: string;
  type: 'hero' | 'services' | 'features' | 'testimonials' | 'stats' | 'cta' | 'text' | 'image' | 'video' | 'form' | 'header' | 'footer';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: any;
  styles: {
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    padding?: number;
    margin?: number;
    animation?: string;
    fontSize?: number;
    fontWeight?: string;
    borderWidth?: number;
    borderColor?: string;
    fontFamily?: string;
  };
  visible: boolean;
  order: number;
}

export interface CustomizationData {
  hero: HeroSection;
  globalSettings: GlobalSettings;
  pageElements: PageElement[];
  pageLayout: {
    sections: string[];
    theme: string;
    customCSS?: string;
  };
}

interface CustomizationContextType {
  customization: CustomizationData;
  loading: boolean;
  error: string | null;
  updateHeroSection: (hero: HeroSection) => Promise<void>;
  updateGlobalSettings: (settings: GlobalSettings) => Promise<void>;
  updatePageElements: (elements: PageElement[]) => Promise<void>;
  updatePageLayout: (layout: any) => Promise<void>;
  addPageElement: (element: PageElement) => Promise<void>;
  updatePageElement: (id: string, updates: Partial<PageElement>) => Promise<void>;
  deletePageElement: (id: string) => Promise<void>;
  refreshCustomization: () => void;
  publishPage: () => Promise<void>;
}

// Default customization data
const defaultCustomization: CustomizationData = {
  hero: {
    title: 'مستقبل الخدمات',
    titleGradient: 'المالية الرقمية',
    subtitle: 'نحن نعيد تعريف الخدمات المالية الرقمية من خلال تقديم حلول مبتكرة وآمنة ومتطورة تلبي احتياجاتك المالية بكفاءة عالية وموثوقية استثنائية',
    button1Text: 'ابدأ رحلتك معنا',
    button2Text: '��ستكشف الخدمات',
    badgeText: 'منصة رائدة في الخدمات المالية الرقمية',
    showStats: true,
    statsData: {
      clients: '15,000+',
      successRate: '99.9%',
      support: '24/7',
      speed: '< 5 دقائق'
    }
  },
  globalSettings: {
    primaryColor: '#3b82f6',
    secondaryColor: '#6366f1',
    accentColor: '#8b5cf6',
    fontFamily: 'Cairo',
    borderRadius: '1rem',
    spacing: '1.5rem'
  },
  pageElements: [
    {
      id: 'default-header',
      type: 'header',
      content: {
        logoUrl: '/logo.png',
        links: [
          { text: 'الرئيسية', href: '#' },
          { text: 'خدماتنا', href: '#' },
          { text: 'من نحن', href: '#' },
          { text: 'اتصل بنا', href: '#' },
        ],
      },
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
      },
      position: { x: 0, y: 0 },
      size: { width: 1200, height: 80 },
      visible: true,
      order: 0,
    },
    {
      id: 'default-footer',
      type: 'footer',
      content: {
        text: '© 2024 KYCtrust. جميع الحقوق محفوظة.',
        links: [
          { text: 'سياسة الخصوصية', href: '#' },
          { text: 'شروط الاستخدام', href: '#' },
        ],
      },
      styles: {
        backgroundColor: '#1F2937',
        textColor: '#ffffff',
      },
      position: { x: 0, y: 1000 },
      size: { width: 1200, height: 100 },
      visible: true,
      order: 1000,
    },
  ],
  pageLayout: {
    sections: ['header', 'hero', 'services', 'features', 'testimonials', 'faq', 'footer'],
    theme: 'modern',
    customCSS: ''
  }
};

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customization, setCustomization] = useState<CustomizationData>(defaultCustomization);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load customization from database on mount
  useEffect(() => {
    const loadCustomization = async () => {
      setLoading(true);
      setError(null);

      try {
        // First try to load from localStorage as fallback
        const localCustomization = localStorage.getItem('kyctrust_customization');
        if (localCustomization) {
          try {
            const parsed = JSON.parse(localCustomization);
            setCustomization({
              hero: parsed.hero || defaultCustomization.hero,
              globalSettings: parsed.globalSettings || defaultCustomization.globalSettings,
              pageElements: parsed.pageElements || defaultCustomization.pageElements,
              pageLayout: parsed.pageLayout || defaultCustomization.pageLayout,
            });
          } catch (parseError) {
            console.warn('Failed to parse local customization, using defaults');
            setCustomization(defaultCustomization);
          }
        } else {
          setCustomization(defaultCustomization);
        }

        // Then try to load from database and update if available
        try {
          const template = await landingPageService.getActiveLandingPageTemplate();
          if (template && template.template_data && template.template_data.length > 0) {
            const pageData = template.template_data[0] as any;
            const dbCustomization = {
              hero: pageData.hero || defaultCustomization.hero,
              globalSettings: pageData.styles || defaultCustomization.globalSettings,
              pageElements: pageData.elements || defaultCustomization.pageElements,
              pageLayout: pageData.settings || defaultCustomization.pageLayout,
            };
            setCustomization(dbCustomization);
            // Update localStorage with DB data
            localStorage.setItem('kyctrust_customization', JSON.stringify(dbCustomization));
          }
        } catch (dbError) {
          console.warn('Failed to load from database, using cached/default data:', dbError);
          // Don't throw here, we already have fallback data loaded
        }

      } catch (err) {
        console.error('Error loading customization:', err);
        setError('فشل في تحميل بيانات التخصيص - تم استخدام الإعدادات الافتراضية');
        // Use default customization even if there's an error
        setCustomization(defaultCustomization);
      } finally {
        setLoading(false);
      }
    };

    loadCustomization();
  }, []);

  const saveToDatabase = async (data: CustomizationData): Promise<boolean> => {
    try {
      await landingPageService.savePageTemplate({
        name: 'Default Landing Page',
        page_type: 'landing',
        template_data: [data],
        theme_config: data.globalSettings,
        is_default: true,
        active: true,
      });
      return true;
    } catch (error) {
      console.warn('Failed to save to database, using localStorage fallback:', error);
      // Save to localStorage as fallback
      try {
        localStorage.setItem('kyctrust_customization', JSON.stringify(data));
        return false; // Indicate DB save failed but localStorage succeeded
      } catch (localError) {
        console.error('Failed to save to localStorage as well:', localError);
        throw new Error('فشل في حفظ التخصيص');
      }
    }
  };

  const updateHeroSection = async (hero: HeroSection): Promise<void> => {
    try {
      setLoading(true);
      const newCustomization = { ...customization, hero };
      setCustomization(newCustomization);

      const saved = await saveToDatabase(newCustomization);
      if (!saved) {
        setError('تم حفظ التغييرات محلياً - قاعدة البيانات غير متاحة');
      } else {
        setError(null);
      }
    } catch (error) {
      const errorMessage = 'فشل في حفظ إعدادات القسم الرئيسي';
      setError(errorMessage);
      console.error('Error updating hero section:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalSettings = async (settings: GlobalSettings): Promise<void> => {
    try {
      setLoading(true);
      const newCustomization = { ...customization, globalSettings: settings };
      setCustomization(newCustomization);

      // Apply CSS variables to the document immediately
      const root = document.documentElement;
      root.style.setProperty('--primary-color', settings.primaryColor);
      root.style.setProperty('--secondary-color', settings.secondaryColor);
      root.style.setProperty('--accent-color', settings.accentColor);
      root.style.setProperty('--font-family', settings.fontFamily);
      root.style.setProperty('--border-radius', settings.borderRadius);
      root.style.setProperty('--spacing', settings.spacing);

      const saved = await saveToDatabase(newCustomization);
      if (!saved) {
        setError('تم حفظ التغييرات محلياً - قاعدة البيانات غير متاحة');
      } else {
        setError(null);
      }

    } catch (error) {
      const errorMessage = 'فشل في حفظ الإعدادات العامة';
      setError(errorMessage);
      console.error('Error updating global settings:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePageElements = async (elements: PageElement[]): Promise<void> => {
    try {
      setLoading(true);
      const newCustomization = { ...customization, pageElements: elements };
      setCustomization(newCustomization);

      const saved = await saveToDatabase(newCustomization);
      if (!saved) {
        setError('تم حفظ التغييرات محلياً - قاعدة البيانات غير متاحة');
      } else {
        setError(null);
      }
    } catch (error) {
      const errorMessage = 'فشل في حفظ عناصر الصفحة';
      setError(errorMessage);
      console.error('Error updating page elements:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePageLayout = async (layout: any): Promise<void> => {
    try {
      setLoading(true);
      const newCustomization = { ...customization, pageLayout: { ...customization.pageLayout, ...layout } };
      setCustomization(newCustomization);

      const saved = await saveToDatabase(newCustomization);
      if (!saved) {
        setError('تم حفظ التغييرات محلياً - قاعدة البيانات غير متاحة');
      } else {
        setError(null);
      }
    } catch (error) {
      const errorMessage = 'فشل في حفظ تخطيط الصفحة';
      setError(errorMessage);
      console.error('Error updating page layout:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addPageElement = async (element: PageElement): Promise<void> => {
    try {
      const newElements = [...customization.pageElements, element];
      await updatePageElements(newElements);
    } catch (error) {
      console.error('Error adding page element:', error);
      throw new Error('فشل في إضافة العنصر');
    }
  };

  const updatePageElement = async (id: string, updates: Partial<PageElement>): Promise<void> => {
    try {
      const newElements = customization.pageElements.map(el =>
        el.id === id ? { ...el, ...updates } : el
      );
      await updatePageElements(newElements);
    } catch (error) {
      console.error('Error updating page element:', error);
      throw new Error('فشل في تحديث العنصر');
    }
  };

  const deletePageElement = async (id: string): Promise<void> => {
    try {
      const newElements = customization.pageElements.filter(el => el.id !== id);
      await updatePageElements(newElements);
    } catch (error) {
      console.error('Error deleting page element:', error);
      throw new Error('فشل في حذف العنصر');
    }
  };

  const publishPage = async (): Promise<void> => {
    try {
      setLoading(true);

      // Save to database first
      const saved = await saveToDatabase(customization);

      // Also save to localStorage as published version
      localStorage.setItem('kyctrust_published_page', JSON.stringify(customization));

      // Trigger a page refresh to apply changes
      window.dispatchEvent(new CustomEvent('pagePublished', {
        detail: customization
      }));

      if (!saved) {
        setError('تم نشر الصفحة محلياً - قاعدة البيانات غير متاحة');
      } else {
        setError(null);
      }
    } catch (error) {
      const errorMessage = 'فشل في نشر الصفحة';
      setError(errorMessage);
      console.error('Error publishing page:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshCustomization = () => {
    try {
      const saved = localStorage.getItem('kyctrust_customization');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomization({ ...defaultCustomization, ...parsed });
      } else {
        setCustomization(defaultCustomization);
      }
      setError(null);
    } catch (error) {
      console.error('Error refreshing customization:', error);
      setError('فشل في تحديث البيانات');
    }
  };

  const value: CustomizationContextType = {
    customization,
    loading,
    error,
    updateHeroSection,
    updateGlobalSettings,
    updatePageElements,
    updatePageLayout,
    addPageElement,
    updatePageElement,
    deletePageElement,
    refreshCustomization,
    publishPage
  };

  return (
    <CustomizationContext.Provider value={value}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = (): CustomizationContextType => {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};
