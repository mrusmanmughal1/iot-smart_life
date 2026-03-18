import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCustomerById, useDeleteCustomer } from '@/features/customer/hooks';
import type { Customer } from '@/features/customer/types';
import CustomerUsersList from '@/features/customer/components/CustomerUsersList';
import CustomerActivityLog from '@/features/customer/components/CustomerActivityLog';
import { usePermissions } from '@/features/permissions/hooks';
import { DeleteConfirmationDialog } from '@/components/common/DeleteConfirmationDialog';
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

export default function CustomerAdministratorPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data } = useCustomerById(id);
  const customer = data?.data as Customer | undefined;
  const deleteCustomerMutation = useDeleteCustomer();

  // get permissions for the customer
  const { data: permissionsData } = usePermissions();
  const UserPermissionsdata = permissionsData;

  const contractStart = customer?.additionalInfo?.contractStartDate
    ? new Date(customer.additionalInfo.contractStartDate).toLocaleDateString()
    : undefined;
  const contractEnd = customer?.additionalInfo?.contractEndDate
    ? new Date(customer.additionalInfo.contractEndDate).toLocaleDateString()
    : undefined;

  const [activeTab, setActiveTab] = useState('permissions');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditRole = () => {
    navigate(`/users-management/edit-customer/${id}`);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    try {
      await deleteCustomerMutation.mutateAsync(id);
      toast.success('Customer deleted successfully');
      navigate('/users-management/customers');
    } catch (error) {
      console.error('Failed to delete customer:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to delete customer';
      toast.error(errorMessage);
      throw error;
    }
  };

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
        {/* Header Section */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                  {customer?.name || 'Customer '}
                </h1>
                <p className="text-gray-600 text-sm dark:text-white">
                  {customer?.description ||
                    'Full access to customer resources and user management'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleEditRole}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Edit className="h-4 w-4  " />
                  Edit Customer
                </Button>
                <Button onClick={handleDelete} variant="secondary">
                  <Trash2 className="h-4 w-4  " />
                  Delete
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full dark:bg-gray-900 dark:border-gray-700">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <span className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium bg-success/10 text-success">
                  {customer?.status || 'Unknown'}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="text-sm truncate max-w-[200px] font-medium text-gray-900 dark:text-white">
                  {customer?.email || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {customer?.phone || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Tenant
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {customer?.tenant?.name || '-'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {[customer?.city, customer?.state, customer?.country]
                    .filter(Boolean)
                    .join(', ') || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Address
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {[customer?.address, customer?.address2]
                    .filter(Boolean)
                    .join(', ') || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Zip Code
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {customer?.zip || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Customer Type
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {customer?.additionalInfo?.customerType || '-'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Tax ID
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {customer?.additionalInfo?.taxId || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Account Manager
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {customer?.additionalInfo?.accountManager || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Contract Start
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {contractStart || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Contract End
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {contractEnd || '-'}
                </p>
              </div>
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
                  Assigned Users (8)
                </TabsTrigger>
                <TabsTrigger
                  value="devices"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                >
                  Devices (8)
                </TabsTrigger>
                <TabsTrigger
                  value="assigned-devices"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                >
                  Activity Log
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

                  {/* Summary Section */}
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
              <TabsContent value="activity-log" className="p-6 space-y-4">
                <CustomerActivityLog
                  customerId={id || ''}
                  title="Activity Log"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete Customer"
          itemName={customer?.name}
          isLoading={deleteCustomerMutation.isPending}
        />
      </div>
    </div>
  );
}
