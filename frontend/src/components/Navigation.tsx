import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Home, Code, Users, Menu, X, LogOut, User, Shield } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  authProvider: string;
}

export interface NavigationProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
  onLogout: () => void;
  user?: User | null;
}

const Navigation = ({ onLogout, user }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get current route from location
  const currentView = location.pathname === '/' ? 'home' : location.pathname.substring(1);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/chat' },
    { id: 'room', label: 'AI Room', icon: Users, path: '/room' },
    { id: 'builder', label: 'Project Builder', icon: Code, path: '/builder' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-inter ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
          : 'bg-white border-b border-gray-100'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Notion style */}
          <motion.div
            className="flex-shrink-0 cursor-pointer flex items-center gap-2"
            onClick={() => handleNavigation('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-black">
              Gideon
            </h1>
          </motion.div>

          {/* Desktop Navigation - Notion style */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  >
                    <Button
                      onClick={() => handleNavigation(item.path)}
                      variant="ghost"
                      size="sm"
                      className={`relative px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-black bg-gray-100'
                          : 'text-gray-600 hover:text-black hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}

                      {/* Active indicator - Notion style */}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-1 right-1 h-0.5 bg-black rounded-full"
                          layoutId="activeIndicator"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* User Menu & Mobile Menu Button - Notion style */}
          <div className="flex items-center space-x-3">
            {/* User Info (Desktop) */}
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-50 border border-gray-200">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium">{user.username}</span>
                </div>
                <Button
                  onClick={onLogout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden text-gray-500 hover:text-black hover:bg-gray-50 p-2"
              variant="ghost"
              size="sm"
            >
              {isMobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Notion style */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-3 space-y-1 border-t border-gray-100">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Button
                        onClick={() => handleNavigation(item.path)}
                        variant="ghost"
                        className={`w-full justify-start px-4 py-3 rounded-md transition-all duration-200 ${
                          isActive
                            ? 'text-black bg-gray-100 border-l-2 border-black'
                            : 'text-gray-600 hover:text-black hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </Button>
                    </motion.div>
                  );
                })}

                {/* Mobile User Menu - Notion style */}
                {user && (
                  <motion.div
                    className="pt-3 mt-3 border-t border-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <div className="flex items-center justify-between px-4 py-2">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">{user.username}</span>
                      </div>
                      <Button
                        onClick={onLogout}
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
