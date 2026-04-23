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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Automation } from './types';

interface AutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Automation>) => void;
  mode?: 'create' | 'edit';
  initialData?: Automation | null;
}

export const AutomationDialog: React.FC<AutomationDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  mode = 'create',
  initialData,
}) => {
  const { t } = useTranslation();
  const [selectedTriggerType, setSelectedTriggerType] = useState('threshold');

  useEffect(() => {
    if (initialData?.trigger?.type) {
      setSelectedTriggerType(initialData.trigger.type.toLowerCase());
    } else {
      setSelectedTriggerType('threshold');
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd collect all form data here
    onSubmit({}); 
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t('automation.dialog.createTitle') : t('automation.dialog.editTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('automation.dialog.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 py-2 p-6 max-h-[70vh] overflow-y-auto">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('automation.dialog.sections.basic')}</h3>
              <div className="space-y-2">
                <Label htmlFor="auto-name">{t('automation.dialog.fields.name')}</Label>
                <Input
                  id="auto-name"
                  placeholder={t('automation.dialog.fields.namePlaceholder')}
                  defaultValue={initialData?.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-description">{t('automation.dialog.fields.description')}</Label>
                <Textarea
                  id="auto-description"
                  placeholder={t('automation.dialog.fields.descriptionPlaceholder')}
                  defaultValue={initialData?.description}
                  rows={2}
                />
              </div>
            </div>

            {/* Trigger Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {t('automation.dialog.sections.trigger')}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="trigger-type">{t('automation.dialog.fields.triggerType')}</Label>
                <Select
                  value={selectedTriggerType}
                  onValueChange={setSelectedTriggerType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="threshold">{t('automation.dialog.options.triggerType.threshold')}</SelectItem>
                    <SelectItem value="state">{t('automation.dialog.options.triggerType.state')}</SelectItem>
                    <SelectItem value="schedule">{t('automation.dialog.options.triggerType.schedule')}</SelectItem>
                    <SelectItem value="event">{t('automation.dialog.options.triggerType.event')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedTriggerType === 'threshold' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="trigger-device">{t('automation.dialog.fields.device')}</Label>
                    <Select defaultValue={initialData?.trigger?.device}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temp-1">
                          Temperature Sensor #1
                        </SelectItem>
                        <SelectItem value="temp-2">
                          Temperature Sensor #2
                        </SelectItem>
                        <SelectItem value="humidity-1">
                          Humidity Sensor #1
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trigger-attribute">{t('automation.dialog.fields.attribute')}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="temperature">
                            Temperature
                          </SelectItem>
                          <SelectItem value="humidity">Humidity</SelectItem>
                          <SelectItem value="battery">Battery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trigger-operator">{t('automation.dialog.fields.operator')}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=">">{t('automation.dialog.options.operator.greater')}</SelectItem>
                          <SelectItem value="<">{t('automation.dialog.options.operator.less')}</SelectItem>
                          <SelectItem value="=">{t('automation.dialog.options.operator.equals')}</SelectItem>
                          <SelectItem value="!=">{t('automation.dialog.options.operator.notEquals')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trigger-value">{t('automation.dialog.fields.value')}</Label>
                      <Input
                        id="trigger-value"
                        type="number"
                        placeholder="25"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Configuration */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold flex items-center gap-2">
                {t('automation.dialog.sections.action')}
              </h3>

              <div className="space-y-2">
                <Label htmlFor="action-type">{t('automation.dialog.fields.actionType')}</Label>
                <Select defaultValue={initialData?.action?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="control">{t('automation.dialog.options.actionType.control')}</SelectItem>
                    <SelectItem value="set-value">
                      {t('automation.dialog.options.actionType.setValue')}
                    </SelectItem>
                    <SelectItem value="notification">
                      {t('automation.dialog.options.actionType.notification')}
                    </SelectItem>
                    <SelectItem value="webhook">{t('automation.dialog.options.actionType.webhook')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action-target">{t('automation.dialog.fields.targetDevice')}</Label>
                <Select defaultValue={initialData?.action?.target}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ac-1">AC Unit #1</SelectItem>
                    <SelectItem value="lights-1">
                      Smart Lights - Hallway
                    </SelectItem>
                    <SelectItem value="valve-1">Water Valve #1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action-command">{t('automation.dialog.fields.command')}</Label>
                <Select defaultValue={initialData?.action?.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose command" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">{t('automation.dialog.options.command.on')}</SelectItem>
                    <SelectItem value="off">{t('automation.dialog.options.command.off')}</SelectItem>
                    <SelectItem value="toggle">{t('automation.dialog.options.command.toggle')}</SelectItem>
                    <SelectItem value="custom">{t('automation.dialog.options.command.custom')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('automation.dialog.sections.options')}</h3>

              <div className="flex items-center justify-between p-3 rounded-lg">
                <div>
                  <Label htmlFor="enable">{t('automation.dialog.fields.enable')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('automation.dialog.fields.enableDesc')}
                  </p>
                </div>
                <Switch id="enable" defaultChecked={initialData?.enabled ?? true} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg">
                <div>
                  <Label htmlFor="log">{t('automation.dialog.fields.log')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('automation.dialog.fields.logDesc')}
                  </p>
                </div>
                <Switch id="log" defaultChecked />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-gray-200 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('automation.buttons.cancel')}
            </Button>
            <Button type="submit">
              {mode === 'create' ? t('automation.buttons.create') : t('automation.buttons.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
