import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUser, useUpdateUserPermissions } from '@/features/users/hooks';
import { UserDetailsCard } from '@/features/users/components/UserDetailsCard';
import { UserActivityLog } from '@/features/users/components/UserActivityLog';
import { usePermissions } from '@/features/permissions/hooks';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
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
      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
        granted
          ? 'bg-green-500 border-green-500 shadow-sm shadow-green-200'
          : 'bg-white border-gray-200'
      }`}
    >
      {granted ? (
        <Check className="w-4 h-4 text-white stroke-[3px]" />
      ) : (
        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
      )}
    </div>
  );
};

export default function CustomerUserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: userResponse } = useUser(id || '');
  const user = userResponse?.data?.data.data;
  const updateUserPermissionsMutation = useUpdateUserPermissions();

  const { data: permissionsData } = usePermissions();
  const [activeTab, setActiveTab] = useState('permissions');

  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [showOnlyGranted, setShowOnlyGranted] = useState(false);

  useEffect(() => {
    if (user) {
      const directPermissionIds =
        user.permissions?.map((p) => (typeof p === 'string' ? p : p.id)) || [];

      const rolePermissionIds =
        user.roles?.flatMap((role) =>
          role.permissions?.map((p) => (typeof p === 'string' ? p : p.id))
        ) || [];

      // Combine and unique
      const allPermissionIds = Array.from(
        new Set([...directPermissionIds, ...(rolePermissionIds as string[])])
      );

      setSelectedPermissions(allPermissionIds);
    }
  }, [user]);

  // Group permissions by category and check if granted
  const permissionsByCategory = useMemo(() => {
    const directPermissionIds =
      user?.permissions?.map((p) => (typeof p === 'string' ? p : p.id)) || [];

    const rolePermissionIds =
      user?.roles?.flatMap((role) =>
        role.permissions?.map((p) => (typeof p === 'string' ? p : p.id))
      ) || [];

    const allPermissionIdSet = new Set([
      ...directPermissionIds,
      ...(rolePermissionIds as string[]),
    ]);

    const permissions = permissionsData || [];
    return permissions.reduce(
      (acc, permission) => {
        if (!acc[permission.resource]) {
          acc[permission.resource] = [];
        }
        acc[permission.resource].push({
          id: permission.id,
          label: permission.action,
          granted: allPermissionIdSet.has(permission.id),
          category: permission.resource,
        });
        return acc;
      },
      {} as Record<string, Permission[]>
    );
  }, [permissionsData, user]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = () => {
    if (!id) return;
    updateUserPermissionsMutation.mutate(
      { userId: id, permissions: selectedPermissions },
      {
        onSuccess: () => {
          toast.success('Permissions updated successfully');
          setIsEditingPermissions(false);
        },
        onError: (error: unknown) => {
          console.error('Failed to update permissions:', error);
          const errorMessage =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || 'Failed to update permissions';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleEditPermissionsToggle = () => {
    if (isEditingPermissions) {
      // Revert if canceling
      if (user?.permissions) {
        setSelectedPermissions(
          user.permissions.map((p) => (typeof p === 'string' ? p : p.id))
        );
      }
    }
    setIsEditingPermissions(!isEditingPermissions);
  };

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
              <div className="px-6 mt-4 border-b border-gray-100">
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
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      Permission Matrix
                    </h2>
                    <p className="text-sm text-gray-500 font-normal">
                      Individual and role-based permissions granted to this
                      user.
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    {!isEditingPermissions && (
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <Checkbox
                          id="show-granted-only"
                          checked={showOnlyGranted}
                          onChange={(e) => setShowOnlyGranted(e.target.checked)}
                          className="h-4 w-4 rounded-sm border-gray-300"
                        />
                        <label
                          htmlFor="show-granted-only"
                          className="text-xs font-semibold text-gray-600 cursor-pointer select-none"
                        >
                          Show Only Granted
                        </label>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      {isEditingPermissions ? (
                        <>
                          <Button
                            onClick={handleSavePermissions}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            isLoading={updateUserPermissionsMutation.isPending}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            onClick={handleEditPermissionsToggle}
                            size="sm"
                            variant="outline"
                            className="text-gray-600 border-gray-200"
                            disabled={updateUserPermissionsMutation.isPending}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handleEditPermissionsToggle}
                          size="sm"
                          variant="outline"
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Permissions
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(permissionsByCategory || {})
                    .filter(([_, categoryPermissions]) => {
                      if (!showOnlyGranted || isEditingPermissions) return true;
                      return categoryPermissions.some((p) => p.granted);
                    })
                    .map(([category, categoryPermissions]) => {
                      const permissionsToDisplay =
                        showOnlyGranted && !isEditingPermissions
                          ? categoryPermissions.filter((p) => p.granted)
                          : categoryPermissions;

                      return (
                        <Card
                          key={category}
                          className="bg-white dark:bg-gray-900 dark:border-gray-700 shadow border-gray-100 overflow-hidden transform transition-all hover:shadow-md"
                        >
                          <CardHeader className="py-3 px-5 bg-gray-50/80 border-b border-gray-100">
                            <CardTitle className="text-sm capitalize font-bold text-gray-800 dark:text-white flex items-center justify-between">
                              {category.replace(/-/g, ' ')}
                              <Badge
                                variant="outline"
                                className="bg-white text-[10px] py-0 px-2 h-5 font-medium border-gray-200"
                              >
                                {permissionsToDisplay.length} Actions
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-4 px-5 space-y-3">
                            {permissionsToDisplay.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center gap-3 group"
                              >
                                {isEditingPermissions ? (
                                  <Checkbox
                                    checked={selectedPermissions.includes(
                                      permission.id
                                    )}
                                    onChange={() =>
                                      handlePermissionToggle(permission.id)
                                    }
                                    id={permission.id}
                                    className="h-4 w-4"
                                  />
                                ) : (
                                  <PermissionCheckbox
                                    granted={selectedPermissions.includes(
                                      permission.id
                                    )}
                                  />
                                )}
                                <label
                                  htmlFor={permission.id}
                                  className={`text-sm capitalize flex-1 dark:text-white transition-colors ${
                                    isEditingPermissions
                                      ? 'cursor-pointer hover:text-primary font-medium'
                                      : selectedPermissions.includes(
                                            permission.id
                                          )
                                        ? 'text-gray-900 font-bold'
                                        : 'text-gray-400 font-normal'
                                  }`}
                                >
                                  {permission.label}
                                </label>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 font-semibold">
                      Permission Granted
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-white border-2 border-gray-200 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-gray-200" />
                    </div>
                    <span className="text-sm text-gray-500">
                      Permission Denied
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
