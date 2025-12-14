import React, { useState } from 'react';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/common/DataTable/DataTable';
import {
  createSortableColumn,
  createSortableDateColumn,
  createActionsColumn,
} from '@/components/common/DataTable/columns';
import { Building2, Plus, Factory, Home, MapPin } from 'lucide-react';
import { AssetProfileForm } from '@/features/profiles/components';
import type { AssetProfileFormData } from '@/features/profiles/types';
import { useAssetProfiles } from '@/features/profiles/hooks';

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

export default function AssetProfiles() {
  const { data: assetProfiles } = useAssetProfiles();
  const assetProfilesData = assetProfiles?.data?.data.data ?? [];
  console.log(assetProfilesData);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateProfile = (data: AssetProfileFormData) => {
    console.log('Creating asset profile:', data);
    // TODO: Transform form data to API format and submit
    setIsCreateOpen(false);
  };

  const columns: ColumnDef<AssetProfile>[] = [
    createSortableColumn('name', 'Name'),

    createSortableColumn('assets', 'Assets'),
    {
      accessorKey: 'isDefault',
      header: 'Default',
      cell: ({ row }: CellContext<AssetProfile, unknown>) =>
        row.getValue('isDefault') ? (
          <Badge>Default</Badge>
        ) : (
          <Badge variant="secondary">-</Badge>
        ),
    },
    createSortableDateColumn('createdAt', 'Created'),
    createActionsColumn<AssetProfile>(
      (row) => console.log('Edit', row.id),
      (row) => console.log('Delete', row.id)
    ),
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
        <Card className="bg-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm  text-white font-medium">
              Total Profiles
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetProfilesData.length}</div>
            <p className="text-xs text-muted-foreground">
              Asset configurations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Assets
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assetProfilesData.reduce((sum, p) => sum + p.assets, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Using these profiles
            </p>
          </CardContent>
        </Card>

        <Card className="bg-success text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Industrial
            </CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                assetProfilesData.filter((p) => p.category === 'Industrial')
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Facilities</p>
          </CardContent>
        </Card>

        <Card className="bg-white text-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commercial</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                assetProfilesData.filter((p) => p.category === 'Commercial')
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Buildings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={assetProfilesData}
            searchKey="name"
          />
        </CardContent>
      </Card>

      {/* Create Asset Profile Dialog */}
      <AssetProfileForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateProfile}
      />
    </div>
  );
}
