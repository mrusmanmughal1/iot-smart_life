import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function IntegrationCentreDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Integration Centre Dashboard" />

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Integrations */}
        <Card className=" bg-primary text-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium  mb-2">Active Integrations</p>
            <p className="text-3xl font-semibold ">12</p>
            <div className="mt-3 text-xs  ">2 new this week</div>
          </CardContent>
        </Card>

        {/* Data Converters */}
        <Card className="bg-secondary text-white ">
          <CardContent className="p-6">
            <p className="text-sm font-medium  mb-2">Data Converters</p>
            <p className="text-3xl font-semibold ">8</p>
            <div className="mt-3 text-xs  ">1 updated today</div>
          </CardContent>
        </Card>

        {/* Messages Today */}
        <Card className=" bg-success text-white ">
          <CardContent className="p-6">
            <p className="text-sm font-medium  mb-2">Messages Today</p>
            <p className="text-3xl font-semibold ">1.2K</p>
            <div className="mt-3 text-xs  ">↑ 15% from yesterday</div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="    ">
          <CardContent className="p-6">
            <p className="text-sm font-medium  mb-2">System Health</p>
            <p className="text-3xl font-semibold ">Healthy</p>
            <div className="mt-3 text-xs text-slate-500">
              All systems operational
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border border-slate-200 shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-600">
                HTTP Integration "Weather API" - Status: Active
              </span>
              <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                2 min ago
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-600">
                MQTT Integration "Sensor Data" - 450 messages processed
              </span>
              <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                2 min ago
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-600">
                Data Converter "JSON Parser" - Updated configuration
              </span>
              <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                2 min ago
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-600">
                CoAP Integration "IoT Devices" - Connection timeout
              </span>
              <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                2 min ago
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section: Quick Actions & System Status */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border border-slate-200 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button
                variant="outline"
                className="w-full text-slate-600 border-slate-200 justify-center font-normal"
              >
                + Add Integration
              </Button>
              <Button
                variant="outline"
                className="w-full text-slate-600 border-slate-200 justify-center font-normal"
              >
                + Add Converter
              </Button>
              <Button
                variant="outline"
                className="w-full text-slate-600 border-green-100 justify-center font-normal"
              >
                Import Template
              </Button>
              <Button
                variant="outline"
                className="w-full text-slate-600 border-pink-100 justify-center font-normal"
              >
                System Logs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border border-slate-200 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Integration Service:</span>
                <span className="text-green-600 font-medium">Online</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Message Queue:</span>
                <span className="text-green-600 font-medium">Healthy</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Database:</span>
                <span className="text-orange-500 font-medium">High Load</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">External APIs:</span>
                <span className="text-green-600 font-medium">Responding</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
