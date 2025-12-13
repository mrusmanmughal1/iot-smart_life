import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DeviceProfileMultiStepFormData } from '../../types/device-profile-form.types';

interface Step1DeviceProfileDetailsProps {
  form: UseFormReturn<DeviceProfileMultiStepFormData>;
}

export const Step1DeviceProfileDetails: React.FC<Step1DeviceProfileDetailsProps> = ({
  form,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg text-primary font-semibold mb-1">Device Profile Details</h3>
        <p className="text-sm text-gray-500">
          Provide basic information about the device profile
        </p>
      </div>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Temperature Sensor"
                  {...field}
                  className='border-2 rounded-md'
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Profile description..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device Type *</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Sensor">Sensor</SelectItem>
                  <SelectItem value="Gateway">Gateway</SelectItem>
                  <SelectItem value="Meter">Meter</SelectItem>
                  <SelectItem value="Actuator">Actuator</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultRuleChain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Rule Chain</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select default rule chain" />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="queue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Queue</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Main Queue"
                  {...field}
                  className="border-2 rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultEdgeRuleChain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Edge Rule Chain</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select default edge rule chain" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Root Rule Chain">
                    Root Rule Chain
                  </SelectItem>
                  <SelectItem value="Edge Processing">
                    Edge Processing
                  </SelectItem>
                  <SelectItem value="Gateway Processing">
                    Gateway Processing
                  </SelectItem>
                  <SelectItem value="Energy Processing">
                    Energy Processing
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

