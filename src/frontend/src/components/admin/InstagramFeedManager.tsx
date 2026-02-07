import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Instagram } from 'lucide-react';
import { toast } from 'sonner';
import { useGetInstagramFeedConfig, useUpdateInstagramFeedConfig } from '@/hooks/useQueries';

export default function InstagramFeedManager() {
  const { data: config, isLoading } = useGetInstagramFeedConfig();
  const updateConfig = useUpdateInstagramFeedConfig();

  const [instagramHandle, setInstagramHandle] = useState('');
  const [instagramEmbedCode, setInstagramEmbedCode] = useState('');
  const [titleEnglish, setTitleEnglish] = useState('');
  const [titleSpanish, setTitleSpanish] = useState('');
  const [descriptionEnglish, setDescriptionEnglish] = useState('');
  const [descriptionSpanish, setDescriptionSpanish] = useState('');
  const [displayOrder, setDisplayOrder] = useState('5');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (config) {
      setInstagramHandle(config.instagramHandle || '');
      setInstagramEmbedCode(config.instagramEmbedCode || '');
      setTitleEnglish(config.title.english || '');
      setTitleSpanish(config.title.spanish || '');
      setDescriptionEnglish(config.description.english || '');
      setDescriptionSpanish(config.description.spanish || '');
      setDisplayOrder(config.displayOrder.toString());
      setIsVisible(config.isVisible);
    }
  }, [config]);

  const handleSave = async () => {
    try {
      await updateConfig.mutateAsync({
        instagramHandle: instagramHandle.trim(),
        instagramEmbedCode: instagramEmbedCode.trim(),
        title: {
          english: titleEnglish.trim() || 'Follow Us on Instagram',
          spanish: titleSpanish.trim() || 'Síguenos en Instagram',
        },
        description: {
          english: descriptionEnglish.trim(),
          spanish: descriptionSpanish.trim(),
        },
        displayOrder: BigInt(parseInt(displayOrder) || 5),
        isVisible,
      });
      toast.success('Instagram feed configuration updated successfully!');
    } catch (error) {
      console.error('Error updating Instagram feed config:', error);
      toast.error('Failed to update Instagram feed configuration');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-600 rounded-lg">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Instagram Feed Configuration</CardTitle>
            <CardDescription>
              Configure the Instagram feed section displayed on your landing page
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="visible" className="text-base font-semibold">
                Display Instagram Section
              </Label>
              <p className="text-sm text-muted-foreground">
                Show or hide the Instagram feed section on the landing page
              </p>
            </div>
            <Switch
              id="visible"
              checked={isVisible}
              onCheckedChange={setIsVisible}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titleEnglish">Title (English)</Label>
              <Input
                id="titleEnglish"
                placeholder="Follow Us on Instagram"
                value={titleEnglish}
                onChange={(e) => setTitleEnglish(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleSpanish">Title (Spanish)</Label>
              <Input
                id="titleSpanish"
                placeholder="Síguenos en Instagram"
                value={titleSpanish}
                onChange={(e) => setTitleSpanish(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="descriptionEnglish">Description (English)</Label>
              <Textarea
                id="descriptionEnglish"
                placeholder="Stay connected for the latest designs and special offers"
                value={descriptionEnglish}
                onChange={(e) => setDescriptionEnglish(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionSpanish">Description (Spanish)</Label>
              <Textarea
                id="descriptionSpanish"
                placeholder="Mantente conectado para los últimos diseños y ofertas especiales"
                value={descriptionSpanish}
                onChange={(e) => setDescriptionSpanish(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagramHandle">Instagram Handle (without @)</Label>
            <Input
              id="instagramHandle"
              placeholder="aaboxespr"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Enter your Instagram username without the @ symbol
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="embedCode">Instagram Embed Code (Optional)</Label>
            <Textarea
              id="embedCode"
              placeholder='<iframe src="..." ...></iframe> or <blockquote class="instagram-media" ...></blockquote>'
              value={instagramEmbedCode}
              onChange={(e) => setInstagramEmbedCode(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground">
              Paste the Instagram embed code from Instagram's embed feature. If provided, this will be used instead of the handle link.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input
              id="displayOrder"
              type="number"
              placeholder="5"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              min="0"
            />
            <p className="text-sm text-muted-foreground">
              Lower numbers appear first. Default is 5 (before Contact section).
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={updateConfig.isPending}
            className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700"
          >
            {updateConfig.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
