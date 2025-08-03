/**
 * CSS Sanitizer - XSS Protection
 * مُطهر CSS - حماية من XSS
 * 
 * Sanitizes CSS to prevent XSS attacks through CSS injection
 */

/**
 * List of dangerous CSS properties and values
 * قائمة خصائص وقيم CSS الخطيرة
 */
const DANGEROUS_CSS_PROPERTIES = [
  'behavior',
  'binding',
  'expression',
  '-moz-binding',
  '-webkit-binding',
  'background-image',
  'list-style-image'
];

const DANGEROUS_CSS_VALUES = [
  'javascript:',
  'vbscript:',
  'data:',
  'expression',
  'behavior',
  'binding',
  '@import',
  'url(',
  'eval(',
  'script'
];

const DANGEROUS_CSS_FUNCTIONS = [
  'url',
  'calc',
  'attr',
  'var'
];

/**
 * Sanitize CSS content to prevent XSS
 * تطهير محتوى CSS لمنع XSS
 */
export const sanitizeCSS = (css: string): string => {
  if (!css || typeof css !== 'string') {
    return '';
  }

  let sanitized = css;

  // Remove dangerous properties
  DANGEROUS_CSS_PROPERTIES.forEach(prop => {
    const regex = new RegExp(`${prop}\\s*:.*?;`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  // Remove dangerous values and functions
  DANGEROUS_CSS_VALUES.forEach(value => {
    const regex = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  // Remove dangerous CSS functions with special handling
  DANGEROUS_CSS_FUNCTIONS.forEach(func => {
    // More specific regex for functions
    const regex = new RegExp(`${func}\\s*\\([^\\)]*\\)`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  // Remove @import statements
  sanitized = sanitized.replace(/@import\s+[^;]+;/gi, '');

  // Remove @charset statements
  sanitized = sanitized.replace(/@charset\s+[^;]+;/gi, '');

  // Remove comments that might contain malicious code
  sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove any remaining javascript: or similar protocols
  sanitized = sanitized.replace(/(javascript|vbscript|data|about):/gi, '');

  // Remove HTML entities that might be used for evasion
  sanitized = sanitized.replace(/&[#\w]+;/g, '');

  // Remove any script tags if somehow present
  sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Remove any style tags if somehow present
  sanitized = sanitized.replace(/<style[\s\S]*?<\/style>/gi, '');

  // Clean up any remaining dangerous patterns
  sanitized = sanitized.replace(/[<>'"]/g, '');

  return sanitized.trim();
};

/**
 * Validate CSS rules to ensure they're safe
 * التحقق من قواعد CSS للتأكد من أنها آمنة
 */
export const validateCSSRules = (css: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!css) {
    return { isValid: true, errors: [] };
  }

  // Check for dangerous properties
  DANGEROUS_CSS_PROPERTIES.forEach(prop => {
    if (css.toLowerCase().includes(prop)) {
      errors.push(`خاصية CSS خطيرة محظورة: ${prop}`);
    }
  });

  // Check for dangerous values
  DANGEROUS_CSS_VALUES.forEach(value => {
    if (css.toLowerCase().includes(value.toLowerCase())) {
      errors.push(`قيمة CSS خطيرة محظورة: ${value}`);
    }
  });

  // Check for script injection attempts
  if (/<script/i.test(css)) {
    errors.push('محاولة حقن script محظورة');
  }

  // Check for style injection attempts
  if (/<style/i.test(css)) {
    errors.push('محاولة حقن style محظورة');
  }

  // Check for HTML entities
  if (/&[#\w]+;/.test(css)) {
    errors.push('HTML entities محظورة في CSS');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Safe CSS property whitelist
 * قائمة بيضاء آمنة لخصائص CSS
 */
const SAFE_CSS_PROPERTIES = [
  'color',
  'background-color',
  'font-size',
  'font-family',
  'font-weight',
  'text-align',
  'margin',
  'padding',
  'border',
  'border-radius',
  'width',
  'height',
  'max-width',
  'max-height',
  'min-width',
  'min-height',
  'display',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'z-index',
  'opacity',
  'transform',
  'transition',
  'animation',
  'box-shadow',
  'text-shadow',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'text-decoration',
  'text-transform',
  'vertical-align',
  'white-space',
  'overflow',
  'cursor',
  'user-select'
];

/**
 * Filter CSS to only allow safe properties
 * تصفية CSS للسماح بالخصائص الآمنة فقط
 */
export const filterSafeCSS = (css: string): string => {
  if (!css) return '';

  try {
    // Simple CSS parser - split by rules
    const rules = css.split('}').filter(rule => rule.trim());
    const safeRules: string[] = [];

    rules.forEach(rule => {
      if (!rule.includes('{')) return;

      const [selector, declarations] = rule.split('{');
      if (!selector || !declarations) return;

      // Validate selector is safe (basic validation)
      const safeSelectorPattern = /^[a-zA-Z0-9\s.#\-:,>+~[\]"'=]*$/;
      if (!safeSelectorPattern.test(selector.trim())) return;

      // Filter declarations
      const safeDeclarations: string[] = [];
      const declarationList = declarations.split(';').filter(d => d.trim());

      declarationList.forEach(declaration => {
        const [property, value] = declaration.split(':');
        if (!property || !value) return;

        const cleanProperty = property.trim().toLowerCase();
        const cleanValue = value.trim();

        // Check if property is in whitelist
        if (SAFE_CSS_PROPERTIES.includes(cleanProperty)) {
          // Additional validation for values
          if (!DANGEROUS_CSS_VALUES.some(dangerous => 
            cleanValue.toLowerCase().includes(dangerous.toLowerCase())
          )) {
            safeDeclarations.push(`${cleanProperty}: ${cleanValue}`);
          }
        }
      });

      if (safeDeclarations.length > 0) {
        safeRules.push(`${selector.trim()} { ${safeDeclarations.join('; ')} }`);
      }
    });

    return safeRules.join('\n');
  } catch (error) {
    console.warn('خطأ في تصفية CSS:', error);
    return '';
  }
};

/**
 * Complete CSS sanitization pipeline
 * خط أنابيب تطهير CSS الكامل
 */
export const sanitizeCSSCompletely = (css: string): string => {
  if (!css) return '';

  // Step 1: Basic sanitization
  let sanitized = sanitizeCSS(css);

  // Step 2: Filter to safe properties only
  sanitized = filterSafeCSS(sanitized);

  // Step 3: Final cleanup
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
};

export default {
  sanitizeCSS,
  validateCSSRules,
  filterSafeCSS,
  sanitizeCSSCompletely,
  SAFE_CSS_PROPERTIES,
  DANGEROUS_CSS_PROPERTIES,
  DANGEROUS_CSS_VALUES
};
