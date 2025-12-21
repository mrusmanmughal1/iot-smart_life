import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';

interface FloorMapSettingsForm {
  measurementUnit: 'metric' | 'imperial';
  autoSaveEnabled: boolean;
  autoSaveInterval: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  gatewayColor: string;
  sensorColor: string;
  zoneColor: string;
  connectionColor: string;
}

const defaultSettings: FloorMapSettingsForm = {
  measurementUnit: 'metric',
  autoSaveEnabled: true,
  autoSaveInterval: 5,
  showGrid: true,
  snapToGrid: true,
  gridSize: 1,
  gatewayColor: '#10b981', // green
  sensorColor: '#f97316', // orange
  zoneColor: '#3b82f6', // blue
  connectionColor: '#a855f7', // purple
};

export default function FloorMapSettingsPage() {
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } =
    useForm<FloorMapSettingsForm>({
      defaultValues: defaultSettings,
    });

  const measurementUnit = watch('measurementUnit');
  const autoSaveEnabled = watch('autoSaveEnabled');
  const showGrid = watch('showGrid');
  const snapToGrid = watch('snapToGrid');
  const gridSize = watch('gridSize');

  const onSubmit = async (data: FloorMapSettingsForm) => {
    try {
      // TODO: Implement API call to save settings
      toast.success('Settings applied successfully');
    } catch (error) {
      toast.error('Failed to apply settings');
      console.error('Error saving settings:', error);
    }
  };

  const handleReset = () => {
    setIsResetting(true);
    reset(defaultSettings);
    setTimeout(() => {
      setIsResetting(false);
      toast.success('Settings reset to defaults');
    }, 300);
  };

  const handleCancel = () => {
    navigate('/floor-plans');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Floor Map Settings and Configuration"
        actions={[
          {
            label: 'Back',
            onClick: () => navigate('/floor-plans'),
          },
        ]}
      />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* General Settings */}
            <div className="space-y-3 pt-5">
              <h3 className="text-lg font-semibold text-gray-900">
                General Settings
              </h3>

              {/* Measurement Units */}
              <div className="space-y-3 bg-gray-100 p-3 rounded-lg">
                <Label className="text-sm font-medium text-gray-700">
                  Measurement Units
                </Label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={
                      measurementUnit === 'metric' ? 'default' : 'outline'
                    }
                    onClick={() => setValue('measurementUnit', 'metric')}
                    className={
                      measurementUnit === 'metric'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  >
                    Metric (m)
                  </Button>
                  <Button
                    type="button"
                    variant={
                      measurementUnit === 'imperial' ? 'default' : 'outline'
                    }
                    onClick={() => setValue('measurementUnit', 'imperial')}
                    className={
                      measurementUnit === 'imperial'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  >
                    Imperial (ft)
                  </Button>
                </div>
              </div>

              {/* Auto-save Configuration */}
              <div className="space-y-3 bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="autoSave"
                    className="text-sm font-medium text-gray-700"
                  >
                    Enable auto-save
                  </Label>
                  <Switch
                    id="autoSave"
                    checked={autoSaveEnabled}
                    onCheckedChange={(checked) =>
                      setValue('autoSaveEnabled', checked)
                    }
                  />
                </div>
                {autoSaveEnabled && (
                  <div className="text-sm text-gray-600 ml-0">
                    Interval: {watch('autoSaveInterval')} minutes
                  </div>
                )}
              </div>
            </div>

            {/* Grid Settings */}
            <div className="space-y-3   ">
              <h3 className="text-lg font-semibold text-gray-900">
                Grid Settings
              </h3>

              <div className="space-y-4 bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="showGrid"
                    className="text-sm font-medium text-gray-700"
                  >
                    Show grid
                  </Label>
                  <Switch
                    id="showGrid"
                    checked={showGrid}
                    onCheckedChange={(checked) => setValue('showGrid', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="snapToGrid"
                    className="text-sm font-medium text-gray-700"
                  >
                    Snap to grid
                  </Label>
                  <Switch
                    id="snapToGrid"
                    checked={snapToGrid}
                    onCheckedChange={(checked) =>
                      setValue('snapToGrid', checked)
                    }
                  />
                </div>

                <div className="space-y-2 flex items-center justify-between">
                  <Label
                    htmlFor="gridSize"
                    className="text-sm font-medium text-gray-700"
                  >
                    Grid size: {gridSize}
                    {measurementUnit === 'metric' ? 'm' : 'ft'}
                  </Label>
                  <Input
                    id="gridSize"
                    type="number"
                    min="0.1"
                    step="0.1"
                    {...register('gridSize', {
                      valueAsNumber: true,
                      min: 0.1,
                    })}
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 border-t pt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isResetting}
              >
                Reset Default
              </Button>
              <Button type="submit" variant="default">
                Apply Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
