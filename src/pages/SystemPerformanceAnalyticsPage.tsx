import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

import { PageHeader } from '@/components/common/PageHeader';

const responseTimeData = [
  { time: '20/8', value: 30 },
  { time: '21/8', value: 45 },
  { time: '22/8', value: 35 },
  { time: '23/8', value: 50 },
  { time: '24/8', value: 55 },
  { time: '25/8', value: 80 },
  { time: '26/8', value: 95 },
];

const resourceUtilizationData = [
  { month: 'Jan', cpu: 0, memory: 0, storage: 0 },
  { month: 'Feb', cpu: 10, memory: 15, storage: 5 },
  { month: 'Mar', cpu: 15, memory: 10, storage: 20 },
  { month: 'Apr', cpu: 20, memory: 25, storage: 25 },
  { month: 'May', cpu: 10, memory: 10, storage: 15 },
  { month: 'Jun', cpu: 25, memory: 30, storage: 35 },
  { month: 'Jul', cpu: 30, memory: 25, storage: 35 },
  { month: 'Aug', cpu: 25, memory: 25, storage: 30 },
  { month: 'Sep', cpu: 30, memory: 30, storage: 25 },
  { month: 'Oct', cpu: 15, memory: 25, storage: 25 },
  { month: 'Nov', cpu: 20, memory: 20, storage: 25 },
  { month: 'Dec', cpu: 25, memory: 30, storage: 35 },
];

const errorAnalysisData = [
  { name: 'Timeout', value: 80, color: '#4338ca' },
  { name: 'Auth', value: 60, color: '#c026d3' },
  { name: 'Sensor-001', value: 40, color: '#f97316' },
  { name: 'Sensor-001', value: 20, color: '#44403c' },
];

const healthStatus = [
  { name: 'Database Connection', status: 'online', color: 'bg-green-500' },
  { name: 'Message Queue', status: 'online', color: 'bg-purple-500' },
  { name: 'Cache Service', status: 'online', color: 'bg-blue-400' },
  { name: 'File Storage', status: 'online', color: 'bg-blue-400' },
];

const recentAlerts = [
  {
    title: 'High CPU usage detected',
    time: 'High CPU usage detected',
    color: 'text-red-500',
    dot: 'bg-red-500',
  },
  {
    title: 'Cache hit rate below 80%',
    time: 'Cache hit rate below 80%',
    color: 'text-green-500',
    dot: 'bg-green-500',
  },
  {
    title: 'Memory usage spike',
    time: 'Memory usage spike',
    color: 'text-purple-500',
    dot: 'bg-purple-500',
  },
  {
    title: 'Database backup completed',
    time: 'Database backup completed',
    color: 'text-blue-500',
    dot: 'bg-blue-500',
  },
  {
    title: 'Network latency increased',
    time: 'Cache hit rate below 80%',
    color: 'text-red-500',
    dot: 'bg-red-500',
  },
  {
    title: 'System maintenance started',
    time: 'Memory usage spike',
    color: 'text-purple-500',
    dot: 'bg-purple-500',
  },
  {
    title: 'All systems operational',
    time: 'Database backup completed',
    color: 'text-blue-500',
    dot: 'bg-blue-500',
  },
];

export default function SystemPerformanceAnalyticsPage() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between">
        {/* Header */}
        <PageHeader
          title={t('analytics.system.title')}
          description={t('analytics.system.subtitle')}
        />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Select
              className="w-40"
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className=" h-10 border-none rounded-md">
                <SelectValue placeholder="Time Range: Last 30 days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="primary">
              <span>Export Data</span>
            </Button>
          </div>
        </div>
      </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4    gap-6">
        {[
          {
            title: t('analytics.system.stats.totalData'),
            value: '2.8 TB',
            trend: '↑ 15% from last month',
            color: 'bg-primary',
          },
          {
            title: t('analytics.system.stats.avgDaily'),
            value: '95.2 GB',
            trend: '↑ 3% from yesterday',
            color: 'bg-secondary',
          },
          {
            title: t('analytics.system.stats.peakHour'),
            value: '14:00',
            trend: '127 GB peak',
            color: 'bg-success',
          },
          {
            title: t('analytics.system.stats.storageEfficiency'),
            value: '87.5%',
            trend: '↑ 2% efficiency',
          },
        ].map((kpi, idx) => (
          <Card
            key={idx}
            className={`${idx != 3 ? kpi.color + ' text-white' : 'text-black'}   shadow-none rounded-lg`}
          >
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold   dark:text-gray-300">
                {kpi.title}
              </h3>
              <p className="text-2xl font-semibold  dark:text-white mt-1">
                {kpi.value}
              </p>
              <p className="text-xs   mt-1">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trends */}
        <Card className=" ">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              {t('analytics.system.charts.responseTime')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={responseTimeData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c026d3" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#c026d3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={true}
                    horizontal={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-100 flex flex-col gap-1">
                            <span className="text-xs text-gray-400">Total</span>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-sm bg-[#c026d3]" />
                              <span className="text-sm font-medium">
                                2000 kW/h
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#c026d3"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    dot={{
                      r: 4,
                      fill: '#c026d3',
                      strokeWidth: 2,
                      stroke: '#fff',
                    }}
                    activeDot={{
                      r: 6,
                      fill: '#c026d3',
                      strokeWidth: 2,
                      stroke: '#fff',
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resource Utilization */}
        <Card className=" ">
          <CardHeader className="">
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              {t('analytics.system.charts.resourceUtilization')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={resourceUtilizationData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cpu"
                    stroke="#4338ca"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="memory"
                    stroke="#c026d3"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="storage"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Error Analysis */}
        <Card className=" ">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              {t('analytics.system.charts.errorAnalysis')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorAnalysisData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                    {errorAnalysisData.map((entry, index) => (
                      <Bar
                        key={`cell-${index}`}
                        dataKey="value"
                        fill={entry.color}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Health Status */}
        <Card className=" ">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              {t('analytics.system.status.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-2">
            {healthStatus.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-md"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className=" ">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              {t('analytics.system.alerts.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-3 space-y-3">
            {recentAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${alert.dot}`} />
                  <span className={`font-semibold  `}>{alert.title}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
