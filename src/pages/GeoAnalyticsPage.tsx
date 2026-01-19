import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw, Download,  TrendingUp, TrendingDown } from 'lucide-react';

// Mock data for regional statistics
interface RegionalStat {
  region: string;
  devices: number;
  data: string;
  growth: number;
  growthType: 'up' | 'down';
}

// Mock data for location-based performance
interface LocationPerformance {
  region: string;
  avgResponseTime: string;
  uptime: string;
  dataQuality: string;
  alertRate: string;
  status: 'online' | 'offline';
}

// Helper function to get localized regional statistics
const getRegionalStats = (t: TFunction): RegionalStat[] => [
  {
    region: t('geoAnalytics.regions.northAmerica'),
    devices: 60,
    data: '1.2TB',
    growth: 15,
    growthType: 'up',
  },
  {
    region: t('geoAnalytics.regions.asia'),
    devices: 57,
    data: '980GB',
    growth: 22,
    growthType: 'up',
  },
  {
    region: t('geoAnalytics.regions.europe'),
    devices: 23,
    data: '450GB',
    growth: 5,
    growthType: 'down',
  },
  {
    region: t('geoAnalytics.regions.australia'),
    devices: 18,
    data: '380GB',
    growth: 8,
    growthType: 'up',
  },
  {
    region: t('geoAnalytics.regions.others'),
    devices: 42,
    data: '720GB',
    growth: 12,
    growthType: 'up',
  },
];

// Helper function to get localized location performance data
const getLocationPerformance = (t: TFunction): LocationPerformance[] => [
  {
    region: t('geoAnalytics.regions.northAmerica'),
    avgResponseTime: '120ms',
    uptime: '99.8%',
    dataQuality: '97.5%',
    alertRate: '2.5%',
    status: 'online',
  },
  {
    region: t('geoAnalytics.regions.asia'),
    avgResponseTime: '180ms',
    uptime: '92.8%',
    dataQuality: '92.8%',
    alertRate: '7.2%',
    status: 'offline',
  },
  {
    region: t('geoAnalytics.regions.europe'),
    avgResponseTime: '95ms',
    uptime: '93.8%',
    dataQuality: '93.8%',
    alertRate: '6.2%',
    status: 'online',
  },
];

// Map marker positions matching the image layout
const mapMarkers = [
  { x: 20, y: 25, label: '7', region: 'canada' }, // Canada
  { x: 45, y: 15, label: '5', region: 'greenland' }, // Greenland
  { x: 65, y: 20, label: '3', region: 'russia' }, // Russia
  { x: 75, y: 70, label: '2', region: 'australia' }, // Australia
];


