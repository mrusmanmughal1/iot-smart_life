import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
  useAssetProfiles,
  useCreateAssetProfile,
  useDeleteAssetProfile,
} from '@/features/profiles/hooks';
import { DeleteConfirmationDialog } from '@/components/common/DeleteConfirmationDialog';
import toast from 'react-hot-toast';

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
  const navigate = useNavigate();
  const { data: assetProfiles } = useAssetProfiles();
  // API response structure: response.data.data.data (nested response)
  const apiResponse = assetProfiles?.data as
    | { data?: { data?: AssetProfile[] } }
    | undefined;
  const assetProfilesData: AssetProfile[] = apiResponse?.data?.data ?? [];
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AssetProfile | null>(null);
  const createAssetProfileMutation = useCreateAssetProfile();
  const deleteAssetProfileMutation = useDeleteAssetProfile();

  const handleCreateProfile = async (data: AssetProfileFormData) => {
    try {
      await createAssetProfileMutation.mutateAsync(data);
      toast.success('Asset profile created successfully');
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating asset profile:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        'Failed to create asset profile. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (profile: AssetProfile) => {
    setSelectedProfile(profile);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProfile) return;

    try {
      await deleteAssetProfileMutation.mutateAsync(selectedProfile.id);
      toast.success('Asset profile deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedProfile(null);
    } catch (error) {
      console.error('Error deleting asset profile:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        'Failed to delete asset profile. Please try again.';
      toast.error(errorMessage);
    }
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
      (row) => {
        // Navigate to edit page
        navigate(`/asset-profiles/${row.id}`);
      },
      (row) => handleDeleteClick(row)
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
            {/* <div className="text-2xl font-bold">
              {assetProfilesData.reduce((sum:number, p:AssetProfile) => sum + p.assets, 0)}
            </div> */}
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
                assetProfilesData.filter((p:AssetProfile) => p.category === 'Industrial')
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
                assetProfilesData.filter((p:AssetProfile) => p.category === 'Commercial')
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
            detailRoute="/asset-profiles"
          />
        </CardContent>
      </Card>

      {/* Create Asset Profile Dialog */}
      <AssetProfileForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateProfile}
        isLoading={createAssetProfileMutation.isPending || false}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Asset Profile"
        itemName={selectedProfile?.name}
        description={`Are you sure you want to delete "${selectedProfile?.name}"? This action cannot be undone and will affect all assets using this profile.`}
        isLoading={deleteAssetProfileMutation.isPending}
      />
    </div>
  );
}
