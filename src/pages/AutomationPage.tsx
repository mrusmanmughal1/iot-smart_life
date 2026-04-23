import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Zap, Plus, Search, Play, AlertTriangle } from 'lucide-react';
import { AutomationTable } from '@/features/automation/AutomationTable';
import { AutomationDialog } from '@/features/automation/AutomationDialog';
import { Automation } from '@/features/automation/types';

// Mock data (moving status to the top for consistency with the component)
const initialAutomations: Automation[] = [
  {
    id: '1',
    name: 'Temperature Control',
    description: 'Turn on AC when temperature exceeds 25°C',
    enabled: true,
    trigger: {
      type: 'Threshold',
      device: 'Temperature Sensor #1',
      condition: 'temperature > 25',
    },
    action: {
      type: 'Control Device',
      target: 'AC Unit #1',
      value: 'Turn ON',
    },
    lastTriggered: new Date('2025-01-30T14:15:00'),
    executionCount: 45,
    status: 'active',
  },
  {
    id: '2',
    name: 'Motion Light Control',
    description: 'Turn on lights when motion detected',
    enabled: true,
    trigger: {
      type: 'Device State',
      device: 'Motion Sensor #3',
      condition: 'motion = detected',
    },
    action: {
      type: 'Control Device',
      target: 'Smart Lights - Hallway',
      value: 'Turn ON',
    },
    lastTriggered: new Date('2025-01-30T13:45:00'),
    executionCount: 128,
    status: 'active',
  },
  {
    id: '3',
    name: 'Low Battery Alert',
    description: 'Send email when device battery is low',
    enabled: true,
    trigger: {
      type: 'Threshold',
      device: 'All Devices',
      condition: 'battery < 20%',
    },
    action: {
      type: 'Send Notification',
      target: 'admin@company.com',
      value: 'Email Alert',
    },
    lastTriggered: new Date('2025-01-29T10:30:00'),
    executionCount: 12,
    status: 'active',
  },
  {
    id: '4',
    name: 'Evening Energy Saver',
    description: 'Reduce heating after 10 PM',
    enabled: false,
    trigger: {
      type: 'Schedule',
      device: 'Time-based',
      condition: 'time = 22:00',
    },
    action: {
      type: 'Set Value',
      target: 'Thermostat - Main',
      value: 'Set to 18°C',
    },
    executionCount: 89,
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Water Leak Detection',
    description: 'Alert and shut valve on water leak',
    enabled: true,
    trigger: {
      type: 'Device State',
      device: 'Water Sensor #2',
      condition: 'leak = detected',
    },
    action: {
      type: 'Multiple Actions',
      target: 'Water Valve + Alert',
      value: 'Close valve & Send alert',
    },
    lastTriggered: new Date('2025-01-29T10:30:00'),
    executionCount: 2,
    status: 'active',
  },
];

export default function AutomationPage() {
  const { t } = useTranslation();
  const [automations, setAutomations] =
    useState<Automation[]>(initialAutomations);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedAutomation, setSelectedAutomation] =
    useState<Automation | null>(null);

  const filteredAutomations = useMemo(() => {
    return automations.filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [automations, searchQuery]);

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

  const handleDuplicate = (automation: Automation) => {
    const newAutomation = {
      ...automation,
      id: Math.random().toString(36).substr(2, 9),
      name: `${automation.name} (Copy)`,
      executionCount: 0,
    };
    setAutomations([...automations, newAutomation]);
  };

  const handleDelete = (id: string) => {
    setAutomations(automations.filter((a) => a.id !== id));
  };

  const handleToggle = (id: string, enabled: boolean) => {
    setAutomations(
      automations.map((a) =>
        a.id === id
          ? { ...a, enabled, status: enabled ? 'active' : 'inactive' }
          : a
      )
    );
  };

  const handleDialogSubmit = (data: Partial<Automation>) => {
    if (dialogMode === 'edit' && selectedAutomation) {
      setAutomations(
        automations.map((a) =>
          a.id === selectedAutomation.id ? { ...a, ...data } : a
        )
      );
    } else {
      const newAutomation: Automation = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name || 'New Automation',
        description: data.description || '',
        enabled: true,
        trigger: data.trigger || {
          type: 'Threshold',
          device: 'Unknown',
          condition: '',
        },
        action: data.action || {
          type: 'Control Device',
          target: 'Unknown',
          value: '',
        },
        executionCount: 0,
        status: 'active',
        ...data,
      };
      setAutomations([...automations, newAutomation]);
    }
  };

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
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              {t('automation.stats.total')}
            </CardTitle>
            <Zap className="h-8 w-8 text-white/20" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automations.length}</div>
            <p className="text-xs text-white/70">{t('automation.stats.totalDesc')}</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              {t('automation.stats.active')}
            </CardTitle>
            <Play className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automations.filter((a) => a.enabled).length}
            </div>
            <p className="text-xs text-white/70">{t('automation.stats.activeDesc')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('automation.stats.executions')}
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automations.reduce((sum, a) => sum + a.executionCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{t('automation.stats.executionsDesc')}</p>
          </CardContent>
        </Card>

        <Card className="bg-red-600/80 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              {t('automation.stats.errors')}
            </CardTitle>
            <AlertTriangle className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automations.filter((a) => a.status === 'error').length}
            </div>
            <p className="text-xs text-white/70">{t('automation.stats.errorsDesc')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{t('automation.table.title')}</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('automation.table.searchPlaceholder')}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AutomationTable
            data={filteredAutomations}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
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
    </div>
  );
}
