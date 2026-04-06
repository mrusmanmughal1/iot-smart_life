import { useState } from 'react';
import { Mail, ScrollText, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUsers } from '@/features/users/hooks';
import { useCustomerById, useCustomers } from '@/features/customer/hooks';
import { useParams } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role?: 'Admin' | 'Manager' | 'User';
  status?: 'Active' | 'Inactive';
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRoleBadgeVariant = (role?: string) => {
  switch (role) {
    case 'active':
      return 'default';
    case 'inactive':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getRoleBadgeColor = (role?: string) => {
  switch (role) {
    case 'Admin':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Manager':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'User':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return '';
  }
};

export default function CustomerUserAssociationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAvailableUsers, setSelectedAvailableUsers] = useState<
    Set<string>
  >(new Set());
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  //get id from params and call the customer details api
  const { id } = useParams();
  const { data: customer } = useCustomerById(id);
  const cutomerData = customer?.data;
  const { data: users } = useUsers({
    search: searchQuery,
    role: 'customer_user',
    status: selectedStatus,
  });

  const { data: customersData } = useCustomers({
    search: searchQuery,
  });

  const toggleAvailableUserSelection = (userId: string) => {
    const newSelection = new Set(selectedAvailableUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedAvailableUsers(newSelection);
  };

  const CustomersList = customersData?.data || [];

  const selectedCustomerInfo = CustomersList.find(
    (c: any) => c.id === selectedCustomerId
  ) || {
    name: 'Select a Customer',
    id: '-',
    plan: '-',
    status: '-',
  };

  const stats = {
    totalAssigned: 0,
    administrators: 0,
    managers: 0,
    regularUsers: 0,
    unassigned: users?.data?.length || 0,
    filteredResults: users?.data?.length || 0,
  };

  return (
    <div className="space-y-6  ">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20">
          {/* <AvatarImage src={cutomerData?.logo} /> */}
          <AvatarFallback className="bg-purple-100 text-purple-700">
            {cutomerData?.name?.[0]?.toUpperCase() || 'C'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {cutomerData?.name}{' '}
            <Badge
              variant={
                cutomerData?.status === 'active' ? 'success' : 'destructive'
              }
            >
              {cutomerData?.status}
            </Badge>
          </h1>
          <p className="text-slate-500 flex items-center gap-2 ">
            {' '}
            <Mail className="h-4 w-4" /> {cutomerData?.email}
          </p>
          <p className="text-slate-500 flex items-center gap-2  text-sm">
            {' '}
            <ScrollText className="h-4 w-4" />
            {cutomerData?.description}
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className=" ">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            iconPosition="left"
            className="  "
          />
        </div>
        <Select
          className="w-40"
          value={selectedRole}
          onValueChange={setSelectedRole}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="User">User</SelectItem>
          </SelectContent>
        </Select>
        <Select
          className="w-40"
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content - Three Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Users Panel */}
        <Card className="pt-4">
          <CardHeader>
            <CardTitle>Available Users</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Select the User you want to Assign
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {users?.data?.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  No available users
                </p>
              ) : (
                users?.data?.map((user: any) => {
                  return (
                    <div
                      key={user.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        selectedAvailableUsers.has(user.id)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300'
                      } transition-colors cursor-pointer`}
                      onClick={() => toggleAvailableUserSelection(user.id)}
                    >
                      <Avatar>
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      {/* add badge with status */}
                      <Badge variant={getRoleBadgeVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex gap-2 pt-4  ">
              <Button
                className="flex-1  "
                // onClick={handleBulkAssign}
                variant="secondary"
                disabled={selectedAvailableUsers.size === 0}
              >
                Assign
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedAvailableUsers(new Set())}
                disabled={selectedAvailableUsers.size === 0}
              >
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers List Panel */}
        <Card className="pt-4">
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Select Customer to Assign the Selected User
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {CustomersList.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  No customers found
                </p>
              ) : (
                CustomersList.map((customer: any) => (
                  <div
                    key={customer.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      selectedCustomerId === customer.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-slate-300'
                    } transition-colors cursor-pointer`}
                    onClick={() => setSelectedCustomerId(customer.id)}
                  >
                    <Avatar>
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {customer.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {customer.email}
                      </p>
                    </div>
                    {customer.status && (
                      <Badge variant={getRoleBadgeVariant(customer.status)}>
                        {customer.status}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2 pt-4  ">
              <Button
                className="flex-1  "
                variant="secondary"
                // onClick={handleBulkAssign}
                disabled={
                  !selectedCustomerId || selectedAvailableUsers.size === 0
                }
              >
                Assign
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Summary Panel */}
        <Card className="pt-4">
          <CardHeader>
            <CardTitle>Assignment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Info */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Name</p>
                <p className="font-medium" title={selectedCustomerInfo.id}>
                  {selectedCustomerInfo.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Plan</p>
                <p className="font-medium">
                  {selectedCustomerInfo.plan || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <Badge
                  variant={getRoleBadgeVariant(selectedCustomerInfo.status)}
                >
                  {selectedCustomerInfo.status}
                </Badge>
              </div>
            </div>

            {/* User Statistics */}
            <div className="space-y-3   ">
              <p className="text-sm font-semibold text-slate-900">
                User Statistics
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Assigned:</span>
                  <span className="font-medium">{stats.totalAssigned}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Administrators:</span>
                  <span className="font-medium">{stats.administrators}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Managers:</span>
                  <span className="font-medium">{stats.managers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Regular Users:</span>
                  <span className="font-medium">{stats.regularUsers}</span>
                </div>
              </div>
            </div>

            {/* Available Users Stats */}
            <div className="space-y-2    ">
              <p className="text-sm font-semibold text-slate-900">
                Available Users
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Unassigned:</span>
                  <span className="font-medium">{stats.unassigned}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Filtered Results:</span>
                  <span className="font-medium">{stats.filteredResults}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4  ">
              <Button className="w-full    " variant="secondary">
                Bulk Assign Role
              </Button>
              <Button className="w-full    " variant="secondary">
                Export List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          variant="outline"
          className="px-8 bg-slate-100 hover:bg-slate-200"
        >
          Cancel
        </Button>
        <Button className="px-8    " variant="secondary">
          Apply
        </Button>
      </div>
    </div>
  );
}
