import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUser } from '@/features/users/hooks';
import { UserDetailsCard } from '@/features/users/components/UserDetailsCard';
import { UserActivityLog } from '@/features/users/components/UserActivityLog';
import { usePermissions } from '@/features/permissions/hooks';
import DevicesListCustomers from '@/features/users/components/DevicesListCustomers';

interface Permission {
  id: string;
  label: string;
  granted: boolean;
  category: string;
}

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

export default function CustomerUserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: userResponse } = useUser(id || '');
  const user = userResponse?.data?.data.data;

  const { data: permissionsData } = usePermissions();
  const [activeTab, setActiveTab] = useState('permissions');

  // Group permissions by category and check if granted
  const permissionsByCategory = useMemo(() => {
    const userPermissionSet = new Set(user?.permissions || []);
    const permissions = permissionsData || [];
    return permissions.reduce(
      (acc, permission) => {
        if (!acc[permission.resource]) {
          acc[permission.resource] = [];
        }
        acc[permission.resource].push({
          id: permission.id,
          label: permission.action,
          granted: userPermissionSet.has(permission.id),
          category: permission.resource,
        });
        return acc;
      },
      {} as Record<string, Permission[]>
    );
  }, [permissionsData, user]);
  console.log(user);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white space-y-6">
      <div className="mx-auto space-y-6">
        {/* User Specific Details Card */}
        <UserDetailsCard user={user} />

        {/* Tabs for detailed sections */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="p-0">
            <Tabs
              defaultValue="permissions"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="px-6 border-b border-gray-100">
                <TabsList className="w-full bg-transparent p-0 gap-8 h-14">
                  <TabsTrigger
                    value="permissions"
                    className="h-full rounded-none border-b-2 border-transparent px-0 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-medium"
                  >
                    Permissions
                  </TabsTrigger>
                  <TabsTrigger
                    value="devices"
                    className="h-full rounded-none border-b-2 border-transparent px-0 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-medium"
                  >
                    Devices
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity-logs"
                    className="h-full rounded-none border-b-2 border-transparent px-0 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-medium"
                  >
                    Activity Log
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Permissions Tab Content */}
              <TabsContent value="permissions" className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    Permission Matrix
                  </h2>
                  <p className="text-sm text-gray-500 mb-6 font-normal">
                    Individual and role-based permissions granted to this user.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(permissionsByCategory || {}).map(
                    ([category, categoryPermissions]) => (
                      <Card
                        key={category}
                        className="bg-white dark:bg-gray-900 dark:border-gray-700 shadow-none border-gray-100"
                      >
                        <CardHeader className="py-4 px-5 bg-gray-50/50">
                          <CardTitle className="text-base capitalize font-semibold text-gray-900 dark:text-white">
                            {category}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-4 px-5 space-y-4">
                          {categoryPermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center gap-3"
                            >
                              <PermissionCheckbox
                                granted={permission.granted}
                              />
                              <span className="text-sm capitalize text-gray-700 flex-1 dark:text-white">
                                {permission.label} {category.replace('-', ' ')}
                              </span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className="text-sm text-gray-600 font-medium">
                      Granted Permission
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-200"></div>
                    <span className="text-sm text-gray-600 font-medium">
                      Denied Permission
                    </span>
                  </div>
                </div>
              </TabsContent>

              {/* Devices Tab Content */}
              <TabsContent value="devices" className="p-6">
                <DevicesListCustomers customerId={user?.customerId || ''} />
              </TabsContent>

              {/* Activity Log Tab Content */}
              <TabsContent value="activity-logs" className="p-6">
                <UserActivityLog
                  userId={id || ''}
                  title="Specific User Activity"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
