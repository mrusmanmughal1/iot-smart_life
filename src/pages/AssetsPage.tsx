import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Upload,
  Download,
  Search,
  ChevronRight,
  Eye,
  Trash2,
  Download as DownloadIcon,
  Share2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/components/layout/AppLayout';

interface Asset {
  id: string;
  name: string;
  type: string;
  customer: string;
  created: string;
  status: 'active' | 'warning' | 'error';
  statusIndicator: 'primary' | 'danger'; // For the diamond icon
  expanded?: boolean;
}

// Sample data
const sampleAssets: Asset[] = [
  {
    id: '1',
    name: 'Building A',
    type: 'Commercial Building',
    customer: 'TechCorp',
    created: '2024-01-15',
    status: 'active',
    statusIndicator: 'primary',
  },
  {
    id: '2',
    name: 'Manufacturing Line 1',
    type: 'Production Line',
    customer: 'ManufacturingCorp',
    created: '2024-01-10',
    status: 'active',
    statusIndicator: 'danger',
  },
  {
    id: '3',
    name: 'Vehicle Fleet Hub',
    type: 'Vehicle Management',
    customer: 'LogisticsCorp',
    created: '2024-01-08',
    status: 'warning',
    statusIndicator: 'danger',
  },
  {
    id: '4',
    name: 'Data Center Alpha',
    type: 'Infrastructure',
    customer: 'TechCorp',
    created: '2024-01-05',
    status: 'error',
    statusIndicator: 'primary',
  },
];

const STATUS_COLORS = {
  active: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

const STATUS_INDICATOR_COLORS = {
  primary: 'bg-green-500',
  danger: 'bg-red-500',
};

export default function AssetsPage() {
  const { t } = useTranslation();
  const [assets, setAssets] = useState<Asset[]>(sampleAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleExport = () => {
    console.log('Export clicked');
  };

  const handleImport = () => {
    console.log('Import clicked');
  };

  const handleAddAsset = () => {
    console.log('Add Asset clicked');
  };

  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleAction = (
    action: 'share' | 'view' | 'delete' | 'download',
    id: string
  ) => {
    console.log(`${action} clicked for asset ${id}`);
  };

  // Filter assets based on search query
  const filteredAssets = useMemo(() => {
    if (!searchQuery.trim()) return assets;

    const query = searchQuery.toLowerCase();
    return assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(query) ||
        asset.type.toLowerCase().includes(query) ||
        asset.customer.toLowerCase().includes(query)
    );
  }, [assets, searchQuery]);

  const getStatusLabel = (status: string) => {
    return t(`assets.status.${status}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('assets.title')}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              {t('assets.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('assets.actions.export')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {t('assets.actions.import')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddAsset}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
            >
              <Plus className="h-4 w-4" />
              {t('assets.actions.addAsset')}
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t('assets.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {t('assets.filters.assetType')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {t('assets.filters.customer')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
          >
            {t('assets.filters.filter')}
          </Button>
        </div>

        {/* Assets Table */}
        <Card className="shadow-md rounded-xl border-gray-200 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary">
                    <th className="w-12 py-3 px-4">
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      {t('assets.table.name')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      {t('assets.table.type')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      {t('assets.table.customer')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      {t('assets.table.created')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      {t('assets.table.status')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      {t('assets.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 px-4 text-center text-gray-500"
                      >
                        {t('assets.noAssets')}
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        className="border-b border-dotted border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {/* Expand/Collapse Icon */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleExpand(asset.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={
                              expandedRows.has(asset.id)
                                ? 'Collapse'
                                : 'Expand'
                            }
                          >
                            <ChevronRight
                              className={`h-4 w-4 transition-transform ${
                                expandedRows.has(asset.id) ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                        </td>

                        {/* Status Indicator (Diamond) */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rotate-45 ${
                                STATUS_INDICATOR_COLORS[asset.statusIndicator]
                              }`}
                            ></div>
                            <span className="text-sm font-medium text-gray-900">
                              {asset.name}
                            </span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">
                            {asset.type}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">
                            {asset.customer}
                          </span>
                        </td>

                        {/* Created */}
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">
                            {asset.created}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${STATUS_COLORS[asset.status]}`}
                            ></div>
                            <span className="text-sm text-gray-900">
                              {getStatusLabel(asset.status)}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAction('share', asset.id)}
                              className="p-1.5 text-gray-500 hover:text-secondary hover:bg-gray-100 rounded transition-colors"
                              title="Share"
                              aria-label="Share"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAction('view', asset.id)}
                              className="p-1.5 text-gray-500 hover:text-secondary hover:bg-gray-100 rounded transition-colors"
                              title="View"
                              aria-label="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAction('delete', asset.id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                              title="Delete"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAction('download', asset.id)}
                              className="p-1.5 text-gray-500 hover:text-secondary hover:bg-gray-100 rounded transition-colors"
                              title="Download"
                              aria-label="Download"
                            >
                              <DownloadIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
