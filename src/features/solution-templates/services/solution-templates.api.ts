import apiClient from '@/lib/axios';

export enum TemplateCategory {
  SMART_HOME = 'smart_home',
  AGRICULTURE = 'agriculture',
  SMART_CITY = 'smart_city',
  HEALTHCARE = 'healthcare',
  ENERGY = 'energy',
  TRANSPORTATION = 'transportation',
  RETAIL = 'retail',
  SMART_FACTORY = 'smart_factory',
  SMART_BUILDING = 'smart_building',
  LOGISTICS = 'logistics',
  WATER = 'water',
  CLIMATE = 'climate',
  EDUCATION = 'education',
}

export interface TemplateConfiguration {
  devices?: any[];
  dashboards?: any[];
  rules?: any[];
  assets?: any[];
}

export interface SolutionTemplate {
  id: string;
  name: string;
  title: string;
  description?: string;
  category: TemplateCategory;
  tags?: string[];
  configuration: TemplateConfiguration;
  thumbnail?: string;
  isPublic: boolean;
  installCount: number;
  rating?: number;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateQuery {
  search?: string;
  category?: TemplateCategory;
  tags?: string[];
  isPublic?: boolean;
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

export const solutionTemplatesApi = {
  // Get all templates
  getAll: (params?: TemplateQuery) =>
    apiClient.get<PaginatedResponse<SolutionTemplate>>('/solution-templates', {
      params,
    }),

  // Get template by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<SolutionTemplate>>(`/solution-templates/${id}`),

  // Create template
  create: (data: Partial<SolutionTemplate>) =>
    apiClient.post<ApiResponse<SolutionTemplate>>('/solution-templates', data),

  // Update template
  update: (id: string, data: Partial<SolutionTemplate>) =>
    apiClient.patch<ApiResponse<SolutionTemplate>>(
      `/solution-templates/${id}`,
      data
    ),

  // Delete template
  delete: (id: string) => apiClient.delete(`/solution-templates/${id}`),

  // Install template
  install: (id: string, installationName?: string) =>
    apiClient.post<ApiResponse<any>>(`/solution-templates/${id}/install`, {
      installationName,
    }),

  // Get installation history
  getInstallations: (id: string) =>
    apiClient.get<ApiResponse<any[]>>(`/solution-templates/${id}/installations`),

  // Get categories
  getCategories: () =>
    apiClient.get<ApiResponse<TemplateCategory[]>>(
      '/solution-templates/categories'
    ),

  // Get popular templates
  getPopular: (limit?: number) =>
    apiClient.get<ApiResponse<SolutionTemplate[]>>(
      '/solution-templates/popular',
      { params: { limit } }
    ),

  // Get template statistics
  getStatistics: () =>
    apiClient.get<ApiResponse<any>>('/solution-templates/statistics'),

  // Rate template
  rate: (id: string, rating: number) =>
    apiClient.post<ApiResponse<any>>(`/solution-templates/${id}/rate`, {
      rating,
    }),

  // Get by category
  getByCategory: (category: TemplateCategory) =>
    apiClient.get<ApiResponse<SolutionTemplate[]>>(
      `/solution-templates/category/${category}`
    ),
};