import React, { useState } from 'react';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/common/PageHeader';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/common/DataTable/DataTable';
import {
  createSortableColumn,
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

const deviceProfiles: DeviceProfile[] = [
  {
    id: '1',
    name: 'Temperature Sensor',
    description: 'Profile for temperature monitoring devices',
    type: 'Sensor',
    transportType: 'MQTT',
    provisionType: 'Allow creating new devices',
    defaultRuleChain: 'Root Rule Chain',
    createdTime: new Date('2024-01-15'),
    devices: 45,
    isDefault: false,
  },
  {
    id: '2',
    name: 'Smart Gateway',
    description: 'Gateway device for LoRaWAN network',
    type: 'Gateway',
    transportType: 'MQTT',
    provisionType: 'Check pre-provisioned devices',
    defaultRuleChain: 'Gateway Processing',
    createdTime: new Date('2024-01-10'),
    devices: 12,
    isDefault: false,
  },
  {
    id: '3',
    name: 'Energy Meter',
    description: 'Smart energy metering and monitoring',
    type: 'Meter',
    transportType: 'Modbus',
    provisionType: 'Allow creating new devices',
    defaultRuleChain: 'Energy Processing',
    createdTime: new Date('2024-02-01'),
    devices: 78,
    isDefault: true,
  },
  {
    id: '4',
    name: 'Water Flow Sensor',
    description: 'Profile for water flow monitoring',
    type: 'Sensor',
    transportType: 'MQTT',
    provisionType: 'Allow creating new devices',
    defaultRuleChain: 'Root Rule Chain',
    createdTime: new Date('2024-01-20'),
    devices: 34,
    isDefault: false,
  },
  {
    id: '5',
    name: 'Air Quality Monitor',
    description: 'Indoor/outdoor air quality measurement device',
    type: 'Sensor',
    transportType: 'HTTP',
    provisionType: 'Disabled',
    defaultRuleChain: 'Air Quality Processing',
    createdTime: new Date('2024-02-10'),
    devices: 56,
    isDefault: false,
  },
];

export default function DeviceProfiles() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const columns: ColumnDef<DeviceProfile>[] = [
    createSortableColumn('name', 'Name'),
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }: CellContext<DeviceProfile, unknown>) => {
        const type = row.getValue('type') as string;
        const icons: Record<string, React.ReactNode> = {
          Sensor: <Thermometer className="h-4 w-4" />,
          Gateway: <Activity className="h-4 w-4" />,
          Meter: <Zap className="h-4 w-4" />,
        };
        return (
          <div className="flex items-center gap-2">
            <div className="text-primary">{icons[type]}</div>
            <span>{type}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'transportType',
      header: 'Transport',
      cell: ({ row }: CellContext<DeviceProfile, unknown>) => (
        <Badge variant="outline">{row.getValue('transportType')}</Badge>
      ),
    },
    createSortableColumn('devices', 'Devices'),
    {
      accessorKey: 'isDefault',
      header: 'Default',
      cell: ({ row }: CellContext<DeviceProfile, unknown>) =>
        row.getValue('isDefault') ? (
          <Badge variant="default">Default</Badge>
        ) : (
          <Badge variant="secondary">-</Badge>
        ),
    },
    createSortableColumn('createdTime', 'Created'),
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

  const handleCreateProfile = (data: DeviceProfileMultiStepFormData) => {
    console.log('Creating profile:', data);
    // TODO: Transform multi-step form data to API format and submit
    setIsCreateOpen(false);
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
            <div className="text-2xl font-bold">{deviceProfiles.length}</div>
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
              {deviceProfiles.reduce((sum, p) => sum + p.devices, 0)}
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
              {deviceProfiles.filter((p) => p.type === 'Gateway').length}
            </div>
            <p className="text-xs text-muted-foreground">Gateway profiles</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="pt-6">
        <CardContent className="p-2">
          <div className="overflow-visible">
            <DataTable
              columns={columns}
              data={deviceProfiles}
              searchKey="name"
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
