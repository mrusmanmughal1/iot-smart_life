import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useAlarms,
  useAcknowledgeAlarm,
  useClearAlarm,
  useGetStatsAlaram,
} from '@/features/alarms/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';

export default function AlarmsPage() {
  const { t } = useTranslation();
  const { data: alarmsData, isLoading } = useAlarms();
  const acknowledgeAlarm = useAcknowledgeAlarm();
  const clearAlarm = useClearAlarm();
  const alarms = alarmsData?.data?.data.data || [];
  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      CRITICAL: 'destructive',
      MAJOR: 'warning',
      MINOR: 'info',
      WARNING: 'secondary',
    };
    return colors[severity] || 'default';
  };
  const { data: stats, isLoading: loadingstats } = useGetStatsAlaram();
  const statsDataByStatus = stats?.data?.byStatus;

  const statusCards = [
    {
      key: 'active' as const,
      label: 'Active Alarms',
      icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
      cardClassName: '',
    },
    {
      key: 'acknowledged' as const,
      label: 'Acknowledged',
      icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
      cardClassName: '',
    },
    {
      key: 'cleared' as const,
      label: 'Cleared',
      icon: <XCircle className="h-6 w-6 text-green-600" />,
      cardClassName: '',
    },
    {
      key: 'resolved' as const,
      label: 'Resolved',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      cardClassName: '',
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          {t('alarms.title')}
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Monitor and manage system alarms
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {statusCards.map((card) => (
          <Card key={card.key} className={card.cardClassName}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.label}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              {loadingstats ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="text-2xl font-bold">
                  {statsDataByStatus?.[card.key]}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-primary text-white">
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
                {alarms.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-slate-500"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  alarms.map((alarm: any) => (
                    <TableRow key={alarm.id}>
                      <TableCell>
                        <Badge
                          variant={getSeverityColor(alarm.severity) as any}
                        >
                          {alarm.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{alarm.type}</TableCell>
                      <TableCell>{alarm.originatorName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            alarm.status === 'ACTIVE'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {alarm.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(alarm.createdTime), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {alarm.status === 'ACTIVE' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                acknowledgeAlarm.mutate({ alarmId: alarm.id })
                              }
                            >
                              Acknowledge
                            </Button>
                          )}
                          {alarm.status === 'ACKNOWLEDGED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                clearAlarm.mutate({ alarmId: alarm.id })
                              }
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
