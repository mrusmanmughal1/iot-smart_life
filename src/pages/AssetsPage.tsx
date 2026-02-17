import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Upload,
  Download,
  Search,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAssetsPage, useCreateAsset } from '@/features/assets/hooks';
import { debounce } from '@/lib/util';
import { DashboardTable } from '@/components/common/DashboardTable/DashboardTable';
import type { DashboardTableItem } from '@/components/common/DashboardTable/DashboardTable';
import { AddAssetModal } from '@/features/assets/components/AddAssetModal';


export default function AssetsPage() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isSavingAsset, setIsSavingAsset] = useState(false);
  const createAssetMutation = useCreateAsset();
  const {
    searchQuery,
    isLoading,
    assets: apiAssets,
    totalAssets,
    currentPage,
    totalPages,
    itemsPerPage,
    handleSearchChange,
    handleAction,
    handleExport,
    handleImport,
  } = useAssetsPage();

  // Handle opening add asset modal
  const handleOpenAddAssetModal = () => {
    setIsAddAssetModalOpen(true);
  };

  // Handle saving asset from modal
  const handleSaveAsset = async (assetData: {
    name: string;
    type: string;
    description: string;
    assetProfileId?: string;
    parentAssetId?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    attributes: Array<{ key: string; value: string }>;
  }) => {
    setIsSavingAsset(true);
    try {
      await createAssetMutation.mutateAsync(assetData);
      // Close modal and show success
      setIsAddAssetModalOpen(false);
    } catch (error: unknown) {
      console.error('Failed to create asset:', error);
    } finally {
      setIsSavingAsset(false);
    }
  };

  // Transform Asset data to DashboardTableItem format
  const tableData: DashboardTableItem[] = useMemo(() => {
    return apiAssets.map((asset) => ({
      id: asset.id,
      title: asset.name,
      tag: asset.type,
      tagColor: asset.statusIndicator === 'primary' 
        ? 'bg-blue-100 text-blue-700' 
        : 'bg-red-100 text-red-700',
      createdTime: asset.created,
      status: asset.status === 'active' ? 'active' : 'deactivate',
      customerName: asset.customer,
    }));
  }, [apiAssets]);

  // Sync input value with search query
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Create debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      handleSearchChange(value);
    }, 300),
    [handleSearchChange]
  );

  // Handle input change with immediate UI update and debounced search
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  }, [debouncedSearch]);


  return (
    < >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
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
              onClick={handleOpenAddAssetModal}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white"
            >
              {t('assets.actions.addAsset')}
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex items-center gap-3">
          <div className="relative  ">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t('assets.searchPlaceholder')}
              value={inputValue}
              onChange={handleInputChange}
              className="w-96 pr-10"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            {t('assets.filters.assetType')}
          </Button>
          <Button
            variant="ghost"
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                      </div>
            ) : (
              <DashboardTable
                data={tableData}
                linkto="assets"
                onAction={handleAction}
                translationKeys={{
                  title: 'assets.table.name',
                  createdTime: 'assets.table.created',
                  activateDeactivate: 'assets.table.status',
                  customerName: 'assets.table.customer',
                  actions: 'assets.table.actions',
                  active: 'assets.status.active',
                  deactivate: 'assets.status.error',
                }}
                emptyMessage={t('assets.noAssets')}
                columns={{
                  title: true,
                  createdTime: true,
                  status: true,
                  customerName: true,
                  actions: true,
                }}
                pagination={{
                  currentPage,
                  totalPages,
                  totalItems: totalAssets,
                  itemsPerPage,
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Asset Modal */}
      <AddAssetModal
        open={isAddAssetModalOpen}
        onOpenChange={setIsAddAssetModalOpen}
        onSave={handleSaveAsset}
        isLoading={isSavingAsset}
      />
    </>
  );
}
