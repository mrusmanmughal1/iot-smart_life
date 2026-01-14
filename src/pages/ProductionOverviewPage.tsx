import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for data consumption by device
const deviceConsumptionData = [
  { device: 'Gateway-002', value: 180, percentage: 40, color: '#3B82F6' },
  { device: 'Sensor-001', value: 135, percentage: 30, color: '#EC4899' },
  { device: 'Sensor-004', value: 81, percentage: 18, color: '#F97316' },
  { device: 'Motor-003', value: 54, percentage: 12, color: '#000000' },
  { device: 'Valve-007', value: 27, percentage: 6, color: '#EF4444' },
];
// Mock data for widget performance table
const widgetPerformanceData = [
  {
    name: 'Temperature Chart',
    loadTime: '1.2s',
    status: 'Good',
    statusColor: 'text-green-600',
    statusDot: 'bg-green-500',
  },
  {
    name: 'Pressure Gauge',
    loadTime: '0.8s',
    status: 'Good',
    statusColor: 'text-green-600',
    statusDot: 'bg-green-500',
  },
  {
    name: 'Motor Status',
    loadTime: '3.1s',
    status: 'Slow',
    statusColor: 'text-orange-600',
    statusDot: 'bg-orange-500',
  },
  {
    name: 'Flow Rate Graph',
    loadTime: '1.5s',
    status: 'Good',
    statusColor: 'text-green-600',
    statusDot: 'bg-green-500',
  },
  {
    name: 'Alarm Panel',
    loadTime: '4.2s',
    status: 'Poor',
    statusColor: 'text-red-600',
    statusDot: 'bg-red-500',
  },
];
// Mock data for recent activity
const recentActivity = [
  'Dashboard loaded by admin@company.com',
  'Widget refresh: Temperature Chart',
  'New device connected: Sensor-012',
  'Alert resolved: High pressure warning',
];

export default function ProductionOverviewPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log('Refreshing dashboard analytics...');
  };

  return (
    <div className="space-y-6 p-2  ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dashboard Analytics - Production Overview
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Detailed analytics for Production Overview dashboard
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[220px] bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder="Time Range: Last 7 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Time Range: Last 24 hours</SelectItem>
            <SelectItem value="7d">Time Range: Last 7 days</SelectItem>
            <SelectItem value="30d">Time Range: Last 30 days</SelectItem>
            <SelectItem value="90d">Time Range: Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Devices */}
        <Card className="bg-green-50 border-green-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              247
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>↑ 12% from last week</span>
            </div>
          </CardContent>
        </Card>

        {/* Data Generated */}
        <Card className="bg-purple-50 border-purple-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Data Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              1.2TB
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>↑ 18% from last week</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="bg-orange-50 border-orange-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              23
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>↑ 5% from last week</span>
            </div>
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card className="bg-purple-50 border-purple-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              99.8%
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>↑ 0.2% from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Data Consumption by Device */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Data Consumption by Device
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceConsumptionData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {item.device}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.value} MB ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className="h-4 rounded-full"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 dark:text-gray-400 py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    {activity}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Widget Performance Table */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Widget Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700">
                    <TableHead className="font-semibold dark:text-gray-300">
                      WIDGET NAME
                    </TableHead>
                    <TableHead className="font-semibold dark:text-gray-300">
                      LOAD TIME
                    </TableHead>
                    <TableHead className="font-semibold dark:text-gray-300">
                      STATUS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {widgetPerformanceData.map((widget, index) => (
                    <TableRow key={index} className="dark:border-gray-700">
                      <TableCell className="font-medium dark:text-white">
                        {widget.name}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {widget.loadTime}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${widget.statusDot}`}
                          />
                          <span
                            className={`font-medium ${widget.statusColor} dark:text-white`}
                          >
                            {widget.status}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Widget Performance Status Summary */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Widget Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Online: 10 devices
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Warning: 2 devices
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Offline: 0 devices
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Maintenance: 1 device
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Last Updated: 2 Minutes Ago • Auto-Refresh: Enabled (30s Interval)
        </div>
        <Button
          onClick={handleRefresh}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
