import React, { useState, useEffect } from 'react';
import {
  ArrowRight, Play, Star, Users, Shield, Zap, Award,
  Globe, TrendingUp, Clock, CheckCircle, Sparkles,
  Heart, Target, Rocket, ArrowDown, MousePointer
} from 'lucide-react';
import CounterAnimation from '../animations/CounterAnimation';

interface HeroProps {
  title?: string;
  titleGradient?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  showStats?: boolean;
  backgroundType?: 'gradient' | 'image' | 'video' | 'animated';
  backgroundUrl?: string;
  showFloatingElements?: boolean;
  theme?: 'modern' | 'minimal' | 'corporate' | 'creative';
}

const ModernHeroSection: React.FC<HeroProps> = ({
  title = "مرحباً بك في مستقبل",
  titleGradient = "الخدمات الرقمية المتطورة",
  subtitle = "نحن نقدم حلولاً مبتكرة وموثوقة",
  description = "منصة شاملة تجمع بين التكنولوجيا المتقدمة والخبرة العميقة لتقديم خدمات رقمية استثنائية تلبي جميع احتياجاتك المالية والتجارية بأعلى معايير الجودة والأمان",
  primaryButtonText = "ابدأ رحلتك معنا",
  secondaryButtonText = "شاهد العرض التوضيحي",
  onPrimaryClick,
  onSecondaryClick,
  showStats = true,
  backgroundType = 'gradient',
  backgroundUrl,
  showFloatingElements = true,
  theme = 'modern'
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (showFloatingElements) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [showFloatingElements]);

  const stats = [
    { label: 'عميل راضٍ', value: 15000, suffix: '+', icon: Users },
    { label: 'معدل النجاح', value: 99.9, suffix: '%', icon: Target },
    { label: 'سنوات الخبرة', value: 8, suffix: '+', icon: Award },
    { label: 'دعم متواصل', value: 24, suffix: '/7', icon: Clock }
  ];

  const floatingElements = [
    { icon: Shield, color: 'text-blue-500', delay: 0, size: 'w-8 h-8' },
    { icon: Zap, color: 'text-yellow-500', delay: 0.5, size: 'w-6 h-6' },
    { icon: Star, color: 'text-purple-500', delay: 1, size: 'w-7 h-7' },
    { icon: Heart, color: 'text-pink-500', delay: 1.5, size: 'w-5 h-5' },
    { icon: Globe, color: 'text-green-500', delay: 2, size: 'w-9 h-9' },
    { icon: Rocket, color: 'text-orange-500', delay: 2.5, size: 'w-6 h-6' }
  ];

  const getBackgroundStyle = () => {
    switch (backgroundType) {
      case 'image':
        return {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      case 'video':
        return { backgroundColor: '#000' };
      case 'animated':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite'
        };
      default:
        return {
          background: theme === 'minimal' 
            ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            : theme === 'corporate'
            ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
            : theme === 'creative'
            ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'minimal':
        return {
          container: 'text-gray-800',
          title: 'text-gray-900',
          subtitle: 'text-gray-600',
          button: 'bg-gray-800 hover:bg-gray-900 text-white'
        };
      case 'corporate':
        return {
          container: 'text-white',
          title: 'text-white',
          subtitle: 'text-blue-100',
          button: 'bg-white hover:bg-gray-100 text-blue-900'
        };
      case 'creative':
        return {
          container: 'text-gray-800',
          title: 'text-gray-900',
          subtitle: 'text-gray-700',
          button: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
        };
      default:
        return {
          container: 'text-white',
          title: 'text-white',
          subtitle: 'text-blue-100',
          button: 'bg-white hover:bg-gray-100 text-blue-900'
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${themeClasses.container}`}
      style={getBackgroundStyle()}
    >
      {/* Background Video */}
      {backgroundType === 'video' && backgroundUrl && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundUrl} type="video/mp4" />
        </video>
      )}

      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>

      {/* Floating Elements */}
      {showFloatingElements && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingElements.map((element, index) => (
            <div
              key={index}
              className={`absolute opacity-20 animate-bounce ${element.color}`}
              style={{
                left: `${10 + (index * 15)}%`,
                top: `${20 + (index * 10)}%`,
                animationDelay: `${element.delay}s`,
                animationDuration: `${3 + index * 0.5}s`,
                transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
              }}
            >
              <element.icon className={element.size} />
            </div>
          ))}
        </div>
      )}

      {/* Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-green-400/20 to-blue-400/20 rotate-45 blur-lg animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Sparkles className="h-4 w-4 text-yellow-400 ml-2" />
            <span className="text-sm font-medium">منصة رائدة في الخدمات الرقمية</span>
            <Star className="h-4 w-4 text-yellow-400 mr-2" />
          </div>

          {/* Main Title */}
          <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <span className={themeClasses.title}>
              {title}
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              {titleGradient}
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-2xl md:text-3xl font-semibold mb-6 ${themeClasses.subtitle} transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {subtitle}
          </p>

          {/* Description */}
          <p className={`text-lg md:text-xl leading-relaxed mb-12 max-w-4xl mx-auto ${themeClasses.subtitle} transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {description}
          </p>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button
              onClick={onPrimaryClick}
              className={`group px-8 py-4 ${themeClasses.button} rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl flex items-center justify-center`}
            >
              {primaryButtonText}
              <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={onSecondaryClick}
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white/20 flex items-center justify-center"
            >
              <Play className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              {secondaryButtonText}
            </button>
          </div>

          {/* Statistics */}
          {showStats && (
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105">
                    <div className="flex justify-center mb-3">
                      <stat.icon className="h-8 w-8 text-yellow-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      <CounterAnimation value={stat.value} />
                      <span className="text-yellow-400">{stat.suffix}</span>
                    </div>
                    <p className={`text-sm font-medium ${themeClasses.subtitle}`}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Scroll Indicator */}
          <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-col items-center space-y-2 text-white/70">
              <span className="text-sm font-medium">اكتشف المزيد</span>
              <ArrowDown className="h-5 w-5 animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Particle Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 1; }
        }
        
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradientShift 3s ease infinite;
        }
        
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </section>
  );
};

export default ModernHeroSection;
