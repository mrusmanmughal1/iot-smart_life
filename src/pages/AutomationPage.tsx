import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { AutomationStats } from '@/features/automation/AutomationStats';
import { AutomationTable } from '@/features/automation/AutomationTable';
import { AutomationDialog } from '@/features/automation/AutomationDialog';
import { Automation } from '@/features/automation/types';
import {
  useAutomations,
  useCreateAutomation,
  useDeleteAutomation,
} from '@/features/automation/hooks/useAutomation';
import toast from 'react-hot-toast';
import { DeleteConfirmationDialog } from '@/components/common/DeleteConfirmationDialog/DeleteConfirmationDialog';

export default function AutomationPage() {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [automationToDelete, setAutomationToDelete] = useState<string | null>(
    null
  );
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedAutomation, setSelectedAutomation] =
    useState<Automation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { register, watch } = useForm({
    defaultValues: {
      search: '',
    },
  });
  const createAutomation = useCreateAutomation();
  const deleteAutomation = useDeleteAutomation();

  const searchQuery = watch('search');

  const { data: automationsData } = useAutomations({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });

  const responseData = automationsData?.data;
  const automations = responseData?.data || [];
  const meta = responseData
    ? {
        total: responseData.total,
        page: responseData.page,
        limit: responseData.limit,
        totalPages: responseData.totalPages,
      }
    : {
        total: 0,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: 0,
      };

  const filteredAutomations = useMemo(() => {
    return automations;
  }, [automations]);

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedAutomation(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (automation: Automation) => {
    setDialogMode('edit');
    setSelectedAutomation(automation);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAutomationToDelete(id);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!automationToDelete) return;

    deleteAutomation.mutate(automationToDelete, {
      onSuccess: () => {
        setIsConfirmDeleteDialogOpen(false);
        setAutomationToDelete(null);
        toast.success('Automation deleted successfully');
      },
      onError: (error) => {
        toast.error('Error deleting automation');
        console.error('Error deleting automation:', error);
      },
    });
  };

  const handleToggle = (id: string, enabled: boolean) => {};

  const handleDialogSubmit = (data: Partial<Automation>) => {
    createAutomation.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        toast.success('Automation created successfully');
      },
      onError: (error: any) => {
        setIsDialogOpen(true);
        toast.error(error.message);
      },
    });
  };

  const handleDuplicate = (automation: Automation) => {};

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('automation.title')}
        description={t('automation.description')}
        actions={[
          {
            label: t('automation.buttons.create'),
            onClick: handleCreate,
            icon: <Plus className="h-4 w-4 mr-2" />,
          },
        ]}
      />

      {/* Stats */}
      <AutomationStats />

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{t('automation.table.title')}</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('search')}
                placeholder={t('automation.table.searchPlaceholder')}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AutomationTable
            data={filteredAutomations}
            meta={meta!}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </CardContent>
      </Card>

      <AutomationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        initialData={selectedAutomation}
        onSubmit={handleDialogSubmit}
      />

      <DeleteConfirmationDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={deleteAutomation.isPending}
        title={t('automation.delete.title', 'Delete Automation')}
        description={t(
          'automation.delete.description',
          'Are you sure you want to delete this automation? This action cannot be undone.'
        )}
        itemName={automations.find((a) => a.id === automationToDelete)?.name}
      />
    </div>
  );
}
