import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, Code, History, Crown } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
}

const tabs: Tab[] = [
  { id: 'chat', label: 'Chat', icon: MessageSquare, shortcut: 'Ctrl+1' },
  { id: 'conversation tree', label: 'Conversation Tree', icon: Code, shortcut: 'Ctrl+2' },
  { id: 'history', label: 'History', icon: History, shortcut: 'Ctrl+3' },
];

interface ChatTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const ChatTabs = ({ activeTab, onTabChange }: ChatTabsProps) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            onTabChange('chat');
            break;
          case '2':
            e.preventDefault();
            onTabChange('conversation tree');
            break;
          case '3':
            e.preventDefault();
            onTabChange('history');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTabChange]);

  return (
    <div className="relative border-b border-gray-200 bg-white">
      {/* Tab Navigation - Notion style */}
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isHovered = hoveredTab === tab.id;

            return (
              <div
                key={tab.id}
                className="relative"
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <Button
                  onClick={() => onTabChange(tab.id)}
                  variant="ghost"
                  size="sm"
                  className={`relative h-12 px-4 font-medium text-sm border-b-2 rounded-none transition-all duration-200 ${
                    isActive
                      ? 'text-black border-black bg-transparent hover:bg-gray-50'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${
                      isActive 
                        ? 'text-black' 
                        : 'text-gray-500'
                    }`} />
                    <span>{tab.label}</span>
                    
                    {/* Keyboard shortcut hint - Notion style */}
                    <span className="text-xs text-gray-400 ml-2 hidden md:inline font-mono">
                      {tab.shortcut.replace('Ctrl', '⌘')}
                    </span>
                  </div>
                </Button>

                {/* Subtle hover indicator */}
                {!isActive && isHovered && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Pro indicator - Notion style */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md">
          <Crown className="w-3 h-3 text-gray-600" />
          <span className="text-xs font-medium text-gray-700">Pro</span>
        </div>
      </div>
    </div>
  );
};

export default ChatTabs;
