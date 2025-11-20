import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FolderTree, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAssets } from '@/features/assets/hooks';
import { AssetTreeView } from '@/features/assets/components';
import { useAssetStore } from '@/features/assets/stores';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/components/layout/AppLayout';

// Helper function to build tree structure from flat assets
function buildAssetTree(assets: any[]) {
  const assetMap = new Map();
  const rootNodes: any[] = [];

  // First pass: create map of all assets with children array
  assets.forEach(asset => {
    assetMap.set(asset.id.id, { ...asset, children: [] });
  });

  // Second pass: build the tree structure
  assets.forEach(asset => {
    const node = assetMap.get(asset.id.id);
    
    // If asset has a parent, add it to parent's children
    if (asset.parentId) {
      const parent = assetMap.get(asset.parentId.id);
      if (parent) {
        parent.children.push(node);
      } else {
        // Parent not found, treat as root
        rootNodes.push(node);
      }
    } else {
      // No parent, it's a root node
      rootNodes.push(node);
    }
  });

  return rootNodes;
}

export default function AssetsPage() {
  const { t } = useTranslation();
  const { data: assetsData, isLoading } = useAssets();
  const { expandedNodes, toggleNodeExpansion } = useAssetStore();
  const [selectedAsset, setSelectedAsset] = useState<string>();

  const assets = assetsData?.data?.data || [];
  
  // Transform flat assets into tree structure
  const assetTree = useMemo(() => buildAssetTree(assets), [assets]);

  return (
    <AppLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('assets.title')}</h1>
          <p className="text-slate-500 mt-2">Manage your asset hierarchy</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('assets.addAsset')}
        </Button>
      </div>

      <Tabs defaultValue="tree" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tree">
            <FolderTree className="h-4 w-4 mr-2" />
            Tree View
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tree">
          <Card>
            <CardHeader>
              <CardTitle>Asset Hierarchy</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <AssetTreeView
                  nodes={assetTree}
                  expandedNodes={expandedNodes}
                  selectedAsset={selectedAsset}
                  onToggleExpand={toggleNodeExpansion}
                  onSelectAsset={setSelectedAsset}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Assets</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {assets.map((asset: any) => (
                    <div
                      key={asset.id}
                      className="p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-sm text-slate-500">{asset.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </AppLayout>
  );
}