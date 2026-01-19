import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  FilterFormValues,
  AssetOption,
  Zone,
  Device,
  Room,
} from '@/features/floorPlan/types';

export type StepId = 1 | 2 | 3 | 4 | 5;

export interface UploadedFile {
  id: string;
  file: File;
  floor: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  previewUrl?: string;
}

interface FloorMapStore {
  // Step management
  currentStep: StepId;
  setCurrentStep: (step: StepId) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Asset selection
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
  filteredAssets: AssetOption[];
  setFilteredAssets: (assets: AssetOption[]) => void;

  // Form values
  formValues: FilterFormValues;
  setFormValues: (values: Partial<FilterFormValues>) => void;
  resetFormValues: () => void;

  // DWG Import step
  uploadedFiles: UploadedFile[];
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileId: string) => void;
  updateUploadedFile: (fileId: string, updates: Partial<UploadedFile>) => void;
  clearUploadedFiles: () => void;
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;

  // Zone Setup step
  zones: Zone[];
  setZones: (zones: Zone[]) => void;
  addZone: (zone: Zone) => void;
  updateZone: (zoneId: string, updates: Partial<Zone>) => void;
  removeZone: (zoneId: string) => void;
  selectedZoneId: string | null;
  setSelectedZoneId: (zoneId: string | null) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;

  // Device Link step
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  removeRoom: (roomId: string) => void;
  assignedDevices: Record<string, Device[]>; // roomId -> devices
  assignDeviceToRoom: (device: Device, roomId: string) => void;
  unassignDeviceFromRoom: (deviceId: string, roomId: string) => void;
  devicePositions: Record<string, { x: number; y: number; zoneId: string | null; floor: string }>;
  setDevicePosition: (deviceId: string, position: { x: number; y: number; zoneId: string | null; floor: string }) => void;
  removeDevicePosition: (deviceId: string) => void;
  clearDevicePositions: () => void;

  // Reset all data
  reset: () => void;
}

const defaultFormValues: FilterFormValues = {
  search: '',
  type: 'all',
  status: 'all',
  drawingScale: '1:100',
  drawingUnit: 'meters',
  zoneName: undefined,
  zoneType: undefined,
  zoneDescription: undefined,
  floorName: undefined,
};

const defaultState = {
  currentStep: 1 as StepId,
  selectedAssetId: null as string | null,
  filteredAssets: [] as AssetOption[],
  formValues: defaultFormValues,
  uploadedFiles: [] as UploadedFile[],
  selectedFloor: 'Ground',
  zones: [] as Zone[],
  selectedZoneId: null as string | null,
  zoomLevel: 100,
  rooms: [] as Room[],
  assignedDevices: {} as Record<string, Device[]>,
  devicePositions: {} as Record<string, { x: number; y: number; zoneId: string | null; floor: string }>,
};

