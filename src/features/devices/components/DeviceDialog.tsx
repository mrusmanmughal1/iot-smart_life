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
import { useManufacturers, useModels } from '../hooks/useDevices';
import type { DeviceFormData } from '../types/device.types';

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
    description: '',
    gatewayId: '',
    connectionType: '',
    manufacturer: '',
    model: '',
    ...initialData,
  });
  const [enableGatewayAssignment, setEnableGatewayAssignment] = useState(false);
  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      setFormData({
        name: initialData?.name || '',
        type: initialData?.type || '',
        description: initialData?.description || '',
        gatewayId: initialData?.gatewayId || '',
        connectionType: initialData?.connectionType || '',
        manufacturer: initialData?.manufacturer || '',
        model: initialData?.model || '',
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
      description: '',
      gatewayId: '',
      connectionType: '',
      manufacturer: '',
      model: '',
    });
    setEnableGatewayAssignment(false);
  };

  const isCreateMode = mode === 'create';

  const { data: manufacturersResponse, isLoading: isLoadingManufacturers } =
    useManufacturers();
  const { data: modelsResponse, isLoading: isLoadingModels } = useModels(
    formData.manufacturer || ''
  );

  const manufacturers = manufacturersResponse?.data || [];
  const models = modelsResponse?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-lg border-none  overflow-hidden shadow-none dark:bg-gray-950 dark:border-gray-700 ">
        <DialogHeader className="dark:text-white dark:bg-gray-950 dark:border-gray-700 dark:border-b">
          <DialogTitle>
            {isCreateMode ? t('devices.addDevice') : t('devices.editDevice')}
          </DialogTitle>
          <DialogDescription>
            {isCreateMode
              ? t('devices.form.addDescription')
              : t('devices.form.editDescription')}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] px-6 pb-6 overflow-y-auto"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="device-name">{t('devices.deviceName')} *</Label>
              <Input
                id="device-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={t('devices.form.namePlaceholder')}
                required
                className="border-2 rounded-md"
              />
            </div>
            <div>
              <Label htmlFor="device-type-select">
                {t('devices.deviceType')} *
              </Label>
              <Select
                value={formData.type?.toLowerCase() || undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue
                    className="placeholder:text-slate-100"
                    placeholder={t('devices.form.selectType')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sensor">{t('devices.form.types.sensor')}</SelectItem>
                  <SelectItem value="actuator">{t('devices.form.types.actuator')}</SelectItem>
                  <SelectItem value="gateway">{t('devices.form.types.gateway')}</SelectItem>
                  <SelectItem value="controller">{t('devices.form.types.controller')}</SelectItem>
                  <SelectItem value="camera">{t('devices.form.types.camera')}</SelectItem>
                  <SelectItem value="tracker">{t('devices.form.types.tracker')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="device-connection-select">
                {t('devices.connectionType')} *
              </Label>
              <Select
                value={formData.connectionType?.toLowerCase() || undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, connectionType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue
                    className="placeholder:text-slate-100"
                    placeholder={t('devices.form.selectConnectionType')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wifi">{t('devices.form.connections.wifi')}</SelectItem>
                  <SelectItem value="ethernet">{t('devices.form.connections.ethernet')}</SelectItem>
                  <SelectItem value="bluetooth">{t('devices.form.connections.bluetooth')}</SelectItem>
                  <SelectItem value="cellular">{t('devices.form.connections.cellular')}</SelectItem>
                  <SelectItem value="zigbee">{t('devices.form.connections.zigbee')}</SelectItem>
                  <SelectItem value="lora">{t('devices.form.connections.lora')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="device-manufacturer-select">
                {t('devices.manufacturer')}
              </Label>
              <Select
                value={formData.manufacturer || undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, manufacturer: value, model: '' })
                }
                disabled={isLoadingManufacturers}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingManufacturers
                        ? t('common.loading')
                        : t('devices.selectManufacturer')
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="device-model-select">
                {t('devices.modelNumber')}
              </Label>
              <Select
                value={formData.model || undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, model: value })
                }
                disabled={!formData.manufacturer || isLoadingModels}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingModels
                        ? t('common.loading')
                        : t('devices.selectModelNumber')
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="device-description">{t('devices.form.description')}</Label>
              <Textarea
                id="device-description"
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={t('devices.form.descriptionPlaceholder')}
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
                  {t('devices.form.gatewayAssignment')}
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
                  <SelectValue placeholder={t('devices.form.selectGatewayPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gateway-1">{t('devices.form.gateways.gateway1')}</SelectItem>
                  <SelectItem value="gateway-2">{t('devices.form.gateways.gateway2')}</SelectItem>
                  <SelectItem value="gateway-3">{t('devices.form.gateways.gateway3')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className=" pt-4">
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
