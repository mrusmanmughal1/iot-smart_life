import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/common/DataTable/DataTable';
import { createSortableColumn, createActionsColumn } from '@/components/common/DataTable/columns';
import { Calendar, Plus, Search, Clock, Play, Pause, Edit, Trash2, Mail } from 'lucide-react';

const schedules = [
  { id: '1', name: 'Daily Energy Report', type: 'Report', schedule: 'Daily at 08:00', enabled: true, lastRun: new Date('2025-01-30T08:00:00'), nextRun: new Date('2025-01-31T08:00:00'), recipients: 'admin@company.com' },
  { id: '2', name: 'Weekly Device Status', type: 'Report', schedule: 'Weekly on Monday', enabled: true, lastRun: new Date('2025-01-27T09:00:00'), nextRun: new Date('2025-02-03T09:00:00'), recipients: 'team@company.com' },
  { id: '3', name: 'Monthly Analytics', type: 'Report', schedule: 'Monthly on 1st', enabled: false, lastRun: new Date('2025-01-01T10:00:00'), nextRun: new Date('2025-02-01T10:00:00'), recipients: 'stakeholders@company.com' },
];

export default function ScheduleManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const columns = [
    createSortableColumn('name', 'Name'),
    { accessorKey: 'schedule', header: 'Schedule', cell: ({ row }: any) => <Badge variant="outline">{row.getValue('schedule')}</Badge> },
    { accessorKey: 'type', header: 'Type', cell: ({ row }: any) => <Badge>{row.getValue('type')}</Badge> },
    { accessorKey: 'nextRun', header: 'Next Run', cell: ({ row }: any) => <span className="text-sm">{(row.getValue('nextRun') as Date).toLocaleString()}</span> },
    { accessorKey: 'enabled', header: 'Status', cell: ({ row }: any) => <Switch checked={row.getValue('enabled')} /> },
    createActionsColumn((row: any) => [
      { label: row.original.enabled ? 'Pause' : 'Resume', onClick: () => {}, icon: row.original.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" /> },
      { label: 'Edit', onClick: () => {}, icon: <Edit className="h-4 w-4" /> },
      { label: 'Delete', onClick: () => {}, icon: <Trash2 className="h-4 w-4" />, variant: 'destructive' as const },
    ]),
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Schedule Management" description="Manage scheduled reports and automated tasks" actions={[{ label: 'Create Schedule', onClick: () => setIsCreateOpen(true), icon: <Plus className="h-4 w-4 mr-2" /> }]} />
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schedules</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedules.length}</div>
            <p className="text-xs text-muted-foreground">Configured tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Play className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{schedules.filter(s => s.enabled).length}</div>
            <p className="text-xs text-muted-foreground">Running schedules</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search schedules..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Tasks</CardTitle>
          <CardDescription>Automated reports and recurring tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={schedules} searchKey="name" />
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Schedule</DialogTitle>
            <DialogDescription>Configure a new scheduled task</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Schedule Name *</Label>
              <Input id="name" placeholder="e.g., Daily Energy Report" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Task Type *</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="report">Generate Report</SelectItem>
                  <SelectItem value="backup">Backup Data</SelectItem>
                  <SelectItem value="cleanup">Cleanup Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients (Email)</Label>
              <Input id="recipients" placeholder="admin@company.com, team@company.com" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="enable">Enable Schedule</Label>
                <p className="text-sm text-muted-foreground">Start immediately</p>
              </div>
              <Switch id="enable" defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button>Create Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}