export const useFloorMapStore = create<FloorMapStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      // Step management
      setCurrentStep: (step: StepId) => {
        set({ currentStep: step });
      },

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 5) {
          set({ currentStep: (currentStep + 1) as StepId });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: (currentStep - 1) as StepId });
        }
      },

      // Asset selection
      setSelectedAssetId: (id: string | null) => {
        set({ selectedAssetId: id });
      },

      setFilteredAssets: (assets: AssetOption[]) => {
        set({ filteredAssets: assets });
      },

      // Form values
      setFormValues: (values: Partial<FilterFormValues>) => {
        set((state) => ({
          formValues: { ...state.formValues, ...values },
        }));
      },

      resetFormValues: () => {
        set({ formValues: defaultFormValues });
      },

      // DWG Import step
      addUploadedFile: (file: UploadedFile) => {
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, file],
        }));
      },

      removeUploadedFile: (fileId: string) => {
        set((state) => {
          const fileToRemove = state.uploadedFiles.find((f) => f.id === fileId);
          if (fileToRemove?.previewUrl) {
            URL.revokeObjectURL(fileToRemove.previewUrl);
          }
          return {
            uploadedFiles: state.uploadedFiles.filter((f) => f.id !== fileId),
          };
        });
      },

      updateUploadedFile: (fileId: string, updates: Partial<UploadedFile>) => {
        set((state) => ({
          uploadedFiles: state.uploadedFiles.map((file) =>
            file.id === fileId ? { ...file, ...updates } : file
          ),
        }));
      },

      clearUploadedFiles: () => {
        set((state) => {
          // Clean up preview URLs
          state.uploadedFiles.forEach((file) => {
            if (file.previewUrl) {
              URL.revokeObjectURL(file.previewUrl);
            }
          });
          return { uploadedFiles: [] };
        });
      },

      setSelectedFloor: (floor: string) => {
        set({ selectedFloor: floor });
      },

      // Zone Setup step
      setZones: (zones: Zone[]) => {
        set({ zones });
      },

      addZone: (zone: Zone) => {
        set((state) => ({
          zones: [...state.zones, zone],
          selectedZoneId: zone.id,
        }));
      },

      updateZone: (zoneId: string, updates: Partial<Zone>) => {
        set((state) => ({
          zones: state.zones.map((zone) =>
            zone.id === zoneId ? { ...zone, ...updates } : zone
          ),
        }));
      },

      removeZone: (zoneId: string) => {
        set((state) => ({
          zones: state.zones.filter((zone) => zone.id !== zoneId),
          selectedZoneId:
            state.selectedZoneId === zoneId ? null : state.selectedZoneId,
        }));
      },

      setSelectedZoneId: (zoneId: string | null) => {
        set({ selectedZoneId: zoneId });
      },

      setZoomLevel: (level: number) => {
        set({ zoomLevel: Math.max(50, Math.min(200, level)) });
      },

      // Device Link step
      setRooms: (rooms: Room[]) => {
        set({ rooms });
      },

      addRoom: (room: Room) => {
        set((state) => ({
          rooms: [...state.rooms, room],
        }));
      },

      updateRoom: (roomId: string, updates: Partial<Room>) => {
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === roomId ? { ...room, ...updates } : room
          ),
        }));
      },

      removeRoom: (roomId: string) => {
        set((state) => {
          const newAssignedDevices = { ...state.assignedDevices };
          delete newAssignedDevices[roomId];
          return {
            rooms: state.rooms.filter((room) => room.id !== roomId),
            assignedDevices: newAssignedDevices,
          };
        });
      },

      assignDeviceToRoom: (device: Device, roomId: string) => {
        set((state) => {
          const newAssignedDevices = { ...state.assignedDevices };
          const roomDevices = newAssignedDevices[roomId] || [];

          // Check if device is already assigned to this room
          if (!roomDevices.some((d) => d.id === device.id)) {
            // Remove device from other rooms first
            Object.keys(newAssignedDevices).forEach((id) => {
              if (id !== roomId) {
                newAssignedDevices[id] = newAssignedDevices[id].filter(
                  (d) => d.id !== device.id
                );
              }
            });

            // Add the full device object to the room
            newAssignedDevices[roomId] = [
              ...roomDevices,
              device,
            ];
          }

          return { assignedDevices: newAssignedDevices };
        });
      },

      unassignDeviceFromRoom: (deviceId: string, roomId: string) => {
        set((state) => {
          const newAssignedDevices = { ...state.assignedDevices };
          const roomDevices = newAssignedDevices[roomId] || [];
          newAssignedDevices[roomId] = roomDevices.filter(
            (d) => d.id !== deviceId
          );
          return { assignedDevices: newAssignedDevices };
        });
      },

      // Device Positions management
      setDevicePosition: (deviceId: string, position: { x: number; y: number; zoneId: string | null; floor: string }) => {
        set((state) => ({
          devicePositions: {
            ...state.devicePositions,
            [deviceId]: position,
          },
        }));
      },

      removeDevicePosition: (deviceId: string) => {
        set((state) => {
          const newPositions = { ...state.devicePositions };
          delete newPositions[deviceId];
          return { devicePositions: newPositions };
        });
      },

      clearDevicePositions: () => {
        set({ devicePositions: {} });
      },

      // Reset all data
      reset: () => {
        const state = get();
        // Clean up preview URLs
        state.uploadedFiles.forEach((file) => {
          if (file.previewUrl) {
            URL.revokeObjectURL(file.previewUrl);
          }
        });
        set({ ...defaultState });
      },
    }),
    {
      name: 'floor-map-storage',
      // Only persist certain fields, exclude File objects and Maps
      partialize: (state) => ({
        currentStep: state.currentStep,
        selectedAssetId: state.selectedAssetId,
        formValues: state.formValues,
        selectedFloor: state.selectedFloor,
        zones: state.zones,
        selectedZoneId: state.selectedZoneId,
        zoomLevel: state.zoomLevel,
        rooms: state.rooms,
        // Note: uploadedFiles and filteredAssets are not persisted
        // as they contain File objects which can't be serialized
        assignedDevices: state.assignedDevices,
        devicePositions: state.devicePositions,
      }),
    }
  )
);
