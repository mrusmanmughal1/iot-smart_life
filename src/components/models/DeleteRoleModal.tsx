import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Role } from '@/services/api/users.api';

interface DeleteRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onConfirm: () => void;
}

export const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
  open,
  onOpenChange,
  role,
  onConfirm,
}) => {
  if (!role) return null;

  const handleDelete = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 bg-white">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Delete Role
            </h2>
            <p className="text-base text-gray-700">
              Are you sure you want to delete the following role?
            </p>
          </div>

          {/* Role Information Card */}
          <div className="relative bg-gray-50 rounded-lg p-4 border border-gray-200">
            <button
              onClick={handleCancel}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-4 pr-8">
              <div className="h-12 w-12 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {role.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-bold text-gray-900">{role.name}</p>
                <p className="text-sm text-gray-600">{role.description}</p>
                <p className="text-sm text-gray-600">
                  Permissions: {role.permissions.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Section */}
          <div className="space-y-2">
            <p className="font-bold text-red-600 text-sm">Warning</p>
            <p className="text-sm text-gray-700">
              This action cannot be undone. The role will be removed and users assigned to this role will lose access to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
              <li>All role-based permissions and access</li>
              <li>Associated configurations and settings</li>
            </ul>
          </div>
          {/* Action Buttons */}
          <DialogFooter className="flex-row justify-end gap-3 pt-4 border-t">
            <Button
              onClick={handleDelete}
              className="bg-secondary hover:bg-secondary/90 text-white"
            >
              Delete
            </Button>
            <Button
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Cancel
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

