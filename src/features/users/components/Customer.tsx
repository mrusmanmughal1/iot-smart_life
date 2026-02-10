import { MoreVertical, Edit, Trash2, Users2, } from 'lucide-react';
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
import { useState } from 'react';
import { DeleteUserModal } from '@/components/models/DeleteUserModal';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCustomers } from '@/features/customer/hooks';
import { Customer } from '@/features/customer/types';
const CustomerPage = ({searchQuery}: {searchQuery: string}) => {
    const { data: customersData, isLoading } = useCustomers();
    const customers = customersData?.data || [];
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const handleDeleteClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };
    const handleDeleteConfirm = () => {
       
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
                        <Table className='mt-6'>
                            <TableHeader className='bg-primary text-white '>
                                <TableRow>
                                    <TableHead>Customer </TableHead>
                                    <TableHead>Role</TableHead>
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
                                            <Badge variant="outline">Administrator</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="success">Active</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(customer.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right flex items-center  relative justify-end gap-1">
                                            <Tooltip  >
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon-sm">
                                                        <Users2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="absolute   shadow-md "  >
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
                                                    <DropdownMenuItem>
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
                    )}
                </CardContent>
            </Card>

            {/* Delete User Modal */}
            <DeleteUserModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                customer={selectedCustomer}
                user={null}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    )
}

export default CustomerPage