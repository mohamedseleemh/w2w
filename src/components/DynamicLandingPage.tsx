import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, CheckCircle, CreditCard, MessageCircle, Star, ArrowRight, 
  Clock, Users, Award, Zap, Globe, Heart, Sparkles, Phone, Mail, 
  Menu, X, Rocket, Target, ChevronDown, CheckSquare, Eye,
  PlayCircle, Download, Send, Facebook, Twitter, Instagram, Linkedin
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useCustomization } from '../context/CustomizationContext';
import OrderModal from './modals/OrderModal';
import SuperThemeToggle from './ui/SuperThemeToggle';
import SuperLanguageToggle from './ui/SuperLanguageToggle';
import CounterAnimation from './animations/CounterAnimation';
import SEOOptimizer from './optimization/SEOOptimizer';
import PerformanceTracker from './optimization/PerformanceTracker';
import { SuperButton } from './ui';
import EnhancedCard from './ui/EnhancedCard';
import WhatsAppButton from './ui/WhatsAppButton';
import toast from 'react-hot-toast';

// Load customizable content from localStorage or defaults
const loadPageContent = () => {
  try {
    const saved = localStorage.getItem('kyc-site-content');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading page content:', error);
  }

  // Default content structure
  return {
    hero: {
      title: 'KYCtrust - خدمات التحقق الرقمية المتطورة',
      subtitle: 'منصة رائدة في خدمات التحقق الرقمية والخدمات المالية المتطورة مع تقنيات حديثة وأمان عالي',
      buttonText: 'ابدأ الآن',
      secondaryButtonText: 'تعرف على المزيد',
      backgroundImage: '',
      backgroundOverlay: 'rgba(0, 0, 0, 0.4)',
      visible: true
    },
    navigation: {
      logo: 'KYCtrust',
      items: [
        { label: 'الرئيسية', url: '#home', active: true },
        { label: 'خدم��تنا', url: '#services', active: true },
        { label: 'من نحن', url: '#about', active: true },
        { label: 'آراء العملاء', url: '#testimonials', active: true },
        { label: 'تواصل معنا', url: '#contact', active: true }
      ]
    },
    about: {
      title: 'من نحن',
      subtitle: 'رواد في عا��م الخدمات المالية الرقمية',
      description: 'نحن منصة متطورة تقدم خدمات التحقق الرقمي والحلول المالية بأعلى معايير الأمان والجودة. نفخر بخدمة آلاف العملاء حول العالم.',
      features: [
        { title: 'أمان عالي', description: 'حماية متقدمة لبياناتك', icon: 'shield' },
        { title: 'سرعة في التنفيذ', description: 'معالجة فورية للطلبات', icon: 'zap' },
        { title: 'دعم فني 24/7', description: 'فريق دعم متاح دائماً', icon: 'clock' },
        { title: 'واجهات سهلة', description: 'تجربة مستخدم متميزة', icon: 'users' }
      ],
      visible: true
    },
    services: {
      title: 'خدماتنا المتميزة',
      subtitle: 'نقدم مجموعة شاملة من الخدمات المالية الرقمية المتطورة',
      displayStyle: 'grid', // grid, carousel, list
      showPrices: true,
      visible: true
    },
    stats: {
      title: 'أرقامنا تتحدث',
      items: [
        { label: 'عميل راضي', value: 10000, suffix: '+', icon: '👥', color: '#3B82F6' },
        { label: 'معاملة يومية', value: 5000, suffix: '+', icon: '💳', color: '#10B981' },
        { label: 'سنة خبرة', value: 15, suffix: '', icon: '⭐', color: '#F59E0B' },
        { label: 'دولة مخدومة', value: 25, suffix: '+', icon: '🌍', color: '#8B5CF6' }
      ],
      visible: true
    },
    testimonials: {
      title: 'ماذا يقول عملاؤنا',
      subtitle: 'تجارب حقيقية من عملائنا الكرام',
      items: [
        {
          name: 'أحمد محمد',
          role: 'رجل أعمال',
          text: 'خدمة ممتازة وسريعة، أنصح بها بشدة. فريق العمل محترف جداً',
          rating: 5,
          image: '',
          company: 'شركة التقنية المتقدمة'
        },
        {
          name: 'فاطمة علي',
          role: 'مديرة مشاريع',
          text: 'أفضل منصة للخدمات المالية الرقمية، أمان وسرعة لا مثيل لهما',
          rating: 5,
          image: '',
          company: 'مجموعة الابتكار'
        },
        {
          name: 'محمد خالد',
          role: 'مستثمر',
          text: 'تجربة رائعة، خدمة عملاء متميزة ون��ائ�� سريعة ومضمونة',
          rating: 5,
          image: '',
          company: 'صندوق الاستثمار'
        }
      ],
      visible: true
    },
    cta: {
      title: 'ابدأ رحلتك معنا اليوم',
      subtitle: 'انضم إلى آلاف العملاء الراضين واحصل على أفضل الخدمات المالية الرقمية',
      buttonText: 'ابدأ الآن',
      secondaryButtonText: 'تواصل معنا',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      visible: true
    },
    contact: {
      title: 'تواصل معنا',
      subtitle: 'نحن هنا لمساعدتك في أي وقت',
      address: 'الرياض، المملكة العربية السعودية',
      phone: '+201062453344',
      email: 'info@kyctrust.com',
      workingHours: 'الأحد - الخميس: 9:00 ص - 6:00 م',
      socialLinks: {
        twitter: 'https://twitter.com/kyctrust',
        linkedin: 'https://linkedin.com/company/kyctrust',
        facebook: 'https://facebook.com/kyctrust',
        instagram: 'https://instagram.com/kyctrust'
      },
      visible: true
    },
    footer: {
      copyright: '© 2024 KYCtrust. جميع الحقوق محفوظة.',
      links: [
        { label: 'سياسة الخصوصية', url: '/privacy' },
        { label: 'الشروط والأحكام', url: '/terms' },
        { label: 'اتفاقية الاستخدام', url: '/usage' }
      ],
      visible: true
    }
  };
};

