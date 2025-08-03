import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle, CreditCard, MessageCircle, Star, ArrowRight, 
  Clock, Users, Award, Zap, Globe, Heart, Sparkles, Phone, Mail, 
  Menu, X, Rocket, Target, ChevronDown, CheckSquare, Eye,
  PlayCircle, Download, Send, Facebook, Twitter, Instagram, Linkedin,
  MapPin, Calendar, ExternalLink
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { SuperButton, SuperThemeToggle, SuperLanguageToggle, EnhancedCard } from './ui';
import OrderModal from './modals/OrderModal';
import toast from 'react-hot-toast';

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    backgroundImage: string;
    backgroundVideo: string;
    backgroundOverlay: string;
    visible: boolean;
    style: 'modern' | 'classic' | 'minimal' | 'gradient';
  };
  navigation: {
    logo: string;
    logoImage: string;
    items: Array<{
      id: string;
      label: string;
      url: string;
      active: boolean;
      order: number;
    }>;
    showLanguage: boolean;
    showTheme: boolean;
  };
  services: {
    title: string;
    subtitle: string;
    visible: boolean;
    layout: 'grid' | 'list' | 'carousel';
    itemsPerRow: number;
    showPrices: boolean;
    showDescriptions: boolean;
  };
  about: {
    title: string;
    content: string;
    image: string;
    features: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      active: boolean;
    }>;
    visible: boolean;
    layout: 'side-by-side' | 'centered' | 'split';
  };
  testimonials: {
    title: string;
    subtitle: string;
    visible: boolean;
    autoPlay: boolean;
    showRatings: boolean;
    items: Array<{
      id: string;
      name: string;
      role: string;
      content: string;
      rating: number;
      avatar: string;
      active: boolean;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    workingHours: string;
    socialMedia: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
      youtube: string;
    };
    showMap: boolean;
    mapUrl: string;
    visible: boolean;
  };
  footer: {
    companyName: string;
    description: string;
    copyright: string;
    links: Array<{
      id: string;
      title: string;
      url: string;
      active: boolean;
    }>;
    showSocialMedia: boolean;
    visible: boolean;
  };
}

