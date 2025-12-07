import apiClient from '@/lib/axios';

export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

export enum BillingPeriod {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export interface PlanFeatures {
  maxDevices: number;
  maxUsers: number;
  maxDashboards: number;
  maxRules: number;
  dataRetentionDays: number;
  apiCallsPerMonth: number;
  support: string;
  customBranding: boolean;
  advancedAnalytics: boolean;
  whiteLabel: boolean;
}

export interface Plan {
  id: string;
  name: SubscriptionPlan;
  title: string;
  description: string;
  price: number;
  billingPeriod: BillingPeriod;
  features: PlanFeatures;
  isPopular: boolean;
  trialDays?: number;
}

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingPeriod: BillingPeriod;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  userId: string;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Usage {
  devices: number;
  users: number;
  dashboards: number;
  rules: number;
  apiCalls: number;
  storage: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export const subscriptionsApi = {
  // Get all plans
  getPlans: () => apiClient.get<ApiResponse<Plan[]>>('/subscriptions/plans'),

  // Get plan by name
  getPlan: (plan: SubscriptionPlan) =>
    apiClient.get<ApiResponse<Plan>>(`/subscriptions/plans/${plan}`),

  // Get current subscription
  getCurrent: () =>
    apiClient.get<ApiResponse<Subscription>>('/subscriptions'),

  // Create subscription
  create: (plan: SubscriptionPlan, billingPeriod: BillingPeriod) =>
    apiClient.post<ApiResponse<Subscription>>('/payments/create', {
      plan,
      billingPeriod,
    }),

  // Update subscription
  update: (id: string, data: Partial<Subscription>) =>
    apiClient.patch<ApiResponse<Subscription>>(`/subscriptions/${id}`, data),

  // Upgrade subscription
  upgrade: (plan: SubscriptionPlan, billingPeriod?: BillingPeriod) =>
    apiClient.post<ApiResponse<Subscription>>('/subscriptions/upgrade', {
      plan,
      billingPeriod,
    }),

  // Downgrade subscription
  downgrade: (plan: SubscriptionPlan, billingPeriod?: BillingPeriod) =>
    apiClient.post<ApiResponse<Subscription>>('/subscriptions/downgrade', {
      plan,
      billingPeriod,
    }),

  // Cancel subscription
  cancel: () =>
    apiClient.post<ApiResponse<any>>('/subscriptions/cancel'),

  // Renew subscription
  renew: () =>
    apiClient.post<ApiResponse<Subscription>>('/subscriptions/renew'),

  // Get usage
  getUsage: () => apiClient.get<ApiResponse<Usage>>('/subscriptions/usage'),

  // Get billing history
  getBillingHistory: () =>
    apiClient.get<ApiResponse<any[]>>('/subscriptions/billing-history'),

  // Get invoice
  getInvoice: (invoiceId: string) =>
    apiClient.get<ApiResponse<any>>(`/subscriptions/invoices/${invoiceId}`),

  // Toggle auto-renew
  toggleAutoRenew: () =>
    apiClient.post<ApiResponse<Subscription>>(
      '/subscriptions/toggle-auto-renew'
    ),

  // Start trial
  startTrial: (plan: SubscriptionPlan) =>
    apiClient.post<ApiResponse<Subscription>>('/subscriptions/trial', {
      plan,
    }),

  // Compare plans
  comparePlans: (plans: SubscriptionPlan[]) =>
    apiClient.post<ApiResponse<any>>('/subscriptions/compare', { plans }),
};