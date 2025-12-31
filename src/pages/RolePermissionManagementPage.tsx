import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/common/PageHeader';
import { Check, X, HelpCircle, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

type PermissionStatus = 'allowed' | 'denied' | 'conditional';

interface PermissionRow {
  id: string;
  permission: string;
  description: string;
  access: PermissionStatus;
  create: PermissionStatus;
  read: PermissionStatus;
  update: PermissionStatus;
  delete: PermissionStatus;
  category: string;
}

// Device category permissions
const devicePermissions: PermissionRow[] = [
  {
    id: 'device-management',
    permission: 'Device Management',
    description: 'Manage IoT devices and their properties',
    access: 'allowed',
    create: 'allowed',
    read: 'allowed',
    update: 'allowed',
    delete: 'denied',
    category: 'Device',
  },
  {
    id: 'device-profiles',
    permission: 'Device Profiles',
    description: 'Configure device profile templates',
    access: 'allowed',
    create: 'denied',
    read: 'allowed',
    update: 'conditional',
    delete: 'denied',
    category: 'Device',
  },
  {
    id: 'device-telemetry',
    permission: 'Device Telemetry',
    description: 'Access device telemetry data',
    access: 'allowed',
    create: 'denied',
    read: 'allowed',
    update: 'denied',
    delete: 'denied',
    category: 'Device',
  },
  {
    id: 'device-credentials',
    permission: 'Device Credentials',
    description: 'Manage device authentication credentials',
    access: 'conditional',
    create: 'denied',
    read: 'allowed',
    update: 'conditional',
    delete: 'denied',
    category: 'Device',
  },
];

// Dashboard category permissions
const dashboardPermissions: PermissionRow[] = [
  {
    id: 'dashboard-management',
    permission: 'Dashboard Management',
    description: 'Create and manage dashboards',
    access: 'allowed',
    create: 'allowed',
    read: 'allowed',
    update: 'allowed',
    delete: 'allowed',
    category: 'Dashboard',
  },
];

// Asset category permissions
const assetPermissions: PermissionRow[] = [
  {
    id: 'asset-management',
    permission: 'Asset Management',
    description: 'Manage assets and their properties',
    access: 'allowed',
    create: 'allowed',
    read: 'allowed',
    update: 'allowed',
    delete: 'denied',
    category: 'Asset',
  },
];

// User category permissions
const userPermissions: PermissionRow[] = [
  {
    id: 'user-management',
    permission: 'User Management',
    description: 'Manage users and their roles',
    access: 'allowed',
    create: 'allowed',
    read: 'allowed',
    update: 'allowed',
    delete: 'denied',
    category: 'User',
  },
];

// System category permissions
const systemPermissions: PermissionRow[] = [
  {
    id: 'system-settings',
    permission: 'System Settings',
    description: 'Manage system-wide settings',
    access: 'denied',
    create: 'denied',
    read: 'allowed',
    update: 'denied',
    delete: 'denied',
    category: 'System',
  },
];

const PermissionStatusIcon: React.FC<{ status: PermissionStatus }> = ({
  status,
}) => {
  if (status === 'allowed') {
    return (
      <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
        <Check className="w-4 h-4 text-white" />
      </div>
    );
  } else if (status === 'denied') {
    return (
      <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center">
        <X className="w-4 h-4 text-white" />
      </div>
    );
  } else {
    return (
      <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center">
        <HelpCircle className="w-4 h-4 text-white" />
      </div>
    );
  }
};

export default function RolePermissionManagementPage() {
  const navigate = useNavigate();
  const [permissionCategory, setPermissionCategory] = useState('Device');
  const [permissions, setPermissions] =
    useState<PermissionRow[]>(devicePermissions);

  const handleCategoryChange = (category: string) => {
    setPermissionCategory(category);
    switch (category) {
      case 'Device':
        setPermissions(devicePermissions);
        break;
      case 'Dashboard':
        setPermissions(dashboardPermissions);
        break;
      case 'Asset':
        setPermissions(assetPermissions);
        break;
      case 'User':
        setPermissions(userPermissions);
        break;
      case 'System':
        setPermissions(systemPermissions);
        break;
      default:
        setPermissions(devicePermissions);
    }
  };

  const handleGrantAll = () => {
    setPermissions((prev) =>
      prev.map((p) => ({
        ...p,
        access: 'allowed' as PermissionStatus,
        create: 'allowed' as PermissionStatus,
        read: 'allowed' as PermissionStatus,
        update: 'allowed' as PermissionStatus,
        delete: 'allowed' as PermissionStatus,
      }))
    );
    toast.success('All permissions granted');
  };

  const handleRevokeAll = () => {
    setPermissions((prev) =>
      prev.map((p) => ({
        ...p,
        access: 'denied' as PermissionStatus,
        create: 'denied' as PermissionStatus,
        read: 'denied' as PermissionStatus,
        update: 'denied' as PermissionStatus,
        delete: 'denied' as PermissionStatus,
      }))
    );
    toast.success('All permissions revoked');
  };

  const handleSave = () => {
    toast.success('Permissions saved successfully');
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="" />
      <div className="mx-auto space-y-6">
        <PageHeader
          title="Role Permission Management"
          description="Role: Customer Administrator"
        />
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Category Tabs */}
            <Tabs
              value={permissionCategory}
              onValueChange={handleCategoryChange}
              defaultValue="Device"
            >
              <TabsList className="w-full justify-start rounded-none border-b border-gray-200  bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="Device"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 py-2"
                >
                  Device
                </TabsTrigger>
                <TabsTrigger
                  value="Dashboard"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 py-2"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="Asset"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 py-2"
                >
                  Asset
                </TabsTrigger>
                <TabsTrigger
                  value="User"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 py-2"
                >
                  User
                </TabsTrigger>
                <TabsTrigger
                  value="System"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 px-4 py-2"
                >
                  System
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Permissions Table */}
            <div className=" shadow rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-white font-semibold">
                      PERMISSION
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      DESCRIPTION
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center">
                      ACCESS
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center">
                      CREATE
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center">
                      READ
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center">
                      UPDATE
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center">
                      DELETE
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow key={permission.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          {permission.permission}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {permission.description}
                      </TableCell>
                      <TableCell className="text-center">
                        <PermissionStatusIcon status={permission.access} />
                      </TableCell>
                      <TableCell className="text-center">
                        <PermissionStatusIcon status={permission.create} />
                      </TableCell>
                      <TableCell className="text-center">
                        <PermissionStatusIcon status={permission.read} />
                      </TableCell>
                      <TableCell className="text-center">
                        <PermissionStatusIcon status={permission.update} />
                      </TableCell>
                      <TableCell className="text-center">
                        <PermissionStatusIcon status={permission.delete} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Bottom Section */}
            <div className="flex items-start justify-between pt-4">
              {/* Legend */}

              {/* Action Buttons */}
              <div className="flex  justify-between w-full gap-3 items-end">
                <div className="flex gap-3">
                  <Button
                    onClick={handleGrantAll}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Grant All Permissions
                  </Button>
                  <Button
                    onClick={handleRevokeAll}
                    className="bg-secondary hover:bg-secondary/90 text-white"
                  >
                    Revoke All Permissions
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="bg-gray-100 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-sm text-gray-700">Allowed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-sm text-gray-700">Denied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-sm text-gray-700">Conditional</span>
          </div>
        </div>
      </div>
    </div>
  );
}
