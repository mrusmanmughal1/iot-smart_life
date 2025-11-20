import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/common/DataTable/DataTable';
import { createSortableColumn, createActionsColumn } from '@/components/common/DataTable/columns';
import {
  Cpu,
  Plus,
  Search,
  Thermometer,
  Zap,
  Droplets,
  Wind,
  Activity,
  Settings,
  Copy,
  Trash2,
  Edit,
} from 'lucide-react';

interface DeviceProfile {
  id: string;
  name: string;
  description: string;
  type: string;
  transportType: string;
  provisionType: string;
  defaultRuleChain: string;
  createdTime: Date;
  devices: number;
  isDefault: boolean;
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<DeviceProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Sensor',
    transportType: 'MQTT',
    provisionType: 'Allow creating new devices',
    defaultRuleChain: 'Root Rule Chain',
  });

  const columns = [
    createSortableColumn('name', 'Name'),
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }: any) => {
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
      cell: ({ row }: any) => (
        <Badge variant="outline">{row.getValue('transportType')}</Badge>
      ),
    },
    createSortableColumn('devices', 'Devices'),
    {
      accessorKey: 'isDefault',
      header: 'Default',
      cell: ({ row }: any) => (
        row.getValue('isDefault') ? (
          <Badge variant="default">Default</Badge>
        ) : (
          <Badge variant="secondary">-</Badge>
        )
      ),
    },
    createSortableColumn('createdTime', 'Created'),
    createActionsColumn((row: any) => [
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

  const filteredProfiles = deviceProfiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProfile = () => {
    console.log('Creating profile:', formData);
    setIsCreateOpen(false);
    setFormData({
      name: '',
      description: '',
      type: 'Sensor',
      transportType: 'MQTT',
      provisionType: 'Allow creating new devices',
      defaultRuleChain: 'Root Rule Chain',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Device Profiles"
        description="Manage device configuration profiles and transport protocols"
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceProfiles.length}</div>
            <p className="text-xs text-muted-foreground">Device configurations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deviceProfiles.reduce((sum, p) => sum + p.devices, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Using these profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sensors</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deviceProfiles.filter(p => p.type === 'Sensor').length}
            </div>
            <p className="text-xs text-muted-foreground">Sensor profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gateways</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deviceProfiles.filter(p => p.type === 'Gateway').length}
            </div>
            <p className="text-xs text-muted-foreground">Gateway profiles</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search device profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Device Profiles</CardTitle>
          <CardDescription>
            Manage device configuration templates and transport settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredProfiles}
            searchKey="name"
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Device Profile</DialogTitle>
            <DialogDescription>
              Define a new device configuration profile
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Profile Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Temperature Sensor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Profile description..."
                  value={formData.description}
                  onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Device Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sensor">Sensor</SelectItem>
                      <SelectItem value="Gateway">Gateway</SelectItem>
                      <SelectItem value="Meter">Meter</SelectItem>
                      <SelectItem value="Actuator">Actuator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transport">Transport Type *</Label>
                  <Select
                    value={formData.transportType}
                    onValueChange={(value) => setFormData({ ...formData, transportType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MQTT">MQTT</SelectItem>
                      <SelectItem value="HTTP">HTTP</SelectItem>
                      <SelectItem value="CoAP">CoAP</SelectItem>
                      <SelectItem value="Modbus">Modbus</SelectItem>
                      <SelectItem value="LoRaWAN">LoRaWAN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provision">Provision Strategy</Label>
                <Select
                  value={formData.provisionType}
                  onValueChange={(value) => setFormData({ ...formData, provisionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Allow creating new devices">Allow creating new devices</SelectItem>
                    <SelectItem value="Check pre-provisioned devices">Check pre-provisioned devices</SelectItem>
                    <SelectItem value="Disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruleChain">Default Rule Chain</Label>
                <Select
                  value={formData.defaultRuleChain}
                  onValueChange={(value) => setFormData({ ...formData, defaultRuleChain: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Root Rule Chain">Root Rule Chain</SelectItem>
                    <SelectItem value="Gateway Processing">Gateway Processing</SelectItem>
                    <SelectItem value="Energy Processing">Energy Processing</SelectItem>
                    <SelectItem value="Air Quality Processing">Air Quality Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProfile}>
              Create Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}