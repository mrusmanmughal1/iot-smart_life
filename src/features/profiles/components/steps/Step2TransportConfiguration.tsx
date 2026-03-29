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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DeviceProfileMultiStepFormData } from '../../types/device-profile-form.types';

interface Step2TransportConfigurationProps {
  form: UseFormReturn<DeviceProfileMultiStepFormData>;
}

export const Step2TransportConfiguration: React.FC<
  Step2TransportConfigurationProps
> = ({ form }) => {
  const transportType = form.watch('transportType');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold  text-primary  mb-1">
          Transport Configuration
        </h3>
        <p className="text-sm text-gray-500">
          Configure the transport protocol settings (Optional)
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="transportType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transport Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mqtt">MQTT</SelectItem>
                  <SelectItem value="http">HTTP</SelectItem>
                  <SelectItem value="coap">CoAP</SelectItem>
                  <SelectItem value="lwm2m">LWM2M</SelectItem>
                  <SelectItem value="snmp">SNMP</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {transportType === 'mqtt' && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            <FormField
              control={form.control}
              name="transportConfiguration.mqttConfig.deviceTelemetryTopic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Telemetry Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., v1/devices/me/telemetry"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>
                    MQTT topic for device telemetry data
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transportConfiguration.mqttConfig.deviceAttributesTopic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Attributes Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., v1/devices/me/attributes"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {transportType === 'http' && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            <FormField
              control={form.control}
              name="transportConfiguration.httpConfig.baseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., https://api.example.com"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transportConfiguration.httpConfig.timeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeout (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {transportType === 'coap' && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            <FormField
              control={form.control}
              name="transportConfiguration.coapConfig.port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5683"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {transportType === 'modbus' && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            <FormField
              control={form.control}
              name="transportConfiguration.modbusConfig.port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="502"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transportConfiguration.modbusConfig.baudRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Baud Rate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="9600"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {transportType === 'loraWan' && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            <FormField
              control={form.control}
              name="transportConfiguration.loraWanConfig.region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., EU868"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transportConfiguration.loraWanConfig.appEui"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application EUI</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 0000000000000000"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};
