import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useDevices,
  useCreateDevice,
  useUpdateDevice,
  useDeleteDevice,
} from '@/features/devices/hooks';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  Share2,
  Activity,
  History,
} from 'lucide-react';
import { DeviceDialog } from '@/features/devices/components/DeviceDialog';

import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { getErrorMessage } from '@/utils/helpers/apiErrorHandler';
import type { DeviceFormData } from '@/features/devices/types';
import { Pagination } from '@/components/common/Pagination/Pagination';

export default function DevicesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedDevice, setSelectedDevice] = useState<{
    id: string;
    name: string;
    type: string;
    label?: string;
  } | null>(null);

  const { data: devicesData } = useDevices({
    page: currentPage,
    limit: itemsPerPage,
  });
  const createDevice = useCreateDevice();
  const updateDevice = useUpdateDevice();
  const deleteDevice = useDeleteDevice();

  // Handle delete device
  const handleDelete = useCallback(
    async (deviceId: string) => {
      if (window.confirm('Are you sure you want to delete this device?')) {
        try {
          const response = await deleteDevice.mutateAsync(deviceId);
          const successMessage =
            (response as { data?: { message?: string } })?.data?.message ||
            (response as { message?: string })?.message ||
            t('success.deleted') ||
            'Device deleted successfully';
          toast.success(successMessage);
        } catch (error) {
          const errorMessage =
            getErrorMessage(error) ||
            t('errors.generic') ||
            'Failed to delete device';
          toast.error(errorMessage);
        }
      }
    },
    [deleteDevice, t]
  );

  // Handle status toggle
  const handleStatusToggle = useCallback(async (deviceId: string) => {
    // TODO: Implement status toggle functionality
    console.log('Toggle status for device:', deviceId);
    toast('Status toggle functionality coming soon', { icon: 'ℹ️' });
  }, []);

  // Extract devices and pagination info from API response
  const { devices, meta } = useMemo(() => {
    const responseData = devicesData?.data.data;
    const deviceList = responseData?.data || [];
    const paginationMeta = responseData?.meta || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      totalItems: 0,
    };
    return {
      devices: deviceList,
      meta: paginationMeta,
    };
  }, [devicesData]);

  // Handle opening edit dialog
  const handleOpenEditDialog = useCallback((device: any) => {
    setSelectedDevice({
      id: device.id,
      name: device.name,
      type: device.type || '',
      label: device.label || '',
    });
    setIsEditDialogOpen(true);
  }, []);

  // Handle actions
  const handleAction = useCallback(
    async (
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
    },
    [handleDelete, navigate]
  );

  const handleCreate = async (data: DeviceFormData) => {
    try {
      const response = await createDevice.mutateAsync(data);
      const successMessage =
        (response as { data?: { message?: string } })?.data?.message ||
        (response as { message?: string })?.message ||
        t('success.created') ||
        'Device created successfully';
      toast.success(successMessage);
      setIsCreateDialogOpen(false);
    } catch (error) {
      const errorMessage =
        getErrorMessage(error) ||
        t('errors.generic') ||
        'Failed to create device';
      toast.error(errorMessage);
    }
  };

  const handleEdit = async (data: DeviceFormData) => {
    if (!selectedDevice) return;
    try {
      const response = await updateDevice.mutateAsync({
        id: selectedDevice.id,
        data,
      });
      const successMessage =
        (response as { data?: { message?: string } })?.data?.message ||
        (response as { message?: string })?.message ||
        t('success.updated') ||
        'Device updated successfully';
      toast.success(successMessage);
      setIsEditDialogOpen(false);
      setSelectedDevice(null);
    } catch (error) {
      const errorMessage =
        getErrorMessage(error) ||
        t('errors.generic') ||
        'Failed to update device';
      toast.error(errorMessage);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('devices.title')}
          </h1>
          <p className="text-slate-500  text-sm mt-">{t('devices.subtitle')}</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('devices.addDevice')}
        </Button>
      </div>

      {/* Devices Table */}
      <Card className="pt-6">
        <CardContent className="relative min-h-[400px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-primary  text-white">
                <TableRow className="hover:bg-primary ">
                  <TableHead className="text-white font-semibold">
                    {t('devices.table.name')}
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    {t('common.type')}
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    {t('common.status')}
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    {t('devices.connectionType')}
                  </TableHead>

                  <TableHead className="text-white font-semibold">
                    {t('devices.table.createdTime')}
                  </TableHead>
                  <TableHead className="text-right text-white font-semibold">
                    {t('devices.table.actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meta.totalItems === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center bg-gray-50 text-muted-foreground"
                    >
                      {t('devices.noDevices') || 'No devices found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  devices.map((device: any) => (
                    <TableRow
                      key={device.id}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => navigate(`/devices/${device.id}`)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="capitalize">{device.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-normal capitalize">{device.type}</p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            device.status === 'active'
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-red-500 hover:bg-red-600'
                          } text-white`}
                        >
                          {device.status === 'active'
                            ? t('common.active') || 'Active'
                            : t('common.inactive') || 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="   ">
                        <p className="capitalize">
                          {device.connectionType || 'N/A'}
                        </p>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {device.createdAt
                          ? format(new Date(device.createdAt), 'yyyy-MM-dd')
                          : 'N/A'}
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[160px]"
                          >
                            <DropdownMenuItem
                              onClick={() => handleOpenEditDialog(device)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {t('common.edit') || 'Edit'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusToggle(device.id)}
                            >
                              <Activity className="mr-2 h-4 w-4" />
                              Toggle Status
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-700"
                              onClick={() => handleAction('delete', device.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('common.delete') || 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {meta.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={meta.totalPages}
                totalItems={meta.totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
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
        initialData={
          selectedDevice
            ? {
                name: selectedDevice.name,
                type: selectedDevice.type,
                label: selectedDevice.label,
              }
            : undefined
        }
        onSubmit={handleEdit}
        isLoading={updateDevice.isPending}
      />
    </div>
  );
}
