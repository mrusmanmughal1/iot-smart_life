import React, { useState, useMemo } from 'react';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/common/DataTable/DataTable';
import {
  createSortableColumn,
  createSortableDateColumn,
  createActionsColumn,
} from '@/components/common/DataTable/columns';
import {
  Cpu,
  Plus,
  Thermometer,
  Zap,
  Activity,
  Settings,
  Copy,
  Trash2,
  Edit,
} from 'lucide-react';
import type { DeviceProfile } from '@/features/device-profiles/types';
import { DeviceProfileMultiStepForm } from '@/features/profiles/components';
import type { DeviceProfileMultiStepFormData } from '@/features/profiles/types';
import {
  useDeviceProfiles,
  useCreateDeviceProfile,
} from '@/features/profiles/hooks';
import toast from 'react-hot-toast';

// API Response type for device profile
interface DeviceProfileApiResponse {
  id: string;
  name: string;
  description?: string;
  type?: string;
  transportType?: string;
  provisionType?: string;
  default?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DeviceProfiles() {
  const { data: deviceProfiles } = useDeviceProfiles();
  const createDeviceProfileMutation = useCreateDeviceProfile();

  // Transform API response to table format
  // API structure: response.data.data.data (nested response)
  const deviceProfilesData: DeviceProfile[] = useMemo(() => {
    const apiResponse = deviceProfiles?.data as
      | { data?: { data?: DeviceProfileApiResponse[] } }
      | undefined;
    const profiles = apiResponse?.data?.data ?? [];
    return profiles.map((profile: DeviceProfileApiResponse) => ({
      id: profile.id,
      name: profile.name,
      description: profile.description || '',
      type: profile.type || 'Unknown',
      transportType: profile.transportType || 'Unknown',
      provisionType: profile.provisionType || '',
      default: profile.default || false,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      devices: 0, // TODO: Fetch device count separately if needed
    }));
  }, [deviceProfiles]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const columns: ColumnDef<DeviceProfile>[] = [
    createSortableColumn('name', 'Name'),
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }: CellContext<DeviceProfile, unknown>) => {
        const type = row.getValue('type') as string;
        // Format API type (e.g., "air_quality_monitor" -> "Air Quality Monitor")
        const formatType = (t: string) => {
          return t
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        };
        const displayType = formatType(type);
        const icons: Record<string, React.ReactNode> = {
          sensor: <Thermometer className="h-4 w-4" />,
          gateway: <Activity className="h-4 w-4" />,
          meter: <Zap className="h-4 w-4" />,
        };
        const typeLower = type.toLowerCase();
        return (
          <div className="flex items-center gap-2">
            <div className="text-primary">
              {icons[typeLower] || <Cpu className="h-4 w-4" />}
            </div>
            <span>{displayType}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'transportType',
      header: 'Transport',
      cell: ({ row }: CellContext<DeviceProfile, unknown>) => {
        const transport = row.getValue('transportType') as string;
        // Format transport type (e.g., "mqtt" -> "MQTT")
        const displayTransport = transport.toUpperCase();
        return <Badge variant="outline">{displayTransport}</Badge>;
      },
    },
    createSortableColumn('devices', 'Devices'),
    {
      accessorKey: 'default',
      header: 'Default',
      cell: ({ row }: CellContext<DeviceProfile, unknown>) =>
        row.getValue('default') ? (
          <Badge variant="default">Default</Badge>
        ) : (
          <Badge variant="secondary">-</Badge>
        ),
    },

    createSortableDateColumn('createdAt', 'Created'),
    createActionsColumn((row: DeviceProfile) => [
      {
        label: 'Edit',
        onClick: () => console.log('Edit', row.id),
        icon: <Edit className="h-4 w-4" />,
      },
      {
        label: 'Copy',
        onClick: () => console.log('Copy', row.id),
        icon: <Copy className="h-4 w-4" />,
      },
      {
        label: 'Delete',
        onClick: () => console.log('Delete', row.id),
        icon: <Trash2 className="h-4 w-4" />,
        variant: 'destructive' as const,
      },
    ]),
  ];

  const handleCreateProfile = async (data: DeviceProfileMultiStepFormData) => {
    try {
      await createDeviceProfileMutation.mutateAsync(data);
      toast.success('Device profile created successfully');
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating device profile:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        'Failed to create device profile. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Device Profiles"
        description="Manage device configuration templates"
        actions={[
          {
            label: 'Create Profile',
            onClick: () => setIsCreateOpen(true),
            icon: <Plus className="h-4 w-4 mr-2" />,
          },
        ]}
      />

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-primary ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-white font-medium">
              Total Profiles
            </CardTitle>
            <Settings className="h-4 w-4 text-white text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-white">
            <div className="text-2xl font-bold">
              {deviceProfilesData.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Device configurations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Devices
            </CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deviceProfilesData.reduce((sum, p) => sum + (p.devices || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Using these profiles
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Default Profiles
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deviceProfilesData.filter((p) => p.type === 'Gateway').length}
            </div>
            <p className="text-xs text-muted-foreground">Gateway profiles</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="">
        <CardContent className="p-2">
          <div className="overflow-visible">
            <DataTable
              columns={columns}
              data={deviceProfilesData}
              searchKey="name"
              detailRoute="/device-profiles"
            />
          </div>
        </CardContent>
      </Card>

      {/* Multi-Step Form Dialog */}
      <DeviceProfileMultiStepForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateProfile}
      />
    </div>
  );
}
