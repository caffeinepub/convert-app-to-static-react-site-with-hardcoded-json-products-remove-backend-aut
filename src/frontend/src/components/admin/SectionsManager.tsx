import { useState, useEffect } from 'react';
import {
  useGetAllSectionsAdmin,
  useCreateAdditionalSection,
  useUpdateAdditionalSection,
  useDeleteAdditionalSection,
} from '../../hooks/useQueries';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import type { SectionContentView } from '../../backend';

export default function SectionsManager() {
  const { data: sections = [], isLoading } = useGetAllSectionsAdmin();
  const createSection = useCreateAdditionalSection();
  const updateSection = useUpdateAdditionalSection();
  const deleteSection = useDeleteAdditionalSection();

  const [showDialog, setShowDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionContentView | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titleEn: '',
    titleEs: '',
    descriptionEn: '',
    descriptionEs: '',
    order: 0,
    isVisible: true,
    imageFile: null as File | null,
    imagePreview: '',
    backgroundFile: null as File | null,
    backgroundPreview: '',
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setFormData({
      titleEn: '',
      titleEs: '',
      descriptionEn: '',
      descriptionEs: '',
      order: 0,
      isVisible: true,
      imageFile: null,
      imagePreview: '',
      backgroundFile: null,
      backgroundPreview: '',
    });
    setUploadProgress(0);
    setEditingSection(null);
  };

  const handleEdit = (section: SectionContentView) => {
    setEditingSection(section);
    setFormData({
      titleEn: section.title.english,
      titleEs: section.title.spanish,
      descriptionEn: section.description.english,
      descriptionEs: section.description.spanish,
      order: Number(section.order),
      isVisible: section.isVisible,
      imageFile: null,
      imagePreview: section.image?.getDirectURL() || '',
      backgroundFile: null,
      backgroundPreview: section.background?.getDirectURL() || '',
    });
    setShowDialog(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'background') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'image') {
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: URL.createObjectURL(file),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          backgroundFile: file,
          backgroundPreview: URL.createObjectURL(file),
        }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.titleEn || !formData.titleEs || !formData.descriptionEn || !formData.descriptionEs) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let imageBlob: ExternalBlob | null = null;
      let backgroundBlob: ExternalBlob | null = null;

      if (formData.imageFile) {
        const arrayBuffer = await formData.imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (editingSection?.image) {
        imageBlob = editingSection.image;
      }

      if (formData.backgroundFile) {
        const arrayBuffer = await formData.backgroundFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        backgroundBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (editingSection?.background) {
        backgroundBlob = editingSection.background;
      }

      const sectionData = {
        title: { english: formData.titleEn, spanish: formData.titleEs },
        description: { english: formData.descriptionEn, spanish: formData.descriptionEs },
        image: imageBlob,
        background: backgroundBlob,
        order: BigInt(formData.order),
        isVisible: formData.isVisible,
      };

      if (editingSection) {
        await updateSection.mutateAsync({ id: editingSection.id, ...sectionData });
        toast.success('Section updated successfully!');
      } else {
        await createSection.mutateAsync(sectionData);
        toast.success('Section created successfully!');
      }

      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Failed to save section');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSection.mutateAsync(id);
      toast.success('Section deleted successfully!');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Failed to delete section');
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

  const sortedSections = [...sections].sort((a, b) => Number(a.order) - Number(b.order));

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Additional Sections</CardTitle>
              <CardDescription>Create and manage custom content sections for your website</CardDescription>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowDialog(true);
              }}
              className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedSections.map((section) => (
              <Card key={section.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{section.title.english}</h3>
                        {section.isVisible ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {section.description.english}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Order: {Number(section.order)}</span>
                        <span>Blocks: {section.contentBlocks.length}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(section)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm(section.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {sortedSections.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No additional sections yet. Create your first section to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSection ? 'Edit Section' : 'Create New Section'}</DialogTitle>
            <DialogDescription>
              Fill in the section details in both English and Spanish
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titleEn">Title (English) *</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Section title in English"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleEs">Title (Spanish) *</Label>
                <Input
                  id="titleEs"
                  value={formData.titleEs}
                  onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                  placeholder="Título de la sección en español"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="descriptionEn">Description (English) *</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Section description in English"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEs">Description (Spanish) *</Label>
                <Textarea
                  id="descriptionEs"
                  value={formData.descriptionEs}
                  onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
                  placeholder="Descripción de la sección en español"
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Section Image (Optional)</Label>
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
                  onChange={(e) => handleImageChange(e, 'image')}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Background Image (Optional)</Label>
              <div className="flex items-center gap-4">
                {formData.backgroundPreview && (
                  <img
                    src={formData.backgroundPreview}
                    alt="Background Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'background')}
                  className="cursor-pointer"
                />
              </div>
            </div>

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
              disabled={createSection.isPending || updateSection.isPending}
              className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700"
            >
              {createSection.isPending || updateSection.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Section'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the section and all its content
              blocks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteSection.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