const DynamicLandingPage: React.FC = () => {
  // Hooks
  const { services, paymentMethods, siteSettings, error, refreshData } = useData();
  const { theme, language } = useTheme();
  const { customization } = useCustomization();

  // State
  const [selectedService, setSelectedService] = useState<{name: string, price: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [pageContent, setPageContent] = useState(loadPageContent);

  // Load content on mount and when customization changes
  useEffect(() => {
    const content = loadPageContent();
    setPageContent(content);
  }, [customization]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active services
  const activeServices = useMemo(() => 
    services.filter(service => service.active).sort((a, b) => a.order - b.order),
    [services]
  );

  const handleServiceOrder = (service: any) => {
    setSelectedService({ name: service.name, price: service.price });
    setIsModalOpen(true);
  };

  const isRTL = language === 'ar';

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            حدث خطأ في تحميل البيانات
          </h2>
          <button
            onClick={refreshData}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${isRTL ? 'rtl' : 'ltr'}`}>
      <SEOOptimizer 
        title={pageContent.hero.title}
        description={pageContent.hero.subtitle}
        keywords="KYC, التحقق الرقمي, الخدمات المالية, الأمان الرقمي, التكنولوجيا المالية"
      />
      <PerformanceTracker />

      {/* Navigation */}
      {pageContent.navigation && (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700' 
            : 'bg-transparent'
        }`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {pageContent.navigation.logo}
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8 space-x-reverse">
                {pageContent.navigation.items
                  .filter(item => item.active)
                  .map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <SuperThemeToggle />
                <SuperLanguageToggle />
                
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-gray-600 dark:text-gray-400"
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                {pageContent.navigation.items
                  .filter(item => item.active)
                  .map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Hero Section */}
      {pageContent.hero.visible && (
        <section 
          id="home" 
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{
            background: pageContent.hero.backgroundImage 
              ? `linear-gradient(${pageContent.hero.backgroundOverlay}), url(${pageContent.hero.backgroundImage})`
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {pageContent.hero.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                {pageContent.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SuperButton
                  variant="gradient"
                  size="lg"
                  glow
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  animation="glow"
                  icon={<Rocket className="h-5 w-5" />}
                >
                  {pageContent.hero.buttonText}
                </SuperButton>
                {pageContent.hero.secondaryButtonText && (
                  <SuperButton
                    variant="glass"
                    size="lg"
                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
                    animation="scale"
                    icon={<Target className="h-5 w-5" />}
                  >
                    {pageContent.hero.secondaryButtonText}
                  </SuperButton>
                )}
              </div>
            </div>
          </div>

          {/* Animated Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
            <div className="absolute top-1/3 right-10 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/4 w-14 h-14 bg-white/10 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </section>
      )}

      {/* About Section */}
      {pageContent.about.visible && (
        <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {pageContent.about.title}
              </h2>
              <p className="text-xl text-blue-600 dark:text-blue-400 mb-6">
                {pageContent.about.subtitle}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {pageContent.about.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pageContent.about.features.map((feature, index) => {
                const IconComponent = feature.icon === 'shield' ? Shield :
                                   feature.icon === 'zap' ? Zap :
                                   feature.icon === 'clock' ? Clock :
                                   feature.icon === 'users' ? Users : Shield;
                
                return (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {pageContent.services.visible && (
        <section id="services" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {pageContent.services.title}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {pageContent.services.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeServices.map((service, index) => (
                <EnhancedCard
                  key={service.id}
                  variant="elevated"
                  hover
                  glow
                  className="overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {service.name}
                      </h3>
                      {pageContent.services.showPrices && (
                        <span className="text-2xl font-bold text-blue-600">
                          {service.price}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      خدمة متميزة تلبي احتياجاتك بأعلى معايير الجودة والأمان
                    </p>
                    <SuperButton
                      variant="primary"
                      fullWidth
                      glow
                      onClick={() => handleServiceOrder(service)}
                      animation="pulse"
                      icon={<MessageCircle className="h-4 w-4" />}
                    >
                      اطلب الآن
                    </SuperButton>
                  </div>
                </EnhancedCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {pageContent.stats.visible && (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                {pageContent.stats.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pageContent.stats.items.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl font-bold mb-2">
                    <CounterAnimation end={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {pageContent.testimonials.visible && (
        <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {pageContent.testimonials.title}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {pageContent.testimonials.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageContent.testimonials.items.map((testimonial, index) => (
                <EnhancedCard
                  key={index}
                  variant="glass"
                  hover
                  glow
                  className="backdrop-blur-sm"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-lg font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="mr-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role} - {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </EnhancedCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {pageContent.cta.visible && (
        <section 
          className="py-20 text-white text-center"
          style={{ background: pageContent.cta.backgroundColor }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-4">
              {pageContent.cta.title}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {pageContent.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SuperButton
                variant="neon"
                size="xl"
                glow
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-blue-600 hover:bg-gray-100"
                animation="glow"
                icon={<Sparkles className="h-6 w-6" />}
              >
                {pageContent.cta.buttonText}
              </SuperButton>
              {pageContent.cta.secondaryButtonText && (
                <SuperButton
                  variant="glass"
                  size="xl"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
                  animation="slide"
                  icon={<MessageCircle className="h-6 w-6" />}
                >
                  {pageContent.cta.secondaryButtonText}
                </SuperButton>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {pageContent.contact.visible && (
        <section id="contact" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {pageContent.contact.title}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {pageContent.contact.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">الهاتف</div>
                    <div className="text-gray-600 dark:text-gray-400">{pageContent.contact.phone}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">البريد الإلكتروني</div>
                    <div className="text-gray-600 dark:text-gray-400">{pageContent.contact.email}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">العنوان</div>
                    <div className="text-gray-600 dark:text-gray-400">{pageContent.contact.address}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">ساعات العمل</div>
                    <div className="text-gray-600 dark:text-gray-400">{pageContent.contact.workingHours}</div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-6">
                  <div className="font-semibold text-gray-900 dark:text-white mb-4">تابعنا على</div>
                  <div className="flex space-x-4 space-x-reverse">
                    {pageContent.contact.socialLinks.twitter && (
                      <a href={pageContent.contact.socialLinks.twitter} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {pageContent.contact.socialLinks.linkedin && (
                      <a href={pageContent.contact.socialLinks.linkedin} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {pageContent.contact.socialLinks.facebook && (
                      <a href={pageContent.contact.socialLinks.facebook} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {pageContent.contact.socialLinks.instagram && (
                      <a href={pageContent.contact.socialLinks.instagram} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  أرسل لنا رسالة
                </h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الاسم ��لكامل
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الرسالة
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="اكتب رسالتك هنا..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    إر��ال الرسالة
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {pageContent.footer.visible && (
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                {pageContent.navigation.logo}
              </div>
              <p className="text-gray-400 mb-6">
                {pageContent.hero.subtitle}
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {pageContent.footer.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="border-t border-gray-800 pt-6">
                <p className="text-gray-400">
                  {pageContent.footer.copyright}
                </p>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Order Modal */}
      {isModalOpen && selectedService && (
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          serviceName={selectedService.name}
          servicePrice={selectedService.price}
          paymentMethods={paymentMethods}
        />
      )}

      {/* WhatsApp Float Button */}
      <WhatsAppButton
        variant="float"
        size="lg"
        message="مرحباً، أحتاج مساعدة في خدماتكم"
      />
    </div>
  );
};

export default DynamicLandingPage;
