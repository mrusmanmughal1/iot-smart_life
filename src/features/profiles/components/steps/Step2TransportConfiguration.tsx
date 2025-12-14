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

export const Step2TransportConfiguration: React.FC<Step2TransportConfigurationProps> = ({
  form,
}) => {
  const transportType = form.watch('transportConfig.type');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold  text-primary  mb-1">Transport Configuration</h3>
        <p className="text-sm text-gray-500">
          Configure the transport protocol settings (Optional)
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="transportConfig.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transport Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MQTT">MQTT</SelectItem>
                  <SelectItem value="HTTP">HTTP</SelectItem>
                  <SelectItem value="CoAP">CoAP</SelectItem>
                  <SelectItem value="Modbus">Modbus</SelectItem>
                  <SelectItem value="LoRaWAN">LoRaWAN</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {transportType === 'MQTT' && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            <FormField
              control={form.control}
              name="transportConfig.mqttConfig.deviceTelemetryTopic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Telemetry Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., v1/devices/me/telemetry"
                      {...field}
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
              name="transportConfig.mqttConfig.deviceAttributesTopic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Attributes Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., v1/devices/me/attributes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {transportType === 'HTTP' && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            <FormField
              control={form.control}
              name="transportConfig.httpConfig.baseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., https://api.example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transportConfig.httpConfig.timeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeout (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {transportType === 'CoAP' && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            <FormField
              control={form.control}
              name="transportConfig.coapConfig.port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5683"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {transportType === 'Modbus' && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            <FormField
              control={form.control}
              name="transportConfig.modbusConfig.port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="502"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transportConfig.modbusConfig.baudRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Baud Rate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="9600"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {transportType === 'LoRaWAN' && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            <FormField
              control={form.control}
              name="transportConfig.loraWanConfig.region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., EU868" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transportConfig.loraWanConfig.appEui"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application EUI</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 0000000000000000" {...field} />
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

