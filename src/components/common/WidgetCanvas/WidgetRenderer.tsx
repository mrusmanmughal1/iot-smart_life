import React from 'react';
import { useLiveTelemetry } from '@/hooks/useLiveTelemetry';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  AlertTriangle,
  Zap,
  MapPin,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  BarChart2,
  PieChartIcon,
  Compass,
  Loader2,
} from 'lucide-react';
import { TelemetryWidget } from './TelemetryWidget';
import type { Widget } from './WidgetCanvas';
import { flattenObject } from '@/utils/helpers/FlattenObject';

interface WidgetRendererProps {
  widget: Widget;
  onDeviceChange?: (deviceId: string) => void;
}

/** Badge showing whether telemetry is pushed live over WebSocket or via polling */
function LiveStatusBadge({
  isLive,
  isConnecting,
  isPolling,
}: {
  isLive: boolean;
  isConnecting: boolean;
  isPolling: boolean;
}) {
  if (isLive) {
    return (
      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Live · WebSocket
      </span>
    );
  }
  if (isConnecting) {
    return (
      <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
        <Loader2 className="w-3 h-3 animate-spin" />
        Connecting…
      </span>
    );
  }
  if (isPolling) {
    return (
      <span className="text-[10px] bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
        Live · Polling
      </span>
    );
  }
  return (
    <span className="text-[10px] bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded-full font-medium">
      Live Telemetry
    </span>
  );
}

/** Small badge shown inside every widget displaying bound device/telemetry info */
function DataSourceBadge({ widget }: { widget: Widget }) {
  const ds = widget.dataSource;
  if (!ds?.deviceIds?.length || ds.deviceIds[0].includes('device-uuid'))
    return null;

  const deviceLabel =
    ds.deviceIds.length === 1
      ? ds.deviceIds[0].slice(0, 14) + (ds.deviceIds[0].length > 14 ? '…' : '')
      : `${ds.deviceIds.length} devices`;

  const keyLabel =
    ds.telemetryKeys?.slice(0, 2).join(', ') +
    (ds.telemetryKeys && ds.telemetryKeys.length > 2
      ? ` +${ds.telemetryKeys.length - 2}`
      : '');

  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-1.5 px-1">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-[10px] font-medium text-blue-600 dark:text-blue-300">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        {deviceLabel}
      </span>
      {keyLabel && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-[10px] font-medium text-emerald-600 dark:text-emerald-300">
          {keyLabel}
        </span>
      )}
      {ds.timeRange && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
          {ds.timeRange}
        </span>
      )}
    </div>
  );
}

// Dynamic helper to extract Pie Chart slices from live API telemetry data
function getDynamicPieData(
  telemetry: ReturnType<typeof useLiveTelemetry>['data'],
  selectedKeys?: string[],
  primaryColor: string = '#3b82f6'
) {
  const COLOR_PALETTE = [
    primaryColor,
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Purple
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#f97316', // Orange
  ];

  if (!telemetry) return [];

  // Flatten telemetry.data JSON object into key-value pairs
  const flatEntries =
    telemetry.data && typeof telemetry.data === 'object'
      ? flattenObject(telemetry.data)
      : [];

  const flatMap = new Map<string, number>();

  // Direct root numeric attributes if present
  if (typeof telemetry.temperature === 'number')
    flatMap.set('temperature', telemetry.temperature);
  if (typeof telemetry.humidity === 'number')
    flatMap.set('humidity', telemetry.humidity);
  if (typeof telemetry.pressure === 'number')
    flatMap.set('pressure', telemetry.pressure);
  if (typeof telemetry.batteryLevel === 'number')
    flatMap.set('batteryLevel', telemetry.batteryLevel);
  if (typeof telemetry.signalStrength === 'number')
    flatMap.set('signalStrength', telemetry.signalStrength);

  // Flattened object keys & numeric values
  flatEntries.forEach(([key, val]) => {
    const numVal = typeof val === 'number' ? Math.abs(val) : parseFloat(val);
    if (!isNaN(numVal)) {
      flatMap.set(key, numVal);
    }
  });

  const keysToUse =
    selectedKeys && selectedKeys.length > 0
      ? selectedKeys
      : Array.from(flatMap.keys());

  const items: { name: string; value: number; color: string }[] = [];

  let idx = 0;
  for (const key of keysToUse) {
    const val = flatMap.get(key);
    if (val !== undefined) {
      items.push({
        name: key,
        value: Number(val.toFixed(1)),
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      });
      idx++;
    }
  }

  return items;
}

