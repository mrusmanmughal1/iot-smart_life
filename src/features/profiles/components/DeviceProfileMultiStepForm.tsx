import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Stepper, type Step } from './Stepper';
import { Step1DeviceProfileDetails } from './steps/Step1DeviceProfileDetails';
import { Step2TransportConfiguration } from './steps/Step2TransportConfiguration';
import { Step3AlarmRules } from './steps/Step3AlarmRules';
import { Step4DeviceProvisioning } from './steps/Step4DeviceProvisioning';
import type { DeviceProfileMultiStepFormData } from '../types/device-profile-form.types';
import { DEFAULT_MULTI_STEP_FORM_DATA } from '../types/device-profile-form.types';
import { deviceProfileMultiStepFormSchema } from '../types/device-profile-form.schema';

interface DeviceProfileMultiStepFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DeviceProfileMultiStepFormData) => void;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Device profile details',
    description: 'Basic device profile information',
  },
  {
    id: 2,
    title: 'Transport configuration',
    description: 'Configure transport protocol',
    optional: true,
  },
  {
    id: 3,
    title: 'Alarm rules',
    description: 'Define alarm rules',
    optional: true,
  },
  {
    id: 4,
    title: 'Device provisioning',
    description: 'Configure provisioning settings',
    optional: true,
  },
];

export const DeviceProfileMultiStepForm: React.FC<
  DeviceProfileMultiStepFormProps
> = ({ open, onOpenChange, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const form = useForm<DeviceProfileMultiStepFormData>({
    resolver: zodResolver(deviceProfileMultiStepFormSchema),
    defaultValues: DEFAULT_MULTI_STEP_FORM_DATA,
    mode: 'onChange',
  });

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof DeviceProfileMultiStepFormData)[] = [];

    switch (currentStep) {
      case 1: {
        // Step 1 is required - validate all fields
        fieldsToValidate = ['name', 'description', 'type', 'defaultRuleChain', 'queue', 'defaultEdgeRuleChain'];
        break;
      }
      case 2: {
        // Step 2 is optional - only validate if transportConfig exists
        const transportConfig = form.getValues('transportConfig');
        if (transportConfig) {
          fieldsToValidate = ['transportConfig'];
        } else {
          // Optional step, allow proceeding
          return true;
        }
        break;
      }
      case 3: {
        // Step 3 is optional - validate alarm rules only if they exist and are complete
        try {
          const alarmRules = form.getValues('alarmRules');
          if (alarmRules && alarmRules.length > 0) {
            // Filter out incomplete alarm rules (empty name or condition)
            const completeAlarmRules = alarmRules.filter(
              (rule) => rule.name && rule.name.trim() !== '' && rule.condition && rule.condition.trim() !== ''
            );
            
            // If there are incomplete rules, remove them and update the form
            if (completeAlarmRules.length !== alarmRules.length) {
              form.setValue('alarmRules', completeAlarmRules.length > 0 ? completeAlarmRules : [], {
                shouldValidate: false,
                shouldDirty: false,
              });
            }
            
            // Only validate if there are complete alarm rules
            if (completeAlarmRules.length > 0) {
              fieldsToValidate = ['alarmRules'];
            } else {
              // All rules were incomplete and removed - optional step, allow proceeding
              return true;
            }
          } else {
            // No alarm rules or empty array - optional step, allow proceeding
            return true;
          }
        } catch (error) {
          // If there's any error, allow proceeding since step is optional
          console.error('Error validating alarm rules:', error);
          return true;
        }
        break;
      }
      case 4: {
        // Step 4 is optional - only validate if provisioningConfig exists
        const provisioningConfig = form.getValues('provisioningConfig');
        if (provisioningConfig) {
          fieldsToValidate = ['provisioningConfig'];
        } else {
          // Optional step, allow proceeding
          return true;
        }
        break;
      }
      default:
        return true;
    }

    // Trigger React Hook Form validation (which uses Zod via resolver)
    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async (e?: React.MouseEvent) => {
    // Prevent form submission
    e?.preventDefault();
    e?.stopPropagation();
    
    try {
      const isValid = await validateCurrentStep();
      if (isValid) {
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep]);
        }
        if (currentStep < STEPS.length) {
          setCurrentStep(currentStep + 1);
        }
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      // Even if validation fails, allow navigation for optional steps (2, 3, 4)
      if (currentStep >= 2 && currentStep <= 4) {
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep]);
        }
        if (currentStep < STEPS.length) {
          setCurrentStep(currentStep + 1);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      onSubmit(form.getValues());
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    form.reset(DEFAULT_MULTI_STEP_FORM_DATA);
    onOpenChange(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1DeviceProfileDetails form={form} />;
      case 2:
        return <Step2TransportConfiguration form={form} />;
      case 3:
        return <Step3AlarmRules form={form} />;
      case 4:
        return <Step4DeviceProvisioning form={form} />;
      default:
        return null;
    }
  };

  const updateAlarmRulesCount = () => {
    const alarmRules = form.watch('alarmRules') || [];
    return alarmRules.length;
  };

  const stepsWithCount = STEPS.map((step) => {
    if (step.id === 3) {
      return { ...step, count: updateAlarmRulesCount() };
    }
    return step;
  });

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        // Only close if explicitly set to false (not from internal state changes)
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] rounded-3xl  overflow-hidden ">
        <DialogHeader>
          <DialogTitle>Create Device Profile</DialogTitle>
          <DialogDescription>
            Follow the steps to create a new device profile
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 overflow-y-auto max-h-[80vh] ">
          <Stepper
            steps={stepsWithCount}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit(handleSubmit)(e);
              }}
              className="space-y-6"
            >
              <div className="min-h-[400px] shadow  border border-gray-200 rounded-lg  mt-4 p-4">{renderStepContent()}</div>

              <DialogFooter className="flex pb-4 justify-between">
                <div>
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                    >
                      Previous
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  {currentStep < STEPS.length ? (
                    <Button 
                      type="button" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNext(e);
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit">Create Profile</Button>
                  )}
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
