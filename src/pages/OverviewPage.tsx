// src/pages/OverviewPage.tsx - UPDATED WITH WEBSOCKET
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Building2,
  Sprout,
  Building,
  Car,
  Home,
  Factory,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PageHeader } from '@/components/common/PageHeader';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useQuery } from '@tanstack/react-query';
import { devicesApi } from '@/services/api/devices.api';
import { formatRelativeTime } from '@/utils/formatters/dateFormatter';

// Solution Categories
const solutions = [
  { name: 'Smart City', icon: Building2, active: true, color: 'from-pink-500 to-purple-600' },
  { name: 'Smart Agriculture', icon: Sprout, active: false, color: 'from-green-400 to-lime-500' },
  { name: 'Smart Building', icon: Building, active: false, color: 'from-blue-400 to-blue-600' },
  { name: 'Smart Transportation', icon: Car, active: false, color: 'from-amber-400 to-orange-500' },
  { name: 'Smart Home', icon: Home, active: false, color: 'from-indigo-400 to-indigo-600' },
  { name: 'Smart Factory', icon: Factory, active: false, color: 'from-gray-400 to-gray-600' },
];

// Chart Data
const activeSolutionsData = [
  { name: 'Jan', value: 2 },
  { name: 'Feb', value: 3 },
  { name: 'Mar', value: 2 },
  { name: 'Apr', value: 4 },
  { name: 'May', value: 3 },
];

const COLORS = ['#8B5CF6', '#E5E7EB'];

interface DeviceStats {
  total: number;
  online: number;
  offline: number;
}

interface RealtimeActivity {
  id: string;
  deviceId: string;
  deviceName: string;
  action: string;
  timestamp: string;
}

