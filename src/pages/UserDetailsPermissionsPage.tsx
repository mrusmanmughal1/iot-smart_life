import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';

interface UserDetailsForm {
  name: string;
  email: string;
  role: string;
  viewFloorMaps: boolean;
  viewDeviceData: boolean;
  viewAnalytics: boolean;
  editFloorPlans: boolean;
  associateDevices: boolean;
  importDwgFiles: boolean;
  manageUsers: boolean;
  systemSettings: boolean;
  accessibleBuildings: string[];
}

const defaultValues: UserDetailsForm = {
  name: 'Sarah Miller',
  email: 'sarah.miller@company.com',
  role: 'viewer',
  viewFloorMaps: true,
  viewDeviceData: true,
  viewAnalytics: false,
  editFloorPlans: false,
  associateDevices: false,
  importDwgFiles: false,
  manageUsers: false,
  systemSettings: false,
  accessibleBuildings: ['building-a', 'building-c'],
};

const availableBuildings = [
  { id: 'building-a', name: 'Building A - Main Office' },
  { id: 'building-c', name: 'Building C - Warehouse' },
];

export default function UserDetailsPermissionsPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, control, watch, setValue } = useForm<UserDetailsForm>({
    defaultValues,
  });

  const role = watch('role');
  const accessibleBuildings = watch('accessibleBuildings') || [];

  // Determine if permissions should be disabled based on role
  const isViewer = role === 'viewer';
  const isEditor = role === 'editor';
  const isAdmin = role === 'admin';

  const onSubmit = async (data: UserDetailsForm) => {
    try {
      // TODO: Implement API call to save user details and permissions
      console.log('Saving user details:', data);
      toast.success('User details and permissions saved successfully');
    } catch (error) {
      toast.error('Failed to save user details');
      console.error('Error saving user details:', error);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  const handleBuildingToggle = (buildingId: string) => {
    const current = accessibleBuildings || [];
    if (current.includes(buildingId)) {
      setValue(
        'accessibleBuildings',
        current.filter((id) => id !== buildingId)
      );
    } else {
      setValue('accessibleBuildings', [...current, buildingId]);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Details and Permissions"
        actions={[
          {
            label: 'Back',
            onClick: () => navigate('/users'),
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Floor Map Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Floor Map Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* View Permissions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                View Permissions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="viewFloorMaps"
                    render={({ field }) => (
                      <Checkbox
                        id="viewFloorMaps"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <Label
                    htmlFor="viewFloorMaps"
                    className="text-sm font-medium cursor-pointer"
                  >
                    View Floor Maps
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="viewDeviceData"
                    render={({ field }) => (
                      <Checkbox
                        id="viewDeviceData"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <Label
                    htmlFor="viewDeviceData"
                    className="text-sm font-medium cursor-pointer"
                  >
                    View Device Data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="viewAnalytics"
                    render={({ field }) => (
                      <Checkbox
                        id="viewAnalytics"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isViewer}
                      />
                    )}
                  />
                  <Label
                    htmlFor="viewAnalytics"
                    className={`text-sm font-medium ${
                      isViewer ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    View Analytics
                  </Label>
                </div>
              </div>
            </div>

            {/* Edit Permissions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Edit Permissions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="editFloorPlans"
                    render={({ field }) => (
                      <Checkbox
                        id="editFloorPlans"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isViewer || isEditor}
                      />
                    )}
                  />
                  <Label
                    htmlFor="editFloorPlans"
                    className={`text-sm font-medium ${
                      isViewer || isEditor
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  >
                    Edit Floor Plans
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="associateDevices"
                    render={({ field }) => (
                      <Checkbox
                        id="associateDevices"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isViewer || isEditor}
                      />
                    )}
                  />
                  <Label
                    htmlFor="associateDevices"
                    className={`text-sm font-medium ${
                      isViewer || isEditor
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  >
                    Associate Devices
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="importDwgFiles"
                    render={({ field }) => (
                      <Checkbox
                        id="importDwgFiles"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isViewer || isEditor}
                      />
                    )}
                  />
                  <Label
                    htmlFor="importDwgFiles"
                    className={`text-sm font-medium ${
                      isViewer || isEditor
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  >
                    Import DWG Files
                  </Label>
                </div>
              </div>
            </div>

            {/* Admin Permissions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Admin Permissions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="manageUsers"
                    render={({ field }) => (
                      <Checkbox
                        id="manageUsers"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={!isAdmin}
                      />
                    )}
                  />
                  <Label
                    htmlFor="manageUsers"
                    className={`text-sm font-medium ${
                      !isAdmin ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    Manage Users
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="systemSettings"
                    render={({ field }) => (
                      <Checkbox
                        id="systemSettings"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={!isAdmin}
                      />
                    )}
                  />
                  <Label
                    htmlFor="systemSettings"
                    className={`text-sm font-medium ${
                      !isAdmin ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    System Settings
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Access Control */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Access Control</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Accessible Buildings
              </h3>
              <div className="space-y-3">
                {availableBuildings.map((building) => (
                  <div key={building.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={building.id}
                      checked={accessibleBuildings.includes(building.id)}
                      onChange={() => handleBuildingToggle(building.id)}
                    />
                    <Label
                      htmlFor={building.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {building.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button type="submit" variant="outline" className="bg-gray-100 text-gray-700">
            Save
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            className="bg-primary text-white"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

