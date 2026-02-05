import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { ColumnDef, Row } from '@tanstack/react-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
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
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/common/DataTable/DataTable';
import { createActionsColumn } from '@/components/common/DataTable/columns';
import {
  Map,
  Building2,
  Layers,
  MapPin,
  Thermometer,
  Droplets,
  Zap,
  Wind,
  CheckCircle2,
  Edit,
  Copy,
  Trash2,
  Download,
  Upload,
  Eye,
  Maximize2,
  Grid3x3,
  Factory,
  Warehouse,
  Hospital,
  PlusSquare,
  FileInput,
  Plug,
  BarChart3,
} from 'lucide-react';
import { useFloorPlans } from '@/features/floorPlan/hooks';
import type { FloorPlan as ApiFloorPlan } from '@/services/api/floor-plans.api';
import { LoadingOverlay } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useTranslation } from 'react-i18next';
interface FloorPlan {
  id: string;
  name: string;
  building: string;
  floor: string;
  imageUrl: string;
  devices: number;
  assets: number;
  zones: number;
  dimensions: {
    width: number;
    height: number;
  };
  scale: string;
  createdAt: Date;
  lastModified: Date;
  category: string;
  status: 'active' | 'draft' | 'archived';
}
// Transform API FloorPlan to local FloorPlan format
const transformFloorPlan = (apiPlan: ApiFloorPlan): FloorPlan => {
  return {
    id: apiPlan.id,
    name: apiPlan.name,
    building: apiPlan.building || '',
    floor: apiPlan.floor || '',
    imageUrl: apiPlan.imageUrl || '',
    devices: apiPlan.devices?.length || 0,
    assets: 0, // API doesn't provide assets count, defaulting to 0
    zones: apiPlan.zones?.length || 0,
    dimensions: apiPlan.dimensions,
    scale: apiPlan.scale || '1:100',
    createdAt: new Date(apiPlan.createdAt),
    lastModified: new Date(apiPlan.updatedAt),
    category: apiPlan.category || 'Other',
    status: apiPlan.status || 'draft',
  };
};

interface DeviceMarker {
  id: string;
  name: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  status: 'online' | 'offline' | 'warning';
  value?: string;
  icon: React.ReactNode;
}

type FloorPlanRow = Row<FloorPlan>;

const deviceMarkers: DeviceMarker[] = [
  {
    id: 'd1',
    name: 'Temperature Sensor #1',
    type: 'Sensor',
    position: { x: 20, y: 30 },
    status: 'online',
    value: '23.5°C',
    icon: <Thermometer className="h-4 w-4" />,
  },
  {
    id: 'd2',
    name: 'Humidity Sensor #2',
    type: 'Sensor',
    position: { x: 45, y: 35 },
    status: 'online',
    value: '55%',
    icon: <Droplets className="h-4 w-4" />,
  },
  {
    id: 'd3',
    name: 'Energy Meter #1',
    type: 'Meter',
    position: { x: 70, y: 25 },
    status: 'warning',
    value: '4.2 kW',
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: 'd4',
    name: 'HVAC Unit #3',
    type: 'Actuator',
    position: { x: 35, y: 65 },
    status: 'online',
    value: 'ON',
    icon: <Wind className="h-4 w-4" />,
  },
  {
    id: 'd5',
    name: 'Air Quality Monitor',
    type: 'Sensor',
    position: { x: 60, y: 70 },
    status: 'offline',
    value: '-',
    icon: <Wind className="h-4 w-4" />,
  },
];

