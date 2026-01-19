import React, { useState } from 'react';
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AssetOption, FilterFormValues } from '@/features/floorPlan/types';
import { Badge } from '@/components/ui/badge';
import { floorPlansApi } from '@/services/api/floor-plans.api';

interface AssetSelectionStepProps {
  register: UseFormRegister<FilterFormValues>;
  control: Control<FilterFormValues>;
  setValue: UseFormSetValue<FilterFormValues>;
  filteredAssets: AssetOption[];
  selectedAssetId: string | null;
  onSelectAsset: (id: string) => void;
  onCancel: () => void;
  onNext: () => void;
}

export const AssetSelectionStep: React.FC<AssetSelectionStepProps> = ({
  register,
  control,
  setValue,
  filteredAssets,
  selectedAssetId,
  onSelectAsset,
  onCancel,
  onNext,
}) => {
  const [floorName, setFloorName] = useState('');

  const { mutate: createFloorPlan, isPending } = useMutation({
    mutationFn: async (data: { assetId: string; name: string; status: string }) => {
      // Create FormData for the API
      
      return floorPlansApi.create({
        assetId: data.assetId,
        name: data.name,
        status: data.status,
      });
      
    },
    onSuccess: () => {
      toast.success('Floor plan created successfully');
      // Store the created floor plan ID if needed
      onNext();
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error && typeof error === 'object' && 'response' in error &&
         error.response && typeof error.response === 'object' && 'data' in error.response &&
         error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data &&
         typeof error.response.data.message === 'string')
          ? error.response.data.message
          : 'Failed to create floor plan';
      toast.error(errorMessage);
    },
  });

  const handleNext = () => {
    if (!selectedAssetId) {
      toast.error('Please select an asset');
      return;
    }

    if (!floorName.trim()) {
      toast.error('Please enter a floor name');
      return;
    }

    createFloorPlan({
      assetId: selectedAssetId,
      name: floorName.trim(),
      status: 'draft',
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">
          Select Asset for Floor Map
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose the asset (building/facility) for which you want to create a
          floor map.
        </p>
      </div>

      {/* Floor Name Input */}
      <div className="space-y-2">
        <Label htmlFor="floorName" className="text-sm text-black dark:text-white font-medium">Floor Name</Label>
        <Input
          id="floorName"
          placeholder="e.g., Factory Floor - Production Area"
          value={floorName}
          onChange={(e) => {
            setFloorName(e.target.value);
            setValue('floorName', e.target.value);
          }}
          className="bg-white border rounded-md"
        />
      </div>

      {/* Filters */}
      <form className="grid gap-4  md:grid-cols-4">
        <div>
          <Input
            placeholder="Search assets..."
            {...register('search')}
            className="bg-white border rounded-md"
          />
        </div>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                setValue('type', value);
              }}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Filter by Type</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                setValue('status', value);
              }}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </form>

      {/* Asset cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredAssets?.map((asset) => {
          const isSelected = asset.id === selectedAssetId;

          return (
            <button
              key={asset.id}
              type="button"
              onClick={() => onSelectAsset(asset.id)}
              className={`relative flex h-full flex-col overflow-hidden border-gray-300 justify-between rounded-e-xl border bg-white p-2 ps-10 text-left transition-shadow ${
                isSelected
                  ? '  shadow-md border-primary border-2'
                  : 'border-border  hover:shadow-sm'
              }`}
            >
              <div className="absolute left-0 top-0 h-full w-6 bg-primary" />

              <div className="space-y-1">
                <p className="text-sm font-semibold">{asset.name}</p>
                <p className="text-xs text-muted-foreground">
                  Type : {asset.type} <br /> Location: {asset.location}
                </p>
                <p className="text-xs text-muted-foreground">
                  Status:{' '}
                  <Badge variant={asset.active === 'active' ? 'success' : 'destructive'}>
                    {asset.active === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2  ">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={handleNext} 
          disabled={!selectedAssetId || !floorName.trim() || isPending}
        >
          {isPending ? 'Creating...' : 'Next'}
        </Button>
      </div>
    </div>
  );
};
