import { useState, useCallback } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { Plus, Trash2, Settings, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export interface Widget {
  id: string;
  type: 'chart' | 'gauge' | 'svg' | 'text' | 'image' | 'scada';
  title: string;
  content?: any;
  config?: any;
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
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: `New ${widgetType}`,
      content: null,
      config: {},
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
    switch (widget.type) {
      case 'chart':
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">Chart Widget</p>
            </div>
          </div>
        );
      case 'gauge':
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🎚️</div>
              <p className="text-sm">Gauge Widget</p>
            </div>
          </div>
        );
      case 'svg':
      case 'scada':
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-sm">SCADA SVG Widget</p>
              <p className="text-xs mt-2">Drop SVG here</p>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-sm">Text Widget</p>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm">Image Widget</p>
            </div>
          </div>
        );
      default:
        return <div className="p-4">Unknown widget type</div>;
    }
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
        <div className="absolute top-20 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64">
          <h3 className="text-lg font-semibold mb-4">Add Widget</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleAddWidget('chart')}
              className="h-20 flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-1">📊</span>
              <span className="text-xs">Chart</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddWidget('gauge')}
              className="h-20 flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-1">🎚️</span>
              <span className="text-xs">Gauge</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddWidget('scada')}
              className="h-20 flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-1">🎨</span>
              <span className="text-xs">SCADA SVG</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddWidget('text')}
              className="h-20 flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-1">📝</span>
              <span className="text-xs">Text</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddWidget('image')}
              className="h-20 flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-1">🖼️</span>
              <span className="text-xs">Image</span>
            </Button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="  h-full overflow-auto bg-gray-200">
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
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Settings"
                        >
                          <Settings className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleRemoveWidget(widget.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
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
    </div>
  );
}

