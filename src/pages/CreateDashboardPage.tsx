import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { TagInput } from '@/components/common/TagInput';
import { dashboardsApi } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/util';

export default function CreateDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    owner: [] as string[],
    groups: [] as string[],
    image: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOwnerChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, owner: tags }));
  };

  const handleGroupsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, groups: tags }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData((prev) => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error(t('createDashboard.invalidImageType') || 'Please select an image file');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error(t('createDashboard.invalidImageType') || 'Please select an image file');
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        toast.error(t('createDashboard.titleRequired') || 'Dashboard title is required');
        setIsSubmitting(false);
        return;
      }

      if (formData.owner.length === 0) {
        toast.error(t('createDashboard.ownerRequired') || 'Owner is required');
        setIsSubmitting(false);
        return;
      }

      // Prepare dashboard data
      const dashboardData: any = {
        title: formData.title,
        description: formData.description || undefined,
        assignedCustomers: formData.owner,
        additionalInfo: {
          groups: formData.groups,
        },
      };

      // Create dashboard
      const response = await dashboardsApi.create(dashboardData);

      // If image is selected, upload it separately (you may need to adjust this based on your API)
      if (formData.image && response.data?.data?.id) {
        // You might need to upload the image to a separate endpoint
        // For now, we'll just create the dashboard
      }

      toast.success(t('createDashboard.success') || 'Dashboard created successfully');
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
      navigate('/dashboards');
    } catch (error: unknown) {
      console.error('Failed to create dashboard:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('createDashboard.error') || 'Failed to create dashboard';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboards');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900">
          {t('createDashboard.title') || 'Create New Dashboard'}
        </h1>

        {/* Form Card */}
        <Card className="shadow-lg rounded-xl border-gray-200">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dashboard Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('createDashboard.dashboardTitle') || 'Dashboard Title'}
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t('createDashboard.dashboardTitlePlaceholder') || 'Enter dashboard title'}
                  className="w-full"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('createDashboard.description') || 'Description'}
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t('createDashboard.descriptionPlaceholder') || 'Enter dashboard description'}
                  className="min-h-[100px] w-full"
                />
              </div>

              {/* Owner and Groups Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('createDashboard.ownerAndGroups') || 'Owner and Groups'}
                </h2>

                {/* Owner Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('createDashboard.owner') || 'Owner'} *
                  </label>
                  <TagInput
                    value={formData.owner}
                    onChange={handleOwnerChange}
                    placeholder={t('createDashboard.ownerPlaceholder') || 'Type owner name and press Enter'}
                    maxTags={1}
                  />
                </div>

                {/* Groups Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('createDashboard.groups') || 'Groups'}
                  </label>
                  <TagInput
                    value={formData.groups}
                    onChange={handleGroupsChange}
                    placeholder={t('createDashboard.groupsPlaceholder') || 'Type group name and press Enter'}
                  />
                </div>
              </div>

              {/* Dashboard Image Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('createDashboard.dashboardImage') || 'Dashboard Image'}
                </h2>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                    isDragging
                      ? 'border-secondary bg-secondary/5'
                      : 'border-gray-300 hover:border-secondary hover:bg-gray-50'
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">
                          {t('createDashboard.dropImageOrClick') ||
                            'Drop Image Here Or Click To Upload'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {t('createDashboard.cancel') || 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-secondary hover:bg-secondary/90 text-white"
                  isLoading={isSubmitting}
                >
                  {t('createDashboard.save') || 'Save'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

