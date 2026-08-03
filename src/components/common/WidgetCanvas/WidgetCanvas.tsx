import { useState, useCallback } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { Plus, Trash2, Settings, Maximize2, Layers, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WidgetSettingsModal } from './WidgetSettingsModal';
import { WidgetRenderer } from './WidgetRenderer';
import { WidgetLibraryModal } from './WidgetLibraryModal';
import { dashboardsApi } from '@/services/api/dashboards.api';
import toast from 'react-hot-toast';
import type {
  TelemetryWidgetConfig,
  DeviceTelemetry,
  MetricType,
} from './TelemetryWidget';
import type { WidgetType } from '@/services/api/widgets.api';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export interface WidgetDataSource {
  deviceIds: string[];
  telemetryKeys: string[];
  timeRange: string;
}

export interface WidgetVisualization {
  chartType: string;
  colors: string[];
  showLegend: boolean;
}

export interface Widget {
  id: string;
  type: string;
  title: string;
  category?: string;
  description?: string;
  descriptor?: any;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  dataSource?: WidgetDataSource;
  visualization?: WidgetVisualization;
  filters?: Record<string, any>;
  content?: DeviceTelemetry[];
  config?: TelemetryWidgetConfig;
}

export function buildDashboardPayload(widgets: Widget[], layout: Layout[]) {
  const formattedWidgets = widgets.map((widget) => {
    const layoutItem = layout.find((l) => l.i === widget.id);
    const pos = {
      x: layoutItem?.x ?? widget.position?.x ?? 0,
      y: layoutItem?.y ?? widget.position?.y ?? 0,
      w: layoutItem?.w ?? widget.position?.w ?? 4,
      h: layoutItem?.h ?? widget.position?.h ?? 4,
    };

    return {
      type: widget.type,
      title: widget.title,
      position: pos,
      dataSource: {
        deviceIds:
          widget.dataSource?.deviceIds ||
          (widget.config?.deviceId ? [widget.config.deviceId] : []),
        telemetryKeys:
          widget.dataSource?.telemetryKeys ||
          widget.config?.enabledMetrics ||
          [],
        timeRange: widget.dataSource?.timeRange || '24h',
      },
      visualization: {
        chartType: widget.visualization?.chartType || 'line',
        colors: widget.visualization?.colors || ['#3b82f6'],
        showLegend: widget.visualization?.showLegend ?? true,
      },
      filters: widget.filters || {},
    };
  });

  return {
    widgets: formattedWidgets,
    layout: {
      cols: 12,
      rowHeight: 100,
    },
    settings: {
      autoRefresh: true,
      refreshInterval: 30,
    },
  };
}

interface WidgetCanvasProps {
  onSaveLayout?: (layout: Layout[], widgets: Widget[], payload?: any) => void;
  initialLayout?: Layout[];
  initialWidgets?: Widget[];
  readOnly?: boolean;
  dashboardMetadata?: {
    name?: string;
    description?: string;
    customerId?: string;
    visibility?: string;
    tags?: string[];
  };
}

