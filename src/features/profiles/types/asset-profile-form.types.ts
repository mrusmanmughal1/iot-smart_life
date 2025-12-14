export interface AssetProfileFormData {
  name: string;
  description?: string;
  defaultRuleChain?: string;
  mobileDashboard?: string;
  queue?: string;
  defaultEdgeRuleChain?: string;
  assetProfileImage?: File | string;
}

export const DEFAULT_ASSET_PROFILE_FORM_DATA: AssetProfileFormData = {
  name: '',
  description: '',
  defaultRuleChain: '',
  mobileDashboard: '',
  queue: '',
  defaultEdgeRuleChain: '',
  assetProfileImage: undefined,
};
