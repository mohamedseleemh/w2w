import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Shield, ArrowRight,
  Clock, Zap, Menu, X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useCustomization } from '../context/CustomizationContext';
import { useTranslation } from '../utils/translations';
import { landingPageService, type LandingPageSection } from '../services/landingPageService';
import OrderModal from './modals/OrderModal';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';
import ServicesShowcase from './modals/ServicesShowcase';
import ThemeToggle from './ui/ThemeToggle';
import LanguageToggle from './ui/LanguageToggle';
import SEOOptimizer from './optimization/SEOOptimizer';
import PerformanceTracker from './optimization/PerformanceTracker';
import CustomElementsRenderer from './CustomElementsRenderer';

const LandingPageWithDatabase: React.FC = () => {
  // Hooks
  const { services, paymentMethods, siteSettings, loading, error, refreshData } = useData();
  const { language } = useTheme();
  const { customization } = useCustomization();
  useTranslation(language);

  // State
  const [selectedService, setSelectedService] = useState<{name: string, price: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [landingSections, setLandingSections] = useState<LandingPageSection[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);

  // Load landing page sections from database
  useEffect(() => {
    const loadSections = async () => {
      try {
        setSectionsLoading(true);
        const sections = await landingPageService.getLandingPageSections();
        setLandingSections(sections.filter(section => section.visible));
      } catch (error) {
        console.error('Error loading landing sections:', error);
        // Fallback to empty array - original LandingPage will show default content
        setLandingSections([]);
      } finally {
        setSectionsLoading(false);
      }
    };

    loadSections();
  }, []);

  // Memoized data
  const activeServices = useMemo(() => 
    services.filter(service => service.active).sort((a, b) => a.order - b.order),
    [services]
  );

  const activePaymentMethods = useMemo(() => 
    paymentMethods.filter(method => method.active),
    [paymentMethods]
  );

  const featuredServices = useMemo(() =>
    activeServices.slice(0, 12),
    [activeServices]
  );

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Service selection handlers
  const handleServiceSelect = useCallback((service: { name: string; price: { toString: () => string; }; }) => {
    setSelectedService({ name: service.name, price: service.price.toString() });
    setIsModalOpen(true);
  }, []);

  const handleWhatsAppContact = useCallback((service?: { name: string; }) => {
    const message = service 
      ? `مرحباً، أود الاستفسار عن خدمة: ${service.name}`
      : 'مرحباً، أود الاستفسار عن خدماتكم';
    
    const whatsappNumber = siteSettings?.company_phone?.replace(/\s+/g, '') || '+966501234567';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }, [siteSettings?.company_phone]);

  // Render section based on type
  const renderSection = (section: LandingPageSection) => {
    const sectionStyle = {
      background: section.styles.gradient || section.styles.background,
      padding: section.styles.padding,
      margin: section.styles.margin,
      borderRadius: section.styles.borderRadius,
      textAlign: section.styles.textAlign,
      minHeight: section.styles.minHeight,
      boxShadow: section.styles.shadow,
      border: section.styles.border,
    } as React.CSSProperties;

    const animationClass = section.animation?.type !== 'none' 
      ? `animate-${section.animation?.type}` 
      : '';

    switch (section.type) {
      case 'hero':
        return (
          <section 
            key={section.id}
            style={sectionStyle}
            className={`${animationClass} relative overflow-hidden`}
            id="home"
          >
            <div className="container mx-auto px-6 py-24">
              <div className="text-center">
                {section.content.title && (
                  <h1 className="text-5xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {section.content.title}
                    </span>
                  </h1>
                )}
                {section.content.subtitle && (
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    {section.content.subtitle}
                  </p>
                )}
                {section.content.buttonText && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => handleWhatsAppContact()}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {section.content.buttonText}
                      <ArrowRight className="inline-block mr-2 h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'services':
        return (
          <section 
            key={section.id}
            style={sectionStyle}
            className={`${animationClass} py-20`}
            id="services"
          >
            <div className="container mx-auto px-6">
              {section.content.title && (
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">{section.content.title}</h2>
                  {section.content.subtitle && (
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                      {section.content.subtitle}
                    </p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {service.price} {service.currency || '$'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {service.description}
                    </p>
                    
                    <button
                      onClick={() => handleServiceSelect(service)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      اطلب الخدمة الآن
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'features':
        return (
          <section 
            key={section.id}
            style={sectionStyle}
            className={`${animationClass} py-20`}
          >
            <div className="container mx-auto px-6">
              {section.content.title && (
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">{section.content.title}</h2>
                  {section.content.subtitle && (
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                      {section.content.subtitle}
                    </p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {section.content.items?.map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      {item.icon === 'zap' && <Zap className="h-8 w-8 text-white" />}
                      {item.icon === 'shield' && <Shield className="h-8 w-8 text-white" />}
                      {item.icon === 'clock' && <Clock className="h-8 w-8 text-white" />}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section 
            key={section.id}
            style={sectionStyle}
            className={`${animationClass} py-20`}
          >
            <div className="container mx-auto px-6 text-center">
              {section.content.title && (
                <h2 className="text-4xl font-bold mb-4 text-white">
                  {section.content.title}
                </h2>
              )}
              {section.content.subtitle && (
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  {section.content.subtitle}
                </p>
              )}
              {section.content.buttonText && (
                <button
                  onClick={() => handleWhatsAppContact()}
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {section.content.buttonText}
                  <ArrowRight className="inline-block mr-2 h-5 w-5" />
                </button>
              )}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  if (loading || sectionsLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <SEOOptimizer 
        title={siteSettings?.company_name || "KYCtrust - خدمات التحقق الرقمية"}
        description="منصة رائدة في خدمات التحقق الرقمية والخدمات المالية المتطورة"
        keywords="KYC, التحقق الرقمي, الخدمات المالية, الأمان الرقمي"
      />
      <PerformanceTracker />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 100 ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {siteSettings?.company_name || 'KYCtrust'}
              </span>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-reverse space-x-8">
              <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                الرئيسية
              </a>
              <a href="#services" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                الخدمات
              </a>
              <button
                onClick={() => setIsServicesOpen(true)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                عرض جميع الخدمات
              </button>
              <button
                onClick={() => handleWhatsAppContact()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                تواصل معنا
              </button>
              <ThemeToggle />
              <LanguageToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-reverse space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 space-y-4">
                <a href="#home" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  الرئيسية
                </a>
                <a href="#services" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  الخدمات
                </a>
                <button
                  onClick={() => {
                    setIsServicesOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  عرض جميع الخدمات
                </button>
                <button
                  onClick={() => {
                    handleWhatsAppContact();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  تواصل معنا
                </button>
                <LanguageToggle />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {landingSections.length > 0 ? (
          // Render database sections
          landingSections
            .sort((a, b) => a.order - b.order)
            .map(section => renderSection(section))
        ) : (
          // Fallback content if no sections or database fails
          <div className="pt-20">
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-24" id="home">
              <div className="container mx-auto px-6">
                <div className="text-center">
                  <h1 className="text-5xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {customization.hero.title}
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {customization.hero.titleGradient}
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    {customization.hero.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => handleWhatsAppContact()}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {customization.hero.button1Text}
                      <ArrowRight className="inline-block mr-2 h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setIsServicesOpen(true)}
                      className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200 dark:border-blue-800"
                    >
                      {customization.hero.button2Text}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Modals */}
      {isModalOpen && (
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
          paymentMethods={activePaymentMethods}
        />
      )}

      {isServicesOpen && (
        <ServicesShowcase
          isOpen={isServicesOpen}
          onClose={() => setIsServicesOpen(false)}
          services={activeServices}
          onServiceSelect={handleServiceSelect}
        />
      )}

      {/* Custom Elements Renderer */}
      <CustomElementsRenderer />
    </div>
  );
};

export default LandingPageWithDatabase;
