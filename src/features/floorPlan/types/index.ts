export interface FilterFormValues {
  search: string;
  type: string;
  status: string;
  drawingScale: string;
  drawingUnit: string;
  zoneName?: string;
  zoneType?: string;
  zoneDescription?: string;
}

export interface AssetOption {
  active: string;
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  notes?: string[];
  isReady?: boolean;
  devicesAvailable?: number;
  hasExistingFloorMap?: boolean;
}

export interface Zone {
  id: string;
  name: string;
  type: string;
  area: number;
  capacity: number;
  status: string;
  floor: string;
  description: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isDefined: boolean;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'idle' | 'error';
  assignedTo?: string; // Room/Zone ID
}

export interface Room {
  id: string;
  name: string;
  devices: Device[];
}
 