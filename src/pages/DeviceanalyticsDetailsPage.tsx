import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { cn } from '@/lib/util';

// Mock data for the charts
const generationTrendData = [
  { month: 'JAN', value1: 0, value2: 0, value3: 0 },
  { month: 'FEB', value1: 15, value2: 5, value3: 10 },
  { month: 'MAR', value1: 12, value2: 15, value3: 12 },
  { month: 'APR', value1: 22, value2: 18, value3: 20 },
  { month: 'MAY', value1: 15, value2: 25, value3: 15 },
  { month: 'JUN', value1: 28, value2: 32, value3: 20 },
  { month: 'JUL', value1: 35, value2: 25, value3: 25 },
  { month: 'AUG', value1: 18, value2: 15, value3: 18 },
  { month: 'SEP', value1: 15, value2: 32, value3: 20 },
  { month: 'OCT', value1: 28, value2: 20, value3: 25 },
  { month: 'NOV', value1: 20, value2: 18, value3: 15 },
  { month: 'DEC', value1: 20, value2: 22, value3: 25 },
];

const readingsGaugeData = [
  { name: 'Normal', value: 80, color: '#c026d3' },
  { name: 'Remaining', value: 20, color: '#f1f5f9' },
];

const alertHistory = [
  { message: 'High Temperature Alert - 28.5°C exceeded threshold', time: '2 hours ago', color: 'bg-blue-600' },
  { message: 'Medium Temperature Alert - 27.8°C approaching threshold', time: '2 hours ago', color: 'bg-pink-400' },
  { message: 'Connection Lost - Device went offline', time: '2 hours ago', color: 'bg-indigo-800' },
];

const deviceDetails = {
  id: 'SENS-001-TEMP',
  location: 'Building A, Floor 2',
  firmware: 'v2.1.3',
  battery: '85%',
  signalStrength: '-45 dBm (Good)',
};

export default function DeviceanalyticsDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const deviceName = id || 'Sensor-001';

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={t('analytics.deviceDetails.title', { name: deviceName })}
          description={t('analytics.deviceDetails.subtitle', { type: 'temperature sensor' })}
        />
        <Button variant="primary" className="bg-[#4338ca] hover:bg-[#3730a3]">
          Export Data
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-green-500 uppercase">{t('analytics.deviceDetails.stats.currentStatus')}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">ONLINE</p>
            <p className="text-xs text-gray-400 mt-1">{t('analytics.deviceDetails.stats.lastSeen', { time: '2 min ago' })}</p>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-pink-400 uppercase">{t('analytics.deviceDetails.stats.dataRate')}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">2.3 MB/day</p>
            <p className="text-xs text-gray-400 mt-1">↑ 15% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-orange-400 uppercase">{t('analytics.deviceDetails.stats.uptime')}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">99.8%</p>
            <p className="text-xs text-gray-400 mt-1">{t('analytics.deviceDetails.stats.last30Days')}</p>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-purple-600 uppercase">{t('analytics.deviceDetails.stats.activeAlerts')}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
            <p className="text-xs text-gray-400 mt-1">2 high, 1 medium</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {t('analytics.deviceDetails.charts.generationTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generationTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line type="monotone" dataKey="value1" stroke="#4338ca" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="value2" stroke="#c026d3" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="value3" stroke="#fca5a1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {t('analytics.deviceDetails.charts.readings', { type: 'Temperature' })}
            </CardTitle>
            <p className="text-xs text-gray-400">
              {t('analytics.deviceDetails.charts.max', { value: '28.1°C' })} | 
              {t('analytics.deviceDetails.charts.min', { value: '18.3°C' })} | 
              {t('analytics.deviceDetails.charts.avg', { value: '23.2°C' })}
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-4 flex flex-col items-center">
            <div className="h-[250px] w-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={readingsGaugeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={105}
                    startAngle={225}
                    endAngle={-45}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {readingsGaugeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-gray-800">80%</span>
                <span className="text-[10px] text-gray-400 font-medium text-center px-10">
                  {t('analytics.deviceDetails.charts.normalRange')}
                </span>
              </div>
            </div>
            
            <div className="mt-8 w-full space-y-3 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Max: 28.1°C</span>
              </div>
              <div className="flex justify-between">
                <span>Min: 18.3°C</span>
              </div>
              <div className="flex justify-between">
                <span>Avg: 23.2°C</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert History */}
        <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {t('analytics.deviceDetails.alertHistory.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6">
            {alertHistory.map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", alert.color)} />
                  <span className="text-sm font-medium text-gray-700">{alert.message}</span>
                </div>
                <span className="text-xs text-gray-400">{alert.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Device Information */}
        <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {t('analytics.deviceDetails.info.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{t('analytics.deviceDetails.info.deviceId')}:</span>
                <span className="font-medium text-gray-800 uppercase">{deviceDetails.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{t('analytics.deviceDetails.info.location')}:</span>
                <span className="font-medium text-gray-800">{deviceDetails.location}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{t('analytics.deviceDetails.info.firmware')}:</span>
                <span className="font-medium text-gray-800">{deviceDetails.firmware}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{t('analytics.deviceDetails.info.battery')}:</span>
                <span className="font-medium text-gray-800">{deviceDetails.battery}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{t('analytics.deviceDetails.info.signalStrength')}:</span>
                <span className="font-medium text-gray-800">{deviceDetails.signalStrength}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-8">
              <Button className="flex-1 bg-indigo-800 hover:bg-indigo-900 text-white rounded-md h-10 font-bold">
                {t('analytics.deviceDetails.actions.configure')}
              </Button>
              <Button className="flex-1 bg-pink-400 hover:bg-pink-500 text-white rounded-md h-10 font-bold">
                Export Data
              </Button>
              <Button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white rounded-md h-10 font-bold">
                {t('analytics.deviceDetails.actions.reset')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
