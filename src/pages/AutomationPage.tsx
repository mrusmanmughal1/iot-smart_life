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
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/common/DataTable/DataTable';
import { createSortableColumn, createActionsColumn } from '@/components/common/DataTable/columns';
import {
  Zap,
  Plus,
  Search,
  Play,
  Pause,
  Copy,
  Trash2,
  Edit,
  ArrowRight,
  Clock,
  Thermometer,
  Lightbulb,
  Fan,
  Bell,
  Mail,
  AlertTriangle,
} from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: {
    type: string;
    device: string;
    condition: string;
  };
  action: {
    type: string;
    target: string;
    value: string;
  };
  lastTriggered?: Date;
  executionCount: number;
  status: 'active' | 'inactive' | 'error';
}

const automations: Automation[] = [
  {
    id: '1',
    name: 'Temperature Control',
    description: 'Turn on AC when temperature exceeds 25°C',
    enabled: true,
    trigger: {
      type: 'Threshold',
      device: 'Temperature Sensor #1',
      condition: 'temperature > 25',
    },
    action: {
      type: 'Control Device',
      target: 'AC Unit #1',
      value: 'Turn ON',
    },
    lastTriggered: new Date('2025-01-30T14:15:00'),
    executionCount: 45,
    status: 'active',
  },
  {
    id: '2',
    name: 'Motion Light Control',
    description: 'Turn on lights when motion detected',
    enabled: true,
    trigger: {
      type: 'Device State',
      device: 'Motion Sensor #3',
      condition: 'motion = detected',
    },
    action: {
      type: 'Control Device',
      target: 'Smart Lights - Hallway',
      value: 'Turn ON',
    },
    lastTriggered: new Date('2025-01-30T13:45:00'),
    executionCount: 128,
    status: 'active',
  },
  {
    id: '3',
    name: 'Low Battery Alert',
    description: 'Send email when device battery is low',
    enabled: true,
    trigger: {
      type: 'Threshold',
      device: 'All Devices',
      condition: 'battery < 20%',
    },
    action: {
      type: 'Send Notification',
      target: 'admin@company.com',
      value: 'Email Alert',
    },
    lastTriggered: new Date('2025-01-29T10:30:00'),
    executionCount: 12,
    status: 'active',
  },
  {
    id: '4',
    name: 'Evening Energy Saver',
    description: 'Reduce heating after 10 PM',
    enabled: false,
    trigger: {
      type: 'Schedule',
      device: 'Time-based',
      condition: 'time = 22:00',
    },
    action: {
      type: 'Set Value',
      target: 'Thermostat - Main',
      value: 'Set to 18°C',
    },
    executionCount: 89,
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Water Leak Detection',
    description: 'Alert and shut valve on water leak',
    enabled: true,
    trigger: {
      type: 'Device State',
      device: 'Water Sensor #2',
      condition: 'leak = detected',
    },
    action: {
      type: 'Multiple Actions',
      target: 'Water Valve + Alert',
      value: 'Close valve & Send alert',
    },
    executionCount: 2,
    status: 'active',
  },
];

