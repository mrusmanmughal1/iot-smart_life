import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { alarmsApi } from '@/services/api';
import { AlarmSeverity, AlarmStatus } from '@/services/api/alarms.api';

interface DeviceAlarmsTabProps {
  deviceId: string;
}

export const DeviceAlarmsTab: React.FC<DeviceAlarmsTabProps> = ({ deviceId }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState<string>('24h');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch alarms for the device
  const { data: alarmsData, isLoading: alarmsLoading, refetch } = useQuery({
    queryKey: ['device-alarms', deviceId, statusFilter, severityFilter, timeRangeFilter, currentPage],
    queryFn: async () => {
      return alarmsApi.getByDevice(deviceId);
    },
    enabled: !!deviceId,
  });

  const alarms = useMemo(() => {
    const allAlarms = alarmsData?.data?.data || [];
    return allAlarms.filter((alarm: { status: string; severity: string }) => {
      if (statusFilter !== 'all' && alarm.status !== statusFilter) return false;
      if (severityFilter !== 'all' && alarm.severity !== severityFilter) return false;
      return true;
    });
  }, [alarmsData, statusFilter, severityFilter]);

  // Calculate alarm statistics
  const alarmStats = useMemo(() => {
    const active = alarms.filter((a: { status: string }) => a.status === AlarmStatus.ACTIVE).length;
    const critical = alarms.filter((a: { severity: string; status: string }) => a.severity === AlarmSeverity.CRITICAL && a.status === AlarmStatus.ACTIVE).length;
    const major = alarms.filter((a: { severity: string; status: string }) => a.severity === AlarmSeverity.MAJOR && a.status === AlarmStatus.ACTIVE).length;
    const warning = alarms.filter((a: { severity: string; status: string }) => a.severity === AlarmSeverity.WARNING && a.status === AlarmStatus.ACTIVE).length;
    return { active, critical, major, warning };
  }, [alarms]);

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case AlarmSeverity.CRITICAL:
        return 'bg-purple-100 text-purple-700';
      case AlarmSeverity.MAJOR:
        return 'bg-yellow-100 text-yellow-700';
      case AlarmSeverity.MINOR:
        return 'bg-blue-100 text-blue-700';
      case AlarmSeverity.WARNING:
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusDot = (status: string) => {
    return status === AlarmStatus.ACTIVE ? (
      <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></span>
    ) : (
      <span className="w-2 h-2 bg-orange-500 rounded-full inline-block mr-2"></span>
    );
  };

  const handleEditAlarm = (alarmId: string) => {
    // TODO: Implement edit alarm
    console.log('Edit alarm:', alarmId);
    toast('Edit alarm functionality coming soon', { icon: 'ℹ️' });
  };

  const handleDeleteAlarm = async (alarmId: string) => {
    if (window.confirm('Are you sure you want to delete this alarm?')) {
      try {
        await alarmsApi.delete(alarmId);
        toast.success('Alarm deleted successfully');
        refetch();
      } catch {
        toast.error('Failed to delete alarm');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Alarm Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Active Alarms</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{alarmStats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Critical</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{alarmStats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Major</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{alarmStats.major}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Warning</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{alarmStats.warning}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filters:</span>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600">Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={AlarmStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={AlarmStatus.ACKNOWLEDGED}>Acknowledged</SelectItem>
                  <SelectItem value={AlarmStatus.CLEARED}>Cleared</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600">Severity:</Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value={AlarmSeverity.CRITICAL}>Critical</SelectItem>
                  <SelectItem value={AlarmSeverity.MAJOR}>Major</SelectItem>
                  <SelectItem value={AlarmSeverity.MINOR}>Minor</SelectItem>
                  <SelectItem value={AlarmSeverity.WARNING}>Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600">Time Range:</Label>
              <Select value={timeRangeFilter} onValueChange={setTimeRangeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => refetch()}
            >
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alarms Table */}
      <Card>
        <CardContent className="p-0">
          {alarmsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white">SEVERITY</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white">TYPE</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white">STATUS</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white">CREATED TIME</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white">UPDATED TIME</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white">MESSAGE</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white">ACKNOWLEDGED</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alarms.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 px-4 text-center text-gray-500">
                          No alarms found
                        </td>
                      </tr>
                    ) : (
                      alarms.map((alarm: { id: string; severity: string; type: string; status: string; createdAt: string; updatedAt: string; ackTime?: string; details?: { message?: string } }) => (
                        <tr
                          key={alarm.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <Badge
                              className={`rounded-full px-3 py-1 text-xs ${getSeverityBadgeColor(
                                alarm.severity
                              )}`}
                            >
                              {alarm.severity}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">{alarm.type}</td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            <div className="flex items-center">
                              {getStatusDot(alarm.status)}
                              {alarm.status}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {alarm.createdAt ? format(new Date(alarm.createdAt), 'yyyy-MM-dd') : '-'}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {alarm.updatedAt ? format(new Date(alarm.updatedAt), 'yyyy-MM-dd') : '-'}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {alarm.details?.message || alarm.type || '-'}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {alarm.ackTime ? 'YES' : 'NO'}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditAlarm(alarm.id)}
                                className="h-8 px-3"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                EDIT
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAlarm(alarm.id)}
                                className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                DELETE
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {alarms.length > 0 && (
                <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600 px-4">
                    Page {currentPage}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

