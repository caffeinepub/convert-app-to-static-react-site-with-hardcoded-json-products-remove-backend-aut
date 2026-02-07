import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { SiFacebook, SiInstagram } from 'react-icons/si';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('contact.form.successTitle'), {
      description: t('contact.form.successDesc'),
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-background to-rose-50/30 dark:to-rose-950/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
                {t('contact.title')}
              </span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="fade-in">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-base">{t('contact.form.name')}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2 h-12 border-2 focus:border-rose-400 transition-colors"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base">{t('contact.form.email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2 h-12 border-2 focus:border-rose-400 transition-colors"
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-base">{t('contact.form.message')}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="mt-2 border-2 focus:border-rose-400 transition-colors resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-12"
                >
                  <Send className="mr-2" size={20} />
                  {t('contact.form.send')}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="fade-in animation-delay-300 space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-2xl font-semibold mb-6">{t('contact.info.title')}</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t('contact.info.email')}</h4>
                      <a 
                        href={`mailto:${t('contact.info.emailValue')}`}
                        className="text-foreground/70 hover:text-rose-500 transition-colors"
                      >
                        {t('contact.info.emailValue')}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t('contact.info.phone')}</h4>
                      <a 
                        href={`tel:${t('contact.info.phoneValue')}`}
                        className="text-foreground/70 hover:text-rose-500 transition-colors"
                      >
                        {t('contact.info.phoneValue')}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t('contact.info.whatsapp')}</h4>
                      <a 
                        href={`https://wa.me/${t('contact.info.whatsappValue').replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground/70 hover:text-rose-500 transition-colors"
                      >
                        {t('contact.info.whatsappValue')}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t('contact.info.location')}</h4>
                      <p className="text-foreground/70 whitespace-pre-line">
                        {t('contact.info.address')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{t('contact.hours.title')}</h3>
                <div className="space-y-2 text-foreground/70">
                  <p>{t('contact.hours.weekdays')}</p>
                  <p>{t('contact.hours.saturday')}</p>
                  <p>{t('contact.hours.sunday')}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-rose-50 dark:from-purple-950/20 dark:to-rose-950/20 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{t('contact.social.title')}</h3>
                <p className="text-foreground/70 mb-4 text-sm">{t('contact.social.desc')}</p>
                <div className="flex space-x-4">
                  <a
                    href={t('contact.social.facebook')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                    aria-label="Facebook"
                  >
                    <SiFacebook className="text-white" size={20} />
                  </a>
                  <a
                    href={t('contact.social.instagram')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                    aria-label="Instagram"
                  >
                    <SiInstagram className="text-white" size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
