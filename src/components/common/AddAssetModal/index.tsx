import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface AdditionalAttribute {
  key: string;
  value: string;
}

export interface AddAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    name: string;
    type: string;
    description: string;
    assetProfile: string;
    parentAsset: string;
    additionalAttributes: AdditionalAttribute[];
  }) => void;
  isLoading?: boolean;
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    assetProfile: '',
    parentAsset: '',
  });

  const [additionalAttributes, setAdditionalAttributes] = useState<AdditionalAttribute[]>([
    { key: '', value: '' },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data for selects - replace with actual API calls
  const assetTypes = ['Device', 'Sensor', 'Gateway', 'Controller'];
  const assetProfiles = ['Profile A', 'Profile B', 'Profile C'];
  const parentAssets = ['Parent Asset 1', 'Parent Asset 2', 'Parent Asset 3'];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAttributeChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...additionalAttributes];
    updated[index] = { ...updated[index], [field]: value };
    setAdditionalAttributes(updated);
  };

  const handleAddAttribute = () => {
    setAdditionalAttributes([...additionalAttributes, { key: '', value: '' }]);
  };

  const handleRemoveAttribute = (index: number) => {
    if (additionalAttributes.length > 1) {
      setAdditionalAttributes(additionalAttributes.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('addAsset.nameRequired') || 'Asset name is required';
    }

    if (!formData.type) {
      newErrors.type = t('addAsset.typeRequired') || 'Asset type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Filter out empty additional attributes
    const validAttributes = additionalAttributes.filter(
      (attr) => attr.key.trim() && attr.value.trim()
    );

    onSave({
      ...formData,
      additionalAttributes: validAttributes,
    });
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: '',
      type: '',
      description: '',
      assetProfile: '',
      parentAsset: '',
    });
    setAdditionalAttributes([{ key: '', value: '' }]);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-primary text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg font-semibold">
              {t('addAsset.title') || 'Add New Asset'}
            </DialogTitle>
            <button
              onClick={handleCancel}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 bg-white max-h-[70vh] overflow-y-auto">
          <form className="space-y-4">
            {/* Asset Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('addAsset.assetName') || 'Asset Name'} *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t('addAsset.assetNamePlaceholder') || 'Asset Name *'}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Asset Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('addAsset.assetType') || 'Asset Type'} *
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue
                    placeholder={t('addAsset.assetTypePlaceholder') || 'Select asset type...'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-500">{errors.type}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('addAsset.description') || 'Description'}
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t('addAsset.descriptionPlaceholder') || 'Enter description'}
                className="min-h-[80px] w-full"
              />
            </div>

            {/* Asset Profile and Parent Asset */}
            <div className="grid grid-cols-2 gap-4">
              {/* Asset Profile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addAsset.assetProfile') || 'Asset Profile'}
                </label>
                <Select
                  value={formData.assetProfile}
                  onValueChange={(value) => handleSelectChange('assetProfile', value)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('addAsset.assetProfilePlaceholder') || 'Select profile...'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {assetProfiles.map((profile) => (
                      <SelectItem key={profile} value={profile}>
                        {profile}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Parent Asset */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addAsset.parentAsset') || 'Parent Asset'}
                </label>
                <Select
                  value={formData.parentAsset}
                  onValueChange={(value) => handleSelectChange('parentAsset', value)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('addAsset.parentAssetPlaceholder') || 'Select parent...'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {parentAssets.map((parent) => (
                      <SelectItem key={parent} value={parent}>
                        {parent}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Attributes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('addAsset.additionalAttributes') || 'Additional Attributes'}
              </label>
              <div className="space-y-2">
                {additionalAttributes.map((attr, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder={t('addAsset.additionalAttributes') || 'Additional Attributes'}
                      value={attr.key}
                      onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder={t('addAsset.value') || 'Value'}
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex gap-2">
                      {index === additionalAttributes.length - 1 && (
                        <Button
                          type="button"
                          onClick={handleAddAttribute}
                          className="bg-secondary hover:bg-secondary/90 text-white px-3"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                          {t('addAsset.add') || 'Add'}
                        </Button>
                      )}
                      {additionalAttributes.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => handleRemoveAttribute(index)}
                          variant="outline"
                          className="px-3"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t('addAsset.remove') || 'Remove'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-gray-50 p-4 rounded-b-lg flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {t('addAsset.cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-black hover:bg-black/90 text-white"
            isLoading={isLoading}
          >
            {t('addAsset.save') || 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

