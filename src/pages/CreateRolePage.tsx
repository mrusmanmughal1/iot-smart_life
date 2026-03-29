import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { Permission } from '@/services/api/users.api';
import { usePermissions } from '@/features/permissions/hooks';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import {
  useCreateRole,
  useRoleById,
  useUpdateRole,
} from '@/features/roles/hooks';

// Zod validation schema
const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').trim(),
  description: z.string().optional(),
  permissionIds: z.array(z.string()),
});

type CreateRoleFormData = z.infer<typeof createRoleSchema>;

export default function CreateRolePage() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { mutateAsync: createRole } = useCreateRole();
  const { mutateAsync: updateRole } = useUpdateRole();
  const { data: roleData, isLoading: isRoleLoading } = useRoleById(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissionIds: [],
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isEditMode && roleData) {
      reset({
        name: roleData.name || '',
        description: roleData.description || '',
        permissionIds: roleData.permissions?.map((p: any) => p.id) || [],
      });
    }
  }, [isEditMode, roleData, reset]);
  const { data: permissionsData } = usePermissions();
  const permissions = useMemo(
    () => (permissionsData || []) as Permission[],
    [permissionsData]
  );
  const selectedPermissions = watch('permissionIds') || [];

  const permissionCategories = useMemo(() => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach((permission) => {
      const key = permission.resource || 'other';
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(permission);
    });

    return Object.entries(grouped).map(([resource, items]) => ({
      category: resource,
      permissions: items,
    }));
  }, [permissions]);

  const allPermissionIds = useMemo(
    () => permissions.map((permission) => permission.id),
    [permissions]
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSelectAll = () => {
    setValue('permissionIds', allPermissionIds);
  };

  const handleClearAll = () => {
    setValue('permissionIds', []);
  };

  const handlePermissionToggle = (
    permissionId: string,
    currentPermissions: string[],
    onChange: (value: string[]) => void
  ) => {
    if (currentPermissions.includes(permissionId)) {
      onChange(currentPermissions.filter((id) => id !== permissionId));
    } else {
      onChange([...currentPermissions, permissionId]);
    }
  };

  const onSubmit = async (data: CreateRoleFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateRole({ roleId: id as string, data });
        navigate('/users-management', {
          state: { tab: 'Roles' },
        });
      } else {
        await createRole(data);
        navigate('/users-management', {
          state: { tab: 'Roles' },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/users-management', {
      state: { tab: 'Roles' },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          {isEditMode ? 'Edit Role' : 'Create Role'}
        </h1>

        {/* Two Column Layout */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Role Details */}
            <Card className="shadow-lg rounded-xl border-gray-200">
              {isRoleLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
              ) : (
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Role Information
                  </h2>
                  <div className="space-y-4">
                    {/* Role Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Role Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Enter role name"
                        className="w-full border border-gray-300 rounded-md"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Description
                      </label>
                      <Textarea
                        id="description"
                        {...register('description')}
                        placeholder="Enter role description..."
                        className="min-h-[100px] w-full border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* Status */}
                    {/* <div>
                    <Controller
                      name="isSystem"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value as boolean}
                          onChange={(e) => field.onChange(e.target.checked)}
                          label=" System Role"
                        />
                      )}
                    />
                  </div> */}

                    {/* Required fields note */}
                    <p className="text-xs text-gray-500 mt-4">
                      <span className="text-red-500">*</span> Required fields
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Right Column - Permissions */}
            <Card className="shadow-lg rounded-xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Permissions
                  </h2>
                  <div className="flex mb-2 gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSelectAll}
                      className="bg-secondary hover:bg-secondary/10 text-white text-xs px-3 py-1 h-8"
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleClearAll}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 h-8"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>

                <Controller
                  name="permissionIds"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {permissionCategories.map((category) => {
                        const isOpen =
                          openCategories[category.category] ?? false;
                        return (
                          <div key={category.category} className="">
                            <button
                              type="button"
                              onClick={() => toggleCategory(category.category)}
                              className="flex w-full items-center justify-between rounded p-2   text-left text-sm font-semibold text-gray-800 bg-gray-200 text-gray-700"
                            >
                              <span className="first-letter:uppercase ">
                                {category.category.replace('_', ' ')}
                              </span>
                              {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                            {isOpen && (
                              <div className="space-y-2  bg-gray-100 p-2">
                                {category.permissions.map((permission) => {
                                  const isChecked =
                                    selectedPermissions.includes(permission.id);
                                  const actionText = permission.action;

                                  return (
                                    <div
                                      key={permission.id}
                                      className="flex items-center gap-2"
                                    >
                                      <Checkbox
                                        checked={isChecked}
                                        onChange={() =>
                                          handlePermissionToggle(
                                            permission.id,
                                            selectedPermissions,
                                            field.onChange
                                          )
                                        }
                                        label={
                                          permission.description ||
                                          permission.name ||
                                          `${permission.resource}${actionText ? `: ${actionText}` : ''}`
                                        }
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-start gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              className="bg-secondary hover:bg-secondary/90 text-white"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditMode ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
