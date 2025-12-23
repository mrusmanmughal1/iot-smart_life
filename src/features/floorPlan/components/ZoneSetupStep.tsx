import React, { useState, useRef } from 'react';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ZoomIn, ZoomOut, Maximize2, CheckCircle2, Plus } from 'lucide-react';
import type { FilterFormValues, Zone } from '@/features/floorPlan/types';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';
import type { Stage as KonvaStage } from 'konva/lib/Stage';

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
    x: 20,
    y: 20,
    w: 200,
    h: 150,
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
    x: 240,
    y: 20,
    w: 200,
    h: 150,
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
    x: 460,
    y: 20,
    w: 200,
    h: 150,
    isDefined: false,
  },
];

// Color mapping for zone types
const getZoneColor = (type: string): string => {
  const colors: Record<string, string> = {
    Room: '#93C5FD',
    Office: '#FCD34D',
    Lobby: '#86EFAC',
    Corridor: '#C4B5FD',
    Storage: '#FCA5A5',
  };
  return colors[type] || '#E5E7EB';
};

export const ZoneSetupStep: React.FC<ZoneSetupStepProps> = ({
  register,
  control,
  onPrevious,
  onNext,
}) => {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-1');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isAddZoneMode, setIsAddZoneMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneType, setNewZoneType] = useState('Room');
  const [selectionPoints, setSelectionPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pendingZonePosition, setPendingZonePosition] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const stageRef = useRef<KonvaStage>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

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
    console.log('Auto-detect rooms');
  };

  const handleAddZone = () => {
    setIsAddZoneMode(true);
    setIsDrawing(true);
    setSelectionPoints([]);
  };

  const handleStageClick = () => {
    if (!isAddZoneMode || !isDrawing || !stageRef.current) return;

    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    
    if (!point) return;
    
    // Account for zoom
    const scale = zoomLevel / 100;
    const x = point.x / scale;
    const y = point.y / scale;

    setSelectionPoints([...selectionPoints, { x, y }]);
  };

  const handleFinishSelection = () => {
    if (selectionPoints.length < 2) {
      return;
    }

    // Calculate bounding box
    const minX = Math.min(...selectionPoints.map(p => p.x));
    const minY = Math.min(...selectionPoints.map(p => p.y));
    const maxX = Math.max(...selectionPoints.map(p => p.x));
    const maxY = Math.max(...selectionPoints.map(p => p.y));

    setPendingZonePosition({
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY,
    });
    setIsDialogOpen(true);
    setIsDrawing(false);
    setIsAddZoneMode(false);
  };

  const handleCancelSelection = () => {
    setSelectionPoints([]);
    setIsDrawing(false);
    setIsAddZoneMode(false);
  };

  const handleCreateZone = () => {
    if (!pendingZonePosition || !newZoneName.trim()) return;

    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      name: newZoneName.trim(),
      type: newZoneType,
      area: 0,
      capacity: 0,
      status: 'Draft',
      floor: 'Ground',
      description: '',
      color: 'bg-gray-200',
      x: pendingZonePosition.x,
      y: pendingZonePosition.y,
      w: pendingZonePosition.w,
      h: pendingZonePosition.h,
      isDefined: false,
    };

    setZones([...zones, newZone]);
    setSelectedZoneId(newZone.id);
    setNewZoneName('');
    setNewZoneType('Room');
    setPendingZonePosition(null);
    setSelectionPoints([]);
    setIsDialogOpen(false);
  };

  const handleCancelAddZone = () => {
    setIsAddZoneMode(false);
    setIsDialogOpen(false);
    setPendingZonePosition(null);
    setSelectionPoints([]);
    setIsDrawing(false);
    setNewZoneName('');
  };

  const totalZones = zones.filter((z) => z.isDefined).length;
  const totalArea = zones.reduce((sum, z) => sum + z.area, 0);
  const definedArea = zones
    .filter((z) => z.isDefined)
    .reduce((sum, z) => sum + z.area, 0);
  const coverage = totalArea > 0 ? (definedArea / totalArea) * 100 : 0;
  const undefinedArea = 100 - coverage;

  const stageWidth = 800;
  const stageHeight = 500;
  const scaledWidth = (stageWidth * zoomLevel) / 100;
  const scaledHeight = (stageHeight * zoomLevel) / 100;

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
              <Button
                variant="default"
                size="sm"
                onClick={handleAddZone}
                className={`h-8 ${isAddZoneMode ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Zone
              </Button>
            </div>
            {isAddZoneMode && (
              <div className="mb-2 space-y-2">
                <div className="text-sm text-blue-600 font-medium">
                  {isDrawing
                    ? `Click on the floor plan to select points (${selectionPoints.length} point${selectionPoints.length !== 1 ? 's' : ''} selected). Click "Finish Selection" when done.`
                    : 'Click "Start Selection" to begin selecting an area'}
                </div>
                {isDrawing && (
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleFinishSelection}
                      disabled={selectionPoints.length < 2}
                      className="h-8"
                    >
                      Finish Selection
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelSelection}
                      className="h-8"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Konva Canvas Container */}
            <div
              ref={containerRef}
              className="relative rounded-lg shadow-md border border-gray-200 bg-gray-50 overflow-auto max-h-[600px]"
            >
              <Stage
                ref={stageRef}
                width={scaledWidth}
                height={scaledHeight}
                onClick={handleStageClick}
                style={{ cursor: isAddZoneMode && isDrawing ? 'crosshair' : 'default' }}
              >
                <Layer>
                  {/* Existing Zones */}
                  {zones.map((zone) => {
                    const isSelected = zone.id === selectedZoneId;
                    const zoneColor = getZoneColor(zone.type);
                    
                    return (
                      <Group
                        key={zone.id}
                        onClick={() => handleZoneClick(zone.id)}
                        onTap={() => handleZoneClick(zone.id)}
                      >
                        {/* Zone Rectangle */}
                        <Rect
                          x={zone.x}
                          y={zone.y}
                          width={zone.w}
                          height={zone.h}
                          fill={zoneColor}
                          opacity={0.6}
                          stroke={isSelected ? '#3B82F6' : '#9CA3AF'}
                          strokeWidth={isSelected ? 3 : 2}
                          dash={isSelected ? [] : [5, 5]}
                          cornerRadius={8}
                        />
                        {/* Zone Title Overlay */}
                        <Rect
                          x={zone.x + zone.w / 2 - 60}
                          y={zone.y + zone.h / 2 - 12}
                          width={120}
                          height={24}
                          fill="rgba(255, 255, 255, 0.95)"
                          cornerRadius={4}
                          shadowBlur={4}
                          shadowColor="rgba(0, 0, 0, 0.1)"
                        />
                        <Text
                          x={zone.x + zone.w / 2}
                          y={zone.y + zone.h / 2}
                          text={zone.name}
                          fontSize={12}
                          fontStyle="bold"
                          fill="#1F2937"
                          align="center"
                          verticalAlign="middle"
                          offsetX={60}
                          offsetY={6}
                        />
                        {/* Zone Type (shown when selected) */}
                        {isSelected && (
                          <>
                            <Rect
                              x={zone.x}
                              y={zone.y + zone.h - 20}
                              width={zone.w}
                              height={20}
                              fill="rgba(0, 0, 0, 0.6)"
                              cornerRadius={[0, 0, 8, 8]}
                            />
                            <Text
                              x={zone.x + zone.w / 2}
                              y={zone.y + zone.h - 10}
                              text={zone.type}
                              fontSize={10}
                              fill="#FFFFFF"
                              align="center"
                              verticalAlign="middle"
                              offsetX={zone.w / 2}
                              offsetY={5}
                            />
                          </>
                        )}
                      </Group>
                    );
                  })}

                  {/* Selection Preview */}
                  {isDrawing && selectionPoints.length > 0 && (
                    <Group>
                      {/* Draw polygon from selection points */}
                      {selectionPoints.length > 1 && (
                        <Line
                          points={selectionPoints.flatMap(p => [p.x, p.y])}
                          closed={false}
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dash={[5, 5]}
                          fill="rgba(59, 130, 246, 0.2)"
                        />
                      )}
                      {/* Draw points */}
                      {selectionPoints.map((point, idx) => (
                        <Group key={idx}>
                          <Rect
                            x={point.x - 4}
                            y={point.y - 4}
                            width={8}
                            height={8}
                            fill="#3B82F6"
                            stroke="#FFFFFF"
                            strokeWidth={2}
                            cornerRadius={4}
                          />
                        </Group>
                      ))}
                    </Group>
                  )}
                </Layer>
              </Stage>
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
            <div className="mb-4 space-y-2 rounded-lg shadow border border-gray-200 bg-white p-4">
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
      <div className="flex items-center border-t pt-4">
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

      {/* Add Zone Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Zone</DialogTitle>
            <DialogDescription>
              Enter a name for the new zone you selected on the floor plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="zone-name">Zone Name *</Label>
              <Input
                id="zone-name"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Enter zone name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newZoneName.trim()) {
                    handleCreateZone();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zone-type-select">Zone Type *</Label>
              <Select value={newZoneType} onValueChange={setNewZoneType}>
                <SelectTrigger id="zone-type-select">
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
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelAddZone}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateZone}
              disabled={!newZoneName.trim()}
            >
              Create Zone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
