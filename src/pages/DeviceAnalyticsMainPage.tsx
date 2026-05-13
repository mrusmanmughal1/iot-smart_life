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
  Label,
} from 'recharts';
import { cn } from '@/lib/util';

const tableData = [
  {
    name: 'Sensor-001',
    type: 'Temperature',
    status: 'Online',
    dataGenerated: '2.3 MB/day',
    lastActive: '2 min ago',
    uptime: '99.8%',
    alerts: 3,
    statusColor: 'text-green-500',
    dotColor: 'bg-green-500',
    alertColor: 'text-red-500',
  },
  {
    name: 'Gateway-002',
    type: 'Gateway',
    status: 'Online',
    dataGenerated: '12.7 MB/day',
    lastActive: '5 min ago',
    uptime: '99.2%',
    alerts: 0,
    statusColor: 'text-green-500',
    dotColor: 'bg-green-500',
    alertColor: 'text-green-500',
  },
  {
    name: 'Motor-003',
    type: 'Actuator',
    status: 'Offline',
    dataGenerated: '0 MB/day',
    lastActive: '2 hours ago',
    uptime: '87.3%',
    alerts: 1,
    statusColor: 'text-gray-500',
    dotColor: 'bg-red-500',
    alertColor: 'text-red-500',
  },
];

const topGeneratorsData = [
  { name: 'Gateway-002', value: 12.7, color: '#312e81' },
  { name: 'Sensor-004', value: 5.2, color: '#c026d3' },
  { name: 'Sensor-001', value: 2.3, color: '#4a4a4a' },
];

const statusDistributionData = [
  { name: 'Online', value: 180, color: '#4338ca' },
  { name: 'Offline', value: 12, color: '#c026d3' },
  { name: 'Maintenance', value: 55, color: '#fca5a1' },
];

export default function DeviceAnalyticsMainPage() {
  const { t } = useTranslation();
  const [deviceType, setDeviceType] = useState('all');
  const [status, setStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={t('analytics.deviceMain.title')}
          description={t('analytics.deviceMain.subtitle')}
        />
        <Button variant="primary">Export Data</Button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={deviceType} onValueChange={setDeviceType}>
          <SelectTrigger className="w-[180px] h-10 bg-gray-100 border-none rounded-md">
            <SelectValue
              placeholder={t('analytics.deviceMain.filters.deviceType')}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t('analytics.deviceMain.filters.deviceType')}
            </SelectItem>
            <SelectItem value="temperature">Temperature</SelectItem>
            <SelectItem value="gateway">Gateway</SelectItem>
            <SelectItem value="actuator">Actuator</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px] h-10 bg-gray-100 border-none rounded-md">
            <SelectValue
              placeholder={t('analytics.deviceMain.filters.status')}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t('analytics.deviceMain.filters.status')}
            </SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] h-10 bg-gray-100 border-none rounded-md">
            <SelectValue
              placeholder={t('analytics.deviceMain.filters.timeRange')}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">
              {t('analytics.deviceMain.filters.timeRange')}
            </SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Table Card */}
      <Card className=" rounded-xl overflow-hidden">
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold  ">
                  {t('analytics.deviceMain.table.deviceName')}
                </TableHead>
                <TableHead className="font-semibold  ">
                  {t('analytics.deviceMain.table.type')}
                </TableHead>
                <TableHead className="font-semibold  ">
                  {t('analytics.deviceMain.table.status')}
                </TableHead>
                <TableHead className="font-semibold  ">
                  {t('analytics.deviceMain.table.dataGenerated')}
                </TableHead>
                <TableHead className="font-semibold  ">
                  {t('analytics.deviceMain.table.lastActive')}
                </TableHead>
                <TableHead className="font-semibold  ">
                  {t('analytics.deviceMain.table.uptime')}
                </TableHead>
                <TableHead className="font-semibold  ">
                  {t('analytics.deviceMain.table.alerts')}
                </TableHead>
                <TableHead className="font-semibold  ">
                  {t('analytics.deviceMain.table.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow
                  key={index}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 h-16"
                >
                  <TableCell className="text-sm text-gray-700">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.type}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn('w-2 h-2 rounded-full', row.dotColor)}
                      />
                      <span className="text-sm text-gray-600">
                        {row.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.dataGenerated}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.lastActive}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.uptime}
                  </TableCell>
                  <TableCell
                    className={cn('text-sm font-bold', row.alertColor)}
                  >
                    {row.alerts}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => window.location.href = `/analytics/devices/${row.name}`}
                    >
                      {t('analytics.deviceMain.table.viewDetails')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Data Generators */}
        <Card className=" rounded-xl overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {t('analytics.deviceMain.charts.topGenerators')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topGeneratorsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border border-gray-100 rounded-md shadow-lg">
                            <p className="text-sm font-semibold text-gray-800">{`${payload[0].value} MB`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                    barSize={60}
                    label={{
                      position: 'top',
                      fill: '#64748b',
                      fontSize: 12,
                      // formatter: (val: number) => `${val}MB`,
                      offset: 10,
                    }}
                  >
                    {topGeneratorsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Status Distribution */}
        <Card className=" rounded-xl overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {t('analytics.deviceMain.charts.statusDistribution')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="h-[300px] w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        const { cx, cy } = viewBox as any;
                        return (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            <tspan
                              x={cx}
                              y={cy - 10}
                              className="text-xl font-semibold  "
                            >
                              247
                            </tspan>
                            <tspan
                              x={cx}
                              y={cy + 20}
                              className="text-xs fill-gray-500 font-medium"
                            >
                              {t('analytics.deviceMain.charts.totalDevices')}
                            </tspan>
                          </text>
                        );
                      }}
                    />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-4 min-w-[150px]">
              {statusDistributionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-600">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
