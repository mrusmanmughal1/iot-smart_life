import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { Search, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Permission {
  id: string;
  label: string;
  category: string;
}

interface AssignedPermission {
  id: string;
  label: string;
  category: string;
}

const availablePermissions: Permission[] = [
  // Device Management
  {
    id: 'create-devices',
    label: 'Create Devices',
    category: 'Device Management',
  },
  {
    id: 'delete-devices',
    label: 'Delete Devices',
    category: 'Device Management',
  },
  {
    id: 'edit-device-attributes',
    label: 'Edit Device Attributes',
    category: 'Device Management',
  },
  // Dashboard Management
  {
    id: 'create-dashboards',
    label: 'Create Dashboards',
    category: 'Dashboard Management',
  },
  {
    id: 'share-dashboards',
    label: 'Share Dashboards',
    category: 'Dashboard Management',
  },
  // User Management
  {
    id: 'create-users',
    label: 'Create Users',
    category: 'User Management',
  },
  {
    id: 'edit-users',
    label: 'Edit Users',
    category: 'User Management',
  },
  // Data Access
  {
    id: 'view-telemetry',
    label: 'View Telemetry',
    category: 'Data Access',
  },
  {
    id: 'export-data',
    label: 'Export Data',
    category: 'Data Access',
  },
];

const assignedPermissions: AssignedPermission[] = [
  {
    id: 'view-devices-1',
    label: 'View Devices',
    category: 'Device Management',
  },
  {
    id: 'view-devices-2',
    label: 'View Devices',
    category: 'Device Management',
  },
  {
    id: 'view-devices-3',
    label: 'View Devices',
    category: 'Device Management',
  },
];

export default function AssignPermissionsPage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [availableSearch, setAvailableSearch] = useState('');
  const [assignedSearch, setAssignedSearch] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<string>('');
  const [assigned, setAssigned] =
    useState<AssignedPermission[]>(assignedPermissions);

  // Group available permissions by category
  const permissionsByCategory = availablePermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  // Filter available permissions by search
  const filteredAvailablePermissions = availablePermissions.filter((perm) =>
    perm.label.toLowerCase().includes(availableSearch.toLowerCase())
  );

  // Filter assigned permissions by search
  const filteredAssignedPermissions = assigned.filter((perm) =>
    perm.label.toLowerCase().includes(assignedSearch.toLowerCase())
  );

  const handleAdd = () => {
    if (!selectedPermission) {
      toast.error('Please select a permission to add');
      return;
    }

    const permission = availablePermissions.find(
      (p) => p.id === selectedPermission
    );
    if (permission) {
      // Check if already assigned
      if (assigned.some((p) => p.id === permission.id)) {
        toast.error('Permission already assigned');
        return;
      }

      setAssigned([...assigned, permission]);
      setSelectedPermission('');
      toast.success(`Added permission: ${permission.label}`);
    }
  };

  const handleRemove = (permissionId: string) => {
    const permission = assigned.find((p) => p.id === permissionId);
    if (permission) {
      setAssigned(assigned.filter((p) => p.id !== permissionId));
      toast.success(`Removed permission: ${permission.label}`);
    }
  };

  const handleSave = () => {
    toast.success('Permissions saved successfully');
    navigate('/users');
  };

  const handleCancel = () => {
    navigate('/users');
  };

  // Calculate permission level based on count
  const getPermissionLevel = (count: number) => {
    if (count >= 15) return { label: 'High', color: 'bg-green-500' };
    if (count >= 8) return { label: 'Moderate', color: 'bg-orange-500' };
    return { label: 'Low', color: 'bg-yellow-500' };
  };

  const permissionLevel = getPermissionLevel(assigned.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="" />
      <div className="mx-auto space-y-6">
        {/* Header Section */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Assign Permissions
                </h1>
                <p className="text-sm text-gray-600">
                  User: john.doe@company.com
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAdd} variant="secondary">
                  Add
                </Button>
                <Button
                  onClick={() => {
                    if (selectedPermission) {
                      const perm = assigned.find(
                        (p) => p.id === selectedPermission
                      );
                      if (perm) handleRemove(perm.id);
                    }
                  }}
                  variant="ghost"
                >
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Three Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Permissions Panel */}
          <Card className="bg-white shadow-sm rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Available Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="Search permissions..."
                value={availableSearch}
                onChange={(e) => setAvailableSearch(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                iconPosition="right"
                className="w-full"
              />

              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                {Object.entries(permissionsByCategory).map(
                  ([category, permissions]) => {
                    const categoryPermissions = permissions.filter((perm) =>
                      filteredAvailablePermissions.some((p) => p.id === perm.id)
                    );

                    if (categoryPermissions.length === 0) return null;

                    return (
                      <div key={category} className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {category}
                        </h3>
                        <RadioGroup
                          value={selectedPermission}
                          onValueChange={setSelectedPermission}
                        >
                          {categoryPermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-2 py-1"
                            >
                              <RadioGroupItem
                                value={permission.id}
                                id={permission.id}
                              />
                              <Label
                                htmlFor={permission.id}
                                className="text-sm text-gray-700 cursor-pointer flex-1"
                              >
                                {permission.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assigned Permissions Panel */}
          <Card className="bg-white shadow-sm rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Assigned Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search assigned..."
                  value={assignedSearch}
                  onChange={(e) => setAssignedSearch(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                  iconPosition="right"
                  className="w-full"
                />
                {assignedSearch && (
                  <button
                    onClick={() => setAssignedSearch('')}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredAssignedPermissions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No assigned permissions
                  </p>
                ) : (
                  filteredAssignedPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-900">
                          {permission.label}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemove(permission.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Permission Summary Panel */}
          <Card className="bg-white shadow-sm rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Permission Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Current Role
                  </p>
                  <p className="text-base text-gray-900">Customer User</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Permissions
                  </p>
                  <p className="text-base text-gray-900">
                    {assigned.length} assigned
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Permission Level
                  </p>
                  <Badge
                    className={`${permissionLevel.color} text-white px-3 py-1`}
                  >
                    {permissionLevel.label}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Last Modified
                  </p>
                  <p className="text-base text-gray-900">2024-03-15 14:30</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4  ">
                <Button
                  onClick={handleSave}
                  variant="secondary"
                  className="flex-1"
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
