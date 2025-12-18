import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FilterFormValues, AssetOption } from '@/features/floorPlan/types';
import { AssetSelectionStep } from '@/features/floorPlan/components/AssetSelectionStep';
import { DwgImportStep } from '@/features/floorPlan/components/DwgImportStep';
import { ZoneSetupStep } from '@/features/floorPlan/components/ZoneSetupStep';
import { DeviceLinkStep } from '@/features/floorPlan/components/DeviceLinkStep';

type StepId = 1 | 2 | 3 | 4 | 5;

const steps: { id: StepId; label: string }[] = [
  { id: 1, label: 'Asset' },
  { id: 2, label: 'DWG Import' },
  { id: 3, label: 'Zone Setup' },
  { id: 4, label: 'Device Link' },
  { id: 5, label: 'Review' },
];

const mockAssets: AssetOption[] = [
  {
    id: 'asset-1',
    name: 'Building A - Main Office',
    type: 'Commercial Building',
    location: 'Downtown Campus',
    status: 'Active',
  },
  {
    id: 'asset-2',
    name: 'Warehouse B',
    type: 'Commercial Building',
    location: 'Downtown Campus',
    status: 'Active',
  },
  {
    id: 'asset-3',
    name: 'Retail Store C',
    type: 'Retail Store Location',
    location: 'Shopping District',
    status: 'Active',
  },
  {
    id: 'asset-4',
    name: 'Medical Center D',
    type: 'Healthcare Facility',
    location: 'Medical District',
    status: 'Active',
  },
  {
    id: 'asset-5',
    name: 'School Building E',
    type: 'Educational Facility',
    location: 'Education Campus',
    status: 'Active',
  },
  {
    id: 'asset-6',
    name: 'Building A - Main Office',
    type: 'Commercial Building',
    location: 'Downtown Campus',
    status: 'Active',
    notes: [
      'Ready for floor map creation',
      '45 devices available for linking',
      'No existing floor map',
    ],
    isReady: true,
    devicesAvailable: 45,
    hasExistingFloorMap: false,
  },
];

export default function FloorMapCreatePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    'asset-6'
  );

  const form = useForm<FilterFormValues>({
    defaultValues: {
      search: '',
      type: 'all',
      status: 'all',
      drawingScale: '1:100',
      drawingUnit: 'meters',
    },
  });

  const { register, control, setValue } = form;
  const {
    search,
    type = 'all',
    status = 'all',
  } = useWatch({
    control,
  });

  const filteredAssets = useMemo(() => {
    return mockAssets.filter((asset) => {
      const matchesSearch =
        !search ||
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.location.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        type === 'all' || asset.type.toLowerCase().includes(type);

      const matchesStatus =
        status === 'all' || asset.status.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, type, status]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as StepId);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/floor-plans');
    } else {
      setCurrentStep((prev) => (prev - 1) as StepId);
    }
  };

  const currentIndex = steps.findIndex((s) => s.id === currentStep);
const validIndex = currentIndex >= 0 ? currentIndex : 0;

const progressPercent = steps.length <= 1
  ? 10 // or 90 if you consider a single step completed
  : 10 + (validIndex / (steps.length - 1)) * 80;
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
              onCancel={() => navigate('/floor-plans')}
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

          {currentStep > 4 && (
            <div className="rounded-lg border bg-muted/40 p-6 text-sm text-muted-foreground">
              Content for step {currentStep} will be implemented in the next
              iterations. You can navigate back to change the selected asset.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
