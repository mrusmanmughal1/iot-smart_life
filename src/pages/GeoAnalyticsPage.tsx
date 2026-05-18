import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/util';
import { useGeoAnalytics } from '@/features/analytics/hooks';
import { GeoAnalyticsData, GeoStat, PerformanceMetric } from '@/services/api';

export default function GeoAnalyticsPage() {
  const { t } = useTranslation();
  const [region, setRegion] = useState('all');
  const [viewMode, setViewMode] = useState<'Heatmap' | 'Clusters'>('Clusters');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const { data: geoDataDetails } = useGeoAnalytics(
    region === 'all' ? undefined : region
  );
  console.log(geoDataDetails, 'geodata');
  const geoData = (geoDataDetails || {}) as GeoAnalyticsData;
  const regionalStats = (geoData?.regionalStats || []).map((r: GeoStat) => ({
    name: r.region || 'Unknown',
    devices: r.deviceCount || 0,
    data: `${r.dataGB || 0}GB`,
    growth: `${(r.growthPercent || 0) >= 0 ? '↑' : '↓'} ${Math.abs(r.growthPercent || 0)}%`,
    color: (r.growthPercent || 0) >= 0 ? 'text-green-500' : 'text-red-500',
  }));

  const performanceData = geoData?.locationPerformance?.map(
    (p: PerformanceMetric) => ({
      region: p.region || 'Unknown',
      responseTime: `${p.avgResponseMs || 0}ms`,
      uptime: `${p.uptimePercent || 0}%`,
      quality: `${p.dataQualityPercent || 0}%`,
      rate: `${p.alertRate || 0}%`,
      status: p.status || 'Offline',
      statusColor:
        p.status === 'Online' || p.status === 'active'
          ? 'bg-green-500'
          : 'bg-gray-400',
    })
  );

  const deviceDistribution = geoData?.deviceDistribution || [];
  const totalDevices = regionalStats.reduce(
    (acc: number, curr: any) => acc + (curr.devices || 0),
    0
  );

  // Initialize Map and Markers
  useEffect(() => {
    if (!mapRef.current || deviceDistribution.length === 0) return;

    const loadGoogleMaps = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve();
          return;
        }

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(script);
      });
    };

    loadGoogleMaps().then(() => {
      if (!window.google || !window.google.maps || !mapRef.current) return;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 20, lng: 60 },
          zoom: 3,
          styles: [
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#7c93a3' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#f3f7f9' }],
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#ffffff' }],
            },
          ],
          disableDefaultUI: true,
          zoomControl: true,
        });
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // Add new markers for locations
      deviceDistribution.forEach((loc: any) => {
        if (loc.lat && loc.lng) {
          const marker = new window.google.maps.Marker({
            position: {
              lat: loc.lat,
              lng: loc.lng,
            },
            map,
            title: `${loc.region} (${loc.deviceCount} devices)`,
            icon: {
              path: window.google.maps.SymbolPath.BACKWARD_OPEN_TRIANGLE,
              scale: 8,
              fillColor: '#4338ca',
              fillOpacity: 0.7,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            },
          });
          markersRef.current.push(marker);
        }
      });
    });
  }, [deviceDistribution]);

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={t('analytics.geo.title')}
          description={t('analytics.geo.subtitle')}
        />
        <div className="flex items-center gap-3">
          <Button>Export Map</Button>
          <Button variant="primary">Refresh</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Select value={region} onValueChange={setRegion} className="text-sm">
          <SelectTrigger className="w-[180px] h-10 bg-gray-100 border-none rounded-md">
            <SelectValue placeholder="Filter: All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="na">North America</SelectItem>
            <SelectItem value="eu">Europe</SelectItem>
            <SelectItem value="as">Asia</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="7d">
          <SelectTrigger className="w-[180px] h-10 bg-gray-100 border-none rounded-md">
            <SelectValue placeholder="Time: Last 7 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Card */}
        <Card className="lg:col-span-2 rounded-xl ">
          <CardHeader className="p-5">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {t('analytics.geo.mapTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 w-full h-[500px]">
            <div
              ref={mapRef}
              className="w-full h-full border border-gray-100 dark:border-gray-800 rounded-xl"
            />
          </CardContent>
        </Card>

        {/* Regional Statistics Card */}
        <Card className=" rounded-xl  ">
          <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {t('analytics.geo.stats.title')}
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-[#c026d3] text-white hover:bg-[#a21caf] rounded-md px-3"
            >
              {t('analytics.geo.stats.totalDevices', { count: totalDevices })}
            </Badge>
          </CardHeader>
          <CardContent className="px-4 space-y-2 h-[400px] overflow-y-auto">
            {regionalStats.map((region, idx) => (
              <div
                key={idx}
                className="p-2 px-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm dark:text-white">
                    {region.name}
                  </h4>
                </div>
                <p className="text-xs text-gray-500 mb-1">
                  Devices: {region.devices} | Data: {region.data}
                </p>
                <p className={cn('text-xs font-medium', region.color)}>
                  {region.growth}
                </p>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <div className="pt-4 flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">
                {t('analytics.geo.stats.viewMode')}
              </span>
              <div className="flex bg-gray-100 p-2   rounded-md">
                <Button
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode('Heatmap')}
                  variant={viewMode === 'Heatmap' ? 'secondary' : 'default'}
                >
                  {t('analytics.geo.stats.heatmap')}
                </Button>
                <Button
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode('Clusters')}
                  variant={viewMode === 'Clusters' ? 'secondary' : 'default'}
                >
                  {t('analytics.geo.stats.clusters')}
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Performance Table */}
      <Card className="  rounded-xl ">
        <CardHeader className="">
          <CardTitle className="text-lg font-semibold text-gray-800">
            {t('analytics.geo.table.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <Table>
            <TableHeader className="bg-primary text-white rounded-md">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-white font-medium ">
                  {t('analytics.geo.table.region')}
                </TableHead>
                <TableHead className="text-white font-medium  ">
                  {t('analytics.geo.table.avgResponseTime')}
                </TableHead>
                <TableHead className="text-white font-medium  ">
                  {t('analytics.geo.table.uptime')}
                </TableHead>
                <TableHead className="text-white font-medium  ">
                  {t('analytics.geo.table.dataQuality')}
                </TableHead>
                <TableHead className="text-white font-medium  ">
                  {t('analytics.geo.table.alertRate')}
                </TableHead>
                <TableHead className="text-white font-medium  ">
                  {t('analytics.geo.table.status')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData.map((row: any, index: number) => (
                <TableRow
                  key={index}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 h-16"
                >
                  <TableCell className="text-sm font-semibold text-gray-600">
                    {row.region}
                  </TableCell>
                  <TableCell className="text-sm  text-gray-800">
                    {row.responseTime}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.uptime}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.quality}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.rate}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn('w-2 h-2 rounded-full', row.statusColor)}
                      />
                      <span className="text-gray-700">{row.status}</span>
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
