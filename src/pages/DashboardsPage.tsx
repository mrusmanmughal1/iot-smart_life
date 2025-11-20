import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search as SearchIcon,
  RefreshCw,
  Eye,
  Trash2,
  Download,
  Share2,
  Diamond,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layout/AppLayout';

interface Dashboard {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  createdTime: string;
  status: 'active' | 'deactivate';
  customerName: string;
}

const sampleDashboards: Dashboard[] = [
  {
    id: '1',
    title: 'Smart City Overview',
    tag: 'City',
    tagColor: 'bg-blue-100 text-blue-700',
    createdTime: '2023-04-10 15:37:57',
    status: 'active',
    customerName: 'Smart City Demo',
  },
  {
    id: '2',
    title: 'Smart Energy Monitor',
    tag: 'Energy',
    tagColor: 'bg-green-100 text-green-700',
    createdTime: '2023-04-05 09:22:31',
    status: 'deactivate',
    customerName: 'Smart Building Inc',
  },
  {
    id: '3',
    title: 'Smart Parking System',
    tag: 'Transport',
    tagColor: 'bg-yellow-100 text-yellow-700',
    createdTime: '2023-03-28 14:15:02',
    status: 'active',
    customerName: 'Municipal Parking Authority',
  },
];

export default function DashboardsPage() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'all' | 'group'>('all');
  const [dashboards] = useState<Dashboard[]>(sampleDashboards);

  const handleStatusToggle = (id: string) => {
    // TODO: Implement status toggle
    console.log('Toggle status for dashboard:', id);
  };

  const handleAction = (action: string, id: string) => {
    // TODO: Implement actions
    console.log('Action:', action, 'for dashboard:', id);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            {t('solutionDashboards.title')}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTab === 'all'
                  ? 'bg-secondary text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('solutionDashboards.tabs.all')}
            </button>
            <button
              onClick={() => setSelectedTab('group')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTab === 'group'
                  ? 'bg-secondary text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('solutionDashboards.tabs.group')}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-secondary hover:bg-secondary/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              {t('solutionDashboards.createNewDashboard')}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="border border-gray-300"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="border border-gray-300"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-lg rounded-xl border-secondary/50">
          <CardContent className="p-6">
            {/* Search/Filter Bar */}
            <div className="flex gap-3 mb-6">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <SearchIcon className="h-4 w-4 mr-2" />
                {t('solutionDashboards.search')}
              </Button>
              <Button
                className="bg-secondary text-white hover:bg-secondary/90"
              >
                <Diamond className="h-4 w-4 mr-2" />
                {t('solutionDashboards.showCustomerDashboards')}
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      {t('solutionDashboards.table.title')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      {t('solutionDashboards.table.createdTime')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      {t('solutionDashboards.table.activateDeactivate')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      {t('solutionDashboards.table.customerName')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      {t('solutionDashboards.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboards.map((dashboard) => (
                    <tr
                      key={dashboard.id}
                      className="border-b border-dotted border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 mr-2">▶</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {dashboard.title}
                            </div>
                            <Badge
                              className={`${dashboard.tagColor} text-xs mt-1 border-0`}
                            >
                              {t(
                                `solutionDashboards.tags.${dashboard.tag.toLowerCase()}`
                              )}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {dashboard.createdTime}
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          onClick={() => handleStatusToggle(dashboard.id)}
                          className={`text-xs px-3 py-1 rounded-md ${
                            dashboard.status === 'active'
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {dashboard.status === 'active'
                            ? t('solutionDashboards.status.active')
                            : t('solutionDashboards.status.deactivate')}
                        </Button>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {dashboard.customerName}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAction('share', dashboard.id)}
                            className="p-1.5 text-gray-500 hover:text-secondary hover:bg-gray-100 rounded transition-colors"
                            title="Share"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAction('view', dashboard.id)}
                            className="p-1.5 text-gray-500 hover:text-secondary hover:bg-gray-100 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAction('delete', dashboard.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleAction('download', dashboard.id)
                            }
                            className="p-1.5 text-gray-500 hover:text-secondary hover:bg-gray-100 rounded transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
