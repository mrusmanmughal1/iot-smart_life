import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Save, ScrollText, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DeleteConfirmationDialog } from '@/components/common/DeleteConfirmationDialog';
import {
  useDeleteCustomer,
  useUpdateCustomer,
} from '@/features/customer/hooks';
import type { Customer } from '@/features/customer/types';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface CustomerDetailsCardProps {
  customer: Customer | undefined;
  id: string | undefined;
}

export function CustomerDetailsCard({
  customer,
  id,
}: CustomerDetailsCardProps) {
  const navigate = useNavigate();
  const deleteCustomerMutation = useDeleteCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (customer && !isEditing) {
      setFormData({
        name: customer.name || '',
        status: customer.status || '',
        email: customer.email || '',
        phone: customer.phone || '',
        state: customer.state || '',
        city: customer.city || '',
        country: customer.country || '',
        address: customer.address || '',
        zip: customer.zip || '',
        createdAt: customer.createdAt || '',
        customerType: customer.additionalInfo?.customerType || '',
        allocatedUsers: customer.allocatedLimits?.users ?? 0,
        allocatedAssets: customer.allocatedLimits?.assets ?? 0,
        allocatedDevices: customer.allocatedLimits?.devices ?? 0,
        allocatedFloorPlans: customer.allocatedLimits?.floorPlans ?? 0,
        allocatedDashboards: customer.allocatedLimits?.dashboards ?? 0,
        allocatedAutomations: customer.allocatedLimits?.automations ?? 0,
      });
    }
  }, [customer, isEditing]);

  const handleSave = async () => {
    if (!id) return;
    try {
      await updateCustomerMutation.mutateAsync({
        customerId: id,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          address: formData.address,
          zip: formData.zip,
          allocatedLimits: {
            dashboards: Number(formData.allocatedDashboards),
            floorPlans: Number(formData.allocatedFloorPlans),
            automations: Number(formData.allocatedAutomations),
            users: Number(formData.allocatedUsers),
            assets: Number(formData.allocatedAssets),
            devices: Number(formData.allocatedDevices),
          },
        },
      });
      toast.success('Customer updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update customer:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to update customer';
      toast.error(errorMessage);
    }
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

  return (
    <>
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-6">
              <div className="">
                {/*add iamge with avatar */}
                <Avatar className="h-20 w-20">
                  {/* <AvatarImage src={customer?.logo} /> */}
                  <AvatarFallback>{customer?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="">
                <h1 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                  {customer?.name || 'N/A'}{' '}
                  <Badge
                    variant={
                      customer?.status === 'active' ? 'default' : 'secondary'
                    }
                    className="ml-2"
                  >
                    {customer?.status}
                  </Badge>
                </h1>
                <p className="text-gray-600 text-sm dark:text-white flex ">
                  <ScrollText className="h-4 w-4 mr-1" />{' '}
                  {customer?.description || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-primary hover:bg-primary/90 text-white"
                variant={isEditing ? 'outline' : 'default'}
              >
                {isEditing ? (
                  <X className="h-4 w-4 mr-2" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                {isEditing ? 'Cancel Edit' : 'Edit Customer'}
              </Button>
              {isEditing && (
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={updateCustomerMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateCustomerMutation.isPending
                    ? 'Saving...'
                    : 'Save Changes'}
                </Button>
              )}
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                variant="secondary"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* INLINE EDIT FORM GRID */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full dark:bg-gray-900 dark:border-gray-700">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Name
              </p>
              <Input
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
                className="font-semibold"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Status
              </p>
              <Input
                value={formData.status || ''}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="font-semibold capitalize"
                disabled
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Email
              </p>
              <Input
                value={formData.email || ''}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
                className="font-semibold"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Phone
              </p>
              <Input
                value={formData.phone || ''}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
                className="font-semibold"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Tenant ID
              </p>
              <Input
                value={customer?.tenantId || customer?.tenant?.name || ''}
                disabled={true}
                placeholder="System Managed"
                className="font-semibold"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                City
              </p>
              <Input
                value={formData.city || ''}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                disabled={!isEditing}
                className="font-semibold"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                State
              </p>
              <Input
                value={formData.state || ''}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="font-semibold"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Country
              </p>
              <Input
                value={formData.country || ''}
                className="font-semibold"
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Address
              </p>
              <Input
                value={formData.address || ''}
                className="font-semibold"
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Zip Code
              </p>
              <Input
                value={formData.zip || ''}
                className="font-semibold"
                onChange={(e) =>
                  setFormData({ ...formData, zip: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Created At
              </p>
              <Input
                value={new Date(formData.createdAt).toLocaleDateString() || ''}
                className="font-semibold"
                disabled
              />
            </div>
          </div>
          {/* Allocation Limits */}
          <p className="text-lg font-semibold text-gray-900 ms-1 my-4 dark:text-white">
            Allocation Limits
          </p>
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full dark:bg-gray-900 dark:border-gray-700">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Alloc. Users
              </p>
              <Input
                type="number"
                value={formData.allocatedUsers || 0}
                className="font-semibold"
                onChange={(e) =>
                  setFormData({ ...formData, allocatedUsers: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Alloc. Assets
              </p>
              <Input
                type="number"
                value={formData.allocatedAssets || 0}
                className="font-semibold"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allocatedAssets: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Alloc. Devices
              </p>
              <Input
                type="number"
                value={formData.allocatedDevices || 0}
                className="font-semibold"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allocatedDevices: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Alloc. Dashboards
              </p>
              <Input
                type="number"
                value={formData.allocatedDashboards || 0}
                className="font-semibold"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allocatedDashboards: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Alloc. Floor Plans
              </p>
              <Input
                type="number"
                value={formData.allocatedFloorPlans || 0}
                className="font-semibold"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allocatedFloorPlans: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Alloc. Automations
              </p>
              <Input
                type="number"
                value={formData.allocatedAutomations || 0}
                className="font-semibold"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allocatedAutomations: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </div>
          </div>

          <p className="text-lg font-semibold text-gray-900 ms-1 my-4 dark:text-white">
            Usage Counters{' '}
            <small className="text-xs text-gray-500 dark:text-gray-400">
              {' '}
              (Read Only)
            </small>
          </p>
          <div className="space-y-1 col-span-full">
            {/* show details   in a table   */}
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full dark:bg-gray-900 dark:border-gray-700">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Users
                </p>
                <p className="text-sm font-medium text-gray-900 ">
                  {`${customer?.usageCounters?.users ?? 0} / ${formData.allocatedUsers}`}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Assets
                </p>
                <p className="text-sm font-medium text-gray-900 ">
                  {`${customer?.usageCounters?.assets ?? 0} / ${formData.allocatedAssets}`}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Devices
                </p>
                <p className="text-sm font-medium text-gray-900 ">
                  {`${customer?.usageCounters?.devices ?? 0} / ${formData.allocatedDevices}`}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Dashboards
                </p>
                <p className="text-sm font-medium text-gray-900 ">
                  {`${customer?.usageCounters?.dashboards ?? 0} / ${formData.allocatedDashboards}`}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Floor Plans
                </p>
                <p className="text-sm font-medium text-gray-900 ">
                  {`${customer?.usageCounters?.floorPlans ?? 0} / ${formData.allocatedFloorPlans}`}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Automations
                </p>
                <p className="text-sm font-medium text-gray-900 ">
                  {`${customer?.usageCounters?.automations ?? 0} / ${formData.allocatedAutomations}`}
                </p>
              </div>
            </div>
          </div>
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
    </>
  );
}
