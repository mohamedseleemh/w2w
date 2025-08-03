import React from 'react';
import { type PageElement } from '../admin/VisualEditor/PageBuilder';
import { Shield } from 'lucide-react';

interface FooterRendererProps {
  element: PageElement;
}

const FooterRenderer: React.FC<FooterRendererProps> = ({ element }) => {
  const { text, links } = element.content;
  const { backgroundColor, textColor } = element.styles;

  return (
    <footer style={{ backgroundColor, color: textColor }} className="w-full py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center items-center mb-4">
          <Shield className="h-6 w-6 mr-2" />
          <span className="font-semibold">KYCtrust</span>
        </div>
        <p className="mb-4">{text}</p>
        <div className="flex justify-center space-x-4 space-x-reverse">
          {(links || []).map((link: any, index: number) => (
            <a key={index} href={link.href} className="hover:underline">
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default FooterRenderer;
