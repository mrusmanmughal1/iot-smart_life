import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Automation } from './types';
import { Stepper } from '@/features/profiles/components/Stepper';
import { BasicInfoStep } from './components/BasicInfoStep';
import { TriggerStep } from './components/TriggerStep';
import { ActionStep } from './components/ActionStep';
import { ReviewStep } from './components/ReviewStep';
import { automationSchema } from './Schema';

interface AutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Automation>) => void;
  mode?: 'create' | 'edit';
  initialData?: Automation | null;
}

type AutomationFormValues = z.infer<typeof automationSchema>;

const STEPS = [
  { id: 1, title: 'Basic Information' },
  { id: 2, title: 'Device Trigger' },
  { id: 3, title: 'Device Actions' },
  { id: 4, title: 'Review' },
];

export const AutomationDialog: React.FC<AutomationDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  mode = 'create',
  initialData,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<AutomationFormValues>({
    resolver: zodResolver(automationSchema) as any,
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      enabled: true,
      status: 'active',
      trigger: {
        type: 'threshold',
        enableDebounce: false,
        activeHoursEnabled: false,
        activeDays: [1, 2, 3, 4, 5],
      },
      actions: [
        {
          id: '1',
          type: 'control',
          deviceId: '',
          command: 'Turn On',
          params: 'Temp=22',
          delay: 0,
          priority: 'high',
        },
      ],
      execution: {
        sequence: true,
        parallel: false,
        stopOnError: false,
        retryCount: 3,
      },
    },
  });

  const { reset, trigger, handleSubmit, watch } = methods;
  const formData = watch();

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData as any);
      } else {
        reset({
          name: '',
          description: '',
          enabled: true,
          status: 'active',
          trigger: { type: 'threshold' },
          actions: [
            {
              id: '1',
              type: 'control',
              deviceId: '',
              command: 'Turn On',
              params: 'Temp=22',
              delay: 0,
              priority: 'high',
            },
          ],
          execution: {
            sequence: true,
            parallel: false,
            stopOnError: false,
            retryCount: 3,
          },
        });
      }
      setCurrentStep(1);
    }
  }, [initialData, open, reset]);

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ['name', 'description'];
    if (currentStep === 2)
      fieldsToValidate = ['trigger.deviceId', 'trigger.telemetryKey'];
    if (currentStep === 3) fieldsToValidate = ['actions'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (currentStep < STEPS.length) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Final Step: Submit
        console.log('Final Step: Calling handleSubmit');
        handleSubmit(
          (data) => {
            console.log('Form data before transformation:', data);
            // Transform plural actions to singular action as requested
            const firstAction = data.actions?.[0] || {};

            // Map the specific structure the user wants
            const payload = {
              name: data.name,
              description:
                data.description ||
                `When ${data.trigger?.telemetryKey} ${data.trigger?.operator} ${data.trigger?.value}, ${firstAction.type}`,
              enabled: data.enabled ?? true,
              trigger: {
                type: 'state',
                deviceId: data.trigger?.deviceId,
                telemetryKey: data.trigger?.telemetryKey,
                operator: data.trigger?.operator || 'eq',
                value: 'short press',
                debounce: data.trigger?.debounce || 0,
              },
              action: {
                type: firstAction.type || 'control',
                deviceId: firstAction.deviceId,
                command: 'control_switch',
                // Default value for switch if not provided
                value: firstAction.value || { switches: { switch_3: 'off' } },
              },
              settings: {
                cooldown: data.settings?.cooldown || 60,
              },
            };

            console.log('Submitting Automation Payload:', payload);
            onSubmit(payload as any);
            onOpenChange(false);
          },
          (errors) => {
            console.error('Form Validation Errors:', errors);
            // Alert user of errors if they are hidden
            alert('Form validation failed. Please check your inputs.');
          }
        )();
      }
    } else {
      console.log('Step validation failed for:', fieldsToValidate);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <TriggerStep />;
      case 3:
        return <ActionStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-bold">
            {mode === 'create'
              ? t('automation.dialog.createTitle', 'Create New Automation Rule')
              : t('automation.dialog.editTitle', 'Edit Automation Rule')}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <div className="px-6 py-1">
            <Stepper
              steps={STEPS}
              currentStep={currentStep}
              completedSteps={Array.from(
                { length: currentStep - 1 },
                (_, i) => i + 1
              )}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-6">{renderStep()}</div>

          <div className="flex justify-between items-center border-gray-200 px-6 py-4 border-t mt-4">
            <Button
              variant="outline"
              onClick={() =>
                currentStep === 1 ? onOpenChange(false) : handleBack()
              }
              className="px-8"
            >
              {currentStep === 1
                ? t('automation.buttons.cancel', 'Cancel')
                : t('automation.buttons.back', 'Back')}
            </Button>
            <Button
              onClick={handleNext}
              className="px-8 bg-slate-900 hover:bg-slate-800 text-white"
            >
              {currentStep === STEPS.length
                ? mode === 'create'
                  ? t('automation.buttons.create', 'Create Rule')
                  : t('automation.buttons.save', 'Save Changes')
                : t('automation.buttons.next', 'Next')}
            </Button>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
