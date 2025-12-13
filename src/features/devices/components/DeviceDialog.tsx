import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DeviceFormData } from '../types';

export interface DeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<DeviceFormData>;
  onSubmit: (data: DeviceFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export const DeviceDialog: React.FC<DeviceDialogProps> = ({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    type: '',
    label: '',
    description: '',
    gatewayId: '',
    connectionType: '',
    ...initialData,
  });
  const [enableGatewayAssignment, setEnableGatewayAssignment] = useState(false);

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      setFormData({
        name: initialData?.name || '',
        type: initialData?.type || '',
        label: initialData?.label || '',
        description: initialData?.description || '',
        deviceProfileId: initialData?.deviceProfileId,
        gatewayId: initialData?.gatewayId || '',
      });
      setEnableGatewayAssignment(!!initialData?.gatewayId);
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({
      name: '',
      type: '',
      label: '',
      description: '',
      gatewayId: '',
      connectionType: '',
    });
    setEnableGatewayAssignment(false);
  };

  const isCreateMode = mode === 'create';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-lg border-none  overflow-hidden shadow-none">
        <DialogHeader>
          <DialogTitle>
            {isCreateMode ? t('devices.addDevice') : t('devices.editDevice')}
          </DialogTitle>
          <DialogDescription>
            {isCreateMode
              ? 'Add a new device to your IoT platform'
              : 'Update device information'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="max-h-[90vh] p-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <Label htmlFor="device-name">{t('devices.deviceName')} *</Label>
              <Input
                id="device-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter device name"
                required
              />
            </div>
            <div>
              <Label htmlFor="device-type">{t('devices.deviceType')} *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue className="placeholder:text-slate-100" placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sensor">Sensor</SelectItem>
                  <SelectItem value="actuator">Actuator</SelectItem>
                  <SelectItem value="gateway">Gateway</SelectItem>
                  <SelectItem value="controller">Controller</SelectItem>
                  <SelectItem value="camera">Camera</SelectItem>
                  <SelectItem value="tracker">tracker</SelectItem>

                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="device-type">{t('devices.connectionType')} *</Label>
              <Select
                value={formData.connectionType}
                onValueChange={(value) =>
                  setFormData({ ...formData, connectionType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue className="placeholder:text-slate-100" placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wifi">Wifi</SelectItem>
                  <SelectItem value="ethenet">Ethenet</SelectItem>
                  <SelectItem value="bluetooth">Bluetooth</SelectItem>
                  <SelectItem value="cellular">Cellular</SelectItem>
                  <SelectItem value="zigbee">Zigbee</SelectItem>
                  <SelectItem value="zwave">Zwave</SelectItem>
                  <SelectItem value="lora">Lora</SelectItem>

                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="device-label">Device Label</Label>
              <Input
                id="device-label"
                value={formData.label || ''}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="Optional label"
              />
            </div>
            <div>
              <Label htmlFor="device-description">Description</Label>
              <Textarea
                id="device-description"
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Device description (optional)"
                rows={4}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  id="gateway-assignment"
                  checked={enableGatewayAssignment}
                  onChange={(e) => {
                    setEnableGatewayAssignment(e.target.checked);
                    if (!e.target.checked) {
                      setFormData({ ...formData, gatewayId: '' });
                    }
                  }}
                />
                <Label htmlFor="gateway-assignment" className="cursor-pointer">
                  Gateway Assignment
                </Label>
              </div>
              <Select
                value={formData.gatewayId || ''}
                onValueChange={(value) =>
                  setFormData({ ...formData, gatewayId: value })
                }
              >
                <SelectTrigger
                  className={
                    !enableGatewayAssignment
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : ''
                  }
                  disabled={!enableGatewayAssignment}
                >
                  <SelectValue placeholder="Select gateway (disabled)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gateway-1">Gateway 1</SelectItem>
                  <SelectItem value="gateway-2">Gateway 2</SelectItem>
                  <SelectItem value="gateway-3">Gateway 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} isLoading={isLoading}>
              {isCreateMode ? t('common.create') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
