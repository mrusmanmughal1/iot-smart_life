import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { PageHeader } from '@/components/common/PageHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  useBulkUpdateUsers,
  useBulkUpdateUserStatus,
  useRoles,
} from '@/features/users/hooks';
import { UserStatus } from '@/services/api/users.api';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface SelectedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function BulkUserManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedActions, setSelectedActions] = useState<Set<string>>(
    new Set()
  );
  const { mutate: bulkUpdateUserStatus } = useBulkUpdateUserStatus();
  const { mutate: bulkUpdateUsers } = useBulkUpdateUsers();
  const { data: rolesData, isLoading: isRolesLoading } = useRoles();
  const selectedUsers: SelectedUser[] = location.state?.users || [];

  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<UserStatus | null>(null);

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [communicationModalOpen, setCommunicationModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    'assign-role' | 'remove-role' | 'send-email' | 'send-notification' | ''
  >('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');

  const selectedCount = selectedUsers.length;

  const handleActionClick = (action: UserStatus) => {
    setPendingAction(action);
    setStatusConfirmOpen(true);
  };

  const handleStatusConfirm = () => {
    if (pendingAction) {
      bulkUpdateUserStatus(
        {
          userIds: selectedUsers.map((user) => user.id),
          status: pendingAction,
        },
        {
          onSuccess: () => {
            toast.success(`${pendingAction} users status updated successfully`);
            setStatusConfirmOpen(false);
            setPendingAction(null);
          },
          onError: (error: unknown) => {
            console.error('Failed to update users status:', error);
            const errorMessage =
              (error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message || 'Failed to update users status';
            toast.error(errorMessage);
          },
        }
      );
    }
  };

  const handleRoleAction = (action: 'assign-role' | 'remove-role') => {
    setCurrentAction(action);
    setRoleModalOpen(true);
  };

  const handleCommunicationAction = (
    action: 'send-email' | 'send-notification'
  ) => {
    setCurrentAction(action);
    setCommunicationModalOpen(true);
  };

  const onRoleConfirm = () => {
    if (!selectedRoleId) {
      toast.error('Please select a role');
      return;
    }

    const selectedRole = rolesData?.data.find((r) => r.id === selectedRoleId);

    bulkUpdateUsers(
      {
        userIds: selectedUsers.map((u) => u.id),
        data: { role: selectedRole?.name },
      },
      {
        onSuccess: () => {
          toast.success(
            `Successfully ${currentAction === 'assign-role' ? 'assigned' : 'removed'} role`
          );
          setRoleModalOpen(false);
          setSelectedRoleId('');
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || 'Failed to update roles'
          );
        },
      }
    );
  };

  const onCommunicationConfirm = () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    toast.success(
      `${currentAction === 'send-email' ? 'Email' : 'Notification'} sent successfully`
    );
    setCommunicationModalOpen(false);
    setMessageText('');
  };

  const handleExecute = () => {
    if (selectedActions.size === 0) {
      toast.error('Please select at least one action');
      return;
    }
    toast.success(
      `Executing ${selectedActions.size} action(s) on ${selectedCount} users`
    );
    // TODO: Implement actual bulk operation
  };

  const handlePreview = () => {
    toast.success('Preview functionality coming soon');
  };

  const handleCancel = () => {
    navigate('/users-management');
  };

  const ActionButton = ({
    id,
    label,
    variant = 'outline',
    className = '',
    onClick,
  }: {
    id: string;
    label: string;
    variant?: 'outline' | 'destructive';
    className?: string;
    onClick?: () => void;
  }) => {
    const isSelected = selectedActions.has(id);
    return (
      <Button
        type="button"
        variant={isSelected ? 'default' : variant}
        onClick={onClick}
        className={`w-full ${
          isSelected
            ? 'bg-[#43489C] text-white hover:bg-[#43489C]/90'
            : className
        }`}
      >
        {label}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <PageHeader
          title="Bulk User Management"
          description="Perform actions on multiple users simultaneously"
        />
        {/* Selected Users Banner */}
        <div className="bg-secondary    text-white rounded-lg p-4">
          <p className="font-semibold text-lg mb-1">
            Total {selectedCount} users selected
          </p>
          <div className="flex items-center pt-6 justify-between max-h-96 overflow-y-auto ">
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="border border-gray-200 shadow-sm"
                  >
                    <CardContent className="p-4 space-y-1 flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                        <div className="">
                          <p className="text-xs capitalize text-gray-600">
                            Role: {user.role.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Available Actions */}
        <Card className="shadow-lg rounded-xl border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Available Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User Status Card */}
              <Card className="border bg-gray-200 border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    User Status
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton
                      id="activate"
                      label="Activate Users"
                      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                      onClick={() => handleActionClick(UserStatus.ACTIVE)}
                    />
                    <ActionButton
                      id="deactivate"
                      label="Deactivate Users"
                      className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                      onClick={() => handleActionClick(UserStatus.INACTIVE)}
                    />
                    <ActionButton
                      id="suspend"
                      label="Suspend Users"
                      className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
                      onClick={() => handleActionClick(UserStatus.SUSPENDED)}
                    />
                    <ActionButton
                      id="delete-users"
                      label="Delete Users"
                      variant="destructive"
                      className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Role Management Card */}
              <Card className="border border-gray-200 shadow-sm bg-gray-200 border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Role Management
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton
                      id="assign-role"
                      label="Assign Role"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                      onClick={() => handleRoleAction('assign-role')}
                    />
                    <ActionButton
                      id="remove-role"
                      label="Remove Role"
                      className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                      onClick={() => handleRoleAction('remove-role')}
                    />
                    <ActionButton
                      id="update-permissions"
                      label="Update Permissions"
                      className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Communication Card */}
              <Card className="border border-gray-200 shadow-sm bg-gray-200 border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Communication
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <ActionButton
                        id="send-email"
                        label="Send Email"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                        onClick={() => handleCommunicationAction('send-email')}
                      />
                      <ActionButton
                        id="send-notification"
                        label="Send Notification"
                        className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                        onClick={() =>
                          handleCommunicationAction('send-notification')
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Management Card */}
              <Card className="border border-gray-200 shadow-sm md:col-span-2 lg:col-span-1 bg-gray-200 border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Data Management
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <ActionButton
                        id="export-data"
                        label="Export Data"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                      />

                      <ActionButton
                        id="bulk-import"
                        label="Bulk Import"
                        className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Footer Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleExecute}
              disabled={selectedActions.size === 0}
              className="bg-[#A53887] hover:bg-[#A53887]/90 text-white"
            >
              Ready to execute on {selectedCount} users
            </Button>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={statusConfirmOpen}
        onOpenChange={setStatusConfirmOpen}
        title="Confirm Bulk Status Change"
        description={`Are you sure you want to change the status of ${selectedCount} users to ${pendingAction}?`}
        onConfirm={handleStatusConfirm}
      />

      {/* Role Management Modal */}
      <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAction === 'assign-role' ? 'Assign Role' : 'Remove Role'}
            </DialogTitle>
            <DialogDescription>
              Select a role to{' '}
              {currentAction === 'assign-role' ? 'assign to' : 'remove from'}{' '}
              {selectedCount} users.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            {isRolesLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-secondary" />
              </div>
            ) : (
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesData?.data.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-secondary text-white hover:bg-secondary/90"
              onClick={onRoleConfirm}
              disabled={!selectedRoleId}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Communication Modal */}
      <Dialog
        open={communicationModalOpen}
        onOpenChange={setCommunicationModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAction === 'send-email'
                ? 'Send Email'
                : 'Send Notification'}
            </DialogTitle>
            <DialogDescription>
              Enter the message you want to send to {selectedCount} users.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <Textarea
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCommunicationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-secondary text-white hover:bg-secondary/90"
              onClick={onCommunicationConfirm}
              disabled={!messageText.trim()}
            >
              Send {currentAction === 'send-email' ? 'Email' : 'Notification'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
