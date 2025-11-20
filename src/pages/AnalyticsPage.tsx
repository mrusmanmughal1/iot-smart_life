import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Activity, PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';

export default function AnalyticsPage() {
  const { t } = useTranslation();

  return (
    <AppLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t('analytics.title')}</h1>
        <p className="text-slate-500 mt-2">View system analytics and insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Events', value: '12,345', icon: Activity, color: 'blue' },
          { title: 'Data Processed', value: '2.4 TB', icon: BarChart3, color: 'green' },
          { title: 'Active Sessions', value: '89', icon: TrendingUp, color: 'purple' },
          { title: 'Success Rate', value: '98.5%', icon: PieChart, color: 'yellow' },
        ].map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device Activity</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-slate-400">
              Chart placeholder - Integrate with charting library
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alarm Trends</CardTitle>
            <CardDescription>By severity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-slate-400">
              Chart placeholder - Integrate with charting library
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AppLayout>
  );
}