import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/common/DataTable/DataTable';
import { createSortableColumn, createActionsColumn } from '@/components/common/DataTable/columns';
import { Building2, Plus, Search, Factory, Home, Warehouse, MapPin, Copy, Trash2, Edit } from 'lucide-react';

interface AssetProfile {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultRuleChain: string;
  createdTime: Date;
  assets: number;
  isDefault: boolean;
}

const assetProfiles: AssetProfile[] = [
  {
    id: '1',
    name: 'Industrial Facility',
    description: 'Profile for manufacturing and production facilities',
    category: 'Industrial',
    defaultRuleChain: 'Industrial Processing',
    createdTime: new Date('2024-01-15'),
    assets: 23,
    isDefault: false,
  },
  {
    id: '2',
    name: 'Commercial Building',
    description: 'Office and commercial property profile',
    category: 'Commercial',
    defaultRuleChain: 'Building Management',
    createdTime: new Date('2024-01-10'),
    assets: 45,
    isDefault: true,
  },
  {
    id: '3',
    name: 'Residential Complex',
    description: 'Apartment and housing complex profile',
    category: 'Residential',
    defaultRuleChain: 'Residential Processing',
    createdTime: new Date('2024-02-01'),
    assets: 67,
    isDefault: false,
  },
  {
    id: '4',
    name: 'Warehouse',
    description: 'Storage and logistics facility',
    category: 'Logistics',
    defaultRuleChain: 'Warehouse Processing',
    createdTime: new Date('2024-01-20'),
    assets: 12,
    isDefault: false,
  },
];

export default function AssetProfiles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const columns = [
    createSortableColumn('name', 'Name'),
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }: any) => (
        <Badge variant="outline">{row.getValue('category')}</Badge>
      ),
    },
    createSortableColumn('assets', 'Assets'),
    {
      accessorKey: 'isDefault',
      header: 'Default',
      cell: ({ row }: any) => (
        row.getValue('isDefault') ? <Badge>Default</Badge> : <Badge variant="secondary">-</Badge>
      ),
    },
    createSortableColumn('createdTime', 'Created'),
    createActionsColumn((row) => [
      { label: 'Edit', onClick: () => {}, icon: <Edit className="h-4 w-4" /> },
      { label: 'Copy', onClick: () => {}, icon: <Copy className="h-4 w-4" /> },
      { label: 'Delete', onClick: () => {}, icon: <Trash2 className="h-4 w-4" />, variant: 'destructive' as const },
    ]),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Profiles"
        description="Manage asset configuration profiles and property templates"
        actions={[
          {
            label: 'Create Profile',
            onClick: () => setIsCreateOpen(true),
            icon: <Plus className="h-4 w-4 mr-2" />,
          },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetProfiles.length}</div>
            <p className="text-xs text-muted-foreground">Asset configurations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assetProfiles.reduce((sum, p) => sum + p.assets, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Using these profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industrial</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assetProfiles.filter(p => p.category === 'Industrial').length}
            </div>
            <p className="text-xs text-muted-foreground">Facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commercial</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assetProfiles.filter(p => p.category === 'Commercial').length}
            </div>
            <p className="text-xs text-muted-foreground">Buildings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search asset profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset Profiles</CardTitle>
          <CardDescription>Manage asset configuration templates</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={assetProfiles} searchKey="name" />
        </CardContent>
      </Card>
    </div>
  );
}