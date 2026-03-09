import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plug,
  Plus,
  CheckCircle2,
  Play,
  Pause,
  Trash2,
  Edit,
  Cloud,
  Webhook,
  Mail,
  Zap,
  Activity,
  Radio,
  MoreVertical,
} from 'lucide-react';
import {
  useIntegrations,
  useIntegrationStats,
  useToggleIntegration,
  useDeleteIntegration,
} from '@/features/integrations/Hooks';
import { LoadingOverlay } from '@/components/common/LoadingSpinner';
import { Pagination } from '@/components/common/Pagination/Pagination';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
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

const integrationTemplates = [
  {
    id: 'aws-iot',
    name: 'AWS IoT Core',
    category: 'Cloud Platform',
    icon: <Cloud className="h-8 w-8" />,
    description: 'Connect securely to AWS IoT Core',
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
];

export default function Integrations() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: integrationsResponse, isLoading: integrationsLoading } =
    useIntegrations({
      page: currentPage,
      limit: itemsPerPage,
    });
  const { data: stats, isLoading: statsLoading } = useIntegrationStats();

  const { mutate: toggleStatus } = useToggleIntegration();
  const deleteMutation = useDeleteIntegration();

  const handleStatusToggle = async (id: string) => {
    try {
      await toggleStatus(id);
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAction = async (action: string, id: string) => {
    if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete this integration?')) {
        try {
          await deleteMutation.mutateAsync(id);
          toast.success('Integration deleted');
        } catch (error) {
          toast.error('Failed to delete integration');
        }
      }
    } else if (action === 'view') {
      navigate(`/integrations/${id}`);
    }
  };

  const paginationInfo = useMemo(() => {
    return {
      currentPage: integrationsResponse?.page || 1,
      totalPages: integrationsResponse?.totalPages || 0,
      totalItems: integrationsResponse?.total || 0,
      itemsPerPage: integrationsResponse?.limit || 10,
    };
  }, [integrationsResponse]);

  const totalIntegrations = stats?.total || 0;
  const activeIntegrations = stats?.active || 0;
  const inactiveIntegrations = stats?.inactive || 0;
  const errorIntegrations = stats?.error || 0;

  if (integrationsLoading || statsLoading) return <LoadingOverlay />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integration Center"
        description="Manage external integrations and data connectors"
        actions={[
          {
            label: t('integrations.add'),
            onClick: () => navigate('/integrations/add-integration'),
            icon: <Plus className="h-4 w-4 mr-2" />,
          },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Integrations
            </CardTitle>
            <Plug className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIntegrations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {activeIntegrations}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <Activity className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveIntegrations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <Zap className="h-6 w-6 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {errorIntegrations}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="integrations" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Integrations</CardTitle>
              <CardDescription>
                Manage your external integrations and data flows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary text-white">
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrationsResponse?.data?.map((integration: any) => (
                    <TableRow key={integration.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Plug className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {integration.name}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                              {integration.description || 'No description'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {integration.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            integration.status === 'active'
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-red-500 hover:bg-red-600'
                          } text-white`}
                        >
                          {integration.status === 'active'
                            ? 'Active'
                            : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono text-muted-foreground">
                          {integration.config?.protocol || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {integration.updatedAt
                            ? new Date(integration.updatedAt).toLocaleString()
                            : 'Never'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
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
                              onClick={() =>
                                handleAction('view', integration.id)
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusToggle(integration.id)}
                            >
                              {integration.enabled ? (
                                <>
                                  <Pause className="mr-2 h-4 w-4" />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  Enable
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={() =>
                                handleAction('delete', integration.id)
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!integrationsResponse?.data ||
                    integrationsResponse?.data?.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No integrations found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Pagination
                  currentPage={paginationInfo.currentPage}
                  totalPages={paginationInfo.totalPages}
                  totalItems={paginationInfo.totalItems}
                  itemsPerPage={paginationInfo.itemsPerPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {integrationTemplates.map((template) => (
              <Card
                key={template.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
                      {template.icon}
                    </div>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <CardTitle className="mt-4">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Key Features:</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {template.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 border-t p-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      navigate('/integrations/add-integration');
                    }}
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>
                Review integration health and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p>Log monitoring will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
