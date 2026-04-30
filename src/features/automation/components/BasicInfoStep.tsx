import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/util';

const templates = [
  { id: 'security', name: 'Security Alert', icon: 'Shield' },
  { id: 'lighting', name: 'Smart Lighting', icon: 'Lightbulb' },
  { id: 'water', name: 'Water Management', icon: 'Droplets' },
];

export const BasicInfoStep: React.FC = () => {
  const { t } = useTranslation();
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="border rounded-lg p-4 border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 ">
        {t('automation.dialog.sections.basicInfo', 'Basic Information')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 ">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rule-name">
              {t('automation.dialog.fields.name')}
            </Label>
            <Input
              id="rule-name"
              {...register('name')}
              className="border rounded-md"
              placeholder={t('automation.dialog.fields.namePlaceholder')}
              error={errors.name?.message as string}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {t('automation.dialog.fields.description')}
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              className="border rounded-md"
              placeholder={t('automation.dialog.fields.descriptionPlaceholder')}
              error={errors.description?.message as string}
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="status" className="font-medium">
                {t('automation.dialog.fields.status', 'Status')}
              </Label>
            </div>
            <Controller
              name="enabled"
              control={control}
              render={({ field }) => (
                <Switch
                  id="status"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="space-y-4 pt-2">
            <Label className="font-medium">
              {t(
                'automation.dialog.fields.notifications',
                'Notification Settings'
              )}{' '}
              <p className="text-xs text-muted-foreground">
                (
                {t(
                  'automation.dialog.fields.statusDesc',
                  'Enable rule after creation'
                )}
                )
              </p>
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Controller
                  name="settings.notifyEmail"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="notify-email"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="notify-email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(
                    'automation.dialog.options.notifyEmail',
                    'Send email notifications on rule execution'
                  )}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="settings.notifyPush"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="notify-push"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="notify-push"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(
                    'automation.dialog.options.notifyPush',
                    'Send push notifications to mobile devices'
                  )}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="settings.logHistory"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="log-history"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="log-history"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(
                    'automation.dialog.options.logHistory',
                    'Record execution history for debugging'
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                {t('automation.dialog.fields.category', 'Category')}
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="comfort">Comfort</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                {t('automation.dialog.fields.priority', 'Priority')}
              </Label>
              <Controller
                name="status" // Reusing status or mapping to a priority field if added
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('automation.dialog.fields.tags', 'Tags')}</Label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder={t(
                    'automation.dialog.fields.tagsPlaceholder',
                    'Add tags (comma separated)'
                  )}
                  className="border rounded-md"
                  value={field.value?.join(', ') || ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(',').map((s) => s.trim())
                    )
                  }
                />
              )}
            />
          </div>

          <div className="space-y-4 p-4 border rounded-lg border-gray-200">
            <h4 className="text-md font-medium">
              {t(
                'automation.dialog.sections.templates',
                'Quick Start Templates'
              )}
            </h4>
            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center text-sm p-4 border border-gray-200 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() =>
                    setValue('name', template.name, { shouldValidate: true })
                  }
                >
                  <span className="">{template.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
