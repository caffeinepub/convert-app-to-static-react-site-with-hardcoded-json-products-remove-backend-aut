import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface Package {
  id: string;
  nameKey: string;
  descKey: string;
  tagKey: string;
  image: string;
}

const packages: Package[] = [
  {
    id: '1',
    nameKey: 'package.basic.name',
    descKey: 'package.basic.desc',
    tagKey: 'package.basic.tag',
    image: '/assets/generated/castle-party-box.dim_400x400.jpg',
  },
  {
    id: '2',
    nameKey: 'package.deluxe.name',
    descKey: 'package.deluxe.desc',
    tagKey: 'package.deluxe.tag',
    image: '/assets/generated/deluxe-milk-box.dim_400x400.jpg',
  },
  {
    id: '3',
    nameKey: 'package.premium.name',
    descKey: 'package.premium.desc',
    tagKey: 'package.premium.tag',
    image: '/assets/generated/pyramid-shaker-box.dim_400x400.jpg',
  },
  {
    id: '4',
    nameKey: 'package.corporate.name',
    descKey: 'package.corporate.desc',
    tagKey: 'package.corporate.tag',
    image: '/assets/generated/custom-pringles.dim_400x400.jpg',
  },
  {
    id: '5',
    nameKey: 'package.event.name',
    descKey: 'package.event.desc',
    tagKey: 'package.event.tag',
    image: '/assets/generated/custom-playdoh.dim_400x400.jpg',
  },
  {
    id: '6',
    nameKey: 'package.seasonal.name',
    descKey: 'package.seasonal.desc',
    tagKey: 'package.seasonal.tag',
    image: '/assets/generated/custom-nutella-jar.dim_400x400.jpg',
  },
];

const Packages = () => {
  const { t } = useLanguage();

  return (
    <section id="packages" className="py-24 bg-gradient-to-b from-rose-50/30 to-background dark:from-rose-950/10 dark:to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
              {t('packages.title')}
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            {t('packages.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <Card
              key={pkg.id}
              className="fade-in group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white dark:bg-gray-900"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={pkg.image}
                  alt={t(pkg.nameKey)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-rose-400 to-pink-600 text-white border-0 shadow-lg">
                  {t(pkg.tagKey)}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-rose-500 transition-colors duration-300">
                  {t(pkg.nameKey)}
                </h3>
                <p className="text-foreground/70">{t(pkg.descKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
