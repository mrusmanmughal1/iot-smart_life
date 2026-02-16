import { UserRole } from "@/services/api/users.api";

export enum CustomerStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SUSPENDED = 'Suspended',
  PENDING = 'Pending',
}

export enum CustomerPlan {
  BASIC = 'Basic',
  STANDARD = 'Standard',
  PREMIUM = 'Premium',
  ENTERPRISE = 'Enterprise',
}

export interface Customer {
  zip: string;
  state: string;
  phone: string;
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  role?: UserRole;
  companyName?: string;
  city?: string;
  stateProvince?: string;
  zipPostalCode?: string;
  country: string;
  status: CustomerStatus;
  maxUsers: number;
  plan: CustomerPlan;
  features: string[];
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country: string;
  status: CustomerStatus;
  maxUsers: number;
  plan: CustomerPlan;
  features: string[];
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {
  id: string;
}

export interface CustomerQuery {
  search?: string;
  status?: CustomerStatus;
  plan?: CustomerPlan;
  tenantId?: string;
  page?: number;
  limit?: number;
}

