import { useState } from 'react';
import { Search, Plus, Minus, Download } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface User {
  id: string;
  name: string;
  email: string;
  role?: 'Admin' | 'Manager' | 'User';
  status?: 'Active' | 'Inactive';
}

const mockAvailableUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@email.com', status: 'Active' },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    status: 'Active',
  },
  { id: '3', name: 'John Doe', email: 'john.doe@email.com', status: 'Active' },
];

const mockAssignedUsers: User[] = [
  {
    id: '4',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: '6',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'Manager',
    status: 'Active',
  },
];

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
    case 'Admin':
      return 'default';
    case 'Manager':
      return 'secondary';
    case 'User':
      return 'outline';
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
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [availableUsers, setAvailableUsers] =
    useState<User[]>(mockAvailableUsers);
  const [assignedUsers, setAssignedUsers] = useState<User[]>(mockAssignedUsers);
  const [selectedAvailableUsers, setSelectedAvailableUsers] = useState<
    Set<string>
  >(new Set());
  const [selectedAssignedUsers, setSelectedAssignedUsers] = useState<
    Set<string>
  >(new Set());

  const customerInfo = {
    name: 'Acme Corporation',
    id: '12345',
    type: 'Enterprise',
    status: 'Active',
  };

  const handleAddUser = (userId: string) => {
    const user = availableUsers.find((u) => u.id === userId);
    if (user) {
      setAssignedUsers([...assignedUsers, { ...user, role: 'User' }]);
      setAvailableUsers(availableUsers.filter((u) => u.id !== userId));
      setSelectedAvailableUsers(new Set());
    }
  };

  const handleRemoveUser = (userId: string) => {
    const user = assignedUsers.find((u) => u.id === userId);
    if (user) {
      const { role, ...userWithoutRole } = user;
      setAvailableUsers([...availableUsers, userWithoutRole]);
      setAssignedUsers(assignedUsers.filter((u) => u.id !== userId));
      setSelectedAssignedUsers(new Set());
    }
  };

  const handleBulkAssign = () => {
    const usersToAssign = availableUsers.filter((u) =>
      selectedAvailableUsers.has(u.id)
    );
    const usersWithRole = usersToAssign.map((u) => ({
      ...u,
      role: 'User' as const,
    }));
    setAssignedUsers([...assignedUsers, ...usersWithRole]);
    setAvailableUsers(
      availableUsers.filter((u) => !selectedAvailableUsers.has(u.id))
    );
    setSelectedAvailableUsers(new Set());
  };

  const handleBulkRemove = () => {
    const usersToRemove = assignedUsers.filter((u) =>
      selectedAssignedUsers.has(u.id)
    );
    const usersWithoutRole = usersToRemove.map(({ role, ...rest }) => rest);
    setAvailableUsers([...availableUsers, ...usersWithoutRole]);
    setAssignedUsers(
      assignedUsers.filter((u) => !selectedAssignedUsers.has(u.id))
    );
    setSelectedAssignedUsers(new Set());
  };

  const toggleAvailableUserSelection = (userId: string) => {
    const newSelection = new Set(selectedAvailableUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedAvailableUsers(newSelection);
  };

  const toggleAssignedUserSelection = (userId: string) => {
    const newSelection = new Set(selectedAssignedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedAssignedUsers(newSelection);
  };

  const filteredAvailableUsers = availableUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || true; // Role filter for available users
    const matchesStatus =
      selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredAssignedUsers = assignedUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    totalAssigned: assignedUsers.length,
    administrators: assignedUsers.filter((u) => u.role === 'Admin').length,
    managers: assignedUsers.filter((u) => u.role === 'Manager').length,
    regularUsers: assignedUsers.filter((u) => u.role === 'User').length,
    unassigned: availableUsers.length,
    filteredResults: filteredAvailableUsers.length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Customer-User Association
          </h1>
          <p className="text-slate-500 mt-2">
            Customer: {customerInfo.name} (ID: {customerInfo.id})
          </p>
        </div>
        <Button className="bg-black hover:bg-black/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
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
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
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
              Users not assigned to this customer
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredAvailableUsers.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  No available users
                </p>
              ) : (
                filteredAvailableUsers.map((user) => (
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
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddUser(user.id);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2 pt-4  ">
              <Button
                className="flex-1 bg-secondary hover:bg-secondary/90 text-white"
                onClick={handleBulkAssign}
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

        {/* Assigned Users Panel */}
        <Card className="pt-4">
          <CardHeader>
            <CardTitle>Assigned Users</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Users currently assigned to this customer
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredAssignedUsers.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  No assigned users
                </p>
              ) : (
                filteredAssignedUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      selectedAssignedUsers.has(user.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-slate-300'
                    } transition-colors cursor-pointer`}
                    onClick={() => toggleAssignedUserSelection(user.id)}
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
                    {user.role && (
                      <Badge
                        className={`${getRoleBadgeColor(user.role)} border`}
                        variant={getRoleBadgeVariant(user.role)}
                      >
                        {user.role}
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveUser(user.id);
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2 pt-4  ">
              <Button
                className="flex-1 bg-secondary hover:bg-secondary/90 text-white"
                onClick={handleBulkAssign}
                disabled={selectedAssignedUsers.size === 0}
              >
                Assign
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBulkRemove}
                disabled={selectedAssignedUsers.size === 0}
              >
                Remove
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
                <p className="font-medium">{customerInfo.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Type</p>
                <p className="font-medium">{customerInfo.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <Badge className="bg-green-100 text-green-700 border-green-200 border hover:bg-green-200 hover:text-green-700">
                  {customerInfo.status}
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
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
                Bulk Assign Role
              </Button>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
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
        <Button className="px-8 bg-secondary hover:bg-secondary/90 text-white">
          Apply
        </Button>
      </div>
    </div>
  );
}
