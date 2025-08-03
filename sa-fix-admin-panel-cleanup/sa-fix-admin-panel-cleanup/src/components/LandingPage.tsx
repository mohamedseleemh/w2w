import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Shield, CheckCircle, CreditCard, MessageCircle, Star, ArrowRight, 
  Clock, Users, Award, Zap, Globe, Heart,
  Sparkles, Phone, Mail, Menu, X, Rocket, Target,
  ChevronDown, CheckSquare, Eye
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useCustomization } from '../context/CustomizationContext';
import { useTranslation } from '../utils/translations';
import OrderModal from './modals/OrderModal';
import ErrorMessage from './ui/ErrorMessage';
import ServicesShowcase from './modals/ServicesShowcase';
import ThemeToggle from './ui/ThemeToggle';
import LanguageToggle from './ui/LanguageToggle';
import CounterAnimation from './animations/CounterAnimation';
import SEOOptimizer from './optimization/SEOOptimizer';
import PerformanceTracker from './optimization/PerformanceTracker';
import CustomElementsRenderer from './CustomElementsRenderer';

const LandingPage: React.FC = () => {
  // Hooks
  const { services, paymentMethods, siteSettings, error, refreshData } = useData();
  const { theme, language } = useTheme();
  const { customization } = useCustomization();
  useTranslation(language);

  // State
  const [selectedService, setSelectedService] = useState<{name: string, price: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

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
    activeServices.slice(0, 12), // Show up to 12 services instead of 6
    [activeServices]
  );

  // Enhanced testimonials data with full translations
  const testimonials = useMemo(() => language === 'ar' ? [
    {
      id: 1,
      name: 'أحمد محمد',
      role: 'مدير أ��مال',
      avatar: '👨‍💼',
      rating: 5,
      comment: 'خدمة ممتازة وسريعة، تم إنجاز طلبي في أقل من 5 دقائق. أنصح بشدة بالتعامل مع KYCtrust.',
      date: '2024-11-15',
      verified: true
    },
    {
      id: 2,
      name: 'فاطمة السالم',
      role: 'مؤسسة شركة',
      avatar: '👩‍💼',
      rating: 5,
      comment: 'أفضل منصة للخدمات المالية، دعم فني ممتاز وأسعار مناسبة جداً.',
      date: '2024-11-10',
      verified: true
    },
    {
      id: 3,
      name: 'خالد العلي',
      role: 'طالب جامعي',
      avatar: '👨‍🎓',
      rating: 5,
      comment: 'سهولة في الاستخدام وأمان عالي، تعاملت معهم عدة ��رات ول�� أواجه أي مشكلة.',
      date: '2024-11-08',
      verified: true
    }
  ] : [
    {
      id: 1,
      name: 'Ahmed Mohamed',
      role: 'Business Manager',
      avatar: '👨‍💼',
      rating: 5,
      comment: 'Excellent and fast service, my order was completed in less than 5 minutes. I highly recommend dealing with KYCtrust.',
      date: '2024-11-15',
      verified: true
    },
    {
      id: 2,
      name: 'Fatima Al-Salem',
      role: 'Company Founder',
      avatar: '👩‍💼',
      rating: 5,
      comment: 'Best platform for financial services, excellent technical support and very reasonable prices.',
      date: '2024-11-10',
      verified: true
    },
    {
      id: 3,
      name: 'Khalid Al-Ali',
      role: 'University Student',
      avatar: '👨‍🎓',
      rating: 5,
      comment: 'Easy to use with high security, I have dealt with them several times and never faced any problems.',
      date: '2024-11-08',
      verified: true
    }
  ], [language]);

  // Enhanced stats data with translations
  const stats = useMemo(() => [
    { 
      value: 15000, 
      label: language === 'ar' ? 'عميل راضٍ' : 'Satisfied Clients',
      icon: Users,
      prefix: '+',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      value: 99.9, 
      label: language === 'ar' ? 'معدل النجاح' : 'Success Rate',
      icon: Target,
      suffix: '%',
      color: 'from-green-500 to-green-600'
    },
    { 
      value: 24, 
      label: language === 'ar' ? 'دعم متواصل' : '24/7 Support',
      icon: Clock,
      suffix: '/7',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      value: 5, 
      label: language === 'ar' ? 'متوسط وقت الإنجاز' : 'Avg. Completion Time',
      icon: Zap,
      suffix: language === 'ar' ? ' دقائق' : ' minutes',
      color: 'from-orange-500 to-orange-600'
    }
  ], [language]);

  // Enhanced features data with translations
  const features = useMemo(() => [
    {
      icon: Shield,
      title: language === 'ar' ? 'أمان متقدم' : 'Advanced Security',
      description: language === 'ar' 
        ? 'تشفير مت��دم وحماية شاملة لجميع معاملاتك المالية' 
        : 'Advanced encryption and comprehensive protection for all your financial transactions',
      color: 'from-blue-500 to-blue-600',
      benefits: language === 'ar' 
        ? ['تشفير من الدرجة البنكية', 'حماية البيانات الشخصية', 'مراقبة أمنية 24/7']
        : ['Bank-grade encryption', 'Personal data protection', '24/7 security monitoring']
    },
    {
      icon: Zap,
      title: language === 'ar' ? 'سرعة البرق' : 'Lightning Speed',
      description: language === 'ar' 
        ? 'معالجة فورية للطلبات في أقل من 5 دقائق' 
        : 'Instant processing of requests in less than 5 minutes',
      color: 'from-yellow-500 to-yellow-600',
      benefits: language === 'ar' 
        ? ['إنجاز فوري للطل��ات', 'معالجة سريعة للدفعات', 'دعم فني فوري']
        : ['Instant order completion', 'Fast payment processing', 'Immediate technical support']
    },
    {
      icon: Award,
      title: language === 'ar' ? 'موثوقية عالي��' : 'High Reliability',
      description: language === 'ar' 
        ? 'ضمان الجودة وإرجاع الأموال في حالة عد�� الرضا' 
        : 'Quality guarantee and money back in case of dissatisfaction',
      color: 'from-green-500 to-green-600',
      benefits: language === 'ar' 
        ? ['ضمان على جميع الخدمات', 'فريق دعم محترف', 'خبرة أكثر من 5 سنوات']
        : ['Guarantee on all services', 'Professional support team', 'Over 5 years of experience']
    },
    {
      icon: Globe,
      title: language === 'ar' ? 'تغطية عالمية' : 'Global Coverage',
      description: language === 'ar' 
        ? 'خدماتنا متاحة في أكثر من 150 دولة حول العالم' 
        : 'Our services are available in more than 150 countries worldwide',
      color: 'from-purple-500 to-purple-600',
      benefits: language === 'ar' 
        ? ['دعم متعدد القارات', 'عملات متنوعة', 'شراكات عالمية']
        : ['Multi-continental support', 'Multiple currencies', 'Global partnerships']
    }
  ], [language]);

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Update active section based on scroll position
      const sections = ['home', 'services', 'features', 'testimonials', 'faq'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // Listen for page published events
  useEffect(() => {
    const handlePagePublished = () => {
      // Page published, refreshing data
      refreshData();
      // Optionally show a toast
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };

    window.addEventListener('pagePublished', handlePagePublished);
    return () => window.removeEventListener('pagePublished', handlePagePublished);
  }, [refreshData]);

  // Apply global CSS variables from customization
  useEffect(() => {
    if (customization?.globalSettings) {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', customization.globalSettings.primaryColor);
      root.style.setProperty('--secondary-color', customization.globalSettings.secondaryColor);
      root.style.setProperty('--accent-color', customization.globalSettings.accentColor);
      root.style.setProperty('--font-family', customization.globalSettings.fontFamily);
      root.style.setProperty('--border-radius', customization.globalSettings.borderRadius);
      root.style.setProperty('--spacing', customization.globalSettings.spacing);
    }
  }, [customization]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  }, []);

  // Handle service order
  const handleOrderService = useCallback((serviceName: string) => {
    const service = activeServices.find(s => s.name === serviceName);
    if (service) {
      setSelectedService({name: serviceName, price: service.price});
      setIsModalOpen(true);
    }
  }, [activeServices]);

  // Show error state but don't block UI for loading since we have default data
  if (error && services.length === 0) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  const heroData = customization?.hero || {
    title: language === 'ar' ? 'المستقبل الرقمي' : 'Digital Future',
    titleGradient: language === 'ar' ? 'للخدمات المالية' : 'Financial Services',
    subtitle: language === 'ar'
      ? 'نحن الرواد في الخدمات المالية الرقمية، نقدم حلولاً مبتكرة وآمنة تلبي جميع احتياجاتك المالية بسرعة وموثوقية عالية مع ضمان الجودة'
      : 'We are pioneers in digital financial services, providing innovative and secure solutions that meet all your financial needs quickly and reliably with quality guarantee',
    button1Text: language === 'ar' ? 'ابدأ رحلتك معنا' : 'Start Your Journey',
    badgeText: language === 'ar' ? 'منصة موثوقة ومعتمدة في الخدمات المالية' : 'Trusted and certified platform for financial services',
    showStats: true,
    statsData: {
      clients: '15,000+',
      successRate: '99.9%',
      support: '24/7',
      speed: language === 'ar' ? '< 5 دقائق' : '< 5 min'
    }
  };

  return (
    <>
      <SEOOptimizer
        title={language === 'ar' ? 'الصفحة الرئيسية' : 'Home'}
        description={siteSettings.description}
        keywords={['digital wallets', 'financial services', 'paypal', 'payoneer', 'wise', 'crypto']}
      />
      <PerformanceTracker />

      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Enhanced Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 100 
          ? `backdrop-blur-md border-b ${theme === 'dark' ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'}`
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  KYCtrust
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'ar' ? 'منصة موثوقة' : 'Trusted Platform'}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-reverse space-x-8">
              {[
                { id: 'home', label: language === 'ar' ? 'الرئيسية' : 'Home' },
                { id: 'services', label: language === 'ar' ? 'الخدمات' : 'Services' },
                { id: 'features', label: language === 'ar' ? 'المميزات' : 'Features' },
                { id: 'testimonials', label: language === 'ar' ? 'آراء العملاء' : 'Testimonials' },
                { id: 'faq', label: language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-blue-600'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-reverse space-x-4">
              <ThemeToggle />
              <LanguageToggle />
              
              {/* CTA Button */}
              <button
                onClick={() => scrollToSection('services')}
                className="hidden lg:flex items-center space-x-reverse space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Rocket className="h-4 w-4" />
                <span>{language === 'ar' ? 'ا��دأ الآن' : 'Start Now'}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden border-t ${
            theme === 'dark' 
              ? 'bg-gray-900/95 border-gray-700 backdrop-blur-md' 
              : 'bg-white/95 border-gray-200 backdrop-blur-md'
          }`}>
            <div className="px-4 py-6 space-y-4">
              {[
                { id: 'home', label: language === 'ar' ? 'الرئيسية' : 'Home' },
                { id: 'services', label: language === 'ar' ? 'الخدمات' : 'Services' },
                { id: 'features', label: language === 'ar' ? 'المميزات' : 'Features' },
                { id: 'testimonials', label: language === 'ar' ? 'آراء العملاء' : 'Testimonials' },
                { id: 'faq', label: language === 'ar' ? 'الأسئلة الشائ��ة' : 'FAQ' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-${language === 'ar' ? 'right' : 'left'} py-3 px-4 rounded-lg font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <button
                onClick={() => scrollToSection('services')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-reverse space-x-2"
              >
                <Rocket className="h-4 w-4" />
                <span>{language === 'ar' ? 'اب��أ الآن' : 'Start Now'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-indigo-900/20' 
              : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
          }`} />
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className={`inline-flex items-center px-6 py-3 backdrop-blur-sm border rounded-full font-semibold ${
              theme === 'dark' 
                ? 'bg-gray-800/80 border-blue-500/50 text-blue-300' 
                : 'bg-white/80 border-blue-200/50 text-blue-700'
            }`}>
              <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
              <span>{heroData.badgeText}</span>
            </div>

            {/* Title */}
            <div>
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="block">{heroData.title}</span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {heroData.titleGradient}
                </span>
              </h1>
              
              <p className={`text-lg md:text-xl leading-relaxed max-w-4xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {heroData.subtitle}
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-200/20">
                <div className="flex items-center space-x-reverse space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {language === 'ar' ? 'ضمان الأمان' : 'Security Guaranteed'}
                  </span>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {language === 'ar' ? 'تنفيذ فوري' : 'Instant Execution'}
                  </span>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <Award className="h-5 w-5 text-orange-500" />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {language === 'ar' ? 'جودة مضمونة' : 'Quality Assured'}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <button
                onClick={() => scrollToSection('services')}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
              >
                <span>{heroData.button1Text}</span>
                <ArrowRight className={`h-5 w-5 group-hover:translate-x-${language === 'ar' ? '-' : ''}1 transition-transform`} />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
              <div className="flex items-center space-x-reverse space-x-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(65 + i - 1)}
                    </div>
                  ))}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="font-semibold">15,000+</span> {language === 'ar' ? 'عميل راضٍ' : 'satisfied clients'}
                </div>
              </div>
              
              <div className="flex items-center space-x-reverse space-x-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
                <span className={`text-sm font-semibold ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  4.9/5
                </span>
              </div>
            </div>

            {/* Enhanced Stats Row */}
            {heroData.showStats && (
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className={`text-center p-6 rounded-2xl backdrop-blur-sm border ${
                    theme === 'dark' 
                      ? 'bg-gray-800/30 border-gray-700/30' 
                      : 'bg-white/30 border-gray-200/30'
                  }`}>
                    <div className="flex justify-center mb-3">
                      <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className={`text-2xl md:text-3xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      <CounterAnimation
                        end={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection('services')}
            className={`p-3 rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-800/50 text-gray-400 hover:text-white' 
                : 'bg-white/50 text-gray-600 hover:text-gray-900'
            } backdrop-blur-sm border border-gray-200/30 hover:border-gray-300/50 transition-all duration-300`}
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className={`py-20 ${
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6">
              <CreditCard className="h-4 w-4 text-blue-600 ml-2" />
              <span className="text-blue-600 font-medium text-sm">
                {language === 'ar' ? 'خدماتنا' : 'Our Services'}
              </span>
            </div>
            
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'ar' ? (
                <>خدمات <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  مالية احترافية
                </span></>
              ) : (
                <>Professional <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Financial Services
                </span></>
              )}
            </h2>
            
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {language === 'ar'
                ? 'نقدم مجموعة شاملة من الخدمات المالية الرقمية المتطورة بضمان الجودة والأمان والتنفيذ السريع'
                : 'We provide a comprehensive range of advanced digital financial services with guaranteed quality, security and fast execution'
              }
            </p>
          </div>



          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredServices.length > 0 ? featuredServices.map((service) => (
              <div
                key={service.id}
                className={`group relative p-8 rounded-3xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700/50 hover:border-blue-500/50'
                    : 'bg-white/50 border-gray-200/50 hover:border-blue-300/50'
                } backdrop-blur-sm`}
                onClick={() => handleOrderService(service.name)}
              >
                {/* Service Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Service Content */}
                <div className="space-y-4">
                  <h3 className={`text-xl font-bold group-hover:text-blue-600 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {service.name}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {language === 'ar'
                      ? 'خدمة مالية احترافية وآمنة مع ضمان الجودة والتنفيذ السريع'
                      : 'Professional and secure financial service with quality guarantee and fast execution'
                    }
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/20">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        {service.price}
                      </span>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {language === 'ar' ? ' / خدمة' : ' / service'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-reverse space-x-1">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 pt-4">
                    {(language === 'ar' ? ['تنفيذ فوري', 'أمان عالي', 'دعم 24/7'] : ['Instant execution', 'High security', '24/7 support']).map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-reverse space-x-2">
                        <CheckSquare className="h-4 w-4 text-green-500" />
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp Order Button */}
                  <div className="pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const whatsappNumber = siteSettings?.whatsappNumber || '+966501234567';
                        const message = language === 'ar'
                          ? `السلا�� عليكم، أريد طلب خدمة ${service.name} بسعر ${service.price}`
                          : `Hello, I would like to order ${service.name} service for ${service.price}`;
                        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-reverse space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{language === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}</span>
                    </button>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <CreditCard className={`h-16 w-16 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {language === 'ar' ? 'لا توجد خدمات متاحة ح��لياً' : 'No services available at the moment'}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsServicesOpen(true)}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
            >
              <span>{language === 'ar' ? 'عرض جميع الخدمات' : 'View All Services'}</span>
              <Eye className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => {
                const whatsappNumber = siteSettings?.whatsappNumber || '+966501234567';
                const message = language === 'ar'
                  ? '��لسلام عليكم، أريد الاستفسار عن الخدمات المتاحة وأسعارها'
                  : 'Hello, I would like to inquire about available services and their prices';
                const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
            >
              <span>{language === 'ar' ? 'استفسر عبر واتساب' : 'Inquire via WhatsApp'}</span>
              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-purple-600 ml-2" />
              <span className="text-purple-600 font-medium text-sm">
                {language === 'ar' ? 'مميزاتنا' : 'Our Features'}
              </span>
            </div>
            
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'ar' ? (
                <>لماذا <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  نحن الأفضل؟
                </span></>
              ) : (
                <>Why Are We <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  The Best?
                </span></>
              )}
            </h2>
            
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {language === 'ar' 
                ? 'نجمع بين الأمان والسرعة والموثوقية لنقدم لك أفضل تجربة في الخدمات المالية'
                : 'We combine security, speed and reliability to provide you with the best experience in financial services'
              }
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group p-8 rounded-3xl border transition-all duration-500 hover:shadow-2xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800/30 border-gray-700/30' 
                    : 'bg-white/30 border-gray-200/30'
                } backdrop-blur-sm`}
              >
                {/* Feature Icon */}
                <div className="flex items-start space-x-reverse space-x-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h3>
                    
                    <p className={`text-sm leading-relaxed mb-6 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>

                    {/* Benefits List */}
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-reverse space-x-3">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`} />
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className={`py-20 ${
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full mb-6">
              <Heart className="h-4 w-4 text-green-600 ml-2" />
              <span className="text-green-600 font-medium text-sm">
                {language === 'ar' ? 'آراء العملاء' : 'Client Reviews'}
              </span>
            </div>
            
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'ar' ? (
                <>ماذا يقول <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  عملاؤنا؟
                </span></>
              ) : (
                <>What Do Our <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Clients Say?
                </span></>
              )}
            </h2>
            
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {language === 'ar' 
                ? 'تجارب حقيقية من عملائنا الكرام حول جودة خدماتنا'
                : 'Real experiences from our valued customers about the quality of our services'
              }
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`group p-8 rounded-3xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700/50' 
                    : 'bg-white/50 border-gray-200/50'
                } backdrop-blur-sm relative`}
              >
                {/* Quote Icon */}
                <div className="absolute top-6 left-6 opacity-20">
                  <MessageCircle className="h-12 w-12 text-blue-600" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-reverse space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className={`text-lg leading-relaxed mb-6 relative z-10 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  "{testimonial.comment}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200/20">
                  <div className="flex items-center space-x-reverse space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-reverse space-x-2">
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {testimonial.name}
                        </h4>
                        {testimonial.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {new Date(testimonial.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className={`inline-flex items-center px-6 py-3 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
            } backdrop-blur-sm border border-gray-200/30 mb-6`}>
              <div className="flex -space-x-2 ml-4">
                {testimonials.slice(0, 3).map((t, i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
                    {t.avatar}
                  </div>
                ))}
              </div>
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {language === 'ar' 
                  ? 'انضم إلى +15,000 عميل راضٍ'
                  : 'Join +15,000 satisfied clients'
                }
              </span>
            </div>
            
            <button
              onClick={() => scrollToSection('services')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {language === 'ar' ? 'ابدأ تجربتك الآن' : 'Start Your Experience Now'}
            </button>
          </div>
        </div>
      </section>

      {/* Custom Elements */}
      <CustomElementsRenderer />

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-full mb-6">
              <Clock className="h-4 w-4 text-orange-600 ml-2" />
              <span className="text-orange-600 font-medium text-sm">
                {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
              </span>
            </div>
            
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'ar' ? (
                <>أجوبة على <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  أسئلتك
                </span></>
              ) : (
                <>Answers to Your <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Questions
                </span></>
              )}
            </h2>
            
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {language === 'ar' 
                ? 'إجابات سريعة على الأسئلة الأكثر شيوعاً حول خدماتنا'
                : 'Quick answers to the most frequently asked questions about our services'
              }
            </p>
          </div>

          <div className="space-y-6">
            {(language === 'ar' ? [
              {
                q: 'كم يستغرق تنفيذ ��لطلب؟',
                a: 'معظم طلباتنا يتم ت��فيذها خلال 5 دقائق أو أقل. بعض الخ���مات قد تحتاج إلى وقت أطول قليلاً حسب التعقيد.'
              },
              {
                q: 'هل خدماتكم آمنة؟',
                a: 'نعم، نحن نستخدم أعلى معايير الأمان والتشفير. جميع البيانات محمية ولا نحتفظ بأي معلومات حساسة.'
              },
              {
                q: '��ا ��ي طرق الدفع المتاحة؟',
                a: 'نقبل الدفع عبر فودافون كاش، USDT، وطرق دفع أخرى. يمكنك مراجعة جميع الطرق المتاحة في قسم طرق الدفع.'
              },
              {
                q: 'هل تقدمون ضمان ع��ى الخدمات؟',
                a: 'نعم، نحن نقدم ضمان استرداد الأموال في حالة عدم تنفيذ الخدمة كما هو متفق عليه.'
              },
              {
                q: 'كيف يمكنني التواصل مع الد��م؟',
                a: 'يمكنك التواصل معنا عبر واتساب على مدار 24/7، أو من خلال نموذج التواصل في الموقع.'
              }
            ] : [
              {
                q: 'How long does it take to complete an order?',
                a: 'Most of our orders are completed within 5 minutes or less. Some services may take a little longer depending on complexity.'
              },
              {
                q: 'Are your services secure?',
                a: 'Yes, we use the highest security and encryption standards. All data is protected and we do not store any sensitive information.'
              },
              {
                q: 'What payment methods are available?',
                a: 'We accept payment via Vodafone Cash, USDT, and other payment methods. You can review all available methods in the payment methods section.'
              },
              {
                q: 'Do you provide a guarantee on services?',
                a: 'Yes, we provide a money-back guarantee if the service is not executed as agreed.'
              },
              {
                q: 'How can I contact support?',
                a: 'You can contact us via WhatsApp 24/7, or through the contact form on the website.'
              }
            ]).map((faq, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700/50 hover:border-orange-500/50' 
                    : 'bg-white/50 border-gray-200/50 hover:border-orange-300/50'
                } backdrop-blur-sm`}
              >
                <h3 className={`text-lg font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {faq.q}
                </h3>
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'ar' ? 'لم تجد إجابة لسؤالك؟' : "Didn't find an answer to your question?"}
            </p>
            <button
              onClick={() => {
                const whatsappNumber = siteSettings?.whatsappNumber || '+966501234567';
                const message = language === 'ar' ? 'السلام عليكم، لدي سؤال حول خدماتكم' : 'Hello, I have a question about your services';
                const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-2 mx-auto"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{language === 'ar' ? 'تواصل معنا عبر ��اتساب' : 'Contact us via WhatsApp'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className={`py-16 border-t ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-reverse space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    KYCtrust
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'ar' ? 'منصة الخدمات المالية الموثوقة' : 'Trusted Financial Services Platform'}
                  </p>
                </div>
              </div>
              
              <p className={`text-sm leading-relaxed mb-6 max-w-md ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'ar' 
                  ? 'نحن نقدم خدمات مالية رقمية آمنة وموثوقة مع أعلى معايير الجود�� والحماية لعملائنا الكرام.'
                  : 'We provide secure and reliable digital financial services with the highest standards of quality and protection for our valued customers.'
                }
              </p>
              
              <div className="flex space-x-reverse space-x-4">
                {activePaymentMethods.slice(0, 4).map((method) => (
                  <div
                    key={method.id}
                    className={`w-12 h-8 rounded flex items-center justify-center text-xs font-bold ${
                      theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                    } border border-gray-200 dark:border-gray-700`}
                  >
                    {method.name.substring(0, 3).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className={`font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
              </h4>
              <div className="space-y-4">
                {[
                  { label: language === 'ar' ? 'الخدمات' : 'Services', action: () => scrollToSection('services') },
                  { label: language === 'ar' ? 'المميزات' : 'Features', action: () => scrollToSection('features') },
                  { label: language === 'ar' ? 'آراء العملاء' : 'Testimonials', action: () => scrollToSection('testimonials') },
                  { label: language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', action: () => scrollToSection('faq') }
                ].map((link, index) => (
                  <button
                    key={index}
                    onClick={link.action}
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className={`font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-reverse space-x-3">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    +966 50 123 4567
                  </span>
                </div>
                <div className="flex items-center space-x-reverse space-x-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    support@kyctrust.com
                  </span>
                </div>
                <div className="flex items-center space-x-reverse space-x-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'ar' ? '24/7 دعم فني' : '24/7 Technical Support'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 KYCtrust. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </div>
            
            <div className="flex items-center space-x-reverse space-x-6 text-sm">
              <a href="#" className={`hover:text-blue-600 transition-colors ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              <a href="#" className={`hover:text-blue-600 transition-colors ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}
              </a>
              <a href="#" className={`hover:text-blue-600 transition-colors ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'ar' ? 'المساعدة' : 'Help'}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isModalOpen && selectedService && (
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          serviceName={selectedService.name}
          servicePrice={selectedService.price}
        />
      )}

      {isServicesOpen && (
        <ServicesShowcase
          isOpen={isServicesOpen}
          onClose={() => setIsServicesOpen(false)}
          onSelectService={handleOrderService}
        />
      )}

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => {
            const whatsappNumber = siteSettings?.whatsappNumber || '+966501234567';
            const message = language === 'ar' ? 'السلام عل��كم، أريد الاستفسار عن ��دماتكم' : 'Hello, I would like to inquire about your services';
            const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
          className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 animate-pulse"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Back to Top Button */}
      {scrollY > 500 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 hover:text-white' 
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            <ChevronDown className="h-5 w-5 transform rotate-180" />
          </button>
        </div>
      )}
      </div>
    </>
  );
};

export default LandingPage;
