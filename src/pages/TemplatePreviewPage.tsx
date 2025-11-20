import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import AppLayout from '@/components/layout/AppLayout';

// Sample data for charts
const trafficFlowData = [
  { time: '00:00', value: 45 },
  { time: '04:00', value: 30 },
  { time: '08:00', value: 85 },
  { time: '12:00', value: 110 },
  { time: '16:00', value: 95 },
  { time: '20:00', value: 70 },
  { time: '24:00', value: 50 },
];

const energyConsumptionData = [
  { label: '0.0%', value: 45 },
  { label: '0.1%', value: 52 },
  { label: '0.2%', value: 48 },
  { label: '0.3%', value: 55 },
  { label: '0.4%', value: 50 },
  { label: '0.5%', value: 85 },
];

const COLORS = {
  primary: '#44489D',
  secondary: '#C36BA9',
  gray: '#E5E7EB',
};

export default function TemplatePreviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const wasteCollectionData = [
    { name: t('solutionTemplates.templatePreview.chartLabels.collected'), value: 68 },
    { name: t('solutionTemplates.templatePreview.chartLabels.remaining'), value: 32 },
  ];

  const roadTrafficData = [
    { name: t('solutionTemplates.templatePreview.chartLabels.active'), value: 78 },
    { name: t('solutionTemplates.templatePreview.chartLabels.free'), value: 22 },
  ];

  const handleCancel = () => {
    navigate('/solution-templates');
  };

  const handleActivate = () => {
    // TODO: Add activation logic
    console.log('Activating template:', id);
    navigate('/solution-templates');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            {t('solutionTemplates.templatePreview.title')}
          </h1>
        </div>

        {/* Main Dashboard Card */}
        <Card className="shadow-lg rounded-xl p-6 border-secondary/60">
          <div className=" bg-muted py-4 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                {t('solutionTemplates.templatePreview.dashboardTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {/* Row 1 - Traffic Flow */}
                <Card className="  border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-900">
                      {t('solutionTemplates.templatePreview.trafficFlow')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={trafficFlowData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="time"
                          stroke="#9CA3AF"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#9CA3AF"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 125]}
                          ticks={[0, 25, 50, 75, 100, 125]}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={COLORS.primary}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Row 1 - Energy Consumption */}
                <Card className="  border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-900">
                      {t('solutionTemplates.templatePreview.energyConsumption')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={energyConsumptionData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#E5E7EB"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="label"
                          stroke="#9CA3AF"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#9CA3AF"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          hide
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {energyConsumptionData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === energyConsumptionData.length - 1
                                  ? COLORS.primary
                                  : COLORS.gray
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Row 1 - Waste Collection */}
                <Card className="  border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-900">
                      {t('solutionTemplates.templatePreview.wasteCollection')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative flex items-center justify-center h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={wasteCollectionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                          >
                            {wasteCollectionData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  index === 0 ? COLORS.secondary : COLORS.gray
                                }
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <span className="absolute text-2xl font-semibold text-gray-900">
                        68%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Row 2 - City Map (spans 2 columns) */}
                <Card className="  border border-gray-200 md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-900">
                      {t('solutionTemplates.templatePreview.cityMap')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {/* Placeholder for city map - you can replace with actual map component */}
                      <div className="text-center text-gray-500">
                        <svg
                          className="w-full h-full"
                          viewBox="0 0 400 300"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Simplified city map representation */}
                          <rect width="400" height="300" fill="#F3F4F6" />
                          {/* Streets */}
                          <line
                            x1="0"
                            y1="100"
                            x2="400"
                            y2="100"
                            stroke="#9CA3AF"
                            strokeWidth="2"
                          />
                          <line
                            x1="0"
                            y1="200"
                            x2="400"
                            y2="200"
                            stroke="#9CA3AF"
                            strokeWidth="2"
                          />
                          <line
                            x1="100"
                            y1="0"
                            x2="100"
                            y2="300"
                            stroke="#9CA3AF"
                            strokeWidth="2"
                          />
                          <line
                            x1="200"
                            y1="0"
                            x2="200"
                            y2="300"
                            stroke="#9CA3AF"
                            strokeWidth="2"
                          />
                          <line
                            x1="300"
                            y1="0"
                            x2="300"
                            y2="300"
                            stroke="#9CA3AF"
                            strokeWidth="2"
                          />
                          {/* Buildings */}
                          <rect
                            x="20"
                            y="20"
                            width="60"
                            height="60"
                            fill="#D1D5DB"
                          />
                          <rect
                            x="120"
                            y="120"
                            width="60"
                            height="60"
                            fill="#D1D5DB"
                          />
                          <rect
                            x="220"
                            y="20"
                            width="60"
                            height="60"
                            fill="#D1D5DB"
                          />
                          <rect
                            x="320"
                            y="120"
                            width="60"
                            height="60"
                            fill="#D1D5DB"
                          />
                          <rect
                            x="20"
                            y="220"
                            width="60"
                            height="60"
                            fill="#D1D5DB"
                          />
                          <rect
                            x="220"
                            y="220"
                            width="60"
                            height="60"
                            fill="#D1D5DB"
                          />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Row 2 - Road Traffic Status */}
                <Card className="  border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-900">
                      {t('solutionTemplates.templatePreview.roadTrafficStatus')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative flex items-center justify-center h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={roadTrafficData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                          >
                            {roadTrafficData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  index === 0 ? COLORS.primary : COLORS.gray
                                }
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <span className="absolute text-2xl font-semibold text-gray-900">
                        78%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-8 pt-6  ">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  className="px-6 bg-gray-200 hover:bg-gray-300  rounded-md text-gray-700"
                >
                  {t('solutionTemplates.templatePreview.cancel')}
                </Button>
                <Button
                  type="button"
                  onClick={handleActivate}
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-6"
                >
                  {t('solutionTemplates.templatePreview.activateTemplate')}
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
