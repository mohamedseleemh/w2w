import React, { useState, useMemo } from 'react';
import { 
  X, CreditCard, ArrowLeft, CheckCircle, Star, Zap, Shield, 
  Users, Clock, ChevronLeft, ChevronRight, Sparkles, Target,
  TrendingUp, Award, Globe, Search
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

interface ServicesShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceName: string) => void;
}

const ServicesShowcase: React.FC<ServicesShowcaseProps> = ({ isOpen, onClose, onSelectService }) => {
  const { services } = useData();
  const { theme, language } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 6;

  // Filter services based on search and category
  const filteredServices = useMemo(() => {
    return services
      .filter(service => service.active)
      .filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.name.includes('PayPal') && searchTerm.toLowerCase().includes('paypal')) ||
        (service.name.includes('Wise') && searchTerm.toLowerCase().includes('wise'))
      )
      .sort((a, b) => a.order - b.order);
  }, [services, searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  // Service categories for filtering
  const categories = [
    { id: 'all', name: language === 'ar' ? 'جميع الخدمات' : 'All Services' },
    { id: 'wallets', name: language === 'ar' ? 'المحافظ الرقمية' : 'Digital Wallets' },
    { id: 'crypto', name: language === 'ar' ? 'العملات الرقمية' : 'Cryptocurrency' },
    { id: 'local', name: language === 'ar' ? 'خدمات محلية' : 'Local Services' }
  ];

  // Service stats
  const serviceStats = [
    {
      icon: Users,
      value: '15,000+',
      label: language === 'ar' ? 'عميل راضٍ' : 'Satisfied Clients',
      color: 'text-blue-600'
    },
    {
      icon: Target,
      value: '99.9%',
      label: language === 'ar' ? 'معدل النجاح' : 'Success Rate',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      value: '< 5',
      label: language === 'ar' ? 'دقائق للتنفيذ' : 'Minutes Execution',
      color: 'text-orange-600'
    },
    {
      icon: Award,
      value: '24/7',
      label: language === 'ar' ? 'دعم فني' : 'Support',
      color: 'text-purple-600'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-6xl p-6 my-8 text-right align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-reverse space-x-3">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <span>{language === 'ar' ? 'جميع خدماتنا المالية' : 'All Our Financial Services'}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {language === 'ar' 
                  ? 'اختر الخدمة المناسبة لك من مجموعتنا الشاملة'
                  : 'Choose the right service for you from our comprehensive collection'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {serviceStats.map((stat, index) => (
              <div key={index} className={`text-center p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                <div className="font-bold text-lg">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'ابحث عن خدمة...' : 'Search for a service...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex space-x-reverse space-x-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentServices.map((service) => (
              <div
                key={service.id}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600 hover:border-blue-500' 
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => onSelectService(service.name)}
              >
                {/* Service Icon */}
                <div className="relative mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Popular Badge */}
                  {service.order <= 5 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Service Content */}
                <div className="space-y-3">
                  <h3 className={`text-lg font-bold group-hover:text-blue-600 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {service.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">{service.price}</span>
                    <div className="flex items-center space-x-reverse space-x-1">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Service Features */}
                  <div className="space-y-1">
                    {(language === 'ar' 
                      ? ['تنفيذ سريع', 'أمان عالي', 'دعم 24/7'] 
                      : ['Fast execution', 'High security', '24/7 support']
                    ).map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-reverse space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectService(service.name);
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                  >
                    {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
                  </button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className={`h-16 w-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {language === 'ar' ? 'لا توجد خدمات متطابقة' : 'No matching services'}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {language === 'ar' ? 'جرب البحث بكلمات مختلفة' : 'Try searching with different keywords'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' 
                  ? `عرض ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, filteredServices.length)} من ${filteredServices.length}`
                  : `Showing ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, filteredServices.length)} of ${filteredServices.length}`
                }
              </div>
              
              <div className="flex items-center space-x-reverse space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <span className="px-3 py-1 text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-reverse space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ar' ? 'جميع الخدمات مضمونة وآمنة' : 'All services are guaranteed and secure'}
                </span>
              </div>
              
              <button
                onClick={onClose}
                className="flex items-center space-x-reverse space-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">{language === 'ar' ? 'إغلاق' : 'Close'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesShowcase;
