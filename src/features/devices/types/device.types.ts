import type { Device } from '@/services/api/devices.api.ts';

export interface DeviceFormData {
  name: string;
  type: string;
  label?: string;
  deviceProfileId?: string;
  gatewayId?: string;
  description?: string;
}

export interface DeviceFilters {
  search?: string;
  type?: string;
  active?: boolean;
  deviceProfileId?: string;
  gatewayId?: string;
}

export interface DeviceTelemetryData {
  key: string;
  value: any;
  timestamp: number;
}

export interface DeviceHealth {
  deviceId: string;
  deviceName: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: Date | null;
  minutesSinceLastSeen: number | null;
  active: boolean;
}

export interface DeviceProvisionResult {
  device: Device;
  success: boolean;
  message?: string;
}

export interface BulkProvisionResult {
  successful: Device[];
  failed: Array<{ device: string; error: string }>;
  total: number;
  successCount: number;
  failCount: number;
}

export interface DeviceListItem extends Device {
  health?: DeviceHealth;
  telemetry?: Record<string, any>;
}

export type DeviceAction = 
  | 'view'
  | 'edit'
  | 'delete'
  | 'activate'
  | 'deactivate'
  | 'clone'
  | 'export';