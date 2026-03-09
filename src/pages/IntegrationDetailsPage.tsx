import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Settings,
  Edit,
  Copy,
  Play,
  Pause,
  Trash2,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useIntegration } from '@/features/integrations/Hooks';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingOverlay } from '@/components/common/LoadingSpinner';

const VOLUME_DATA = [
  { name: 'Apr', volume: 65 },
  { name: 'May', volume: 78 },
  { name: 'Jun', volume: 75 },
  { name: 'Jul', volume: 98 },
  { name: 'Aug', volume: 92 },
  { name: 'Sep', volume: 94 },
  { name: 'Oct', volume: 118 },
  { name: 'Nov', volume: 115 },
  { name: 'Dec', volume: 82 },
];

const TREND_DATA = [
  { name: '20/8', latency: 0.8 },
  { name: '21/8', latency: 1.2 },
  { name: '22/8', latency: 0.9 },
  { name: '23/8', latency: 1.1 },
  { name: '24/8', latency: 1.5 },
  { name: '25/8', latency: 1.3 },
  { name: '26/8', latency: 1.7 },
  { name: '27/8', latency: 1.5 },
];

const ERROR_DATA = [
  { name: 'Timeout Errors', value: 45, color: '#A855F7' },
  { name: 'Rate Limit', value: 10, color: '#3B82F6' },
  { name: 'Server Errors', value: 28, color: '#22C55E' },
  { name: 'Other', value: 17, color: '#EAB308' },
];

export default function IntegrationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: integration, isLoading } = useIntegration(id || '');

  const stats = useMemo(
    () => [
      {
        title: 'Total Messages',
        value: '8,456',
        change: '+12%',
        isPositive: true,
        color: 'bg-blue-50 border-blue-100',
        textColor: 'text-blue-600',
      },
      {
        title: 'Success Rate',
        value: '98.7%',
        change: '↑ 0.3%',
        isPositive: true,
        color: 'bg-amber-50 border-amber-100',
        textColor: 'text-amber-600',
      },
      {
        title: 'Avg Response Time',
        value: '1.2s',
        change: '↑ 0.2s',
        isPositive: false,
        color: 'bg-green-50 border-green-100',
        textColor: 'text-green-600',
      },
      {
        title: 'Error Rate',
        value: '1.3%',
        change: '↓ 0.3%',
        isPositive: true,
        color: 'bg-pink-50 border-pink-100',
        textColor: 'text-pink-600',
      },
    ],
    []
  );

  if (isLoading) return <LoadingOverlay />;
  if (!integration)
    return <div className="p-8 text-center">Integration not found</div>;

  return (
    <div className="space-y-6  max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Integration Statistics: {integration.name}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              Type:{' '}
              <span className="font-medium uppercase">{integration.type}</span>
            </span>
            <span>|</span>
            <span className="flex items-center gap-1">
              Status:
              <Badge
                variant={integration.enabled ? 'default' : 'secondary'}
                className="h-5 px-1.5 py-0 text-[10px]"
              >
                {integration.enabled ? 'Active' : 'Inactive'}
              </Badge>
            </span>
            <span>|</span>
            <span className="flex items-center gap-1">
              Last Activity: 2 Minutes Ago
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-primary text-white hover:bg-primary/80 border  shadow-sm"
          >
            Configuration
          </Button>
          <Button
            variant="outline"
            className="bg-secondary text-white hover:bg-secondary/80 border  shadow-sm"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            className="bg-gray-500 text-white hover:bg-gray-600 border  shadow-sm"
          >
            Clone
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="border-none   rounded-md shadow-sm bg-white overflow-hidden">
        <CardContent className="p-4 flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-500 min-w-[100px]">
            Time Range:
          </span>
          <div className="flex gap-2">
            {['Last 24h', 'Last 7d', 'Last 30d', 'Custom'].map((range) => (
              <Button
                key={range}
                variant="outline"
                size="sm"
                className={`bg-[#F1F3F4] border-none  text-gray-600 hover:bg-gray-200 ${range === 'Last 24h' ? 'shadow-inner' : ''}`}
              >
                {range}
              </Button>
            ))}
          </div>
        </CardContent>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className={`border   shadow ${stat.color} transition-transform  `}
          >
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <div className="flex items-baseline justify-between">
                <h3 className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </h3>
              </div>
              <p
                className={`text-xs mt-2 font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {stat.change} vs last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border  shadow overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-gray-700">
              Message Volume (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={VOLUME_DATA}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#D81B60"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#000', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border  shadow overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-gray-700">
              Response Time Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3F51B5" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3F51B5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={true}
                  horizontal={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="latency"
                  stroke="#3F51B5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLatency)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Info Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border  shadow col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-700">
              Error Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ERROR_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ERROR_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-2 mt-4">
                {ERROR_DATA.map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-gray-600">{entry.name}</span>
                    </div>
                    <span className="font-semibold">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border  shadow col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-700">
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {[
                {
                  label: 'Peak Messages/Hour:',
                  value: '1,247',
                  color: 'text-blue-500',
                },
                {
                  label: 'Min Response Time:',
                  value: '0.2s',
                  color: 'text-green-500',
                },
                {
                  label: 'Average Messages/Hour:',
                  value: '892',
                  color: 'text-blue-500',
                },
                {
                  label: 'Max Response Time:',
                  value: '8.7s',
                  color: 'text-red-500',
                },
                {
                  label: 'Data Transferred:',
                  value: '245.8 MB',
                  color: 'text-green-500',
                },
                {
                  label: 'P95 Response Time:',
                  value: '2.1s',
                  color: 'text-green-500',
                },
                { label: 'Uptime:', value: '99.8%', color: 'text-green-500' },
                {
                  label: 'Total Requests:',
                  value: '12,847',
                  color: 'text-blue-500',
                },
              ].map((metric, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-gray-50 pb-2"
                >
                  <span className="text-sm text-gray-500 font-medium">
                    {metric.label}
                  </span>
                  <span className={`text-sm font-bold ${metric.color}`}>
                    {metric.value}
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
