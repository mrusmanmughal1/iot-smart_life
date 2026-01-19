import apiClient from '@/lib/axios';

export interface FloorPlanDimensions {
  width: number;
  height: number;
  scale?: number; // pixels per meter
}

export interface DevicePosition {
  x: number;
  y: number;
}

export interface FloorPlanDevice {
  name: string;
  type: string;
  deviceId: string;
  position: DevicePosition;
}

export interface ZoneBoundary {
  x: number;
  y: number;
}

export interface FloorPlanZone {
  id: string;
  name: string;
  color: string;
  boundaries: ZoneBoundary[];
}

export interface GridSettings {
  gridSize: number;
  showGrid: boolean;
  snapToGrid: boolean;
}

export interface DefaultColors {
  zones: string;
  gateways: string;
  sensorsToGrid: string;
  sensorsToGateway: string;
}

export interface FloorPlanSettings {
  autoSave: boolean;
  gridSettings: GridSettings;
  defaultColors: DefaultColors;
  measurementUnit: string;
}

export interface DeviceMarker {
  deviceId: string;
  x: number;
  y: number;
  rotation?: number;
  icon?: string;
  // Legacy support - can also use the new structure
  name?: string;
  type?: string;
  position?: DevicePosition;
}

export interface FloorPlan {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  name: string;
  description?: string;
  building?: string;
  floor?: string;
  imageUrl?: string;
  category?: string;
  status?: 'active' | 'archived' | 'draft';
  dimensions: FloorPlanDimensions;
  scale?: string;
  devices: FloorPlanDevice[];
  zones: FloorPlanZone[];
  deviceMarkers?: DeviceMarker[]; // Legacy support
  metadata?: Record<string, unknown>;
  userId: string;
  tenantId?: string | null;
  settings?: FloorPlanSettings;
}

export interface FloorPlanQuery {
  search?: string;
  building?: string;
  floor?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  message: string;
  data: {
    data: T[];
    meta?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export const floorPlansApi = {
  // Get all floor plans
  getAll: (params?: FloorPlanQuery) =>
    apiClient.get<PaginatedResponse<FloorPlan>>('/floor-plans', { params }),

  // Get floor plan by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<FloorPlan>>(`/floor-plans/${id}`),

  // Create floor plan
  create: (data: any) =>
    apiClient.post<ApiResponse<FloorPlan>>('/floor-plans', data, {
      headers: { 'Content-Type': 'application/json' },
    }),

  // Update floor plan
  update: (id: string, data: Partial<FloorPlan>) =>
    apiClient.patch<ApiResponse<FloorPlan>>(`/floor-plans/${id}`, data),

  // Delete floor plan
  delete: (id: string) => apiClient.delete(`/floor-plans/${id}`),

  // Upload image
  uploadImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post<ApiResponse<{ imageUrl: string }>>(
      `/floor-plans/${id}/upload-image`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  // Add device marker
  addDeviceMarker: (id: string, marker: DeviceMarker) =>
    apiClient.post<ApiResponse<FloorPlan>>(
      `/floor-plans/${id}/markers`,
      marker
    ),

  // Update device marker
  updateDeviceMarker: (id: string, deviceId: string, marker: Partial<DeviceMarker>) =>
    apiClient.patch<ApiResponse<FloorPlan>>(
      `/floor-plans/${id}/markers/${deviceId}`,
      marker
    ),

  // Remove device marker
  removeDeviceMarker: (id: string, deviceId: string) =>
    apiClient.delete(`/floor-plans/${id}/markers/${deviceId}`),

  // Get devices on floor plan
  getDevices: (id: string) =>
    apiClient.get<ApiResponse<FloorPlanDevice[]>>(`/floor-plans/${id}/devices`),

  // Get statistics
  getStatistics: () =>
    apiClient.get<ApiResponse<Record<string, unknown>>>('/floor-plans/statistics'),

  // Clone floor plan
  clone: (id: string, newName: string) =>
    apiClient.post<ApiResponse<FloorPlan>>(`/floor-plans/${id}/clone`, {
      name: newName,
    }),
};