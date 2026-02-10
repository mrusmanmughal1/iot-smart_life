import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Edit, Trash2 } from 'lucide-react';
import { DeleteRoleModal } from '@/components/models/DeleteRoleModal';
import { useRoles } from '../hooks';
import { Role } from '@/services/api/users.api';

const Roles = ({searchQuery}: {searchQuery: string}) => {
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const { data: roles } = useRoles();

    const handleEdit = (roleId: string) => {
        navigate(`/users-management/edit-role/${roleId}`);
    };
    const handleDelete = (roleId: string) => {
        const role = roles?.data?.find((r: Role) => r.id === roleId);
        if (role) {
            setSelectedRole(role);
            setDeleteModalOpen(true);
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedRole) {
            setSelectedRole(null);
        }
    };

    const filteredRoles = roles?.data?.filter(
        (role: Role) =>
            role.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            role.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Users and Roles Management
                </h2>
                <Card className="bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-700">
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
                                        <TableHead className="text-white font-semibold text-right">
                                            ACTIONS
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRoles.map((role: Role) => (
                                        <TableRow key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {role.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {role.description}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        onClick={() => handleEdit(role.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                                                    >
                                                        <Edit className="h-4 w-4  " />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(role.id)}
                                                        variant="secondary"
                                                        size="sm"
                                                    >
                                                        <Trash2 className="h-4 w-4  " />
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
            <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-4">
                <Card className="bg-secondary-main/20 text-white border-2 border-secondary-main shadow-sm dark:bg-gray-900 dark:border-gray-700">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-600 mb-2 dark:text-white">
                                Total Roles
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-success/20 text-white border-2 border-success shadow-sm dark:bg-gray-900 dark:border-gray-700">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-600 mb-2 dark:text-white">
                                Active Roles
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">10</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-500/20 text-white border-2 border-yellow-500 shadow-sm dark:bg-gray-900 dark:border-gray-700">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-600 mb-2 dark:text-white">
                                Custom Roles
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">09</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Delete Role Modal */}
            <DeleteRoleModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                role={selectedRole}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    )
}

export default Roles