import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { 
  Grid, Type, Image as ImageIcon, Video, Quote, Star, 
  CreditCard, BarChart, Mail,
  Search, ChevronDown, Package
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ComponentTemplate {
  id: string;
  name: string;
  type: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  category: string;
  preview: string;
  defaultContent: Record<string, unknown>;
  description: string;
}

interface ComponentLibraryProps {
  templates: ComponentTemplate[];
}

const DraggableComponent: React.FC<{ template: ComponentTemplate }> = ({ template }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: template,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [template]);

  return (
    <div
      ref={drag}
      className={`p-4 border rounded-lg cursor-grab hover:shadow-md transition-all duration-200 bg-white hover:bg-gray-50 ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          <template.icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
          <p className="text-xs text-gray-500">{template.description}</p>
        </div>
      </div>
      
      {/* Preview thumbnail */}
      <div className="w-full h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
        <template.icon className="h-8 w-8 text-gray-400" />
      </div>
    </div>
  );
};

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ templates, onAddComponent }) => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Extended component templates
  const extendedTemplates: ComponentTemplate[] = [
    // Layout Components
    {
      id: 'hero-modern',
      name: 'Modern Hero',
      type: 'hero',
      icon: Grid,
      category: 'layout',
      preview: '/previews/hero-modern.png',
      description: 'Eye-catching hero section',
      defaultContent: {
        title: 'Welcome to Our Platform',
        subtitle: 'Build amazing experiences with our tools',
        buttonText: 'Get Started',
        backgroundImage: '',
        showStats: true,
        layout: 'centered'
      }
    },
    {
      id: 'hero-split',
      name: 'Split Hero',
      type: 'hero',
      icon: Grid,
      category: 'layout',
      preview: '/previews/hero-split.png',
      description: 'Hero with image and text split',
      defaultContent: {
        title: 'Transform Your Business',
        subtitle: 'Professional solutions for modern companies',
        buttonText: 'Learn More',
        imagePosition: 'right',
        layout: 'split'
      }
    },

    // Content Components
    {
      id: 'services-grid',
      name: 'Services Grid',
      type: 'services',
      icon: CreditCard,
      category: 'content',
      preview: '/previews/services-grid.png',
      description: 'Grid layout for services',
      defaultContent: {
        title: 'Our Services',
        subtitle: 'Everything you need to succeed',
        layout: 'grid',
        columns: 3,
        showPricing: true
      }
    },
    {
      id: 'services-list',
      name: 'Services List',
      type: 'services',
      icon: Package,
      category: 'content',
      preview: '/previews/services-list.png',
      description: 'List layout for services',
      defaultContent: {
        title: 'What We Offer',
        layout: 'list',
        showIcons: true,
        alternateLayout: true
      }
    },

    // Text Components
    {
      id: 'text-block',
      name: 'Text Block',
      type: 'text',
      icon: Type,
      category: 'content',
      preview: '/previews/text-block.png',
      description: 'Rich text content block',
      defaultContent: {
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        alignment: 'left',
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    {
      id: 'heading',
      name: 'Heading',
      type: 'heading',
      icon: Type,
      category: 'content',
      preview: '/previews/heading.png',
      description: 'Stylized heading text',
      defaultContent: {
        text: 'Section Title',
        level: 2,
        alignment: 'center',
        gradient: false
      }
    },

    // Media Components
    {
      id: 'image-gallery',
      name: 'Image Gallery',
      type: 'gallery',
      icon: ImageIcon,
      category: 'media',
      preview: '/previews/image-gallery.png',
      description: 'Interactive image gallery',
      defaultContent: {
        images: [],
        layout: 'masonry',
        showCaptions: true,
        lightbox: true
      }
    },
    {
      id: 'video-player',
      name: 'Video Player',
      type: 'video',
      icon: Video,
      category: 'media',
      preview: '/previews/video-player.png',
      description: 'Embedded video player',
      defaultContent: {
        videoUrl: '',
        autoplay: false,
        controls: true,
        poster: ''
      }
    },

    // Social Proof
    {
      id: 'testimonials-slider',
      name: 'Testimonials Slider',
      type: 'testimonials',
      icon: Quote,
      category: 'social',
      preview: '/previews/testimonials-slider.png',
      description: 'Customer testimonials carousel',
      defaultContent: {
        title: 'What Our Clients Say',
        layout: 'slider',
        autoplay: true,
        showAvatars: true,
        showRatings: true
      }
    },
    {
      id: 'testimonials-grid',
      name: 'Testimonials Grid',
      type: 'testimonials',
      icon: Star,
      category: 'social',
      preview: '/previews/testimonials-grid.png',
      description: 'Grid of customer reviews',
      defaultContent: {
        title: 'Customer Reviews',
        layout: 'grid',
        columns: 2,
        showRatings: true
      }
    },

    // Statistics
    {
      id: 'stats-counter',
      name: 'Stats Counter',
      type: 'stats',
      icon: BarChart,
      category: 'data',
      preview: '/previews/stats-counter.png',
      description: 'Animated statistics counters',
      defaultContent: {
        layout: 'horizontal',
        animated: true,
        stats: [
          { value: 1000, label: 'Happy Clients', icon: 'users' },
          { value: 99, label: 'Success Rate', suffix: '%', icon: 'target' },
          { value: 24, label: 'Support', suffix: '/7', icon: 'clock' }
        ]
      }
    },

    // Contact
    {
      id: 'contact-form',
      name: 'Contact Form',
      type: 'form',
      icon: Mail,
      category: 'forms',
      preview: '/previews/contact-form.png',
      description: 'Contact form with validation',
      defaultContent: {
        title: 'Get In Touch',
        fields: ['name', 'email', 'message'],
        submitText: 'Send Message',
        successMessage: 'Thank you for your message!'
      }
    },
    {
      id: 'newsletter',
      name: 'Newsletter Signup',
      type: 'newsletter',
      icon: Mail,
      category: 'forms',
      preview: '/previews/newsletter.png',
      description: 'Email subscription form',
      defaultContent: {
        title: 'Stay Updated',
        placeholder: 'Enter your email',
        buttonText: 'Subscribe',
        showPrivacyNote: true
      }
    },

    ...templates
  ];

  const categories = [
    { id: 'all', name: 'All Components', icon: Grid },
    { id: 'layout', name: 'Layout', icon: Grid },
    { id: 'content', name: 'Content', icon: Type },
    { id: 'media', name: 'Media', icon: ImageIcon },
    { id: 'social', name: 'Social Proof', icon: Star },
    { id: 'data', name: 'Data & Stats', icon: BarChart },
    { id: 'forms', name: 'Forms', icon: Mail }
  ];

  const filteredTemplates = extendedTemplates.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`w-80 flex flex-col border-r ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } ${isCollapsed ? 'w-16' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${
            isCollapsed ? 'hidden' : ''
          }`}>
            Components
          </h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronDown className={`h-4 w-4 transform transition-transform ${
              isCollapsed ? 'rotate-90' : ''
            }`} />
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* Search */}
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Categories */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Components List */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <DraggableComponent
                key={template.id}
                template={template}
              />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No components found</p>
              <p className="text-gray-400 text-xs mt-1">Try adjusting your search or category</p>
            </div>
          )}
        </div>
      )}

      {/* Collapsed View */}
      {isCollapsed && (
        <div className="p-2">
          {categories.slice(0, 6).map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setIsCollapsed(false);
              }}
              className={`w-full p-3 rounded-lg mb-2 transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={category.name}
            >
              <category.icon className="h-5 w-5 mx-auto" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentLibrary;
