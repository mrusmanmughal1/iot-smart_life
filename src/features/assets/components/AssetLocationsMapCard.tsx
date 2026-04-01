import { useEffect, useMemo, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAssets } from '@/features/assets/hooks';
import type { Asset } from '@/services/api/assets.api';

interface GoogleMarker {
  setMap: (map: unknown | null) => void;
}

interface GoogleMapsApi {
  maps: {
    Map: new (
      element: HTMLElement,
      options: {
        center: { lat: number; lng: number };
        zoom: number;
        mapTypeControl?: boolean;
        streetViewControl?: boolean;
        fullscreenControl?: boolean;
      }
    ) => {
      fitBounds: (bounds: unknown) => void;
      setCenter: (center: { lat: number; lng: number }) => void;
      setZoom: (zoom: number) => void;
    };
    Marker: new (options: {
      position: { lat: number; lng: number };
      map: unknown;
      title?: string;
    }) => GoogleMarker;
    LatLngBounds: new () => {
      extend: (latLng: { lat: number; lng: number }) => void;
    };
  };
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function AssetLocationsMapCard() {
  const { data: assetsResponse, isLoading: isAssetsLoading } = useAssets({
    page: 1,
    limit: 200,
  });

  const assets: Asset[] = useMemo(
    () => assetsResponse?.data?.data?.data || [],
    [assetsResponse]
  );
  const mapAssets = useMemo(
    () =>
      assets.filter(
        (asset) =>
          typeof asset.location?.latitude === 'number' &&
          typeof asset.location?.longitude === 'number'
      ),
    [assets]
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersRef = useRef<GoogleMarker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadGoogleMaps = () =>
      new Promise<void>((resolve, reject) => {
        if (window.google?.maps) {
          resolve();
          return;
        }

        const existingScript = document.querySelector(
          'script[src*="maps.googleapis.com/maps/api/js"]'
        );
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', () =>
            reject(new Error('Failed to load Google Maps'))
          );
          return;
        }

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(script);
      });

    loadGoogleMaps()
      .then(() => {
        if (!mapRef.current || !window.google?.maps) return;
        const { maps } = window.google;

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new maps.Map(mapRef.current, {
            center: { lat: 24.7136, lng: 46.6753 },
            zoom: 5,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });
        }

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        if (!mapAssets.length) return;

        const bounds = new maps.LatLngBounds();

        mapAssets.forEach((asset) => {
          const lat = asset.location?.latitude;
          const lng = asset.location?.longitude;
          if (typeof lat !== 'number' || typeof lng !== 'number') return;

          const marker = new maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            title: asset.name,
          });
          markersRef.current.push(marker);
          bounds.extend({ lat, lng });
        });

        const mapInstance = mapInstanceRef.current as {
          fitBounds: (bounds: unknown) => void;
          setCenter: (center: { lat: number; lng: number }) => void;
          setZoom: (zoom: number) => void;
        };

        if (markersRef.current.length === 1) {
          const first = mapAssets[0];
          if (
            typeof first.location?.latitude === 'number' &&
            typeof first.location?.longitude === 'number'
          ) {
            mapInstance.setCenter({
              lat: first.location.latitude,
              lng: first.location.longitude,
            });
            mapInstance.setZoom(12);
          }
        } else {
          mapInstance.fitBounds(bounds);
        }
      })
      .catch(() => {
        if (mapRef.current) {
          mapRef.current.innerHTML =
            '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748b;">Map unavailable</div>';
        }
      });
  }, [mapAssets]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-600">
          Projects Locations
        </CardTitle>
        <CardDescription>
          Showing {mapAssets.length} Projects on map
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAssetsLoading ? (
          <Skeleton className="h-[220px] w-full rounded-lg" />
        ) : (
          <div
            ref={mapRef}
            className="h-[220px] w-full rounded-lg border border-gray-200"
          />
        )}
      </CardContent>
    </Card>
  );
}
