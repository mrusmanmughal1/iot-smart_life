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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Edit2, Trash2 } from 'lucide-react';

const consumptionTrendData = [
  { time: '20/8', value: 30 },
  { time: '21/8', value: 45 },
  { time: '22/8', value: 35 },
  { time: '23/8', value: 50 },
  { time: '24/8', value: 55 },
  { time: '25/8', value: 80 },
  { time: '26/8', value: 95 },
];

const statusDistributionData = [
  { name: 'Device Data', value: 65, color: '#4338ca' },
  { name: 'Dashboard Queries', value: 20, color: '#c026d3' },
  { name: 'API Calls', value: 10, color: '#f97316' },
  { name: 'Storage Overhead', value: 5, color: '#44403c' },
];

const tableData = [
  {
    type: 'Device',
    name: 'Gateway-002',
    consumed: '485 GB',
    percent: '17.3%',
    trend: '↑ 12%',
  },
  {
    type: 'Dashboard',
    name: 'Production Overview',
    consumed: '320 GB',
    percent: '11.4%',
    trend: '↑ 8%',
  },
  {
    type: 'Device',
    name: 'Sensor-001',
    consumed: '280 GB',
    percent: '10.0%',
    trend: '↓ 5%',
  },
  {
    type: 'Dashboard',
    name: 'Energy Management',
    consumed: '195 GB',
    percent: '7.0%',
    trend: '↑ 15%',
  },
];

export default function DataConsumptionAnalyticsPage() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={t('analytics.dataConsumption.title')}
          description={t('analytics.dataConsumption.subtitle')}
        />
        <div className="flex items-center gap-3">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
            className="w-40 border-gray-200"
          >
            <SelectTrigger className=" h-10 rounded-md">
              <SelectValue placeholder="Time Range: Last 30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="primary">Export Data</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: t('analytics.dataConsumption.stats.totalData'),
            value: '2.8 TB',
            trend: '↑ 15% from last month',
            color: 'bg-primary text-white',
          },
          {
            title: t('analytics.dataConsumption.stats.avgDaily'),
            value: '95.2 GB',
            trend: '↑ 3% from yesterday',
            color: 'bg-secondary text-white',
          },
          {
            title: t('analytics.dataConsumption.stats.peakHour'),
            value: '14:00',
            trend: '127 GB peak',
            color: 'bg-success text-white',
          },
          {
            title: t('analytics.dataConsumption.stats.storageEfficiency'),
            value: '87.5%',
            trend: '↑ 2% efficiency',
            color: 'bg-white text-black ',
          },
        ].map((kpi, idx) => (
          <Card key={idx} className={`  rounded-lg `}>
            <CardContent
              className={`p-6  rounded-lg ${kpi.color} ${idx === 3 ? 'text-black' : 'text-white'
                }`}
            >
              <h3
                className={`text-sm font-semibold ${kpi.color.split(' ')[1]}`}
              >
                {kpi.title}
              </h3>
              <p className="text-2xl font-semibold  mt-1">{kpi.value}</p>
              <p className="text-xs mt-1">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Consumption Trend */}
        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm rounded-lg overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              {t('analytics.dataConsumption.charts.consumptionTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consumptionTrendData}>
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
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 flex flex-col gap-1">
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

        {/* Device Status Distribution */}
        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm rounded-lg overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              {t('analytics.dataConsumption.charts.statusDistribution')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex items-center gap-8">
            <div className="h-[250px] w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-4">
              {statusDistributionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <Table>
            <TableHeader className=" text-white">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-white font-medium h-14">
                  {t('analytics.dataConsumption.table.type')}
                </TableHead>
                <TableHead className="text-white font-medium h-14">
                  {t('analytics.dataConsumption.table.name')}
                </TableHead>
                <TableHead className="text-white font-medium h-14">
                  {t('analytics.dataConsumption.table.dataConsumed')}
                </TableHead>
                <TableHead className="text-white font-medium h-14">
                  {t('analytics.dataConsumption.table.percentOfTotal')}
                </TableHead>
                <TableHead className="text-white font-medium h-14">
                  {t('analytics.dataConsumption.table.trend')}
                </TableHead>
                <TableHead className="text-white font-medium h-14 text-right">
                  {t('analytics.dataConsumption.table.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 h-16"
                >
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    {row.type}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-900 dark:text-white">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    {row.consumed}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    {row.percent}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    {row.trend}
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-2 h-16">
                    <Button variant="outline" className='rounded-full' size="sm">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button variant="destructive" className='rounded-full' size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
