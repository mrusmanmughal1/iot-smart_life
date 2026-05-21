import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import DashboardNavigation from '@/components/ui/DashboardNavigation';

const metricsTrendsData = [
  { month: 'JAN', co2: 0, temp: 0, humidity: 0 },
  { month: 'FEB', co2: 12, temp: 8, humidity: 5 },
  { month: 'MAR', co2: 18, temp: 15, humidity: 10 },
  { month: 'APR', co2: 15, temp: 18, humidity: 20 },
  { month: 'MAY', co2: 25, temp: 12, humidity: 20 },
  { month: 'JUN', co2: 28, temp: 25, humidity: 15 },
  { month: 'JUL', co2: 32, temp: 30, humidity: 20 },
  { month: 'AUG', co2: 28, temp: 28, humidity: 20 },
  { month: 'SEP', co2: 30, temp: 32, humidity: 5 },
  { month: 'OCT', co2: 15, temp: 20, humidity: 0 },
  { month: 'NOV', co2: 15, temp: 15, humidity: 10 },
  { month: 'DEC', co2: 25, temp: 25, humidity: 10 },
];

const dashboardTableData = [
  {
    name: 'Building A - Main Office',
    co2: '2.4 kg',
    temp: '24.5°C',
    humidity: '68%',
    energy: '2 min ago',
    updated: '99.8%',
    status: 'ACTIVE',
    statusColor: 'text-green-500',
    dotColor: 'bg-green-500',
  },
  {
    name: 'Warehouse B',
    co2: '3.1 kg',
    temp: '24.5°C',
    humidity: '1 day ago',
    energy: '5 min ago',
    updated: '99.2%',
    status: 'Processing',
    statusColor: 'text-blue-500',
    dotColor: 'bg-blue-500',
  },
  {
    name: 'Retail Store C',
    co2: '2.4 kg',
    temp: '24.5°C',
    humidity: '3 days ago',
    energy: '2 hours ago',
    updated: '87.3%',
    status: 'ERROR',
    statusColor: 'text-purple-500',
    dotColor: 'bg-purple-500',
  },
];

const dataConsumptionTrends = [
  { date: '20/8', value: 1200 },
  { date: '21/8', value: 1380 },
  { date: '22/8', value: 1440 },
  { date: '23/8', value: 1580 },
  { date: '24/8', value: 1710 },
  { date: '25/8', value: 1960 },
  { date: '26/8', value: 2100 },
];

const performanceMetrics = [
  {
    label: 'Average Load Time',
    value: 78,
    text: '2.1s',
    color: 'bg-primary',
  },
  {
    label: 'Average Views/Day',
    value: 85,
    text: '2.1s',
    color: 'bg-secondary',
  },
  {
    label: 'Data Efficiency',
    value: 85,
    text: '85%',
    color: 'bg-black',
  },
  {
    label: 'Error Rate',
    value: 12,
    text: '1.2%',
    color: 'bg-[#f97316]',
  },
];

export default function DashboardsAnalyticsPage() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('7d');
  const [sortBy, setSortBy] = useState('CO2');

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title={t('analytics.dashboard.title')}
        description="Real-time analytics for your IoT devices."
        actions={[
          {
            label: 'Export Data',
            onClick: () => { },
          },
        ]}
      />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="bg-gray-100 border-none text-gray-700 h-10 px-4"
            >
              Data Consumption
            </Button>
            <div className="flex gap-1  items-center">
              {' '}
              <span>Time:</span>{' '}
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[160px] h-10 bg-gray-100 border-none rounded-md">
                  <SelectValue placeholder="Time Range: 7 days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Time Range: 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>{' '}
            </div>
            <div className="flex items-center gap-2 ">
              {' '}
              <span>Sort By:</span>{' '}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] h-10 bg-gray-100 border-none rounded-md">
                  <SelectValue placeholder="CO2" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CO2">CO2</SelectItem>
                  <SelectItem value="Temp">Temp</SelectItem>
                  <SelectItem value="Humidity">Humidity</SelectItem>
                </SelectContent>
              </Select>{' '}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className=" shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <Table>
            <TableHeader className="">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-white font-medium h-12">
                  {t('analytics.dashboard.table.dashboardName')}
                </TableHead>
                <TableHead className="text-white font-medium h-12">
                  {t('analytics.dashboard.table.co2Emissions')}
                </TableHead>
                <TableHead className="text-white font-medium h-12">
                  {t('analytics.dashboard.table.temperature')}
                </TableHead>
                <TableHead className="text-white font-medium h-12">
                  {t('analytics.dashboard.table.humidity')}
                </TableHead>
                <TableHead className="text-white font-medium h-12 ">
                  {t('analytics.dashboard.table.energyUsage')}
                </TableHead>
                <TableHead className="text-white font-medium h-12">
                  {t('analytics.dashboard.table.lastUpdated')}
                </TableHead>
                <TableHead className="text-white font-medium h-12">
                  {t('analytics.dashboard.table.status')}
                </TableHead>
                <TableHead className="text-white font-medium h-12 text-right">
                  {t('analytics.dashboard.table.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardTableData.map((row, index) => (
                <TableRow
                  key={index}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 h-16"
                >
                  <TableCell className="text-sm text-gray-600">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-800">
                    {row.co2}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-800">
                    {row.temp}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.humidity}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.energy}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.updated}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${row.dotColor}`}
                      />
                      <span
                        className={`font-semibold text-[10px] uppercase ${row.statusColor}`}
                      >
                        {row.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-8 text-[10px]"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts and Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <Card className="shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {t('analytics.dashboard.charts.metricsTrends')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricsTrendsData}>
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
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="rect"
                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="co2"
                    name="CO2 Emissions"
                    stroke="#c026d3"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    name="Temperature"
                    stroke="#4338ca"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    name="Humidity"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Impact Summary */}
        <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {t('analytics.dashboard.charts.impactSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">
                  {t('analytics.dashboard.charts.totalCo2')}
                </p>
                <p className="text-3xl font-bold text-red-500">8.4 kg</p>
                <p className="text-xs text-gray-500">↓ 12% from last week</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">
                  {t('analytics.dashboard.charts.carbonFootprint')}
                </p>
                <p className="text-3xl font-bold text-[#4338ca]">421 kg</p>
                <p className="text-xs text-gray-500">↓ 8% from last week</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">
                  {t('analytics.dashboard.charts.energyConsumption')}
                </p>
                <p className="text-3xl font-bold text-red-500">854 kWh</p>
                <p className="text-xs text-gray-500">↑ 5% from last week</p>
                <div className="pt-2">
                  <Progress value={80} className="h-2 bg-gray-100" />
                  <p className="text-[10px] text-gray-400 mt-1">
                    {t('analytics.dashboard.charts.sustainabilityTarget', {
                      value: 80,
                    })}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">
                  {t('analytics.dashboard.charts.efficiencyScore')}
                </p>
                <p className="text-3xl font-bold text-[#4338ca]">87%</p>
                <p className="text-xs text-gray-500">↑ 3% from last week</p>
                <div className="pt-2">
                  <Progress value={87} className="h-2 bg-gray-100" />
                  <p className="text-[10px] text-gray-400 mt-1">
                    {t('analytics.dashboard.charts.optimizationGoal', {
                      value: 87,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Bottom Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Data Consumption Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataConsumptionTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
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
                    dataKey="value"
                    stroke="#d946ef"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Dashboard Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-5">
            {performanceMetrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{metric.text}</span>
                </div>
                <div className="h-4 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${metric.color}`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
