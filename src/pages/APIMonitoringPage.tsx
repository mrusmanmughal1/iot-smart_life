import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/common/DataTable/DataTable';
import { createSortableColumn } from '@/components/common/DataTable/columns';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Globe,
  Server,
  Database,
  Zap,
} from 'lucide-react';

interface APILog {
  id: string;
  timestamp: Date;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  userId: string;
  ip: string;
}

const apiLogs: APILog[] = [
  {
    id: '1',
    timestamp: new Date('2025-01-30T14:23:45'),
    endpoint: '/api/v1/devices',
    method: 'GET',
    statusCode: 200,
    responseTime: 145,
    userId: 'user123',
    ip: '192.168.1.100',
  },
  {
    id: '2',
    timestamp: new Date('2025-01-30T14:24:12'),
    endpoint: '/api/v1/telemetry',
    method: 'POST',
    statusCode: 201,
    responseTime: 234,
    userId: 'user456',
    ip: '192.168.1.105',
  },
  {
    id: '3',
    timestamp: new Date('2025-01-30T14:25:33'),
    endpoint: '/api/v1/devices/123',
    method: 'PUT',
    statusCode: 500,
    responseTime: 567,
    userId: 'user789',
    ip: '192.168.1.110',
  },
  // Add more logs...
];

const requestData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  requests: Math.floor(Math.random() * 1000) + 500,
}));

const endpointData = [
  { name: '/api/v1/devices', count: 4521, percentage: 35 },
  { name: '/api/v1/telemetry', count: 3842, percentage: 30 },
  { name: '/api/v1/assets', count: 2156, percentage: 17 },
  { name: '/api/v1/users', count: 1534, percentage: 12 },
  { name: 'Others', count: 768, percentage: 6 },
];

const responseTimeData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  avgTime: Math.floor(Math.random() * 200) + 100,
  p95Time: Math.floor(Math.random() * 400) + 300,
}));

export default function APIMonitoring() {
  const [timeRange, setTimeRange] = useState('24h');

  const columns = [
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }: any) => (
        <span className="text-sm">
          {row.getValue('timestamp').toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'method',
      header: 'Method',
      cell: ({ row }: any) => {
        const method = row.getValue('method') as string;
        const colors: Record<string, string> = {
          GET: 'bg-blue-500',
          POST: 'bg-green-500',
          PUT: 'bg-yellow-500',
          DELETE: 'bg-red-500',
        };
        return (
          <Badge className={`${colors[method]} text-white`}>
            {method}
          </Badge>
        );
      },
    },
    createSortableColumn('endpoint', 'Endpoint'),
    {
      accessorKey: 'statusCode',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.getValue('statusCode') as number;
        const variant = status >= 200 && status < 300 ? 'default' : 'destructive';
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'responseTime',
      header: 'Response Time',
      cell: ({ row }: any) => (
        <span className="text-sm">{row.getValue('responseTime')}ms</span>
      ),
    },
    createSortableColumn('userId', 'User ID'),
    createSortableColumn('ip', 'IP Address'),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Monitoring"
        description="Monitor API performance, usage, and health metrics"
      />

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,821</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12.5%</span> from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground">
              12,652 successful requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187ms</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              <span className="text-green-500">-8ms</span> from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.3%</div>
            <p className="text-xs text-muted-foreground">
              169 failed requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Volume</CardTitle>
            <CardDescription>API requests over time</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={requestData}
              lines={[{ dataKey: 'requests', name: 'Requests', color: '#8b5cf6' }]}
              xAxisKey="hour"
              title=""
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Times</CardTitle>
            <CardDescription>Average and P95 response times</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={responseTimeData}
              lines={[
                { dataKey: 'avgTime', name: 'Average', color: '#10b981' },
                { dataKey: 'p95Time', name: 'P95', color: '#f59e0b' },
              ]}
              xAxisKey="hour"
              title=""
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Endpoints</CardTitle>
            <CardDescription>Most frequently called endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart
              data={endpointData}
              nameKey="name"
              dataKey="count"
              title=""
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endpoint Usage</CardTitle>
            <CardDescription>Request count by endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={endpointData}
              bars={[{ dataKey: 'count', name: 'Requests', color: '#8b5cf6' }]}
              xAxisKey="name"
              title=""
            />
          </CardContent>
        </Card>
      </div>

      {/* API Health */}
      <Card>
        <CardHeader>
          <CardTitle>API Health Status</CardTitle>
          <CardDescription>Real-time health of API services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Server className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-semibold">API Gateway</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Operational</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Database className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-semibold">Database</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Operational</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Zap className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="font-semibold">Cache Service</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="text-sm text-muted-foreground">Degraded</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent API Logs</CardTitle>
          <CardDescription>Latest API requests and responses</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={apiLogs}
            searchKey="endpoint"
          />
        </CardContent>
      </Card>
    </div>
  );
}