export default function Automation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTriggerType, setSelectedTriggerType] = useState('threshold');

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.getValue('name')}</div>
          <div className="text-sm text-muted-foreground">{row.original.description}</div>
        </div>
      ),
    },
    {
      accessorKey: 'trigger',
      header: 'Trigger',
      cell: ({ row }: any) => {
        const trigger = row.getValue('trigger') as { type: string; device: string; condition: string };
        return (
          <div className="space-y-1">
            <Badge variant="outline">{trigger.type}</Badge>
            <div className="text-sm text-muted-foreground">
              {trigger.device}: {trigger.condition}
            </div>
          </div>
        );
      },
    },
    {
      id: 'arrow',
      header: '',
      cell: () => (
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      ),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }: any) => {
        const action = row.getValue('action') as { type: string; target: string; value: string };
        return (
          <div className="space-y-1">
            <Badge variant="secondary">{action.type}</Badge>
            <div className="text-sm text-muted-foreground">
              {action.target}: {action.value}
            </div>
          </div>
        );
      },
    },
    createSortableColumn('executionCount', 'Executions'),
    {
      accessorKey: 'enabled',
      header: 'Status',
      cell: ({ row }: any) => (
        <Switch checked={row.getValue('enabled')} />
      ),
    },
    createActionsColumn((row: any) => [
      {
        label: row.original.enabled ? 'Disable' : 'Enable',
        onClick: () => {},
        icon: row.original.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />,
      },
      { label: 'Edit', onClick: () => {}, icon: <Edit className="h-4 w-4" /> },
      { label: 'Duplicate', onClick: () => {}, icon: <Copy className="h-4 w-4" /> },
      { label: 'Delete', onClick: () => {}, icon: <Trash2 className="h-4 w-4" />, variant: 'destructive' as const },
    ]),
  ];

  const filteredAutomations = automations.filter((automation) =>
    automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    automation.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automation"
        description="Create automated workflows and device interactions"
        actions={[
          {
            label: 'Create Automation',
            onClick: () => setIsCreateOpen(true),
            icon: <Plus className="h-4 w-4 mr-2" />,
          },
        ]}
      />

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Automations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automations.length}</div>
            <p className="text-xs text-muted-foreground">Configured rules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Play className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {automations.filter(a => a.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automations.reduce((sum, a) => sum + a.executionCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automations.filter(a => a.status === 'error').length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Example Automations */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Templates</CardTitle>
          <CardDescription>Quick start with common automation scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                </div>
                <h4 className="font-semibold">Temperature Control</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically adjust climate based on temperature readings
              </p>
            </div>

            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                </div>
                <h4 className="font-semibold">Smart Lighting</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Control lights based on motion, time, or occupancy
              </p>
            </div>

            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Bell className="h-5 w-5 text-red-500" />
                </div>
                <h4 className="font-semibold">Alert System</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Send notifications on critical events or thresholds
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search automations..."
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
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>Manage your automation workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredAutomations} searchKey="name" />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Automation</DialogTitle>
            <DialogDescription>Define triggers and actions for your automation</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="space-y-2">
                <Label htmlFor="auto-name">Automation Name *</Label>
                <Input id="auto-name" placeholder="e.g., Temperature Control" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-description">Description</Label>
                <Textarea id="auto-description" placeholder="Describe what this automation does..." rows={2} />
              </div>
            </div>

            {/* Trigger Configuration */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Trigger (When)
              </h3>

              <div className="space-y-2">
                <Label htmlFor="trigger-type">Trigger Type *</Label>
                <Select value={selectedTriggerType} onValueChange={setSelectedTriggerType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="threshold">Device Threshold</SelectItem>
                    <SelectItem value="state">Device State Change</SelectItem>
                    <SelectItem value="schedule">Time Schedule</SelectItem>
                    <SelectItem value="event">Custom Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedTriggerType === 'threshold' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="trigger-device">Select Device *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temp-1">Temperature Sensor #1</SelectItem>
                        <SelectItem value="temp-2">Temperature Sensor #2</SelectItem>
                        <SelectItem value="humidity-1">Humidity Sensor #1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trigger-attribute">Attribute</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="temperature">Temperature</SelectItem>
                          <SelectItem value="humidity">Humidity</SelectItem>
                          <SelectItem value="battery">Battery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trigger-operator">Operator</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=">">&gt; Greater than</SelectItem>
                          <SelectItem value="<">&lt; Less than</SelectItem>
                          <SelectItem value="=">= Equals</SelectItem>
                          <SelectItem value="!=">!= Not equals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trigger-value">Value</Label>
                      <Input id="trigger-value" type="number" placeholder="25" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Configuration */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Action (Then)
              </h3>

              <div className="space-y-2">
                <Label htmlFor="action-type">Action Type *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="control">Control Device</SelectItem>
                    <SelectItem value="set-value">Set Attribute Value</SelectItem>
                    <SelectItem value="notification">Send Notification</SelectItem>
                    <SelectItem value="webhook">Call Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action-target">Target Device *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ac-1">AC Unit #1</SelectItem>
                    <SelectItem value="lights-1">Smart Lights - Hallway</SelectItem>
                    <SelectItem value="valve-1">Water Valve #1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action-command">Command *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose command" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">Turn ON</SelectItem>
                    <SelectItem value="off">Turn OFF</SelectItem>
                    <SelectItem value="toggle">Toggle</SelectItem>
                    <SelectItem value="custom">Custom Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Options</h3>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="enable">Enable Automation</Label>
                  <p className="text-sm text-muted-foreground">Start automation immediately</p>
                </div>
                <Switch id="enable" defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="log">Enable Logging</Label>
                  <p className="text-sm text-muted-foreground">Log all executions</p>
                </div>
                <Switch id="log" defaultChecked />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button>Create Automation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}