import { useState, useCallback } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { Plus, Trash2, Settings, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TelemetryWidget, availableDevices } from './TelemetryWidget';
import { TelemetryWidgetSettings } from './TelemetryWidgetSettings';
import type { TelemetryWidgetConfig, DeviceTelemetry, MetricType } from './TelemetryWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export interface Widget {
  id: string;
  type: 'temperature' | 'humidity' | 'battery' | 'power' | 'signal' | 'telemetry';
  title: string;
  content?: DeviceTelemetry[];
  config?: TelemetryWidgetConfig;
}

interface WidgetCanvasProps {
  onSaveLayout?: (layout: Layout[], widgets: Widget[]) => void;
  initialLayout?: Layout[];
  initialWidgets?: Widget[];
  readOnly?: boolean;
}

export function WidgetCanvas({
  onSaveLayout,
  initialLayout = [],
  initialWidgets = [],
  readOnly = false,
}: WidgetCanvasProps) {
  const [layout, setLayout] = useState<Layout[]>(initialLayout);
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [settingsWidgetId, setSettingsWidgetId] = useState<string | null>(null);

  console.log(layout, 'layout');
  console.log(widgets, 'widgets');

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      setLayout(newLayout);
      if (onSaveLayout && !readOnly) {
        onSaveLayout(newLayout, widgets);
      }
    },
    [widgets, onSaveLayout, readOnly]
  );

  const handleAddWidget = useCallback((widgetType: Widget['type']) => {
    const widgetTitles: Record<Widget['type'], string> = {
      temperature: 'Temperature Widget',
      humidity: 'Humidity Widget',
      battery: 'Battery Widget',
      power: 'Power Widget',
      signal: 'Signal Widget',
      telemetry: 'Live Device Telemetry',
    };

    const getDefaultConfig = (type: Widget['type']): TelemetryWidgetConfig => {
      if (type === 'telemetry') {
        return {
          refreshInterval: 5000,
          enabledMetrics: ['temperature', 'humidity', 'battery', 'power', 'signal'] as MetricType[],
        };
      }
      // For specific metric widgets, only show that metric
      return {
        refreshInterval: 5000,
        enabledMetrics: [type as MetricType],
        deviceId: availableDevices[0].id,
      };
    };

    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: widgetTitles[widgetType] || `New ${widgetType}`,
      config: getDefaultConfig(widgetType),
    };

    const newLayoutItem: Layout = {
      i: newWidget.id,
      x: (layout.length * 2) % 12,
      y: Infinity, // puts it at the bottom
      w: 4,
      h: 4,
      minW: 2,
      minH: 2,
    };

    setWidgets([...widgets, newWidget]);
    setLayout([...layout, newLayoutItem]);
    setShowWidgetLibrary(false);
  }, [layout, widgets]);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    setWidgets(widgets.filter((w) => w.id !== widgetId));
    setLayout(layout.filter((l) => l.i !== widgetId));
  }, [widgets, layout]);

  const handleSave = useCallback(() => {
    if (onSaveLayout) {
      onSaveLayout(layout, widgets);
    }
  }, [layout, widgets, onSaveLayout]);

  const renderWidgetContent = (widget: Widget) => {
    // All widget types are telemetry-based
    if (['temperature', 'humidity', 'battery', 'power', 'signal', 'telemetry'].includes(widget.type)) {
      return (
        <TelemetryWidget
          data={widget.content}
          refreshInterval={widget.config?.refreshInterval}
          enabledMetrics={widget.config?.enabledMetrics}
          deviceId={widget.config?.deviceId}
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
      );
    }
    return <div className="p-4">Unknown widget type</div>;
  };

  return (
    <div className="relative w-full h-full bg-gray-50 rounded-lg">
      {/* Toolbar */}
      {!readOnly && (
        <div className="absolute -top-18 right-4 z-50 flex items-center gap-2">
          <Button
            onClick={() => setShowWidgetLibrary(!showWidgetLibrary)}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary text-white hover:bg-primary/90 shadow-md"
          >
            Save Layout
          </Button>
        </div>
      )}

      {/* Widget Library */}
      {showWidgetLibrary && (
        <div className="absolute right-4 z-50 dark:bg-gray-800 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Add Widget</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleAddWidget('temperature')}
              className="h-20 flex flex-col items-center justify-center dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <span className="text-2xl mb-1">🌡️</span>
              <span className="text-xs">Temperature</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddWidget('humidity')}
              className="h-20 flex flex-col items-center justify-center dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <span className="text-2xl mb-1">💧</span>
              <span className="text-xs">Humidity</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddWidget('battery')}
              className="h-20 flex flex-col items-center justify-center dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <span className="text-2xl mb-1">🔋</span>
              <span className="text-xs">Battery</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddWidget('power')}
              className="h-20 flex flex-col items-center justify-center dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <span className="text-2xl mb-1">⚡</span>
              <span className="text-xs">Power</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddWidget('signal')}
              className="h-20 flex flex-col items-center justify-center dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <span className="text-2xl mb-1">📶</span>
              <span className="text-xs">Signal</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddWidget('telemetry')}
              className="h-20 flex flex-col items-center justify-center dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <span className="text-2xl mb-1">📡</span>
              <span className="text-xs">All Metrics</span>
            </Button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="  h-full overflow-auto bg-gray-200 dark:bg-gray-800">
        {widgets.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <button
              onClick={() => setShowWidgetLibrary(true)}
              className="flex items-center gap-4 px-8 py-6 border-4 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-100 transition-all"
            >
              <Plus className="h-12 w-12" />
              <span className="text-xl font-semibold">Add new widget</span>
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
          >
            {widgets.map((widget) => (
              <div key={widget.id} className="widget-container">
                <Card className="h-full shadow-lg border-2 border-gray-200 hover:border-primary transition-colors">
                  {/* Widget Header */}
                  <div className="drag-handle flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200 cursor-move">
                    <div className="flex items-center gap-2">
                      <Maximize2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">
                        {widget.title}
                      </span>
                    </div>
                    {!readOnly && (
                      <div className="flex items-center gap-1">
                        {['temperature', 'humidity', 'battery', 'power', 'signal', 'telemetry'].includes(widget.type) && (
                          <button
                            onClick={() => setSettingsWidgetId(widget.id)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Settings"
                          >
                            <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveWidget(widget.id)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Widget Content */}
                  <CardContent className="p-4 h-[calc(100%-48px)] overflow-auto">
                    {renderWidgetContent(widget)}
                  </CardContent>
                </Card>
              </div>
            ))}
          </GridLayout>
        )}
      </div>

      {/* Telemetry Widget Settings Dialog */}
      {settingsWidgetId && (
        <TelemetryWidgetSettings
          open={!!settingsWidgetId}
          onOpenChange={(open) => !open && setSettingsWidgetId(null)}
          config={widgets.find((w) => w.id === settingsWidgetId)?.config as TelemetryWidgetConfig || {}}
          onSave={(newConfig) => {
            setWidgets((prev) =>
              prev.map((w) =>
                w.id === settingsWidgetId
                  ? { ...w, config: { ...w.config, ...newConfig } }
                  : w
              )
            );
            if (onSaveLayout) {
              const updatedWidgets = widgets.map((w) =>
                w.id === settingsWidgetId
                  ? { ...w, config: { ...w.config, ...newConfig } }
                  : w
              );
              onSaveLayout(layout, updatedWidgets);
            }
          }}
        />
      )}
    </div>
  );
}

