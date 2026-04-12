import React, { lazy } from 'react';
import { FeatureRoute } from '@/routes/FeatureRoute.tsx';
import { Loadable } from '@/components/common/Loadable';
import CustomerDetailsPage from '@/pages/CustomerDetailsPage';
// Import management page components lazily
const SubscriptionPlans = Loadable(
  lazy(() => import('@/pages/SubscriptionPlans'))
);
const Subscriptioninvoices = Loadable(
  lazy(() => import('@/pages/Subscriptioninvoices'))
);
const UsersAndRolesManagementPage = Loadable(
  lazy(() => import('@/pages/UsersAndRolesManagementPage.tsx'))
);
const CustomerUserAssociationPage = Loadable(
  lazy(() => import('@/pages/CustomerUserAssociationPage.tsx'))
);
const CreateRolePage = Loadable(
  lazy(() => import('@/pages/CreateRolePage.tsx'))
);

const CustomerAdministratorPage = Loadable(
  lazy(() => import('@/pages/CustomerDetailsPage'))
);
const RolePermissionManagementPage = Loadable(
  lazy(() => import('@/pages/RolePermissionManagementPage.tsx'))
);
const AssignPermissionsPage = Loadable(
  lazy(() => import('@/pages/AssignPermissionsPage.tsx'))
);
const SearchResultsPage = Loadable(
  lazy(() => import('@/pages/SearchResultsPage.tsx'))
);
const CreateCustomerPage = Loadable(
  lazy(() => import('@/pages/CreateCustomerPage.tsx'))
);

const CreateUserPage = Loadable(
  lazy(() => import('@/pages/CreateUserPage.tsx'))
);
const ProfileSettingsPage = Loadable(
  lazy(() => import('@/pages/ProfileSettingsPage.tsx'))
);
const CompanyProfilePage = Loadable(
  lazy(() => import('@/pages/CompanyProfilePage.tsx'))
);
const BulkUserManagementPage = Loadable(
  lazy(() => import('@/pages/BulkUserManagementPage.tsx'))
);
const CustomerUserDetailsPage = Loadable(
  lazy(() => import('@/pages/CustomerUserDetailsPage.tsx'))
);

const CustomerPage = Loadable(
  lazy(() =>
    import('@/features/users/components/Customer.tsx').then((module) => ({
      default: module.default,
    }))
  )
);
const AuditPage = Loadable(lazy(() => import('@/pages/AuditPage.tsx')));
const APIMonitoring = Loadable(
  lazy(() => import('@/pages/APIMonitoringPage.tsx'))
);

export const managementRoutes = [
  //  -------------------Users Management Routes-------------------
  {
    path: '/users-management',
    element: <FeatureRoute feature="userRoles" />,
    children: [
      {
        index: true,
        element: <UsersAndRolesManagementPage />,
      },
      {
        path: 'assign-users/:id',
        element: <CustomerUserAssociationPage />,
      },
      {
        path: 'create-role',
        element: <CreateRolePage />,
      },
      {
        path: 'edit-role/:id',
        element: <CreateRolePage />,
      },
      {
        path: 'customer/:id',
        element: <CustomerDetailsPage />,
      },
      {
        path: 'role-permission-management/:id',
        element: <RolePermissionManagementPage />,
      },
      {
        path: 'customer-user-permissions/:id',
        element: <AssignPermissionsPage />,
      },
      {
        path: 'customer-user/:id',
        element: <CustomerUserDetailsPage />,
      },
      {
        path: 'search-results',
        element: <SearchResultsPage />,
      },
      {
        path: 'create-customer',
        element: <CreateCustomerPage />,
      },
      {
        path: 'edit-customer/:id',
        element: <CreateCustomerPage />,
      },
      {
        path: 'add-new-user',
        element: <CreateUserPage />,
      },
      {
        path: 'edit-user/:id',
        element: <CreateUserPage />,
      },

      {
        path: 'profile-settings',
        element: <ProfileSettingsPage />,
      },
      {
        path: 'company-profile',
        element: <CompanyProfilePage />,
      },
      {
        path: 'bulk-management',
        element: <BulkUserManagementPage />,
      },

      {
        path: 'customers',
        element: <CustomerPage searchQuery="" />,
      },
    ],
  },
  // --------------------Customer Management Routes--------------------
  {
    path: '/customer-management',
    element: <FeatureRoute feature="createCustomer" />,
    children: [
      {
        index: true,
        element: <CreateCustomerPage />,
      },
    ],
  },

  // -------- audit routes --------
  {
    path: '/audit',
    element: <FeatureRoute feature="auditLogs" />,
    children: [
      {
        index: true,
        element: <AuditPage />,
      },
    ],
  },
  {
    path: '/api-monitoring',
    element: <FeatureRoute feature="apiAccess" />,
    children: [
      {
        index: true,
        element: <APIMonitoring />,
      },
    ],
  },

  // -------- subscription routes --------
  {
    path: '/subscription',
    element: <FeatureRoute feature="subscription" />,
    children: [
      {
        index: true,
        element: <SubscriptionPlans />,
      },
      {
        path: 'invoices',
        element: <Subscriptioninvoices />,
      },
    ],
  },
];