export default function GeoAnalyticsPage() {
  const { t } = useTranslation();
  const [regionFilter, setRegionFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [viewMode, setViewMode] = useState<'heatmap' | 'clusters'>('heatmap');

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log('Refreshing geo analytics...');
  };

  const handleExportMap = () => {
    // TODO: Implement export functionality
    console.log('Exporting map...');
  };

  const regionalStats = getRegionalStats(t);
  const locationPerformance = getLocationPerformance(t);
  const totalDevices = regionalStats.reduce((sum, stat) => sum + stat.devices, 0);

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('geoAnalytics.title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('geoAnalytics.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t('geoAnalytics.filters.filter')}:
            </span>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-[160px] bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder={t('geoAnalytics.filters.allRegions')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('geoAnalytics.filters.allRegions')}</SelectItem>
                <SelectItem value="north-america">{t('geoAnalytics.regions.northAmerica')}</SelectItem>
                <SelectItem value="asia">{t('geoAnalytics.regions.asia')}</SelectItem>
                <SelectItem value="europe">{t('geoAnalytics.regions.europe')}</SelectItem>
                <SelectItem value="australia">{t('geoAnalytics.regions.australia')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t('geoAnalytics.filters.time')}:
            </span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px] bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder={t('geoAnalytics.filters.last7Days')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">{t('geoAnalytics.filters.last24Hours')}</SelectItem>
                <SelectItem value="7d">{t('geoAnalytics.filters.last7Days')}</SelectItem>
                <SelectItem value="30d">{t('geoAnalytics.filters.last30Days')}</SelectItem>
                <SelectItem value="90d">{t('geoAnalytics.filters.last90Days')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleExportMap}
            variant="outline"
            className="border-gray-300 dark:border-gray-700"
          >
            <Download className="mr-2 h-4 w-4" />
            {t('geoAnalytics.exportMap')}
          </Button>
          <Button
            onClick={handleRefresh}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('geoAnalytics.refresh')}
          </Button>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left Column - Map */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              {t('geoAnalytics.deviceDistributionMap')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* World Map Visualization */}
            <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Simplified World Map SVG */}
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Continents with colors matching image */}
                {/* North America - Light blue */}
                <path
                  d="M 100 150 Q 150 100, 200 120 Q 250 140, 300 130 Q 350 120, 400 150 Q 420 180, 400 220 Q 380 250, 350 240 Q 320 230, 300 210 Q 280 200, 250 200 Q 220 190, 200 180 Q 180 170, 150 180 Q 120 170, 100 160 Z"
                  fill="rgba(147, 197, 253, 0.4)"
                  stroke="rgba(96, 165, 250, 0.6)"
                  strokeWidth="1.5"
                />
                {/* Europe - Pink */}
                <path
                  d="M 450 120 Q 480 100, 520 110 Q 550 120, 580 130 Q 600 140, 590 160 Q 580 180, 560 170 Q 540 160, 520 150 Q 500 140, 480 130 Q 460 120, 450 120 Z"
                  fill="rgba(251, 182, 206, 0.4)"
                  stroke="rgba(236, 72, 153, 0.6)"
                  strokeWidth="1.5"
                />
                {/* Asia - Pink/Purple */}
                <path
                  d="M 550 100 Q 650 90, 750 120 Q 800 140, 820 180 Q 810 220, 780 240 Q 750 250, 720 240 Q 690 230, 670 210 Q 650 190, 630 170 Q 610 150, 580 130 Q 560 120, 550 100 Z"
                  fill="rgba(251, 182, 206, 0.4)"
                  stroke="rgba(236, 72, 153, 0.6)"
                  strokeWidth="1.5"
                />
                {/* Australia - Gray */}
                <path
                  d="M 750 300 Q 800 290, 850 310 Q 870 340, 850 360 Q 830 370, 810 360 Q 790 350, 770 340 Q 750 330, 750 300 Z"
                  fill="rgba(209, 213, 219, 0.4)"
                  stroke="rgba(156, 163, 175, 0.6)"
                  strokeWidth="1.5"
                />
                {/* South America - Pink */}
                <path
                  d="M 220 220 Q 240 260, 250 320 Q 260 380, 270 420 Q 280 450, 300 460 Q 280 440, 260 400 Q 240 360, 230 320 Q 220 280, 220 240 Z"
                  fill="rgba(251, 182, 206, 0.4)"
                  stroke="rgba(236, 72, 153, 0.6)"
                  strokeWidth="1.5"
                />
                {/* Africa - Purple/Pink */}
                <path
                  d="M 500 220 Q 520 260, 540 320 Q 550 380, 560 420 Q 570 450, 580 460 Q 560 440, 540 400 Q 520 360, 510 320 Q 500 280, 500 240 Z"
                  fill="rgba(196, 181, 253, 0.4)"
                  stroke="rgba(168, 85, 247, 0.6)"
                  strokeWidth="1.5"
                />
                {/* Greenland - Pink */}
                <path
                  d="M 400 80 Q 420 70, 450 75 Q 470 80, 480 100 Q 470 110, 450 115 Q 430 110, 410 100 Q 400 90, 400 80 Z"
                  fill="rgba(251, 182, 206, 0.4)"
                  stroke="rgba(236, 72, 153, 0.6)"
                  strokeWidth="1.5"
                />
                {/* Russia area - Pink */}
                <path
                  d="M 600 50 Q 680 45, 750 70 Q 800 90, 820 130 Q 810 160, 780 170 Q 750 165, 720 150 Q 690 135, 660 120 Q 630 105, 600 90 Q 580 75, 600 50 Z"
                  fill="rgba(251, 182, 206, 0.4)"
                  stroke="rgba(236, 72, 153, 0.6)"
                  strokeWidth="1.5"
                />
                {/* Canada area - Light purple */}
                <path
                  d="M 150 100 Q 200 90, 250 100 Q 280 110, 300 140 Q 290 160, 270 170 Q 240 165, 210 150 Q 180 135, 160 120 Q 150 110, 150 100 Z"
                  fill="rgba(196, 181, 253, 0.4)"
                  stroke="rgba(168, 85, 247, 0.6)"
                  strokeWidth="1.5"
                />

                {/* Map Markers with numbered circles */}
                {mapMarkers.map((marker, index) => (
                  <g key={index}>
                    <circle
                      cx={(marker.x / 100) * 1000}
                      cy={(marker.y / 100) * 500}
                      r="25"
                      fill="rgba(147, 51, 234, 0.15)"
                      stroke="rgba(147, 51, 234, 0.7)"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx={(marker.x / 100) * 1000}
                      cy={(marker.y / 100) * 500}
                      r="18"
                      fill="rgba(147, 51, 234, 0.5)"
                      stroke="rgba(147, 51, 234, 0.9)"
                      strokeWidth="2"
                    />
                    <text
                      x={(marker.x / 100) * 1000}
                      y={(marker.y / 100) * 500 + 6}
                      textAnchor="middle"
                      fill="white"
                      fontSize="16"
                      fontWeight="bold"
                    >
                      {marker.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Regional Statistics */}
        <div className="space-y-6">
          {/* Total Devices Card */}
          <Card className="bg-purple-600 border-purple-600 dark:bg-purple-700 dark:border-purple-700">
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <div className="text-sm font-medium text-purple-100 dark:text-purple-200 mb-1">
                  {t('geoAnalytics.totalDevices')}
                </div>
                <div className="text-3xl font-bold text-white">
                  {totalDevices} {t('geoAnalytics.devices')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regional Statistics Cards */}
          <div className="space-y-3">
            {regionalStats.map((stat, index) => (
              <Card
                key={index}
                className="bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {stat.region}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('geoAnalytics.devices')}:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {stat.devices}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('geoAnalytics.data')}:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {stat.data}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      {stat.growthType === 'up' ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            ↑ {stat.growth}% {t('geoAnalytics.growth')}
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            ↓ {stat.growth}% {t('geoAnalytics.decline')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View Mode Toggle */}
          <Card className="bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('geoAnalytics.viewMode')}:
                </span>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'heatmap' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('heatmap')}
                    className={viewMode === 'heatmap' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {t('geoAnalytics.heatmap')}
                  </Button>
                  <Button
                    variant={viewMode === 'clusters' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('clusters')}
                    className={viewMode === 'clusters' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {t('geoAnalytics.clusters')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Location-Based Performance Table */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">
            {t('geoAnalytics.locationBasedPerformance')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
                <TableHead className="font-semibold dark:text-gray-300">
                  {t('geoAnalytics.tableHeaders.region')}
                </TableHead>
                <TableHead className="font-semibold dark:text-gray-300">
                  {t('geoAnalytics.tableHeaders.avgResponseTime')}
                </TableHead>
                <TableHead className="font-semibold dark:text-gray-300">
                  {t('geoAnalytics.tableHeaders.uptime')}
                </TableHead>
                <TableHead className="font-semibold dark:text-gray-300">
                  {t('geoAnalytics.tableHeaders.dataQuality')}
                </TableHead>
                <TableHead className="font-semibold dark:text-gray-300">
                  {t('geoAnalytics.tableHeaders.alertRate')}
                </TableHead>
                <TableHead className="font-semibold dark:text-gray-300">
                  {t('geoAnalytics.tableHeaders.status')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationPerformance.map((location, index) => (
                <TableRow key={index} className="dark:border-gray-700">
                  <TableCell className="font-medium dark:text-white">{location.region}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {location.avgResponseTime}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {location.uptime}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {location.dataQuality}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {location.alertRate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          location.status === 'online'
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                        }`}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {location.status === 'online'
                          ? t('geoAnalytics.online')
                          : t('geoAnalytics.offline')}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}