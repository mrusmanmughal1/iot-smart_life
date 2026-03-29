import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import Roles from '@/features/users/components/Roles';
import Users from '@/features/users/components/Users';
import CustomerPage from '@/features/users/components/Customer';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebouncedValue } from '@/utils/helpers/Debounce';
import { useAppStore } from '@/stores/useAppStore';

export default function UsersAndRolesManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'Users');

  useEffect(() => {
    if (location.state?.tab) {
      console.log(location.state.tab);
      setActiveTab(location.state.tab);
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.tab]);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  const { user } = useAppStore();
  const isCustomer = user?.role === 'customer';

  const handleAddAction = () => {
    if (activeTab === 'Users') {
      navigate('/users-management/add-new-user');
      return;
    }
    if (activeTab === 'Customers') {
      navigate('/users-management/create-customer');
      return;
    }
    if (activeTab === 'Roles') {
      navigate('/users-management/create-role');
    }
  };

  const addButtonLabel =
    activeTab === 'Users'
      ? 'Add User'
      : activeTab === 'Customers'
        ? 'Add Customer'
        : 'Add Role';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto space-y-4">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1 dark:text-white">
                Users and Roles Management
              </h1>
              <p className="text-gray-600 text-sm dark:text-white">
                Manage users and their roles
              </p>
            </div>
            <Button onClick={handleAddAction} variant="secondary">
              <Plus className="h-4 w-4" />
              {addButtonLabel}
            </Button>
          </div>

          {/* Navigation Tabs and Search */}
          <div className="flex items-center  justify-between mt-6 gap-4">
            <Tabs
              defaultValue="Users"
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                setSearchQuery('');
              }}
            >
              <TabsList className="p-1">
                <TabsTrigger value="Users">Users</TabsTrigger>
                {!isCustomer && (
                  <TabsTrigger value="Customers">Customers</TabsTrigger>
                )}
                <TabsTrigger value="Roles">Roles</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                iconPosition="right"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {activeTab === 'Users' && <Users searchQuery={debouncedSearchQuery} />}
        {activeTab === 'Roles' && <Roles searchQuery={debouncedSearchQuery} />}
        {activeTab === 'Customers' && (
          <CustomerPage searchQuery={debouncedSearchQuery} />
        )}
      </div>
    </div>
  );
}
