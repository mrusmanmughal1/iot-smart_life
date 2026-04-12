import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRoles } from '@/features/users/hooks';
import type { Role, UserRole } from '@/services/api/users.api';
import type { Customer } from '@/features/customer/types';
import { toast } from 'react-hot-toast';
import { useCreateCustomerUser } from '@/features/customerUser/hooks';
import { useCustomersByTenantId } from '@/features/customer/hooks/useCustomers';
import { useAppStore } from '@/stores/useAppStore';

const createUserSchema = z.object({
  name: z.string().min(1, 'Contact email is required'),
  email: z.string().email('Email must be valid').min(1, 'Email is required'),
  roleId: z.string(),
  phone: z.string().min(8, 'Phone number is required'),
  customerId: z.string().min(1, 'Customer is required'),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function CreateUserPage() {
  const navigate = useNavigate();
  const createUserMutation = useCreateCustomerUser();
  const { data: rolesData } = useRoles();
  const { data: customersData } = useCustomersByTenantId();
  const { user } = useAppStore();
  const isCustomerAdmin = user?.role === 'customer';
  const roles: Role[] = rolesData?.data || [];

  const customersList: Customer[] = customersData?.data || [];
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      roleId: '',
      phone: '',
      customerId: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: CreateUserFormData) => {
    const userData = {
      email: data.email,
      name: data.name,
      phone: data.phone,
      roleId: data.roleId as UserRole,
      customerId: data.customerId || undefined,
      // customerId: '',
    };

    createUserMutation.mutate({ userData });
  };

  const handleCancel = () => {
    navigate('/users-management');
  };

  return (
    <div className="min-h-screen    ">
      <div className="  mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Add New User
        </h1>

        <Card className="shadow-sm rounded-xl border border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              User Details
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      type="text"
                      {...register('name')}
                      placeholder="Enter customer name"
                      className="w-full border border-gray-300 rounded-md"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="Enter phone number"
                      className="w-full border border-gray-300 rounded-md"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="Enter email address"
                      className="w-full border border-gray-300 rounded-md"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Role
                    </label>
                    <Controller
                      name="roleId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="roleId"
                            className="w-full border border-gray-300 rounded-md"
                          >
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem
                                key={role.id}
                                value={role.id}
                                textValue={role.name}
                              >
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.roleId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.roleId.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right column */}
                <div className="">
                  {!isCustomerAdmin && (
                    <div>
                      <label
                        htmlFor="customerId"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Customers List <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="customerId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value || ''}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              id="customerId"
                              className="w-full border border-gray-300 rounded-md"
                            >
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent>
                              {customersList.map((customer) => (
                                <SelectItem
                                  key={customer.id}
                                  value={customer.id}
                                  textValue={customer.name}
                                >
                                  <div className="flex flex-col">
                                    {customer.name}
                                    <span className="text-xs text-gray-500">
                                      {customer.email}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  )}
                  {errors.customerId && (
                    <p className=" text-sm text-red-600">
                      {errors.customerId.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting || createUserMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || createUserMutation.isPending}
                  isLoading={createUserMutation.isPending}
                  variant="secondary"
                >
                  Save
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-xs text-gray-500 mt-4">
          <span className="text-red-500">*</span> Required fields
        </p>
      </div>
    </div>
  );
}
