import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Circle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConnectedDevice {
  id: string;
  name: string;
  status: 'active' | 'offline' | 'warning';
}

interface RecentActivity {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
  time: string;
}

interface AssetHierarchy {
  id: string;
  name: string;
  devices?: Array<{
    id: string;
    name: string;
    status: 'active' | 'offline';
  }>;
}

export default function AssetDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data - in production, fetch from API using id
  const asset = {
    id: id || '1',
    name: 'Building A',
    type: 'Commercial Building',
    customer: 'TechCorp',
    status: 'active',
    createdAt: 'Jan 15, 2024',
    lastActivity: '2 minutes ago',
  };

  const connectedDevices: ConnectedDevice[] = [
    { id: '1', name: 'Temperature Sensor', status: 'active' },
    { id: '2', name: 'HVAC Controller', status: 'active' },
    { id: '3', name: 'Motion Sensor', status: 'offline' },
    { id: '4', name: 'Energy Meter', status: 'warning' },
  ];

  const recentActivity: RecentActivity[] = [
    { id: '1', type: 'success', message: 'Device added', time: '2h ago' },
    { id: '2', type: 'warning', message: 'Alarm triggered', time: '4h ago' },
    { id: '3', type: 'info', message: 'Configuration updated', time: '1d ago' },
  ];

  const assetHierarchy: AssetHierarchy[] = [
    {
      id: '1',
      name: 'Floor 1',
      devices: [
        { id: '1', name: 'Temperature Sensor', status: 'active' },
      ],
    },
    {
      id: '2',
      name: 'Floor 2',
      devices: [
        { id: '2', name: 'HVAC Controller', status: 'active' },
      ],
    },
    {
      id: '3',
      name: 'Basement',
      devices: [],
    },
  ];

  const activeDevicesCount = connectedDevices.filter(d => d.status === 'active').length;
  const offlineDevicesCount = connectedDevices.filter(d => d.status === 'offline').length;
  const warningDevicesCount = connectedDevices.filter(d => d.status === 'warning').length;

  const getActivityIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleEdit = () => {
    // Navigate to edit page or open edit dialog
    console.log('Edit asset:', asset.id);
  };

  const handleDelete = () => {
    // Show confirmation dialog and delete
    if (window.confirm(t('assets.details.deleteConfirm'))) {
      console.log('Delete asset:', asset.id);
      navigate('/assets');
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {asset.name}
              </h1>
              <Badge variant="success" className="gap-1.5">
                <Circle className="w-2 h-2 fill-current" />
                {t('assets.details.active')}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {asset.type} | {asset.customer}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* User Icons */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                A
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium">
                M
              </div>
            </div>
            
            {/* Action Buttons */}
            <Button
              variant="outline"
              onClick={handleEdit}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              {t('common.edit')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {t('common.delete')}
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-fit grid-cols-4">
            <TabsTrigger value="overview">{t('assets.details.overview')}</TabsTrigger>
            <TabsTrigger value="attributes">{t('assets.details.attributes')}</TabsTrigger>
            <TabsTrigger value="relations">{t('assets.details.relations')}</TabsTrigger>
            <TabsTrigger value="telemetry">{t('assets.details.telemetry')}</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Main Content - Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Asset Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('assets.details.assetInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('common.name')}: {asset.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('common.type')}: {asset.type}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('assets.details.customer')}: {asset.customer}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('assets.details.created')}: {asset.createdAt}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('assets.details.lastActivity')}: {asset.lastActivity}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Connected Devices Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('assets.details.connectedDevices')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-2">
                    {connectedDevices.length}
                  </div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    {t('assets.details.activeDevices')}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {offlineDevicesCount} {t('assets.details.offline')}, {warningDevicesCount} {t('assets.details.warning')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('assets.details.recentActivity')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getActivityIconColor(activity.type)}`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Asset Hierarchy Card - Full Width */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>{t('assets.details.assetHierarchy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {assetHierarchy.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                      >
                        {item.name}
                      </Button>
                      {item.devices && item.devices.length > 0 && (
                        <div className="flex flex-col gap-1 ml-2">
                          {item.devices.map((device) => (
                            <div key={device.id} className="flex items-center gap-2 text-sm">
                              <Circle className={`w-2 h-2 fill-current ${device.status === 'active' ? 'text-green-500' : 'text-gray-400'}`} />
                              <span className="text-gray-700 dark:text-gray-300">{device.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attributes Tab */}
        {activeTab === 'attributes' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('assets.details.attributes')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('assets.details.attributesComingSoon')}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Relations Tab */}
        {activeTab === 'relations' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('assets.details.relations')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('assets.details.relationsComingSoon')}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Telemetry Tab */}
        {activeTab === 'telemetry' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('assets.details.telemetry')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('assets.details.telemetryComingSoon')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

