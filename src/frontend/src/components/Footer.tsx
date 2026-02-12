import { Heart, Download } from 'lucide-react';
import { SiFacebook, SiInstagram } from 'react-icons/si';
import { useLanguage } from '@/contexts/LanguageContext';
import { downloadUiTexts } from '@/utils/downloadUiTexts';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const { t } = useLanguage();

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
    }
  };

  const handleDownloadTexts = () => {
    downloadUiTexts();
  };

  return (
    <footer className="bg-gradient-to-b from-background to-rose-50/50 dark:to-rose-950/20 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/PHOTO-2025-04-04-00-07-02-1.jpg"
                alt="A&A Boxes"
                className="h-14 w-14 object-cover rounded-full shadow-md"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
                A&A Boxes
              </span>
            </div>
            <p className="text-foreground/70 text-sm">
              {t('footer.tagline')}
            </p>
            <div className="space-y-2 text-sm text-foreground/70">
              <p>
                <a 
                  href={`mailto:${t('contact.info.emailValue')}`}
                  className="hover:text-rose-500 transition-colors"
                >
                  {t('contact.info.emailValue')}
                </a>
              </p>
              <p>
                <a 
                  href={`tel:${t('contact.info.phoneValue')}`}
                  className="hover:text-rose-500 transition-colors"
                >
                  {t('contact.info.phoneValue')}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-foreground/70 hover:text-rose-500 transition-colors text-sm"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('packages')}
                  className="text-foreground/70 hover:text-rose-500 transition-colors text-sm"
                >
                  {t('nav.packages')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('products')}
                  className="text-foreground/70 hover:text-rose-500 transition-colors text-sm"
                >
                  {t('nav.products')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-to-order')}
                  className="text-foreground/70 hover:text-rose-500 transition-colors text-sm"
                >
                  {t('nav.howToOrder')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-foreground/70 hover:text-rose-500 transition-colors text-sm"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-foreground/70 hover:text-rose-500 transition-colors text-sm"
                >
                  {t('nav.contact')}
                </button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadTexts}
                  className="text-foreground/70 hover:text-rose-500 transition-colors text-sm p-0 h-auto font-normal justify-start"
                >
                  <Download size={14} className="mr-1.5" />
                  Download UI Texts
                </Button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.services')}</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>{t('footer.service1')}</li>
              <li>{t('footer.service2')}</li>
              <li>{t('footer.service3')}</li>
              <li>{t('footer.service4')}</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.followUs')}</h3>
            <div className="flex space-x-4">
              <a
                href={t('contact.social.facebook')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
                aria-label="Facebook"
              >
                <SiFacebook size={18} />
              </a>
              <a
                href={t('contact.social.instagram')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
                aria-label="Instagram"
              >
                <SiInstagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-8 text-center text-sm text-foreground/70">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            {t('footer.copyright')}{' '}
            <Heart className="inline-block text-rose-500 fill-current" size={16} />{' '}
            {t('footer.using')}{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-500 hover:text-rose-600 transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
