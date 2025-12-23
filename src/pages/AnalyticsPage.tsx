import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Bell,
  ArrowLeft,
} from 'lucide-react';

// Mock data for the timeline chart
const timelineData = [
  { time: '00:00', online: 1, offline: 0 },
  { time: '04:00', online: 2, offline: 0 },
  { time: '08:00', online: 3, offline: 1 },
  { time: '12:00', online: 4, offline: 1 },
  { time: '16:00', online: 3, offline: 2 },
  { time: '20:00', online: 5, offline: 1 },
  { time: '24:00', online: 4, offline: 1 },
];

interface DeviceEvent {
  id: string;
  deviceId: string;
  event: string;
  time: string;
  location: string;
  color: string;
  dotColor: string;
}

const deviceEvents: DeviceEvent[] = [
  {
    id: '1',
    deviceId: 'GW-01',
    event: 'Connected',
    time: '5 min ago',
    location: 'Room 101',
    color: 'bg-pink-100',
    dotColor: 'bg-red-500',
  },
  {
    id: '2',
    deviceId: 'S-15',
    event: 'Disconnected',
    time: '1 hour ago',
    location: 'Kitchen',
    color: 'bg-purple-100',
    dotColor: 'bg-blue-500',
  },
  {
    id: '3',
    deviceId: 'S-08',
    event: 'Low Battery Warning',
    time: '2 hours ago',
    location: 'Reception',
    color: 'bg-orange-100',
    dotColor: 'bg-red-500',
  },
  {
    id: '4',
    deviceId: 'S-12',
    event: 'Data transmission successful',
    time: '3 hours ago',
    location: 'Office 102',
    color: 'bg-blue-100',
    dotColor: 'bg-blue-500',
  },
  {
    id: '5',
    deviceId: 'S-13',
    event: 'Low Battery Warning',
    time: '2 hours ago',
    location: 'Reception',
    color: 'bg-orange-100',
    dotColor: 'bg-red-500',
  },
];

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>('all-floors');

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log('Refreshing data...');
  };

  const handleExport3D = () => {
    // TODO: Implement export 3D functionality
    console.log('Exporting 3D...');
  };

  const handleSetAlerts = () => {
    // TODO: Navigate to alerts settings
    console.log('Setting alerts...');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Device Analytics and Monitoring - Building AGW-01"
        actions={[
          {
            label: 'Report Templates',
            onClick: () => navigate('/report-templates'),
          },
          {
            label: 'Back',
            onClick: () => navigate('/floor-plans'),
          },
        ]}
      />

      {/* Filters */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Filters:</span>
        <div className="flex gap-2">
          {[
            { id: 'all-floors', label: 'All Floors' },
            { id: 'all-rooms', label: 'All Rooms' },
            { id: 'last-7-days', label: 'Last 7 Days' },
          ].map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className={
                selectedFilter === filter.id
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-500 border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">24</div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>↑ 2 from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Offline Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">3</div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingDown className="h-4 w-4" />
              <span>↓ 1 from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">5</div>
            <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>↑ 2 from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Data Points Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">1,247</div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>↑ 15% from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Device Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Device Status Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="time"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                />
                <Tooltip />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="online"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Online"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="offline"
                  stroke="#ec4899"
                  strokeWidth={2}
                  name="Offline"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Device Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Device Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {deviceEvents.map((event) => (
                <div
                  key={event.id}
                  className={`${event.color} rounded-lg p-3 border border-gray-200 shadow-sm`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`${event.dotColor} w-2 h-2 rounded-full mt-2 flex-shrink-0`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-gray-900">
                          {event.deviceId}
                        </span>
                        <span className="text-xs text-gray-600">
                          {event.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {event.event}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Performance Metrics</p>
              <p className="text-2xl font-bold text-gray-900">2.3ms</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Network Uptime</p>
              <p className="text-2xl font-bold text-gray-900">99.8%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Data Loss Rate</p>
              <p className="text-2xl font-bold text-green-600">0.02%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Signal Strength Avg
              </p>
              <p className="text-2xl font-bold text-green-600">-65 dBm</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Battery Health Average
              </p>
              <p className="text-2xl font-bold text-orange-600">78%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/floor-plans')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={handleExport3D}>
            <Download className="mr-2 h-4 w-4" />
            Export 3D
          </Button>
          <Button onClick={handleSetAlerts} className="bg-primary text-white">
            <Bell className="mr-2 h-4 w-4" />
            Set Alerts
          </Button>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
