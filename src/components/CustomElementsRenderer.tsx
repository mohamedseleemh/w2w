import React from 'react';
import { useCustomization } from '../context/CustomizationContext';
import { sanitizeCSSCompletely, validateCSSRules } from '../utils/cssSanitizer';
import { useTheme } from '../context/ThemeContext';
import ElementRenderer from './admin/VisualEditor/ElementRenderer';

const CustomElementsRenderer: React.FC = () => {
  const { customization } = useCustomization();
  const { theme } = useTheme();

  // Don't render if there are no custom elements
  if (!customization?.pageElements || customization.pageElements.length === 0) {
    return null;
  }

  // Sort elements by order for proper display
  const sortedElements = [...customization.pageElements]
    .filter(element => element.visible)
    .sort((a, b) => a.order - b.order);

  const customTheme = {
    id: 'custom',
    name: 'Custom Theme',
    colors: {
      primary: customization.globalSettings.primaryColor,
      secondary: customization.globalSettings.secondaryColor,
      accent: customization.globalSettings.accentColor,
      background: theme === 'dark' ? '#1F2937' : '#ffffff',
      text: theme === 'dark' ? '#ffffff' : '#000000'
    },
    fonts: {
      heading: customization.globalSettings.fontFamily,
      body: customization.globalSettings.fontFamily
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 32
    }
  };

  return (
    <div className="custom-elements-container">
      {sortedElements.map((element) => (
        <section
          key={element.id}
          className={`custom-element-section ${element.type}-section`}
          style={{
            fontFamily: customization.globalSettings.fontFamily,
            '--element-order': element.order
          } as React.CSSProperties}
        >
          <div 
            className="custom-element-wrapper"
            style={{
              minHeight: element.size.height,
              padding: element.styles.padding ? `${element.styles.padding}px` : undefined,
              margin: element.styles.margin ? `${element.styles.margin}px` : undefined,
            }}
          >
            <ElementRenderer
              element={element}
              theme={customTheme}
              isEditing={false}
            />
          </div>
        </section>
      ))}
      
      {/* Secure Custom CSS */}
      <SafeCustomCSS css={customization.pageLayout?.customCSS || ''} />
    </div>
  );
};

/**
 * Safe Custom CSS Component
 * مكون CSS مخصص آمن
 *
 * Sanitizes CSS to prevent XSS attacks
 */
interface SafeCustomCSSProps {
  css: string;
}

const SafeCustomCSS: React.FC<SafeCustomCSSProps> = ({ css }) => {
  React.useEffect(() => {
    const styleId = 'kyctrust-custom-css';
    const existingElement = document.getElementById(styleId);

    if (!css) {
      if (existingElement) {
        existingElement.remove();
      }
      return;
    }

    const validation = validateCSSRules(css);
    if (!validation.isValid) {
      console.warn('🚨 Dangerous CSS detected and blocked:', validation.errors);
      if (existingElement) {
        existingElement.remove();
      }
      return;
    }

    const sanitizedCSS = sanitizeCSSCompletely(css);
    if (!sanitizedCSS) {
      if (existingElement) {
        existingElement.remove();
      }
      return;
    }

    let styleElement = existingElement as HTMLStyleElement | null;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = sanitizedCSS;

    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [css]);

  return null;
};

export default CustomElementsRenderer;
