import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/common/DataTable/DataTable';
import { createSortableColumn, createActionsColumn } from '@/components/common/DataTable/columns';
import {
  Plug,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  Play,
  Pause,
  Copy,
  Trash2,
  Edit,
  Cloud,
  Database,
  Webhook,
  Mail,
  MessageSquare,
  Zap,
  Activity,
  Radio,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  protocol: string;
  description: string;
  messagesProcessed: number;
  lastActivity: Date;
  createdAt: Date;
  icon: React.ReactNode;
  enabled: boolean;
}

const integrations: Integration[] = [
  {
    id: '1',
    name: 'AWS IoT Core',
    type: 'Cloud Platform',
    status: 'active',
    protocol: 'MQTT',
    description: 'AWS IoT Core integration for device connectivity',
    messagesProcessed: 15234,
    lastActivity: new Date('2025-01-30T14:30:00'),
    createdAt: new Date('2025-01-15'),
    icon: <Cloud className="h-6 w-6" />,
    enabled: true,
  },
  {
    id: '2',
    name: 'HTTP Webhook',
    type: 'Webhook',
    status: 'active',
    protocol: 'HTTP',
    description: 'Generic HTTP webhook for external systems',
    messagesProcessed: 8765,
    lastActivity: new Date('2025-01-30T14:25:00'),
    createdAt: new Date('2025-01-20'),
    icon: <Webhook className="h-6 w-6" />,
    enabled: true,
  },
  {
    id: '3',
    name: 'Azure IoT Hub',
    type: 'Cloud Platform',
    status: 'inactive',
    protocol: 'MQTT',
    description: 'Microsoft Azure IoT Hub integration',
    messagesProcessed: 5432,
    lastActivity: new Date('2025-01-29T10:15:00'),
    createdAt: new Date('2025-01-10'),
    icon: <Cloud className="h-6 w-6" />,
    enabled: false,
  },
  {
    id: '4',
    name: 'MQTT Broker',
    type: 'Message Broker',
    status: 'active',
    protocol: 'MQTT',
    description: 'External MQTT broker integration',
    messagesProcessed: 23456,
    lastActivity: new Date('2025-01-30T14:28:00'),
    createdAt: new Date('2025-01-05'),
    icon: <Radio className="h-6 w-6" />,
    enabled: true,
  },
  {
    id: '5',
    name: 'Email Notifications',
    type: 'Notification',
    status: 'active',
    protocol: 'SMTP',
    description: 'Send email notifications on events',
    messagesProcessed: 1234,
    lastActivity: new Date('2025-01-30T13:45:00'),
    createdAt: new Date('2025-01-18'),
    icon: <Mail className="h-6 w-6" />,
    enabled: true,
  },
  {
    id: '6',
    name: 'Slack Integration',
    type: 'Notification',
    status: 'error',
    protocol: 'HTTP',
    description: 'Post alerts to Slack channels',
    messagesProcessed: 567,
    lastActivity: new Date('2025-01-30T12:00:00'),
    createdAt: new Date('2025-01-22'),
    icon: <MessageSquare className="h-6 w-6" />,
    enabled: true,
  },
];

const integrationTemplates = [
  {
    id: 'aws-iot',
    name: 'AWS IoT Core',
    category: 'Cloud Platform',
    icon: <Cloud className="h-8 w-8" />,
    description: 'Connect devices through AWS IoT Core',
    protocol: 'MQTT',
    features: ['Auto-scaling', 'Device shadows', 'Rules engine'],
  },
  {
    id: 'azure-iot',
    name: 'Azure IoT Hub',
    category: 'Cloud Platform',
    icon: <Cloud className="h-8 w-8" />,
    description: 'Microsoft Azure IoT Hub integration',
    protocol: 'MQTT',
    features: ['Device twins', 'Direct methods', 'File uploads'],
  },
  {
    id: 'http-webhook',
    name: 'HTTP Webhook',
    category: 'Webhook',
    icon: <Webhook className="h-8 w-8" />,
    description: 'Generic HTTP webhook integration',
    protocol: 'HTTP',
    features: ['Custom headers', 'POST/PUT methods', 'Authentication'],
  },
  {
    id: 'mqtt-broker',
    name: 'MQTT Broker',
    category: 'Message Broker',
    icon: <Radio className="h-8 w-8" />,
    description: 'Connect to external MQTT broker',
    protocol: 'MQTT',
    features: ['QoS levels', 'Topic filtering', 'TLS support'],
  },
  {
    id: 'email',
    name: 'Email',
    category: 'Notification',
    icon: <Mail className="h-8 w-8" />,
    description: 'Send email notifications',
    protocol: 'SMTP',
    features: ['Templates', 'Attachments', 'HTML emails'],
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Notification',
    icon: <MessageSquare className="h-8 w-8" />,
    description: 'Post messages to Slack',
    protocol: 'HTTP',
    features: ['Channels', 'Direct messages', 'Rich formatting'],
  },
];

