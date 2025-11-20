import type { DeviceProfile, AssetProfile } from '@/services/api/profiles.api';

export interface ProfileFilters {
  search?: string;
  type?: string;
}

export type ProfileType = 'device' | 'asset';