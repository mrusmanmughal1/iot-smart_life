import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import {
  Plus,
  Trash2,
  Shield,
  Zap,
  Mail,
  Globe,
  CheckCircle2,
  MailCheck,
  Pencil,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDevices } from '@/features/devices/hooks/useDevices';
import { cn } from '@/lib/util';

interface ActionStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const ActionStep: React.FC<ActionStepProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { data: devicesData } = useDevices({ limit: 100 });
  const devices = devicesData?.data?.data?.data || [];

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'actions',
  });
  const actionErrors = errors.actions as any;

  const execution = watch('execution');

  const addAction = () => {
    append({
      id: Math.random().toString(36).substr(2, 9),
      type: 'control',
      deviceId: '',
      command: 'Turn On',
      params: '',
      delay: 0,
      priority: 'medium',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">Configure Actions</h2>
        <Button
          type="button"
          onClick={addAction}
          variant="primary"
          className="  text-white rounded-lg flex items-center gap-2 px-4 py-2"
        >
          <Plus className="w-4 h-4" /> Add Action
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-md font-medium text-gray-800 flex items-center gap-2">
                  Action {index + 1}:{' '}
                  {watch(`actions.${index}.type`) === 'control'
                    ? 'Device Control'
                    : watch(`actions.${index}.type`) === 'notification'
                      ? 'Send Notification'
                      : 'HTTP Request'}
                </h3>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Action Type Selector */}
                <div className="flex  flex-col  gap-1">
                  <span className="text-sm font-medium text-gray-500 w-24">
                    Action Type:
                  </span>
                  <div className="flex bg-slate-100 p-2 rounded-md gap-1">
                    {[
                      { value: 'control', label: 'Device Control', icon: Zap },
                      {
                        value: 'notification',
                        label: 'Notification',
                        icon: Mail,
                      },
                      {
                        value: 'setValue',
                        label: 'Set Value',
                        icon: Pencil,
                      },
                      { value: 'webhook', label: 'Webhook', icon: Globe },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setValue(`actions.${index}.type`, type.value)
                        }
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all',
                          watch(`actions.${index}.type`) === type.value
                            ? 'bg-slate-800 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-200'
                        )}
                      >
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {watch(`actions.${index}.type`) === 'control' && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-500 w-24">
                            Target Device:
                          </span>
                          <Controller
                            name={`actions.${index}.deviceId`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                className="w-full"
                              >
                                <SelectTrigger
                                  className={cn(
                                    'w-full bg-slate-50 border-slate-200',
                                    actionErrors?.[index]?.deviceId &&
                                      'border-red-500'
                                  )}
                                >
                                  <SelectValue placeholder="Select Device" />
                                </SelectTrigger>
                                <SelectContent>
                                  {devices.map((d) => (
                                    <SelectItem key={d.id} value={d.id}>
                                      {d.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        {actionErrors?.[index]?.deviceId && (
                          <p className="text-[10px] text-red-500 ml-28">
                            Device is required
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">
                          Command:
                        </span>
                        <Controller
                          name={`actions.${index}.command`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              className="w-full"
                            >
                              <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Turn On" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Turn On">Turn On</SelectItem>
                                <SelectItem value="Turn Off">
                                  Turn Off
                                </SelectItem>
                                <SelectItem value="Set Value">
                                  Set Value
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">
                          Parameters:
                        </span>
                        <Input
                          className="w-[140px] bg-slate-50 border-slate-200"
                          placeholder="Temp=22"
                          {...register(`actions.${index}.params`)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 w-full">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 w-24">
                          Delay:
                        </span>
                        <div className="flex items-center">
                          <Input
                            type="number"
                            className="w-16 rounded-r-none bg-slate-50 border-slate-200"
                            {...register(`actions.${index}.delay`, {
                              valueAsNumber: true,
                            })}
                          />
                          <div className="px-3 py-2 bg-slate-100 text-slate-500 text-xs border border-l-0 border-slate-200 rounded-r-md">
                            Seconds
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">
                          Priority:
                        </span>
                        <Controller
                          name={`actions.${index}.priority`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              className="w-full"
                            >
                              <SelectTrigger className="w-[100px] bg-slate-50 border-slate-200">
                                <SelectValue placeholder="High" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {watch(`actions.${index}.type`) === 'notification' && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-24">
                        Message:
                      </span>
                      <Input
                        className="flex-1 bg-slate-50 border-slate-200"
                        placeholder="Temperature too high! AC turned on"
                        {...register(`actions.${index}.message`)}
                      />
                      <span className="text-sm font-medium text-gray-500 ml-4">
                        Recipients:
                      </span>
                      <Input
                        className="w-[200px] bg-slate-50 border-slate-200"
                        placeholder="admin@company.com"
                        {...register(`actions.${index}.recipients.0`)}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-24">
                        Channel:
                      </span>
                      <Controller
                        name={`actions.${index}.channel`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-[160px] bg-slate-50 border-slate-200">
                              <SelectValue placeholder="Email + SMS" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Email">Email</SelectItem>
                              <SelectItem value="SMS">SMS</SelectItem>
                              <SelectItem value="Email + SMS">
                                Email + SMS
                              </SelectItem>
                              <SelectItem value="Push Notification">
                                Push
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Quick Templates */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Quick Templates
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Climate Control', icon: Shield, active: true },
                { label: 'Security Alert', icon: Shield },
                { label: 'Energy Saving', icon: Zap },
                { label: 'Maintenance', icon: Settings },
              ].map((template) => (
                <button
                  key={template.label}
                  type="button"
                  className={cn(
                    'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all border',
                    template.active
                      ? 'bg-indigo-700 border-indigo-700 text-white shadow-lg shadow-indigo-100'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  )}
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center pt-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-8 py-2 font-medium"
            >
              Previous
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Execution Options */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Execution Options
            </h3>
            <div className="space-y-4">
              <div
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => {
                  setValue('execution.sequence', true);
                  setValue('execution.parallel', false);
                }}
              >
                <div
                  className={cn(
                    'w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-all',
                    execution.sequence
                      ? 'bg-slate-800 border-slate-800'
                      : 'border-slate-300'
                  )}
                >
                  {execution.sequence && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-sm font-medium text-slate-600">
                  Execute actions in sequence
                </span>
              </div>

              <div
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => {
                  setValue('execution.sequence', false);
                  setValue('execution.parallel', true);
                }}
              >
                <div
                  className={cn(
                    'w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-all',
                    execution.parallel
                      ? 'bg-slate-800 border-slate-800'
                      : 'border-slate-300'
                  )}
                >
                  {execution.parallel && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-sm font-medium text-slate-600">
                  Execute actions in parallel
                </span>
              </div>

              <div
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() =>
                  setValue('execution.stopOnError', !execution.stopOnError)
                }
              >
                <div
                  className={cn(
                    'w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-all',
                    execution.stopOnError
                      ? 'bg-slate-800 border-slate-800'
                      : 'border-slate-300'
                  )}
                >
                  {execution.stopOnError && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-sm font-medium text-slate-600">
                  Stop execution on first error
                </span>
              </div>

              <div
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() =>
                  setValue(
                    'execution.retryOnFailure',
                    !execution.retryOnFailure
                  )
                }
              >
                <div
                  className={cn(
                    'w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-all',
                    execution.retryOnFailure
                      ? 'bg-slate-800 border-slate-800'
                      : 'border-slate-300'
                  )}
                >
                  {execution.retryOnFailure && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-sm font-medium text-slate-600">
                  Retry failed actions (max 3 times)
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-[300px]">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Summary</h3>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3 text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                <span className="text-sm">
                  {fields.length} actions configured
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                <span className="text-sm">
                  {execution.sequence ? 'Sequential' : 'Parallel'} execution
                  enabled
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                <span className="text-sm">
                  Retry on failure: {execution.retryCount} attempts
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                Select a template to quickly add common action configurations
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-pink-100 border-pink-100 text-pink-600 hover:bg-pink-200 rounded-xl py-6 font-bold"
              >
                Save Draft
              </Button>
              <Button
                onClick={onNext}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 font-bold"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
