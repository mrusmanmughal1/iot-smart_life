import React from 'react';
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AssetOption, FilterFormValues } from '@/features/floorPlan/types';

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
        {filteredAssets.map((asset) => {
          const isSelected = asset.id === selectedAssetId;

          return (
            <button
              key={asset.id}
              type="button"
              onClick={() => onSelectAsset(asset.id)}
              className={`relative flex h-full flex-col overflow-hidden border-gray-300 justify-between rounded-e-xl border bg-white p-6 text-left transition-shadow ${
                isSelected
                  ? '  shadow-md border-primary border-2'
                  : 'border-border  hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute left-0 top-0 h-full w-5 bg-primary" />
              )}

              <div className="space-y-1">
                <p className="text-sm font-semibold">{asset.name}</p>
                <p className="text-xs text-muted-foreground">
                  Type: {asset.type} Location: {asset.location}
                </p>
                <p className="text-xs text-muted-foreground">
                  Status: {asset.status}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2  ">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onNext} disabled={!selectedAssetId}>
          Next
        </Button>
      </div>
    </div>
  );
};
