import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAccountSettings } from '../hooks';

export function AccountTab() {
  const { settings, isLoading } = useAccountSettings();

  const accountType = settings?.accountType || 'Premium Account';
  const storageUsed = settings?.storageUsed || 2.4;
  const storageTotal = settings?.storageTotal || 10;
  const storagePercentage = (storageUsed / storageTotal) * 100;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Account Type</Label>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="font-medium text-purple-900">{accountType}</p>
            <p className="text-sm text-purple-700">Full access to all features</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Storage Used</Label>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {storageUsed} GB of {storageTotal} GB used
              </span>
              <span>{Math.round(storagePercentage)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-red-600">Danger Zone</Label>
          <div className="p-4 border border-red-200 rounded-lg space-y-2">
            <p className="text-sm text-slate-600">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

