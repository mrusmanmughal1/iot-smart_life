import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search as SearchIcon,
  RefreshCw,
  Diamond,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardTable, DashboardTableItem } from '@/components/common/DashboardTable';
import AppLayout from '@/components/layout/AppLayout';

const sampleDashboards: DashboardTableItem[] = [
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
  const [dashboards] = useState<DashboardTableItem[]>(sampleDashboards);

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
            <DashboardTable
              data={dashboards}
              onStatusToggle={handleStatusToggle}
              onAction={handleAction}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
