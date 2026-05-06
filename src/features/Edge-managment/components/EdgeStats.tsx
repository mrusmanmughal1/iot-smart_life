import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, CheckCircle2, Activity, Cpu } from 'lucide-react';
import { EdgeInstance } from '../types';

interface EdgeStatsProps {
  edgeInstances: EdgeInstance[];
}

export const EdgeStats: React.FC<EdgeStatsProps> = ({ edgeInstances }) => {
  const onlineCount = edgeInstances.filter((i) => i.status === 'online').length;
  const totalDevices = edgeInstances.reduce((sum, i) => sum + i.devices, 0);
  const avgCpu = edgeInstances.length > 0 
    ? Math.round(edgeInstances.reduce((sum, i) => sum + i.cpu, 0) / edgeInstances.length)
    : 0;

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{edgeInstances.length}</div>
          <p className="text-xs text-muted-foreground">Edge computing nodes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Online</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {onlineCount}
          </div>
          <p className="text-xs text-muted-foreground">Active instances</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDevices}</div>
          <p className="text-xs text-muted-foreground">Connected devices</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg CPU Usage</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgCpu}%</div>
          <p className="text-xs text-muted-foreground">
            Across all instances
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
