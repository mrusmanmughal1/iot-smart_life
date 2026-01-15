import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
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

// Helper function to get localized recent activity
const getRecentActivity = (t: TFunction) => [
  {
    id: '1',
    message: t('deviceAnalytics.activityMessages.deviceGeneratedData', {
      deviceName: 'Sensor-001',
      size: '2.3MB',
    }),
    time: t('analytics.timeAgo.minutes', { count: 2 }),
  },
  {
    id: '2',
    message: t('deviceAnalytics.activityMessages.dashboardConsumed', {
      dashboardName: 'Production Overview',
      size: '450MB',
    }),
    time: t('analytics.timeAgo.minutes', { count: 5 }),
  },
  {
    id: '3',
    message: t('deviceAnalytics.activityMessages.alertTriggered', {
      message: 'Temperature threshold exceeded',
    }),
    time: t('analytics.timeAgo.minutes', { count: 8 }),
  },
];

export default function DeviceAnalyticsPage() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('deviceAnalytics.title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('deviceAnalytics.subtitle')}
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange} className="w-40">
          <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder={t('deviceAnalytics.selectTimeRange')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">{t('deviceAnalytics.last24Hours')}</SelectItem>
            <SelectItem value="7d">{t('deviceAnalytics.last7Days')}</SelectItem>
            <SelectItem value="30d">{t('deviceAnalytics.last30Days')}</SelectItem>
            <SelectItem value="90d">{t('deviceAnalytics.last90Days')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Devices */}
        <Card className="bg-green-50 border-green-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('deviceAnalytics.totalDevices')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">247</div>
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>{t('deviceAnalytics.trendUpPercent', { percent: 12 })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Data Generated */}
        <Card className="bg-purple-50 border-purple-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('deviceAnalytics.dataGenerated')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">1.2TB</div>
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>{t('deviceAnalytics.trendUpPercent', { percent: 8 })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="bg-orange-50 border-orange-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('deviceAnalytics.activeAlerts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">23</div>
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>{t('deviceAnalytics.trendUpPercent', { percent: 5 })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card className="bg-violet-50 border-violet-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('deviceAnalytics.uptime')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">99.8%</div>
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>{t('deviceAnalytics.trendUpPercent', { percent: 0.2 })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Device Activity Trends */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              {t('deviceAnalytics.deviceActivityTrends')}
            </CardTitle>
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
                  labelFormatter={(value) => t('deviceAnalytics.tooltipDate', { value })}
                  formatter={(value: number) => [`${value} kW/h`, t('deviceAnalytics.tooltipTotal')]}
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
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              {t('deviceAnalytics.dataConsumptionByDashboard')}
            </CardTitle>
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
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">25°C</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('deviceAnalytics.celsius')}
                  </span>
                </div>
              </div>
              {/* Scale labels */}
              <div className="flex justify-between w-48 mt-4 text-xs text-gray-600 dark:text-gray-400">
                <span>05°C</span>
                <span>15°C</span>
                <span>25°C</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">
            {t('deviceAnalytics.recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getRecentActivity(t).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">{activity.message}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
