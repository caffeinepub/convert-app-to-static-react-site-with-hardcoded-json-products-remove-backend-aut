import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {
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

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/hero-background.dim_1200x600.jpg"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 via-pink-500/20 to-purple-500/30 backdrop-blur-[2px]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-1/4 left-1/4 text-rose-300 animate-pulse opacity-60" size={24} />
        <Heart className="absolute top-1/3 right-1/4 text-pink-300 animate-pulse opacity-60 animation-delay-300" size={20} />
        <Gift className="absolute bottom-1/3 left-1/3 text-purple-300 animate-pulse opacity-60 animation-delay-600" size={22} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Circular Logo */}
          <div className="fade-in flex justify-center mb-6">
            <img
              src="/assets/PHOTO-2025-04-04-00-07-02-1.jpg"
              alt="A&A Boxes"
              className="h-32 w-32 md:h-40 md:w-40 object-cover rounded-full shadow-2xl ring-4 ring-white/50 dark:ring-gray-800/50"
            />
          </div>

          <div className="fade-in space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-rose-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                {t('hero.title1')}
              </span>
              <br />
              <span className="text-foreground">{t('hero.title2')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

          <div className="fade-in animation-delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => scrollToSection('products')}
              size="lg"
              className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
            >
              <Sparkles className="mr-2" size={20} />
              {t('hero.exploreCollection')}
            </Button>
            <Button
              onClick={() => scrollToSection('contact')}
              size="lg"
              variant="outline"
              className="border-2 border-rose-400 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
            >
              <Heart className="mr-2" size={20} />
              {t('hero.customOrders')}
            </Button>
          </div>

          {/* Features */}
          <div className="fade-in animation-delay-600 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('hero.feature1.title')}</h3>
              <p className="text-foreground/70">{t('hero.feature1.desc')}</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('hero.feature2.title')}</h3>
              <p className="text-foreground/70">{t('hero.feature2.desc')}</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('hero.feature3.title')}</h3>
              <p className="text-foreground/70">{t('hero.feature3.desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
