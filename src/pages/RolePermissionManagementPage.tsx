import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/common/PageHeader';
import { toast } from 'react-hot-toast';
import { useRoleById } from '@/features/roles/hooks';
import type { Permission } from '@/services/api/users.api';
import { FileWarningIcon } from 'lucide-react';

type PermissionStatus = 'allowed' | 'denied' | 'conditional';

interface PermissionRow {
  id: string;
  permission: string;
  description: string;
  access: PermissionStatus;
  create: PermissionStatus;
  read: PermissionStatus;
  update: PermissionStatus;
  delete: PermissionStatus;
  category: string;
}

const normalizeCategory = (resource: string) =>
  resource
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

type RolePermission = Permission & {
  action?: string;
};

const toPermissionRows = (permissions: RolePermission[]): PermissionRow[] => {
  const grouped: Record<string, PermissionRow> = {};

  permissions.forEach((permission) => {
    const resource = permission.resource || 'other';
    const category = normalizeCategory(resource);
    const key = resource;

    if (!grouped[key]) {
      grouped[key] = {
        id: key,
        permission: category,
        description: permission.description || '',
        access: 'denied',
        create: 'denied',
        read: 'denied',
        update: 'denied',
        delete: 'denied',
        category,
      };
    }

    const action = permission.action;
    if (action === 'access') {
      grouped[key].access = 'allowed';
    } else if (action === 'create') {
      grouped[key].create = 'allowed';
    } else if (action === 'read' || action === 'list') {
      grouped[key].read = 'allowed';
    } else if (action === 'update') {
      grouped[key].update = 'allowed';
    } else if (action === 'delete') {
      grouped[key].delete = 'allowed';
    }

    if (!grouped[key].description && permission.description) {
      grouped[key].description = permission.description;
    }
  });

  return Object.values(grouped);
};

const isChecked = (status: PermissionStatus) => status === 'allowed';

export default function RolePermissionManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useRoleById(id);
  const [permissionCategory, setPermissionCategory] = useState('');
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const isSystemRole = data?.isSystem;
  const role = data as
    | { permissions?: RolePermission[]; name?: string }
    | undefined;
  const allPermissions = useMemo(() => role?.permissions ?? [], [role]);

  const permissionRows = useMemo(
    () => toPermissionRows(allPermissions),
    [allPermissions]
  );

  const categories = useMemo(
    () => Array.from(new Set(permissionRows.map((row) => row.category))),
    [permissionRows]
  );

  useEffect(() => {
    setPermissions(permissionRows);
    if (!permissionCategory && categories.length > 0) {
      setPermissionCategory(categories[0]);
    }
  }, [permissionRows, categories, permissionCategory]);

  const handleCategoryChange = (category: string) => {
    setPermissionCategory(category);
  };

  const handleCancel = () => {
    navigate('/users-management', { state: { tab: 'Roles' } });
  };

  const handleEdit = () => {
    navigate(`/users-management/edit-role/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto space-y-6">
        <PageHeader
          title="Role Permission Management"
          description={`Role: ${role?.name || ''}`}
        />

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Category Tabs */}
            <Tabs
              value={permissionCategory}
              onValueChange={handleCategoryChange}
              defaultValue={categories[0]}
            >
              <TabsList className="w-full justify-start rounded-none overflow-x-auto border-b border-gray-200  bg-transparent p-0 h-auto">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 py-2"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Permissions Table */}
            <div className=" shadow rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-white font-semibold">
                      PERMISSION
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      DESCRIPTION
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center">
                      ACCESS
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center">
                      CREATE
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center">
                      READ
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center">
                      UPDATE
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center">
                      DELETE
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions
                    .filter((permission) =>
                      permissionCategory
                        ? permission.category === permissionCategory
                        : true
                    )
                    .map((permission) => (
                      <TableRow
                        key={permission.id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {permission.permission}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {permission.description}
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            disabled={true}
                            checked={isChecked(permission.access)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            disabled={true}
                            checked={isChecked(permission.create)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            disabled={true}
                            checked={isChecked(permission.read)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            disabled={true}
                            checked={isChecked(permission.update)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            disabled={true}
                            checked={isChecked(permission.delete)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            {isSystemRole ? (
              <div className="text-center text-gray-600">
                {/* add warning icon */}
                <p className="flex w-full  items-center justify-center">
                  <FileWarningIcon className="h-4 w-4 mr-2 text-red-500 " />
                  You cannot edit System Roles
                </p>
              </div>
            ) : (
              <div className="flex items-start justify-between pt-4">
                {/* Legend */}

                {/* Action Buttons */}
                <div className="flex  justify-end w-full gap-3 items-end">
                  <div className="flex gap-3">
                    <Button onClick={handleEdit} variant="primary">
                      Edit Roles
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
