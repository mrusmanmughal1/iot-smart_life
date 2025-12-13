import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDevices, useCreateDevice, useUpdateDevice, useDeleteDevice } from '@/features/devices/hooks';
import { DashboardTable, type DashboardTableItem } from '@/components/common/DashboardTable/DashboardTable';
import { DeviceDialog } from '@/features/devices/components/DeviceDialog';
import AppLayout from '@/components/layout/AppLayout';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import type { DeviceFormData } from '@/features/devices/types';

export default function DevicesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<{ id: string; name: string; type: string; label?: string } | null>(null);

  const { data, isLoading } = useDevices();
  const createDevice = useCreateDevice();
  const updateDevice = useUpdateDevice();
  const deleteDevice = useDeleteDevice();

  // Handle delete device
  const handleDelete = useCallback(async (deviceId: string) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await deleteDevice.mutateAsync(deviceId);
        toast.success(t('success.deleted') || 'Device deleted successfully');
      } catch {
        toast.error(t('errors.generic') || 'Failed to delete device');
      }
    }
  }, [deleteDevice, t]);

  // Handle status toggle
  const handleStatusToggle = useCallback(async (deviceId: string) => {
    // TODO: Implement status toggle functionality
    toast('Status toggle functionality coming soon', { icon: 'ℹ️' });
  }, []);

  // Transform API data to DashboardTableItem format
  const tableData: DashboardTableItem[] = useMemo(() => {
    // Handle nested API response structure: { data: { data: [...], meta: {...} } }
    const responseData = data?.data as { data?: { data?: unknown[]; meta?: unknown } } | undefined;
    const devices = (responseData?.data?.data || responseData?.data || data?.data?.data || []) as Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      deviceProfile?: string;
      deviceProfileId?: string;
      customerName?: string;
      customerId?: string;
      createdAt: string;
    }>;
    
    return devices.map((device) => {
      // Determine status
      const status: 'active' | 'deactivate' = 
        device.status === 'online' || device.status === 'idle' ? 'active' : 'deactivate';
      
      // Get device profile as tag
      const deviceProfile = device.deviceProfile || device.deviceProfileId || device.type || 'default';
      
      // Format created time
      const createdTime = device.createdAt
        ? format(new Date(device.createdAt), 'yyyy-MM-dd HH:mm:ss')
        : '';

      // Get customer name
      const customerName = device.customerName || device.customerId || 'N/A';

      return {
        id: device.id,
        title: device.name,
        tag: deviceProfile,
        tagColor: 'bg-blue-100 text-blue-700',
        createdTime,
        status,
        customerName,
      };
    });
  }, [data]);

  // Handle opening edit dialog
  const handleOpenEditDialog = useCallback((deviceId: string) => {
    // Find device from table data
    const device = tableData.find((d) => d.id === deviceId);
    if (device) {
      setSelectedDevice({
        id: device.id,
        name: device.title,
        type: device.tag || '',
        label: device.tag || '',
      });
      setIsEditDialogOpen(true);
    }
  }, [tableData]);

  // Handle actions
  const handleAction = useCallback(async (
    action: 'share' | 'view' | 'delete' | 'download',
    deviceId: string
  ) => {
    switch (action) {
      case 'view':
        // Navigate to device details
        navigate(`/devices/${deviceId}`);
        break;
      case 'delete':
        await handleDelete(deviceId);
        break;
      case 'download':
        // TODO: Implement download functionality
        toast('Download functionality coming soon', { icon: 'ℹ️' });
        break;
      case 'share':
        // TODO: Implement share functionality
        toast('Share functionality coming soon', { icon: 'ℹ️' });
        break;
    }
  }, [handleDelete, navigate]);

  // Handle edit action from table
  const handleTableAction = useCallback(async (
    action: 'share' | 'view' | 'delete' | 'download',
    deviceId: string
  ) => {
    if (action === 'view') {
      handleOpenEditDialog(deviceId);
    } else {
      await handleAction(action, deviceId);
    }
  }, [handleAction, handleOpenEditDialog]);

  const handleCreate = async (data: DeviceFormData) => {
    try {
      await createDevice.mutateAsync(data);
      toast.success(t('success.created') || 'Device created successfully');
      setIsCreateDialogOpen(false);
    } catch {
      toast.error(t('errors.generic') || 'Failed to create device');
    }
  };

  const handleEdit = async (data: DeviceFormData) => {
    if (!selectedDevice) return;
    try {
      await updateDevice.mutateAsync({
        id: selectedDevice.id,
        data,
      });
      toast.success(t('success.updated') || 'Device updated successfully');
      setIsEditDialogOpen(false);
      setSelectedDevice(null);
    } catch {
      toast.error(t('errors.generic') || 'Failed to update device');
    }
  };

  return (
    <AppLayout>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('devices.title')}</h1>
          <p className="text-slate-500 mt-2">Manage and monitor all your IoT devices</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('devices.addDevice')}
        </Button>
      </div>

       

      {/* Devices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Devices</CardTitle>
          <CardDescription>
            {tableData.length} {tableData.length === 1 ? 'device' : 'devices'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 w-full bg-gray-100 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <DashboardTable
              linkto="devices"
              data={tableData}
              onStatusToggle={handleStatusToggle}
              onAction={handleTableAction}
              getNavigationPath={(id) => `/devices/${id}`}
              translationKeys={{
                title: 'devices.table.name',
                createdTime: 'devices.table.createdTime',
                activateDeactivate: 'devices.table.status',
                customerName: 'devices.table.customer',
                actions: 'devices.table.actions',
                active: 'devices.status.active',
                deactivate: 'devices.status.inactive',
              }}
              emptyMessage={t('devices.noDevices') || 'No devices found'}
            />
          )}
        </CardContent>
      </Card>

      {/* Create Device Dialog */}
      <DeviceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
        onSubmit={handleCreate}
        isLoading={createDevice.isPending}
      />

      {/* Edit Device Dialog */}
      <DeviceDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedDevice(null);
          }
        }}
        mode="edit"
        initialData={selectedDevice ? {
          name: selectedDevice.name,
          type: selectedDevice.type,
          label: selectedDevice.label,
        } : undefined}
        onSubmit={handleEdit}
        isLoading={updateDevice.isPending}
      />
    </div>
    </AppLayout>
  );
}