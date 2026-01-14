import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Sprout,
  Building,
  Car,
  Home,
  Factory,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

// Chart Data
const activeSolutionsData = [
  { name: 'Jan', value: 2 },
  { name: 'Feb', value: 3 },
  { name: 'Mar', value: 2 },
  { name: 'Apr', value: 4 },
  { name: 'May', value: 3 },
];

const COLORS = ['#C36BA9', '#E5E7EB', '#1FB3E1'];

export const DashboardPage = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('smartCity');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initial check
    checkScrollPosition();

    // Listen to scroll events
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  // Solution Categories with localization
  const solutions = [
    { key: 'smartCity', icon: Building2, active: true },
    { key: 'smartAgriculture', icon: Sprout, active: false },
    { key: 'smartBuilding', icon: Building, active: false },
    { key: 'smartTransportation', icon: Car, active: false },
    { key: 'smartHome', icon: Home, active: false },
    { key: 'smartFactory', icon: Factory, active: false },
  ];

  // Donut chart data for Connected Devices
  const deviceUsageData = [
    { name: t('dashboard.deviceUsage.used'), value: 20 },
    { name: t('dashboard.deviceUsage.remaining'), value: 80 },
  ];

  // User avatars data
  const userAvatars = ['S', 'A', 'P'];

  // Pending tasks
  const pendingTasks = [
    {
      task: t('dashboard.tasks.addGateway'),
      priority: t('dashboard.priorities.high'),
      color: 'bg-green-500',
    },
    {
      task: t('dashboard.tasks.configureAlert'),
      priority: t('dashboard.priorities.medium'),
      color: 'bg-orange-500',
    },
  ];

  // Dashboard preview data
  const dashboardPreviews = [
    {
      title: t('dashboard.dashboardPreview'),
      subtitle: t('dashboard.dashboardSubtitles.smartBuildingOverview'),
      gradient: 'from-secondary to-secondary',
      textColor: 'text-white',
    },
    {
      title: t('dashboard.dashboardPreview'),
      subtitle: t('dashboard.dashboardSubtitles.smartBuildingMetrics'),
      gradient: 'from-gray-100 to-gray-300',
      textColor: 'text-gray-900',
    },
    {
      title: t('dashboard.dashboardPreview'),
      subtitle: t('dashboard.dashboardSubtitles.smartHomeControl'),
      gradient: 'from-secondary-main to-secondary-main',
      textColor: 'text-white',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold dark:text-white text-slate-900">
              {t('dashboard.overview')}
            </h1>
          </div>
          <Settings className="h-6 w-6" />
        </div>
        <div className="border p-4 rounded-lg  border-secondary shadow-xl">
          {/* Solution Category Selection Bar */}
          <div className="relative">
            <div className="flex items-center gap-4 pb-4">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`hidden sm:flex absolute left-0 z-10 p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-all ${
                  canScrollLeft
                    ? 'opacity-100 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <ChevronLeft
                  size={26}
                  className="text-gray-700 dark:text-white"
                />
              </button>

              <div
                ref={scrollContainerRef}
                className="flex flex-1 items-center gap-4 bg-[#D9D9D92B] dark:bg-gray-700  rounded-xl overflow-x-auto pb-4 no-scrollbar scroll-smooth px-10 sm:px-12"
              >
                <div className="flex gap-4 w-full  p-4">
                  {solutions.map((solution) => (
                    <button
                      key={solution.key}
                      onClick={() => setSelectedCategory(solution.key)}
                      className={`min-w-[140px] sm:min-w-[160px] flex-shrink-0 p-4 py-8 rounded-xl dark:bg-gray-800 dark:text-white transition-all flex flex-col items-center gap-3 ${
                        solution.active || selectedCategory === solution.key
                          ? 'bg-secondary text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <solution.icon className="h-10 w-10" />
                      <span className="text-sm font-medium">
                        {t(`dashboard.solutionCategories.${solution.key}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`hidden sm:flex absolute right-0 z-10 p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-all ${
                  canScrollRight
                    ? 'opacity-100 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <ChevronRight size={26} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Main Content Grid - 3 Columns */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Column 1 - Left */}
            <div className="space-y-6">
              {/* Active Solutions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold pt-4 text-gray-600">
                    {t('dashboard.activeSolutions')}
                  </CardTitle>

                  <CardDescription>
                    <Link
                      to="/solution-templates"
                      className="text-secondary text-xs mt-1 hover:underline"
                    >
                      {t('dashboard.viewAll')}
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="h-16 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={activeSolutionsData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#44489D"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Tasks Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-600">
                    {t('dashboard.pendingTasks')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingTasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between   rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-500">
                        {task.task}
                      </span>
                      <Badge
                        className={`${task.color} rounded-md text-white text-xs`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                  <Button className="rounded-md text-xs    bg-secondary hover:bg-secondary/90 text-white">
                    {t('dashboard.viewTasks')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Column 2 - Middle */}
            <div className="space-y-6">
              {/* Connected Devices Card */}
              <Card className="flex items-center  justify-between pt-2 pb-10">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-600">
                    {t('dashboard.connectedDevices')}
                  </CardTitle>
                  <CardDescription className="text-sm  text-gray-500">
                    {t('dashboard.connections', { count: 12 })}
                  </CardDescription>
                  <Button className=" text-xs rounded-md bg-secondary-main hover:bg-secondary-main/90 text-white">
                    {t('dashboard.addNewDevice')}
                  </Button>
                </CardHeader>

                <CardContent>
                  <div className="flex   items-center justify-between space-y-4">
                    <div className="relative flex items-center justify-center">
                      <ResponsiveContainer width={100} height={120}>
                        <PieChart>
                          <Pie
                            data={deviceUsageData}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={50}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                          >
                            {deviceUsageData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <span className="absolute text-2xl font-semibold text-gray-900">
                        20%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-600">
                    {t('dashboard.billingStatus')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5  py-6 ">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t('dashboard.nextBilling', { date: 'May 15, 2025' })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('dashboard.currentPlan', {
                        plan: 'Smart City Trial',
                      })}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <Progress value={65} max={100} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Column 3 - Right */}
            <div className="space-y-6">
              {/* Total Users Card */}
              <Card className="flex items-center  justify-between pt-2 pb-12">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-600">
                    {t('dashboard.totalUsers')}
                  </CardTitle>
                  <CardDescription className="text-sm  text-gray-500">
                    {t('dashboard.users', { count: 10 })}
                  </CardDescription>
                  <Button className=" text-xs rounded-md bg-secondary-main hover:bg-secondary-main/90 text-white">
                    {t('dashboard.manageUsers')}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {userAvatars.map((letter, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-semibold border-2 border-white"
                          style={{ backgroundColor: COLORS[index] }}
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg   font-semibold text-gray-600">
                    {t('dashboard.usageSummary')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-10">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {t('dashboard.devices')}
                      </span>
                      <span className="font-semibold text-gray-900">12/30</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <Progress value={65} max={100} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {t('dashboard.dashboards')}
                      </span>
                      <span className="font-semibold text-gray-900">5/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <Progress value={65} max={100} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recently Accessed Dashboards */}
          <div className="mt-4 p-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('dashboard.recentlyAccessedDashboards')}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {dashboardPreviews.map((dashboard, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer rounded-xl overflow-hidden  hover:shadow-lg transition border-0`}
                >
                  <CardHeader
                    className={`text-lg font-semibold mb-2 ${dashboard.textColor} bg-gradient-to-br ${dashboard.gradient} dark:bg-gray-800 dark:text-white`}
                  >
                    <p>{dashboard.title}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className={`text-sm  text-center text-gray-500 dark:text-white`}>
                      {dashboard.subtitle}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
