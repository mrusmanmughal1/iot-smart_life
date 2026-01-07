import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { TrendingUp } from 'lucide-react';

// Mock data for device activity trends
const activityData = [
  { date: '20/8', value: 2000 },
  { date: '21/8', value: 100 },
  { date: '22/8', value: 1900 },
  { date: '23/8', value: 2400 },
  { date: '24/8', value: 2800 },
  { date: '25/8', value: 1100 },
  { date: '26/8', value: 2200 },
  { date: '20/8', value: 2000 },
  { date: '21/8', value: 1800 },
  { date: '22/8', value: 2900 },
  { date: '23/8', value: 400 },
  { date: '24/8', value: 1800 },
  { date: '25/8', value: 100 },
  { date: '26/8', value: 2200 },
];

// Mock data for recent activity
const recentActivity = [
  {
    id: '1',
    message: 'Device "Sensor-001" generated 2.3MB of data',
    time: '2 min ago',
  },
  {
    id: '2',
    message: 'Dashboard "Production Overview" consumed 450MB',
    time: '5 min ago',
  },
  {
    id: '3',
    message: 'Alert triggered: Temperature threshold exceeded',
    time: '8 min ago',
  },
];

export default function DeviceAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Device Analytics
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Overview of your IoT platform analytics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange} className="w-40">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Devices */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">247</div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>↑ 12% from last week</span>
            </div>
          </CardContent>
        </Card>

        {/* Data Generated */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Data Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">1.2TB</div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>↑ 8% from last week</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">23</div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>↑ 5% from last week</span>
            </div>
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card className="bg-violet-50 border-violet-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">99.8%</div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>↑ 0.2% from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Device Activity Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Device Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(value) => `Date: ${value}`}
                  formatter={(value: number) => [`${value} kW/h`, 'Total']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#EC4899"
                  fill="#EC4899"
                  fillOpacity={0.2}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#EC4899"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Data Consumption by Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>Data Consumption by Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[300px]">
              {/* Circular Gauge Visualization */}
              <div className="relative w-48 h-48">
                <svg
                  className="transform -rotate-90"
                  width="192"
                  height="192"
                  viewBox="0 0 192 192"
                >
                  {/* Background circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                  />
                  {/* Progress arc */}
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - 0.83)}`}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">25°C</span>
                  <span className="text-xs text-gray-500 mt-1">Celsius</span>
                </div>
              </div>
              {/* Scale labels */}
              <div className="flex justify-between w-48 mt-4 text-xs text-gray-600">
                <span>05°C</span>
                <span>15°C</span>
                <span>25°C</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <p className="text-sm text-gray-700">{activity.message}</p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
