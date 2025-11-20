import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/common/DataTable/DataTable';
import { createSortableColumn, createActionsColumn } from '@/components/common/DataTable/columns';
import {
  Share2,
  Plus,
  Search,
  Link as LinkIcon,
  Mail,
  Users,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  UserCheck,
  Shield,
} from 'lucide-react';

interface SharedItem {
  id: string;
  name: string;
  type: 'Dashboard' | 'Device' | 'Asset' | 'Report';
  sharedWith: string;
  accessLevel: 'View' | 'Edit' | 'Admin';
  sharedBy: string;
  sharedDate: Date;
  expiresAt?: Date;
  isPublic: boolean;
  views: number;
}

const sharedItems: SharedItem[] = [
  {
    id: '1',
    name: 'Factory Dashboard',
    type: 'Dashboard',
    sharedWith: 'john.doe@example.com',
    accessLevel: 'View',
    sharedBy: 'admin@company.com',
    sharedDate: new Date('2025-01-25'),
    expiresAt: new Date('2025-02-25'),
    isPublic: false,
    views: 45,
  },
  {
    id: '2',
    name: 'Temperature Sensor #123',
    type: 'Device',
    sharedWith: 'Public Link',
    accessLevel: 'View',
    sharedBy: 'admin@company.com',
    sharedDate: new Date('2025-01-20'),
    isPublic: true,
    views: 128,
  },
  {
    id: '3',
    name: 'Building A - Floor 3',
    type: 'Asset',
    sharedWith: 'team@company.com',
    accessLevel: 'Edit',
    sharedBy: 'manager@company.com',
    sharedDate: new Date('2025-01-15'),
    isPublic: false,
    views: 67,
  },
  {
    id: '4',
    name: 'Monthly Energy Report',
    type: 'Report',
    sharedWith: 'stakeholders@company.com',
    accessLevel: 'View',
    sharedBy: 'admin@company.com',
    sharedDate: new Date('2025-01-10'),
    expiresAt: new Date('2025-02-10'),
    isPublic: false,
    views: 89,
  },
];

export default function SharingCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareType, setShareType] = useState<'email' | 'link'>('email');
  const [activeTab, setActiveTab] = useState('shared-by-me');

  const columns = [
    createSortableColumn('name', 'Name'),
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }: any) => {
        const type = row.getValue('type') as string;
        const colors: Record<string, string> = {
          Dashboard: 'bg-blue-500',
          Device: 'bg-green-500',
          Asset: 'bg-purple-500',
          Report: 'bg-orange-500',
        };
        return (
          <Badge className={`${colors[type]} text-white`}>
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'sharedWith',
      header: 'Shared With',
      cell: ({ row }: any) => {
        const isPublic = row.original.isPublic;
        return (
          <div className="flex items-center gap-2">
            {isPublic ? (
              <>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <span>Public Link</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{row.getValue('sharedWith')}</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'accessLevel',
      header: 'Access',
      cell: ({ row }: any) => {
        const level = row.getValue('accessLevel') as string;
        const variant = level === 'Admin' ? 'default' : level === 'Edit' ? 'secondary' : 'outline';
        return <Badge variant={variant}>{level}</Badge>;
      },
    },
    {
      accessorKey: 'views',
      header: 'Views',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue('views')}</span>
        </div>
      ),
    },
    createSortableColumn('sharedDate', 'Shared Date'),
    {
      accessorKey: 'expiresAt',
      header: 'Expires',
      cell: ({ row }: any) => {
        const expires = row.getValue('expiresAt') as Date | undefined;
        if (!expires) return <span className="text-muted-foreground">Never</span>;
        return <span>{expires.toLocaleDateString()}</span>;
      },
    },
    createActionsColumn((row: any) => [
      {
        label: 'Copy Link',
        onClick: () => console.log('Copy link', row.id),
        icon: <Copy className="h-4 w-4" />,
      },
      {
        label: 'View',
        onClick: () => console.log('View', row.id),
        icon: <ExternalLink className="h-4 w-4" />,
      },
      {
        label: 'Revoke Access',
        onClick: () => console.log('Revoke', row.id),
        icon: <Trash2 className="h-4 w-4" />,
        variant: 'destructive' as const,
      },
    ]),
  ];

  const filteredItems = sharedItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sharing Center"
        description="Manage shared dashboards, devices, and reports"
        actions={[
          {
            label: 'Share Resource',
            onClick: () => setIsShareOpen(true),
            icon: <Plus className="h-4 w-4 mr-2" />,
          },
        ]}
      />

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedItems.length}</div>
            <p className="text-xs text-muted-foreground">Active shared items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sharedItems.filter(i => i.isPublic).length}
            </div>
            <p className="text-xs text-muted-foreground">Publicly accessible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sharedItems.reduce((sum, i) => sum + i.views, 0)}
            </div>
            <p className="text-xs text-muted-foreground">All time views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">With access</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shared items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue='' value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="shared-by-me">Shared by Me</TabsTrigger>
          <TabsTrigger value="shared-with-me">Shared with Me</TabsTrigger>
          <TabsTrigger value="public">Public Links</TabsTrigger>
        </TabsList>

        <TabsContent value="shared-by-me" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Items Shared by You</CardTitle>
              <CardDescription>Dashboards, devices, and reports you've shared</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredItems}
                searchKey="name"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared-with-me" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Items Shared with You</CardTitle>
              <CardDescription>Resources others have shared with you</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredItems.filter(i => !i.isPublic)}
                searchKey="name"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Public Links</CardTitle>
              <CardDescription>Publicly accessible shared resources</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredItems.filter(i => i.isPublic)}
                searchKey="name"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Resource</DialogTitle>
            <DialogDescription>
              Share dashboards, devices, or reports with team members or create public links
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Share Type Toggle */}
            <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
              <Button
                variant={shareType === 'email' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setShareType('email')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Share via Email
              </Button>
              <Button
                variant={shareType === 'link' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setShareType('link')}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Create Public Link
              </Button>
            </div>

            {/* Resource Selection */}
            <div className="space-y-2">
              <Label htmlFor="resource">Select Resource *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose what to share" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard-1">Factory Dashboard</SelectItem>
                  <SelectItem value="device-1">Temperature Sensor #123</SelectItem>
                  <SelectItem value="asset-1">Building A - Floor 3</SelectItem>
                  <SelectItem value="report-1">Monthly Energy Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {shareType === 'email' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Addresses *</Label>
                  <Input
                    id="email"
                    placeholder="user@example.com (comma separated for multiple)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access">Access Level *</Label>
                  <Select defaultValue="view">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View Only</SelectItem>
                      <SelectItem value="edit">Can Edit</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Public Link</Label>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <Input
                    readOnly
                    value="https://iot.platform.com/share/abc123xyz"
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Anyone with link can view</span>
                  </div>
                  <Select defaultValue="view">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Expiration */}
            <div className="space-y-2">
              <Label htmlFor="expiry">Link Expiration (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Never expires" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a message for the recipient..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareOpen(false)}>
              Cancel
            </Button>
            <Button>
              <Share2 className="h-4 w-4 mr-2" />
              {shareType === 'email' ? 'Send Invitation' : 'Create Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}