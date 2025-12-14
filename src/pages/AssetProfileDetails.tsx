import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {   ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
 
import { useAssetProfile } from '@/features/profiles/hooks';
import AssetsProfileDetailsTab from '@/features/profiles/components/AssetsProfileDetailsTab';

type TabType = 'details' | 'auditLogs';

export default function AssetProfileDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const { data: deviceData } = useAssetProfile(id || '');
  const device = deviceData?.data?.data;
  const deviceStatus =
    device?.status === 'online' || device?.status === 'idle'
      ? 'ACTIVE'
      : 'INACTIVE';

  const tabs: { id: TabType; label: string }[] = [
    { id: 'details', label: 'Details' },
    { id: 'auditLogs', label: 'Audit Logs' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/devices')}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {device?.name || 'Asset Profile Details'}
              </h1>
              <Badge
                variant={deviceStatus === 'ACTIVE' ? 'success' : 'secondary'}
                className="rounded-full px-3 py-1"
              >
                {deviceStatus}
              </Badge>
            </div>
            <p className="text-slate-500 mt-1 text-sm">
              Manage asset configuration templates and hierarchies.
            </p>
          </div>
        </div>
         
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Telemetry/Attributes Tab */}

      {/* Details/General Tab */}
      {activeTab === 'details' && id && <AssetsProfileDetailsTab deviceId={id} />}
    </div>
  );
}
