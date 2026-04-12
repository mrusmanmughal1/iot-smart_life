import { Trash2, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDeleteUser,
  useSearchUsers,
  useUsers,
  useUpdateUserStatus,
} from '@/features/users/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, UserRole, UserStatus } from '@/services/api/users.api';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { DeleteUserModal } from '@/components/models/DeleteUserModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Switch } from '@/components/ui/switch';
import { Pagination } from '@/components/common/Pagination';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
const Users = ({ searchQuery }: { searchQuery: string }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<
    'all' | 'customer_user' | 'customer'
  >('all');
  const itemsPerPage = 10;
  const roleParam = roleFilter === 'all' ? undefined : roleFilter;

  const { data: usersData, isLoading } = useUsers({
    page: currentPage,
    limit: itemsPerPage,
    role: roleParam,
    search: searchQuery,
  });

  const deleteUserMutation = useDeleteUser();
  const isTableLoading = isLoading;
  const users = useMemo(() => usersData?.data || [], [usersData]);
  const totalPages = usersData?.meta?.totalPages || 1;
  const totalItems = usersData?.meta?.total || users.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<
    Array<{ id: string; name: string; email: string; role: string }>
  >([]);

  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [userToUpdateStatus, setUserToUpdateStatus] = useState<User | null>(
    null
  );
  const updateUserStatusMutation = useUpdateUserStatus();

  const handleManageUsersClick = (user: User) => {
    console.log(user);
    if (user.role === UserRole.CUSTOMER_USER) {
      navigate(`/users-management/customer-user/${user.id}`);
    } else {
      navigate(`/users-management/customer/${user.customerId}`);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id, {
        onSuccess: () => {
          toast.success(
            `User ${selectedUser.name || selectedUser.email} deleted successfully`
          );
          setSelectedUser(null);
        },
        onError: (error: unknown) => {
          console.error('Failed to delete user:', error);
          const errorMessage =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || 'Failed to delete user';
          toast.error(errorMessage);
        },
      });
    }
  };

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((item) => item.id === user.id);
      if (exists) {
        return prev.filter((item) => item.id !== user.id);
      }
      return [
        ...prev,
        {
          id: user.id,
          name: user.name || '',
          email: user.email,
          role: user.role,
        },
      ];
    });
  };

  const handleBulkEdit = () => {
    navigate('/users-management/bulk-management', {
      state: { users: selectedUsers },
    });
  };

  const handleStatusToggle = (user: User) => {
    setUserToUpdateStatus(user);
    setStatusConfirmOpen(true);
  };

  const handleStatusConfirm = () => {
    if (userToUpdateStatus) {
      const newStatus =
        userToUpdateStatus.status === UserStatus.ACTIVE
          ? UserStatus.INACTIVE
          : UserStatus.ACTIVE;
      updateUserStatusMutation.mutate(
        { userId: userToUpdateStatus.id, status: newStatus },
        {
          onSuccess: () => {
            toast.success(`User status updated to ${newStatus}`);
            setStatusConfirmOpen(false);
            setUserToUpdateStatus(null);
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message || 'Failed to update user status'
            );
          },
        }
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          All Users
        </h2>
        <Tabs
          defaultValue="all"
          value={roleFilter}
          onValueChange={(value) =>
            setRoleFilter(value as 'all' | 'customer_user' | 'customer')
          }
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="customer_user">Customer User</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Card className="pt-6">
        <CardContent>
          {isTableLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {selectedUsers.length > 0 && (
                <div className="flex justify-end mb-3">
                  <Button variant="secondary" onClick={handleBulkEdit}>
                    Edit Bulk Data ({selectedUsers.length})
                  </Button>
                </div>
              )}
              <Table>
                <TableHeader className="bg-primary    text-white">
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="ps-2">Users</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user: User) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className=" w-4 h-4 cursor-pointer"
                              checked={selectedUsers.some(
                                (item) => item.id === user.id
                              )}
                              onChange={() => toggleUserSelection(user)}
                            />{' '}
                            <Avatar>
                              <AvatarFallback className="bg-purple-100 text-purple-700">
                                {user.name?.[0]?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-slate-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <p className="capitalize">
                            {user.role.replace('_', ' ')}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.status === UserStatus.ACTIVE}
                              onCheckedChange={() => handleStatusToggle(user)}
                              disabled={
                                updateUserStatusMutation.isPending &&
                                userToUpdateStatus?.id === user.id
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right flex items-center  relative justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="hover:bg-secondary hover:text-white"
                                onClick={() => handleDeleteClick(user)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bottom-[70%] max-w-36">
                              Delete User
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="hover:bg-secondary hover:text-white"
                                onClick={() => handleManageUsersClick(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bottom-[70%] max-w-36">
                              View Details
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete User Modal */}
      <DeleteUserModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        user={selectedUser}
        onConfirm={handleDeleteConfirm}
        role={selectedUser?.role}
      />

      {/* Status Confirmation Modal */}
      <ConfirmDialog
        open={statusConfirmOpen}
        onOpenChange={setStatusConfirmOpen}
        title="Confirm Status Change"
        description={`Are you sure you want to ${
          userToUpdateStatus?.status === UserStatus.ACTIVE
            ? 'deactivate'
            : 'activate'
        } user ${userToUpdateStatus?.name || userToUpdateStatus?.email}?`}
        onConfirm={handleStatusConfirm}
      />
    </div>
  );
};

export default Users;
