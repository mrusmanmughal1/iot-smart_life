import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Plus,
  Layers,
  Eye,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import type { FilterFormValues, Zone } from '@/features/floorPlan/types';

import type { Stage as KonvaStage } from 'konva/lib/Stage';
import { useFloorMapStore } from '@/features/floorPlan/store';
import FloorPlanCanvas from './FloorPlanCanvas';

interface ZoneSetupStepProps {
  register: UseFormRegister<FilterFormValues>;
  control: Control<FilterFormValues>;
  onPrevious: () => void;
  onNext: () => void;
}




export const ZoneSetupStep: React.FC<ZoneSetupStepProps> = ({
  register,
  control,
  onPrevious,
  onNext,
}) => {
  // Zustand store
  const {
    zones,
    addZone,
    updateZone,
    selectedZoneId,
    setSelectedZoneId,
    zoomLevel,
    setZoomLevel,
    uploadedFiles,
    selectedFloor,
  } = useFloorMapStore();

  // Local state
  const [isAddZoneMode, setIsAddZoneMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneType, setNewZoneType] = useState('Room');
  const [selectionPoints, setSelectionPoints] = useState<
    Array<{ x: number; y: number }>
  >([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pendingZonePosition, setPendingZonePosition] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [activeFloorTab, setActiveFloorTab] = useState(selectedFloor);
  const [dwgError, setDwgError] = useState(false);
  const stageRef = useRef<KonvaStage>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current floor's DWG file
  const currentDwgFile = useMemo(() => {
    const file = uploadedFiles.find(
      (f) => f.floor === activeFloorTab && f.status === 'completed'
    );
    console.log('Current floor tab:', activeFloorTab);
    console.log('Files for this floor:', uploadedFiles.filter(f => f.floor === activeFloorTab));
    console.log('Current DWG file:', file);
    return file;
  }, [uploadedFiles, activeFloorTab]);

  const dwgImageUrl = currentDwgFile?.previewUrl;
  const dwgFile = currentDwgFile?.file;

  // Get zones for current floor
  const currentFloorZones = useMemo(() => {
    return zones.filter((z) => z.floor === activeFloorTab);
  }, [zones, activeFloorTab]);

  const selectedZone =
    currentFloorZones.find((z) => z.id === selectedZoneId) ||
    currentFloorZones[0];

  // Get available floors from uploaded files
  const availableFloors = useMemo(() => {
    // Include all files (completed, uploading, pending) to show all floors
    const floors = uploadedFiles
      .map((f) => f.floor)
      .filter((floor, index, self) => self.indexOf(floor) === index)
      .sort((a, b) => {
        // Sort floors in order: Ground, 1st, 2nd, 3rd, etc.
        const floorOrder = ['Ground', '1st', '2nd', '3rd', '4th', '5th'];
        const indexA = floorOrder.indexOf(a);
        const indexB = floorOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    
    // Debug: Log uploaded files and floors
    console.log('Uploaded files:', uploadedFiles);
    console.log('Available floors:', floors);
    
    return floors.length > 0 ? floors : [selectedFloor];
  }, [uploadedFiles, selectedFloor]);

  useEffect(() => {
    if (
      availableFloors.length > 0 &&
      !availableFloors.includes(activeFloorTab)
    ) {
      setActiveFloorTab(availableFloors[0]);
    }
  }, [availableFloors, activeFloorTab]);

  const handleZoneClick = (zoneId: string) => {
    setSelectedZoneId(zoneId);
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 10, 50));
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
    const minX = Math.min(...selectionPoints.map((p) => p.x));
    const minY = Math.min(...selectionPoints.map((p) => p.y));
    const maxX = Math.max(...selectionPoints.map((p) => p.x));
    const maxY = Math.max(...selectionPoints.map((p) => p.y));

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
      area: pendingZonePosition.w * pendingZonePosition.h, // Calculate area from dimensions
      capacity: 0,
      status: 'Draft',
      floor: activeFloorTab,
      description: '',
      color: 'bg-gray-200',
      x: pendingZonePosition.x,
      y: pendingZonePosition.y,
      w: pendingZonePosition.w,
      h: pendingZonePosition.h,
      isDefined: true, // Mark as defined once created with a name
    };

    addZone(newZone);
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

  const totalZones = currentFloorZones.filter((z) => z.isDefined).length;
  const totalArea = currentFloorZones.reduce((sum, z) => sum + z.area, 0);
  const definedArea = currentFloorZones
    .filter((z) => z.isDefined)
    .reduce((sum, z) => sum + z.area, 0);
  const coverage = totalArea > 0 ? (definedArea / totalArea) * 100 : 0;
  const undefinedArea = 100 - coverage;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left Panel - Floor Plan Editor */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Floor Plan Editor</h3>
            </div>

            {/* Floor Tabs */}
            {uploadedFiles.length > 0 && availableFloors.length > 0 && (
              <Tabs
                value={activeFloorTab}
                onValueChange={setActiveFloorTab}
                defaultValue={activeFloorTab}
                className="mb-4"
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${availableFloors.length}, 1fr)`,
                    width: '100%',
                  }}
                >
                  <TabsList className="w-full">
                    {availableFloors.map((floor) => {
                      const floorFiles = uploadedFiles.filter((f) => f.floor === floor);
                      const hasCompletedFile = floorFiles.some((f) => f.status === 'completed');
                      const isUploading = floorFiles.some((f) => f.status === 'uploading');
                      
                      return (
                        <TabsTrigger
                          key={floor}
                          value={floor}
                          className="flex items-center gap-2"
                        >
                          <Layers className="h-3 w-3" />
                          {floor}
                          {isUploading && (
                            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                          )}
                          {hasCompletedFile && (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          )}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>
              </Tabs>
            )}

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
                className={`h-8 ${
                  isAddZoneMode ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Zone
              </Button>
            </div>

            {isAddZoneMode && (
              <div className="mb-2 space-y-2">
                <div className="text-sm text-blue-600 font-medium">
                  {isDrawing
                    ? `Click on the floor plan to select points (${
                        selectionPoints.length
                      } point${
                        selectionPoints.length !== 1 ? 's' : ''
                      } selected). Click "Finish Selection" when done.`
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
              <FloorPlanCanvas
                zones={currentFloorZones}
                selectedZoneId={selectedZoneId}
                zoomLevel={zoomLevel}
                dwgImageUrl={dwgImageUrl}
                dwgFile={dwgFile}
                onZoneClick={handleZoneClick}
                onStageClick={handleStageClick}
                stageRef={stageRef as React.RefObject<KonvaStage>}
                isDrawing={isDrawing}
                selectionPoints={selectionPoints}
                onDwgError={setDwgError}
              />
            </div>

            {/* DWG File Info */}
            {currentDwgFile && (
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                <Eye className="h-3 w-3" />
                <span>
                  {dwgError
                    ? `DWG file loaded: ${currentDwgFile.file.name} (requires conversion for preview)`
                    : `Displaying: ${currentDwgFile.file.name}`}
                </span>
              </div>
            )}
            {!currentDwgFile && uploadedFiles.length > 0 && (
              <div className="mt-2 text-xs text-amber-600 flex items-center gap-2">
                <AlertTriangle className="h-3 w-3" />
                No DWG file found for {activeFloorTab} floor. Upload a file in
                the DWG Import step.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Zone Properties */}
        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Zone Properties</h3>

            {/* Selected Zone Info */}
            {selectedZone ? (
              <>
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
                  <h4 className="text-sm font-semibold">Edit Zone</h4>
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
                          <Input
                            {...field}
                            value={field.value || selectedZone.name}
                            onChange={(e) => {
                              field.onChange(e);
                              updateZone(selectedZone.id, {
                                name: e.target.value,
                              });
                            }}
                            className="h-8 text-xs"
                          />
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
                            onValueChange={(value) => {
                              field.onChange(value);
                              updateZone(selectedZone.id, { type: value });
                            }}
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
                        onChange={(e) => {
                          updateZone(selectedZone.id, {
                            description: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 text-center text-sm text-muted-foreground">
                No zone selected. Click on a zone or create a new one.
              </div>
            )}

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
            <Button onClick={handleCreateZone} disabled={!newZoneName.trim()}>
              Create Zone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
