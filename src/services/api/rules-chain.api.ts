import apiClient from '@/lib/axios.ts';

export interface RuleChain {
  id: string;
  name: string;
  description?: string;
  root?: boolean;
  firstRuleNodeId?: string;
  metadata?: {
    firstNodeIndex?: number;
    nodes?: Array<{
      id: string;
      type: string;
      name: string;
      debugMode?: boolean;
      configuration?: Record<string, any>;
    }>;
    connections?: Array<{
      fromIndex: number;
      toIndex: number;
      type: string;
    }>;
    ruleChainConnections?: Array<{
      fromIndex: number;
      targetRuleChainId: string;
      type: string;
      additionalInfo?: Record<string, any>;
    }>;
  };
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RuleChainQuery {
  search?: string;
  root?: boolean;
  tenantId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export const rulesChainApi = {
  // Get all rule chains
  getAll: (params?: RuleChainQuery) =>
    apiClient.get<PaginatedResponse<RuleChain>>('/rules-chain', { params }),

  // Get rule chain by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<RuleChain>>(`/rules-chain/${id}`),

  // Create rule chain
  create: (data: Partial<RuleChain>) =>
    apiClient.post<ApiResponse<RuleChain>>('/rules-chain', data),

  // Update rule chain
  update: (id: string, data: Partial<RuleChain>) =>
    apiClient.patch<ApiResponse<RuleChain>>(`/rules-chain/${id}`, data),

  // Delete rule chain
  delete: (id: string) =>
    apiClient.delete(`/rules-chain/${id}`),

  // Get root rule chains
  getRoots: () =>
    apiClient.get<ApiResponse<RuleChain[]>>('/rules-chain/roots'),

  // Set root rule chain
  setRoot: (id: string) =>
    apiClient.post<ApiResponse<RuleChain>>(`/rules-chain/${id}/root`),

  // Get rule chain metadata
  getMetadata: (id: string) =>
    apiClient.get<ApiResponse<RuleChain['metadata']>>(`/rules-chain/${id}/metadata`),

  // Save rule chain metadata
  saveMetadata: (id: string, metadata: RuleChain['metadata']) =>
    apiClient.post<ApiResponse<RuleChain>>(`/rules-chain/${id}/metadata`, { metadata }),

  // Activate rule chain
  activate: (id: string) =>
    apiClient.post<ApiResponse<RuleChain>>(`/rules-chain/${id}/activate`),

  // Deactivate rule chain
  deactivate: (id: string) =>
    apiClient.post<ApiResponse<RuleChain>>(`/rules-chain/${id}/deactivate`),
};

