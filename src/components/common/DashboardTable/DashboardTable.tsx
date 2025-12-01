import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Download, Share2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface DashboardTableItem {
  id: string;
  title: string;
  tag?: string;
  tagColor?: string;
  createdTime: string;
  status: 'active' | 'deactivate';
  customerName: string;
}

export interface DashboardTableProps {
  data: DashboardTableItem[];
  onStatusToggle?: (id: string) => void;
  onAction?: (
    action: 'share' | 'view' | 'delete' | 'download',
    id: string
  ) => void;
  onTitleClick?: (id: string) => void;
  getNavigationPath?: (id: string) => string;
  columns?: {
    title?: boolean;
    createdTime?: boolean;
    status?: boolean;
    customerName?: boolean;
    actions?: boolean;
  };
  translationKeys?: {
    title?: string;
    createdTime?: string;
    activateDeactivate?: string;
    customerName?: string;
    actions?: string;
    active?: string;
    deactivate?: string;
    tagPrefix?: string;
  };
  emptyMessage?: string;
  // Pagination props
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
    showItemsPerPage?: boolean;
  };
}

export function DashboardTable({
  data,
  onStatusToggle,
  onAction,
  onTitleClick,
  getNavigationPath,
  columns = {
    title: true,
    createdTime: true,
    status: true,
    customerName: true,
    actions: true,
  },
  translationKeys = {},
  emptyMessage,
  pagination,
}: DashboardTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Default translation keys
  const defaultTranslationKeys = {
    title: 'solutionDashboards.table.title',
    createdTime: 'solutionDashboards.table.createdTime',
    activateDeactivate: 'solutionDashboards.table.activateDeactivate',
    customerName: 'solutionDashboards.table.customerName',
    actions: 'solutionDashboards.table.actions',
    active: 'solutionDashboards.status.active',
    deactivate: 'solutionDashboards.status.deactivate',
    tagPrefix: 'solutionDashboards.tags',
    ...translationKeys,
  };

  const defaultEmptyMessage = emptyMessage || 'No data found';

  const handleStatusToggle = (id: string) => {
    if (onStatusToggle) {
      onStatusToggle(id);
    }
  };

  const handleAction = (
    action: 'share' | 'view' | 'delete' | 'download',
    id: string
  ) => {
    if (onAction) {
      onAction(action, id);
    }
  };

  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      pagination.onPageChange(page);
    }
  };

  const handleTitleClick = (id: string) => {
    if (onTitleClick) {
      onTitleClick(id);
    } else if (getNavigationPath) {
      const path = getNavigationPath(id);
      navigate(path);
    }
  };

  const isTitleClickable = !!(onTitleClick || getNavigationPath);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
        <thead className="bg-primary">
          <tr className="border-b border-gray-200">
            {columns.title && (
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                {t(defaultTranslationKeys.title)}
              </th>
            )}
            {columns.createdTime && (
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                {t(defaultTranslationKeys.createdTime)}
              </th>
            )}
            {columns.status && (
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                {t(defaultTranslationKeys.activateDeactivate)}
              </th>
            )}
            {columns.customerName && (
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                {t(defaultTranslationKeys.customerName)}
              </th>
            )}
            {columns.actions && (
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                {t(defaultTranslationKeys.actions)}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={Object.values(columns).filter(Boolean).length}
                className="py-8 px-4 text-center text-gray-500"
              >
                {defaultEmptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-dotted border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {columns.title && (
                  <td
                    className={`py-4 px-4 ${isTitleClickable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''}`}
                    onClick={isTitleClickable ? () => handleTitleClick(item.id) : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 mr-2">▶</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                        {item.tag && item.tagColor && (
                          <Badge
                            className={`${item.tagColor} text-xs mt-1 border-0`}
                          >
                            {item.tag && defaultTranslationKeys.tagPrefix
                              ? t(
                                  `${
                                    defaultTranslationKeys.tagPrefix
                                  }.${item.tag.toLowerCase()}`
                                )
                              : item.tag}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                )}
                {columns.createdTime && (
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {item.createdTime}
                  </td>
                )}
                {columns.status && (
                  <td className="py-4 px-4 flex items-center justify-center">
                    <Button
                      onClick={() => handleStatusToggle(item.id)}
                      className={`text-xs px-5 h-8  rounded-full ${
                        item.status === 'active'
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {item.status === 'active'
                        ? t(defaultTranslationKeys.active)
                        : t(defaultTranslationKeys.deactivate)}
                    </Button>
                  </td>
                )}
                {columns.customerName && (
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {item.customerName}
                  </td>
                )}
                {columns.actions && (
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction('share', item.id)}
                        className="p-1.5 text-gray-500 hover:text-secondary hover:bg-gray-100 rounded transition-colors"
                        title="Share"
                        aria-label="Share"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction('view', item.id)}
                        className="p-1.5 text-gray-500 hover:text-secondary hover:bg-gray-100 rounded transition-colors"
                        title="View"
                        aria-label="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction('delete', item.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                        title="Delete"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction('download', item.id)}
                        className="p-1.5 text-gray-500 hover:text-secondary hover:bg-gray-100 rounded transition-colors"
                        title="Download"
                        aria-label="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {pagination.totalItems !== undefined && (
              <span>
                Showing {((pagination.currentPage - 1) * (pagination.itemsPerPage || 10) + 1)} to{' '}
                {Math.min(pagination.currentPage * (pagination.itemsPerPage || 10), pagination.totalItems)} of{' '}
                {pagination.totalItems} results
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
              className="h-8 w-8"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="h-8 w-8"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 px-2">
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="h-8 w-8"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="h-8 w-8"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
