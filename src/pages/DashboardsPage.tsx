import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search as SearchIcon,
  RefreshCw,
  Diamond,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { DashboardTable } from '@/components/common/DashboardTable';
import AppLayout from '@/components/layout/AppLayout';
import { useDashboardsPage } from '@/features/dashboard/hooks/useDashboardsPage';

export default function DashboardsPage() {
  const { t } = useTranslation();
  const {
    selectedTab,
    dashboards,
    isLoading,
    handleStatusToggle,
    handleAction,
    handleRefresh,
    handleTabChange,
    handleCreateDashboard,
    handleImportDashboard,
    handleShowCustomerDashboards,
  } = useDashboardsPage();
  console.log(dashboards);
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
              onClick={() => handleTabChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTab === 'all'
                  ? 'bg-secondary text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('solutionDashboards.tabs.all')}
            </button>
            <button
              onClick={() => handleTabChange('group')}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('solutionDashboards.createNewDashboard')}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 absolute border border-secondary/50 shadow-md rounded-md  "
              >
                <DropdownMenuItem onClick={handleCreateDashboard}>
                  {t('solutionDashboards.createNewDashboard')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImportDashboard}>
                  {t('solutionDashboards.importDashboard') ||
                    'Import Dashboard'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-lg rounded-xl border-secondary/50">
          <CardContent className="p-6">
            {/* Search/Filter Bar */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleShowCustomerDashboards}
                className="bg-secondary text-white hover:bg-secondary/90"
              >
                <Diamond className="h-4 w-4 mr-2" />
                {t('solutionDashboards.showCustomerDashboards')}
              </Button>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
              </div>
            ) : (
              <DashboardTable
                data={dashboards}
                onStatusToggle={handleStatusToggle}
                onAction={handleAction}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
