import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { Automation } from '../types';
import { cn } from '@/lib/util';

interface ReviewStepProps {
  formData: Partial<Automation>;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  const { t } = useTranslation();

  const getOperatorSymbol = (op?: string) => {
    switch (op) {
      case 'gt':
        return '>';
      case 'lt':
        return '<';
      case 'eq':
        return '==';
      case 'gte':
        return '>=';
      case 'lte':
        return '<=';
      default:
        return op || '>';
    }
  };

  return (
    <div className="p-4 rounded-xl border-gray-200 space-y-6 border  ">
      <h2 className="text-xl font-semibold text-gray-800">Review Confirm</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-none">
            <CardContent className="p-6 space-y-8">
              {/* Basic Information Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Rule Name:
                    </p>
                    <p className="text-sm text-gray-800">
                      {formData.name || 'Office Temperature Control'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Category:
                    </p>
                    <p className="text-sm text-gray-800">Climate Control</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Priority:
                    </p>
                    <p className="text-sm text-gray-800">Medium Status:</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-800">Active</span>
                      <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Trigger Configuration Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Trigger Configuration
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Trigger Type:
                    </p>
                    <p className="text-sm text-gray-800">Device Data</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Device:
                    </p>
                    <p className="text-sm text-gray-800">
                      Temperature Sensor 01 - Office
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Condition:
                    </p>
                    <p className="text-sm text-gray-800">
                      {formData.trigger?.telemetryKey || 'Temperature'}{' '}
                      {getOperatorSymbol(formData.trigger?.operator)}{' '}
                      {formData.trigger?.value ?? '25'}°C
                    </p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>

          {/* Actions Configuration Section */}
          <Card className="border-gray-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-medium text-gray-800">
                Actions Configuration
              </h3>

              <div className="space-y-4">
                {formData.actions?.map((action, idx) => (
                  <div key={action.id || idx} className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      Action {idx + 1}:
                    </p>
                    <p className="text-sm text-gray-800">
                      {action.type === 'control'
                        ? `Turn ON AC Controller - Office (temp=${action.params?.split('=')[1] || '22'})`
                        : action.type === 'notification'
                          ? `Send Notification - "${action.message || 'Temperature too high! AC turned on.'}"`
                          : `${action.type} configuration`}
                    </p>
                  </div>
                )) || (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">
                        Action 1:
                      </p>
                      <p className="text-sm text-gray-800">
                        Turn ON AC Controller - Office (temp=22)
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">
                        Action 2:
                      </p>
                      <p className="text-sm text-gray-800">
                        Send Notification - "Temperature too high! AC turned
                        on."
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  className="bg-[#5C4D9D] hover:bg-[#4C3D8D] text-white border-none px-6 rounded-md text-xs h-9"
                >
                  Back
                </Button>
                <Button className="bg-[#2D1616] hover:bg-[#1D0606] text-white px-6 rounded-md text-xs h-9">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-none min-h-[600px] flex flex-col">
            <CardContent className="p-6 space-y-8 flex-1">
              {/* Rule Logic Preview Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Rule Logic Preview
                </h3>

                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <div className="    bg-sky-50 border border-sky-200 rounded-lg  p-4 text-center">
                    <p className="text-[10px] font-medium text-gray-400 tracking-wider mb-1 uppercase">
                      Trigger
                    </p>
                    <p className="text-[11px] font-medium text-sky-800 truncate">
                      {formData.trigger?.telemetryKey || 'Temp'}{' '}
                      {getOperatorSymbol(formData.trigger?.operator)}{' '}
                      {formData.trigger?.value ?? '25'}°C
                    </p>
                  </div>

                  <div className="    bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-[10px] font-medium text-gray-400 tracking-wider mb-1 uppercase">
                      Action 1
                    </p>
                    <p className="text-[11px] font-medium text-green-800 truncate">
                      Temp {getOperatorSymbol(formData.trigger?.operator)} 25°C
                    </p>
                  </div>

                  <div className="    bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <p className="text-[10px] font-medium text-gray-400 tracking-wider mb-1 uppercase">
                      Action 1
                    </p>
                    <p className="text-[11px] font-medium text-amber-800 truncate">
                      Temp {getOperatorSymbol(formData.trigger?.operator)} 25°C
                    </p>
                  </div>
                </div>
              </section>

              {/* Execution Settings Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Execution Settings
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-[11px] text-gray-700 font-medium">
                    <Check className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                    <span>Execute Actions In Sequence</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-gray-700 font-medium">
                    <Check className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                    <span>Retry Failed Actions (Max 3 Times)</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-gray-700 font-medium">
                    <Check className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                    <span>Debounce Enabled (30 Seconds)</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-gray-700 font-medium">
                    <Check className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                    <span>Time Window: 08:00 - 18:00 (M-F</span>
                  </div>
                </div>
              </section>

              {/* Status Messages */}
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-gray-800 tracking-tight">
                      Rule Test Passed
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-600 leading-relaxed pl-6">
                    Trigger Condition Validated Successfully All Actions Can Be
                    Executed No Configuration Conflicts Detected
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <p className="text-sm font-medium text-gray-800 tracking-tight">
                      Important Notes
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-600 leading-relaxed pl-6">
                    Rule Will Be Active Immediately After Creation Ensure Target
                    Devices Are Online Before Activating
                  </p>
                </div>
              </div>
            </CardContent>

            <div className="p-6 flex justify-end items-end">
              <Button className="bg-[#2D1616] hover:bg-[#1D0606] text-white px-8 rounded-md text-xs font-bold py-5 h-auto">
                Create Rule
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
