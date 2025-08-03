import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'service';
}

const SEOOptimizer: React.FC<SEOOptimizerProps> = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website'
}) => {
  const { siteSettings } = useData();
  const { language } = useTheme();

  const defaultTitle = siteSettings.title || 'KYCtrust - خدمات مالية رقمية موثوقة';
  const defaultDescription = siteSettings.description || 'نقدم خدمات مالية رقمية احترافية وآمنة لجميع المنصات العالمية مع ضمان الجودة والموثوقية';
  const defaultKeywords = [
    'خدمات مالية',
    'محافظ رقمية', 
    'تحويلات دولية',
    'KYC Trust',
    'PayPal',
    'Payoneer',
    'Wise',
    'فودافون كاش',
    'USDT',
    'العملات الرقمية',
    'التداول',
    'الخدمات المصرفية'
  ];

  const siteTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const siteDescription = description || defaultDescription;
  const siteKeywords = [...defaultKeywords, ...keywords].join(', ');
  const siteUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const siteImage = image || '/og-image.png';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KYCtrust",
    "description": siteDescription,
    "url": "https://kyctrust.com",
    "logo": "https://kyctrust.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteSettings.whatsappNumber || "+201062453344",
      "contactType": "customer service",
      "availableLanguage": ["Arabic", "English"]
    },
    "sameAs": [
      "https://wa.me/201062453344"
    ],
    "serviceType": "Digital Financial Services",
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Financial Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "PayPal Account Creation",
            "description": "Professional PayPal account setup and verification"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Payoneer Account Creation",
            "description": "International money transfer account setup"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Wise Account Creation",
            "description": "Multi-currency account for international transfers"
          }
        }
      ]
    }
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Update document title
    document.title = siteTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', siteDescription);
    updateMetaTag('keywords', siteKeywords);
    updateMetaTag('author', 'KYCtrust Team');
    updateMetaTag('language', language);
    updateMetaTag('robots', 'index, follow');

    // Open Graph tags
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:title', siteTitle, true);
    updateMetaTag('og:description', siteDescription, true);
    updateMetaTag('og:image', siteImage, true);
    updateMetaTag('og:url', siteUrl, true);
    updateMetaTag('og:site_name', 'KYCtrust', true);
    updateMetaTag('og:locale', language === 'ar' ? 'ar_EG' : 'en_US', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', siteTitle);
    updateMetaTag('twitter:description', siteDescription);
    updateMetaTag('twitter:image', siteImage);

    // Theme color
    updateMetaTag('theme-color', '#3B82F6');

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', siteUrl);

    // Add structured data
    let structuredDataScript = document.querySelector('#structured-data');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

  }, [siteTitle, siteDescription, siteKeywords, siteUrl, siteImage, type, language, structuredData]);

  return null;
};

export default SEOOptimizer;
