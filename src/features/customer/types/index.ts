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
  id: string;
  customerName: string;
  contactEmail: string;
  phoneNumber: string;
  address?: string;
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
  contactEmail: string;
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

