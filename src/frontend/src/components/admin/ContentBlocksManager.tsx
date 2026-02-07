import { useState, useEffect } from 'react';
import { useGetAllSectionsAdmin, useAddContentBlock } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2, FileText, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob, BlockType } from '../../backend';
import type { SectionContentView } from '../../backend';

export default function ContentBlocksManager() {
  const { data: sections = [], isLoading } = useGetAllSectionsAdmin();
  const addContentBlock = useAddContentBlock();

  const [showDialog, setShowDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('');

  const [formData, setFormData] = useState({
    titleEn: '',
    titleEs: '',
    contentEn: '',
    contentEs: '',
    blockType: BlockType.textBlock,
    order: 0,
    isVisible: true,
    imageFile: null as File | null,
    imagePreview: '',
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setFormData({
      titleEn: '',
      titleEs: '',
      contentEn: '',
      contentEs: '',
      blockType: BlockType.textBlock,
      order: 0,
      isVisible: true,
      imageFile: null,
      imagePreview: '',
    });
    setUploadProgress(0);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedSection) {
      toast.error('Please select a section');
      return;
    }

    if (!formData.titleEn || !formData.titleEs || !formData.contentEn || !formData.contentEs) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let imageBlob: ExternalBlob | null = null;

      if (formData.imageFile) {
        const arrayBuffer = await formData.imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await addContentBlock.mutateAsync({
        sectionId: selectedSection,
        title: { english: formData.titleEn, spanish: formData.titleEs },
        content: { english: formData.contentEn, spanish: formData.contentEs },
        image: imageBlob,
        blockType: formData.blockType,
        order: BigInt(formData.order),
        isVisible: formData.isVisible,
      });

      toast.success('Content block added successfully!');
      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error adding content block:', error);
      toast.error('Failed to add content block');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
        </CardContent>
      </Card>
    );
  }

  const getBlockTypeIcon = (type: BlockType) => {
    switch (type) {
      case BlockType.textBlock:
        return <FileText className="h-4 w-4" />;
      case BlockType.imageBlock:
        return <ImageIcon className="h-4 w-4" />;
      case BlockType.mixedBlock:
        return <LayoutGrid className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Blocks</CardTitle>
              <CardDescription>Add flexible content blocks to your custom sections</CardDescription>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowDialog(true);
              }}
              className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700"
              disabled={sections.length === 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Content Block
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sections.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No sections available. Create a section first to add content blocks.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sections.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title.english}</CardTitle>
                    <CardDescription>
                      {section.contentBlocks.length} content block(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {section.contentBlocks.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No content blocks yet</p>
                    ) : (
                      <div className="space-y-2">
                        {section.contentBlocks.map((block) => (
                          <div
                            key={Number(block.id)}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {getBlockTypeIcon(block.blockType)}
                              <div>
                                <p className="font-medium text-sm">{block.title.english}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {block.content.english}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Order: {Number(block.order)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Content Block</DialogTitle>
            <DialogDescription>Create a new content block for a section</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="section">Select Section *</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.title.english}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blockType">Block Type *</Label>
              <Select
                value={formData.blockType}
                onValueChange={(value) => setFormData({ ...formData, blockType: value as BlockType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BlockType.textBlock}>Text Block</SelectItem>
                  <SelectItem value={BlockType.imageBlock}>Image Block</SelectItem>
                  <SelectItem value={BlockType.mixedBlock}>Mixed Block (Text + Image)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titleEn">Title (English) *</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Block title in English"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleEs">Title (Spanish) *</Label>
                <Input
                  id="titleEs"
                  value={formData.titleEs}
                  onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                  placeholder="Título del bloque en español"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contentEn">Content (English) *</Label>
                <Textarea
                  id="contentEn"
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  placeholder="Block content in English"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contentEs">Content (Spanish) *</Label>
                <Textarea
                  id="contentEs"
                  value={formData.contentEs}
                  onChange={(e) => setFormData({ ...formData, contentEs: e.target.value })}
                  placeholder="Contenido del bloque en español"
                  rows={4}
                />
              </div>
            </div>

            {(formData.blockType === BlockType.imageBlock ||
              formData.blockType === BlockType.mixedBlock) && (
              <div className="space-y-2">
                <Label>Block Image</Label>
                <div className="flex items-center gap-4">
                  {formData.imagePreview && (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isVisible">Visibility</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isVisible"
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                  />
                  <Label htmlFor="isVisible" className="cursor-pointer">
                    {formData.isVisible ? 'Visible' : 'Hidden'}
                  </Label>
                </div>
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <p className="text-sm text-muted-foreground">Uploading: {uploadProgress}%</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={addContentBlock.isPending}
              className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700"
            >
              {addContentBlock.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Block'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

