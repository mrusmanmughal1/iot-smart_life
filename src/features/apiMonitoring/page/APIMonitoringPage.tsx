import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart } from '@/components/charts/LineChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/common/DataTable/DataTable';
import { createSortableColumn } from '@/components/common/DataTable/columns';
import { Activity, Clock, XCircle, Server } from 'lucide-react';

interface APILog {
  id: string;
  timestamp: Date;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  apiKey: string;
}

const apiLogs: APILog[] = [
  {
    id: '1',
    timestamp: new Date('2025-05-29T14:23:15'),
    endpoint: '/api/v1/devices',
    method: 'GET',
    statusCode: 200,
    responseTime: 89,
    apiKey: 'key_***abc123',
  },
  {
    id: '2',
    timestamp: new Date('2025-05-29T14:32:08'),
    endpoint: '/api/v1/telemetry',
    method: 'POST',
    statusCode: 429,
    responseTime: 156,
    apiKey: 'key_***def456',
  },
  {
    id: '3',
    timestamp: new Date('2025-05-29T14:31:55'),
    endpoint: '/api/v1/attributes',
    method: 'PUT',
    statusCode: 201,
    responseTime: 203,
    apiKey: 'key_***ghi789',
  },
];

const requestData = [
  { period: 'Apr', requests: 5 },
  { period: 'May', requests: 82 },
  { period: 'Jun', requests: 95 },
  { period: 'Jul', requests: 2 },
  { period: 'Aug', requests: 123 },
  { period: 'Sep', requests: 130 },
  { period: 'Nov', requests: 130 },
  { period: 'Oct', requests: 130 },
  { period: 'Dec', requests: 150 },
];

const endpointData = [
  {
    name: '/api/v1/devices',
    count: 847592,
    percentage: 29.8,
    color: '#4338ca',
  },
  {
    name: '/api/v1/telemetry',
    count: 623441,
    percentage: 21.9,
    color: '#22c55e',
  },
  {
    name: '/api/v1/attributes',
    count: 392156,
    percentage: 13.8,
    color: '#f97316',
  },
];

const statsCards = [
  {
    title: 'Total API Calls',
    value: '2,847,592',
    change: '+12.5% vs last period',
    icon: <Activity className="h-5 w-5  " />,
    className: 'bg-primary',
    changeClass: 'text-white',
  },
  {
    title: 'Avg Response Time',
    value: '127ms',
    change: '-8.2% vs last period',
    icon: <Clock className="h-5 w-5  " />,
    className: 'bg-secondary',
    changeClass: 'text-white',
  },
  {
    title: 'Error Rate',
    value: '2.3%',
    change: '+0.5% vs last period',
    icon: <XCircle className="h-5 w-5  " />,
    className: 'bg-success',
    changeClass: 'text-white',
  },
  {
    title: 'Active API Keys',
    value: '47',
    change: 'No change',
    icon: <Server className="h-5 w-5  " />,
    className: 'bg-white',
    changeClass: 'text-black',
  },
];

export default function APIMonitoring() {
  const [timeRange, setTimeRange] = useState('30d');

  const columns = [
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }: any) => (
        <span className="text-sm text-slate-700">
          {row.getValue('timestamp').toLocaleString()}
        </span>
      ),
    },
    createSortableColumn('endpoint', 'Endpoint'),
    {
      accessorKey: 'method',
      header: 'Method',
      cell: ({ row }: any) => {
        const method = row.getValue('method') as string;
        const colors: Record<string, string> = {
          GET: 'bg-sky-500',
          POST: 'bg-emerald-500',
          PUT: 'bg-amber-500',
          DELETE: 'bg-rose-500',
        };
        return (
          <Badge className={`${colors[method]} text-white`}>{method}</Badge>
        );
      },
    },
    {
      accessorKey: 'statusCode',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.getValue('statusCode') as number;
        const variant =
          status >= 200 && status < 300 ? 'default' : 'destructive';
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'responseTime',
      header: 'Response Time',
      cell: ({ row }: any) => (
        <span className="text-sm text-slate-700">
          {row.getValue('responseTime')}ms
        </span>
      ),
    },
    createSortableColumn('apiKey', 'API Key'),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Monitoring"
        description="Monitor API performance, usage, and health metrics"
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card
            key={card.title}
            className={`  pt-6  0 shadow-sm ${card.className} ${card.changeClass}`}
          >
            <CardContent className="space-y-3 ">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium  ">{card.title}</p>
                  <p className="mt-3 text-3xl font-semibold  ">{card.value}</p>
                </div>
                <div className="rounded-2xl  text-white p-2 shadow-sm">
                  {card.icon}
                </div>
              </div>
              <p className={`text-sm ${card.changeClass}`}>{card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>API Calls Over Time</CardTitle>
              <CardDescription>
                Monitor request volume across your platform.
              </CardDescription>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
              Last 30 days
            </div>
          </CardHeader>
          <CardContent>
            <LineChart
              data={requestData}
              lines={[
                { dataKey: 'requests', name: 'API Calls', color: '#db2777' },
              ]}
              xAxisKey="period"
              title=""
              showLegend={false}
              height={350}
            />
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle>Top API Endpoints</CardTitle>
            <CardDescription>Most frequently called endpoints.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {endpointData.map((endpoint) => (
              <div key={endpoint.name} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    {endpoint.name}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {endpoint.count.toLocaleString()} calls
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${endpoint.percentage}%`,
                      backgroundColor: endpoint.color,
                    }}
                  />
                </div>
                <div className="text-xs text-slate-500">
                  {endpoint.percentage}% of traffic
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recent API Activity</CardTitle>
            <CardDescription>Latest API requests and responses</CardDescription>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
            Showing latest 30 logs
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <DataTable columns={columns} data={apiLogs} searchKey="endpoint" />
        </CardContent>
      </Card>
    </div>
  );
}