export function WidgetCanvas({
  onSaveLayout,
  initialLayout = [],
  initialWidgets = [],
  readOnly = false,
}: WidgetCanvasProps) {
  const [layout, setLayout] = useState<Layout[]>(initialLayout);
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [showWidgetLibraryModal, setShowWidgetLibraryModal] = useState(false);
  const [selectedSettingWidget, setSelectedSettingWidget] =
    useState<Widget | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      setLayout(newLayout);
      if (onSaveLayout && !readOnly) {
        const payload = buildDashboardPayload(widgets, newLayout);
        onSaveLayout(newLayout, widgets, payload);
      }
    },
    [widgets, onSaveLayout, readOnly]
  );

  // Add Widget from API Widget Library Selection
  const handleAddWidgetFromType = useCallback(
    (widgetType: WidgetType) => {
      console.log(widgetType);
      const alias =
        widgetType.descriptor?.alias || widgetType.category || 'telemetry';
      const newWidget: Widget = {
        id: `widget-${Date.now()}`,
        type: alias,
        title: widgetType.name,
        category: widgetType.category as string,
        description: widgetType.description || '',
        descriptor: widgetType.descriptor,
        dataSource: {
          deviceIds: [],
          telemetryKeys: [],
          timeRange: '24h',
        },
        visualization: {
          chartType: 'line',
          colors: ['#3b82f6'],
          showLegend: true,
        },
        config: {
          refreshInterval: 5000,
          enabledMetrics: [
            'temperature',
            'humidity',
            'battery',
            'power',
            'signal',
          ] as MetricType[],
        },
      };

      const w = widgetType.descriptor?.sizeX || 4;
      const h = widgetType.descriptor?.sizeY || 4;

      const newLayoutItem: Layout = {
        i: newWidget.id,
        x: (layout.length * 4) % 12,
        y: Infinity, // puts it at the bottom of the grid
        w,
        h,
        minW: widgetType.descriptor?.minSizeX || 2,
        minH: widgetType.descriptor?.minSizeY || 2,
      };

      setWidgets((prev) => [...prev, newWidget]);
      setLayout((prev) => [...prev, newLayoutItem]);
      setShowWidgetLibraryModal(false);
      // Automatically open the settings modal so the user can select
      // the device and telemetry keys right after adding the widget
      setSelectedSettingWidget(newWidget);
    },
    [layout.length]
  );

  const handleRemoveWidget = useCallback((widgetId: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    setLayout((prev) => prev.filter((l) => l.i !== widgetId));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    const payload = buildDashboardPayload(widgets, layout);

    if (onSaveLayout) {
      onSaveLayout(layout, widgets, payload);
    }

    try {
      await dashboardsApi.create(payload as any);
      toast.success('Dashboard saved to /dashboards API successfully!');
    } catch (err: any) {
      console.warn('Backend /dashboards API response:', err?.message);
    } finally {
      setIsSaving(false);
    }
  }, [layout, widgets, onSaveLayout]);

  const handleSaveWidgetSettings = useCallback(
    (
      widgetId: string,
      dataSource: WidgetDataSource,
      visualization: WidgetVisualization
    ) => {
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widgetId
            ? {
                ...w,
                dataSource,
                visualization,
                config: {
                  ...w.config,
                  deviceId: dataSource.deviceIds[0],
                  enabledMetrics: dataSource.telemetryKeys as any,
                },
              }
            : w
        )
      );
    },
    []
  );

  return (
    <div className="relative w-full h-full bg-gray-50 rounded-lg">
      {/* Toolbar */}
      {!readOnly && (
        <div className="absolute -top-18 right-4 z-40 flex items-center gap-2">
          <Button
            onClick={() => setShowWidgetLibraryModal(true)}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-md font-medium"
          >
            <Layers className="h-4 w-4 mr-2 text-primary" />
            Widget Library
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-white hover:bg-primary/90 shadow-md font-medium flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Layout'}
          </Button>
        </div>
      )}
      {/* Widget Library Modal */}
      <WidgetLibraryModal
        isOpen={showWidgetLibraryModal}
        onClose={() => setShowWidgetLibraryModal(false)}
        onSelectWidgetType={handleAddWidgetFromType}
      />

      {/* Widget Settings Modal for Device & Telemetry Selection */}
      <WidgetSettingsModal
        open={!!selectedSettingWidget}
        onOpenChange={(open) => !open && setSelectedSettingWidget(null)}
        widget={selectedSettingWidget}
        onSave={handleSaveWidgetSettings}
      />
      {/* Canvas */}
      <div className="h-full overflow-auto bg-gray-100 dark:bg-gray-800  ">
        {widgets.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <button
              onClick={() => setShowWidgetLibraryModal(true)}
              className="flex flex-col items-center justify-center gap-3 px-12 py-10 border-3 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl hover:border-primary hover:bg-white dark:hover:bg-gray-900 transition-all group"
            >
              <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8" />
              </div>
              <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Add New Widget from Library
              </span>
              <span className="text-xs text-gray-500 max-w-xs text-center">
                Browse Smart Life Widget Bundles including Charts, Gauges,
                Cards, Maps & Alarms
              </span>
            </button>
          </div>
        ) : (
          <GridLayout
            className="layout"
            layout={layout}
            onLayoutChange={handleLayoutChange}
            cols={12}
            rowHeight={30}
            width={1200}
            isDraggable={!readOnly}
            isResizable={!readOnly}
            draggableHandle=".drag-handle"
            draggableCancel=".no-drag"
          >
            {widgets.map((widget) => (
              <div key={widget.id} className="widget-container">
                <Card className="h-full shadow-lg border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors flex flex-col overflow-hidden">
                  {/* Widget Header */}
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="drag-handle flex items-center gap-2 truncate cursor-move flex-1">
                      <Maximize2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                        {widget.title}
                      </span>
                    </div>
                    {!readOnly && (
                      <div
                        className="no-drag flex items-center gap-1 shrink-0"
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSettingWidget(widget);
                          }}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-600 dark:text-gray-300 relative z-20 cursor-pointer"
                          title="Configure Device & Telemetry Settings"
                        >
                          <Settings className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveWidget(widget.id);
                          }}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors text-red-600 dark:text-red-400 relative z-20 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Widget Content */}
                  <CardContent className="p-2 flex-1 overflow-auto bg-white dark:bg-gray-900">
                    <WidgetRenderer
                      widget={widget}
                      onDeviceChange={(deviceId) => {
                        setWidgets((prev) =>
                          prev.map((w) =>
                            w.id === widget.id
                              ? { ...w, config: { ...w.config, deviceId } }
                              : w
                          )
                        );
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
          </GridLayout>
        )}
      </div>
    </div>
  );
}
