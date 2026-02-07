import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ShoppingCart, Palette, CheckCircle, CreditCard, Truck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Step {
  id: number;
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
}

const HowToOrder = () => {
  const { t } = useLanguage();

  const steps: Step[] = [
    {
      id: 1,
      icon: <Package className="w-8 h-8" />,
      titleKey: 'howToOrder.step1.title',
      descKey: 'howToOrder.step1.desc',
    },
    {
      id: 2,
      icon: <ShoppingCart className="w-8 h-8" />,
      titleKey: 'howToOrder.step2.title',
      descKey: 'howToOrder.step2.desc',
    },
    {
      id: 3,
      icon: <Palette className="w-8 h-8" />,
      titleKey: 'howToOrder.step3.title',
      descKey: 'howToOrder.step3.desc',
    },
    {
      id: 4,
      icon: <CheckCircle className="w-8 h-8" />,
      titleKey: 'howToOrder.step4.title',
      descKey: 'howToOrder.step4.desc',
    },
    {
      id: 5,
      icon: <CreditCard className="w-8 h-8" />,
      titleKey: 'howToOrder.step5.title',
      descKey: 'howToOrder.step5.desc',
    },
    {
      id: 6,
      icon: <Truck className="w-8 h-8" />,
      titleKey: 'howToOrder.step6.title',
      descKey: 'howToOrder.step6.desc',
    },
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
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
    <section id="how-to-order" className="py-24 bg-gradient-to-b from-rose-50/30 to-background dark:from-rose-950/10 dark:to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
              {t('howToOrder.title')}
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            {t('howToOrder.subtitle')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => (
              <Card
                key={step.id}
                className="fade-in group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white dark:bg-gray-900"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {step.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-3xl font-bold text-rose-400 mr-2">{step.id}</span>
                        <h3 className="text-lg font-semibold group-hover:text-rose-500 transition-colors duration-300">
                          {t(step.titleKey)}
                        </h3>
                      </div>
                      <p className="text-foreground/70 text-sm">{t(step.descKey)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center fade-in space-y-6">
            <Button
              onClick={scrollToContact}
              size="lg"
              className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
            >
              {t('howToOrder.cta')}
            </Button>
            <p className="text-foreground/70 max-w-xl mx-auto">
              {t('howToOrder.contact')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToOrder;
