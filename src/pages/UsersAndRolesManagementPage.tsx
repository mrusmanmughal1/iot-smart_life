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
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/PageHeader';
import { Plus, Search, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SystemRole {
  id: string;
  title: string;
  description: string;
  features: string[];
}

interface Role {
  id: string;
  roleName: string;
  description: string;
  usersCount: number;
}

const systemRoles: SystemRole[] = [
  {
    id: 'system-admin',
    title: 'System Administrator',
    description: 'Full system access and control',
    features: [
      'Manage all tenants and customers',
      'System configuration',
      'User management',
    ],
  },
  {
    id: 'tenant-admin',
    title: 'Tenant Administrator',
    description: 'Manage tenant resources',
    features: ['Manage customers', 'Device management', 'Dashboard creation'],
  },
  {
    id: 'customer-user',
    title: 'Customer User',
    description: 'Customer-level access',
    features: [
      'View assigned devices',
      'Access dashboards',
      'Limited configuration',
    ],
  },
];

const roles: Role[] = [
  {
    id: 'device-manager',
    roleName: 'Device Manager',
    description: 'Manage devices and telemetry',
    usersCount: 8,
  },
  {
    id: 'dashboard-viewer',
    roleName: 'Dashboard Viewer',
    description: 'Read-only dashboard access',
    usersCount: 15,
  },
  {
    id: 'report-generator',
    roleName: 'Report Generator',
    description: 'Generate and export reports',
    usersCount: 3,
  },
];

export default function UsersAndRolesManagementPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Users');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddUser = () => {
    toast.success('Add user functionality');
  };

  const handleViewDetails = (roleId: string) => {
    navigate(`/users/role-permission-management`);
  };

  const handleEdit = (roleId: string) => {
    navigate(`/users/edit-role/${roleId}`);
  };

  const handleDelete = (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      toast.success('Role deleted successfully');
    }
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="" />
      <div className="mx-auto space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Users and Roles Management
              </h1>
              <p className="text-gray-600">Role: Customer Administrator</p>
            </div>
            <Button
              onClick={handleAddUser}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Navigation Tabs and Search */}
          <div className="flex items-center justify-between gap-4">
            <Tabs
              defaultValue="Users"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="Users"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="Customers"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600"
                >
                  Customers
                </TabsTrigger>
                <TabsTrigger
                  value="Roles"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600"
                >
                  Roles
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                iconPosition="right"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* System Roles Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">System Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {systemRoles.map((role) => (
              <Card key={role.id} className="bg-white shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {role.title}
                    </h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => handleViewDetails(role.id)}
                      className="bg-secondary hover:bg-secondary/90 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Users and Roles Management Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            Users and Roles Management
          </h2>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                      <TableHead className="text-white font-semibold">
                        ROLE NAME
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        DESCRIPTION
                      </TableHead>
                      <TableHead className="text-white font-semibold text-center">
                        USERS COUNT
                      </TableHead>
                      <TableHead className="text-white font-semibold text-right">
                        ACTIONS
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow key={role.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            {role.roleName}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {role.description}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-gray-900 font-medium">
                            {role.usersCount.toString().padStart(2, '0')}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => handleEdit(role.id)}
                              variant="outline"
                              size="sm"
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              EDIT
                            </Button>
                            <Button
                              onClick={() => handleDelete(role.id)}
                              variant="destructive"
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              DELETE
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-secondary-main/30 text-white border-2 border-secondary-main shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Roles
                </p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-success/30 text-white border-2 border-success shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Active Roles
                </p>
                <p className="text-3xl font-bold text-gray-900">10</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/30 text-white border-2 border-yellow-500 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Custom Roles
                </p>
                <p className="text-3xl font-bold text-gray-900">09</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
