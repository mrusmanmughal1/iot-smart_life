import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/common/DataTable/DataTable';
import { createSortableColumn, createActionsColumn } from '@/components/common/DataTable/columns';
import { GaugeChart } from '@/components/charts/GaugeChart';
import {
  Server,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Wifi,
  WifiOff,
  HardDrive,
  Cpu,
  MemoryStick,
  Activity,
  Download,
  Upload,
  Edit,
  Trash2,
  RefreshCw,
  MapPin,
} from 'lucide-react';

interface EdgeInstance {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'syncing' | 'error';
  version: string;
  ipAddress: string;
  lastSeen: Date;
  devices: number;
  cpu: number;
  memory: number;
  storage: number;
  uptime: string;
  dataSync: {
    pending: number;
    lastSync: Date;
  };
}

const edgeInstances: EdgeInstance[] = [
  {
    id: '1',
    name: 'Factory Floor - Building A',
    location: 'New York, USA',
    status: 'online',
    version: '3.5.2',
    ipAddress: '192.168.1.100',
    lastSeen: new Date(),
    devices: 45,
    cpu: 42,
    memory: 68,
    storage: 55,
    uptime: '15d 4h 23m',
    dataSync: {
      pending: 0,
      lastSync: new Date('2025-01-30T14:30:00'),
    },
  },
  {
    id: '2',
    name: 'Warehouse - Distribution Center',
    location: 'Los Angeles, USA',
    status: 'online',
    version: '3.5.2',
    ipAddress: '192.168.2.100',
    lastSeen: new Date(),
    devices: 67,
    cpu: 38,
    memory: 55,
    storage: 72,
    uptime: '22d 11h 45m',
    dataSync: {
      pending: 0,
      lastSync: new Date('2025-01-30T14:28:00'),
    },
  },
  {
    id: '3',
    name: 'Remote Site - Mining',
    location: 'Denver, USA',
    status: 'syncing',
    version: '3.5.1',
    ipAddress: '10.0.1.50',
    lastSeen: new Date(Date.now() - 120000),
    devices: 23,
    cpu: 65,
    memory: 72,
    storage: 45,
    uptime: '7d 18h 12m',
    dataSync: {
      pending: 156,
      lastSync: new Date('2025-01-30T14:00:00'),
    },
  },
  {
    id: '4',
    name: 'Branch Office - Seattle',
    location: 'Seattle, USA',
    status: 'offline',
    version: '3.5.0',
    ipAddress: '10.0.2.75',
    lastSeen: new Date(Date.now() - 3600000),
    devices: 12,
    cpu: 0,
    memory: 0,
    storage: 0,
    uptime: '-',
    dataSync: {
      pending: 1234,
      lastSync: new Date('2025-01-30T10:00:00'),
    },
  },
];

export default function EdgeManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.getValue('name')}</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {row.original.location}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.getValue('status') as string;
        const colors = {
          online: 'bg-green-500',
          offline: 'bg-gray-500',
          syncing: 'bg-yellow-500',
          error: 'bg-red-500',
        };
        const icons = {
          online: <Wifi className="h-3 w-3" />,
          offline: <WifiOff className="h-3 w-3" />,
          syncing: <RefreshCw className="h-3 w-3 animate-spin" />,
          error: <XCircle className="h-3 w-3" />,
        };
        return (
          <Badge className={`${colors[status as keyof typeof colors]} text-white flex items-center gap-1 w-fit`}>
            {icons[status as keyof typeof icons]}
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'devices',
      header: 'Devices',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue('devices')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'version',
      header: 'Version',
      cell: ({ row }: any) => (
        <Badge variant="outline">{row.getValue('version')}</Badge>
      ),
    },
    {
      accessorKey: 'cpu',
      header: 'CPU',
      cell: ({ row }: any) => {
        const value = row.getValue('cpu') as number;
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full ${value > 80 ? 'bg-red-500' : value > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="text-sm">{value}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'dataSync',
      header: 'Data Sync',
      cell: ({ row }: any) => {
        const sync = row.getValue('dataSync') as { pending: number; lastSync: Date };
        return (
          <div className="text-sm">
            {sync.pending > 0 ? (
              <span className="text-yellow-500">{sync.pending} pending</span>
            ) : (
              <span className="text-green-500">Synced</span>
            )}
          </div>
        );
      },
    },
    createActionsColumn((row) => [
      { label: 'View Details', onClick: () => {}, icon: <Activity className="h-4 w-4" /> },
      { label: 'Edit', onClick: () => {}, icon: <Edit className="h-4 w-4" /> },
      { label: 'Restart', onClick: () => {}, icon: <RefreshCw className="h-4 w-4" /> },
      { label: 'Delete', onClick: () => {}, icon: <Trash2 className="h-4 w-4" />, variant: 'destructive' as const },
    ]),
  ];

  const filteredInstances = edgeInstances.filter((instance) =>
    instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instance.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineCount = edgeInstances.filter(i => i.status === 'online').length;
  const totalDevices = edgeInstances.reduce((sum, i) => sum + i.devices, 0);
  const avgCpu = Math.round(edgeInstances.reduce((sum, i) => sum + i.cpu, 0) / edgeInstances.length);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edge Management"
        description="Manage edge computing instances and monitor their status"
        actions={[
          {
            label: 'Add Edge Instance',
            onClick: () => setIsCreateOpen(true),
            icon: <Plus className="h-4 w-4 mr-2" />,
          },
        ]}
      />

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{edgeInstances.length}</div>
            <p className="text-xs text-muted-foreground">Edge computing nodes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{onlineCount}</div>
            <p className="text-xs text-muted-foreground">Active instances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDevices}</div>
            <p className="text-xs text-muted-foreground">Connected devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCpu}%</div>
            <p className="text-xs text-muted-foreground">Across all instances</p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <div className="grid gap-6 lg:grid-cols-3">
        {edgeInstances.filter(i => i.status === 'online').slice(0, 3).map((instance) => (
          <Card key={instance.id}>
            <CardHeader>
              <CardTitle className="text-base">{instance.name}</CardTitle>
              <CardDescription>{instance.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <GaugeChart value={instance.cpu} title="CPU" unit="%" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MemoryStick className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Memory</span>
                  </div>
                  <div className="text-2xl font-bold">{instance.memory}%</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Storage</span>
                  </div>
                  <div className="text-2xl font-bold">{instance.storage}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search edge instances..."
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
          <CardTitle>Edge Instances</CardTitle>
          <CardDescription>Monitor and manage your edge computing nodes</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredInstances} searchKey="name" />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Edge Instance</DialogTitle>
            <DialogDescription>Register a new edge computing instance</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Instance Name *</Label>
              <Input id="name" placeholder="e.g., Factory Floor - Building A" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" placeholder="e.g., New York, USA" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ip">IP Address *</Label>
                <Input id="ip" placeholder="192.168.1.100" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" placeholder="8080" type="number" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Instance description..." rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Edge Version</Label>
              <Select defaultValue="3.5.2">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3.5.2">3.5.2 (Latest)</SelectItem>
                  <SelectItem value="3.5.1">3.5.1</SelectItem>
                  <SelectItem value="3.5.0">3.5.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button>Add Instance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}