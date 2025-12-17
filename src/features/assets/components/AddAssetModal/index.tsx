import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Trash2, MapPin } from 'lucide-react';
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
import { LocationMap } from '@/components/common/LocationMap';
import { useAssetProfiles } from '@/features/profiles/hooks';
import { useAssets } from '@/features/assets/hooks';
import type { AssetProfile as ApiAssetProfile } from '@/services/api/profiles.api';
import type { Asset as ApiAsset } from '@/services/api/assets.api';

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
    assetProfileId: string;
    parentAssetId: string;
    location: {
      latitude: number;
      longitude: number;
    };
    attributes: AdditionalAttribute[];
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

  const getInitialFormData = () => ({
    name: '',
    type: '',
    description: '',
    assetProfileId: '',
    parentAssetId: '',
    location: {
      latitude: '0',
      longitude: '0',
    },
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const { data: assetProfilesData } = useAssetProfiles();
  const { data: assetsData } = useAssets({ limit: 200 });

  // assetProfilesData comes from axios response -> response.data (PaginatedResponse)
  // normalize nested structure safely
  const assetProfilesResponse = assetProfilesData?.data as
    | { data?: { data?: ApiAssetProfile[] } }
    | undefined;
  const assetProfilesList = assetProfilesResponse?.data?.data ?? [];

  // assetsData similarly contains paginated assets list
  const assetsResponse = assetsData?.data as
    | { data?: { data?: ApiAsset[] } }
    | undefined;
  const parentAssetsList = assetsResponse?.data?.data ?? [];
  const [additionalAttributes, setAdditionalAttributes] = useState<
    AdditionalAttribute[]
  >([{ key: '', value: '' }]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data for selects - keep assetTypes mocked
  const assetTypes = [
    'building',
    'floor',
    'room',
    'vehicle',
    'equipment',
    'infrastructure',
    'zone',
  ];

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

  const handleCoordinateChange = (
    name: 'latitude' | 'longitude',
    value: string
  ) => {
    // Allow empty, numbers, decimals, and negative sign
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    // store select values on top-level keys (e.g. assetProfileId, parentAssetId, type)
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

  const handleAttributeChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updated = [...additionalAttributes];
    updated[index] = { ...updated[index], [field]: value };
    setAdditionalAttributes(updated);
  };

  const handleAddAttribute = () => {
    setAdditionalAttributes([...additionalAttributes, { key: '', value: '' }]);
  };

  const handleRemoveAttribute = (index: number) => {
    if (additionalAttributes.length > 1) {
      setAdditionalAttributes(
        additionalAttributes.filter((_, i) => i !== index)
      );
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

    // Validate latitude/longitude strings safely
    const latStr = String(formData.location.latitude || '').trim();
    const lngStr = String(formData.location.longitude || '').trim();

    if (latStr) {
      const lat = parseFloat(latStr);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude =
          t('addAsset.invalidLatitude') ||
          'Latitude must be between -90 and 90';
      }
    }

    if (lngStr) {
      const lng = parseFloat(lngStr);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude =
          t('addAsset.invalidLongitude') ||
          'Longitude must be between -180 and 180';
      }
    }

    // If one coordinate is provided, the other should also be provided
    if ((latStr && !lngStr) || (!latStr && lngStr)) {
      newErrors.latitude =
        t('addAsset.bothCoordinatesRequired') ||
        'Both latitude and longitude are required';
      newErrors.longitude =
        t('addAsset.bothCoordinatesRequired') ||
        'Both latitude and longitude are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setAdditionalAttributes([{ key: '', value: '' }]);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    // Filter out empty additional attributes
    const validAttributes = additionalAttributes.filter(
      (attr) => attr.key.trim() && attr.value.trim()
    );

    await onSave({
      ...formData,
      location: {
        latitude: parseFloat(formData.location.latitude),
        longitude: parseFloat(formData.location.longitude),
      },
      attributes: validAttributes,
    });

    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  // Parse coordinates for map display
  const latitudeNum = String(formData.location.latitude || '').trim()
    ? parseFloat(String(formData.location.latitude))
    : null;
  const longitudeNum = String(formData.location.longitude || '').trim()
    ? parseFloat(String(formData.location.longitude))
    : null;
  const hasValidCoordinates =
    latitudeNum !== null &&
    longitudeNum !== null &&
    !isNaN(latitudeNum) &&
    !isNaN(longitudeNum) &&
    latitudeNum >= -90 &&
    latitudeNum <= 90 &&
    longitudeNum >= -180 &&
    longitudeNum <= 180;

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
                placeholder={
                  t('addAsset.assetNamePlaceholder') || 'Asset Name *'
                }
                className={
                  errors.name ? '  border-2 rounded-md' : ' border-2 rounded-md'
                }
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
                    placeholder={
                      t('addAsset.assetTypePlaceholder') ||
                      'Select asset type...'
                    }
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
                placeholder={
                  t('addAsset.descriptionPlaceholder') || 'Enter description'
                }
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
                  value={formData.assetProfileId}
                  onValueChange={(value) =>
                    handleSelectChange('assetProfileId', value)
                  }
                >
                  <SelectTrigger>
                    <span className="text-sm">
                      {formData.assetProfileId
                        ? assetProfilesList.find(
                            (p: any) => p.id === formData.assetProfileId
                          )?.name || formData.assetProfileId
                        : t('addAsset.assetProfilePlaceholder') ||
                          'Select profile...'}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {assetProfilesList.length === 0 ? (
                      <SelectItem value="">
                        {t('addAsset.noProfiles') || 'No profiles'}
                      </SelectItem>
                    ) : (
                      assetProfilesList.map((profile: any) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Parent Asset */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addAsset.parentAsset') || 'Parent Asset'}
                </label>
                <Select
                  value={formData.parentAssetId}
                  onValueChange={(value) =>
                    handleSelectChange('parentAssetId', value)
                  }
                >
                  <SelectTrigger>
                    <span className="text-sm">
                      {formData.parentAssetId
                        ? parentAssetsList.find(
                            (a: any) => a.id === formData.parentAssetId
                          )?.name || formData.parentAssetId
                        : t('addAsset.parentAssetPlaceholder') ||
                          'Select parent...'}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {parentAssetsList.length === 0 ? (
                      <SelectItem value="">
                        {t('addAsset.noParents') || 'No parent assets'}
                      </SelectItem>
                    ) : (
                      parentAssetsList.map((parent: any) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location Coordinates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                {t('addAsset.location') || 'Location'}
              </label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Latitude */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t('addAsset.latitude') || 'Latitude'}
                  </label>
                  <Input
                    name="latitude"
                    type="text"
                    value={formData.location.latitude}
                    onChange={(e) =>
                      handleCoordinateChange('latitude', e.target.value)
                    }
                    placeholder={
                      t('addAsset.latitudePlaceholder') || 'e.g., 40.7128'
                    }
                    className={
                      errors.latitude
                        ? 'border-red-500'
                        : '' + ' border-2 rounded-md'
                    }
                  />
                  {errors.latitude && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.latitude}
                    </p>
                  )}
                </div>

                {/* Longitude */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t('addAsset.longitude') || 'Longitude'}
                  </label>
                  <Input
                    name="longitude"
                    type="text"
                    value={formData.location.longitude}
                    onChange={(e) =>
                      handleCoordinateChange('longitude', e.target.value)
                    }
                    placeholder={
                      t('addAsset.longitudePlaceholder') || 'e.g., -74.0060'
                    }
                    className={
                      errors.longitude
                        ? 'border-red-500'
                        : '' + ' border-2 rounded-md'
                    }
                  />
                  {errors.longitude && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.longitude}
                    </p>
                  )}
                </div>
              </div>

              {/* Map Display */}
              {hasValidCoordinates ? (
                <div className="mt-2">
                  <LocationMap
                    latitude={latitudeNum}
                    longitude={longitudeNum}
                    height="250px"
                  />
                </div>
              ) : (
                <div className="mt-2 h-[250px] rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {t('addAsset.enterCoordinates') ||
                        'Enter latitude and longitude to view map'}
                    </p>
                  </div>
                </div>
              )}
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
                      placeholder={
                        t('addAsset.additionalAttributes') ||
                        'Additional Attributes'
                      }
                      value={attr.key}
                      onChange={(e) =>
                        handleAttributeChange(index, 'key', e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder={t('addAsset.value') || 'Value'}
                      value={attr.value}
                      onChange={(e) =>
                        handleAttributeChange(index, 'value', e.target.value)
                      }
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
