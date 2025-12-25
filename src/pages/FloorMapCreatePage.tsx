import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FilterFormValues, AssetOption } from '@/features/floorPlan/types';
import type { Asset } from '@/services/api/assets.api';
import { AssetSelectionStep } from '@/features/floorPlan/components/AssetSelectionStep';
import { DwgImportStep } from '@/features/floorPlan/components/DwgImportStep';
import { ZoneSetupStep } from '@/features/floorPlan/components/ZoneSetupStep';
import { DeviceLinkStep } from '@/features/floorPlan/components/DeviceLinkStep';
import { ReviewStep } from '@/features/floorPlan/components/ReviewStep';
import { assetsApi } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { LoadingOverlay } from '@/components/common/LoadingSpinner';
import { useFloorMapStore } from '@/features/floorPlan/store';
import type { StepId } from '@/features/floorPlan/store';

const steps: { id: StepId; label: string }[] = [
  { id: 1, label: 'Asset' },
  { id: 2, label: 'DWG Import' },
  { id: 3, label: 'Zone Setup' },
  { id: 4, label: 'Device Link' },
  { id: 5, label: 'Review' },
];

export default function FloorMapCreatePage() {
  const navigate = useNavigate();

  // Zustand store
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    selectedAssetId,
    setSelectedAssetId,
    filteredAssets,
    setFilteredAssets,
    formValues,
    setFormValues,
    reset,
  } = useFloorMapStore();

  // Fetch assets
  const {
    data: assetsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['assets'],
    queryFn: () => assetsApi.getAll(),
  });

  // Handle nested API response structure: response.data.data (PaginatedResponse.data)
  const assetsdataa = (
    assetsResponse?.data as unknown as { data?: { data?: Asset[] } } | undefined
  )?.data?.data;

  // Initialize form with store values
  const form = useForm<FilterFormValues>({
    defaultValues: formValues,
  });

  const { register, control, setValue } = form;
  
  const {
    search,
    type = 'all',
    status = 'all',
  } = useWatch({
    control,
  });

  // Sync form values with store
  useEffect(() => {
    const subscription = form.watch((values) => {
      setFormValues(values as FilterFormValues);
    });
    return () => subscription.unsubscribe();
  }, [form, setFormValues]);

  // Filter and transform assets
  const computedFilteredAssets = useMemo((): AssetOption[] => {
    if (!assetsdataa || !Array.isArray(assetsdataa)) return [];

    // Transform Asset[] to AssetOption[] and filter
    const transformedAssets: AssetOption[] = assetsdataa
      .map((asset: Asset) => ({
        id: asset.id,
        name: asset.name || 'Unnamed Asset',
        type: asset.type || 'Unknown',
        location: asset.location?.address || 'No location',
        status: 'active', // Default status since Asset doesn't have status field
        active: 'active', // Default to active (string as per AssetOption interface)
      }))
      .filter((assetOption: AssetOption) => {
        const assetName = assetOption.name?.toLowerCase() || '';
        const assetLocation = assetOption.location?.toLowerCase() || '';
        const searchLower = search?.toLowerCase() || '';

        const matchesSearch =
          !search ||
          assetName.includes(searchLower) ||
          assetLocation.includes(searchLower);

        const assetType = assetOption.type?.toLowerCase() || '';
        const matchesType =
          type === 'all' || assetType.includes(type.toLowerCase());

        const matchesStatus =
          status === 'all' ||
          assetOption.status.toLowerCase() === status.toLowerCase();

        return matchesSearch && matchesType && matchesStatus;
      });

    return transformedAssets;
  }, [assetsdataa, search, type, status]);

  // Update store with filtered assets
  useEffect(() => {
    setFilteredAssets(computedFilteredAssets);
  }, [computedFilteredAssets, setFilteredAssets]);

  const handleNext = () => {
    nextStep();
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving floor map...', useFloorMapStore.getState());
    // After saving, reset store and navigate back
    reset();
    navigate('/floor-plans');
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/floor-plans');
    } else {
      previousStep();
    }
  };

  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  const validIndex = currentIndex >= 0 ? currentIndex : 0;

  const progressPercent =
    steps.length <= 1
      ? 10 // or 90 if you consider a single step completed
      : 10 + (validIndex / (steps.length - 1)) * 80;

  if (isLoading) {
    return (
      <div>
        <LoadingOverlay />
      </div>
    );
  }
  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Floor Map Advanced Features"
        actions={[
          {
            label: 'Back',
            onClick: handleBack,
          },
        ]}
      />
      <Card className="">
        <CardHeader className="py-4">
          <CardTitle>Create Floor Map - Step {currentStep} of 5</CardTitle>
        </CardHeader>
        <div className="space-y-3 relative m-4 relative">
          <div className="   h-3 rounded-full bg-muted">
            <div
              className="absolute left-0 top-0 h-3 rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex relative -top-9  items-center justify-between gap-4">
            {steps.map((step) => {
              return (
                <div
                  key={step.id}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${'bg-primary text-white'}`}
                  >
                    {step.id}
                  </div>
                  <span className="mt-1  text-xs font-medium text-muted-foreground">
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="pt-4">
        <CardContent className="space-y-6">
          {/* Stepper */}

          {/* Step content */}
          {currentStep === 1 && (
            <AssetSelectionStep
              register={register}
              control={control}
              setValue={setValue}
              filteredAssets={filteredAssets}
              selectedAssetId={selectedAssetId}
              onSelectAsset={setSelectedAssetId}
              onCancel={() => {
                reset();
                navigate('/floor-plans');
              }}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <DwgImportStep
              register={register}
              control={control}
              onPrevious={() => setCurrentStep(1)}
              onNext={handleNext}
            />
          )}

          {currentStep === 3 && (
            <ZoneSetupStep
              register={register}
              control={control}
              onPrevious={() => setCurrentStep(2)}
              onNext={handleNext}
            />
          )}

          {currentStep === 4 && (
            <DeviceLinkStep
              register={register}
              control={control}
              onPrevious={() => setCurrentStep(3)}
              onNext={handleNext}
            />
          )}

          {currentStep === 5 && (
            <ReviewStep
              register={register}
              control={control}
              onPrevious={() => setCurrentStep(4)}
              onSave={handleSave}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
