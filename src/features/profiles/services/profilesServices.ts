import { deviceProfilesApi, assetProfilesApi } from '@/services/api/index.ts';
import type { DeviceProfile, AssetProfile } from '@/services/api/profiles.api.ts';

/**
 * Device Profiles Feature Service
 * Handles business logic for device profile management
 */
export const deviceProfileService = {
  /**
   * Create device profile with validation
   */
  async createProfile(data: Partial<DeviceProfile>) {
    // Validate required fields
    if (!data.name || !data.type) {
      throw new Error('Profile name and type are required');
    }

    // Validate telemetry keys
    if (data.telemetryKeys) {
      const validation = this.validateTelemetryKeys(data.telemetryKeys);
      if (!validation.valid) {
        throw new Error(`Invalid telemetry keys: ${validation.errors.join(', ')}`);
      }
    }

    return deviceProfilesApi.create(data);
  },

  /**
   * Validate telemetry keys
   */
  validateTelemetryKeys(keys: DeviceProfile['telemetryKeys']) {
    const errors = [];
    const keyNames = new Set();

    keys?.forEach((key, index) => {
      if (!key.key) {
        errors.push(`Telemetry key ${index}: key name is required`);
      }
      
      if (keyNames.has(key.key)) {
        errors.push(`Telemetry key ${index}: duplicate key "${key.key}"`);
      }
      
      keyNames.add(key.key);

      if (!key.type) {
        errors.push(`Telemetry key ${index}: type is required`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Clone profile with modifications
   */
  async cloneProfile(profileId: string, newName: string, modifications?: Partial<DeviceProfile>) {
    const result = await deviceProfilesApi.clone(profileId, newName);
    
    // Apply modifications if provided
    if (modifications) {
      return deviceProfilesApi.update(result.data.data.id, modifications);
    }

    return result;
  },

  /**
   * Get profile with devices
   */
  async getProfileWithDevices(profileId: string) {
    const [profile, devices, stats] = await Promise.all([
      deviceProfilesApi.getById(profileId),
      deviceProfilesApi.getDevices(profileId),
      deviceProfilesApi.getStatistics(),
    ]);

    return {
      profile: profile.data.data,
      devices: devices.data.data,
      deviceCount: devices.data.data.length,
      statistics: stats.data.data,
    };
  },

  /**
   * Validate device telemetry against profile
   */
  async validateDeviceTelemetry(profileId: string, telemetry: Record<string, any>) {
    try {
      const result = await deviceProfilesApi.validateTelemetry(profileId, telemetry);
      return {
        valid: true,
        result: result.data.data,
      };
    } catch (error: any) {
      return {
        valid: false,
        errors: [error.message],
      };
    }
  },

  /**
   * Generate profile template
   */
  generateTemplate(type: DeviceProfile['type']): Partial<DeviceProfile> {
    const templates: Record<string, Partial<DeviceProfile>> = {
      DEFAULT: {
        type: 'DEFAULT',
        transportType: 'DEFAULT',
        telemetryKeys: [
          { key: 'temperature', type: 'double', label: 'Temperature', units: '°C' },
          { key: 'humidity', type: 'double', label: 'Humidity', units: '%' },
        ],
      },
      MQTT: {
        type: 'MQTT',
        transportType: 'MQTT',
        telemetryKeys: [
          { key: 'value', type: 'string', label: 'Value' },
        ],
        transportConfiguration: {
          deviceTelemetryTopic: 'v1/devices/me/telemetry',
          deviceAttributesTopic: 'v1/devices/me/attributes',
        },
      },
      HTTP: {
        type: 'HTTP',
        transportType: 'HTTP',
        telemetryKeys: [
          { key: 'data', type: 'json', label: 'Data' },
        ],
      },
    };

    return templates[type] || templates.DEFAULT;
  },

  /**
   * Compare two profiles
   */
  async compareProfiles(profileId1: string, profileId2: string) {
    const [profile1, profile2] = await Promise.all([
      deviceProfilesApi.getById(profileId1),
      deviceProfilesApi.getById(profileId2),
    ]);

    const p1 = profile1.data.data;
    const p2 = profile2.data.data;

    return {
      profiles: [p1, p2],
      differences: {
        type: p1.type !== p2.type,
        transportType: p1.transportType !== p2.transportType,
        telemetryKeysCount: p1.telemetryKeys?.length !== p2.telemetryKeys?.length,
        provisionType: p1.provisionType !== p2.provisionType,
      },
    };
  },

  /**
   * Set as default profile
   */
  async setAsDefault(profileId: string) {
    await deviceProfilesApi.setDefault(profileId);
    
    return {
      profileId,
      setAsDefaultAt: new Date().toISOString(),
    };
  },

  /**
   * Get profile statistics
   */
  async getProfileStatistics() {
    const stats = await deviceProfilesApi.getStatistics();
    
    return {
      ...stats.data.data,
      timestamp: new Date().toISOString(),
    };
  },
};

/**
 * Asset Profiles Feature Service
 * Handles business logic for asset profile management
 */
export const assetProfileService = {
  /**
   * Create asset profile with validation
   */
  async createProfile(data: Partial<AssetProfile>) {
    // Validate required fields
    if (!data.name) {
      throw new Error('Profile name is required');
    }

    // Validate custom fields
    if (data.customFields) {
      const validation = this.validateCustomFields(data.customFields);
      if (!validation.valid) {
        throw new Error(`Invalid custom fields: ${validation.errors.join(', ')}`);
      }
    }

    return assetProfilesApi.create(data);
  },

  /**
   * Validate custom fields
   */
  validateCustomFields(fields: AssetProfile['customFields']) {
    const errors = [];
    const fieldNames = new Set();

    fields?.forEach((field, index) => {
      if (!field.name) {
        errors.push(`Field ${index}: name is required`);
      }

      if (fieldNames.has(field.name)) {
        errors.push(`Field ${index}: duplicate field "${field.name}"`);
      }

      fieldNames.add(field.name);

      if (!field.type) {
        errors.push(`Field ${index}: type is required`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Clone profile with modifications
   */
  async cloneProfile(profileId: string, newName: string, modifications?: Partial<AssetProfile>) {
    const result = await assetProfilesApi.clone(profileId, newName);

    if (modifications) {
      return assetProfilesApi.update(result.data.data.id, modifications);
    }

    return result;
  },

  /**
   * Get profile with assets
   */
  async getProfileWithAssets(profileId: string) {
    const [profile, assets] = await Promise.all([
      assetProfilesApi.getById(profileId),
      assetProfilesApi.getAssets(profileId),
    ]);

    return {
      profile: profile.data.data,
      assets: assets.data.data,
      assetCount: assets.data.data.length,
    };
  },

  /**
   * Validate asset data against profile
   */
  async validateAssetData(profileId: string, data: Record<string, any>) {
    try {
      const result = await assetProfilesApi.validateAssetData(profileId, data);
      return {
        valid: true,
        result: result.data.data,
      };
    } catch (error: any) {
      return {
        valid: false,
        errors: [error.message],
      };
    }
  },

  /**
   * Generate profile template for asset type
   */
  generateTemplate(assetType: string): Partial<AssetProfile> {
    const templates: Record<string, Partial<AssetProfile>> = {
      BUILDING: {
        name: `${assetType} Profile`,
        customFields: [
          { name: 'address', type: 'string', label: 'Address', required: true },
          { name: 'floors', type: 'number', label: 'Number of Floors', required: false },
          { name: 'area', type: 'number', label: 'Area (sq m)', required: false },
        ],
      },
      VEHICLE: {
        name: `${assetType} Profile`,
        customFields: [
          { name: 'make', type: 'string', label: 'Make', required: true },
          { name: 'model', type: 'string', label: 'Model', required: true },
          { name: 'year', type: 'number', label: 'Year', required: true },
          { name: 'vin', type: 'string', label: 'VIN', required: false },
        ],
      },
      EQUIPMENT: {
        name: `${assetType} Profile`,
        customFields: [
          { name: 'manufacturer', type: 'string', label: 'Manufacturer', required: true },
          { name: 'serialNumber', type: 'string', label: 'Serial Number', required: true },
          { name: 'installDate', type: 'date', label: 'Installation Date', required: false },
        ],
      },
    };

    return templates[assetType] || {
      name: `${assetType} Profile`,
      customFields: [
        { name: 'description', type: 'string', label: 'Description' },
      ],
    };
  },

  /**
   * Set as default profile
   */
  async setAsDefault(profileId: string) {
    await assetProfilesApi.setDefault(profileId);

    return {
      profileId,
      setAsDefaultAt: new Date().toISOString(),
    };
  },

  /**
   * Get profile statistics
   */
  async getProfileStatistics() {
    const stats = await assetProfilesApi.getStatistics();

    return {
      ...stats.data.data,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Merge profiles
   */
  async mergeProfiles(baseProfileId: string, mergeProfileId: string, newName: string) {
    const [base, merge] = await Promise.all([
      assetProfilesApi.getById(baseProfileId),
      assetProfilesApi.getById(mergeProfileId),
    ]);

    // Merge custom fields
    const baseFields = base.data.data.customFields || [];
    const mergeFields = merge.data.data.customFields || [];
    
    const mergedFields = [...baseFields];
    mergeFields.forEach(field => {
      if (!baseFields.find(f => f.name === field.name)) {
        mergedFields.push(field);
      }
    });

    return this.createProfile({
      name: newName,
      description: `Merged from ${base.data.data.name} and ${merge.data.data.name}`,
      customFields: mergedFields,
    });
  },
};