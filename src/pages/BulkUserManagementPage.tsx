import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PageHeader } from '@/components/common/PageHeader';

interface SelectedUser {
  id: string;
  email: string;
  name: string;
}

export default function BulkUserManagementPage() {
  const navigate = useNavigate();
  const [selectedActions, setSelectedActions] = useState<Set<string>>(
    new Set()
  );

  // Mock selected users - in real app, this would come from props or state
  const selectedUsers: SelectedUser[] = [
    { id: '1', email: 'john.doe@company.com', name: 'John Doe' },
    { id: '2', email: 'jane.smith@company.com', name: 'Jane Smith' },
    { id: '3', email: 'bob.johnson@company.com', name: 'Bob Johnson' },
    { id: '4', email: 'alice.williams@company.com', name: 'Alice Williams' },
    { id: '5', email: 'charlie.brown@company.com', name: 'Charlie Brown' },
  ];

  const selectedCount = selectedUsers.length;
  const displayedEmails = selectedUsers.slice(0, 2).map((u) => u.email);
  const remainingCount = selectedCount - 2;

  const handleActionClick = (actionId: string) => {
    setSelectedActions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(actionId)) {
        newSet.delete(actionId);
      } else {
        newSet.add(actionId);
      }
      return newSet;
    });
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
    navigate('/users');
  };

  const ActionButton = ({
    id,
    label,
    variant = 'outline',
    className = '',
  }: {
    id: string;
    label: string;
    variant?: 'outline' | 'destructive';
    className?: string;
  }) => {
    const isSelected = selectedActions.has(id);
    return (
      <Button
        type="button"
        variant={isSelected ? 'default' : variant}
        onClick={() => handleActionClick(id)}
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <PageHeader
          title="Bulk User Management"
          description="Perform actions on multiple users simultaneously"
        />

        {/* Selected Users Banner */}
        <div className="bg-[#43489C] text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg mb-1">
                {selectedCount} users selected
              </p>
              <p className="text-sm text-white/90">
                {displayedEmails.join(', ')}
                {remainingCount > 0 && `, +${remainingCount} more`}
              </p>
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
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    User Status
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton
                      id="activate"
                      label="Activate Users"
                      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                    />
                    <ActionButton
                      id="deactivate"
                      label="Deactivate Users"
                      className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                    />
                    <ActionButton
                      id="suspend"
                      label="Suspend Users"
                      className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
                    />
                    <ActionButton
                      id="reset-password"
                      label="Reset Password"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Role Management Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Role Management
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton
                      id="assign-role"
                      label="Assign Role"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    />
                    <ActionButton
                      id="remove-role"
                      label="Remove Role"
                      className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                    />
                    <ActionButton
                      id="update-permissions"
                      label="Update Permissions"
                      className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
                    />
                    <ActionButton
                      id="bulk-import"
                      label="Bulk Import"
                      className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Communication Card */}
              <Card className="border border-gray-200 shadow-sm">
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
                      />
                      <ActionButton
                        id="send-notification"
                        label="Send Notification"
                        className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-orange-50 p-2 rounded border border-orange-200">
                      <Mail className="h-4 w-4 text-orange-600" />
                      <span>Email template: User Account Update</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Management Card */}
              <Card className="border border-gray-200 shadow-sm md:col-span-2 lg:col-span-1">
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
                        id="delete-users"
                        label="Delete Users"
                        variant="destructive"
                        className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                      />
                    </div>
                    <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Warning: This action cannot be undone</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Footer Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="default"
              onClick={handleExecute}
              disabled={selectedActions.size === 0}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            >
              Execute Actions
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handlePreview}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Preview
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
            >
              Cancel
            </Button>
          </div>
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
  );
}
