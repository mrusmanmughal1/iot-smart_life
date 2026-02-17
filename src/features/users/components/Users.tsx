import { MoreVertical, Edit, Trash2, ShieldCheck, } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteUser, useUsers } from '@/features/users/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, UserRole, UserStatus } from '@/services/api/users.api';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { DeleteUserModal } from '@/components/models/DeleteUserModal';
import { Pagination } from '@/components/common/Pagination';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
const Users = ({ searchQuery }: { searchQuery: string }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const { data: usersData, isLoading } = useUsers({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
    });
    const deleteUserMutation = useDeleteUser();
    const users = useMemo(() => usersData?.data || [], [usersData]);
    const totalPages = usersData?.meta?.totalPages || 1;
    const totalItems = usersData?.meta?.total || users.length;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<
        Array<{ id: string; name: string; email: string }>
    >([]);

    const handleManageUsersClick = (user: User) => {
        if (user.role === UserRole.CUSTOMER_USER) {
            navigate(`/users-management/customer-user-permissions/${user.id}`);
        } else {
            navigate(`/users-management/customer/${user.id}`);
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
                    toast.success(`User ${selectedUser.name || selectedUser.email} deleted successfully`);
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
            return [...prev, { id: user.id, name: user.name || '', email: user.email }];
        });
    };

    const handleBulkEdit = () => {
        navigate('/users-management/bulk-management', {
            state: { users: selectedUsers },
        });
    };

    const handleEditClick = (user: User) => {
        if (user.role === UserRole.CUSTOMER_USER) {
            navigate(`/users-management/edit-customer-user/${user.id}`);
        } else {
            navigate(`/users-management/edit-customer/${user.id}`);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">All Users</h2>
            <Card className='pt-6'>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {selectedUsers.length > 0 && (
                                <div className="flex justify-end mb-3">
                                    <Button variant="secondary" onClick={handleBulkEdit}>
                                        Edit Bulk Data ({selectedUsers.length})
                                    </Button>
                                </div>
                            )}
                            <Table >
                                <TableHeader className='bg-primary    text-white'>
                                    <TableRow className='bg-primary hover:bg-primary'>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user: User) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        className=' w-4 h-4 cursor-pointer'
                                                        checked={selectedUsers.some((item) => item.id === user.id)}
                                                        onChange={() => toggleUserSelection(user)}
                                                    /> <Avatar>
                                                        <AvatarFallback className="bg-purple-100 text-purple-700">
                                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <p className='capitalize'>{user.role.replace('_', ' ')}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={user.status === UserStatus.ACTIVE ? 'success' : 'secondary'}
                                                    className="capitalize"
                                                >
                                                    {user.status}
                                                </Badge>
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
                                                            className='hover:bg-secondary hover:text-white'
                                                            onClick={() => handleManageUsersClick(user)}
                                                        >
                                                            <ShieldCheck className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bottom-[70%] w-32">
                                                        Manage users
                                                    </TooltipContent>
                                                </Tooltip>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon-sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditClick(user)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleDeleteClick(user)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
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
        </div>
    )
}

export default Users