import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';

const ThemeToggle = () => {
  // Since we're following strict black and white design, 
  // this component serves as a design system indicator rather than theme switcher
  const [isNotionTheme, setIsNotionTheme] = useState(true);

  useEffect(() => {
    // Always ensure we're in the clean black and white mode
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('notion-clean');
    localStorage.setItem('theme', 'notion-clean');
    setIsNotionTheme(true);
  }, []);

  const toggleTheme = () => {
    // For consistency with Notion's design, we maintain the clean theme
    // This could be extended to switch between different clean variations
    const isCurrentlyClean = document.documentElement.classList.contains('notion-clean');
    
    if (isCurrentlyClean) {
      // Could switch to a different clean variation in the future
      document.documentElement.classList.remove('notion-clean');
      document.documentElement.classList.add('notion-minimal');
      localStorage.setItem('theme', 'notion-minimal');
      setIsNotionTheme(false);
    } else {
      document.documentElement.classList.remove('notion-minimal');
      document.documentElement.classList.add('notion-clean');
      localStorage.setItem('theme', 'notion-clean');
      setIsNotionTheme(true);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 border border-gray-200 hover:bg-gray-50 transition-colors font-inter"
      title="Design system active"
    >
      {isNotionTheme ? (
        <Check className="h-4 w-4 text-gray-600" />
      ) : (
        <Palette className="h-4 w-4 text-gray-600" />
      )}
      <span className="sr-only">Clean design system active</span>
    </Button>
  );
};

export default ThemeToggle;
