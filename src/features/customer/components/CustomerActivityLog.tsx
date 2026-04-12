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

const CustomerActivityLog = ({
  customerId,
  title,
}: {
  customerId: string;
  title: string;
}) => {
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
    <div className="space-y-2">
      <div className=" grid grid-cols-3  bg-primary text-white p-2 font-semibold  ">
        <div className="">
          <p>Description</p>
        </div>
        <div className="">
          <p>Action</p>
        </div>
        <div className="">
          <p>Date</p>
        </div>
      </div>
      {auditLogs?.map((item) => (
        <div
          key={item.id}
          className="grid w-full grid-cols-3 gap-4 border-b border-gray-200 bg-white  p-3 shadow-sm dark:bg-gray-900 dark:border-gray-700"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.title}
              </p>
            </div>
            {item.description && (
              <p className="text-sm  capitalize text-gray-600 dark:text-white">
                {item.description}
              </p>
            )}
          </div>
          <div className=" text-xs ">
            {item.action && <Badge variant="default">{item.action}</Badge>}
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
