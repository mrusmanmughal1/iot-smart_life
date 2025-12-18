import React, { useState, useCallback } from 'react';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import GridLayout, { Layout } from 'react-grid-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ZoomIn, ZoomOut, Maximize2, CheckCircle2 } from 'lucide-react';
import type { FilterFormValues, Zone } from '@/features/floorPlan/types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface ZoneSetupStepProps {
  register: UseFormRegister<FilterFormValues>;
  control: Control<FilterFormValues>;
  onPrevious: () => void;
  onNext: () => void;
}

const initialZones: Zone[] = [
  {
    id: 'zone-1',
    name: 'Conference Room A',
    type: 'Room',
    area: 45.2,
    capacity: 12,
    status: 'Active',
    floor: 'Ground',
    description: 'Main conference room for meetings and presentations.',
    color: 'bg-blue-200',
    x: 0,
    y: 0,
    w: 4,
    h: 3,
    isDefined: true,
  },
  {
    id: 'zone-2',
    name: 'Office Space 1',
    type: 'Office',
    area: 32.5,
    capacity: 4,
    status: 'Active',
    floor: 'Ground',
    description: '',
    color: 'bg-orange-200',
    x: 4,
    y: 0,
    w: 4,
    h: 3,
    isDefined: false,
  },
  {
    id: 'zone-3',
    name: 'Main Lobby',
    type: 'Lobby',
    area: 58.7,
    capacity: 20,
    status: 'Active',
    floor: 'Ground',
    description: '',
    color: 'bg-green-200',
    x: 8,
    y: 0,
    w: 4,
    h: 3,
    isDefined: false,
  },
  {
    id: 'zone-4',
    name: 'Corridor',
    type: 'Corridor',
    area: 25.3,
    capacity: 0,
    status: 'Active',
    floor: 'Ground',
    description: '',
    color: 'bg-purple-200',
    x: 0,
    y: 3,
    w: 4,
    h: 3,
    isDefined: false,
  },
  {
    id: 'zone-5',
    name: 'Storage Area',
    type: 'Storage',
    area: 18.9,
    capacity: 0,
    status: 'Active',
    floor: 'Ground',
    description: '',
    color: 'bg-green-200',
    x: 4,
    y: 3,
    w: 4,
    h: 3,
    isDefined: false,
  },
  {
    id: 'zone-6',
    name: 'New Zone',
    type: 'Room',
    area: 0,
    capacity: 0,
    status: 'Draft',
    floor: 'Ground',
    description: '',
    color: 'bg-gray-200',
    x: 8,
    y: 3,
    w: 4,
    h: 3,
    isDefined: false,
  },
  {
    id: 'zone-7',
    name: 'Storage Area',
    type: 'Storage',
    area: 15.2,
    capacity: 0,
    status: 'Active',
    floor: 'Ground',
    description: '',
    color: 'bg-yellow-200',
    x: 0,
    y: 6,
    w: 4,
    h: 3,
    isDefined: false,
  },
  {
    id: 'zone-8',
    name: 'Storage Area',
    type: 'Storage',
    area: 12.8,
    capacity: 0,
    status: 'Active',
    floor: 'Ground',
    description: '',
    color: 'bg-pink-200',
    x: 4,
    y: 6,
    w: 4,
    h: 3,
    isDefined: false,
  },
  {
    id: 'zone-9',
    name: 'New Zone',
    type: 'Room',
    area: 0,
    capacity: 0,
    status: 'Draft',
    floor: 'Ground',
    description: '',
    color: 'bg-gray-200',
    x: 8,
    y: 6,
    w: 4,
    h: 3,
    isDefined: false,
  },
];

