import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Plus, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { edgeInstances } from '@/features/Edge-managment/data';
import { EdgeStats } from '@/features/Edge-managment/components/EdgeStats';
import { EdgeResourceUsage } from '@/features/Edge-managment/components/EdgeResourceUsage';
import { EdgeTable } from '@/features/Edge-managment/components/EdgeTable';
import { EdgeCreateDialog } from '@/features/Edge-managment/components/EdgeCreateDialog';

export default function EdgeManagement() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edge Management"
        description="Manage edge computing instances and monitor their status"
        actions={[
          {
            label: 'Add Edge Instance',
            onClick: () => setIsCreateOpen(true),
            icon: <Plus className="h-4 w-4 mr-2" />,
          },
        ]}
      />

      <EdgeStats edgeInstances={edgeInstances} />

      <EdgeResourceUsage edgeInstances={edgeInstances} />

      <EdgeTable edgeInstances={edgeInstances} />

      <EdgeCreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
