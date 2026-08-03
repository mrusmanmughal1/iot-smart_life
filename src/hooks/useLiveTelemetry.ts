import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ws } from '@/lib/websocket';
import { telemetryApi, TelemetryData } from '@/services/api';

interface LiveTelemetryResult {
  data: TelemetryData | undefined;
  isLive: boolean;
  isConnecting: boolean;
  isLoading: boolean;
  connectionState: 'connected' | 'connecting' | 'polling' | 'offline';
}

interface TelemetryWsPayload {
  deviceId?: string;
  timestamp?: string;
  data?: Record<string, unknown>;
  temperature?: number | null;
  humidity?: number | null;
  pressure?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  batteryLevel?: number | null;
  signalStrength?: number | null;
  metadata?: Record<string, unknown>;
  id?: string;
  device?: {
    id?: string;
    key?: string;
  };
  telemetry?: {
    data?: Record<string, unknown>;
    timestamp?: string;
    temperature?: number | null;
    humidity?: number | null;
    pressure?: number | null;
    latitude?: number | null;
    longitude?: number | null;
    batteryLevel?: number | null;
    signalStrength?: number | null;
    metadata?: Record<string, unknown>;
  };
}

/**
 * Subscribes to real-time telemetry for a device over WebSocket.
 *
 * - Attempts to connect the shared WS client (lazy, once per deviceId).
 * - Subscribes to `telemetry:latest` push messages that carry the deviceId.
 * - Also accepts a configurable event name for backend-specific push channels.
 * - Falls back to REST polling every 5s automatically when the WS is
 *   unavailable so widgets always keep showing fresh data.
 */
export function useLiveTelemetry(
  deviceId: string | null | undefined,
  eventName: string = 'telemetry:latest',
  pollIntervalMs: number = 5000
): LiveTelemetryResult {
  const validDeviceId =
    deviceId && !deviceId.includes('device-uuid') ? deviceId : null;

  const [liveData, setLiveData] = useState<TelemetryData | undefined>(
    undefined
  );
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  const deviceIdRef = useRef<string | null>(null);
  const eventRef = useRef<string>(eventName);
  const liveDataRef = useRef<TelemetryData | undefined>(undefined);

  deviceIdRef.current = validDeviceId;
  eventRef.current = eventName;

  const handleTelemetryMessage = useCallback((payload: TelemetryWsPayload) => {
    if (!payload) return;

    // Normalise payload shapes the backend might send:
    //   { deviceId, data, timestamp, ... }
    //   { device: { id }, telemetry: { data }, ... }
    //   { id, data, ... }  (id === deviceId)
    let messageDeviceId: string | undefined;
    let telemetry: TelemetryData | undefined;

    if (payload.deviceId) {
      messageDeviceId = payload.deviceId;
      telemetry = payload as TelemetryData;
    } else if (payload.device?.id) {
      messageDeviceId = payload.device.id;
      telemetry = {
        ...(payload.telemetry || {}),
        deviceId: messageDeviceId,
        deviceKey: payload.device?.key || '',
        data: payload.telemetry?.data || payload.data || {},
        timestamp:
          payload.telemetry?.timestamp ||
          payload.timestamp ||
          new Date().toISOString(),
        temperature:
          payload.telemetry?.temperature ?? payload.temperature ?? null,
        humidity: payload.telemetry?.humidity ?? payload.humidity ?? null,
        pressure: payload.telemetry?.pressure ?? payload.pressure ?? null,
        latitude: payload.telemetry?.latitude ?? payload.latitude ?? null,
        longitude: payload.telemetry?.longitude ?? payload.longitude ?? null,
        batteryLevel:
          payload.telemetry?.batteryLevel ?? payload.batteryLevel ?? null,
        signalStrength:
          payload.telemetry?.signalStrength ?? payload.signalStrength ?? null,
        metadata: payload.telemetry?.metadata || payload.metadata || {},
      } as TelemetryData;
    } else if (payload.id) {
      messageDeviceId = payload.id;
      telemetry = payload as TelemetryData;
    }

    if (!messageDeviceId || !telemetry) return;

    // Only apply the push if it matches the device this hook is watching
    if (deviceIdRef.current && messageDeviceId === deviceIdRef.current) {
      liveDataRef.current = telemetry;
      setLiveData(telemetry);
      setIsLive(true);
    }
  }, []);

  // --- Connect the shared WS client and subscribe ---
  useEffect(() => {
    if (!validDeviceId) {
      setIsLive(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;
    let cancelled = false;

    const connectAndSubscribe = async () => {
      if (!cancelled) setIsConnecting(true);

      try {
        await ws.connect();
        if (cancelled) return;

        setWsConnected(true);
        setIsConnecting(false);

        unsubscribe = ws.subscribe(eventRef.current, handleTelemetryMessage);

        // Tell the backend which device we want pushed (best-effort)
        ws.send('telemetry:subscribe', {
          deviceId: validDeviceId,
        });
      } catch {
        // WS unavailable -> polling fallback continues below
        if (!cancelled) {
          setWsConnected(false);
          setIsConnecting(false);
        }
      }
    };

    connectAndSubscribe();

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
      setWsConnected(false);
      setIsLive(false);
    };
  }, [validDeviceId, handleTelemetryMessage]);

  // --- Fallback REST polling (active when WS not connected) ---
  const { data: pollData, isLoading: isPolling } = useQuery({
    queryKey: ['widget-telemetry-live', validDeviceId],
    queryFn: () =>
      validDeviceId
        ? telemetryApi.getLatest(validDeviceId)
        : Promise.resolve(null),
    enabled: !!validDeviceId && !wsConnected && !isConnecting && !isLive,
    refetchInterval: wsConnected || isLive ? false : pollIntervalMs,
  });

  // When a fresh poll response arrives and we aren't receiving live push,
  // update the local data (still flagged as polling).
  useEffect(() => {
    if (pollData?.data?.data && !isLive) {
      const pd = pollData.data.data;
      liveDataRef.current = pd;
      setLiveData(pd);
    }
  }, [pollData, isLive]);

  const connectionState: LiveTelemetryResult['connectionState'] = isLive
    ? 'connected'
    : isConnecting
      ? 'connecting'
      : wsConnected
        ? 'connected'
        : isPolling
          ? 'polling'
          : 'offline';

  return {
    data: liveData,
    isLive,
    isConnecting,
    isLoading: isConnecting || isPolling,
    connectionState,
  };
}
