import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  MoreVertical,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/util';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for dashboard table
const dashboardData = [
  {
    id: '1',
    name: 'Building A - Main Office',
    co2Emissions: '2.4 kg',
    temperature: '24.5°C',
    humidity: '68%',
    energyUsage: '2 min ago',
    lastUpdated: '99.8%',
    status: 'ACTIVE',
    statusColor: 'text-green-600',
    statusDot: 'bg-green-500',
  },
  {
    id: '2',
    name: 'Warehouse B',
    co2Emissions: '3.1 kg',
    temperature: '24.5°C',
    humidity: '1 day ago',
    energyUsage: '5 min ago',
    lastUpdated: '99.2%',
    status: 'Processing',
    statusColor: 'text-blue-600',
    statusDot: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'Retail Store C',
    co2Emissions: '2.4 kg',
    temperature: '24.5°C',
    humidity: '3 days ago',
    energyUsage: '2 hours ago',
    lastUpdated: '87.3%',
    status: 'ERROR',
    statusColor: 'text-purple-600',
    statusDot: 'bg-purple-500',
  },
];

// Mock data for environmental metrics trends
const environmentalTrendsData = [
  { month: 'JAN', co2: 12, temperature: 18, humidity: 45 },
  { month: 'FEB', co2: 15, temperature: 19, humidity: 48 },
  { month: 'MAR', co2: 22, temperature: 21, humidity: 52 },
  { month: 'APR', co2: 28, temperature: 23, humidity: 55 },
  { month: 'MAY', co2: 25, temperature: 25, humidity: 50 },
  { month: 'JUN', co2: 30, temperature: 28, humidity: 48 },
  { month: 'JUL', co2: 35, temperature: 30, humidity: 58 },
  { month: 'AUG', co2: 32, temperature: 29, humidity: 60 },
  { month: 'SEP', co2: 28, temperature: 26, humidity: 55 },
  { month: 'OCT', co2: 22, temperature: 23, humidity: 50 },
  { month: 'NOV', co2: 18, temperature: 20, humidity: 45 },
  { month: 'DEC', co2: 15, temperature: 18, humidity: 40 },
];

export default function DashboardAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('data-consumption');
  const [timeRange, setTimeRange] = useState('7d');
  const [sortBy, setSortBy] = useState('co2');

  const handleAction = (dashboardId: string) => {
    // TODO: Implement action menu
    console.log('Action clicked for dashboard:', dashboardId);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting dashboard analytics data...');
  };

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dashboard Analytics
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Monitor environmental metrics and dashboard performance
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Data Consumption Tab/Button */}
        <Button
          variant={activeTab === 'data-consumption' ? 'default' : 'outline'}
          onClick={() => setActiveTab('data-consumption')}
          className={cn(
            'rounded-lg',
            activeTab === 'data-consumption'
              ? 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
        >
          Data Consumption
        </Button>

        {/* Time Range Dropdown */}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[200px] bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder="Time Range: 7 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Time Range: 24 hours</SelectItem>
            <SelectItem value="7d">Time Range: 7 days</SelectItem>
            <SelectItem value="30d">Time Range: 30 days</SelectItem>
            <SelectItem value="90d">Time Range: 90 days</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By Dropdown */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px] bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder="Sort by: CO2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="co2">Sort by: CO2</SelectItem>
            <SelectItem value="temperature">Sort by: Temperature</SelectItem>
            <SelectItem value="humidity">Sort by: Humidity</SelectItem>
            <SelectItem value="energy">Sort by: Energy Usage</SelectItem>
            <SelectItem value="name">Sort by: Name</SelectItem>
          </SelectContent>
        </Select>

        {/* Export Data Button */}
        <Button
          onClick={handleExport}
          className="ml-auto bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Dashboard Table */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
                <TableHead className="font-semibold dark:text-gray-300">DASHBOARD NAME</TableHead>
                <TableHead className="font-semibold dark:text-gray-300">CO2 EMISSIONS</TableHead>
                <TableHead className="font-semibold dark:text-gray-300">TEMPERATURE</TableHead>
                <TableHead className="font-semibold dark:text-gray-300">HUMIDITY</TableHead>
                <TableHead className="font-semibold dark:text-gray-300">ENERGY USAGE</TableHead>
                <TableHead className="font-semibold dark:text-gray-300">LAST UPDATED</TableHead>
                <TableHead className="font-semibold dark:text-gray-300">STATUS</TableHead>
                <TableHead className="font-semibold dark:text-gray-300">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData.map((dashboard) => (
                <TableRow key={dashboard.id} className="dark:border-gray-700">
                  <TableCell className="font-medium dark:text-white">
                    {dashboard.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {dashboard.co2Emissions}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {dashboard.temperature}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {dashboard.humidity}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {dashboard.energyUsage}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {dashboard.lastUpdated}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${dashboard.statusDot}`}
                      />
                      <span className={`font-medium ${dashboard.statusColor} dark:text-white`}>
                        • {dashboard.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction(dashboard.id)}
                      className="h-8 w-8 dark:hover:bg-gray-700"
                    >
                      <MoreVertical className="h-4 w-4 dark:text-gray-300" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts and Summary Section */}
      <div className="grid gap-6 lg:grid-cols-[2fr_2fr]">
        {/* Environmental Metrics Trends */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Environmental Metrics Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={environmentalTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  className="dark:text-gray-400"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9CA3AF"
                  className="dark:text-gray-400"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 40]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="co2"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  name="CO2 Emissions"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#1E40AF"
                  strokeWidth={3}
                  name="Temperature"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#F97316"
                  strokeWidth={3}
                  name="Humidity"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Environmental Impact Summary */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Environmental Impact Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 grid grid-cols-2 gap-6 dark:bg-gray-800 dark:border-gray-700">
            {/* Total CO2 Emissions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total CO2 Emissions (7 days)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  8.4 kg
                </span>
                <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>12% from last week</span>
                </div>
              </div>
            </div>

            {/* Energy Consumption */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Energy Consumption
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  854 kWh
                </span>
                <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>5% from last week</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Sustainability Target: 80%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>

            {/* Carbon Footprint */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Carbon Footprint
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  421 kg
                </span>
                <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                  <TrendingDown className="h-4 w-4" />
                  <span>8% from last week</span>
                </div>
              </div>
            </div>

            {/* Efficiency Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Efficiency Score
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  87%
                </span>
                <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                  <TrendingDown className="h-4 w-4" />
                  <span>3% from last week</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Optimization Goal: 87%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
