import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cpu, Layout, Box, Map, Zap, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  useCreateCustomer,
  useCustomerById,
  useUpdateCustomer,
} from '@/features/customer/hooks';
import type { Customer } from '@/features/customer/types';

import { LoadingOverlay } from '@/components/common/LoadingSpinner';
import { useAppStore } from '@/stores/useAppStore';
// Zod validation schema
const createCustomerSchema = z.object({
  name: z.string().min(1, 'Customer name is required').trim(),
  email: z
    .string()
    .email('Contact email must be valid')
    .min(1, 'Contact email is required'),
  phone: z.string().min(1, 'Phone number is required').trim(),
  description: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string(),

  allocatedLimits: z.object({
    devices: z.string(),
    dashboards: z.string(),
    assets: z.string(),
    floorPlans: z.string(),
    automations: z.string(),
    users: z.string(),
  }),
});
type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;

export default function CreateCustomerPage() {
  const navigate = useNavigate();
  const id = useAppStore((state) => state.user?.id);
  const isEditMode = !!id;
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  const { data: customerData, isLoading } = useCustomerById(id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      description: '',
      city: '',
      address: '',
      state: '',
      zip: '',
      country: '',

      allocatedLimits: {
        devices: '',
        dashboards: '',
        assets: '',
        floorPlans: '',
        automations: '',
        users: '',
      },
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (customerData) {
      const customer =
        (customerData as { data?: Customer })?.data ||
        (customerData as unknown as Customer);
      if (!customer) return;

      reset({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        description: customer.description || '',
        city: customer.city || '',
        address: customer.address || '',
        state: customer.state || '',
        zip: customer.zip || '',
        country: customer.country || '',
        allocatedLimits: {
          devices: customer.allocatedLimits?.devices?.toString() || '0',
          dashboards: customer.allocatedLimits?.dashboards?.toString() || '0',
          assets: customer.allocatedLimits?.assets?.toString() || '0',
          floorPlans: customer.allocatedLimits?.floorPlans?.toString() || '0',
          automations: customer.allocatedLimits?.automations?.toString() || '0',
          users: customer.allocatedLimits?.users?.toString() || '0',
        },
      });
    }
  }, [customerData, isEditMode, reset]);

  const customer = isEditMode
    ? (customerData as { data?: Customer })?.data ||
      (customerData as unknown as Customer)
    : null;
  console.log(customer);
  const onSubmit = async (data: CreateCustomerFormData) => {
    const customerData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      description: data.description || undefined,
      city: data.city || undefined,
      address: data.address || undefined,
      state: data.state || undefined,
      zip: data.zip || undefined,
      country: data.country,
      allocatedLimits: {
        devices: parseInt(data.allocatedLimits.devices) || 0,
        dashboards: parseInt(data.allocatedLimits.dashboards) || 0,
        assets: parseInt(data.allocatedLimits.assets) || 0,
        floorPlans: parseInt(data.allocatedLimits.floorPlans) || 0,
        automations: parseInt(data.allocatedLimits.automations) || 0,
        users: parseInt(data.allocatedLimits.users) || 0,
      },
    };

    if (isEditMode) {
      updateCustomerMutation.mutate(
        { customerId: id!, data: customerData },
        {
          onSuccess: () => {
            toast.success('Customer updated successfully');
            navigate('/users-management', {
              state: { tab: 'Customers' },
            });
          },
          onError: (error: unknown) => {
            const errorMessage =
              (error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message || 'Failed to update customer';
            toast.error(errorMessage);
          },
        }
      );
    } else {
      createCustomerMutation.mutate(customerData);
    }
  };

  const handleCancel = () => {
    navigate('/customer-management');
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-gray-50  ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {isEditMode ? 'Edit Customer' : 'Add New Customer'}
        </h1>

        {/* Two Column Layout */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Customer Information and Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information Card */}
              <Card className="shadow-lg rounded-xl border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Customer Information
                  </h2>
                  <div className="space-y-4">
                    {/* Customer Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Customer Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Enter customer name"
                        className="w-full border border-gray-300 rounded-md "
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Contact Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Contact Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="Enter contact email"
                        className="w-full border border-gray-300 rounded-md"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="phone"
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

                    {/* Address */}
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Description
                      </label>
                      <Input
                        id="description"
                        {...register('description')}
                        placeholder="Enter description"
                        className="w-full border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* City and State/Province */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          City
                        </label>
                        <Input
                          id="city"
                          {...register('city')}
                          placeholder="Enter city"
                          className="w-full border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          State/Province
                        </label>
                        <Input
                          id="state"
                          {...register('state')}
                          placeholder="Enter state/province"
                          className="w-full border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Address
                      </label>
                      <Input
                        id="address"
                        {...register('address')}
                        placeholder="Enter address"
                        className="w-full border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* Zip/Postal Code and Country */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="zip"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Zip/Postal Code
                        </label>
                        <Input
                          id="zip"
                          {...register('zip')}
                          placeholder="Enter zip/postal code"
                          className="w-full border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Country
                        </label>
                        <Input
                          id="country"
                          {...register('country')}
                          placeholder="Enter country"
                          className="w-full border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Customer Settings Card */}
                    <div className="pt-6 border-t border-gray-200">
                      {/* Allocated Limits */}
                      <div className="    border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                          Allocated Limits
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Devices
                            </label>
                            <Input
                              type="number"
                              min={0}
                              {...register('allocatedLimits.devices')}
                              className="w-full border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Dashboards
                            </label>
                            <Input
                              type="number"
                              min={0}
                              {...register('allocatedLimits.dashboards')}
                              className="w-full border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Assets
                            </label>
                            <Input
                              type="number"
                              min={0}
                              {...register('allocatedLimits.assets')}
                              className="w-full border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Floor Plans
                            </label>
                            <Input
                              type="number"
                              min={0}
                              {...register('allocatedLimits.floorPlans')}
                              className="w-full border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Automations
                            </label>
                            <Input
                              type="number"
                              min={0}
                              {...register('allocatedLimits.automations')}
                              className="w-full border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Users
                            </label>
                            <Input
                              type="number"
                              min={0}
                              {...register('allocatedLimits.users')}
                              className="w-full border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Required fields note */}
                    <p className="text-xs text-gray-500 mt-4">
                      <span className="text-red-500">*</span> Required fields
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Right Column - Actions and Help */}
            <div className="space-y-6">
              {/* Actions Card */}
              <Card className="shadow-lg rounded-xl border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Actions
                  </h2>
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      variant="ghost"
                      className="w-full justify-start bg-gray-100 hover:bg-gray-200 text-gray-700"
                      disabled={
                        isSubmitting ||
                        createCustomerMutation.isPending ||
                        updateCustomerMutation.isPending
                      }
                      isLoading={
                        createCustomerMutation.isPending ||
                        updateCustomerMutation.isPending
                      }
                    >
                      {isEditMode ? 'Save Changes' : 'Save and Add'}
                    </Button>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        className="flex-1"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Current Subscription Card */}
              <Card className="shadow-lg rounded-xl border-gray-200 overflow-hidden">
                <div className="  bg-secondary p-4 text-white ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">
                        Current Subscription
                      </h2>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                      {customer?.plan || 'Active'}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="space-y-5">
                    {/* Resource Items */}
                    {[
                      {
                        label: 'Users',
                        icon: Users,
                        usage: customer?.usageCounters?.users || 0,
                        limit: customer?.allocatedLimits?.users || 0,
                        color: 'bg-blue-500',
                      },
                      {
                        label: 'Devices',
                        icon: Cpu,
                        usage: customer?.usageCounters?.devices || 0,
                        limit: customer?.allocatedLimits?.devices || 0,
                        color: 'bg-indigo-500',
                      },
                      {
                        label: 'Assets',
                        icon: Box,
                        usage: customer?.usageCounters?.assets || 0,
                        limit: customer?.allocatedLimits?.assets || 0,
                        color: 'bg-purple-500',
                      },
                      {
                        label: 'Dashboards',
                        icon: Layout,
                        usage: customer?.usageCounters?.dashboards || 0,
                        limit: customer?.allocatedLimits?.dashboards || 0,
                        color: 'bg-pink-500',
                      },
                      {
                        label: 'Floor Plans',
                        icon: Map,
                        usage: customer?.usageCounters?.floorPlans || 0,
                        limit: customer?.allocatedLimits?.floorPlans || 0,
                        color: 'bg-orange-500',
                      },
                      {
                        label: 'Automations',
                        icon: Zap,
                        usage: customer?.usageCounters?.automations || 0,
                        limit: customer?.allocatedLimits?.automations || 0,
                        color: 'bg-yellow-500',
                      },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 font-medium text-gray-700">
                            <item.icon className="h-4 w-4 text-gray-400" />
                            {item.label}
                          </div>
                          <div className="text-xs font-semibold tabular-nums">
                            <span className="text-gray-900">{item.usage}</span>
                            <span className="text-gray-400 mx-1">/</span>
                            <span className="text-gray-500">{item.limit}</span>
                          </div>
                        </div>
                        <Progress
                          value={item.usage}
                          max={item.limit || 1}
                          className="h-1.5 bg-gray-100"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
