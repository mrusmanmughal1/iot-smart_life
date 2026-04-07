import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  Building,
  Clock,
  Calendar,
} from 'lucide-react';
import { DeleteUserModal } from '@/components/models/DeleteUserModal';
import { useDeleteUser } from '@/features/users/hooks';
import { User, UserStatus } from '@/services/api/users.api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserDetailsCardProps {
  user: User | undefined;
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  const navigate = useNavigate();
  const deleteUserMutation = useDeleteUser();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteConfirm = () => {
    if (user) {
      deleteUserMutation.mutate(user.id, {
        onSuccess: () => {
          toast.success(`User ${user.name || user.email} deleted successfully`);
          navigate('/users-management', { state: { tab: 'Users' } });
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

  const handleEditClick = () => {
    if (user) {
      navigate(`/users-management/add-new-user`, { state: { user: user } });
    }
  };

  return (
    <>
      <Card className="bg-white shadow-sm border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 ring-4 ring-primary/10">
                <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
                  {user?.name?.[0]?.toUpperCase() ||
                    user?.email?.[0]?.toUpperCase() ||
                    'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.name || 'Customer User Details'}
                  </h1>
                  <Badge
                    variant={
                      user?.status === UserStatus.ACTIVE
                        ? 'success'
                        : 'secondary'
                    }
                  >
                    {user?.status || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Shield className="h-4 w-4" />
                  <span className="capitalize">
                    {user?.role?.replace('_', ' ') || 'No Role'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-start">
              <Button
                onClick={handleEditClick}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
              <Button
                onClick={() => setDeleteModalOpen(true)}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.email || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Company
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.companyName || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Last Login
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Created At
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Last Updated
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteUserModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        user={user || null}
        onConfirm={handleDeleteConfirm}
        role={user?.role}
      />
    </>
  );
}
