import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';
import { useCustomization } from '../../../context/CustomizationContext';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import ElementRenderer from './ElementRenderer';

interface LivePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const LivePreview: React.FC<LivePreviewProps> = ({ isOpen, onClose }) => {
  const { customization } = useCustomization();
  const { services, paymentMethods, siteSettings } = useData();
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showOriginal, setShowOriginal] = useState(false);

  const getViewportSize = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '812px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const viewportSize = getViewportSize();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className={`w-full h-full max-w-7xl mx-auto p-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      } rounded-lg shadow-2xl flex flex-col`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-4">
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Live Preview
            </h2>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowOriginal(!showOriginal)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
                  showOriginal
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {showOriginal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showOriginal ? 'Show Custom' : 'Show Original'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Device Selector */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded ${
                  viewMode === 'desktop'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded ${
                  viewMode === 'tablet'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded ${
                  viewMode === 'mobile'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 p-4">
          <div className="flex items-center justify-center min-h-full">
            <div
              className="bg-white shadow-xl border border-gray-300 overflow-auto"
              style={{
                width: viewportSize.width,
                height: viewportSize.height,
                maxHeight: 'calc(100vh - 200px)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Preview Content */}
              {showOriginal ? (
                <iframe
                  src="/"
                  className="w-full h-full border-none"
                  title="Original Page"
                />
              ) : (
                <div className="w-full h-full">
                  {/* Custom Elements Preview */}
                  <div className="relative" style={{
                    fontFamily: customization.globalSettings.fontFamily,
                    color: customization.globalSettings.primaryColor
                  }}>
                    {/* Hero Section with Custom Data */}
                    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
                      <div className="text-center space-y-6">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium text-sm">
                          <span>{customization.hero.badgeText}</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold">
                          <span className="block">{customization.hero.title}</span>
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {customization.hero.titleGradient}
                          </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
                          {customization.hero.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button
                            className="px-8 py-4 text-white rounded-xl font-semibold"
                            style={{ 
                              background: `linear-gradient(to right, ${customization.globalSettings.primaryColor}, ${customization.globalSettings.secondaryColor})`
                            }}
                          >
                            {customization.hero.button1Text}
                          </button>
                          {customization.hero.button2Text && (
                            <button
                              className="px-8 py-4 border-2 rounded-xl font-semibold"
                              style={{ 
                                borderColor: customization.globalSettings.primaryColor,
                                color: customization.globalSettings.primaryColor
                              }}
                            >
                              {customization.hero.button2Text}
                            </button>
                          )}
                        </div>

                        {/* Stats */}
                        {customization.hero.showStats && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                            {Object.entries(customization.hero.statsData).map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="text-3xl font-bold" style={{ color: customization.globalSettings.primaryColor }}>
                                  {value}
                                </div>
                                <div className="text-sm text-gray-600 capitalize">{key}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Custom Elements */}
                    {customization.pageElements.map((element) => (
                      <div key={element.id} className="relative">
                        <ElementRenderer
                          element={element}
                          theme={{
                            id: 'custom',
                            name: 'Custom Theme',
                            colors: {
                              primary: customization.globalSettings.primaryColor,
                              secondary: customization.globalSettings.secondaryColor,
                              accent: customization.globalSettings.accentColor,
                              background: '#ffffff',
                              text: '#000000'
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
                          }}
                          isEditing={false}
                        />
                      </div>
                    ))}

                    {/* Services Section (if no custom elements) */}
                    {customization.pageElements.length === 0 && (
                      <section className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                          <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
                            <p className="text-lg text-gray-600">Professional financial services</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {services.slice(0, 6).map((service) => (
                              <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                                <div className="text-2xl font-bold mb-4" style={{ color: customization.globalSettings.primaryColor }}>
                                  {service.price}
                                </div>
                                <button
                                  className="w-full py-3 text-white rounded-lg font-semibold"
                                  style={{ backgroundColor: customization.globalSettings.primaryColor }}
                                >
                                  Order Now
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className={`p-4 border-t text-center text-sm ${
          theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
        }`}>
          Preview Mode: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} | 
          Elements: {customization.pageElements.length} | 
          Theme: {customization.globalSettings.fontFamily}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
