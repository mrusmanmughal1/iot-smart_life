import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Trash2,
  Eye,
  Zap,
} from 'lucide-react';

// ─── Mock Data ──────────────────────────────────────────────

const errorTrendData = [
  { time: '00:00', errors: 320, rate: 2.1 },
  { time: '02:00', errors: 280, rate: 1.8 },
  { time: '04:00', errors: 190, rate: 1.2 },
  { time: '06:00', errors: 250, rate: 1.6 },
  { time: '08:00', errors: 480, rate: 3.1 },
  { time: '10:00', errors: 620, rate: 4.0 },
  { time: '12:00', errors: 750, rate: 4.8 },
  { time: '14:00', errors: 890, rate: 5.7 },
  { time: '16:00', errors: 680, rate: 4.4 },
  { time: '18:00', errors: 520, rate: 3.3 },
  { time: '20:00', errors: 410, rate: 2.6 },
  { time: '22:00', errors: 350, rate: 2.2 },
];

interface ErrorDistributionItem {
  code: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

const errorDistribution: ErrorDistributionItem[] = [
  {
    code: '429',
    label: 'Rate Limited',
    count: 8923,
    percentage: 45,
    color: '#ef4444',
  },
  {
    code: '401',
    label: 'Unauthorized',
    count: 5954,
    percentage: 30,
    color: '#3b82f6',
  },
  {
    code: '500',
    label: 'Server Error',
    count: 3970,
    percentage: 20,
    color: '#22c55e',
  },
  {
    code: '404',
    label: 'Not Found',
    count: 1000,
    percentage: 5,
    color: '#f59e0b',
  },
];

interface ErrorEvent {
  id: string;
  timestamp: string;
  endpoint: string;
  status: number;
  errorMessage: string;
  apiKey: string;
  count: number;
  actionType: 'details' | 'optimize';
}

const recentErrors: ErrorEvent[] = [
  {
    id: '1',
    timestamp: '2025-05-29 14:45:23',
    endpoint: '/api/v1/auth',
    status: 429,
    errorMessage: 'Rate limit exceeded',
    apiKey: 'key_***abc123',
    count: 247,
    actionType: 'details',
  },
  {
    id: '2',
    timestamp: '2025-05-29 14:45:23',
    endpoint: '/api/v1/auth',
    status: 401,
    errorMessage: 'Invalid token',
    apiKey: 'key_***def456',
    count: 89,
    actionType: 'details',
  },
  {
    id: '3',
    timestamp: '2025-05-29 14:45:23',
    endpoint: '/api/v1/auth',
    status: 429,
    errorMessage: 'Database connection failed',
    apiKey: 'key_***ghi789',
    count: 34,
    actionType: 'details',
  },
  {
    id: '4',
    timestamp: '2025-05-29 14:45:23',
    endpoint: '/api/v1/auth',
    status: 429,
    errorMessage: 'Resource not found',
    apiKey: 'key_***jkl012',
    count: 12,
    actionType: 'optimize',
  },
];

// ── Component ──────────────────────────────────────────────

export default function ErrorAnalysisPage() {
  const [events, setEvents] = useState<ErrorEvent[]>(recentErrors);

  const handleClearAll = () => {
    setEvents([]);
  };

  const handleResetEvents = () => {
    setEvents(recentErrors);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Error Analysis"
        description="Monitor API errors, failure patterns, and troubleshooting insights"
      />
      {/* Alert Banner */}
      <div
        className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/30"
        role="alert"
        id="error-alert-banner"
      >
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
          Alert: Error rate spike detected in /api/v1/auth endpoint (3.2% above
          threshold)
        </span>
      </div>
      {/* KPI Summary Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Errors (24h) */}
        <Card className=" bg-primary text-white">
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider  dark:text-slate-400">
              Total Errors (24h)
            </p>
            <p className="mt-2 text-3xl font-bold dark:text-white">19,847</p>
            <p className="mt-1 text-xs   dark:text-slate-400">
              Total Errors (24h)19,847↑ 23.4% vs yesterday
            </p>
          </CardContent>
        </Card>

        {/* Most Common Error */}
        <Card className=" bg-secondary text-white">
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider  dark:text-slate-400">
              Most Common Error
            </p>
            <p className="mt-2 text-3xl font-bold   dark:text-white">429</p>
            <p className="mt-1 text-xs  dark:text-slate-400">
              Rate Limit Exceeded
            </p>
            <p className="text-xs  dark:text-slate-400">8,923 occurrences</p>
          </CardContent>
        </Card>

        {/* Affected Endpoints */}
        <Card className=" bg-success text-white">
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider dark:text-slate-400">
              Affected Endpoints
            </p>
            <p className="mt-2 text-3xl font-bold dark:text-white">12</p>
            <p className="mt-1 text-xs   dark:text-slate-400">
              out of 47 total
              <span className="block">
                Top: <span className="font-medium">/api/v1/auth</span>
              </span>
            </p>
          </CardContent>
        </Card>

        {/* MTTR */}
        <Card className=" bg-white text-white">
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              MTTR
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              4.2min
            </p>
            <div className="mt-1 flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ↓ 1.3min improvement
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Mean Time to Recovery
            </p>
          </CardContent>
        </Card>
      </div>
      {/* charts start here   */}
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Error Analysis Chart (Bar + Line Combo) */}
        <Card className="border border-slate-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Error Analysis
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Error percentage and volume over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={errorTrendData}
                  margin={{ top: 15, right: 10, left: -15, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dx={-5}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    labelStyle={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      color: '#1e293b',
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="errors"
                    name="Error Volume"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    barSize={28}
                    fillOpacity={0.85}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rate"
                    name="Error Rate (%)"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{
                      r: 4,
                      fill: '#fff',
                      stroke: '#3b82f6',
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* Error Distribution */}
        <Card className="border border-slate-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Error Distribution
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              HTTP status codes breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {errorDistribution.map((item) => (
                <div key={item.code} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.code} - {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                      <div
                        className="absolute inset-y-0 left-0 rounded-md transition-all duration-500 ease-out"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="min-w-[100px] text-right text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {item.count.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Recent Error Events
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 rounded-lg border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400"
                id="error-filter-btn"
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={events.length > 0 ? handleClearAll : handleResetEvents}
                className="flex items-center gap-1.5 rounded-lg text-xs font-semibold"
                id="error-clear-all-btn"
              >
                {events.length > 0 ? (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear All
                  </>
                ) : (
                  'Reset'
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white font-semibold py-3 pl-6">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-white font-semibold py-3">
                    Endpoint
                  </TableHead>
                  <TableHead className="text-white font-semibold py-3">
                    Status
                  </TableHead>
                  <TableHead className="text-white font-semibold py-3">
                    Error Message
                  </TableHead>
                  <TableHead className="text-white font-semibold py-3">
                    API Key
                  </TableHead>
                  <TableHead className="text-white font-semibold py-3">
                    Count
                  </TableHead>
                  <TableHead className="text-white font-semibold py-3 pr-6 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-12 text-center text-sm text-slate-400"
                    >
                      No error events to display
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow
                      key={event.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <TableCell className="pl-6 text-sm text-slate-600 dark:text-slate-400">
                        {event.timestamp}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
                        {event.endpoint}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`rounded-full px-2.5 py-0.5 font-semibold text-xs ${
                            event.status === 429
                              ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400'
                              : event.status === 401
                                ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400'
                                : event.status === 500
                                  ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400'
                                  : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {event.errorMessage}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {event.apiKey}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {event.count}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-xs font-semibold rounded-lg ${
                            event.actionType === 'optimize'
                              ? 'text-[#2563eb] hover:text-[#1d4ed8] hover:bg-blue-50 dark:hover:bg-blue-950/30'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                          }`}
                        >
                          {event.actionType === 'optimize'
                            ? 'Optimize'
                            : 'Details'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
