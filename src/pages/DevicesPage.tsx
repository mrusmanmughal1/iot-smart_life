import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Eye, Plus, Search } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { DeviceDialog } from '@/features/devices/components/DeviceDialog';
import { DeviceCredentialsDialog } from '@/features/devices/components/DeviceCredentialsDialog';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { getErrorMessage } from '@/utils/helpers/apiErrorHandler';
import type { DeviceFormData } from '@/features/devices/types';
import { Pagination } from '@/components/common/Pagination/Pagination';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/PageHeader';
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from '@/components/ui/tooltip';
import { useDebouncedValue } from '@/utils/helpers/Debounce';
import { DeleteConfirmationDialog } from '@/components/common/DeleteConfirmationDialog';

export default function DevicesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const debouncedSearch = useDebouncedValue(inputValue, 500);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false);
  const [newDeviceCredentials, setNewDeviceCredentials] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedDevice, setSelectedDevice] = useState<{
    id: string;
    name: string;
    type: string;
    connectionType: string;
    description: string;
  } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deviceToDeleteId, setDeviceToDeleteId] = useState<string | null>(null);

  const { data: devicesData } = useDevices({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
  });
  const createDevice = useCreateDevice();
  const updateDevice = useUpdateDevice();
  const deleteDevice = useDeleteDevice();

  // Handle delete device
  const handleDeleteConfirm = useCallback(async () => {
    if (!deviceToDeleteId) return;
    try {
      const response = await deleteDevice.mutateAsync(deviceToDeleteId);
      const successMessage =
        (response as { data?: { message?: string } })?.data?.message ||
        (response as { message?: string })?.message ||
        t('success.deleted') ||
        'Device deleted successfully';
      toast.success(successMessage);
      setDeviceToDeleteId(null);
    } catch (error) {
      const errorMessage =
        getErrorMessage(error) ||
        t('errors.generic') ||
        'Failed to delete device';
      toast.error(errorMessage);
    }
  }, [deleteDevice, deviceToDeleteId, t]);

  // Handle status toggle

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
      connectionType: device.connectionType || '',
      description: device.description || '',
    });
    setIsEditDialogOpen(true);
  }, []);

  // Handle form submissions
  const handleCreate = async (data: DeviceFormData) => {
    try {
      const resp = await createDevice.mutateAsync(data);
      const successMessage =
        (resp as { data?: { message?: string } })?.data?.message ||
        (resp as { message?: string })?.message ||
        t('success.created') ||
        'Device created successfully';
      toast.success(successMessage);

      const credentials =
        (resp as any)?.data?.data?.credentials ||
        (resp as any)?.data?.credentials;
      if (credentials) {
        setNewDeviceCredentials(credentials);
        setIsCredentialsDialogOpen(true);
      }
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title={t('devices.title')}
          description={t('devices.subtitle')}
        />
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('devices.addDevice')}
        </Button>
      </div>
      {/* Search and Filter Section */}
      <div className="flex items-center gap-3">
        <div className="relative  ">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t('devices.searchPlaceholder')}
            value={inputValue}
            onChange={handleSearchChange}
            className="w-96 pr-10"
          />
        </div>
      </div>
      {/* Devices Table */}
      <Card className="pt-6">
        <CardContent className="relative min-h-[400px]">
          <div className="">
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
                        className="text-right flex gap-1 items-end justify-end relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="hover:bg-secondary hover:text-white"
                              onClick={() => navigate(`/devices/${device.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bottom-[70%] max-w-36">
                            View Device
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="hover:bg-secondary hover:text-white"
                              onClick={() => handleOpenEditDialog(device)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bottom-[70%] max-w-36">
                            Edit Device
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="hover:bg-secondary hover:text-white"
                              onClick={() => {
                                setDeviceToDeleteId(device.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bottom-[70%] max-w-36">
                            Delete Device
                          </TooltipContent>
                        </Tooltip>
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
          isEditDialogOpen && selectedDevice
            ? {
                name: selectedDevice.name,
                type: selectedDevice.type,
                connectionType: selectedDevice.connectionType,
                description: selectedDevice.description,
              }
            : undefined
        }
        onSubmit={handleEdit}
        isLoading={updateDevice.isPending}
      />

      {/* Credentials Dialog */}
      <DeviceCredentialsDialog
        open={isCredentialsDialogOpen}
        onOpenChange={setIsCredentialsDialogOpen}
        credentials={newDeviceCredentials}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Device"
        itemName={
          devices.find((d: any) => d.id === deviceToDeleteId)?.name || 'Device'
        }
        isLoading={deleteDevice.isPending}
      />
    </div>
  );
}
