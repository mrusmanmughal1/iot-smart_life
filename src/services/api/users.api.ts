import apiClient from '@/lib/axios.ts';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  CUSTOMER_USER = 'CUSTOMER_USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  tenantId?: string;
  customerId?: string;
  phone?: string;
  avatar?: string;
  permissions?: string[];
  twoFactorEnabled?: boolean;
  lastLogin?: string;
  additionalInfo?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UserQuery {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  tenantId?: string;
  customerId?: string;
  page?: number;
  limit?: number;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  actions: string[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  default?: boolean;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
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

export const usersApi = {
  // Get all users
  getAll: (params?: UserQuery) =>
    apiClient.get<PaginatedResponse<User>>('/users', { params }),

  // Get user by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  // Create user
  create: (data: Partial<User> & { password: string }) =>
    apiClient.post<ApiResponse<User>>('/users', data),

  // Update user
  update: (id: string, data: Partial<User>) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data),

  // Delete user
  delete: (id: string) =>
    apiClient.delete(`/users/${id}`),

  // Get current user
  getCurrentUser: () =>
    apiClient.get<ApiResponse<User>>('/users/me'),

  // Update current user profile
  updateProfile: (data: Partial<User>) =>
    apiClient.patch<ApiResponse<User>>('/users/me', data),

  // Change password
  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post<ApiResponse<any>>('/users/me/password', {
      oldPassword,
      newPassword,
    }),

  // Reset password
  resetPassword: (userId: string) =>
    apiClient.post<ApiResponse<any>>(`/users/${userId}/reset-password`),

  // Activate user
  activate: (id: string) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}/activate`),

  // Deactivate user
  deactivate: (id: string) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}/deactivate`),

  // Suspend user
  suspend: (id: string) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}/suspend`),

  // Get user permissions
  getPermissions: (id: string) =>
    apiClient.get<ApiResponse<string[]>>(`/users/${id}/permissions`),

  // Update user permissions
  updatePermissions: (id: string, permissions: string[]) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}/permissions`, { permissions }),

  // Get user statistics
  getStatistics: () =>
    apiClient.get<ApiResponse<any>>('/users/statistics'),

  // Enable 2FA
  enable2FA: (id: string) =>
    apiClient.post<ApiResponse<any>>(`/users/${id}/2fa/enable`),

  // Disable 2FA
  disable2FA: (id: string) =>
    apiClient.post<ApiResponse<any>>(`/users/${id}/2fa/disable`),

  // Bulk delete users
  bulkDelete: (userIds: string[]) =>
    apiClient.post<ApiResponse<any>>('/users/bulk/delete', { userIds }),

  // Bulk update users
  bulkUpdate: (userIds: string[], data: Partial<User>) =>
    apiClient.patch<ApiResponse<any>>('/users/bulk/update', { userIds, data }),
};

// Permissions API
export const permissionsApi = {
  // Get all permissions
  getAll: () =>
    apiClient.get<ApiResponse<Permission[]>>('/permissions'),

  // Get permission by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<Permission>>(`/permissions/${id}`),

  // Get permissions by resource
  getByResource: (resource: string) =>
    apiClient.get<ApiResponse<Permission[]>>(`/permissions/resource/${resource}`),
};

// Roles API
export const rolesApi = {
  // Get all roles
  getAll: () =>
    apiClient.get<ApiResponse<Role[]>>('/roles'),

  // Get role by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<Role>>(`/roles/${id}`),

  // Create role
  create: (data: Partial<Role>) =>
    apiClient.post<ApiResponse<Role>>('/roles', data),

  // Update role
  update: (id: string, data: Partial<Role>) =>
    apiClient.patch<ApiResponse<Role>>(`/roles/${id}`, data),

  // Delete role
  delete: (id: string) =>
    apiClient.delete(`/roles/${id}`),

  // Assign role to user
  assignToUser: (roleId: string, userId: string) =>
    apiClient.post<ApiResponse<any>>(`/roles/${roleId}/users/${userId}`),

  // Remove role from user
  removeFromUser: (roleId: string, userId: string) =>
    apiClient.delete(`/roles/${roleId}/users/${userId}`),

  // Get users with role
  getUsers: (roleId: string) =>
    apiClient.get<ApiResponse<User[]>>(`/roles/${roleId}/users`),
};