import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { DeviceProfileMultiStepFormData } from '../../types/device-profile-form.types';

interface Step3AlarmRulesProps {
  form: UseFormReturn<DeviceProfileMultiStepFormData>;
}

export const Step3AlarmRules: React.FC<Step3AlarmRulesProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'alarmRules',
  });

  const addAlarmRule = () => {
    append({
      name: '',
      condition: '',
      severity: 'WARNING',
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold  text-primary  mb-1">Alarm Rules</h3>
        <p className="text-sm text-gray-500">
          Define alarm rules for device monitoring (Optional)
        </p>
      </div>

      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">No alarm rules defined</p>
            <Button
              type="button"
              variant="outline"
              onClick={addAlarmRule}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Alarm Rule
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-lg space-y-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Alarm Rule {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`alarmRules.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rule Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., High Temperature Alert"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`alarmRules.${index}.severity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CRITICAL">Critical</SelectItem>
                            <SelectItem value="MAJOR">Major</SelectItem>
                            <SelectItem value="MINOR">Minor</SelectItem>
                            <SelectItem value="WARNING">Warning</SelectItem>
                            <SelectItem value="INDETERMINATE">
                              Indeterminate
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`alarmRules.${index}.condition`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., temperature > 80"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addAlarmRule}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Another Alarm Rule
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
