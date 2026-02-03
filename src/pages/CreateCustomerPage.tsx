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
import { Checkbox } from '@/components/ui/checkbox';
import { HelpCircle } from 'lucide-react';
import { useCreateCustomer } from '@/features/customer/hooks';
import type { CreateCustomerData } from '@/features/customer/types';
import { CustomerStatus, CustomerPlan } from '@/features/customer/types';

// Zod validation schema
const createCustomerSchema = z.object({
  name: z.string().min(1, 'Customer name is required').trim(),
  email: z
    .string()
    .email('Contact email must be valid')
    .min(1, 'Contact email is required'),
  phone: z.string().min(1, 'Phone number is required').trim(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string(),
  status: z.string(),
  maxUsers: z.string(),
  plan: z.string(),
  features: z.array(z.string()),
});

type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;

const availableFeatures = [
  { id: 'device-management', label: 'Device Management', enabled: true },
  { id: 'advanced-reports', label: 'Advanced Reports', enabled: true },
  { id: 'api-access', label: 'API Access', enabled: true },
  { id: 'data-analytics', label: 'Data Analytics', enabled: true },
  { id: 'user-management', label: 'User Management', enabled: false },
  { id: 'white-labeling', label: 'White Labeling', enabled: true },
];



const statusOptions = ['Active', 'Inactive', 'Suspended', 'Pending'];

const planOptions = ['Standard', 'Premium', 'Enterprise', 'Basic'];

export default function CreateCustomerPage() {
  const navigate = useNavigate();
  const createCustomerMutation = useCreateCustomer();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      status: 'Active',
      maxUsers: '50',
      plan: 'Standard',
      features: [
        'device-management',
        'advanced-reports',
        'api-access',
        'data-analytics',
        'white-labeling',
      ],
    },
    mode: 'onChange',
  });

  const selectedFeatures = watch('features') || [];

  const onSubmit = async (data: CreateCustomerFormData) => {
    // Transform form data to API format
    const customerData: CreateCustomerData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
      zip: data.zip || undefined,
      country: data.country,
      status: data.status as CustomerStatus,
      maxUsers: parseInt(data.maxUsers, 10),
      plan: data.plan as CustomerPlan,
      features: data.features,
    };

    createCustomerMutation.mutate(customerData);
  };

  const handleCancel = () => {
    navigate('/customer-management');
  };

  const handleFeatureToggle = (
    featureId: string,
    currentFeatures: string[],
    onChange: (value: string[]) => void
  ) => {
    if (currentFeatures.includes(featureId)) {
      onChange(currentFeatures.filter((id) => id !== featureId));
    } else {
      onChange([...currentFeatures, featureId]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50  ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Add New Customer
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
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Address
                      </label>
                      <Input
                        id="address"
                        {...register('address')}
                        placeholder="Enter street address"
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
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Customer Settings
                      </h2>
                      <div className="flex flex-col md:flex-row justify-between gap-2">
                        {/* Status */}
                        <div className="mb-4 w-full">
                          <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Status
                          </label>
                          <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger id="status" className="w-full">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        {/* Max Users */}
                        <div className="mb-4 w-full">
                          <label
                            htmlFor="maxUsers"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Max Users
                          </label>
                          <Input
                            id="maxUsers"
                            type="number"
                            {...register('maxUsers')}
                            placeholder="Enter max users"
                            className="w-full border border-gray-300 rounded-md"
                          />
                        </div>

                        {/* Plan */}
                        <div className="mb-4 w-full">
                          <label
                            htmlFor="plan"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Plan
                          </label>
                          <Controller
                            name="plan"
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger id="plan" className="w-full">
                                  <SelectValue placeholder="Select plan" />
                                </SelectTrigger>
                                <SelectContent>
                                  {planOptions.map((plan) => (
                                    <SelectItem key={plan} value={plan}>
                                      {plan}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                      {/* Features */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Features
                        </label>
                        <Controller
                          name="features"
                          control={control}
                          render={({ field }) => (
                            <div className="space-y-2 grid grid-cols-2 gap-2">
                              {availableFeatures.map(
                                (feature: {
                                  id: string;
                                  label: string;
                                  enabled: boolean;
                                }) => {
                                  const isChecked = selectedFeatures.includes(
                                    feature.id
                                  );
                                  return (
                                    <div
                                      key={feature.id}
                                      className="flex items-center gap-2"
                                    >
                                      <div
                                        className={`w-3 h-3 rounded-sm ${isChecked
                                          ? 'bg-green-500'
                                          : 'bg-gray-900'
                                          }`}
                                      />
                                      <Checkbox
                                        checked={isChecked}
                                        onChange={() =>
                                          handleFeatureToggle(
                                            feature.id,
                                            selectedFeatures,
                                            field.onChange
                                          )
                                        }
                                        label={feature.label}
                                      />
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        />
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
                      type="button"
                      variant="ghost"
                      className="w-full justify-start bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      Actions
                    </Button>
                    <Button
                      type="submit"
                      variant="ghost"
                      className="w-full justify-start bg-gray-100 hover:bg-gray-200 text-gray-700"
                      disabled={
                        isSubmitting || createCustomerMutation.isPending
                      }
                      isLoading={createCustomerMutation.isPending}
                    >
                      Save and Add User
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

              {/* Help Card */}
              <Card className="shadow-lg rounded-xl border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="h-5 w-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Help
                    </h2>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>Customer name is required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>Contact email must be valid</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>Features can be changed later</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>Max users can be adjusted</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
