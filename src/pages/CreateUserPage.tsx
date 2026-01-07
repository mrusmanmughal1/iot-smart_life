import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateUser, useRoles } from '@/features/users/hooks';
import { useCustomers } from '@/features/customer/hooks';
import { UserRole, UserStatus } from '@/services/api/users.api';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

// Zod validation schema
const createUserSchema = z.object({
  contactEmail: z.string().min(1, 'Contact email is required'),
  email: z.string().email('Email must be valid').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.string().min(1, 'Role is required'),
  phone: z.string().optional(),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  customerId: z.string().optional(),
  status: z.boolean(),
  additionalInfo: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function CreateUserPage() {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();
  const { data: rolesData } = useRoles();
  const { data: customersData } = useCustomers();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      contactEmail: '',
      email: '',
      password: '',
      role: '',
      phone: '',
      phoneNumber: '',
      customerId: '',
      status: true,
      additionalInfo: '',
    },
    mode: 'onChange',
  });
  // Extract roles from API response
  const roles = rolesData?.data?.data || rolesData?.data || [];
  
  // Extract customers from API response
  const customersResponse = customersData?.data;
  const customers : Array<string> =   [];

  const onSubmit = async (data: CreateUserFormData) => {
    // Transform form data to API format
    const userData = {
      email: data.email,
      name: data.contactEmail, // Using contactEmail as name/display name
      phone: data.phoneNumber || data.phone,
      password: data.password,
      role: data.role as UserRole,
      status: data.status ? UserStatus.ACTIVE : UserStatus.INACTIVE,
      customerId: data.customerId || undefined,
      additionalInfo: data.additionalInfo
        ? { notes: data.additionalInfo }
        : undefined,
    };

    // Use the createUser mutation
    createUserMutation.mutate(
      {
        userData,
        roleId: data.role,
      },
      {
        onSuccess: () => {
          toast.success('User created successfully');
          navigate('/users');
        },
        onError: (error: unknown) => {
          console.error('Failed to create user:', error);
          const errorMessage =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || 'Failed to create user';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Add New User
        </h1>

        {/* Form Card */}
        <Card className="shadow-lg rounded-xl border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              User Details
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Contact Email */}
                  <div>
                    <label
                      htmlFor="contactEmail"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...register('contactEmail')}
                      placeholder="Enter contact email"
                      className="w-full border border-gray-300 rounded-md"
                    />
                    {errors.contactEmail && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.contactEmail.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
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

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="Enter password"
                        className="w-full border border-gray-300 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Role <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="role" className="w-full border border-gray-300 rounded-md">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          {/* <SelectContent>
                            {roles?.data?.data?.map((role: any) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name || role.title}
                              </SelectItem>
                            ))}
                          </SelectContent> */}
                        </Select>
                      )}
                    />
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.role.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone
                    </label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="Enter phone number"
                      className="w-full border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Additional Information */}
                  <div>
                    <label
                      htmlFor="additionalInfo"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Additional Information
                    </label>
                    <Textarea
                      id="additionalInfo"
                      {...register('additionalInfo')}
                      placeholder="Enter additional information..."
                      className="min-h-[100px] w-full border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="phoneNumber"
                      {...register('phoneNumber')}
                      placeholder="Enter phone number"
                      className="w-full border border-gray-300 rounded-md"
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Customer */}
                  <div>
                    <label
                      htmlFor="customerId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Customer
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
                          {/* <SelectContent> */}
                            {/* {customers?.map((customer: any) => (
                              <SelectItem
                                key={customer.id}
                                value={customer.id}
                              >
                                {customer.customerName || customer.name}
                              </SelectItem>
                            ))} */}
                          {/* </SelectContent> */}
                        </Select>
                      )}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          label="Active"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Required fields note */}
              <p className="text-xs text-gray-500 mt-6">
                <span className="text-red-500">*</span> Required fields
              </p>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting || createUserMutation.isPending}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={isSubmitting || createUserMutation.isPending}
                  isLoading={createUserMutation.isPending}
                  className="bg-[#43489C] hover:bg-[#43489C]/90 text-white"
                >
                  Save
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

