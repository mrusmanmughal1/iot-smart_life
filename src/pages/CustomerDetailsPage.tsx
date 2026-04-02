import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCustomerById } from '@/features/customer/hooks';
import type { Customer } from '@/features/customer/types';
import CustomerUsersList from '@/features/customer/components/CustomerUsersList';
import CustomerActivityLog from '@/features/customer/components/CustomerActivityLog';
import { usePermissions } from '@/features/permissions/hooks';
import DevicesListCustomers from '@/features/users/components/DevicesListCustomers';
import { CustomerDetailsCard } from '@/features/customer/components/CustomerDetailsCard';

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

export default function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data } = useCustomerById(id);
  const customer = data?.data as Customer | undefined;

  // get permissions for the customer
  const { data: permissionsData } = usePermissions();
  const UserPermissionsdata = permissionsData;

  const [activeTab, setActiveTab] = useState('permissions');

  // Group permissions by category
  const permissionsByCategory = useMemo(
    () =>
      UserPermissionsdata?.reduce(
        (acc, permission) => {
          if (!acc[permission.resource]) {
            acc[permission.resource] = [];
          }
          acc[permission.resource].push({
            id: permission.id,
            label: permission.action,
            granted: true,
            category: permission.resource,
          });
          return acc;
        },
        {} as Record<string, Permission[]>
      ),
    [UserPermissionsdata]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto space-y-6">
        {/* Customer Details Card Extracted */}
        <CustomerDetailsCard customer={customer} id={id} />

        {/* Tabs */}
        <Card className="bg-white shadow-sm p-4">
          <CardContent className="p-0">
            <Tabs
              defaultValue="permissions"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full  ">
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
                  Assigned Users
                </TabsTrigger>
                <TabsTrigger
                  value="devices"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                >
                  Devices
                </TabsTrigger>
                <TabsTrigger
                  value="activity-logs"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                >
                  Activity Logs
                </TabsTrigger>
              </TabsList>

              {/* Devices Tab */}
              <TabsContent value="devices" className="p-4 space-y-4 ">
                <DevicesListCustomers customerId={id || ''} />
              </TabsContent>
              {/* Permissions Tab */}
              <TabsContent value="permissions" className="p-4 space-y-4 ">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Permission Matrix
                  </h2>
                </div>

                {/* Permission Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(permissionsByCategory || {}).map(
                    ([category, categoryPermissions]) => (
                      <Card
                        key={category}
                        className={`${'bg-white hover:bg-green-50 dark:bg-gray-900 dark:border-gray-700'}`}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg capitalize font-semibold text-gray-900 dark:text-white">
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
                              <span className="text-sm capitalize text-gray-900 flex-1 dark:text-white">
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
                <CustomerUsersList
                  customerId={id}
                  searchQuery=""
                  title="Assigned Users"
                />
              </TabsContent>

              {/* Activity Log Tab */}
              <TabsContent value="activity-logs" className="p-6 space-y-4">
                <CustomerActivityLog
                  customerId={id || ''}
                  title="Activity Log"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
