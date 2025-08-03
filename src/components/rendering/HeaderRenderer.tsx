import React from 'react';
import { type PageElement } from '../admin/VisualEditor/PageBuilder';
import { Shield, Menu, X } from 'lucide-react';

interface HeaderRendererProps {
  element: PageElement;
}

const HeaderRenderer: React.FC<HeaderRendererProps> = ({ element }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const { logoUrl, links } = element.content;
  const { backgroundColor, textColor } = element.styles;

  return (
    <header style={{ backgroundColor, color: textColor }} className="w-full shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-reverse space-x-3">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-2 rounded-xl">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-8 w-8" />
              ) : (
                <Shield className="h-8 w-8 text-white" />
              )}
            </div>
            <span className="text-xl font-bold">KYCtrust</span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-reverse space-x-6">
            {(links || []).map((link: any, index: number) => (
              <a key={index} href={link.href} className="hover:text-blue-500 transition-colors">
                {link.text}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              {(links || []).map((link: any, index: number) => (
                <a key={index} href={link.href} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  {link.text}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderRenderer;
