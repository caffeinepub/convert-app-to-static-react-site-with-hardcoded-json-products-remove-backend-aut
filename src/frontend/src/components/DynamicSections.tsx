import { useGetAllAdditionalSections } from '../hooks/useQueries';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2 } from 'lucide-react';
import { BlockType } from '../backend';

export default function DynamicSections() {
  const { data: sections = [], isLoading } = useGetAllAdditionalSections();
  const { language } = useLanguage();

  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  const visibleSections = sections
    .filter((section) => section.isVisible)
    .sort((a, b) => Number(a.order) - Number(b.order));

  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <>
      {visibleSections.map((section) => {
        const title = language === 'en' ? section.title.english : section.title.spanish;
        const description = language === 'en' ? section.description.english : section.description.spanish;
        const backgroundStyle = section.background
          ? { backgroundImage: `url(${section.background.getDirectURL()})` }
          : {};

        const visibleBlocks = section.contentBlocks
          .filter((block) => block.isVisible)
          .sort((a, b) => Number(a.order) - Number(b.order));

        return (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className="py-20 relative"
            style={backgroundStyle}
          >
            {section.background && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            )}
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-12 fade-in">
                <h2
                  className={`text-4xl md:text-5xl font-bold mb-4 ${
                    section.background
                      ? 'text-white'
                      : 'bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent'
                  }`}
                >
                  {title}
                </h2>
                <p
                  className={`text-lg max-w-2xl mx-auto ${
                    section.background ? 'text-white/90' : 'text-muted-foreground'
                  }`}
                >
                  {description}
                </p>
              </div>

              {section.image && (
                <div className="mb-12 fade-in">
                  <img
                    src={section.image.getDirectURL()}
                    alt={title}
                    className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
                  />
                </div>
              )}

              {visibleBlocks.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleBlocks.map((block) => {
                    const blockTitle = language === 'en' ? block.title.english : block.title.spanish;
                    const blockContent = language === 'en' ? block.content.english : block.content.spanish;

                    return (
                      <div
                        key={Number(block.id)}
                        className="fade-in bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        {block.blockType === BlockType.imageBlock && block.image && (
                          <img
                            src={block.image.getDirectURL()}
                            alt={blockTitle}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}

                        {block.blockType === BlockType.mixedBlock && block.image && (
                          <img
                            src={block.image.getDirectURL()}
                            alt={blockTitle}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}

                        <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
                          {blockTitle}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{blockContent}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

