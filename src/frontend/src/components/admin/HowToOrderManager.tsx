import { useState } from 'react';
import { useGetAllHowToOrderSteps, useAddHowToOrderStep, useEditHowToOrderStep } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import type { HowToOrderStep } from '../../backend';

export default function HowToOrderManager() {
  const { data: steps = [], isLoading } = useGetAllHowToOrderSteps();
  const addStep = useAddHowToOrderStep();
  const editStep = useEditHowToOrderStep();

  const [showDialog, setShowDialog] = useState(false);
  const [editingStep, setEditingStep] = useState<HowToOrderStep | null>(null);

  const [formData, setFormData] = useState({
    stepNumber: 1,
    titleEn: '',
    titleEs: '',
    descriptionEn: '',
    descriptionEs: '',
    imageFile: null as File | null,
    imagePreview: '',
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setFormData({
      stepNumber: steps.length + 1,
      titleEn: '',
      titleEs: '',
      descriptionEn: '',
      descriptionEs: '',
      imageFile: null,
      imagePreview: '',
    });
    setUploadProgress(0);
    setEditingStep(null);
  };

  const handleEdit = (step: HowToOrderStep) => {
    setEditingStep(step);
    setFormData({
      stepNumber: Number(step.stepNumber),
      titleEn: step.title.english,
      titleEs: step.title.spanish,
      descriptionEn: step.description.english,
      descriptionEs: step.description.spanish,
      imageFile: null,
      imagePreview: step.image ? step.image.getDirectURL() : '',
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
    if (!formData.titleEn || !formData.titleEs || !formData.descriptionEn || !formData.descriptionEs) {
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
      } else if (editingStep?.image) {
        imageBlob = editingStep.image;
      }

      const stepData = {
        stepNumber: BigInt(formData.stepNumber),
        title: { english: formData.titleEn, spanish: formData.titleEs },
        description: { english: formData.descriptionEn, spanish: formData.descriptionEs },
        image: imageBlob,
      };

      if (editingStep) {
        await editStep.mutateAsync(stepData);
        toast.success('Step updated successfully!');
      } else {
        await addStep.mutateAsync(stepData);
        toast.success('Step added successfully!');
      }

      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving step:', error);
      toast.error('Failed to save step');
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

  const sortedSteps = [...steps].sort((a, b) => Number(a.stepNumber) - Number(b.stepNumber));

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>How to Order Steps</CardTitle>
              <CardDescription>Manage the ordering process steps</CardDescription>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowDialog(true);
              }}
              className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedSteps.map((step) => (
              <Card key={Number(step.stepNumber)} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-400 to-pink-600 flex items-center justify-center text-white font-bold">
                          {Number(step.stepNumber)}
                        </div>
                        <h3 className="font-semibold text-lg">{step.title.english}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-13">{step.description.english}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(step)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
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
            <DialogTitle>{editingStep ? 'Edit Step' : 'Add New Step'}</DialogTitle>
            <DialogDescription>
              Fill in the step details in both English and Spanish
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stepNumber">Step Number *</Label>
              <Input
                id="stepNumber"
                type="number"
                min="1"
                value={formData.stepNumber}
                onChange={(e) => setFormData({ ...formData, stepNumber: parseInt(e.target.value) || 1 })}
                disabled={!!editingStep}
              />
            </div>

            <div className="space-y-2">
              <Label>Step Image (Optional)</Label>
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
                <Label htmlFor="titleEn">Title (English) *</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Step title in English"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleEs">Title (Spanish) *</Label>
                <Input
                  id="titleEs"
                  value={formData.titleEs}
                  onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                  placeholder="Título del paso en español"
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
                  placeholder="Step description in English"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEs">Description (Spanish) *</Label>
                <Textarea
                  id="descriptionEs"
                  value={formData.descriptionEs}
                  onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
                  placeholder="Descripción del paso en español"
                  rows={4}
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
              disabled={addStep.isPending || editStep.isPending}
              className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700"
            >
              {addStep.isPending || editStep.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Step'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
