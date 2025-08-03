import React from 'react';
import { PageElement, PageTheme } from './PageBuilder';
import { 
  CreditCard, Users, Star, Quote, BarChart, 
  Type, Image as ImageIcon, Video
} from 'lucide-react';
import HeaderRenderer from '../../rendering/HeaderRenderer';
import FooterRenderer from '../../rendering/FooterRenderer';

interface ElementRendererProps {
  element: PageElement;
  theme: PageTheme | null;
  isEditing?: boolean;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({ element, theme, isEditing = false }) => {
  const getElementStyles = () => {
    const styles: React.CSSProperties = {
      backgroundColor: element.styles.backgroundColor,
      color: element.styles.textColor,
      borderRadius: element.styles.borderRadius ? `${element.styles.borderRadius}px` : undefined,
      padding: element.styles.padding ? `${element.styles.padding}px` : undefined,
      margin: element.styles.margin ? `${element.styles.margin}px` : undefined,
      fontFamily: element.styles.fontFamily,
      fontSize: element.styles.fontSize ? `${element.styles.fontSize}px` : undefined,
      fontWeight: element.styles.fontWeight,
      borderWidth: element.styles.borderWidth ? `${element.styles.borderWidth}px` : undefined,
      borderColor: element.styles.borderColor,
      borderStyle: element.styles.borderWidth ? 'solid' : undefined,
      textAlign: element.content.alignment as 'left' | 'center' | 'right' | 'justify',
    };

    return styles;
  };

  const renderHero = () => (
    <div className="relative w-full h-full flex items-center justify-center" style={getElementStyles()}>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          {element.content.title || 'Hero Title'}
        </h1>
        <p className="text-lg opacity-80">
          {element.content.subtitle || 'Hero subtitle goes here'}
        </p>
        <button 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          style={{ backgroundColor: theme?.colors.primary }}
        >
          {element.content.buttonText || 'Get Started'}
        </button>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="w-full h-full p-6" style={getElementStyles()}>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {element.content.title || 'Our Services'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Service {i}</h3>
            <p className="text-sm text-gray-600">Service description goes here</p>
            <div className="mt-4 text-lg font-bold text-blue-600">$99</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="w-full h-full p-6" style={getElementStyles()}>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {element.content.title || 'Our Features'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: Users, title: 'User Friendly', desc: 'Easy to use interface' },
          { icon: Star, title: 'High Quality', desc: 'Premium quality service' },
          { icon: BarChart, title: 'Analytics', desc: 'Detailed reports' },
          { icon: CreditCard, title: 'Secure', desc: 'Bank-level security' }
        ].map((feature, i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <feature.icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTestimonials = () => (
    <div className="w-full h-full p-6" style={getElementStyles()}>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {element.content.title || 'What Clients Say'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                👤
              </div>
              <div>
                <h4 className="font-semibold">Client Name</h4>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <Quote className="h-6 w-6 text-gray-300 mb-2" />
            <p className="text-gray-600">
              "This service is amazing and has helped our business grow significantly."
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="w-full h-full p-6" style={getElementStyles()}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {element.content.stats?.map((stat: { value: string; suffix: string; label: string }, i: number) => (
          <div key={i} className="space-y-2">
            <div className="text-3xl font-bold" style={{ color: theme?.colors.primary }}>
              {stat.value}{stat.suffix || ''}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        )) || [
          { value: '1000+', label: 'Clients' },
          { value: '99%', label: 'Success Rate' },
          { value: '24/7', label: 'Support' },
          { value: '5 min', label: 'Response Time' }
        ].map((stat, i) => (
          <div key={i} className="space-y-2">
            <div className="text-3xl font-bold" style={{ color: theme?.colors.primary }}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderText = () => (
    <div className="w-full h-full p-4" style={getElementStyles()}>
      <div 
        className="w-full h-full"
        style={{ 
          textAlign: element.content.alignment || 'left',
          fontSize: element.styles.fontSize || 16,
          fontWeight: element.styles.fontWeight || 'normal'
        }}
      >
        {element.content.text || 'Sample text content goes here. Click to edit.'}
      </div>
    </div>
  );

  const renderImage = () => (
    <div className="w-full h-full relative" style={getElementStyles()}>
      {element.content.imageUrl ? (
        <img
          src={element.content.imageUrl}
          alt={element.content.altText || 'Image'}
          className="w-full h-full object-cover"
          style={{ borderRadius: element.styles.borderRadius ? `${element.styles.borderRadius}px` : undefined }}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-2" />
            <p>Click to add image</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderVideo = () => (
    <div className="w-full h-full relative" style={getElementStyles()}>
      {element.content.videoUrl ? (
        <video
          src={element.content.videoUrl}
          controls={element.content.controls !== false}
          autoPlay={element.content.autoplay}
          poster={element.content.poster}
          className="w-full h-full object-cover"
          style={{ borderRadius: element.styles.borderRadius ? `${element.styles.borderRadius}px` : undefined }}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <Video className="h-12 w-12 mx-auto mb-2" />
            <p>Click to add video</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderForm = () => (
    <div className="w-full h-full p-6" style={getElementStyles()}>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {element.content.title || 'Contact Form'}
      </h2>
      <form className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Your Name"
            disabled={isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="your@email.com"
            disabled={isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Your message..."
            disabled={isEditing}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          style={{ backgroundColor: theme?.colors.primary }}
          disabled={isEditing}
        >
          {element.content.submitText || 'Send Message'}
        </button>
      </form>
    </div>
  );

  const renderCTA = () => (
    <div className="w-full h-full flex items-center justify-center" style={getElementStyles()}>
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">
          {element.content.title || 'Ready to Get Started?'}
        </h2>
        <p className="text-lg opacity-80">
          {element.content.subtitle || 'Join thousands of satisfied customers'}
        </p>
        <button 
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
          style={{ backgroundColor: theme?.colors.primary }}
        >
          {element.content.buttonText || 'Get Started Now'}
        </button>
      </div>
    </div>
  );

  // Render element based on type
  switch (element.type) {
    case 'hero':
      return renderHero();
    case 'services':
      return renderServices();
    case 'features':
      return renderFeatures();
    case 'testimonials':
      return renderTestimonials();
    case 'stats':
      return renderStats();
    case 'text':
      return renderText();
    case 'image':
      return renderImage();
    case 'video':
      return renderVideo();
    case 'form':
      return renderForm();
    case 'cta':
      return renderCTA();
    case 'header':
      return <HeaderRenderer element={element} />;
    case 'footer':
      return <FooterRenderer element={element} />;
    default:
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <Type className="h-12 w-12 mx-auto mb-2" />
            <p>Unknown element type: {element.type}</p>
          </div>
        </div>
      );
  }
};

export default ElementRenderer;
