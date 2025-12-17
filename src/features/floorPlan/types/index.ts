export interface FilterFormValues {
  search: string;
  type: string;
  status: string;
  drawingScale: string;
  drawingUnit: string;
}

export interface AssetOption {
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


