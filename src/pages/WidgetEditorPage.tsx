import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Layout } from 'react-grid-layout';
import AppLayout from '@/components/layout/AppLayout';
import {
  WidgetCanvas,
  Widget,
} from '@/components/common/WidgetCanvas/WidgetCanvas';
import { Card, CardContent } from '@/components/ui/card';
import { dashboardsApi } from '@/services/api';
import toast from 'react-hot-toast';

export default function WidgetEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [savedLayout, setSavedLayout] = useState<Layout[]>([]);
  const [savedWidgets, setSavedWidgets] = useState<Widget[]>([]);

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard', id],
    queryFn: () => {
      if (!id) throw new Error('Dashboard ID is required');
      return dashboardsApi.getById(id);
    },
    enabled: !!id,
  });

  const dashboard = dashboardData?.data?.data;

  // Load saved layout from localStorage on mount
  useEffect(() => {
    const storedLayout = localStorage.getItem('dashboardLayout');
    const storedWidgets = localStorage.getItem('dashboardWidgets');

    if (storedLayout) {
      setSavedLayout(JSON.parse(storedLayout));
    }
    if (storedWidgets) {
      setSavedWidgets(JSON.parse(storedWidgets));
    }
  }, []);

  const handleSaveLayout = (layout: Layout[], widgets: Widget[]) => {
    // Save to localStorage
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));

    setSavedLayout(layout);
    setSavedWidgets(widgets);

    toast.success('Layout saved successfully!');

    // Here you would typically also save to your backend API
    // await dashboardsApi.saveLayout({ layout, widgets });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-2">Failed to load dashboard</p>
            <p className="text-sm text-gray-500">
              {(error as Error)?.message || 'An error occurred'}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              {dashboard?.name || 'Dashboard Editor'}
            </h1>
            <p className="text-xs text-gray-500">
              Drag, drop, and resize widgets to create your custom dashboard
            </p>
          </div>
        </div>

        {/* Canvas */}
        <Card className="">
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
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Click "Add Widget" to add new widgets to your dashboard</li>
              <li>Drag widgets from the header bar to reposition them</li>
              <li>Resize widgets by dragging the bottom-right corner</li>
              <li>Click the trash icon to remove a widget</li>
              <li>
                Click "Save Layout" to persist your dashboard configuration
              </li>
              <li>Your layout is automatically saved to localStorage</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
