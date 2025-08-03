import { supabase } from '../lib/supabase';
import { errorHandlers } from '../utils/errorHandler';

export interface LandingPageSection {
  id: string;
  type: 'hero' | 'services' | 'about' | 'features' | 'testimonials' | 'stats' | 'cta' | 'footer' | 'custom';
  name: string;
  order: number;
  visible: boolean;
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    image?: string;
    background?: string;
    textColor?: string;
    items?: any[];
    customHTML?: string;
  };
  styles: {
    background: string;
    padding: string;
    margin: string;
    borderRadius: string;
    textAlign: 'left' | 'center' | 'right';
    minHeight: string;
    gradient?: string;
    shadow?: string;
    border?: string;
  };
  animation?: {
    type: 'none' | 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'zoom' | 'bounce';
    duration: string;
    delay: string;
  };
}

export interface PageTemplate {
  id: string;
  name: string;
  page_type: string;
  template_data: LandingPageSection[];
  theme_config: any;
  custom_css?: string;
  is_default: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LandingCustomization {
  id: string;
  section_name: string;
  content: any;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export class LandingPageService {
  private async _handleDbCall<T>(dbCall: Promise<{ data: T; error: any; }>, errorMessage: string): Promise<T> {
    try {
      const { data, error } = await dbCall;
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error(errorMessage, error);
      throw errorHandlers.extractErrorMessage(error);
    }
  }

  // Page Templates Operations
  async getPageTemplates(pageType: string = 'landing'): Promise<PageTemplate[]> {
    const { data, error } = await supabase
        .from('page_templates')
        .select('*')
        .eq('page_type', pageType)
        .eq('active', true)
        .order('created_at', { ascending: false });

    if (error) {
      console.warn('Database error fetching page templates:', errorHandlers.extractErrorMessage(error));
      return [];
    }

    return data || [];
  }

  async savePageTemplate(template: Omit<PageTemplate, 'id' | 'created_at' | 'updated_at'>, isDefault: boolean = false): Promise<PageTemplate> {
    const templateData = { ...template, is_default: isDefault };
    const dbCall = supabase
        .from('page_templates')
        .insert([templateData])
        .select()
        .single();

    return this._handleDbCall(dbCall, 'Error saving page template:');
  }

  async updatePageTemplate(id: string, updates: Partial<PageTemplate>): Promise<PageTemplate> {
    const dbCall = supabase
        .from('page_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    return this._handleDbCall(dbCall, 'Error updating page template:');
  }

  async setActiveTemplate(templateId: string): Promise<void> {
    await this._handleDbCall(
      supabase
        .from('page_templates')
        .update({ is_default: false })
        .eq('page_type', 'landing'),
      'Error resetting active template:'
    );

    await this._handleDbCall(
      supabase
        .from('page_templates')
        .update({ is_default: true })
        .eq('id', templateId),
      'Error setting active template:'
    );
  }

  async deletePageTemplate(id: string): Promise<void> {
    const dbCall = supabase
        .from('page_templates')
        .delete()
        .eq('id', id);

    await this._handleDbCall(dbCall, 'Error deleting page template:');
  }

  // Landing Page Customization Operations
  async getLandingCustomization(sectionName?: string): Promise<LandingCustomization[]> {
    let query = supabase
      .from('landing_customization')
      .select('*')
      .eq('active', true);

    if (sectionName) {
      query = query.eq('section_name', sectionName);
    }

    const dbCall = query.order('created_at', { ascending: false });

    return this._handleDbCall(dbCall, 'Error fetching landing customization:');
  }

  async saveLandingCustomization(sectionName: string, content: any): Promise<LandingCustomization> {
    const { data: existingData } = await supabase
      .from('landing_customization')
      .select('id')
      .eq('section_name', sectionName)
      .eq('active', true)
      .single();

    if (existingData) {
      const dbCall = supabase
        .from('landing_customization')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', existingData.id)
        .select()
        .single();

      return this._handleDbCall(dbCall, 'Error updating landing customization:');
    } else {
      const dbCall = supabase
        .from('landing_customization')
        .insert([{ section_name: sectionName, content }])
        .select()
        .single();

      return this._handleDbCall(dbCall, 'Error creating landing customization:');
    }
  }

  async deleteLandingCustomization(id: string): Promise<void> {
    const dbCall = supabase
      .from('landing_customization')
      .update({ active: false })
      .eq('id', id);

    await this._handleDbCall(dbCall, 'Error deleting landing customization:');
  }

  // Landing Page Sections Operations
  async getActiveLandingPageTemplate(): Promise<PageTemplate | null> {
    try {
      const templates = await this.getPageTemplates('landing');
      if (templates.length > 0) {
        return templates.find(t => t.is_default) || templates[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching active landing page template:', errorHandlers.extractErrorMessage(error));
      return null;
    }
  }

  async getLandingPageSections(): Promise<LandingPageSection[]> {
    try {
      const template = await this.getActiveLandingPageTemplate();
      if (template) {
        return template.template_data || [];
      }
      // Return empty array if no templates found
      return [];
    } catch (error) {
      console.error('Error fetching landing page sections:', errorHandlers.extractErrorMessage(error));

      // Fallback to localStorage if database fails
      try {
        const savedSections = localStorage.getItem('landing-page-sections');
        if (savedSections) {
          return JSON.parse(savedSections);
        }
      } catch (localStorageError) {
        console.warn('Failed to load from localStorage:', localStorageError);
      }

      // Return default sections if all else fails
      return this.getDefaultLandingSections();
    }
  }

  private getDefaultLandingSections(): LandingPageSection[] {
    return [
      {
        id: 'hero-default',
        type: 'hero',
        name: 'Hero Section',
        order: 1,
        visible: true,
        content: {
          title: 'مرحباً بكم في منصتنا',
          subtitle: 'خدمات رقمية متطورة',
          description: 'نقدم حلول مبتكرة وآمنة لاحتياجاتكم الرقمية',
          buttonText: 'ابدأ الآن'
        },
        styles: {
          background: '#f8fafc',
          padding: '4rem 0',
          margin: '0',
          borderRadius: '0',
          textAlign: 'center',
          minHeight: '500px'
        }
      }
    ];
  }

  async saveLandingPageSections(sections: LandingPageSection[]): Promise<void> {
    try {
      // Find existing default template or create new one
      const templates = await this.getPageTemplates('landing');
      const defaultTemplate = templates.find(t => t.is_default);

      if (defaultTemplate) {
        // Update existing default template
        await this.updatePageTemplate(defaultTemplate.id, {
          template_data: sections,
          updated_at: new Date().toISOString()
        });
      } else {
        // Create new default template
        await this.savePageTemplate({
          name: 'صفحة الهبوط الافتراضية',
          page_type: 'landing',
          template_data: sections,
          theme_config: {},
          is_default: true,
          active: true
        });
      }

      // Also save to localStorage as backup
      localStorage.setItem('landing-page-sections', JSON.stringify(sections));
    } catch (error) {
      console.error('Error saving landing page sections:', error);
      // Fallback to localStorage if database fails
      localStorage.setItem('landing-page-sections', JSON.stringify(sections));
      throw errorHandlers.extractErrorMessage(error);
    }
  }

  // Hero Section Operations
  async getHeroCustomization(): Promise<any> {
    try {
      const customizations = await this.getLandingCustomization('hero');
      return customizations.length > 0 ? customizations[0].content : {};
    } catch (error) {
      console.error('Error fetching hero customization:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('kyctrust_customization');
      const data = saved ? JSON.parse(saved) : {};
      return data.hero || {};
    }
  }

  async saveHeroCustomization(heroData: any): Promise<void> {
    try {
      await this.saveLandingCustomization('hero', heroData);
      
      // Also update localStorage for consistency
      const saved = localStorage.getItem('kyctrust_customization');
      const data = saved ? JSON.parse(saved) : {};
      data.hero = heroData;
      localStorage.setItem('kyctrust_customization', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving hero customization:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('kyctrust_customization');
      const data = saved ? JSON.parse(saved) : {};
      data.hero = heroData;
      localStorage.setItem('kyctrust_customization', JSON.stringify(data));
      throw errorHandlers.extractErrorMessage(error);
    }
  }

  // Global Settings Operations
  async getGlobalSettings(): Promise<any> {
    try {
      const customizations = await this.getLandingCustomization('global');
      return customizations.length > 0 ? customizations[0].content : {};
    } catch (error) {
      console.error('Error fetching global settings:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('kyctrust_customization');
      const data = saved ? JSON.parse(saved) : {};
      return data.global || {};
    }
  }

  async saveGlobalSettings(globalData: any): Promise<void> {
    try {
      await this.saveLandingCustomization('global', globalData);
      
      // Also update localStorage for consistency
      const saved = localStorage.getItem('kyctrust_customization');
      const data = saved ? JSON.parse(saved) : {};
      data.global = globalData;
      localStorage.setItem('kyctrust_customization', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving global settings:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('kyctrust_customization');
      const data = saved ? JSON.parse(saved) : {};
      data.global = globalData;
      localStorage.setItem('kyctrust_customization', JSON.stringify(data));
      throw errorHandlers.extractErrorMessage(error);
    }
  }
}

// Export singleton instance
export const landingPageService = new LandingPageService();
