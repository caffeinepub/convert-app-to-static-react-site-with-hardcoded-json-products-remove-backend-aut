import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  id: string;
  nameKey: string;
  descKey: string;
  tagKey: string;
  image: string;
}

const products: Product[] = [
  {
    id: '1',
    nameKey: 'product.customNutella.name',
    descKey: 'product.customNutella.desc',
    tagKey: 'product.customNutella.tag',
    image: '/assets/generated/custom-nutella-jar.dim_400x400.jpg',
  },
  {
    id: '2',
    nameKey: 'product.customPlaydoh.name',
    descKey: 'product.customPlaydoh.desc',
    tagKey: 'product.customPlaydoh.tag',
    image: '/assets/generated/custom-playdoh.dim_400x400.jpg',
  },
  {
    id: '3',
    nameKey: 'product.customPringles.name',
    descKey: 'product.customPringles.desc',
    tagKey: 'product.customPringles.tag',
    image: '/assets/generated/custom-pringles.dim_400x400.jpg',
  },
  {
    id: '4',
    nameKey: 'product.chocolateBox.name',
    descKey: 'product.chocolateBox.desc',
    tagKey: 'product.chocolateBox.tag',
    image: '/assets/generated/deluxe-milk-box.dim_400x400.jpg',
  },
  {
    id: '5',
    nameKey: 'product.pyramidBox.name',
    descKey: 'product.pyramidBox.desc',
    tagKey: 'product.pyramidBox.tag',
    image: '/assets/generated/pyramid-shaker-box.dim_400x400.jpg',
  },
  {
    id: '6',
    nameKey: 'product.castleBox.name',
    descKey: 'product.castleBox.desc',
    tagKey: 'product.castleBox.tag',
    image: '/assets/generated/castle-party-box.dim_400x400.jpg',
  },
  {
    id: '7',
    nameKey: 'product.giftBags.name',
    descKey: 'product.giftBags.desc',
    tagKey: 'product.giftBags.tag',
    image: '/assets/generated/custom-nutella-jar.dim_400x400.jpg',
  },
  {
    id: '8',
    nameKey: 'product.candyJars.name',
    descKey: 'product.candyJars.desc',
    tagKey: 'product.candyJars.tag',
    image: '/assets/generated/deluxe-milk-box.dim_400x400.jpg',
  },
  {
    id: '9',
    nameKey: 'product.partyFavors.name',
    descKey: 'product.partyFavors.desc',
    tagKey: 'product.partyFavors.tag',
    image: '/assets/generated/castle-party-box.dim_400x400.jpg',
  },
  {
    id: '10',
    nameKey: 'product.customCookies.name',
    descKey: 'product.customCookies.desc',
    tagKey: 'product.customCookies.tag',
    image: '/assets/generated/custom-playdoh.dim_400x400.jpg',
  },
  {
    id: '11',
    nameKey: 'product.giftBaskets.name',
    descKey: 'product.giftBaskets.desc',
    tagKey: 'product.giftBaskets.tag',
    image: '/assets/generated/pyramid-shaker-box.dim_400x400.jpg',
  },
  {
    id: '12',
    nameKey: 'product.themeSets.name',
    descKey: 'product.themeSets.desc',
    tagKey: 'product.themeSets.tag',
    image: '/assets/generated/custom-pringles.dim_400x400.jpg',
  },
];

const Products = () => {
  const { t } = useLanguage();

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-background to-rose-50/30 dark:to-rose-950/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
              {t('products.title')}
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="fade-in group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white dark:bg-gray-900"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={t(product.nameKey)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-rose-400 to-pink-600 text-white border-0 shadow-lg">
                  {t(product.tagKey)}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-rose-500 transition-colors duration-300">
                  {t(product.nameKey)}
                </h3>
                <p className="text-foreground/70">{t(product.descKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