const RealLandingPage: React.FC = () => {
  const { services, orders, loading } = useData();
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');

  useEffect(() => {
    loadSiteContent();
    
    // Listen for content updates from admin
    const handleContentUpdate = (event: CustomEvent) => {
      setSiteContent(event.detail);
      toast.success('تم تحديث المحتوى');
    };
    
    window.addEventListener('contentUpdated', handleContentUpdate as EventListener);
    
    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate as EventListener);
    };
  }, []);

  const loadSiteContent = () => {
    try {
      const saved = localStorage.getItem('kyc-site-content');
      if (saved) {
        setSiteContent(JSON.parse(saved));
      } else {
        // Load default content if none exists
        setSiteContent(getDefaultContent());
      }
    } catch (error) {
      console.error('Error loading site content:', error);
      setSiteContent(getDefaultContent());
    }
  };

  const getDefaultContent = (): SiteContent => ({
    hero: {
      title: 'KYC Trust - منصة التحقق الرقمية المتطورة',
      subtitle: 'حلول شاملة للتحقق من الهوية والامتثال',
      description: 'نقدم خدمات التحقق الرقمية الأكثر تطوراً وأماناً في المنطقة، مع تقنيات حديثة وفريق خبراء متخصص لضمان الامتثال الكامل للمعايير الدولية.',
      primaryButtonText: 'ابدأ الآن',
      secondaryButtonText: 'تعرف على خدماتنا',
      backgroundImage: '',
      backgroundVideo: '',
      backgroundOverlay: 'rgba(59, 130, 246, 0.8)',
      visible: true,
      style: 'gradient'
    },
    navigation: {
      logo: 'KYC Trust',
      logoImage: '',
      items: [
        { id: '1', label: 'الرئيسية', url: '#home', active: true, order: 1 },
        { id: '2', label: 'خدماتنا', url: '#services', active: true, order: 2 },
        { id: '3', label: 'من نحن', url: '#about', active: true, order: 3 },
        { id: '4', label: 'آراء العملاء', url: '#testimonials', active: true, order: 4 },
        { id: '5', label: 'تواصل معنا', url: '#contact', active: true, order: 5 }
      ],
      showLanguage: true,
      showTheme: true
    },
    services: {
      title: 'خدماتنا المتميزة',
      subtitle: 'حلول شاملة للتحقق والامتثال الرقمي',
      visible: true,
      layout: 'grid',
      itemsPerRow: 3,
      showPrices: true,
      showDescriptions: true
    },
    about: {
      title: 'من نحن',
      content: 'نحن فريق من الخبراء المتخصصين في مجال التحقق الرقمي والامتثال، نعمل على تقديم أفضل الحلول التقنية للشركات والأفراد. نتميز بالخبرة الواسعة والتقنيات المتطورة التي تضمن الأمان والموثوقية في جميع خدماتنا.',
      image: '',
      features: [
        {
          id: '1',
          title: 'أمان عالي',
          description: 'تقنيات تشفير متقدمة لحماية بياناتك',
          icon: 'shield',
          active: true
        },
        {
          id: '2',
          title: 'سرعة الاستجابة',
          description: 'خدمة عملاء متاحة 24/7 لمساعدتك',
          icon: 'zap',
          active: true
        },
        {
          id: '3',
          title: 'موثوقية عالية',
          description: 'شراكات مع أفضل الجهات المعتمدة',
          icon: 'award',
          active: true
        }
      ],
      visible: true,
      layout: 'side-by-side'
    },
    testimonials: {
      title: 'آراء عملائنا',
      subtitle: 'تجارب حقيقية من عملائنا الكرام',
      visible: true,
      autoPlay: true,
      showRatings: true,
      items: [
        {
          id: '1',
          name: 'أحمد محمد',
          role: 'مدير تنفيذي',
          content: 'خدمة ممتازة وسريعة، تم التحقق من جميع الوثائق في وقت قياسي',
          rating: 5,
          avatar: '',
          active: true
        },
        {
          id: '2',
          name: 'فاطمة علي',
          role: 'صاحبة شركة',
          content: 'فريق محترف ومتعاون، أنصح بالتعامل معهم',
          rating: 5,
          avatar: '',
          active: true
        }
      ]
    },
    contact: {
      title: 'تواصل معنا',
      subtitle: 'نحن هنا لمساعدتك في أي وقت',
      phone: '+201062453344',
      whatsapp: '+201062453344',
      email: 'info@kyctrust.com',
      address: 'القاهرة، مصر',
      workingHours: 'الأحد - الخميس: 9:00 ص - 6:00 م',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      },
      showMap: true,
      mapUrl: '',
      visible: true
    },
    footer: {
      companyName: 'KYC Trust',
      description: 'منصة رائدة في خدمات التحقق الرقمي والامتثال',
      copyright: '© 2024 KYC Trust. جميع الحقوق محفوظة.',
      links: [
        { id: '1', title: 'سياسة الخصوصية', url: '#privacy', active: true },
        { id: '2', title: 'شروط الاستخدام', url: '#terms', active: true },
        { id: '3', title: 'الدعم الفني', url: '#support', active: true }
      ],
      showSocialMedia: true,
      visible: true
    }
  });

  const handleServiceOrder = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsOrderModalOpen(true);
  };

  const handleWhatsAppContact = () => {
    if (siteContent?.contact.whatsapp) {
      const message = encodeURIComponent('مرحباً، أريد الاستفسار عن خدماتكم');
      window.open(`https://wa.me/${siteContent.contact.whatsapp.replace('+', '')}?text=${message}`, '_blank');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      shield: <Shield className="h-8 w-8" />,
      zap: <Zap className="h-8 w-8" />,
      award: <Award className="h-8 w-8" />,
      users: <Users className="h-8 w-8" />,
      clock: <Clock className="h-8 w-8" />,
      star: <Star className="h-8 w-8" />
    };
    return icons[iconName] || <Star className="h-8 w-8" />;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (!siteContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {siteContent.navigation.logo}
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              {siteContent.navigation.items
                .filter(item => item.active)
                .sort((a, b) => a.order - b.order)
                .map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.url.replace('#', ''))}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {siteContent.navigation.showTheme && <SuperThemeToggle />}
              {siteContent.navigation.showLanguage && <SuperLanguageToggle />}
              
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
              <div className="space-y-2">
                {siteContent.navigation.items
                  .filter(item => item.active)
                  .sort((a, b) => a.order - b.order)
                  .map(item => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.url.replace('#', ''))}
                      className="block w-full text-right px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      {item.label}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      {siteContent.hero.visible && (
        <section 
          id="home" 
          className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
            siteContent.hero.style === 'gradient' 
              ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700' 
              : 'bg-gray-900'
          }`}
          style={{
            backgroundImage: siteContent.hero.backgroundImage 
              ? `url(${siteContent.hero.backgroundImage})` 
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Background Overlay */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: siteContent.hero.backgroundOverlay }}
          />

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {siteContent.hero.title}
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl text-blue-100 font-medium">
                  {siteContent.hero.subtitle}
                </h2>
                <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  {siteContent.hero.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SuperButton
                  variant="neon"
                  size="xl"
                  onClick={() => scrollToSection('services')}
                  icon={<Rocket className="h-6 w-6" />}
                  animation="glow"
                  glow
                >
                  {siteContent.hero.primaryButtonText}
                </SuperButton>
                
                <SuperButton
                  variant="glass"
                  size="xl"
                  onClick={() => scrollToSection('about')}
                  icon={<Eye className="h-6 w-6" />}
                  animation="scale"
                >
                  {siteContent.hero.secondaryButtonText}
                </SuperButton>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {siteContent.services.visible && (
        <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {siteContent.services.title}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {siteContent.services.subtitle}
              </p>
            </div>

            <div className={`grid grid-cols-1 ${
              siteContent.services.itemsPerRow === 2 ? 'md:grid-cols-2' : 
              siteContent.services.itemsPerRow === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 
              siteContent.services.itemsPerRow === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 
              'md:grid-cols-3'
            } gap-8`}>
              {services.map((service) => (
                <EnhancedCard 
                  key={service.id} 
                  variant="elevated" 
                  className="group hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {service.name}
                    </h3>
                    
                    {siteContent.services.showDescriptions && (
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        خدمة متميزة تلبي احتياجاتك بأعلى معايير الجودة والأمان
                      </p>
                    )}
                    
                    {siteContent.services.showPrices && (
                      <div className="mb-6">
                        <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {service.price.toLocaleString()}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 mr-2">جنيه</span>
                      </div>
                    )}
                    
                    <SuperButton
                      variant="primary"
                      fullWidth
                      onClick={() => handleServiceOrder(service.name)}
                      icon={<MessageCircle className="h-4 w-4" />}
                      animation="pulse"
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

      {/* About Section */}
      {siteContent.about.visible && (
        <section id="about" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    {siteContent.about.title}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {siteContent.about.content}
                  </p>
                </div>

                <div className="space-y-6">
                  {siteContent.about.features
                    .filter(feature => feature.active)
                    .map((feature) => (
                      <div key={feature.id} className="flex items-start space-x-4 space-x-reverse">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          {getIconComponent(feature.icon)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-3xl p-1">
                  <div className="w-full h-full bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center">
                    <div className="text-center p-8">
                      <Users className="h-24 w-24 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        +1000
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">عميل راضٍ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {siteContent.testimonials.visible && (
        <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {siteContent.testimonials.title}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {siteContent.testimonials.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {siteContent.testimonials.items
                .filter(item => item.active)
                .map((testimonial) => (
                  <EnhancedCard 
                    key={testimonial.id} 
                    variant="elevated" 
                    className="p-8"
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    
                    {siteContent.testimonials.showRatings && (
                      <div className="flex">
                        {renderStars(testimonial.rating)}
                      </div>
                    )}
                  </EnhancedCard>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {siteContent.contact.visible && (
        <section id="contact" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {siteContent.contact.title}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {siteContent.contact.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-6">
                <EnhancedCard variant="elevated" className="p-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">الهاتف</h3>
                      <p className="text-gray-600 dark:text-gray-400">{siteContent.contact.phone}</p>
                    </div>
                  </div>
                </EnhancedCard>

                <EnhancedCard variant="elevated" className="p-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">واتساب</h3>
                      <p className="text-gray-600 dark:text-gray-400">{siteContent.contact.whatsapp}</p>
                    </div>
                  </div>
                </EnhancedCard>

                <EnhancedCard variant="elevated" className="p-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">البريد الإلكتروني</h3>
                      <p className="text-gray-600 dark:text-gray-400">{siteContent.contact.email}</p>
                    </div>
                  </div>
                </EnhancedCard>

                <EnhancedCard variant="elevated" className="p-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">العنوان</h3>
                      <p className="text-gray-600 dark:text-gray-400">{siteContent.contact.address}</p>
                    </div>
                  </div>
                </EnhancedCard>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <EnhancedCard variant="elevated" className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    أرسل لنا رسالة
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          الاسم الكامل
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="اسمك الكامل"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الموضوع
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="موضوع الرسالة"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الرسالة
                      </label>
                      <textarea
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="اكتب رسالتك هنا..."
                      />
                    </div>
                    <SuperButton
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<Send className="h-5 w-5" />}
                    >
                      إرسال الرسالة
                    </SuperButton>
                  </div>
                </EnhancedCard>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {siteContent.footer.visible && (
        <footer className="bg-gray-900 dark:bg-black text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold mb-4">{siteContent.footer.companyName}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {siteContent.footer.description}
                </p>
                {siteContent.footer.showSocialMedia && (
                  <div className="flex space-x-4 space-x-reverse">
                    {siteContent.contact.socialMedia.facebook && (
                      <a href={siteContent.contact.socialMedia.facebook} className="text-gray-400 hover:text-white">
                        <Facebook className="h-6 w-6" />
                      </a>
                    )}
                    {siteContent.contact.socialMedia.twitter && (
                      <a href={siteContent.contact.socialMedia.twitter} className="text-gray-400 hover:text-white">
                        <Twitter className="h-6 w-6" />
                      </a>
                    )}
                    {siteContent.contact.socialMedia.instagram && (
                      <a href={siteContent.contact.socialMedia.instagram} className="text-gray-400 hover:text-white">
                        <Instagram className="h-6 w-6" />
                      </a>
                    )}
                    {siteContent.contact.socialMedia.linkedin && (
                      <a href={siteContent.contact.socialMedia.linkedin} className="text-gray-400 hover:text-white">
                        <Linkedin className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">روابط مهمة</h4>
                <ul className="space-y-2">
                  {siteContent.footer.links
                    .filter(link => link.active)
                    .map((link) => (
                      <li key={link.id}>
                        <a href={link.url} className="text-gray-400 hover:text-white transition-colors duration-200">
                          {link.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">تواصل معن��</h4>
                <div className="space-y-2 text-gray-400">
                  <p>{siteContent.contact.phone}</p>
                  <p>{siteContent.contact.email}</p>
                  <p>{siteContent.contact.workingHours}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 mt-8 text-center">
              <p className="text-gray-400">{siteContent.footer.copyright}</p>
            </div>
          </div>
        </footer>
      )}

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <SuperButton
          variant="success"
          size="lg"
          onClick={handleWhatsAppContact}
          rounded
          glow
          icon={<MessageCircle className="h-6 w-6" />}
          className="shadow-2xl animate-bounce"
        />
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          selectedService={selectedService}
        />
      )}
    </div>
  );
};

export default RealLandingPage;
