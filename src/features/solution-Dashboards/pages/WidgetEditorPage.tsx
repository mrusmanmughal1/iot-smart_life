import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Layout } from 'react-grid-layout';
import {
  WidgetCanvas,
  Widget,
  buildDashboardPayload,
} from '@/components/common/WidgetCanvas/WidgetCanvas';
import { Card, CardContent } from '@/components/ui/card';
import { dashboardsApi, Dashboard } from '@/services/api';
import toast from 'react-hot-toast';

interface DashboardPayload {
  widgets: Array<{
    type: string;
    title: string;
    position: { x: number; y: number; w: number; h: number };
    dataSource: {
      deviceIds: string[];
      telemetryKeys: string[];
      timeRange: string;
    };
    visualization: {
      chartType: string;
      colors: string[];
      showLegend: boolean;
    };
    filters: Record<string, unknown>;
  }>;
  layout: {
    cols: number;
    rowHeight: number;
  };
  settings: {
    autoRefresh: boolean;
    refreshInterval: number;
  };
}

export default function WidgetEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [savedLayout, setSavedLayout] = useState<Layout[]>([]);
  const [savedWidgets, setSavedWidgets] = useState<Widget[]>([]);

  // Fetch dashboard data if editing an existing dashboard
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard', id],
    queryFn: () => {
      if (!id) throw new Error('Dashboard ID is required');
      return dashboardsApi.getById(id);
    },
    enabled: !!id,
  });

  const dashboard = dashboardData?.data?.data;

  // Load saved layout/widgets from the fetched dashboard configuration
  useEffect(() => {
    if (!dashboard?.configuration?.widgets) return;

    const configWidgets = dashboard.configuration.widgets;
    const mappedWidgets: Widget[] = configWidgets.map((w) => ({
      id: w.id,
      type: w.widgetTypeId,
      title:
        (w.config as { title?: string } | undefined)?.title || w.widgetTypeId,
      position: w.position,
      config: w.config,
    }));

    const mappedLayout: Layout[] = configWidgets.map((w) => ({
      i: w.id,
      x: w.position.x,
      y: w.position.y,
      w: w.position.w,
      h: w.position.h,
    }));

    setSavedLayout(mappedLayout);
    setSavedWidgets(mappedWidgets);
  }, [dashboard]);

  /**
   * Called by WidgetCanvas "Save Layout" button.
   * Saves locally and POSTs to /dashboards with the full expected payload.
   */
  const handleSaveLayout = async (
    layout: Layout[],
    widgets: Widget[],
    payload?: DashboardPayload
  ) => {
    // 1. Persist in localStorage
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
    setSavedLayout(layout);
    setSavedWidgets(widgets);

    // 2. Build full dashboard payload (format expected by /dashboards)
    const dashboardPayload = payload || buildDashboardPayload(widgets, layout);

    console.log('[WidgetEditorPage] Posting to /dashboards:', dashboardPayload);

    // 3. POST to /dashboards
    if (!id) {
      toast.error('Dashboard ID is missing. Cannot save to /dashboards.');
      return;
    }

    try {
      await dashboardsApi.update(id, dashboardPayload as Partial<Dashboard>);
      toast.success('Dashboard saved to /dashboards successfully!');
    } catch (err: unknown) {
      toast.error('Try ');
      // Surface API error but still confirm local save
      const apiError = err as {
        response?: { data?: unknown };
        message?: string;
      };
      console.error(
        '/dashboards API error:',
        apiError?.response?.data || apiError?.message
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load dashboard</p>
          <p className="text-sm text-gray-500">
            {(error as Error)?.message || 'An error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {dashboard?.name || 'Dashboard Editor'}
          </h1>
          <p className="text-xs text-gray-500">
            Add widgets → configure device &amp; telemetry settings → save to
            &nbsp;<code className="font-mono text-primary">/dashboards</code>
          </p>
        </div>
      </div>

      {/* Canvas */}
      <Card>
        <CardContent
          className="p-0"
          style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}
        >
          <WidgetCanvas
            onSaveLayout={handleSaveLayout}
            initialLayout={savedLayout}
            initialWidgets={savedWidgets}
          />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            How to use:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>
              Click <strong>"Widget Library"</strong> to browse Smart Life
              widget bundles and add widgets
            </li>
            <li>
              Click the <strong>⚙ Settings</strong> icon on any widget header to
              open the Device &amp; Telemetry Settings modal
            </li>
            <li>
              Select one or more <strong>devices</strong> and
              <strong> telemetry keys</strong> (e.g.&nbsp;temperature, humidity)
              to bind the widget to real data
            </li>
            <li>Drag and resize widgets to arrange your dashboard layout</li>
            <li>
              Click <strong>"Save Layout"</strong> to POST the full dashboard
              payload to the <code className="font-mono">/dashboards</code> API
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
