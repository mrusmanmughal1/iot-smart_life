import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DeviceProfileMultiStepFormData } from '../../types/device-profile-form.types';

interface Step4DeviceProvisioningProps {
  form: UseFormReturn<DeviceProfileMultiStepFormData>;
}

export const Step4DeviceProvisioning: React.FC<
  Step4DeviceProvisioningProps
> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold  text-primary  mb-1">
          Device Provisioning
        </h3>
        <p className="text-sm text-gray-500">
          Configure device provisioning settings (Optional)
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="provisioningConfig.provisionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provision Strategy</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provision strategy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Allow creating new devices">
                    Allow creating new devices
                  </SelectItem>
                  <SelectItem value="Check pre-provisioned devices">
                    Check pre-provisioned devices
                  </SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose how devices are provisioned using this profile
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="provisioningConfig.defaultRuleChain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Rule Chain</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rule chain" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Root Rule Chain">
                    Root Rule Chain
                  </SelectItem>
                  <SelectItem value="Gateway Processing">
                    Gateway Processing
                  </SelectItem>
                  <SelectItem value="Energy Processing">
                    Energy Processing
                  </SelectItem>
                  <SelectItem value="Air Quality Processing">
                    Air Quality Processing
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Default rule chain to process device data
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
