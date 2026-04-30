import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Copy, Edit, Eye, Trash2 } from 'lucide-react';
import { Automation } from './types';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';

interface AutomationTableProps {
  data: Automation[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    totalItems?: number;
  };
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onToggle: (id: string, enabled: boolean) => void;
  onEdit: (automation: Automation) => void;
  onDuplicate: (automation: Automation) => void;
  onDelete: (id: string) => void;
}

export const AutomationTable: React.FC<AutomationTableProps> = ({
  data,
  meta,
  currentPage,
  itemsPerPage,
  onPageChange,
  onToggle,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const autodata = data || [];
  const { t } = useTranslation();
  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700">
      <Table className="">
        <TableHeader className="bg-primary hover:bg-primary">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="text-white font-medium">
              {t('automation.table.columns.name')}
            </TableHead>
            <TableHead className="text-white font-medium">
              {t('automation.table.columns.trigger')}
            </TableHead>
            <TableHead className="text-white font-medium w-[50px]"></TableHead>
            <TableHead className="text-white font-medium">
              {t('automation.table.columns.action')}
            </TableHead>
            <TableHead className="text-white font-medium text-center">
              {t('automation.table.columns.executions')}
            </TableHead>
            <TableHead className="text-white font-medium text-center">
              {t('automation.table.columns.status')}
            </TableHead>
            <TableHead className="text-white font-medium  ">
              {t('automation.table.columns.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className=" min-h-[500px] ">
          {data ? (
            autodata.map((automation) => (
              <TableRow key={automation.id} className="dark:text-white">
                <TableCell>
                  <div>
                    <div className="font-medium">{automation.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {automation.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant="outline">{automation.trigger.type}</Badge>
                    <div className="text-sm capitalize text-muted-foreground">
                      {automation.trigger.condition ||
                        (automation.trigger.telemetryKey
                          ? `${automation.trigger.telemetryKey} ${automation.trigger.operator || ''} ${automation.trigger.value || ''}`
                          : 'No condition')}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant="secondary">{automation.action.type}</Badge>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {automation.action.deviceId && (
                        <span className="font-medium mr-1">
                          [{automation.action.deviceId.slice(-6)}]
                        </span>
                      )}
                      {automation.action.command ||
                        automation.action.message ||
                        'Execute'}
                      :{' '}
                      {typeof automation.action.value === 'object'
                        ? JSON.stringify(automation.action.value)
                        : String(automation.action.value || '')}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">
                  {automation.executionCount}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={automation.enabled}
                    onCheckedChange={(checked) =>
                      onToggle(automation.id, checked)
                    }
                  />
                </TableCell>
                <TableCell className="text-right flex ">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="hover:bg-secondary hover:text-white"
                    onClick={() => onEdit(automation)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    className="hover:bg-secondary hover:text-white"
                    variant="ghost"
                    onClick={() => onDelete(automation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    className="hover:bg-secondary hover:text-white"
                    variant="ghost"
                    onClick={() => onDuplicate(automation)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                {t('automation.table.noResults')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {meta && meta.totalPages > 1 && (
        <div className="mt-4 px-4 pb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems || meta.total || 0}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
