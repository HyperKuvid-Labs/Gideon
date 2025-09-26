import { Button } from '@/components/ui/button';
import { Github, Mail, FileText, Info } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand - Notion style */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <h3 className="text-lg font-semibold text-black">Gideon</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              AI-powered chat platform for collaborative conversations and project building.
            </p>
          </div>

          {/* Platform Links - Notion style */}
          <div className="space-y-4">
            <h4 className="font-medium text-black text-sm">Platform</h4>
            <div className="space-y-3">
              <a 
                href="#about" 
                className="flex items-center text-sm text-gray-600 hover:text-black transition-colors group"
              >
                <Info className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                About
              </a>
              <a 
                href="#docs" 
                className="flex items-center text-sm text-gray-600 hover:text-black transition-colors group"
              >
                <FileText className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                Documentation
              </a>
            </div>
          </div>

          {/* Connect Links - Notion style */}
          <div className="space-y-4">
            <h4 className="font-medium text-black text-sm">Connect</h4>
            <div className="space-y-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-black transition-colors group"
              >
                <Github className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                GitHub
              </a>
              <a 
                href="mailto:contact@gidvion.com" 
                className="flex items-center text-sm text-gray-600 hover:text-black transition-colors group"
              >
                <Mail className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                Contact
              </a>
            </div>
          </div>

          {/* Version Info - Notion style */}
          <div className="space-y-4">
            <h4 className="font-medium text-black text-sm">Version</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Gideon v1.0.0</p>
              <p>Updated {new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Notion style */}
        <div className="border-t border-gray-100 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2024 Gidvion. All rights reserved.
            </p>
            
            {/* Legal Links - Notion style */}
            <div className="flex items-center gap-6">
              <a 
                href="#privacy" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="#terms" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
