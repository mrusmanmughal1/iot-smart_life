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
import { formatDistanceToNow } from 'date-fns';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

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
  const { data: stats } = useGetStatsAlaram();
  const statsDataByStatus = stats?.data?.byStatus;

  const statusCards = [
    {
      key: 'active' as const,
      label: t('alarms.activeAlarms'),
      icon: <AlertTriangle className="h-6 w-6 text-white" />,
      cardClassName: 'bg-primary text-white',
    },
    {
      key: 'acknowledged' as const,
      label: t('alarms.acknowledgedAlarms'),
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      cardClassName: 'bg-secondary text-white',
    },
    {
      key: 'cleared' as const,
      label: t('alarms.clearedAlarms'),
      icon: <XCircle className="h-6 w-6 text-white" />,
      cardClassName: 'bg-success text-white',
    },
    {
      key: 'resolved' as const,
      label: t('alarms.resolvedAlarms'),
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      cardClassName: 'bg-neutral-500 text-white',
    },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('alarms.title')}
        description={t('alarms.description')}
      />
      <div className="grid gap-6 md:grid-cols-4">
        {statusCards.map((card) => (
          <Card key={card.key} className={card.cardClassName}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                {card.label}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsDataByStatus?.[card.key] || 0}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="py-4">
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table>
              <TableHeader className="bg-primary text-white">
                <TableRow>
                  <TableHead>{t('alarms.table.severity')}</TableHead>
                  <TableHead>{t('alarms.table.type')}</TableHead>
                  <TableHead>{t('alarms.table.originator')}</TableHead>
                  <TableHead>{t('alarms.table.status')}</TableHead>
                  <TableHead>{t('alarms.table.created')}</TableHead>
                  <TableHead>{t('alarms.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alarms.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-slate-500"
                    >
                      {t('alarms.table.noData')}
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
                              {t('alarms.acknowledge')}
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
                              {t('alarms.clear')}
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
