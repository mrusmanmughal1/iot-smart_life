import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAssetsPage, useCreateAsset } from '@/features/assets/hooks';
import { debounce } from '@/lib/util';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  Share2,
} from 'lucide-react';
import { AddAssetModal } from '@/features/assets/components/AddAssetModal';
import { LoadingOverlay } from '@/components/common/LoadingSpinner';
import { Pagination } from '@/components/common/Pagination/Pagination';
import { format } from 'date-fns';

export default function AssetsPage() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isSavingAsset, setIsSavingAsset] = useState(false);
  const createAssetMutation = useCreateAsset();
  const {
    searchQuery,
    isLoading,
    assets,
    totalAssets,
    currentPage,
    totalPages,
    itemsPerPage,
    handleSearchChange,
    handlePageChange,
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

  // Sync input value with search query
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Create debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        handleSearchChange(value);
      }, 300),
    [handleSearchChange]
  );

  // Handle input change with immediate UI update and debounced search
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('assets.title')}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">{t('assets.subtitle')}</p>
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
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            {t('assets.filters.assetType')}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
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
          <CardContent className="p-6 relative min-h-[400px]">
            {isLoading && <LoadingOverlay />}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-primary text-white">
                  <TableRow className="hover:bg-primary">
                    <TableHead className="text-white font-semibold">
                      {t('assets.table.name')}
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      {t('common.type')}
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      {t('common.status')}
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      {t('assets.table.customer')}
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      {t('assets.table.created')}
                    </TableHead>
                    <TableHead className="text-right text-white font-semibold">
                      {t('assets.table.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.length === 0 && !isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {t('assets.noAssets') || 'No assets found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    assets.map((asset) => (
                      <TableRow
                        key={asset.id}
                        className="cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() =>
                          (window.location.href = `/assets/${asset.id}`)
                        }
                      >
                        <TableCell className="font-medium">
                          <span className="capitalize">{asset.name}</span>
                        </TableCell>
                        <TableCell>
                          <p className="font-normal capitalize">{asset.type}</p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              asset.status === 'active'
                                ? 'bg-green-500 hover:bg-green-600'
                                : asset.status === 'warning'
                                  ? 'bg-amber-500 hover:bg-amber-600'
                                  : 'bg-red-500 hover:bg-red-600'
                            } text-white`}
                          >
                            {asset.status === 'active'
                              ? t('assets.status.active') || 'Active'
                              : asset.status === 'warning'
                                ? t('common.warning') || 'Warning'
                                : t('assets.status.error') || 'Error'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {asset.customer || 'N/A'}
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {asset.created
                            ? format(new Date(asset.created), 'yyyy-MM-dd')
                            : 'N/A'}
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[160px]"
                            >
                              <DropdownMenuItem
                                onClick={() =>
                                  (window.location.href = `/assets/${asset.id}`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                {t('common.view') || 'View Details'}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-700"
                                onClick={() => handleAction('delete', asset.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('common.delete') || 'Delete'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalAssets}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
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
