import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDevices } from '@/features/devices/hooks/useDevices';
import { useDeviceLatestTelemetry } from '@/features/devices/hooks/useDeviceTelemetry';
import { cn } from '@/lib/util';
import { Search, Loader2 } from 'lucide-react';

export const TriggerStep: React.FC = () => {
  const { t } = useTranslation();
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const triggerErrors = errors.trigger as any;
  const { data: devicesData } = useDevices({ limit: 100 });
  const devices = devicesData?.data?.data?.data || [];
  const [searchTerm, setSearchTerm] = useState('');

  const triggerData = watch('trigger');

  const { data: telemetryData, isLoading: isLoadingTelemetry } =
    useDeviceLatestTelemetry(triggerData?.deviceId);
  const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    if (!obj || typeof obj !== 'object') return {};
    return Object.keys(obj).reduce((acc: any, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (
        typeof obj[k] === 'object' &&
        obj[k] !== null &&
        !Array.isArray(obj[k]) &&
        Object.keys(obj[k]).length > 0
      ) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const availableTelemetryKeys = useMemo(() => {
    // Try to find the telemetry object at different possible depths
    const rawData =
      telemetryData?.data?.data?.data ||
      telemetryData?.data?.data ||
      telemetryData?.data;

    if (!rawData || typeof rawData !== 'object') return [];

    const flattened = flattenObject(rawData);
    return Object.keys(flattened);
  }, [telemetryData]);

  const triggerTypes = [
    { id: 'threshold', label: 'Device Data' },
    { id: 'schedule', label: 'Device Schedule Data' },
    { id: 'manual', label: 'Manual' },
    { id: 'event', label: 'API Event' },
  ];

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const filteredDevices = devices.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-2 border border-slate-200 rounded-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Configure Trigger
      </h2>
      <div className="flex items-center gap-2 mb-6">
        {triggerTypes.map((type) => (
          <Button
            key={type.id}
            variant={triggerData?.type === type.id ? 'default' : 'primary'}
            className={cn(
              'px-4 text-xs rounded-md transition-all hover:bg-primary hover:text-white',
              triggerData?.type === type.id
                ? 'bg-primary text-white'
                : 'bg-slate-50 text-slate-800'
            )}
            onClick={() => setValue('trigger.type', type.id)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Device *</Label>
            <div
              className={cn(
                'border border-slate-200 rounded-lg p-2 min-h-[150px] space-y-2',
                triggerErrors?.deviceId && 'border-destructive'
              )}
            >
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search and select device..."
                  className="pl-8 border focus-visible:ring-0 shadow-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {filteredDevices.map((device) => (
                  <div
                    key={device.id}
                    className={cn(
                      'flex items-center gap-2 p-2 border-b border-slate-200 cursor-pointer text-sm transition-colors',
                      triggerData?.deviceId === device.id
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-accent'
                    )}
                    onClick={() =>
                      setValue('trigger.deviceId', device.id, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <div
                      className={cn(
                        'w-1.5 h-1.5 rounded-full bg-gray-400',
                        triggerData?.deviceId === device.id && 'bg-primary'
                      )}
                    />
                    {device.name}
                  </div>
                ))}
              </div>
            </div>
            {triggerErrors?.deviceId && (
              <p className="text-xs text-destructive mt-1">
                Device selection is required
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Attribute/Parameter *</Label>
            <Controller
              name="trigger.telemetryKey"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={cn(
                      'w-full bg-white',
                      triggerErrors?.telemetryKey && 'border-destructive'
                    )}
                    disabled={isLoadingTelemetry || !triggerData?.deviceId}
                  >
                    <SelectValue
                      placeholder={
                        isLoadingTelemetry
                          ? 'Loading telemetry...'
                          : !triggerData?.deviceId
                            ? 'Select device first'
                            : 'Select attribute'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingTelemetry ? (
                      <div className="flex items-center justify-center p-4 text-xs text-muted-foreground">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Fetching telemetry...
                      </div>
                    ) : availableTelemetryKeys.length > 0 ? (
                      availableTelemetryKeys.map((key) => (
                        <SelectItem key={key} value={key}>
                          {key.split('.').pop()}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-xs text-muted-foreground text-center">
                        {triggerData?.deviceId
                          ? 'No telemetry keys found'
                          : 'Please select a device'}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {triggerErrors?.telemetryKey && (
              <p className="text-xs text-destructive mt-1">
                Attribute is required
              </p>
            )}
          </div>

          <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-6 shadow-sm">
            <h4 className="font-semibold mb-1 text-gray-700">
              Advanced Settings
            </h4>

            <div className="">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Controller
                    name="trigger.enableDebounce"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="debounce"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Label
                    htmlFor="debounce"
                    className="text-sm font-normal text-gray-500"
                  >
                    Enable debounce (prevent rapid triggering)
                  </Label>
                </div>
                {watch('trigger.enableDebounce') && (
                  <div className="flex items-center gap-2 ml-6 animate-in slide-in-from-left-2 duration-200">
                    <span className="text-xs text-gray-400">
                      Debounce time:
                    </span>
                    <Input
                      className="w-16 h-8 text-center text-xs"
                      type="number"
                      {...register('trigger.debounce', { valueAsNumber: true })}
                    />
                    <span className="text-xs text-gray-400">Seconds</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Controller
                    name="trigger.activeHoursEnabled"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="hours-enabled"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Label
                    htmlFor="hours-enabled"
                    className="text-sm font-normal text-gray-500"
                  >
                    Only trigger during specific hours
                  </Label>
                </div>
                {watch('trigger.activeHoursEnabled') && (
                  <div className="space-y-3 animate-in slide-in-from-left-2 duration-200">
                    <div className="flex items-center gap-2 ml-6 text-xs text-gray-500">
                      <span>From:</span>
                      <Input
                        className="w-16 h-8 text-center"
                        {...register('trigger.activeHours.start')}
                      />
                      <span>To:</span>
                      <Input
                        className="w-16 h-8 text-center"
                        {...register('trigger.activeHours.end')}
                      />
                    </div>
                    <div className="flex items-center gap-2 ml-6 pt-1">
                      <span className="text-xs text-gray-500 mr-1">Days:</span>
                      {days.map((day, i) => {
                        const dayValue = i + 1;
                        const isActive =
                          watch('trigger.activeDays')?.includes(dayValue);
                        return (
                          <div
                            key={i}
                            onClick={() => {
                              const currentDays =
                                watch('trigger.activeDays') || [];
                              const newDays = isActive
                                ? currentDays.filter(
                                    (d: number) => d !== dayValue
                                  )
                                : [...currentDays, dayValue];
                              setValue('trigger.activeDays', newDays);
                            }}
                            className={cn(
                              'w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border transition-colors cursor-pointer',
                              isActive
                                ? 'bg-primary/20 text-primary border-primary/30'
                                : 'bg-gray-100 text-gray-400 border-gray-200'
                            )}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Condition *</Label>
          <div className="grid grid-cols-5 gap-2">
            <Controller
              name="trigger.operator"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[140px] bg-white">
                    <SelectValue
                      className="text-sm"
                      placeholder="Greater Than"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="text-sm" value="gt">
                      Greater Than
                    </SelectItem>
                    <SelectItem className="text-sm" value="lt">
                      Less Than
                    </SelectItem>
                    <SelectItem className="text-sm" value="eq">
                      Equals
                    </SelectItem>
                    <SelectItem className="text-sm" value="gte">
                      Greater Equals
                    </SelectItem>
                    <SelectItem className="text-sm" value="lte">
                      Less Equals
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <div className="space-y-1">
              <Input
                className="text-center"
                placeholder="25 or idle"
                type="text"
                {...register('trigger.value')}
                error={triggerErrors?.value?.message as string}
              />
            </div>
            <div className="flex items-center gap-2 col-span-3">
              <div className="px-3 py-2 bg-gray-100 rounded-md text-sm border">
                °C
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="bg-primary text-white"
              >
                + Add And
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                + Add OR
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2 pt-4">
        <Button
          type="button"
          className="bg-primary text-white text-xs px-3 py-1"
        >
          Test Trigger
        </Button>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md text-sm border border-blue-100">
          Preview: When{' '}
          {devices.find((d) => d.id === triggerData?.deviceId)?.name ||
            'Device'}{' '}
          {triggerData?.telemetryKey?.split('.').pop() || 'Attribute'}{' '}
          {triggerData?.operator === 'gt'
            ? '>'
            : triggerData?.operator === 'lt'
              ? '<'
              : triggerData?.operator === 'eq'
                ? '=='
                : triggerData?.operator === 'gte'
                  ? '>='
                  : '<='}{' '}
          {triggerData?.value ?? '0'}
          °C
        </div>
      </div>
    </div>
  );
};