export const OverviewPage: React.FC = () => {
  const [deviceStats, setDeviceStats] = useState<DeviceStats>({
    total: 12,
    online: 8,
    offline: 4,
  });
  
  const [realtimeActivities, setRealtimeActivities] = useState<RealtimeActivity[]>([]);
  const [usage, setUsage] = useState(20);

  // Fetch initial devices data
  const { data: devicesData, isLoading } = useQuery({
    queryKey: ['devices-overview'],
    queryFn: () => devicesApi.getAll({ limit: 100 }),
  });

  // Real-time device status updates via WebSocket
  useWebSocket<{ deviceId: string; status: 'online' | 'offline'; deviceName: string }>(
    'device:status',
    (data) => {
      console.log('Device status update:', data);
      
      // Update stats
      setDeviceStats((prev) => {
        if (data.status === 'online') {
          return {
            ...prev,
            online: prev.online + 1,
            offline: Math.max(0, prev.offline - 1),
          };
        } else {
          return {
            ...prev,
            online: Math.max(0, prev.online - 1),
            offline: prev.offline + 1,
          };
        }
      });

      // Add to activity feed
      setRealtimeActivities((prev) => [
        {
          id: Date.now().toString(),
          deviceId: data.deviceId,
          deviceName: data.deviceName,
          action: `Device went ${data.status}`,
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 4), // Keep only last 5 activities
      ]);
    }
  );

  // Real-time telemetry updates
  useWebSocket<{ deviceId: string; temperature: number; humidity: number }>(
    'device:telemetry',
    (data) => {
      console.log('Telemetry update:', data);
      
      // Add to activity feed
      setRealtimeActivities((prev) => [
        {
          id: Date.now().toString(),
          deviceId: data.deviceId,
          deviceName: `Device ${data.deviceId}`,
          action: `Temperature: ${data.temperature}°C, Humidity: ${data.humidity}%`,
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 4),
      ]);
    }
  );

  // Update stats from initial data
  useEffect(() => {
    if (devicesData?.data) {
      const devices = devicesData.data.data;
      setDeviceStats({
        total: devices.length,
        online: devices.filter((d: any) => d.status === 'online').length,
        offline: devices.filter((d: any) => d.status === 'offline').length,
      });
    }
  }, [devicesData]);

  // Calculate usage data
  const usageData = [
    { name: 'Used', value: usage },
    { name: 'Remaining', value: 100 - usage },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        <PageHeader title="Overview" description="Real-time monitoring of your IoT platform" />

        {/* Real-time Status Indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="dark:text-gray-300">Live Updates</span>
          </div>
          <span className="text-xs dark:text-gray-400">
            Last update: {realtimeActivities[0] ? formatRelativeTime(realtimeActivities[0].timestamp) : 'Waiting...'}
          </span>
        </div>

        {/* Solution Category Carousel */}
        <div className="relative">
          <div className="flex items-center gap-8 m-8 overflow-x-auto no-scrollbar pb-4">
            <button className="hidden sm:flex absolute left-0 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700">
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-14 m-4 sm:px-8 w-full">
              {solutions.map((solution) => (
                <Card
                  key={solution.name}
                  className={`min-w-[140px] sm:min-w-[160px] md:min-w-[180px] flex-shrink-0 cursor-pointer transition-all hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 ${
                    solution.active ? 'ring-2 ring-purple-500' : 'ring-1 ring-gray-200 dark:ring-gray-700'
                  }`}
                >
                  <CardContent className="p-4 text-center flex flex-col items-center justify-center">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 mb-3 rounded-xl flex items-center justify-center bg-gradient-to-br ${solution.color}`}
                    >
                      <solution.icon className="text-white" size={28} />
                    </div>
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                      {solution.name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <button className="hidden sm:flex absolute right-0 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Top Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Active Solutions */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Active Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">3 Active</p>
                  <Button variant="link" className="p-0 h-auto text-purple-600 dark:text-purple-400 text-xs mt-1">
                    View All
                  </Button>
                </div>
                <div className="h-16 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeSolutionsData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connected Devices - Real-time */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                Connected Devices
                <Activity className="w-4 h-4 text-green-500 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {deviceStats.total} Total
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-500 font-medium">
                    ● {deviceStats.online} Online
                  </span>
                  <span className="text-red-500 font-medium">
                    ● {deviceStats.offline} Offline
                  </span>
                </div>
              </div>
              <Button className="mt-3 bg-[#C36BA8] hover:bg-blue-600 text-white text-xs h-8">
                Add New Device
              </Button>
            </CardContent>
          </Card>

          {/* Usage */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative flex items-center justify-center">
                <ResponsiveContainer width={90} height={90}>
                  <PieChart>
                    <Pie
                      data={usageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={40}
                      dataKey="value"
                    >
                      {usageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <span className="absolute text-lg font-semibold text-gray-900 dark:text-white">
                  {usage}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">10 Users</p>
              <Button className="mt-3 bg-[#483C8E] hover:bg-purple-600 text-white text-xs h-8">
                Manage Users
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Activity Feed */}
        {realtimeActivities.length > 0 && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500 animate-pulse" />
                Real-time Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {realtimeActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 animate-fade-in"
                  >
                    <div>
                      <p className="text-sm font-medium dark:text-white">{activity.deviceName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{activity.action}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rest of your existing cards... */}
        {/* Secondary Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Pending Tasks */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { task: 'Add Gateway', color: 'bg-green-500', label: 'New' },
                { task: 'Configure Alert', color: 'bg-orange-500', label: 'Medium' },
                { task: 'Update Firmware', color: 'bg-purple-500', label: 'Low' },
              ].map((t) => (
                <div
                  key={t.task}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.task}</span>
                  <span className={`px-2 py-1 text-xs text-white rounded ${t.color}`}>
                    {t.label}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Billing Status */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Billing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next billing: May 15, 2025</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current plan: Smart City Trial</p>
            </CardContent>
          </Card>

          {/* Usage Summary */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Usage Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">API Calls</span>
                <span className="font-semibold dark:text-white">12/30</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Dashboards</span>
                <span className="font-semibold dark:text-white">5/10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Assets</span>
                <span className="font-semibold dark:text-white">1/10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Floor Maps</span>
                <span className="font-semibold dark:text-white">2/10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Automations</span>
                <span className="font-semibold dark:text-white">6/10</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recently Accessed Dashboards */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recently Accessed Dashboards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              {
                title: 'Dashboard Preview',
                subtitle: 'Smart Building Overview',
                gradient: 'from-pink-500 to-[#C36BA8] text-white',
              },
              {
                title: 'Dashboard Preview',
                subtitle: 'Smart Building Metrics',
                gradient: 'from-gray-100 to-[#C5C5C5] text-gray-900 dark:from-gray-700 dark:to-gray-600 dark:text-white',
              },
              {
                title: 'Dashboard Preview',
                subtitle: 'Smart Home Control',
                gradient: 'from-[#483C8E] to-[#483C8E] text-white',
              },
            ].map((d, i) => (
              <Card
                key={i}
                className={`cursor-pointer bg-gradient-to-br ${d.gradient} hover:shadow-lg transition border-0`}
              >
                <CardContent className="p-6">
                  <p className="text-lg font-semibold mb-2">{d.title}</p>
                  <p className="text-sm">{d.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};