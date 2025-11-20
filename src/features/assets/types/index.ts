import type { Asset } from '@/services/api/assets.api';

export interface AssetFormData {
  name: string;
  type: string;
  label?: string;
  assetProfileId?: string;
  parentId?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  description?: string;
}

export interface AssetFilters {
  search?: string;
  type?: string;
  assetProfileId?: string;
  parentId?: string;
}

export interface AssetTreeNode extends Asset {
  children: AssetTreeNode[];
}

export interface AssetBreadcrumb {
  id: string;
  name: string;
  type: string;
}

export interface AssetStats {
  totalAssets: number;
  directChildren: number;
  assignedDevices: number;
  depth: number;
}

export type AssetAction = 
  | 'view'
  | 'edit'
  | 'delete'
  | 'move'
  | 'assign-devices'
  | 'clone';