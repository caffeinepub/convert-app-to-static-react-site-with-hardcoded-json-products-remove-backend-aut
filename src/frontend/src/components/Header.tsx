import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Menu, X, Languages, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

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
    if (isAuthenticated && isAdmin) {
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
              className="text-foreground/80 hover:text-rose-500 transition-colors duration-300 font-medium"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => scrollToSection('packages')}
              className="text-foreground/80 hover:text-rose-500 transition-colors duration-300 font-medium"
            >
              {t('nav.packages')}
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="text-foreground/80 hover:text-rose-500 transition-colors duration-300 font-medium"
            >
              {t('nav.products')}
            </button>
            <button
              onClick={() => scrollToSection('how-to-order')}
              className="text-foreground/80 hover:text-rose-500 transition-colors duration-300 font-medium"
            >
              {t('nav.howToOrder')}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground/80 hover:text-rose-500 transition-colors duration-300 font-medium"
            >
              {t('nav.about')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-foreground/80 hover:text-rose-500 transition-colors duration-300 font-medium"
            >
              {t('nav.contact')}
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-foreground/80 hover:text-rose-500 transition-colors duration-300 font-medium"
              aria-label="Toggle language"
            >
              <Languages size={18} />
              <span className="text-sm uppercase">{language}</span>
            </button>
            <button
              onClick={handleAdminClick}
              className="flex items-center space-x-1 text-foreground/80 hover:text-rose-500 transition-colors duration-300 font-medium"
              aria-label="Admin"
            >
              <Shield size={18} />
            </button>
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {t('nav.getStarted')}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-rose-500 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-300 rounded-lg"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => scrollToSection('packages')}
              className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-300 rounded-lg"
            >
              {t('nav.packages')}
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-300 rounded-lg"
            >
              {t('nav.products')}
            </button>
            <button
              onClick={() => scrollToSection('how-to-order')}
              className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-300 rounded-lg"
            >
              {t('nav.howToOrder')}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-300 rounded-lg"
            >
              {t('nav.about')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-300 rounded-lg"
            >
              {t('nav.contact')}
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 w-full text-left px-4 py-2 text-foreground/80 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-300 rounded-lg"
            >
              <Languages size={18} />
              <span className="text-sm uppercase">{language === 'en' ? 'English' : 'Español'}</span>
            </button>
            <button
              onClick={handleAdminClick}
              className="flex items-center space-x-2 w-full text-left px-4 py-2 text-foreground/80 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-300 rounded-lg"
            >
              <Shield size={18} />
              <span>Admin</span>
            </button>
            <Button
              onClick={() => scrollToSection('contact')}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white"
            >
              {t('nav.getStarted')}
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
