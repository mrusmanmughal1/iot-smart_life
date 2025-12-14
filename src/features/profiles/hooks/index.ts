import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceProfilesApi, assetProfilesApi } from '@/services/api';
import type { DeviceProfileMultiStepFormData } from '../types/device-profile-form.types';
import type { AssetProfileFormData } from '../types/asset-profile-form.types';

export const useDeviceProfiles = (params?: any) => {
  return useQuery({
    queryKey: ['profiles', 'device', params],
    queryFn: () => deviceProfilesApi.getAll(params),
  });
};
export const useDeviceProfileStatistics = () => {
  return useQuery({
    queryKey: ['profiles', 'device', 'statistics'],
    queryFn: () => deviceProfilesApi.getStatistics(),
  });
};

export const useAssetProfiles = (params?: any) => {
  return useQuery({
    queryKey: ['profiles', 'asset', params],
    queryFn: () => assetProfilesApi.getAll(params),
  });
};

export const useDeviceProfile = (profileId: string) => {
  return useQuery({
    queryKey: ['profiles', 'device', profileId],
    queryFn: () => deviceProfilesApi.getById(profileId),
    enabled: !!profileId,
  });
};

export const useAssetProfile = (profileId: string) => {
  return useQuery({
    queryKey: ['profiles', 'asset', profileId],
    queryFn: () => assetProfilesApi.getById(profileId),
    enabled: !!profileId,
  });
};

/**
 * Hook to create a device profile
 * Transforms form data to API format and submits to /profiles/device
 */
export const useCreateDeviceProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: DeviceProfileMultiStepFormData) => {
      // Transform form data to API format
      const apiData = transformFormDataToApiFormat(formData);
      return deviceProfilesApi.create(apiData);
    },
    onSuccess: () => {
      // Invalidate and refetch device profiles list
      queryClient.invalidateQueries({ queryKey: ['profiles', 'device'] });
    },
  });
};

/**
 * Transform multi-step form data to API format
 */
function transformFormDataToApiFormat(
  formData: DeviceProfileMultiStepFormData
): Record<string, unknown> {
  // Transform type: 'Sensor' -> 'sensor', 'Gateway' -> 'gateway', etc.
  const transformType = (type: string): string => {
    return type.toLowerCase();
  };

  // Transform transport type: 'MQTT' -> 'mqtt', etc.
  const transformTransportType = (transport: string): string => {
    return transport.toLowerCase();
  };

  // Transform provision type: 'Allow creating new devices' -> 'allow_create_new'
  const transformProvisionType = (provision: string): string => {
    const mapping: Record<string, string> = {
      'Allow creating new devices': 'allow_create_new',
      'Check pre-provisioned devices': 'check_pre_provisioned_devices',
      'Disabled': 'disabled',
    };
    return mapping[provision] || provision.toLowerCase().replace(/\s+/g, '_');
  };

  // Build transport configuration
  const buildTransportConfiguration = (transportConfig: any) => {
    if (!transportConfig || !transportConfig.type) return {};

    const config: any = {};
    const transportType = transformTransportType(transportConfig.type);

    switch (transportType) {
      case 'mqtt':
        config.mqtt = {
          sparkplug: transportConfig.mqttConfig?.sparkplug || false,
          deviceTelemetryTopic:
            transportConfig.mqttConfig?.deviceTelemetryTopic ||
            'v1/devices/me/telemetry',
          deviceAttributesTopic:
            transportConfig.mqttConfig?.deviceAttributesTopic ||
            'v1/devices/me/attributes',
        };
        break;
      case 'http':
        config.http = {
          baseUrl: transportConfig.httpConfig?.baseUrl || '',
          timeout: transportConfig.httpConfig?.timeout || 5000,
        };
        break;
      case 'coap':
        config.coap = {
          port: transportConfig.coapConfig?.port || 5683,
          timeout: transportConfig.coapConfig?.timeout || 5000,
        };
        break;
      case 'modbus':
        config.modbus = {
          port: transportConfig.modbusConfig?.port || 502,
          baudRate: transportConfig.modbusConfig?.baudRate || 9600,
        };
        break;
      case 'lorawan':
        config.loraWan = {
          region: transportConfig.loraWanConfig?.region || '',
          appEui: transportConfig.loraWanConfig?.appEui || '',
        };
        break;
    }

    return config;
  };

  // Transform alarm rules
  const transformAlarmRules = (alarmRules: any[]): any[] => {
    if (!alarmRules || alarmRules.length === 0) return [];

    return alarmRules.map((rule) => {
      // Parse condition (e.g., "temperature > 30")
      const conditionParts = rule.condition
        .split(/\s*(>|<|>=|<=|==|!=)\s*/)
        .filter((part: string) => part.trim());

      if (conditionParts.length >= 3) {
        const key = conditionParts[0].trim();
        const operation = conditionParts[1].trim();
        const value = parseFloat(conditionParts[2].trim());

        const operationMap: Record<string, string> = {
          '>': 'GREATER',
          '<': 'LESS',
          '>=': 'GREATER_OR_EQUAL',
          '<=': 'LESS_OR_EQUAL',
          '==': 'EQUAL',
          '!=': 'NOT_EQUAL',
        };

        return {
          id: rule.name.toLowerCase().replace(/\s+/g, '-'),
          severity: rule.severity,
          alarmType: rule.name,
          propagate: true,
          createCondition: {
            spec: {
              type: 'SIMPLE',
            },
            condition: [
              {
                key: {
                  key: key,
                  type: 'TIME_SERIES',
                },
                predicate: {
                  value: value,
                  operation: operationMap[operation] || 'GREATER',
                },
                valueType: 'NUMERIC',
              },
            ],
          },
        };
      }

      // Fallback for simple alarm rules
      return {
        id: rule.name.toLowerCase().replace(/\s+/g, '-'),
        severity: rule.severity,
        alarmType: rule.name,
        propagate: true,
        createCondition: {
          spec: {
            type: 'SIMPLE',
          },
          condition: [],
        },
      };
    });
  };

  return {
    name: formData.name,
    description: formData.description || undefined,
    type: transformType(formData.type),
    transportType: transformTransportType(formData.transportConfig?.type || 'MQTT'),
    provisionType: transformProvisionType(
      formData.provisioningConfig?.provisionType || 'Allow creating new devices'
    ),
    transportConfiguration: buildTransportConfiguration(formData.transportConfig),
    alarmRules: transformAlarmRules(formData.alarmRules || []),
    defaultRuleChainId: formData.defaultRuleChain || undefined,
    defaultQueueName: formData.queue || undefined,
    // Note: defaultEdgeRuleChain might need to be mapped to a different field
    // based on your API structure
  };
}

/**
 * Hook to update an asset profile
 */
export const useUpdateAssetProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      profileId,
      data,
    }: {
      profileId: string;
      data: AssetProfileFormData;
    }) => {
      // Transform form data to API format
      const apiData = {
        name: data.name,
        description: data.description || undefined,
        defaultRuleChainId: data.defaultRuleChain || undefined,
        defaultQueueName: data.queue || undefined,
        // Map other fields as needed based on API structure
      };
      return assetProfilesApi.update(profileId, apiData);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch asset profiles list and current profile
      queryClient.invalidateQueries({ queryKey: ['profiles', 'asset'] });
      queryClient.invalidateQueries({
        queryKey: ['profiles', 'asset', variables.profileId],
      });
    },
  });
}