export default function FloorPlans() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FloorPlan | null>(null);
  const [activeTab, setActiveTab] = useState('plans');
  const [showDevices, setShowDevices] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const { data: floorPlansData, isLoading, isError } = useFloorPlans();
  const apiFloorPlans = floorPlansData?.data?.data?.data;

  // Transform API data to local FloorPlan format
  const floorPlans: FloorPlan[] | undefined =
    apiFloorPlans?.map(transformFloorPlan);

  if (isLoading) return <LoadingOverlay />;
  if (isError)
    return (
      <ErrorMessage
        title="Error loading floor plans"
        // error={errorFloorPlans}
        onRetry={() => window.location.reload()}
      />
    );
  const quickActions = [
    {
      label: t('floorplans.createNew'),
      title: t('floorplans.floorMap'),
      description: 'Start with asset selection',
      icon: <PlusSquare className="h-5 w-5 text-primary" />,
      onClick: () => navigate('/floor-plans/create'),
    },
    // {
    //   label: t('floorplans.importDWG'),
    //   title: 'Files',
    //   description: t('floorplans.uploadBuildingPlans'),
    //   icon: <FileInput className="h-5 w-5 text-primary" />,
    //   onClick: () => setIsCreateOpen(true),
    // },
    {
      label: t('floorplans.device'),
      title: t('floorplans.deviceManagement'),
      description: t('floorplans.manageDeviceAssociations'),
      icon: <Plug className="h-5 w-5 text-primary" />,
      onClick: () => setActiveTab('plans'),
    },
    {
      label: t('floorplans.analytics'),
      title: t('floorplans.dashboard'),
      description: t('floorplans.viewFloorMapInsights'),
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      onClick: () => setActiveTab('plans'),
    },
  ];

  const columns: ColumnDef<FloorPlan>[] = [
    {
      accessorKey: 'name',
      header: t('floorplans.name'),
      cell: ({ row }: { row: FloorPlanRow }) => (
        <div>
          <div className="font-medium">{row.getValue('name') as string}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.building} - {row.original.floor}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: t('floorplans.category'),
      cell: ({ row }: { row: FloorPlanRow }) => {
        const category = row.getValue('category') as string;
        const icons: Record<string, React.ReactNode> = {
          Industrial: <Factory className="h-4 w-4" />,
          Commercial: <Building2 className="h-4 w-4" />,
          Logistics: <Warehouse className="h-4 w-4" />,
          Healthcare: <Hospital className="h-4 w-4" />,
        };
        return (
          <div className="flex items-center gap-2">
            {icons[category]}
            <span>{category}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'devices',
      header: t('floorplans.devices'),
      cell: ({ row }: { row: FloorPlanRow }) => (
        <Badge variant="outline">
          {row.getValue('devices') as number} {t('floorplans.devices')}
        </Badge>
      ),
    },
    {
      accessorKey: 'zones',
      header: t('floorplans.zones'),
      cell: ({ row }: { row: FloorPlanRow }) => (
        <Badge variant="outline">{row.getValue('zones') as number} {t('floorplans.zones')}</Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: t('floorplans.status'),
      cell: ({ row }: { row: FloorPlanRow }) => {
        const status = row.getValue('status') as string;
        const colors = {
          active: 'bg-green-500',
          draft: 'bg-yellow-500',
          archived: 'bg-gray-500',
        };
        return (
          <Badge
            className={`${colors[status as keyof typeof colors]} text-white`}
          >
            {status}
          </Badge>
        );
      },
    },

    createActionsColumn((row: FloorPlanRow) => [
      {
        label: t('floorplans.view'),
        onClick: () => {
          setSelectedPlan(row.original);
          setIsViewerOpen(true);
        },
        icon: <Eye className="h-4 w-4" />,
      },
      { label: t('floorplans.edit'), onClick: () => { }, icon: <Edit className="h-4 w-4" /> },
      { label: t('floorplans.copy'), onClick: () => { }, icon: <Copy className="h-4 w-4" /> },
      {
        label: t('floorplans.export'),
        onClick: () => { },
        icon: <Download className="h-4 w-4" />,
      },
      {
        label: t('floorplans.delete'),
        onClick: () => { },
        icon: <Trash2 className="h-4 w-4" />,
        variant: 'destructive' as const,
      },
    ]) as ColumnDef<FloorPlan>,
  ];

  const filteredPlans = floorPlans?.filter(
    (plan) =>
      plan?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.building?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('floorplans.title')}
        description={t('floorplans.subtitle')}
        actions={[
          {
            label: t('floorplans.uploadFloorPlan'),
            onClick: () => setIsCreateOpen(true),
            icon: <Upload className="h-4 w-4 mr-2" />,
          },
        ]}
      />

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium   text-white">
              {t('floorplans.totalFloorPlans')}
            </CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{floorPlans?.length}</div>
            <p className="text-xs text-muted-foreground">{t('floorplans.facilityLayouts')}</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary text-white">
          <CardHeader className="flex flex-row  items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium   text-white">
              {t('floorplans.activeFloorPlans')}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4  " />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold  ">
              {floorPlans?.filter((p) => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">{t('floorplans.inUse')}</p>
          </CardContent>
        </Card>

        <Card className="bg-success text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              {t('floorplans.totalDevices')}
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {floorPlans?.reduce((sum, p) => sum + p.devices, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{t('floorplans.mappedDevices')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('floorplans.totalZones')}</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {floorPlans?.reduce((sum, p) => sum + p.zones, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{t('floorplans.definedAreas')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="plans" value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="plans" className="space-y-6">
          {/* Table */}
          <Card>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredPlans || []}
                searchKey="name"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {floorPlans?.map((plan) => (
              <Card
                key={plan.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  <Map className="h-16 w-16 text-muted-foreground" />
                  <Badge className="absolute top-2 right-2">
                    {plan?.devices} {t('floorplans.devices')}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    <Badge variant="outline">{plan.status}</Badge>
                  </div>
                  <CardDescription>
                    {plan.building} - {plan.floor}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t('floorplans.zones')}:</span>
                      <span className="ml-2 font-medium">{plan.zones}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('floorplans.scale')}:</span>
                      <span className="ml-2 font-medium">{plan.scale}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setIsViewerOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('floorplans.view')}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    {t('floorplans.edit')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {['Industrial', 'Commercial', 'Logistics', 'Healthcare'].map(
            (category) => {
              const plans = floorPlans?.filter((p) => p.category === category);
              if (!plans || plans.length === 0) return null;

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle>{category}</CardTitle>
                    <CardDescription>
                      {plans.length} {t('floorplans.floorPlans')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {plans?.map((plan) => (
                        <div
                          key={plan.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => {
                            setSelectedPlan(plan);
                            setIsViewerOpen(true);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Map className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{plan.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {plan.devices} {t('floorplans.devices')} • {plan.zones} {t('floorplans.zones')}
                              </p>
                            </div>
                          </div>
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            }
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900">{t('floorplans.quickActions')}</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="group text-left  shadow rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-primary font-semibold">
                {action.icon}
                <span>{action.label}</span>
              </div>
              <div className="mt-2 text-sm text-gray-900 font-medium">
                {action.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {action.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Create/Upload Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('floorplans.uploadFloorPlan')}</DialogTitle>
            <DialogDescription>
              {t('floorplans.uploadFloorPlanDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">{t('floorplans.floorPlanName')} <span className="text-red-500">*</span></Label>
              <Input
                id="plan-name"
                placeholder={t('floorplans.floorPlanNamePlaceholder')}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="building">{t('floorplans.building')} <span className="text-red-500">*</span></Label>
                <Input
                  id="building"
                  placeholder={t('floorplans.buildingPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">{t('floorplans.floor')} <span className="text-red-500">*</span></Label>
                <Input id="floor" placeholder={t('floorplans.floorPlaceholder')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t('floorplans.category')} <span className="text-red-500">*</span></Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('floorplans.categoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="industrial">{t('floorplans.industrial')}</SelectItem>
                  <SelectItem value="commercial">{t('floorplans.commercial')}</SelectItem>
                  <SelectItem value="residential">{t('floorplans.residential')}</SelectItem>
                  <SelectItem value="logistics">{t('floorplans.logistics')}</SelectItem>
                  <SelectItem value="healthcare">{t('floorplans.healthcare')}</SelectItem>
                  <SelectItem value="education">{t('floorplans.education')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">{t('floorplans.floorPlanImage')} <span className="text-red-500">*</span></Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 cursor-pointer transition-colors">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  {t('floorplans.clickToUploadOrDragAndDrop')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('floorplans.pngJpgSvgUpTo10Mb')}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">{t('floorplans.width')} (meters)</Label>
                <Input id="width" type="number" placeholder="100" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">{t('floorplans.height')} (meters)</Label>
                <Input id="height" type="number" placeholder="80" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scale">{t('floorplans.scale')}</Label>
                <Input id="scale" placeholder="1:100" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('floorplans.description')}</Label>
              <Textarea
                id="description"
                placeholder={t('floorplans.floorPlanDescriptionPlaceholder')}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              {t('floorplans.cancel')}
            </Button>
            <Button>{t('floorplans.uploadFloorPlan')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floor Plan Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{selectedPlan?.name}</DialogTitle>
                <DialogDescription>
                  {selectedPlan?.building} - {selectedPlan?.floor}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedPlan?.devices} {t('floorplans.devices')} {t('floorplans.zones')}</Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-devices"
                    checked={showDevices}
                    onCheckedChange={setShowDevices}
                  />
                  <Label htmlFor="show-devices" className="cursor-pointer">
                    {t('floorplans.showDevices')}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-zones"
                    checked={showZones}
                    onCheckedChange={setShowZones}
                  />
                  <Label htmlFor="show-zones" className="cursor-pointer">
                    {t('floorplans.showZones')}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-heatmap"
                    checked={showHeatmap}
                    onCheckedChange={setShowHeatmap}
                  />
                  <Label htmlFor="show-heatmap" className="cursor-pointer">
                    {t('floorplans.heatMap')}
                  </Label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Grid3x3 className="h-4 w-4 mr-2" />
                  {t('floorplans.grid')}
                </Button>
                <Button variant="outline" size="sm">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  {t('floorplans.fullscreen')}
                </Button>
              </div>
            </div>

            {/* Floor Plan Canvas */}
            <div
              className="relative border rounded-lg overflow-hidden bg-muted/20"
              style={{ height: '500px' }}
            >
              {/* Background Grid */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Floor Plan Image Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Map className="h-32 w-32 text-muted-foreground opacity-50" />
              </div>

              {/* Device Markers */}
              {showDevices &&
                deviceMarkers?.map((device) => (
                  <div
                    key={device.id}
                    className="absolute group cursor-pointer"
                    style={{
                      left: `${device.position.x}%`,
                      top: `${device.position.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Device Pin */}
                    <div
                      className={`
                    p-2 rounded-full shadow-lg transition-all
                    ${device.status === 'online' ? 'bg-green-500' : ''}
                    ${device.status === 'offline' ? 'bg-gray-500' : ''}
                    ${device.status === 'warning' ? 'bg-yellow-500' : ''}
                    text-white hover:scale-110
                  `}
                    >
                      {device.icon}
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-popover text-popover-foreground border rounded-lg shadow-lg p-3 whitespace-nowrap">
                        <p className="font-semibold text-sm">{device.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {device.type}
                        </p>
                        {device.value && (
                          <p className="text-sm font-medium mt-1">
                            {device.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              {/* Zones */}
              {showZones && (
                <>
                  <div
                    className="absolute border-2 border-blue-500 border-dashed bg-blue-500/10 rounded-lg"
                    style={{
                      left: '10%',
                      top: '15%',
                      width: '35%',
                      height: '40%',
                    }}
                  >
                    <div className="absolute -top-6 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      {t('floorplans.zoneA')} - {t('floorplans.production')}
                    </div>
                  </div>
                  <div
                    className="absolute border-2 border-purple-500 border-dashed bg-purple-500/10 rounded-lg"
                    style={{
                      left: '55%',
                      top: '20%',
                      width: '30%',
                      height: '35%',
                    }}
                  >
                    <div className="absolute -top-6 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                      {t('floorplans.zoneB')} - {t('floorplans.storage')}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Device Legend */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm">{t('floorplans.online')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm">{t('floorplans.warning')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-500" />
                <span className="text-sm">{t('floorplans.offline')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                <span className="text-sm">{t('floorplans.sensor')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">{t('floorplans.meter')}</span>
              </div>
            </div>

            {/* Plan Info */}
            <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">{t('floorplans.dimensions')}</p>
                <p className="font-semibold">
                  {selectedPlan?.dimensions.width}m ×{' '}
                  {selectedPlan?.dimensions.height}m
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('floorplans.scale')}</p>
                <p className="font-semibold">{selectedPlan?.scale}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('floorplans.lastModified')}</p>
                <p className="font-semibold">
                  {selectedPlan?.lastModified.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewerOpen(false)}>
              {t('floorplans.close')}
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t('floorplans.export')}
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              {t('floorplans.editPlan')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