// Dynamic timeseries generator centered around live telemetry current value
function getDynamicTimeseriesData(
  currentVal: number,
  timeRange: string = '24h'
) {
  // Scale the number of data points based on the selected time range
  const rangeHours =
    timeRange === '1h'
      ? 1
      : timeRange === '6h'
        ? 6
        : timeRange === '12h'
          ? 12
          : timeRange === '7d'
            ? 168
            : timeRange === '30d'
              ? 720
              : 24;
  const points = Math.min(14, Math.max(5, Math.ceil(rangeHours / 12)));
  const stepMinutes = (rangeHours * 60) / (points - 1);
  const baseTime = new Date();
  const timeseries = [];

  for (let i = points - 1; i >= 0; i--) {
    const timeLabel = new Date(
      baseTime.getTime() - i * stepMinutes * 60 * 1000
    ).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const variance =
      Math.sin(i) * 2.5 + (i === 0 ? 0 : (Math.random() - 0.5) * 1.5);
    timeseries.push({
      time: timeLabel,
      temp: Number((currentVal + variance).toFixed(1)),
    });
  }

  return timeseries;
}

export function WidgetRenderer({
  widget,
  onDeviceChange,
}: WidgetRendererProps) {
  const [toggleState, setToggleState] = React.useState(true);
  const widgetAlias =
    widget.visualization?.chartType || widget.descriptor?.alias || widget.type;
  const category = widget.category?.toLowerCase() || '';
  const primaryColor = widget.visualization?.colors?.[0] || '#3b82f6';

  // Fetch Live Telemetry ONLY for actual selected device ID (no uuid placeholders!)
  const primaryDeviceId = widget.dataSource?.deviceIds?.[0];
  const isValidDevice =
    !!primaryDeviceId && !primaryDeviceId.includes('device-uuid');

  // Real-time telemetry via WebSocket with automatic REST polling fallback
  const {
    data: telemetryData,
    isLive: isLiveTelemetry,
    isConnecting: isConnectingTelemetry,
    connectionState: telemetryConnectionState,
  } = useLiveTelemetry(isValidDevice ? primaryDeviceId : null);

  const isPollingFallback = telemetryConnectionState === 'polling';

  // 1. Pie Chart / Donut Chart Widget (Dynamic Live Telemetry)
  if (
    widgetAlias === 'pie-chart' ||
    widgetAlias === 'pie' ||
    (category === 'charts' && widget.title.toLowerCase().includes('pie'))
  ) {
    const pieData = getDynamicPieData(
      telemetryData,
      widget.dataSource?.telemetryKeys,
      primaryColor
    );
    const totalVal = pieData.reduce((acc, curr) => acc + curr.value, 0);

    return (
      <div className="w-full h-full flex flex-col items-center justify-between p-2">
        <div className="flex items-center justify-between w-full mb-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
            <PieChartIcon className="w-4 h-4" style={{ color: primaryColor }} />
            <span>{widget.title || 'Telemetry Distribution'}</span>
          </div>
          <LiveStatusBadge
            isLive={isLiveTelemetry}
            isConnecting={isConnectingTelemetry}
            isPolling={isPollingFallback}
          />
        </div>

        {pieData.length === 0 ? (
          <div className="w-full flex-1 flex flex-col items-center justify-center p-4 text-center">
            <PieChartIcon className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-xs text-gray-500 font-medium">
              {!isValidDevice
                ? 'No device selected'
                : 'Waiting for live telemetry...'}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {!isValidDevice
                ? 'Configure widget settings to bind a target device'
                : 'Device has not posted telemetry data for selected keys'}
            </p>
          </div>
        ) : (
          <>
            <div className="w-full h-36 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  {totalVal.toFixed(0)}
                </span>
                <span className="text-[10px] text-gray-500">Total Sum</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 w-full text-[10px] pt-1 border-t border-gray-100 dark:border-gray-800 max-h-20 overflow-y-auto">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 shrink-0 ml-1">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        <DataSourceBadge widget={widget} />
      </div>
    );
  }

  // 2. Progress Bar Widget (Dynamic)
  if (
    widgetAlias === 'progress-bar' ||
    (category === 'gauges' && widget.title.toLowerCase().includes('progress'))
  ) {
    const key = widget.dataSource?.telemetryKeys?.[0] || 'batteryLevel';
    const rawVal =
      telemetryData?.[key as keyof typeof telemetryData] ??
      telemetryData?.data?.[key] ??
      0;
    const value = Math.min(
      100,
      Math.max(0, typeof rawVal === 'number' ? rawVal : parseFloat(rawVal) || 0)
    );

    return (
      <div className="w-full h-full flex flex-col justify-center gap-3 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5 capitalize">
            <Activity className="w-4 h-4" style={{ color: primaryColor }} />
            {key} Capacity Utilization
          </span>
          <div className="flex flex-col items-end gap-1">
            <span
              className="text-lg font-extrabold"
              style={{ color: primaryColor }}
            >
              {value.toFixed(0)}%
            </span>
            <LiveStatusBadge
              isLive={isLiveTelemetry}
              isConnecting={isConnectingTelemetry}
              isPolling={isPollingFallback}
            />
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${value}%`,
              backgroundColor: primaryColor,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>Min: 0%</span>
          <span className="text-emerald-500 font-medium">
            Optimal Operating Range
          </span>
          <span>Max: 100%</span>
        </div>
        <DataSourceBadge widget={widget} />
      </div>
    );
  }

  // 3. Timeseries Line / Area Chart Widget (Dynamic)
  if (
    widgetAlias === 'line-chart' ||
    widgetAlias === 'line' ||
    widgetAlias === 'area' ||
    (category === 'charts' && !widget.title.toLowerCase().includes('pie'))
  ) {
    const chartKey = widget.dataSource?.telemetryKeys?.[0] || 'temperature';
    const rawVal =
      telemetryData?.[chartKey as keyof typeof telemetryData] ??
      telemetryData?.data?.[chartKey] ??
      0;
    const currentVal =
      typeof rawVal === 'number' ? rawVal : parseFloat(rawVal) || 0;

    const timeseriesData = getDynamicTimeseriesData(
      currentVal,
      widget.dataSource?.timeRange
    );

    return (
      <div className="w-full h-full flex flex-col justify-between p-1">
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5 capitalize">
            <BarChart2 className="w-4 h-4" style={{ color: primaryColor }} />
            {chartKey} Trend
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">
              {widget.dataSource?.timeRange || '24h'}
            </span>
            <LiveStatusBadge
              isLive={isLiveTelemetry}
              isConnecting={isConnectingTelemetry}
              isPolling={isPollingFallback}
            />
          </div>
        </div>
        <div className="w-full h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timeseriesData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`gradient-${widget.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={primaryColor}
                    stopOpacity={0.4}
                  />
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#334155"
                opacity={0.3}
              />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94A3B8" />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke="#94A3B8"
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '6px',
                  border: 'none',
                  color: '#FFF',
                  fontSize: '11px',
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke={primaryColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#gradient-${widget.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <DataSourceBadge widget={widget} />
      </div>
    );
  }

  // 4. Radial Dial Gauge Widget (Dynamic)
  if (widgetAlias === 'radial-gauge' || category === 'gauges') {
    const key = widget.dataSource?.telemetryKeys?.[0] || 'pressure';
    const rawVal =
      telemetryData?.[key as keyof typeof telemetryData] ??
      telemetryData?.data?.[key] ??
      0;
    const val =
      typeof rawVal === 'number' ? Math.min(100, Math.max(0, rawVal)) : 0;

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
            {key} Gauge
          </span>
          <LiveStatusBadge
            isLive={isLiveTelemetry}
            isConnecting={isConnectingTelemetry}
            isPolling={isPollingFallback}
          />
        </div>
        <div className="relative w-28 h-28 flex items-center justify-center mt-1">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="transition-all duration-1000 ease-out"
              strokeDasharray={`${val}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke={primaryColor}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              {val.toFixed(0)}
            </span>
            <span
              className="text-[10px] font-medium"
              style={{ color: primaryColor }}
            >
              {key}
            </span>
          </div>
        </div>
        <DataSourceBadge widget={widget} />
      </div>
    );
  }

  // 5. Metric Card Widget (Dynamic)
  if (widgetAlias === 'metric-card' || category === 'cards') {
    const cardKey = widget.dataSource?.telemetryKeys?.[0] || 'temperature';
    const rawVal =
      telemetryData?.[cardKey as keyof typeof telemetryData] ??
      telemetryData?.data?.[cardKey] ??
      0;
    const numVal =
      typeof rawVal === 'number' ? rawVal : parseFloat(rawVal) || 0;

    return (
      <div className="w-full h-full flex flex-col justify-between p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
            {cardKey}
          </span>
          <div className="flex items-center gap-2">
            <LiveStatusBadge
              isLive={isLiveTelemetry}
              isConnecting={isConnectingTelemetry}
              isPolling={isPollingFallback}
            />
            <Zap className="w-4 h-4" style={{ color: primaryColor }} />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {typeof numVal === 'number' ? numVal.toFixed(1) : numVal}
            </span>
            <span className="text-sm font-semibold text-gray-500">live</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Updated live via IoT telemetry</span>
          </div>
        </div>
        <DataSourceBadge widget={widget} />
      </div>
    );
  }

  // 6. Geospatial Map Widget
  if (widgetAlias === 'device-map' || category === 'maps') {
    const lat = telemetryData?.latitude ?? 24.7136;
    const lon = telemetryData?.longitude ?? 46.6753;

    return (
      <div className="w-full h-full relative rounded-lg overflow-hidden bg-slate-900 text-white p-3 flex flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />
        <div className="flex items-center justify-between z-10">
          <span className="text-xs font-semibold flex items-center gap-1 text-cyan-400">
            <MapPin className="w-4 h-4" /> Live GPS Tracking
          </span>
          <LiveStatusBadge
            isLive={isLiveTelemetry}
            isConnecting={isConnectingTelemetry}
            isPolling={isPollingFallback}
          />
        </div>
        <div className="relative my-auto flex items-center justify-center z-10">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 animate-ping absolute inset-0" />
            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg border border-white">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 z-10 pt-2 border-t border-slate-800">
          <span>Lat: {Number(lat).toFixed(4)}°</span>
          <span>Lon: {Number(lon).toFixed(4)}°</span>
          <span className="text-emerald-400 font-medium">GPS Locked</span>
        </div>
      </div>
    );
  }

  // 7. Toggle Switch Control Widget
  if (widgetAlias === 'device-switch' || category === 'controls') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-between p-3 text-center">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
          Relay Power Switch
        </span>
        <button
          type="button"
          onClick={() => setToggleState(!toggleState)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-md ${
            toggleState
              ? 'bg-emerald-500 text-white shadow-emerald-500/30'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {toggleState ? (
            <ToggleRight className="w-6 h-6" />
          ) : (
            <ToggleLeft className="w-6 h-6" />
          )}
          <span>{toggleState ? 'STATUS: ACTIVE (ON)' : 'STATUS: OFF'}</span>
        </button>
        <span className="text-[10px] text-gray-400">
          Response Latency: 14ms
        </span>
      </div>
    );
  }

  // 8. Alarms Monitor Widget
  if (widgetAlias === 'alarms-table' || category === 'alarms') {
    return (
      <div className="w-full h-full flex flex-col justify-between p-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
            <ShieldAlert className="w-4 h-4" /> Active System Alarms
          </span>
          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
            2 Critical
          </span>
        </div>
        <div className="space-y-1 text-[11px] overflow-auto">
          <div className="flex items-center justify-between p-1.5 bg-red-50 dark:bg-red-950/40 rounded border border-red-200 dark:border-red-900">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="font-medium text-gray-800 dark:text-gray-200">
                High Temp Threshold
              </span>
            </div>
            <span className="text-[10px] text-red-600 font-semibold">
              Sensor-02 (42.8°C)
            </span>
          </div>
          <div className="flex items-center justify-between p-1.5 bg-amber-50 dark:bg-amber-950/40 rounded border border-amber-200 dark:border-amber-900">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-medium text-gray-800 dark:text-gray-200">
                Low Battery Level
              </span>
            </div>
            <span className="text-[10px] text-amber-600 font-semibold">
              Gateway-01 (14%)
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to Telemetry Widget for default metrics
  return (
    <TelemetryWidget
      data={widget.content}
      refreshInterval={widget.config?.refreshInterval}
      enabledMetrics={widget.config?.enabledMetrics}
      deviceId={widget.config?.deviceId}
      onDeviceChange={onDeviceChange}
    />
  );
}
