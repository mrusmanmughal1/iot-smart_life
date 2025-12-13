export type DeviceType = 'Sensor' | 'Gateway' | 'Meter' | 'Actuator';

export type TransportType = 'MQTT' | 'HTTP' | 'CoAP' | 'Modbus' | 'LoRaWAN';

export type ProvisionType = 
  | 'Allow creating new devices' 
  | 'Check pre-provisioned devices' 
  | 'Disabled';

export interface DeviceProfile {
  id: string;
  name: string;
  description: string;
  type: DeviceType;
  transportType: TransportType;
  provisionType: ProvisionType;
  defaultRuleChain: string;
  createdTime: Date;
  devices: number;
  isDefault: boolean;
}

export interface DeviceProfileFormData {
  name: string;
  description: string;
  type: DeviceType;
  transportType: TransportType;
  provisionType: ProvisionType;
  defaultRuleChain: string;
}

export const DEFAULT_DEVICE_PROFILE_FORM_DATA: DeviceProfileFormData = {
  name: '',
  description: '',
  type: 'Sensor',
  transportType: 'MQTT',
  provisionType: 'Allow creating new devices',
  defaultRuleChain: 'Root Rule Chain',
};

