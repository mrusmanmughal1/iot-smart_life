import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Dot,
} from 'recharts';
import { format } from 'date-fns';
import { devicesApi } from '@/services/api';
import { useDevice } from '@/features/devices/hooks';

interface DeviceTelemetryTabProps {
  deviceId: string;
}

interface TelemetryKey {
  key: string;
  label: string;
  checked: boolean;
}

interface MessageRateData {
  month: string;
  value: number;
}

interface LatestValue {
  key: string;
  value: string;
  timestamp: string;
}

export const TelemetryDetails: React.FC<DeviceTelemetryTabProps> = ({ deviceId }) => {
  const { data: deviceData } = useDevice(deviceId);
  const device = deviceData?.data?.data;
  
  const [timeRange, setTimeRange] = useState<string>('1h');
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['temperature', 'humidity']);

  // Fetch device telemetry
  const { data: telemetryData, isLoading: telemetryLoading, refetch } = useQuery({
    queryKey: ['device-telemetry', deviceId, selectedKeys, timeRange],
    queryFn: async () => {
      if (!deviceId) return null;
      
      // Calculate time range
      const now = Date.now();
      let startTs: number;
      switch (timeRange) {
        case '1h':
          startTs = now - 60 * 60 * 1000;
          break;
        case '24h':
          startTs = now - 24 * 60 * 60 * 1000;
          break;
        case '7d':
          startTs = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case '30d':
          startTs = now - 30 * 24 * 60 * 60 * 1000;
          break;
        default:
          startTs = now - 24 * 60 * 60 * 1000;
      }

      return devicesApi.getTelemetry(deviceId, selectedKeys, startTs, now);
    },
    enabled: !!deviceId && selectedKeys.length > 0,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch latest telemetry values
  const { data: latestTelemetryData } = useQuery({
    queryKey: ['device-latest-telemetry', deviceId, selectedKeys],
    queryFn: async () => {
      if (!deviceId) return null;
      // Get latest telemetry for selected keys
      const now = Date.now();
      const oneHourAgo = now - 60 * 60 * 1000;
      return devicesApi.getTelemetry(deviceId, selectedKeys, oneHourAgo, now);
    },
    enabled: !!deviceId && selectedKeys.length > 0,
    refetchInterval: 10000, // Refresh every 10 seconds for latest values
  });

  // Available telemetry keys
  const telemetryKeys: TelemetryKey[] = [
    { key: 'temperature', label: 'Temperature', checked: selectedKeys.includes('temperature') },
    { key: 'humidity', label: 'Humidity', checked: selectedKeys.includes('humidity') },
    { key: 'pressure', label: 'Pressure', checked: selectedKeys.includes('pressure') },
  ];

  // Mock message rate data (replace with actual API call)
  const messageRateData: MessageRateData[] = useMemo(() => {
    // Generate sample data for the last 6 months
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    return months.map((month, index) => ({
      month,
      value: [15, 50, 45, 80, 70, 65][index] || 0,
    }));
  }, []);

  // Transform latest telemetry data
  const latestValues: LatestValue[] = useMemo(() => {
    if (!latestTelemetryData?.data?.data) return [];
    
    const telemetry = latestTelemetryData.data.data;
    const values: LatestValue[] = [];

    selectedKeys.forEach((key) => {
      const keyData = telemetry[key];
      if (keyData && Array.isArray(keyData) && keyData.length > 0) {
        const latest = keyData[keyData.length - 1];
        const timestamp = latest.ts ? new Date(latest.ts).toISOString() : new Date().toISOString();
        let formattedValue = String(latest.value || '-');
        
        // Format value with units
        if (key === 'temperature') {
          formattedValue = `${latest.value}°C`;
        } else if (key === 'humidity') {
          formattedValue = `${latest.value}%`;
        } else if (key === 'pressure') {
          formattedValue = `${latest.value} hPa`;
        }

        values.push({
          key: key.charAt(0).toUpperCase() + key.slice(1),
          value: formattedValue,
          timestamp,
        });
      }
    });

    return values;
  }, [latestTelemetryData, selectedKeys]);

  const handleKeyToggle = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleAddProfile = () => {
    // TODO: Implement add profile functionality
    console.log('Add profile clicked');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium text-gray-700">Time Range:</Label>
          <Select value={timeRange} onValueChange={setTimeRange} className="w-40"  >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRefresh}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <Button
          size="sm"
          onClick={handleAddProfile}
          className="bg-secondary hover:bg-secondary/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Profile
        </Button>
      </div>

      {/* Telemetry Keys */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Telemetry Keys:</Label>
        <div className="flex items-center gap-6">
          {telemetryKeys.map((telemetryKey) => (
            <div key={telemetryKey.key} className="flex items-center gap-2">
              <Checkbox
                id={telemetryKey.key}
                checked={telemetryKey.checked}
                // onCheckedChange={() => handleKeyToggle(telemetryKey.key)}
              />
              <Label
                htmlFor={telemetryKey.key}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {telemetryKey.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Message Rate Graph */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Message Rate (Last 24 Hours)
          </h3>
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={messageRateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  domain={[0, 150]}
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  ticks={[0, 25, 50, 75, 100, 125, 150]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#9333ea"
                  strokeWidth={2}
                  dot={{ fill: '#000', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            {/* Navigation Arrows */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  // TODO: Implement previous period navigation
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  // TODO: Implement next period navigation
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Latest Values Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Values</h3>
          {telemetryLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : latestValues.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No telemetry data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Key
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Value
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {latestValues.map((item, index) => (
                    <tr
                      key={`${item.key}-${index}`}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        {item.key}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{item.value}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {item.timestamp
                          ? format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm:ss')
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
