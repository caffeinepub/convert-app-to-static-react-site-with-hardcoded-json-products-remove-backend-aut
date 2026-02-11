import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Menu, X, Languages, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminSession } from '../hooks/useAdminSession';

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated } = useAdminSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setIsMobileMenuOpen(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate({ to: '/admin' });
    } else {
      navigate({ to: '/admin/login' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center space-x-3 transition-transform hover:scale-105 duration-300"
          >
            <img
              src="/assets/PHOTO-2025-04-04-00-07-02-1.jpg"
              alt="A&A Boxes"
              className="h-16 w-16 object-cover rounded-full shadow-md"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
              A&A Boxes
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              {t('nav.products')}
            </button>
            <button
              onClick={() => scrollToSection('packages')}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              {t('nav.packages')}
            </button>
            <button
              onClick={() => scrollToSection('how-to-order')}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              {t('nav.howToOrder')}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              {t('nav.about')}
            </button>
            <button
              onClick={() => scrollToSection('instagram-feed')}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              {t('nav.instagram')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              {t('nav.contact')}
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="text-foreground/80 hover:text-foreground"
            >
              <Languages className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAdminClick}
              className="border-rose-400 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="text-foreground/80 hover:text-foreground"
            >
              <Languages className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground/80 hover:text-foreground"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-background/95 backdrop-blur-md border-t">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-left"
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => scrollToSection('products')}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-left"
              >
                {t('nav.products')}
              </button>
              <button
                onClick={() => scrollToSection('packages')}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-left"
              >
                {t('nav.packages')}
              </button>
              <button
                onClick={() => scrollToSection('how-to-order')}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-left"
              >
                {t('nav.howToOrder')}
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-left"
              >
                {t('nav.about')}
              </button>
              <button
                onClick={() => scrollToSection('instagram-feed')}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-left"
              >
                {t('nav.instagram')}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-left"
              >
                {t('nav.contact')}
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAdminClick}
                className="border-rose-400 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 justify-start"
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
