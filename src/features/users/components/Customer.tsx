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
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { DeleteUserModal } from '@/components/models/DeleteUserModal';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCustomers } from '@/features/customer/hooks';
import { Customer } from '@/features/customer/types';
import { useNavigate } from 'react-router-dom';
import { useDeleteCustomer } from '@/features/customer/hooks/useCustomers';
import { toast } from 'react-hot-toast';
import { User } from '@/services/api/users.api';
import { Pagination } from '@/components/common/Pagination';
const CustomerPage = ({ searchQuery }: { searchQuery: string }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const { data: customersData, isLoading } = useCustomers({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
    });
    const customers = customersData?.data || [];
    const totalPages = customersData?.meta?.totalPages || 1;
    const totalItems = customersData?.meta?.total || customers.length;
    const deleteCustomerMutation = useDeleteCustomer();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleDeleteClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedCustomer) {
            deleteCustomerMutation.mutate(selectedCustomer.id, {
                onSuccess: () => {
                    toast.success('Customer deleted successfully');
                    setSelectedCustomer(null);
                    setDeleteModalOpen(false);
                },
                onError: () => {
                    toast.error('Failed to delete customer');
                },
            });
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">All Customers</h2>
            <Card>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : (
                        <>
                            <Table className='mt-6'>
                                <TableHeader className='bg-primary text-white '>
                                    <TableRow className='bg-primary hover:bg-primary'>
                                        <TableHead>Customer </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers?.map((customer: Customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarFallback className="bg-purple-100 text-purple-700">
                                                            {customer.name?.[0]?.toUpperCase() || 'C'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{customer.name}</p>
                                                        <p className="text-sm text-slate-500">{customer.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="success" className='capitalize'>{customer.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right flex items-center  relative justify-end gap-1">
                                                <Tooltip  >
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon-sm" className='hover:bg-secondary hover:text-white' onClick={() => navigate(`/users-management/customer/${customer.id}`)}>
                                                            <ShieldCheck className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bottom-[70%] w-32"  >
                                                        Manage Customers
                                                    </TooltipContent>
                                                </Tooltip>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon-sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => navigate(`/users-management/edit-customer/${customer.id}`)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleDeleteClick(customer)}
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
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Delete User Modal */}
            <DeleteUserModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                user={selectedCustomer as User | null}
                onConfirm={handleDeleteConfirm}
            // role={selectedCustomer?.role}
            />
        </div>
    )
}

export default CustomerPage