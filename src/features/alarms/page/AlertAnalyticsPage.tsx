import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, Search } from 'lucide-react';
import { useGetStatsAlaram } from '@/features/alarms/hooks';

export default function AlertAnalyticsPage() {
  const { t } = useTranslation();
  const { data: stats } = useGetStatsAlaram();
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-800">
          {t('alertAnalytics.title')}
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-800" />
          <Input
            placeholder={t('alertAnalytics.searchPlaceholder')}
            className="pl-9 bg-white border h-10"
          />
        </div>

        <Button variant="primary" className="  text-white h-10">
          <Plus className="mr-2 h-4 w-4" />
          {t('alertAnalytics.createRule')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Critical Alerts */}
        <Card className="bg-primary border  text-white  shadow-sm">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold   mb-2">
              {stats?.bySeverity?.critical || 0}
            </div>
            <div className="  font-medium mb-1">
              {t('alertAnalytics.criticalAlerts')}
            </div>
            <div className="text-xs  ">
              {t('alertAnalytics.fromYesterday', { amount: '+3' })}
            </div>
          </CardContent>
        </Card>

        {/* Warning Alerts */}
        <Card className="bg-secondary border text-white  shadow-sm">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold   mb-2">
              {stats?.bySeverity?.warning || 0}
            </div>
            <div className="  font-medium mb-1">
              {t('alertAnalytics.warningAlerts')}
            </div>
            <div className="text-xs  ">
              {t('alertAnalytics.fromYesterday', { amount: '-5' })}
            </div>
          </CardContent>
        </Card>

        {/* Info Alerts (Highlighted) */}
        <Card className="bg-success border  text-white  shadow-md">
          <CardContent className="pt-6 text-center ">
            <div className="text-4xl font-bold mb-2">
              {stats?.bySeverity?.info || 0}
            </div>
            <div className="font-medium mb-1">
              {t('alertAnalytics.infoAlerts')}
            </div>
            <div className="text-xs  ">
              {t('alertAnalytics.fromYesterday', { amount: '+12' })}
            </div>
          </CardContent>
        </Card>

        {/* Resolved Today */}
        <Card className="bg-white border    shadow-sm">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold text-slate-800 mb-2">
              {stats?.byStatus?.resolved || 0}
            </div>
            <div className="  font-medium mb-1">
              {t('alertAnalytics.resolvedToday')}
            </div>
            <div className="text-xs text-slate-500">
              {t('alertAnalytics.fromYesterday', { amount: '+23' })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-sm p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold text-slate-800">
            {t('alertAnalytics.trendsTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.recent || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  layout="vertical"
                  iconType="rect"
                  wrapperStyle={{ paddingLeft: '20px' }}
                />
                <Line
                  type="monotone"
                  dataKey="critical"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#ef4444' }}
                  activeDot={{ r: 6 }}
                  name={t('alertAnalytics.legend.critical')}
                />
                <Line
                  type="monotone"
                  dataKey="warning"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#22c55e' }}
                  activeDot={{ r: 6 }}
                  name={t('alertAnalytics.legend.warning')}
                />
                <Line
                  type="monotone"
                  dataKey="info"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#eab308' }}
                  activeDot={{ r: 6 }}
                  name={t('alertAnalytics.legend.info')}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            {t('alertAnalytics.topSources')}
          </h3>
          <div className="space-y-3">
            {(stats?.total ?? 0) > 0 ? (
              stats?.mostTriggered.map((source: any, idx: number) => (
                <div key={idx} className="text-slate-600">
                  <span className="font-medium text-sm">
                    {idx + 1}. {source.name || source.source || 'Unknown'}
                  </span>{' '}
                  (
                  {t('alertAnalytics.alertsCount', {
                    count: source.count || source.total || 0,
                  })}
                  )
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-400">
                {t('common.noData', 'No data available')}
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            {t('alertAnalytics.responseTime')}
          </h3>
          <div className="space-y-2 text-slate-600">
            <div className="text-sm text-slate-400">
              {t('alertAnalytics.avg')}: 0 {t('alertAnalytics.minutes')}
            </div>
            <div className="text-sm text-slate-400">
              {t('alertAnalytics.critical')}: 0 {t('alertAnalytics.minutes')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
