// Export all API services
export * from './devices.api.ts';
export * from './assets.api.ts';
export * from './profiles.api.ts';
export * from './widgets.api.ts';
export * from './dashboards.api.ts';
export * from './alarms.api.ts';
export * from './notifications.api.ts';
export * from './analytics.api.ts';
export * from './audit.api.ts';
export * from './users.api.ts';
export * from './alarms.api';
export * from './analytics.api';
export * from './api-monitoring.api';
export * from './assets.api';
export * from './attributes.api';
export * from './audit.api';
export * from './automation.api';
export * from './dashboards.api';
export * from './devices.api';
export * from './floor-plans.api';
export * from './images.api';
export * from './integrations.api';
export * from './nodes.api';
export * from './notifications.api';
export * from './profiles.api';
export * from './schedules.api';
export * from './scripts.api';
export * from './sharing.api';
export * from '../../features/solution-templates/services/solution-templates.api.ts';
export * from './subscriptions.api';
export * from './tenants.api';
export * from './users.api';
export * from './widgets.api';
export * from './queues.api';
export * from './rules-chain.api';
export * from './default-rule-chains.api';

import { alarmsApi } from './alarms.api';
import { analyticsApi } from './analytics.api';
import { apiMonitoringApi } from './api-monitoring.api';
import { assetsApi } from './assets.api';
import { attributesApi } from './attributes.api';
import { auditApi } from './audit.api';
import { automationApi } from './automation.api';
import { dashboardsApi } from './dashboards.api';
import { devicesApi } from './devices.api';
import { floorPlansApi } from './floor-plans.api';
import { imagesApi } from './images.api';
import { integrationsApi } from './integrations.api';
import { nodesApi } from './nodes.api';
import { notificationsApi } from './notifications.api';
import { profilesApi } from './profiles.api';
import { schedulesApi } from './schedules.api';
import { scriptsApi } from './scripts.api';
import { sharingApi } from './sharing.api';
import { solutionTemplatesApi } from '../../features/solution-templates/services/solution-templates.api.ts';
import { subscriptionsApi } from './subscriptions.api';
import { tenantsApi } from './tenants.api';
import { usersApi } from './users.api';
import { widgetsApi } from './widgets.api';
import { queuesApi } from './queues.api';
import { rulesChainApi } from './rules-chain.api';
import { defaultRuleChainsApi } from './default-rule-chains.api';

export const api = {
  alarms: alarmsApi,
  analytics: analyticsApi,
  apiMonitoring: apiMonitoringApi,
  assets: assetsApi,
  attributes: attributesApi,
  audit: auditApi,
  automation: automationApi,
  dashboards: dashboardsApi,
  devices: devicesApi,
  floorPlans: floorPlansApi,
  images: imagesApi,
  integrations: integrationsApi,
  nodes: nodesApi,
  notifications: notificationsApi,
  profiles: profilesApi,
  queues: queuesApi,
  rulesChain: rulesChainApi,
  defaultRuleChains: defaultRuleChainsApi,
  schedules: schedulesApi,
  scripts: scriptsApi,
  sharing: sharingApi,
  solutionTemplates: solutionTemplatesApi,
  subscriptions: subscriptionsApi,
  tenants: tenantsApi,
  users: usersApi,
  widgets: widgetsApi,
};

export default api;

// Re-export commonly used types
export type {
  PaginatedResponse,
  ApiResponse,
} from './devices.api.ts';