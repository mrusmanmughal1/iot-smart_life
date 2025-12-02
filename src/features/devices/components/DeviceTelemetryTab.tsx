import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { attributesApi } from '@/services/api';
import { EntityType, AttributeScope as ApiAttributeScope } from '@/services/api/attributes.api';

type AttributeScope = 'server' | 'client' | 'shared';

interface DeviceTelemetryTabProps {
  deviceId: string;
}

export const DeviceTelemetryTab: React.FC<DeviceTelemetryTabProps> = ({ deviceId }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedScopes, setSelectedScopes] = useState<AttributeScope[]>(['client', 'shared']);
  const [attributesPage, setAttributesPage] = useState(1);

  // Fetch device attributes
  const { data: attributesData, isLoading: attributesLoading, refetch: refetchAttributes } = useQuery({
    queryKey: ['device-attributes', deviceId, selectedScopes],
    queryFn: async () => {
      if (!deviceId) return null;
      // Fetch attributes for each scope using attributesApi
      const scopes = selectedScopes.length > 0 ? selectedScopes : ['server', 'client', 'shared'];
      const promises = scopes.map(scope => 
        attributesApi.getAttributes(EntityType.DEVICE, deviceId, scope.toUpperCase() as ApiAttributeScope)
          .catch(() => ({ data: { data: [] } }))
      );
      const results = await Promise.all(promises);
      return results;
    },
    enabled: !!deviceId,
  });

  // Transform attributes data for table
  const attributes = useMemo(() => {
    if (!attributesData || !Array.isArray(attributesData)) return [];
    
    const allAttributes: Array<{ key: string; value: string; lastUpdate: string; scope: string }> = [];
    
    attributesData.forEach((response, index) => {
      const scope = selectedScopes[index] || 'server';
      const attrs = response?.data?.data || [];
      
      // Handle array of attributes
      if (Array.isArray(attrs)) {
        attrs.forEach((attr: { key: string; value: string | number | boolean; lastUpdateTs?: number }) => {
          allAttributes.push({
            key: attr.key,
            value: String(attr.value),
            lastUpdate: attr.lastUpdateTs 
              ? new Date(attr.lastUpdateTs).toISOString()
              : new Date().toISOString(),
            scope,
          });
        });
      } else if (typeof attrs === 'object') {
        // Handle object format (key-value pairs)
        Object.entries(attrs).forEach(([key, value]) => {
          allAttributes.push({
            key,
            value: String(value),
            lastUpdate: new Date().toISOString(),
            scope,
          });
        });
      }
    });

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return allAttributes.filter(attr => 
        attr.key.toLowerCase().includes(query) || 
        attr.value.toLowerCase().includes(query)
      );
    }

    return allAttributes;
  }, [attributesData, searchQuery, selectedScopes]);

  const handleScopeToggle = (scope: AttributeScope) => {
    setSelectedScopes(prev => 
      prev.includes(scope) 
        ? prev.filter(s => s !== scope)
        : [...prev, scope]
    );
  };

  const handleEditAttribute = () => {
    // TODO: Implement edit attribute
    toast('Edit attribute functionality coming soon', { icon: 'ℹ️' });
  };

  const handleDeleteAttribute = async (key: string, scope: string) => {
    if (window.confirm(`Are you sure you want to delete attribute "${key}"?`)) {
      try {
        if (deviceId) {
          await attributesApi.deleteAttribute(EntityType.DEVICE, deviceId, key, scope.toUpperCase() as ApiAttributeScope);
          toast.success('Attribute deleted successfully');
          refetchAttributes();
        }
      } catch {
        toast.error('Failed to delete attribute');
      }
    }
  };

  const handleAddAttribute = () => {
    // TODO: Implement add attribute modal
    toast('Add attribute functionality coming soon', { icon: 'ℹ️' });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search attributes.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedScopes.includes('server') ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleScopeToggle('server')}
                className={selectedScopes.includes('server') ? 'bg-primary text-white' : ''}
              >
                Server
              </Button>
              <Button
                variant={selectedScopes.includes('client') ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleScopeToggle('client')}
                className={selectedScopes.includes('client') ? 'bg-primary text-white' : ''}
              >
                Client
              </Button>
              <Button
                variant={selectedScopes.includes('shared') ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleScopeToggle('shared')}
                className={selectedScopes.includes('shared') ? 'bg-primary text-white' : ''}
              >
                Shared
              </Button>
              <Button
                size="sm"
                onClick={handleAddAttribute}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Attribute
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attributes Table */}
      <Card>
        <CardContent className="p-0">
          {attributesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white">KEY</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white">VALUE</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white">LAST UPDATE</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                          No attributes found
                        </td>
                      </tr>
                    ) : (
                      attributes.map((attr, index) => (
                        <tr
                          key={`${attr.scope}-${attr.key}-${index}`}
                          className="border-b border-dotted border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">
                            {attr.key}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {attr.value}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {attr.lastUpdate ? format(new Date(attr.lastUpdate), 'yyyy-MM-dd HH:mm:ss') : '-'}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleEditAttribute}
                                className="h-8 px-3"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                EDIT
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAttribute(attr.key, attr.scope)}
                                className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                DELETE
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {attributes.length > 0 && (
                <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAttributesPage(1)}
                    disabled={attributesPage === 1}
                    className="h-8 w-8"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAttributesPage((p) => Math.max(1, p - 1))}
                    disabled={attributesPage === 1}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600 px-4">
                    Page {attributesPage}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAttributesPage((p) => p + 1)}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

