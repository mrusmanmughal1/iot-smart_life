import { floorPlansApi } from '@/services/api';
import type {
  FloorPlan,
  FloorPlanQuery,
  DeviceMarker,
} from '@/services/api/floor-plans.api';

/**
 * Floor Plans Feature Service
 * Handles business logic for floor plan management
 */
export const floorPlanService = {
  /**
   * Create floor plan with validation
   */
  async createFloorPlan(data: {
    name: string;
    description?: string;
    building?: string;
    floor?: string;
    imageFile?: File;
    dimensions: { width: number; height: number; scale?: number };
    deviceMarkers?: DeviceMarker[];
    metadata?: Record<string, unknown>;
  }) {
    // Validate required fields
    if (!data.name) {
      throw new Error('Floor plan name is required');
    }

    if (!data.dimensions || !data.dimensions.width || !data.dimensions.height) {
      throw new Error('Floor plan dimensions are required');
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.building) formData.append('building', data.building);
    if (data.floor) formData.append('floor', data.floor);
    if (data.imageFile) formData.append('image', data.imageFile);
    formData.append('dimensions', JSON.stringify(data.dimensions));
    if (data.deviceMarkers) {
      formData.append('deviceMarkers', JSON.stringify(data.deviceMarkers));
    }
    if (data.metadata) {
      formData.append('metadata', JSON.stringify(data.metadata));
    }

    const response = await floorPlansApi.create(formData);
    return response.data.data;
  },

  /**
   * Update floor plan with validation
   */
  async updateFloorPlan(
    id: string,
    data: Partial<FloorPlan>
  ): Promise<FloorPlan> {
    if (!id) {
      throw new Error('Floor plan ID is required');
    }

    const response = await floorPlansApi.update(id, data);
    return response.data.data;
  },

  /**
   * Get floor plan with devices
   */
  async getFloorPlanWithDevices(id: string) {
    const [floorPlanResponse, devicesResponse] = await Promise.all([
      floorPlansApi.getById(id),
      floorPlansApi.getDevices(id),
    ]);

    return {
      floorPlan: floorPlanResponse.data.data,
      devices: devicesResponse.data.data,
    };
  },

  /**
   * Add device marker to floor plan
   */
  async addDeviceMarker(
    floorPlanId: string,
    marker: DeviceMarker
  ): Promise<FloorPlan> {
    if (!floorPlanId) {
      throw new Error('Floor plan ID is required');
    }

    if (!marker.deviceId || marker.x === undefined || marker.y === undefined) {
      throw new Error('Device marker requires deviceId, x, and y coordinates');
    }

    const response = await floorPlansApi.addDeviceMarker(floorPlanId, marker);
    return response.data.data;
  },

  /**
   * Update device marker position
   */
  async updateDeviceMarker(
    floorPlanId: string,
    deviceId: string,
    updates: Partial<DeviceMarker>
  ): Promise<FloorPlan> {
    if (!floorPlanId || !deviceId) {
      throw new Error('Floor plan ID and device ID are required');
    }

    const response = await floorPlansApi.updateDeviceMarker(
      floorPlanId,
      deviceId,
      updates
    );
    return response.data.data;
  },

  /**
   * Remove device marker from floor plan
   */
  async removeDeviceMarker(
    floorPlanId: string,
    deviceId: string
  ): Promise<void> {
    if (!floorPlanId || !deviceId) {
      throw new Error('Floor plan ID and device ID are required');
    }

    await floorPlansApi.removeDeviceMarker(floorPlanId, deviceId);
  },

  /**
   * Clone floor plan with new name
   */
  async cloneFloorPlan(
    id: string,
    newName: string
  ): Promise<FloorPlan> {
    if (!id || !newName) {
      throw new Error('Floor plan ID and new name are required');
    }

    const response = await floorPlansApi.clone(id, newName);
    return response.data.data;
  },

  /**
   * Upload floor plan image
   */
  async uploadFloorPlanImage(
    id: string,
    imageFile: File
  ): Promise<{ imageUrl: string }> {
    if (!id || !imageFile) {
      throw new Error('Floor plan ID and image file are required');
    }

    const response = await floorPlansApi.uploadImage(id, imageFile);
    return response.data.data;
  },

  /**
   * Get floor plans by building
   */
  async getFloorPlansByBuilding(building: string, params?: FloorPlanQuery) {
    const query: FloorPlanQuery = {
      ...params,
      building,
    };
    const response = await floorPlansApi.getAll(query);
    return response.data.data;
  },

  /**
   * Get floor plans by floor
   */
  async getFloorPlansByFloor(floor: string, params?: FloorPlanQuery) {
    const query: FloorPlanQuery = {
      ...params,
      floor,
    };
    const response = await floorPlansApi.getAll(query);
    return response.data.data;
  },
};

