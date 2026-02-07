import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGetInstagramFeedConfig } from '@/hooks/useQueries';
import { Instagram } from 'lucide-react';

export default function InstagramFeed() {
  const { t, language } = useLanguage();
  const { data: config, isLoading } = useGetInstagramFeedConfig();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return null;
  }

  if (!config || !config.isVisible) {
    return null;
  }

  const title = language === 'es' ? config.title.spanish : config.title.english;
  const description = language === 'es' ? config.description.spanish : config.description.english;

  return (
    <section
      id="instagram"
      ref={sectionRef}
      className="py-20 px-4 bg-gradient-to-br from-rose-50/50 via-pink-50/50 to-purple-50/50 dark:from-rose-950/10 dark:via-pink-950/10 dark:to-purple-950/10 fade-in"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 mb-4">
            <Instagram className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            {title || t('instagram.title')}
          </h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        <div className="fade-in">
          {config.instagramEmbedCode ? (
            <div
              className="instagram-embed-container rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-900 p-4"
              dangerouslySetInnerHTML={{ __html: config.instagramEmbedCode }}
            />
          ) : config.instagramHandle ? (
            <div className="text-center p-12 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
              <Instagram className="w-16 h-16 mx-auto mb-4 text-rose-400" />
              <p className="text-xl font-semibold mb-2">
                @{config.instagramHandle}
              </p>
              <a
                href={`https://instagram.com/${config.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-600 text-white rounded-full hover:from-rose-500 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Instagram className="w-5 h-5 mr-2" />
                {t('instagram.visitProfile')}
              </a>
            </div>
          ) : (
            <div className="text-center p-12 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
              <Instagram className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {t('instagram.notConfigured')}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