export const ZoneSetupStep: React.FC<ZoneSetupStepProps> = ({
  register,
  control,
  onPrevious,
  onNext,
}) => {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-1');
  const [zoomLevel, setZoomLevel] = useState(100);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  const handleLayoutChange = useCallback((layout: Layout[]) => {
    setZones((prevZones) =>
      prevZones.map((zone) => {
        const layoutItem = layout.find((item) => item.i === zone.id);
        if (layoutItem) {
          return {
            ...zone,
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          };
        }
        return zone;
      })
    );
  }, []);

  const handleZoneClick = (zoneId: string) => {
    setSelectedZoneId(zoneId);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const handleFitToView = () => {
    setZoomLevel(100);
  };

  const handleAutoDetect = () => {
    // Placeholder for auto-detect functionality
    console.log('Auto-detect rooms');
  };

  const totalZones = zones.filter((z) => z.isDefined).length;
  const totalArea = zones.reduce((sum, z) => sum + z.area, 0);
  const definedArea = zones
    .filter((z) => z.isDefined)
    .reduce((sum, z) => sum + z.area, 0);
  const coverage = totalArea > 0 ? (definedArea / totalArea) * 100 : 0;
  const undefinedArea = 100 - coverage;

  const gridLayout: Layout[] = zones.map((zone) => ({
    i: zone.id,
    x: zone.x,
    y: zone.y,
    w: zone.w,
    h: zone.h,
    minW: 2,
    minH: 2,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Left Panel - Floor Plan Editor */}
        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              Floor Plan Editor - Ground Floor
            </h3>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Zoom: {zoomLevel}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleFitToView}
                className="h-8"
              >
                <Maximize2 className="mr-1 h-3 w-3" />
                Fit to View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoDetect}
                className="h-8"
              >
                Auto-Detect Rooms
              </Button>
            </div>

            {/* Grid Layout Container */}
            <div className="relative rounded-lg shadow-md border border-gray-200 bg-gray-50 overflow-auto max-h-[600px]">
              <div
                className="p-4"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top left',
                  minHeight: '500px',
                  width: `${(800 * zoomLevel) / 100}px`,
                }}
              >
                <GridLayout
                  className="layout"
                  layout={gridLayout}
                  cols={12}
                  rowHeight={40}
                  width={800}
                  onLayoutChange={handleLayoutChange}
                  isDraggable={true}
                  isResizable={true}
                  draggableHandle=".zone-drag-handle"
                >
                  {zones.map((zone) => {
                    const isSelected = zone.id === selectedZoneId;
                    return (
                      <div
                        key={zone.id}
                        className={`zone-drag-handle cursor-move rounded-lg border-2 p-2 transition-all ${
                          isSelected
                            ? 'border-primary shadow-lg'
                            : 'border-dashed border-gray-300'
                        } ${zone.color}`}
                        onClick={() => handleZoneClick(zone.id)}
                      >
                        <div className="text-xs font-semibold">{zone.name}</div>
                      </div>
                    );
                  })}
                </GridLayout>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Zone Properties */}
        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Zone Properties</h3>

            {/* Selected Zone Info */}
            <div className="mb-4 space-y-2 rounded-lg shadow border border-gray-200 bg-white p-4">
              <h4 className="text-sm font-semibold">Selected Zone</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Name: {selectedZone.name}</div>
                <div>Type: {selectedZone.type}</div>
                <div>Area: {selectedZone.area} m²</div>
                <div>Capacity: {selectedZone.capacity} people</div>
                <div>Status: {selectedZone.status}</div>
                <div>Floor: {selectedZone.floor}</div>
              </div>
            </div>

            {/* Editable Zone Properties */}
            <div className="mb-4 space-y-4 rounded-lg shadow border border-gray-200 bg-white p-4">
              <h4 className="text-sm font-semibold">Selected Zone</h4>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Zone Name:
                  </label>
                  <Controller
                    control={control}
                    name="zoneName"
                    defaultValue={selectedZone.name}
                    render={({ field }) => (
                      <Select
                        value={field.value || selectedZone.name}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {zones.map((zone) => (
                            <SelectItem key={zone.id} value={zone.name}>
                              {zone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Zone Type:
                  </label>
                  <Controller
                    control={control}
                    name="zoneType"
                    defaultValue={selectedZone.type}
                    render={({ field }) => (
                      <Select
                        value={field.value || selectedZone.type}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Room">Room</SelectItem>
                          <SelectItem value="Office">Office</SelectItem>
                          <SelectItem value="Lobby">Lobby</SelectItem>
                          <SelectItem value="Corridor">Corridor</SelectItem>
                          <SelectItem value="Storage">Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Description:
                  </label>
                  <Textarea
                    {...register('zoneDescription')}
                    defaultValue={selectedZone.description}
                    className="min-h-[80px] text-xs"
                    placeholder="Enter zone description..."
                  />
                </div>
              </div>
            </div>

            {/* Floor Statistics */}
            <div className="mb-4 space-y-2 rounded-lg  shadow border border-gray-200 bg-white p-4">
              <h4 className="text-sm font-semibold">Floor Statistics</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Total Zones: {totalZones}</div>
                <div>Coverage: {coverage.toFixed(0)}%</div>
                <div>Undefined Area: {undefinedArea.toFixed(0)}%</div>
              </div>
            </div>

            {/* Validation Status */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h4 className="mb-2 text-sm font-semibold">Validation Status</h4>
              <div className="space-y-1 text-xs text-green-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  All zones properly defined
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  No overlapping zones
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center   border-t pt-4">
        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={onPrevious}>
            Previous
          </Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button variant="outline" type="button">
            Save
          </Button>
          <Button type="button" onClick={onNext}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
