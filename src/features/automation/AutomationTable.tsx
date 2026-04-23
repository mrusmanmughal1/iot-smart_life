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
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Edit,
  Copy,
  Trash2,
  Pause,
  Play,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Automation } from './types';

interface AutomationTableProps {
  data: Automation[];
  onToggle: (id: string, enabled: boolean) => void;
  onEdit: (automation: Automation) => void;
  onDuplicate: (automation: Automation) => void;
  onDelete: (id: string) => void;
}

export const AutomationTable: React.FC<AutomationTableProps> = ({
  data,
  onToggle,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700">
      <Table>
        <TableHeader className="bg-primary hover:bg-primary">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="text-white font-medium">{t('automation.table.columns.name')}</TableHead>
            <TableHead className="text-white font-medium">{t('automation.table.columns.trigger')}</TableHead>
            <TableHead className="text-white font-medium w-[50px]"></TableHead>
            <TableHead className="text-white font-medium">{t('automation.table.columns.action')}</TableHead>
            <TableHead className="text-white font-medium text-center">
              {t('automation.table.columns.executions')}
            </TableHead>
            <TableHead className="text-white font-medium text-center">
              {t('automation.table.columns.status')}
            </TableHead>
            <TableHead className="text-white font-medium text-right">
              {t('automation.table.columns.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((automation) => (
              <TableRow key={automation.id} className="dark:text-white">
                <TableCell>
                  <div>
                    <div className="font-medium">{automation.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {automation.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant="outline">{automation.trigger.type}</Badge>
                    <div className="text-sm text-muted-foreground">
                      {automation.trigger.device}: {automation.trigger.condition}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant="secondary">{automation.action.type}</Badge>
                    <div className="text-sm text-muted-foreground">
                      {automation.action.target}: {automation.action.value}
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
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onToggle(automation.id, !automation.enabled)}
                      >
                        {automation.enabled ? (
                          <Pause className="mr-2 h-4 w-4" />
                        ) : (
                          <Play className="mr-2 h-4 w-4" />
                        )}
                        {automation.enabled ? t('automation.buttons.disable') : t('automation.buttons.enable')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(automation)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t('automation.buttons.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(automation)}>
                        <Copy className="mr-2 h-4 w-4" />
                        {t('automation.buttons.duplicate')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(automation.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('automation.buttons.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
    </div>
  );
};
