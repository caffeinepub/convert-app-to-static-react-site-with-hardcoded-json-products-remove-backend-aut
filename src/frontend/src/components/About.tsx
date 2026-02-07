import { Heart, Sparkles, Award, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
                {t('about.title')}
              </span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="fade-in space-y-6">
              <p className="text-lg text-foreground/80 leading-relaxed">
                {t('about.text1')}
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                {t('about.text2')}
              </p>
              <div className="flex items-center space-x-2 text-rose-500">
                <Heart className="fill-current" size={24} />
                <span className="text-lg font-semibold">{t('about.tagline')}</span>
              </div>
            </div>

            <div className="fade-in animation-delay-300 grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-rose-600 mb-2">{t('about.stat1.number')}</h3>
                <p className="text-foreground/70">{t('about.stat1.label')}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-pink-600 mb-2">{t('about.stat2.number')}</h3>
                <p className="text-foreground/70">{t('about.stat2.label')}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-rose-50 dark:from-purple-950/20 dark:to-rose-950/20 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-purple-600 mb-2">{t('about.stat3.number')}</h3>
                <p className="text-foreground/70">{t('about.stat3.label')}</p>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-purple-50 dark:from-rose-950/20 dark:to-purple-950/20 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-rose-600 mb-2">{t('about.stat4.number')}</h3>
                <p className="text-foreground/70">{t('about.stat4.label')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
