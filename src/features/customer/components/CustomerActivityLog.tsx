import { Badge } from '@/components/ui/badge';
import { useAuditLogsByCustomerId } from '@/features/audit/hooks';

export type CustomerActivityLogItem = {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  status?: 'info' | 'success' | 'warning';
};

const statusStyles: Record<
  NonNullable<CustomerActivityLogItem['status']>,
  string
> = {
  info: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
};

const CustomerActivityLog = ({ customerId, title }: { customerId: string, title: string }) => {
  const { data: auditLogsData } = useAuditLogsByCustomerId(customerId, 1, 10);
  const auditLogs = auditLogsData?.data;
  if (auditLogs?.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 p-6 text-sm text-gray-600 dark:text-white">
        No activity available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      {auditLogs?.map((item) => (
        <div
          key={item.id}
          className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:bg-gray-900 dark:border-gray-700"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.title}
              </p>
              {item.status && (
                <Badge
                  // className={`border-0 ${statusStyles[item.status]}`}
                  variant="secondary"
                >
                  {item.status}
                </Badge>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-gray-600 dark:text-white">
                {item.description}
              </p>
            )}
          </div>
          {item.timestamp && (
            <span className="text-xs text-gray-500 dark:text-white">
              {new Date(item.timestamp).toLocaleString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomerActivityLog;
