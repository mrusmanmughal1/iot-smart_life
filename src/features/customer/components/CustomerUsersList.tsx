import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Pagination } from '@/components/common/Pagination';
import { useCustomerUsers } from '@/features/customer/hooks';
import { UserStatus } from '@/services/api/users.api';

type CustomerUsersListProps = {
  customerId?: string;
  searchQuery?: string;
  title?: string;
};

const CustomerUsersList = ({
  customerId,
  searchQuery = '',
  title = 'Customer Users',
}: CustomerUsersListProps) => {
  const params = useParams<{ customerId?: string; id?: string }>();
  const resolvedCustomerId = customerId || params.customerId || params.id;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: usersData, isLoading } = useCustomerUsers(resolvedCustomerId, {
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
  });

  const users = useMemo(() => usersData?.data || [], [usersData]);
  const totalPages = usersData?.meta?.totalPages || 1;
  const totalItems = usersData?.meta?.total || users.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (!resolvedCustomerId) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6 text-sm text-gray-600 dark:text-white">
          Select a customer to view users.
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <Card className="bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-600 dark:text-white">
              No users available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-white font-semibold">
                      USER
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      EMAIL
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      ROLE
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      STATUS
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      CREATED
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-purple-100 text-purple-700">
                              {user.name?.[0]?.toUpperCase() ||
                                user.email?.[0]?.toUpperCase() ||
                                'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.name || '—'}
                            </p>
                            <p className="text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">
                        {user.role?.replace('_', ' ') || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === UserStatus.ACTIVE
                              ? 'success'
                              : 'secondary'
                          }
                          className="capitalize"
                        >
                          {user.status || 'unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerUsersList;
