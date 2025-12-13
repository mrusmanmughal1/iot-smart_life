import { z } from 'zod';
import type { DeviceType, TransportType, ProvisionType } from '@/features/device-profiles/types';

// Alarm Rule Schema
export const alarmRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Alarm rule name is required'),
  condition: z.string().min(1, 'Condition is required'),
  severity: z.enum(['CRITICAL', 'MAJOR', 'MINOR', 'WARNING', 'INDETERMINATE']),
});

// MQTT Config Schema
export const mqttConfigSchema = z.object({
  deviceTelemetryTopic: z.string().optional(),
  deviceAttributesTopic: z.string().optional(),
  deviceRpcRequestTopic: z.string().optional(),
  deviceRpcResponseTopic: z.string().optional(),
}).optional();

// HTTP Config Schema
export const httpConfigSchema = z.object({
  baseUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  timeout: z.number().min(1, 'Timeout must be at least 1 second').optional(),
}).optional();

// CoAP Config Schema
export const coapConfigSchema = z.object({
  port: z.number().min(1).max(65535, 'Port must be between 1 and 65535').optional(),
  timeout: z.number().min(1).optional(),
}).optional();

// Modbus Config Schema
export const modbusConfigSchema = z.object({
  port: z.number().min(1).max(65535, 'Port must be between 1 and 65535').optional(),
  baudRate: z.number().min(1).optional(),
}).optional();

// LoRaWAN Config Schema
export const loraWanConfigSchema = z.object({
  region: z.string().optional(),
  appEui: z.string().optional(),
}).optional();

// Transport Configuration Schema
export const transportConfigSchema = z.object({
  type: z.enum(['MQTT', 'HTTP', 'CoAP', 'Modbus', 'LoRaWAN']),
  mqttConfig: mqttConfigSchema,
  httpConfig: httpConfigSchema,
  coapConfig: coapConfigSchema,
  modbusConfig: modbusConfigSchema,
  loraWanConfig: loraWanConfigSchema,
}).optional();

// Device Provisioning Config Schema
export const deviceProvisioningConfigSchema = z.object({
  provisionType: z.enum([
    'Allow creating new devices',
    'Check pre-provisioned devices',
    'Disabled',
  ]),
  defaultRuleChain: z.string().min(1, 'Default rule chain is required'),
  preProvisionedDevices: z.array(z.string()).optional(),
}).optional();

// Step 1 Schema: Device Profile Details (Required)
export const step1Schema = z.object({
  name: z.string().min(1, 'Profile name is required').max(100, 'Profile name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
  type: z.enum(['Sensor', 'Gateway', 'Meter', 'Actuator']),
  defaultRuleChain: z.string().optional(),
  queue: z.string().optional(),
  defaultEdgeRuleChain: z.string().optional(),
});

// Step 2 Schema: Transport Configuration (Optional)
export const step2Schema = z.object({
  transportConfig: transportConfigSchema,
}).optional();

// Step 3 Schema: Alarm Rules (Optional)
export const step3Schema = z.object({
  alarmRules: z.array(alarmRuleSchema).optional(),
}).optional();

// Step 4 Schema: Device Provisioning (Optional)
export const step4Schema = z.object({
  provisioningConfig: deviceProvisioningConfigSchema,
}).optional();

// Complete Form Schema
export const deviceProfileMultiStepFormSchema = z.object({
  // Step 1
  name: z.string().min(1, 'Profile name is required').max(100, 'Profile name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
  type: z.enum(['Sensor', 'Gateway', 'Meter', 'Actuator']),
  defaultRuleChain: z.string().optional(),
  queue: z.string().optional(),
  defaultEdgeRuleChain: z.string().optional(),
  
  // Step 2
  transportConfig: transportConfigSchema.optional(),
  
  // Step 3
  alarmRules: z.array(alarmRuleSchema).optional(),
  
  // Step 4
  provisioningConfig: deviceProvisioningConfigSchema.optional(),
});

// Type inference from schema
export type DeviceProfileMultiStepFormSchema = z.infer<typeof deviceProfileMultiStepFormSchema>;