export default function Integrations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [activeTab, setActiveTab] = useState('integrations');

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {row.original.icon}
          </div>
          <div>
            <div className="font-medium">{row.getValue('name')}</div>
            <div className="text-sm text-muted-foreground">{row.original.type}</div>
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
          active: 'bg-green-500',
          inactive: 'bg-gray-500',
          error: 'bg-red-500',
        };
        return (
          <Badge className={`${colors[status as keyof typeof colors]} text-white`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'protocol',
      header: 'Protocol',
      cell: ({ row }: any) => (
        <Badge variant="outline">{row.getValue('protocol')}</Badge>
      ),
    },
    createSortableColumn('messagesProcessed', 'Messages'),
    {
      accessorKey: 'lastActivity',
      header: 'Last Activity',
      cell: ({ row }: any) => {
        const date = row.getValue('lastActivity') as Date;
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
        return <span className="text-sm">{diff < 60 ? `${diff}m ago` : `${Math.floor(diff / 60)}h ago`}</span>;
      },
    },
    {
      accessorKey: 'enabled',
      header: 'Enabled',
      cell: ({ row }: any) => (
        <Switch checked={row.getValue('enabled')} />
      ),
    },
    createActionsColumn((row: any) => [
      {
        label: row.original.status === 'active' ? 'Pause' : 'Start',
        onClick: () => {},
        icon: row.original.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />,
      },
      { label: 'Edit', onClick: () => {}, icon: <Edit className="h-4 w-4" /> },
      { label: 'Copy', onClick: () => {}, icon: <Copy className="h-4 w-4" /> },
      { label: 'Delete', onClick: () => {}, icon: <Trash2 className="h-4 w-4" />, variant: 'destructive' as const },
    ]),
  ];

  const filteredIntegrations = integrations.filter((integration) =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integration Center"
        description="Manage external integrations and data connectors"
        actions={[
          {
            label: 'Create Integration',
            onClick: () => setIsCreateOpen(true),
            icon: <Plus className="h-4 w-4 mr-2" />,
          },
        ]}
      />

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            <Plug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
            <p className="text-xs text-muted-foreground">Active connectors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {integrations.filter(i => i.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Running integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.reduce((sum, i) => sum + i.messagesProcessed, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Processed messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {integrations.filter(i => i.status === 'error').length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="integrations" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search integrations..."
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
              <CardTitle>Active Integrations</CardTitle>
              <CardDescription>Manage your external integrations and data flows</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={filteredIntegrations} searchKey="name" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {integrationTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      {template.icon}
                    </div>
                    <Badge variant="outline">{template.protocol}</Badge>
                  </div>
                  <CardTitle className="mt-4">{template.name}</CardTitle>
                  <CardDescription>{template.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <div className="space-y-2">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setIsCreateOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Integration
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Integration</DialogTitle>
            <DialogDescription>Configure a new integration connector</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template">Integration Type *</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select integration type" />
                </SelectTrigger>
                <SelectContent>
                  {integrationTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} - {template.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" placeholder="e.g., AWS IoT Production" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Integration description..." rows={3} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endpoint">Endpoint URL *</Label>
                <Input id="endpoint" placeholder="https://api.example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" placeholder="1883" type="number" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth">Authentication</Label>
              <Select defaultValue="basic">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                  <SelectItem value="token">Token</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="enabled">Enable Integration</Label>
                <p className="text-sm text-muted-foreground">Start processing messages immediately</p>
              </div>
              <Switch id="enabled" defaultChecked />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button>Create Integration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}