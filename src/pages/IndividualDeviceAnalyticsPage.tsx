import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, ChevronLeft, Activity, TrendingUp } from 'lucide-react';
import { useDevice } from '@/features/devices/hooks';

// Mock data for device activity over time
const activityData = [
  { time: '00:00', value: 120 },
  { time: '04:00', value: 150 },
  { time: '08:00', value: 180 },
  { time: '12:00', value: 200 },
  { time: '16:00', value: 175 },
  { time: '20:00', value: 160 },
  { time: '24:00', value: 140 },
];

// Mock data for data generation over time
const dataGenerationData = [
  { date: '20/8', generated: 2.3 },
  { date: '21/8', generated: 2.8 },
  { date: '22/8', generated: 2.1 },
  { date: '23/8', generated: 3.2 },
  { date: '24/8', generated: 2.7 },
  { date: '25/8', generated: 2.9 },
  { date: '26/8', generated: 3.1 },
];

// Helper function to get localized status distribution
const getStatusDistribution = (t: TFunction) => [
  { name: t('individualDeviceAnalytics.statusLabels.active'), value: 85, color: '#10B981' },
  { name: t('individualDeviceAnalytics.statusLabels.idle'), value: 10, color: '#F59E0B' },
  { name: t('individualDeviceAnalytics.statusLabels.error'), value: 5, color: '#EF4444' },
];

export default function IndividualDeviceAnalyticsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: deviceData } = useDevice(id || '');
  const device = deviceData?.data?.data;

  const [deviceType, setDeviceType] = useState('all');
  const [status, setStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');

  const deviceStatus =
    device?.status === 'online' || device?.status === 'idle'
      ? 'ACTIVE'
      : device?.status === 'error'
      ? 'ERROR'
      : 'INACTIVE';

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting device analytics data...');
  };

  return (
    <div className="space-y-6  ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/analytics/device-analytics')}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {device?.name || t('individualDeviceAnalytics.title')}
              </h1>
              <Badge
                variant={
                  deviceStatus === 'ACTIVE'
                    ? 'success'
                    : deviceStatus === 'ERROR'
                    ? 'destructive'
                    : 'secondary'
                }
                className="rounded-full px-3 py-1"
              >
                {deviceStatus}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('individualDeviceAnalytics.subtitle')}
            </p>
          </div>
        </div>
        <Button
          onClick={handleExport}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('individualDeviceAnalytics.exportData')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select
          value={deviceType}
          className="w-40"
          onValueChange={setDeviceType}
        >
          <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder={t('individualDeviceAnalytics.deviceType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('individualDeviceAnalytics.deviceTypeAll')}</SelectItem>
            <SelectItem value="gateway">{t('individualDeviceAnalytics.gateway')}</SelectItem>
            <SelectItem value="sensor">{t('individualDeviceAnalytics.sensor')}</SelectItem>
            <SelectItem value="controller">{t('individualDeviceAnalytics.controller')}</SelectItem>
            <SelectItem value="actuator">{t('individualDeviceAnalytics.actuator')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} className="w-40" onValueChange={setStatus}>
          <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder={t('individualDeviceAnalytics.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('individualDeviceAnalytics.statusAll')}</SelectItem>
            <SelectItem value="active">{t('individualDeviceAnalytics.active')}</SelectItem>
            <SelectItem value="idle">{t('individualDeviceAnalytics.idle')}</SelectItem>
            <SelectItem value="error">{t('individualDeviceAnalytics.error')}</SelectItem>
            <SelectItem value="offline">{t('individualDeviceAnalytics.offline')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} className="w-48" onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder={t('individualDeviceAnalytics.timeRange')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">{t('individualDeviceAnalytics.timeRange24Hours')}</SelectItem>
            <SelectItem value="7d">{t('individualDeviceAnalytics.timeRange7Days')}</SelectItem>
            <SelectItem value="30d">{t('individualDeviceAnalytics.timeRange30Days')}</SelectItem>
            <SelectItem value="90d">{t('individualDeviceAnalytics.timeRange90Days')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50 border-blue-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('individualDeviceAnalytics.dataGenerated')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">2.3MB</div>
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>{t('individualDeviceAnalytics.trendUpPercent', { percent: 12 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('individualDeviceAnalytics.uptime')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">99.8%</div>
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>{t('individualDeviceAnalytics.trendUpPercent', { percent: 0.2 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('individualDeviceAnalytics.lastActive')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">2 min</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('individualDeviceAnalytics.ago')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('individualDeviceAnalytics.alerts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">3</div>
            <div className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400 mt-1">
              <Activity className="h-4 w-4" />
              <span>{t('individualDeviceAnalytics.activeAlerts')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Device Activity Over Time */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              {t('individualDeviceAnalytics.deviceActivityOverTime')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.2}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Data Generation Trend */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              {t('individualDeviceAnalytics.dataGenerationTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataGenerationData}>
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
                  formatter={(value: number) => [`${value}MB`, t('individualDeviceAnalytics.generated')]}
                />
                <Bar dataKey="generated" radius={[8, 8, 0, 0]} fill="#EC4899" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution and Activity Table */}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Status Distribution */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              {t('individualDeviceAnalytics.statusDistribution')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex flex-col items-center justify-center h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getStatusDistribution(t)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {getStatusDistribution(t).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="mt-6 space-y-2 w-full">
                {getStatusDistribution(t).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Table */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              {t('individualDeviceAnalytics.recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="font-semibold dark:text-gray-300">
                    {t('individualDeviceAnalytics.tableHeaders.time')}
                  </TableHead>
                  <TableHead className="font-semibold dark:text-gray-300">
                    {t('individualDeviceAnalytics.tableHeaders.event')}
                  </TableHead>
                  <TableHead className="font-semibold dark:text-gray-300">
                    {t('individualDeviceAnalytics.tableHeaders.status')}
                  </TableHead>
                  <TableHead className="font-semibold dark:text-gray-300">
                    {t('individualDeviceAnalytics.tableHeaders.data')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="dark:border-gray-700">
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {t('analytics.timeAgo.minutes', { count: 2 })}
                  </TableCell>
                  <TableCell className="font-medium dark:text-white">
                    {t('individualDeviceAnalytics.events.dataTransmissionSuccessful')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" className="rounded-full">
                      {t('individualDeviceAnalytics.active')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">2.3MB</TableCell>
                </TableRow>
                <TableRow className="dark:border-gray-700">
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {t('analytics.timeAgo.minutes', { count: 15 })}
                  </TableCell>
                  <TableCell className="font-medium dark:text-white">
                    {t('individualDeviceAnalytics.events.telemetryDataReceived')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" className="rounded-full">
                      {t('individualDeviceAnalytics.active')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">1.8MB</TableCell>
                </TableRow>
                <TableRow className="dark:border-gray-700">
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {t('analytics.timeAgo.hours', { count: 1 })}
                  </TableCell>
                  <TableCell className="font-medium dark:text-white">
                    {t('individualDeviceAnalytics.events.alertThresholdExceeded')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="rounded-full">
                      {t('individualDeviceAnalytics.error')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">-</TableCell>
                </TableRow>
                <TableRow className="dark:border-gray-700">
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {t('analytics.timeAgo.hoursPlural', { count: 2 })}
                  </TableCell>
                  <TableCell className="font-medium dark:text-white">
                    {t('individualDeviceAnalytics.events.deviceReconnected')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" className="rounded-full">
                      {t('individualDeviceAnalytics.active')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">-</TableCell>
                </TableRow>
                <TableRow className="dark:border-gray-700">
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {t('analytics.timeAgo.hoursPlural', { count: 3 })}
                  </TableCell>
                  <TableCell className="font-medium dark:text-white">
                    {t('individualDeviceAnalytics.events.configurationUpdated')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full">
                      {t('individualDeviceAnalytics.idle')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
