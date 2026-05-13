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
import { ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/util';

const tableData = [
  {
    name: 'Building A - Main Office',
    type: 'Commercial',
    status: 'ACTIVE',
    dataGenerated: '2 hours ago',
    lastActive: '2 min ago',
    uptimePercent: '99.8%',
    uptimeCount: '3',
    statusColor: 'text-green-500',
    dotColor: 'bg-green-500',
    typeColor: 'bg-green-50 text-green-700 hover:bg-green-50',
  },
  {
    name: 'Warehouse B',
    type: 'Retail',
    status: 'Processing',
    dataGenerated: '1 day ago',
    lastActive: '5 min ago',
    uptimePercent: '99.2%',
    uptimeCount: '5',
    statusColor: 'text-blue-400',
    dotColor: 'bg-blue-400',
    typeColor: 'bg-purple-50 text-purple-700 hover:bg-purple-50',
  },
  {
    name: 'Retail Store C',
    type: 'Industrial',
    status: 'ERROR',
    dataGenerated: '3 days ago',
    lastActive: '2 hours ago',
    uptimePercent: '87.3%',
    uptimeCount: '7',
    statusColor: 'text-purple-500',
    dotColor: 'bg-purple-500',
    typeColor: 'bg-blue-50 text-blue-700 hover:bg-blue-50',
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
        <Select
          value={deviceType}
          onValueChange={setDeviceType}
          className="w-44"
        >
          <SelectTrigger className="  bg-gray-100 border-none rounded-md">
            <SelectValue
              placeholder={t('analytics.deviceMain.filters.deviceType')}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t('analytics.deviceMain.filters.deviceType')}
            </SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="industrial">Industrial</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus} className="w-44">
          <SelectTrigger className="w-[180px] h-10 bg-gray-100 border-none rounded-md">
            <SelectValue
              placeholder={t('analytics.deviceMain.filters.status')}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t('analytics.deviceMain.filters.status')}
            </SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange} className="w-44">
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
      <Card className="  rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <Table className=" ">
            <TableHeader className=" ">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-white font-medium   w-[300px]">
                  <div className="flex items-center ">
                    {t('analytics.deviceMain.table.deviceName')}
                  </div>
                </TableHead>
                <TableHead className="text-white font-medium  ">
                  {t('analytics.deviceMain.table.type')}
                </TableHead>
                <TableHead className="text-white font-medium  ">
                  {t('analytics.deviceMain.table.status')}
                </TableHead>
                <TableHead className="text-white font-medium  ">
                  {t('analytics.deviceMain.table.dataGenerated')}
                </TableHead>
                <TableHead className="text-white font-medium  ">
                  {t('analytics.deviceMain.table.lastActive')}
                </TableHead>
                <TableHead className="text-white font-medium  ">
                  {t('analytics.deviceMain.table.uptimePercent')}
                </TableHead>
                <TableHead className="text-white font-medium  ">
                  {t('analytics.deviceMain.table.uptimeCount')}
                </TableHead>
                <TableHead className="text-white font-medium   text-center">
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
                  <TableCell className="text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">{row.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'rounded-md px-3 py-1 font-normal',
                        row.typeColor
                      )}
                    >
                      {row.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn('w-1.5 h-1.5 rounded-full', row.dotColor)}
                      />
                      <span
                        className={cn(
                          'font-bold text-[10px] uppercase',
                          row.statusColor
                        )}
                      >
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
                    {row.uptimePercent}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 text-center">
                    {row.uptimeCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hover:bg-secondary hover:text-white"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hover:bg-secondary hover:text-white"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
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
        <Card className="  rounded-xl overflow-hidden">
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
                            <p className="text-sm font-bold text-gray-800">{`${payload[0].value}MB`}</p>
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
                      formatter: (val: number) => `${val}MB`,
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
        <Card className="  rounded-xl overflow-hidden">
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
                    outerRadius={110}
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
                              className="text-4xl font-bold fill-gray-800"
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
