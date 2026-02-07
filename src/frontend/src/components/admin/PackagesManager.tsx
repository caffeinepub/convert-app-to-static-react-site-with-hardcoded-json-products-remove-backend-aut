import { useState } from 'react';
import { useGetAllPackages, useAddPackage, useEditPackage, useDeletePackage } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import type { Package } from '../../backend';

export default function PackagesManager() {
  const { data: packages = [], isLoading } = useGetAllPackages();
  const addPackage = useAddPackage();
  const editPackage = useEditPackage();
  const deletePackage = useDeletePackage();

  const [showDialog, setShowDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nameEn: '',
    nameEs: '',
    descriptionEn: '',
    descriptionEs: '',
    priceEn: '',
    priceEs: '',
    imageFile: null as File | null,
    imagePreview: '',
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setFormData({
      nameEn: '',
      nameEs: '',
      descriptionEn: '',
      descriptionEs: '',
      priceEn: '',
      priceEs: '',
      imageFile: null,
      imagePreview: '',
    });
    setUploadProgress(0);
    setEditingPackage(null);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      nameEn: pkg.name.english,
      nameEs: pkg.name.spanish,
      descriptionEn: pkg.description.english,
      descriptionEs: pkg.description.spanish,
      priceEn: pkg.price.english,
      priceEs: pkg.price.spanish,
      imageFile: null,
      imagePreview: pkg.image.getDirectURL(),
    });
    setShowDialog(true);
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
    if (!formData.nameEn || !formData.nameEs || !formData.descriptionEn || !formData.descriptionEs) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let imageBlob: ExternalBlob;

      if (formData.imageFile) {
        const arrayBuffer = await formData.imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (editingPackage) {
        imageBlob = editingPackage.image;
      } else {
        toast.error('Please select an image');
        return;
      }

      const packageData = {
        name: { english: formData.nameEn, spanish: formData.nameEs },
        description: { english: formData.descriptionEn, spanish: formData.descriptionEs },
        image: imageBlob,
        price: { english: formData.priceEn, spanish: formData.priceEs },
      };

      if (editingPackage) {
        await editPackage.mutateAsync({ id: editingPackage.id, ...packageData });
        toast.success('Package updated successfully!');
      } else {
        await addPackage.mutateAsync(packageData);
        toast.success('Package added successfully!');
      }

      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error('Failed to save package');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePackage.mutateAsync(id);
      toast.success('Package deleted successfully!');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Packages Management</CardTitle>
              <CardDescription>Add, edit, or remove packages from your offerings</CardDescription>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowDialog(true);
              }}
              className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={pkg.image.getDirectURL()}
                    alt={pkg.name.english}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-1">{pkg.name.english}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{pkg.description.english}</p>
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteConfirm(pkg.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
            <DialogDescription>
              Fill in the package details in both English and Spanish
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Package Image</Label>
              <div className="flex items-center gap-4">
                {formData.imagePreview && (
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Uploading: {uploadProgress}%
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameEn">Name (English) *</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Package name in English"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEs">Name (Spanish) *</Label>
                <Input
                  id="nameEs"
                  value={formData.nameEs}
                  onChange={(e) => setFormData({ ...formData, nameEs: e.target.value })}
                  placeholder="Nombre del paquete en español"
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
                  placeholder="Package description in English"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEs">Description (Spanish) *</Label>
                <Textarea
                  id="descriptionEs"
                  value={formData.descriptionEs}
                  onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
                  placeholder="Descripción del paquete en español"
                  rows={4}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceEn">Price (English)</Label>
                <Input
                  id="priceEn"
                  value={formData.priceEn}
                  onChange={(e) => setFormData({ ...formData, priceEn: e.target.value })}
                  placeholder="e.g., Starting at $50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceEs">Price (Spanish)</Label>
                <Input
                  id="priceEs"
                  value={formData.priceEs}
                  onChange={(e) => setFormData({ ...formData, priceEs: e.target.value })}
                  placeholder="ej., Desde $50"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={addPackage.isPending || editPackage.isPending}
              className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700"
            >
              {addPackage.isPending || editPackage.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Package'
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
              This action cannot be undone. This will permanently delete the package.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePackage.isPending ? (
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
