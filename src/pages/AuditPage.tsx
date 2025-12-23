import { FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuditLogs } from '@/features/audit/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout';
import type { AuditLog } from '@/services/api/audit.api';

export default function AuditPage() {
  const { data: auditData, isLoading } = useAuditLogs();

  // Handle nested API response structure: { data: { data: { data: AuditLog[], meta: {...} } } }
  const apiResponse = auditData?.data as unknown as
    | { data?: { data?: AuditLog[] } }
    | undefined;
  const logs = apiResponse?.data?.data || [];
  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: 'success',
      UPDATE: 'info',
      DELETE: 'destructive',
      LOGIN: 'default',
      LOGOUT: 'secondary',
    };
    return colors[action] || 'default';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-slate-500 mt-2">
            Track all system activities and changes
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">{logs.length}</div> */}
              <p className="text-xs text-slate-500">In the last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-slate-500">Currently online</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Entity Name</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: AuditLog) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant={getActionColor(log.action) as 'default' | 'destructive' | 'secondary' | 'outline' | 'success'}>
                          {log.action.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.entityType}</TableCell>
                      <TableCell>{log.entityName}</TableCell>
                      <TableCell>{log.userName}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(log.createdAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={log.success ? 'success' : 'destructive'}
                        >
                          {log.success ? 'Success' : 'Failed'}
                        </Badge>
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
