import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAlarms, useAcknowledgeAlarm, useClearAlarm } from '@/features/alarms/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';

export default function AlarmsPage() {
  const { t } = useTranslation();
  const { data: alarmsData, isLoading } = useAlarms();
  const acknowledgeAlarm = useAcknowledgeAlarm();
  const clearAlarm = useClearAlarm();

  const alarms = alarmsData?.data?.data || [];

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      CRITICAL: 'destructive',
      MAJOR: 'warning',
      MINOR: 'info',
      WARNING: 'secondary',
    };
    return colors[severity] || 'default';
  };

  return (
    <AppLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t('alarms.title')}</h1>
        <p className="text-slate-500 mt-2">Monitor and manage system alarms</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alarms</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alarms.filter((a: any) => a.status === 'ACTIVE').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alarms.filter((a: any) => a.status === 'ACKNOWLEDGED').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cleared</CardTitle>
            <XCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alarms.filter((a: any) => a.status === 'CLEARED').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Alarms</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Originator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alarms.map((alarm: any) => (
                  <TableRow key={alarm.id}>
                    <TableCell>
                      <Badge variant={getSeverityColor(alarm.severity) as any}>
                        {alarm.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{alarm.type}</TableCell>
                    <TableCell>{alarm.originatorName}</TableCell>
                    <TableCell>
                      <Badge variant={alarm.status === 'ACTIVE' ? 'destructive' : 'secondary'}>
                        {alarm.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(alarm.createdTime), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {alarm.status === 'ACTIVE' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlarm.mutate({ alarmId: alarm.id })}
                          >
                            Acknowledge
                          </Button>
                        )}
                        {alarm.status === 'ACKNOWLEDGED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => clearAlarm.mutate({ alarmId: alarm.id })}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    </AppLayout>
  );
}