import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { rolesApi } from '@/services/api';
import type { Permission } from '@/services/api/users.api';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useUserId } from '@/features/auth/hooks/useUserId';
import { usePermissions } from '@/features/permissions/hooks';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Zod validation schema
const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').trim(),
  description: z.string().optional(),
  isSystem: z.boolean(),
  permissionIds: z.array(z.string()),
});
type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export default function CreateRolePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      isSystem: false,
      permissionIds: [],
    },
    mode: 'onChange',
  });
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
  const userid = useUserId()


  const onSubmit = async (data: CreateRoleFormData) => {
    setIsSubmitting(true);
    try {
      const roleData = {
        name: data.name,
        description: data.description || undefined,
        permissionIds: data.permissionIds,
        isSystem: data.isSystem,
        tenantId: userid || undefined
      };
      await rolesApi.create(roleData);
      toast.success('Role created successfully');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      navigate('/users-management');
    } catch (error: unknown) {
      console.error('Failed to create role:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to create role';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/users-management');
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Create Role
        </h1>

        {/* Two Column Layout */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Role Details */}
            <Card className="shadow-lg rounded-xl border-gray-200">
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
                  <div>
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
                  </div>

                  {/* Required fields note */}
                  <p className="text-xs text-gray-500 mt-4">
                    <span className="text-red-500">*</span> Required fields
                  </p>
                </div>
              </CardContent>
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
                        const isOpen = openCategories[category.category] ?? false;
                        return (
                          <div key={category.category} className="">
                            <button
                              type="button"
                              onClick={() => toggleCategory(category.category)}
                              className="flex w-full items-center justify-between rounded p-2   text-left text-sm font-semibold text-gray-800 bg-secondary text-white"
                            >
                              <span className='first-letter:uppercase '>{category.category}</span>
                              {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                            {isOpen && (
                              <div className="space-y-2  bg-secondary/10 p-2">
                                {category.permissions.map((permission) => {
                                  const isChecked = selectedPermissions.includes(
                                    permission.id
                                  );
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
                                        label={permission.description || permission.name || `${permission.resource}${actionText ? `: ${actionText}` : ''}`}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )
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
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="bg-secondary hover:bg-secondary/90 text-white"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
