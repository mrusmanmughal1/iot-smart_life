import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/util';
import { Badge } from '@/components/ui/badge';

const mockAlertRules = [
  {
    id: 1,
    status: 'Active',
    severity: 'Critical',
    device: 'Sensor-001',
    message: 'Temperature exceeded',
    time: '2 min ago',
  },
  {
    id: 2,
    status: 'Active',
    severity: 'Warning',
    device: 'Device-042',
    message: 'Low battery level',
    time: '2 min ago',
  },
  {
    id: 3,
    status: 'Active',
    severity: 'Info',
    device: 'Gateway-12',
    message: 'Connection restored',
    time: '2 min ago',
  },
];

export const AlertRulesPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['Active', 'Resolved', 'All'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-800">Alert Rules</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant="outline"
            className={cn(
              'border-none font-medium',
              activeTab === tab
                ? 'bg-secondary text-white hover:bg-secondary/90'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search alerts..." className="pl-9     h-10" />
        </div>

        <Select className="w-[140px]">
          <SelectTrigger className=" bg-gray-50 border-none">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>

        <Select className="w-[140px]">
          <SelectTrigger className="w-[140px] bg-gray-50 border-none">
            <SelectValue placeholder="Device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sensor-001">Sensor-001</SelectItem>
            <SelectItem value="device-042">Device-042</SelectItem>
            <SelectItem value="gateway-12">Gateway-12</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="primary"
          className="h-10 ml-auto bg-primary hover:bg-primary/90 text-white border-none"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Alert Rule
        </Button>
      </div>

      {/* Table */}
      <Card className="border shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <Table>
            <TableHeader className=" ">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-12"></TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>SEVERITY</TableHead>
                <TableHead>DEVICE</TableHead>
                <TableHead>MESSAGE</TableHead>
                <TableHead>TIME</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAlertRules.map((rule) => (
                <TableRow
                  key={rule.id}
                  className="border-b last:border-none hover:bg-slate-50"
                >
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          rule.status === 'Active' ? 'destructive' : 'success'
                        }
                      >
                        {rule.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {rule.severity}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {rule.device}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {rule.message}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {rule.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 py-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400"
          disabled
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">First page</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400"
          disabled
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Last page</span>
        </Button>
      </div>
    </div>
  );
};

export default AlertRulesPage;
