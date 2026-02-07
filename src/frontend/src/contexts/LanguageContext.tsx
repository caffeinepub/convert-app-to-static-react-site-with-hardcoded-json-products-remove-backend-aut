import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.packages': 'Packages',
    'nav.products': 'Products',
    'nav.howToOrder': 'How to Order',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Get Started',
    
    // Hero
    'hero.title1': 'Luxury Gift Boxes',
    'hero.title2': 'Made with Love',
    'hero.subtitle': 'Create unforgettable moments with our premium, customizable gift boxes designed to celebrate life\'s special occasions',
    'hero.exploreCollection': 'Explore Our Collection',
    'hero.customOrders': 'Custom Orders',
    'hero.feature1.title': 'Premium Quality',
    'hero.feature1.desc': 'Handcrafted with the finest materials',
    'hero.feature2.title': 'Fully Customizable',
    'hero.feature2.desc': 'Personalize every detail to perfection',
    'hero.feature3.title': 'Made with Love',
    'hero.feature3.desc': 'Each box tells a unique story',
    
    // Packages Section (Page 2)
    'packages.title': 'Our Packages',
    'packages.subtitle': 'Choose from our curated package options designed for every occasion',
    
    'package.basic.name': 'Basic Package',
    'package.basic.desc': 'Perfect starter package with essential customization options. Includes personalized labels, themed decorations, and quality gift items.',
    'package.basic.tag': 'Starter',
    
    'package.deluxe.name': 'Deluxe Package',
    'package.deluxe.desc': 'Enhanced package with premium items and advanced customization. Features luxury materials, exclusive designs, and premium gift selections.',
    'package.deluxe.tag': 'Popular',
    
    'package.premium.name': 'Premium Package',
    'package.premium.desc': 'Our most luxurious package with full customization and premium contents. Includes designer elements, high-end gifts, and white-glove service.',
    'package.premium.tag': 'Luxury',
    
    'package.corporate.name': 'Corporate Package',
    'package.corporate.desc': 'Professional packages for business events and client appreciation. Branded with your company logo and tailored to corporate standards.',
    'package.corporate.tag': 'Business',
    
    'package.event.name': 'Event Package',
    'package.event.desc': 'Comprehensive packages for large celebrations and special events. Bulk ordering available with consistent quality and theming.',
    'package.event.tag': 'Events',
    
    'package.seasonal.name': 'Seasonal Package',
    'package.seasonal.desc': 'Limited edition packages celebrating holidays and special seasons. Features seasonal themes, colors, and festive elements.',
    'package.seasonal.tag': 'Limited',
    
    // Products Section (Pages 3-5)
    'products.title': 'Our Products',
    'products.subtitle': 'Discover our curated selection of premium gift items, each designed to create unforgettable moments',
    
    'product.customNutella.name': 'Custom Nutella Jar',
    'product.customNutella.desc': 'Personalized Nutella jars with custom labels featuring names, photos, or special messages. Perfect for sweet celebrations and unique gift giving.',
    'product.customNutella.tag': 'Custom',
    
    'product.customPlaydoh.name': 'Custom Play-Doh',
    'product.customPlaydoh.desc': 'Branded Play-Doh containers with personalized packaging and labels. Ideal for children\'s parties, creative activities, and memorable party favors.',
    'product.customPlaydoh.tag': 'Kids',
    
    'product.customPringles.name': 'Custom Pringles',
    'product.customPringles.desc': 'Personalized Pringles cans with custom labels and designs. A fun and unique way to celebrate any occasion with a savory twist.',
    'product.customPringles.tag': 'Snacks',
    
    'product.chocolateBox.name': 'Deluxe Chocolate Box',
    'product.chocolateBox.desc': 'Premium chocolate gift box featuring an assortment of gourmet chocolates. Elegantly packaged for the ultimate indulgence experience.',
    'product.chocolateBox.tag': 'Deluxe',
    
    'product.pyramidBox.name': 'Pyramid Surprise Box',
    'product.pyramidBox.desc': 'Interactive surprise box with unique pyramid design. Shake to reveal hidden treats and gifts inside. Perfect for creating memorable unboxing moments.',
    'product.pyramidBox.tag': 'Special',
    
    'product.castleBox.name': 'Castle Party Box',
    'product.castleBox.desc': 'Magical celebration box perfect for princess-themed parties. Includes decorative castle design, party favors, and customizable elements for an enchanting experience.',
    'product.castleBox.tag': 'Party',
    
    'product.giftBags.name': 'Custom Gift Bags',
    'product.giftBags.desc': 'Personalized gift bags in various sizes and designs. Perfect for party favors, corporate gifts, and special occasion giveaways.',
    'product.giftBags.tag': 'Versatile',
    
    'product.candyJars.name': 'Candy Jars',
    'product.candyJars.desc': 'Decorative candy jars filled with premium sweets. Customizable labels and ribbon colors to match any theme or celebration.',
    'product.candyJars.tag': 'Sweet',
    
    'product.partyFavors.name': 'Party Favor Sets',
    'product.partyFavors.desc': 'Complete party favor sets with coordinated items. Includes small gifts, treats, and decorative elements for guest appreciation.',
    'product.partyFavors.tag': 'Party',
    
    'product.customCookies.name': 'Custom Cookies',
    'product.customCookies.desc': 'Decorated cookies with custom designs and messages. Individually wrapped and perfect for any celebration or corporate event.',
    'product.customCookies.tag': 'Treats',
    
    'product.giftBaskets.name': 'Gift Baskets',
    'product.giftBaskets.desc': 'Curated gift baskets with premium items. Customizable contents and presentation to suit any occasion or recipient preference.',
    'product.giftBaskets.tag': 'Premium',
    
    'product.themeSets.name': 'Themed Gift Sets',
    'product.themeSets.desc': 'Coordinated gift sets designed around specific themes. From baby showers to weddings, each set tells a cohesive story.',
    'product.themeSets.tag': 'Themed',
    
    // How to Order Section (Page 6)
    'howToOrder.title': 'How to Order',
    'howToOrder.subtitle': 'Follow these simple steps to create your perfect gift box',
    
    'howToOrder.step1.title': 'Choose Your Package',
    'howToOrder.step1.desc': 'Select from our range of packages that best fits your occasion and budget. Browse our Basic, Deluxe, Premium, Corporate, Event, or Seasonal options.',
    
    'howToOrder.step2.title': 'Select Your Products',
    'howToOrder.step2.desc': 'Pick the items you want to include in your gift box. Mix and match from our extensive product catalog to create the perfect combination.',
    
    'howToOrder.step3.title': 'Customize Your Design',
    'howToOrder.step3.desc': 'Personalize your gift box with custom labels, colors, messages, and themes. Share your vision with us and we\'ll bring it to life.',
    
    'howToOrder.step4.title': 'Review & Confirm',
    'howToOrder.step4.desc': 'Review your selections and customization details. We\'ll provide a preview and quote for your approval before production begins.',
    
    'howToOrder.step5.title': 'Place Your Order',
    'howToOrder.step5.desc': 'Confirm your order and complete payment. We accept multiple payment methods for your convenience.',
    
    'howToOrder.step6.title': 'We Create & Deliver',
    'howToOrder.step6.desc': 'Our team handcrafts your gift box with care. We\'ll keep you updated throughout the process and deliver to your specified location.',
    
    'howToOrder.cta': 'Start Your Order',
    'howToOrder.contact': 'Have questions? Contact us for personalized assistance.',
    
    // Instagram Section
    'instagram.title': 'Follow Us on Instagram',
    'instagram.visitProfile': 'Visit Our Instagram',
    'instagram.notConfigured': 'Instagram feed not configured yet',
    
    // About
    'about.title': 'About A&A Boxes',
    'about.subtitle': 'Crafting memorable experiences through thoughtfully designed gift boxes',
    'about.text1': 'At A&A Boxes, we believe that every gift tells a story. Our passion is creating premium, customizable gift boxes that transform ordinary moments into extraordinary memories.',
    'about.text2': 'Each box is carefully curated and handcrafted with attention to detail, ensuring that your gift reflects the love and thoughtfulness behind it. From birthdays to celebrations, we\'re here to make every occasion special.',
    'about.tagline': 'Made with love, delivered with care',
    'about.stat1.number': '500+',
    'about.stat1.label': 'Happy Customers',
    'about.stat2.number': '1000+',
    'about.stat2.label': 'Boxes Created',
    'about.stat3.number': '100%',
    'about.stat3.label': 'Love & Care',
    'about.stat4.number': '24/7',
    'about.stat4.label': 'Support',
    
    // Contact (Page 7)
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Ready to create something special? Let\'s bring your vision to life',
    'contact.form.name': 'Name',
    'contact.form.namePlaceholder': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.emailPlaceholder': 'your@email.com',
    'contact.form.message': 'Message',
    'contact.form.messagePlaceholder': 'Tell us about your dream gift box...',
    'contact.form.send': 'Send Message',
    'contact.form.successTitle': 'Thank you! We\'ll get back to you soon.',
    'contact.form.successDesc': 'Your message has been received.',
    'contact.info.title': 'Contact Information',
    'contact.info.email': 'Email',
    'contact.info.phone': 'Phone',
    'contact.info.whatsapp': 'WhatsApp',
    'contact.info.location': 'Location',
    'contact.info.emailValue': 'aaboxespr@gmail.com',
    'contact.info.phoneValue': '+1 (787) 605-5590',
    'contact.info.whatsappValue': '+1 (787) 605-5590',
    'contact.info.address': 'San Juan, Puerto Rico\nServing all areas',
    'contact.hours.title': 'Business Hours',
    'contact.hours.weekdays': 'Monday - Friday: 9:00 AM - 6:00 PM',
    'contact.hours.saturday': 'Saturday: 10:00 AM - 4:00 PM',
    'contact.hours.sunday': 'Sunday: By Appointment',
    'contact.social.title': 'Follow Us',
    'contact.social.desc': 'Stay connected for the latest designs and special offers',
    'contact.social.facebook': 'https://facebook.com/aaboxespr',
    'contact.social.instagram': 'https://instagram.com/aaboxespr',
    
    // Footer
    'footer.tagline': 'Creating unforgettable moments through premium, customizable gift boxes',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.service1': 'Custom Gift Boxes',
    'footer.service2': 'Party Packages',
    'footer.service3': 'Corporate Gifts',
    'footer.service4': 'Special Occasions',
    'footer.followUs': 'Follow Us',
    'footer.copyright': '© 2025. Built with',
    'footer.using': 'using',
  },
  es: {
    // Header
    'nav.home': 'Inicio',
    'nav.packages': 'Paquetes',
    'nav.products': 'Productos',
    'nav.howToOrder': 'Cómo Ordenar',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',
    'nav.getStarted': 'Comenzar',
    
    // Hero
    'hero.title1': 'Cajas de Regalo de Lujo',
    'hero.title2': 'Hechas con Amor',
    'hero.subtitle': 'Crea momentos inolvidables con nuestras cajas de regalo premium y personalizables diseñadas para celebrar las ocasiones especiales de la vida',
    'hero.exploreCollection': 'Explora Nuestra Colección',
    'hero.customOrders': 'Pedidos Personalizados',
    'hero.feature1.title': 'Calidad Premium',
    'hero.feature1.desc': 'Hechas a mano con los mejores materiales',
    'hero.feature2.title': 'Totalmente Personalizable',
    'hero.feature2.desc': 'Personaliza cada detalle a la perfección',
    'hero.feature3.title': 'Hechas con Amor',
    'hero.feature3.desc': 'Cada caja cuenta una historia única',
    
    // Packages Section (Page 2)
    'packages.title': 'Nuestros Paquetes',
    'packages.subtitle': 'Elige entre nuestras opciones de paquetes diseñados para cada ocasión',
    
    'package.basic.name': 'Paquete Básico',
    'package.basic.desc': 'Paquete inicial perfecto con opciones esenciales de personalización. Incluye etiquetas personalizadas, decoraciones temáticas y artículos de regalo de calidad.',
    'package.basic.tag': 'Inicial',
    
    'package.deluxe.name': 'Paquete Deluxe',
    'package.deluxe.desc': 'Paquete mejorado con artículos premium y personalización avanzada. Presenta materiales de lujo, diseños exclusivos y selecciones de regalos premium.',
    'package.deluxe.tag': 'Popular',
    
    'package.premium.name': 'Paquete Premium',
    'package.premium.desc': 'Nuestro paquete más lujoso con personalización completa y contenidos premium. Incluye elementos de diseñador, regalos de alta gama y servicio de guante blanco.',
    'package.premium.tag': 'Lujo',
    
    'package.corporate.name': 'Paquete Corporativo',
    'package.corporate.desc': 'Paquetes profesionales para eventos empresariales y apreciación de clientes. Con marca de tu empresa y adaptados a estándares corporativos.',
    'package.corporate.tag': 'Negocios',
    
    'package.event.name': 'Paquete de Eventos',
    'package.event.desc': 'Paquetes completos para grandes celebraciones y eventos especiales. Pedidos al por mayor disponibles con calidad y temática consistentes.',
    'package.event.tag': 'Eventos',
    
    'package.seasonal.name': 'Paquete de Temporada',
    'package.seasonal.desc': 'Paquetes de edición limitada celebrando días festivos y temporadas especiales. Presenta temas de temporada, colores y elementos festivos.',
    'package.seasonal.tag': 'Limitado',
    
    // Products Section (Pages 3-5)
    'products.title': 'Nuestros Productos',
    'products.subtitle': 'Descubre nuestra selección curada de artículos de regalo premium, cada uno diseñado para crear momentos inolvidables',
    
    'product.customNutella.name': 'Frasco Nutella Personalizado',
    'product.customNutella.desc': 'Frascos de Nutella personalizados con etiquetas personalizadas con nombres, fotos o mensajes especiales. Perfecto para celebraciones dulces y regalos únicos.',
    'product.customNutella.tag': 'Personalizado',
    
    'product.customPlaydoh.name': 'Play-Doh Personalizado',
    'product.customPlaydoh.desc': 'Contenedores de Play-Doh con marca y empaque y etiquetas personalizadas. Ideal para fiestas infantiles, actividades creativas y recuerdos memorables.',
    'product.customPlaydoh.tag': 'Niños',
    
    'product.customPringles.name': 'Pringles Personalizados',
    'product.customPringles.desc': 'Latas de Pringles personalizadas con etiquetas y diseños personalizados. Una forma divertida y única de celebrar cualquier ocasión con un toque salado.',
    'product.customPringles.tag': 'Snacks',
    
    'product.chocolateBox.name': 'Caja Chocolate Deluxe',
    'product.chocolateBox.desc': 'Caja de regalo de chocolate premium con una variedad de chocolates gourmet. Elegantemente empaquetada para la máxima experiencia de indulgencia.',
    'product.chocolateBox.tag': 'Deluxe',
    
    'product.pyramidBox.name': 'Caja Sorpresa Pirámide',
    'product.pyramidBox.desc': 'Caja sorpresa interactiva con diseño piramidal único. Agita para revelar golosinas y regalos ocultos en el interior. Perfecta para crear momentos memorables de apertura.',
    'product.pyramidBox.tag': 'Especial',
    
    'product.castleBox.name': 'Caja Fiesta Castillo',
    'product.castleBox.desc': 'Caja de celebración mágica perfecta para fiestas temáticas de princesas. Incluye diseño de castillo decorativo, favores de fiesta y elementos personalizables para una experiencia encantadora.',
    'product.castleBox.tag': 'Fiesta',
    
    'product.giftBags.name': 'Bolsas de Regalo Personalizadas',
    'product.giftBags.desc': 'Bolsas de regalo personalizadas en varios tamaños y diseños. Perfectas para favores de fiesta, regalos corporativos y obsequios de ocasiones especiales.',
    'product.giftBags.tag': 'Versátil',
    
    'product.candyJars.name': 'Frascos de Dulces',
    'product.candyJars.desc': 'Frascos decorativos de dulces llenos de dulces premium. Etiquetas personalizables y colores de cinta para combinar con cualquier tema o celebración.',
    'product.candyJars.tag': 'Dulce',
    
    'product.partyFavors.name': 'Sets de Favores de Fiesta',
    'product.partyFavors.desc': 'Sets completos de favores de fiesta con artículos coordinados. Incluye pequeños regalos, golosinas y elementos decorativos para apreciación de invitados.',
    'product.partyFavors.tag': 'Fiesta',
    
    'product.customCookies.name': 'Galletas Personalizadas',
    'product.customCookies.desc': 'Galletas decoradas con diseños y mensajes personalizados. Envueltas individualmente y perfectas para cualquier celebración o evento corporativo.',
    'product.customCookies.tag': 'Golosinas',
    
    'product.giftBaskets.name': 'Canastas de Regalo',
    'product.giftBaskets.desc': 'Canastas de regalo curadas con artículos premium. Contenidos y presentación personalizables para adaptarse a cualquier ocasión o preferencia del destinatario.',
    'product.giftBaskets.tag': 'Premium',
    
    'product.themeSets.name': 'Sets de Regalo Temáticos',
    'product.themeSets.desc': 'Sets de regalo coordinados diseñados alrededor de temas específicos. Desde baby showers hasta bodas, cada set cuenta una historia cohesiva.',
    'product.themeSets.tag': 'Temático',
    
    // How to Order Section (Page 6)
    'howToOrder.title': 'Cómo Ordenar',
    'howToOrder.subtitle': 'Sigue estos simples pasos para crear tu caja de regalo perfecta',
    
    'howToOrder.step1.title': 'Elige Tu Paquete',
    'howToOrder.step1.desc': 'Selecciona de nuestra gama de paquetes que mejor se adapte a tu ocasión y presupuesto. Explora nuestras opciones Básico, Deluxe, Premium, Corporativo, Eventos o de Temporada.',
    
    'howToOrder.step2.title': 'Selecciona Tus Productos',
    'howToOrder.step2.desc': 'Elige los artículos que deseas incluir en tu caja de regalo. Mezcla y combina de nuestro extenso catálogo de productos para crear la combinación perfecta.',
    
    'howToOrder.step3.title': 'Personaliza Tu Diseño',
    'howToOrder.step3.desc': 'Personaliza tu caja de regalo con etiquetas, colores, mensajes y temas personalizados. Comparte tu visión con nosotros y la haremos realidad.',
    
    'howToOrder.step4.title': 'Revisa y Confirma',
    'howToOrder.step4.desc': 'Revisa tus selecciones y detalles de personalización. Te proporcionaremos una vista previa y cotización para tu aprobación antes de comenzar la producción.',
    
    'howToOrder.step5.title': 'Realiza Tu Pedido',
    'howToOrder.step5.desc': 'Confirma tu pedido y completa el pago. Aceptamos múltiples métodos de pago para tu conveniencia.',
    
    'howToOrder.step6.title': 'Creamos y Entregamos',
    'howToOrder.step6.desc': 'Nuestro equipo elabora tu caja de regalo con cuidado. Te mantendremos actualizado durante todo el proceso y entregaremos en tu ubicación especificada.',
    
    'howToOrder.cta': 'Comienza Tu Pedido',
    'howToOrder.contact': '¿Tienes preguntas? Contáctanos para asistencia personalizada.',
    
    // Instagram Section
    'instagram.title': 'Síguenos en Instagram',
    'instagram.visitProfile': 'Visita Nuestro Instagram',
    'instagram.notConfigured': 'Feed de Instagram no configurado aún',
    
    // About
    'about.title': 'Acerca de A&A Boxes',
    'about.subtitle': 'Creando experiencias memorables a través de cajas de regalo cuidadosamente diseñadas',
    'about.text1': 'En A&A Boxes, creemos que cada regalo cuenta una historia. Nuestra pasión es crear cajas de regalo premium y personalizables que transforman momentos ordinarios en recuerdos extraordinarios.',
    'about.text2': 'Cada caja está cuidadosamente curada y hecha a mano con atención al detalle, asegurando que tu regalo refleje el amor y la consideración detrás de él. Desde cumpleaños hasta celebraciones, estamos aquí para hacer cada ocasión especial.',
    'about.tagline': 'Hechas con amor, entregadas con cuidado',
    'about.stat1.number': '500+',
    'about.stat1.label': 'Clientes Felices',
    'about.stat2.number': '1000+',
    'about.stat2.label': 'Cajas Creadas',
    'about.stat3.number': '100%',
    'about.stat3.label': 'Amor y Cuidado',
    'about.stat4.number': '24/7',
    'about.stat4.label': 'Soporte',
    
    // Contact (Page 7)
    'contact.title': 'Contáctanos',
    'contact.subtitle': '¿Listo para crear algo especial? Hagamos realidad tu visión',
    'contact.form.name': 'Nombre',
    'contact.form.namePlaceholder': 'Tu nombre',
    'contact.form.email': 'Correo Electrónico',
    'contact.form.emailPlaceholder': 'tu@correo.com',
    'contact.form.message': 'Mensaje',
    'contact.form.messagePlaceholder': 'Cuéntanos sobre la caja de regalo de tus sueños...',
    'contact.form.send': 'Enviar Mensaje',
    'contact.form.successTitle': '¡Gracias! Te responderemos pronto.',
    'contact.form.successDesc': 'Tu mensaje ha sido recibido.',
    'contact.info.title': 'Información de Contacto',
    'contact.info.email': 'Correo Electrónico',
    'contact.info.phone': 'Teléfono',
    'contact.info.whatsapp': 'WhatsApp',
    'contact.info.location': 'Ubicación',
    'contact.info.emailValue': 'aaboxespr@gmail.com',
    'contact.info.phoneValue': '+1 (787) 605-5590',
    'contact.info.whatsappValue': '+1 (787) 605-5590',
    'contact.info.address': 'San Juan, Puerto Rico\nServicio en todas las áreas',
    'contact.hours.title': 'Horario de Atención',
    'contact.hours.weekdays': 'Lunes - Viernes: 9:00 AM - 6:00 PM',
    'contact.hours.saturday': 'Sábado: 10:00 AM - 4:00 PM',
    'contact.hours.sunday': 'Domingo: Con Cita Previa',
    'contact.social.title': 'Síguenos',
    'contact.social.desc': 'Mantente conectado para los últimos diseños y ofertas especiales',
    'contact.social.facebook': 'https://facebook.com/aaboxespr',
    'contact.social.instagram': 'https://instagram.com/aaboxespr',
    
    // Footer
    'footer.tagline': 'Creando momentos inolvidables a través de cajas de regalo premium y personalizables',
    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.services': 'Servicios',
    'footer.service1': 'Cajas de Regalo Personalizadas',
    'footer.service2': 'Paquetes de Fiesta',
    'footer.service3': 'Regalos Corporativos',
    'footer.service4': 'Ocasiones Especiales',
    'footer.followUs': 'Síguenos',
    'footer.copyright': '© 2025. Hecho con',
    'footer.using': 'usando',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' ? 'en' : 'es') as Language;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
