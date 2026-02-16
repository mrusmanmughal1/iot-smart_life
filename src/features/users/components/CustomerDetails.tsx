import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { rolesApi } from '@/services/api';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

// Zod validation schema
const createRoleSchema = z.object({
    roleName: z.string().min(1, 'Role name is required').trim(),
    description: z.string().optional(),
    roleType: z.string().min(1, 'Role type is required'),
    baseRoleTemplate: z.string(),
    status: z.boolean(),
    permissions: z.array(z.string()),
});
type CreateRoleFormData = z.infer<typeof createRoleSchema>;

// Permission categories structure
interface PermissionCategory {
    category: string;
    permissions: {
        id: string;
        label: string;
    }[];
}

const permissionCategories: PermissionCategory[] = [
    {
        category: 'Device Management',
        permissions: [
            { id: 'read-devices', label: 'Read Devices' },
            { id: 'write-devices', label: 'Write Devices' },
        ],
    },
    {
        category: 'Data Management',
        permissions: [
            { id: 'read-telemetry', label: 'Read Telemetry' },
            { id: 'export-data', label: 'Export Data' },
        ],
    },
    {
        category: 'Report Management',
        permissions: [
            { id: 'view-reports', label: 'View Reports' },
            { id: 'generate-reports', label: 'Generate Reports' },
            { id: 'schedule-reports', label: 'Schedule Reports' },
            { id: 'manage-templates', label: 'Manage Templates' },
        ],
    },
    {
        category: 'Dashboard Management',
        permissions: [
            { id: 'view-dashboards', label: 'View Dashboards' },
            { id: 'create-dashboards', label: 'Create Dashboards' },
        ],
    },
    {
        category: 'User Management',
        permissions: [
            { id: 'view-users', label: 'View Users' },
            { id: 'create-users', label: 'Create Users' },
        ],
    },
    {
        category: 'System Configuration',
        permissions: [
            { id: 'system-configuration', label: 'System Configuration' },
        ],
    },
];

const roleTypeOptions = ['Custom Role', 'System Role', 'Tenant Role'];
const baseRoleTemplates = ['Customer User', 'Tenant Admin', 'System Admin'];

export default function CustomerDetails() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            roleName: '',
            description: '',
            roleType: 'Custom Role',
            baseRoleTemplate: 'Customer User',
            status: true,
            permissions: [
                'write-devices',
                'read-telemetry',
                'export-data',
                'view-reports',
                'generate-reports',
                'view-dashboards',
            ],
        },
        mode: 'onChange',
    });

    const selectedPermissions = watch('permissions') || [];

    // Get all permission IDs
    const allPermissionIds = useMemo(
        () =>
            permissionCategories.flatMap((cat) => cat.permissions.map((p) => p.id)),
        []
    );

    const handleSelectAll = () => {
        setValue('permissions', allPermissionIds);
    };

    const handleClearAll = () => {
        setValue('permissions', []);
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

    const onSubmit = async ( ) => {
        setIsSubmitting(true);
        
    };

    const handleCancel = () => {
        navigate('/users-management'); 
        // usman 
    };

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <Card className='mb-4'>
                    <CardHeader>
                        <CardTitle>
                            Customer : MUHAMMAD USMAN
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Email: mrusmsn@gmail.com</p>
                        <p>Phone: +923123456789</p>
                        <p>Address: 123 Main St, Anytown, USA</p>
                        <p>City: Anytown</p>
                        <p>State: CA</p>
                        <p>Zip: 12345</p>
                        <p>Country: USA</p>
                    </CardContent>
                </Card>

                {/* Two Column Layout */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Role Details */}
                        <Card className="shadow-lg rounded-xl border-gray-200">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Role Details
                                </h2>
                                <div className="space-y-4">
                                    {/* Role Name */}
                                    <div>
                                        <label
                                            htmlFor="roleName"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Role Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            id="roleName"
                                            {...register('roleName')}
                                            placeholder="Enter role name"
                                            className="w-full border border-gray-300 rounded-md"
                                        />
                                        {errors.roleName && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.roleName.message}
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

                                    {/* Role Type */}
                                    <div>
                                        <label
                                            htmlFor="roleType"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Role Type
                                        </label>
                                        <Controller
                                            name="roleType"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger
                                                        id="roleType"
                                                        className="w-full border border-gray-300 rounded-md"
                                                    >
                                                        <SelectValue placeholder="Select role type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {roleTypeOptions.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>

                                    {/* Base Role Template */}
                                    <div>
                                        <label
                                            htmlFor="baseRoleTemplate"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Base Role Template
                                        </label>
                                        <Controller
                                            name="baseRoleTemplate"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger
                                                        id="baseRoleTemplate"
                                                        className="w-full border border-gray-300 rounded-md bg-gray-50"
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {baseRoleTemplates.map((template) => (
                                                            <SelectItem key={template} value={template}>
                                                                {template}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
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
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Permissions
                                    </h2>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleSelectAll}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 h-8"
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={handleClearAll}
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-8"
                                        >
                                            Clear All
                                        </Button>
                                    </div>
                                </div>

                                <Controller
                                    name="permissions"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                            {permissionCategories.map((category) => (
                                                <div key={category.category} className="space-y-2">
                                                    <h3 className="text-sm font-semibold text-gray-800">
                                                        {category.category}:
                                                    </h3>
                                                    <div className="space-y-2 pl-2">
                                                        {category.permissions.map((permission) => {
                                                            const isChecked = selectedPermissions.includes(
                                                                permission.id
                                                            );
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
                                                                        label={permission.label}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
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
                            className="bg-gray-700 hover:bg-gray-800 text-white"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
