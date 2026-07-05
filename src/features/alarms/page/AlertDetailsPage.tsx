import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, Clock1, CheckCircle2 } from 'lucide-react';

export const AlertDetailsPage = () => {
  return (
    <div className="mx-auto max-w-[1260px]  ">
      <PageHeader title="Temperature Alert - Sensor-001" />
      <div className="mb-6 space-y-2 pt-2 text-sm text-slate-500">
        <p>
          Status: <Badge variant="default">Active</Badge>
        </p>
        <p>Severity: Warning · Created: 2024-05-22 14:30:25</p>
      </div>

      <div className="space-y-4">
        <Card className="overflow-hidden space-y-4">
          <div className="flex bg-white flex-col gap-4 border-b border-slate-200 bg-slate-50 px-6 py-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                  Active
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
                  <AlertTriangle className="h-4 w-4" />
                  Warning
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Alert generated for a temperature sensor that exceeded the safe
                threshold. Review the current values and take action.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button variant="secondary">Acknowledge</Button>
              <Button variant="success">Resolve</Button>
            </div>
          </div>

          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Alert Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Details for the selected alert and the asset involved.
                </p>
              </div>

              <div className="grid    ">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="space-y-5 text-sm text-slate-600">
                    <div className="grid  grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                      <span className="font-medium text-slate-800">Device</span>
                      <span className="  text-slate-500">
                        Sensor-001 (Temperature Sensor)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                      <span className="font-medium text-slate-800">Rule</span>
                      <span className="  text-slate-500">
                        Temperature &gt; 75°C
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                      <span className="font-medium text-slate-800">
                        Current Value
                      </span>
                      <span className="  text-rose-600 font-semibold">
                        78.5°C
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                      <span className="font-medium text-slate-800">
                        Description
                      </span>
                      <span className="  text-slate-500">
                        Temperature sensor reading exceeded safe threshold for
                        manufacturing equipment. Immediate attention required.
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <span className="font-medium text-slate-800">
                        Last Updated
                      </span>
                      <span className="  text-slate-500">
                        2024-05-22 14:32:10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>
              Recent changes and actions recorded for this alert.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <Clock1 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-slate-900">Alert generated</p>
                  <p className="text-sm text-slate-500">
                    2024-05-22 14:30:25 — Sensor reading triggered the rule.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
              No additional timeline entries are available yet.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlertDetailsPage;
