import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PageHeader } from '@/components/common/PageHeader';
import { Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Permission {
  id: string;
  label: string;
  granted: boolean;
  category: string;
}

const permissions: Permission[] = [
  // Dashboard Management
  {
    id: 'view-dashboards',
    label: 'View Dashboards',
    granted: true,
    category: 'Dashboard Management',
  },
  {
    id: 'create-dashboards',
    label: 'Create Dashboards',
    granted: true,
    category: 'Dashboard Management',
  },
  {
    id: 'edit-dashboards',
    label: 'Edit Dashboards',
    granted: true,
    category: 'Dashboard Management',
  },
  {
    id: 'delete-dashboards',
    label: 'Delete Dashboards',
    granted: true,
    category: 'Dashboard Management',
  },

  // Device Management
  {
    id: 'view-devices',
    label: 'View Devices',
    granted: true,
    category: 'Device Management',
  },
  {
    id: 'manage-devices',
    label: 'Manage Devices',
    granted: true,
    category: 'Device Management',
  },
  {
    id: 'configure-devices',
    label: 'Configure Devices',
    granted: true,
    category: 'Device Management',
  },
  {
    id: 'delete-devices',
    label: 'Delete Devices',
    granted: false,
    category: 'Device Management',
  },

  // User Management
  {
    id: 'view-users',
    label: 'View Users',
    granted: true,
    category: 'User Management',
  },
  {
    id: 'create-users',
    label: 'Create Users',
    granted: true,
    category: 'User Management',
  },
  {
    id: 'edit-users',
    label: 'Edit Users',
    granted: true,
    category: 'User Management',
  },
  {
    id: 'assign-roles',
    label: 'Assign Roles',
    granted: true,
    category: 'User Management',
  },

  // Data Access
  {
    id: 'view-telemetry',
    label: 'View Telemetry',
    granted: true,
    category: 'Data Access',
  },
  {
    id: 'view-attributes',
    label: 'View Attributes',
    granted: true,
    category: 'Data Access',
  },
  {
    id: 'export-data',
    label: 'Export Data',
    granted: false,
    category: 'Data Access',
  },
  {
    id: 'delete-telemetry',
    label: 'Delete Telemetry',
    granted: false,
    category: 'Data Access',
  },

  // Report Generation
  {
    id: 'create-reports',
    label: 'Create Reports',
    granted: true,
    category: 'Report Generation',
  },
  {
    id: 'schedule-reports',
    label: 'Schedule Reports',
    granted: true,
    category: 'Report Generation',
  },
  {
    id: 'export-reports',
    label: 'Export Reports',
    granted: false,
    category: 'Report Generation',
  },
  {
    id: 'share-reports',
    label: 'Share Reports',
    granted: true,
    category: 'Report Generation',
  },

  // System Access
  {
    id: 'system-admin',
    label: 'System Admin',
    granted: false,
    category: 'System Access',
  },
  {
    id: 'view-audit-logs',
    label: 'View Audit Logs',
    granted: true,
    category: 'System Access',
  },
  {
    id: 'manage-settings',
    label: 'Manage Settings',
    granted: false,
    category: 'System Access',
  },
  {
    id: 'system-backup',
    label: 'System Backup',
    granted: false,
    category: 'System Access',
  },
];

const PermissionCheckbox: React.FC<{ granted: boolean }> = ({ granted }) => {
  return (
    <div
      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
        granted
          ? 'bg-green-500 border-green-500'
          : 'bg-gray-200 border-gray-300'
      }`}
    >
      {granted && (
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
};

export default function CustomerAdministratorPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('permissions');

  const handleEditRole = () => {
    navigate('/users/edit-role/customer-administrator');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      toast.success('Role deleted successfully');
      navigate('/users');
    }
  };

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Summary permissions (top right)
  const summaryPermissions = [
    {
      category: 'Dashboard Management',
      permissions: [
        'View Dashboards',
        'Create Dashboards',
        'Delete Dashboards',
      ],
    },
    {
      category: 'Device Management',
      permissions: ['View Devices', 'Manage Devices', 'Delete Devices'],
    },
    {
      category: 'User Management',
      permissions: ['View Users', 'Create Users', 'Edit Users'],
    },
    {
      category: 'Data Access',
      permissions: ['View Telemetry', 'Export Data', 'Delete Telemetr'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <PageHeader title="" />
      <div className="mx-auto space-y-6">
        {/* Header Section */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
                  Customer Administrator
                </h1>
                <p className="text-gray-600 dark:text-white">
                  Full access to customer resources and user management
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleEditRole}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Edit className="h-4 w-4  " />
                  Edit Role
                </Button>
                <Button onClick={handleDelete} variant="secondary">
                  <Trash2 className="h-4 w-4  " />
                  Delete
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 w-80 space-y-3 grid grid-cols-2 w-full gap-4 dark:bg-gray-900 dark:border-gray-700">
              {summaryPermissions.map((summary) => (
                <div key={summary.category}>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    {summary.category}:
                  </h3>
                  <div className="space-y-1">
                    {summary.permissions.map((permName) => {
                      const permission = permissions.find(
                        (p) => p.label === permName
                      );
                      return (
                        <div
                          key={permName}
                          className="flex items-center gap-2 text-sm dark:text-white"
                        >
                          <PermissionCheckbox
                            granted={permission?.granted || false}
                          />
                          <span className="text-gray-700 dark:text-white">
                            {permName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card className="bg-white shadow-sm p-4">
          <CardContent className="p-0">
            <Tabs
              defaultValue="permissions"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full justify-start rounded-none border-b border-slate-200 bg-transparent p-0">
                <TabsTrigger
                  value="permissions"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                >
                  Permissions
                </TabsTrigger>
                <TabsTrigger
                  value="assigned-users"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                >
                  Assigned Users (8)
                </TabsTrigger>
                <TabsTrigger
                  value="activity-log"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                >
                  Activity Log
                </TabsTrigger>
              </TabsList>

              {/* Permissions Tab */}
              <TabsContent value="permissions" className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Permission Matrix
                  </h2>

                  {/* Summary Section */}
                </div>

                {/* Permission Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(permissionsByCategory).map(
                    ([category, categoryPermissions]) => (
                      <Card
                        key={category}
                        className={`${
                          category === 'Report Generation'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white dark:bg-gray-900 dark:border-gray-700'
                        }`}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            {category}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {categoryPermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center gap-3"
                            >
                              <PermissionCheckbox
                                granted={permission.granted}
                              />
                              <span className="text-sm text-gray-900 flex-1 dark:text-white">
                                {permission.label}
                              </span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700 dark:text-white">
                      Granted Permission
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                    <span className="text-sm text-gray-700 dark:text-white">
                      Denied Permission
                    </span>
                  </div>
                </div>
              </TabsContent>

              {/* Assigned Users Tab */}
              <TabsContent value="assigned-users" className="p-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Assigned Users
                  </h2>
                  <p className="text-gray-600 dark:text-white">
                    List of users assigned to this role will appear here.
                  </p>
                </div>
              </TabsContent>

              {/* Activity Log Tab */}
              <TabsContent value="activity-log" className="p-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Activity Log
                  </h2>
                  <p className="text-gray-600 dark:text-white">
                    Activity log for this role will appear here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
