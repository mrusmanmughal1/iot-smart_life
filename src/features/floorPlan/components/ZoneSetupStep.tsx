import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { Control, UseFormRegister } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
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
  RefreshCw,
} from 'lucide-react';
import type { AxiosResponse } from 'axios';
import type { FilterFormValues, Zone } from '@/features/floorPlan/types';
import type {
  ParsedGeometry,
  ApiResponse,
  FloorPlan,
} from '@/services/api/floor-plans.api';

import type { Stage as KonvaStage } from 'konva/lib/Stage';
import { useFloorMapStore } from '@/features/floorPlan/store';
import { floorPlansApi } from '@/services/api/floor-plans.api';
import FloorPlanCanvas from './FloorPlanCanvas';

// ─── Zone type options ────────────────────────────────────────────────────────

const ZONE_TYPES = [
  'Room',
  'Office',
  'Lobby',
  'Corridor',
  'Storage',
  'Conference',
  'Restroom',
  'Utility',
];

// ─── Colour palette for auto-detected rooms ───────────────────────────────────

const ROOM_COLOR_PALETTE = [
  'bg-blue-200',
  'bg-green-200',
  'bg-yellow-200',
  'bg-purple-200',
  'bg-red-200',
  'bg-cyan-200',
  'bg-pink-200',
  'bg-lime-200',
];

const DOT_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-lime-500',
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface ZoneSetupStepProps {
  register: UseFormRegister<FilterFormValues>;
  control: Control<FilterFormValues>;
  onPrevious: () => void;
  onNext: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ZoneSetupStep: React.FC<ZoneSetupStepProps> = ({
  register,
  control,
  onPrevious,
  onNext,
}) => {
  const {
    zones,
    addZone,
    updateZone,
    setZones,
    selectedZoneId,
    setSelectedZoneId,
    zoomLevel,
    setZoomLevel,
    selectedFloor,
    floorPlanId,
    parsedGeometry: storedGeometry,
    setParsedGeometry,
  } = useFloorMapStore();

  // ── Fetch parsed geometry from backend (fallback if not already in store) ────
  // Primary source: Zustand store, populated by DwgImportStep when upload succeeds.
  // Fallback: fetch from API once (e.g. on page refresh).
  const {
    data: floorPlanResponse,
    isLoading: isLoadingFloorPlan,
    refetch,
  } = useQuery<AxiosResponse<ApiResponse<FloorPlan>>>({
    queryKey: ['floor-plan-geometry', floorPlanId],
    queryFn: async () => {
      if (!floorPlanId) throw new Error('Floor plan ID is missing');
      return floorPlansApi.getParsedDataByID(floorPlanId);
    },
    // Only fetch if we don't already have geometry from the upload response
    enabled: !!floorPlanId && !storedGeometry,
    // No polling — backend parses synchronously during upload
    staleTime: Infinity,
  });

  // Sync fetched geometry into the store when the query resolves
  useEffect(() => {
    const geo = floorPlanResponse?.data?.data?.parsedGeometry;
    if (geo) setParsedGeometry(geo);
  }, [floorPlanResponse, setParsedGeometry]);

  const floorPlan = floorPlanResponse?.data?.data;
  // Prefer store geometry (from upload), fall back to fetched geometry
  const parsedGeometry: ParsedGeometry | null =
    storedGeometry ?? floorPlan?.parsedGeometry ?? null;

  // ── Local state ────────────────────────────────────────────────────────────
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
  const stageRef = useRef<KonvaStage>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Sync parsedGeometry rooms → Zone store (auto-detect) ─────────────────
  useEffect(() => {
    if (!parsedGeometry?.rooms || parsedGeometry.rooms.length === 0) return;

    const transformedZones: Zone[] = parsedGeometry.rooms.map((room, idx) => {
      const boundaries = room.boundaries ?? [];
      const xs = boundaries.map((b) => b.x);
      const ys = boundaries.map((b) => b.y);
      const minX = xs.length ? Math.min(...xs) : 0;
      const minY = ys.length ? Math.min(...ys) : 0;
      const maxX = xs.length ? Math.max(...xs) : 0;
      const maxY = ys.length ? Math.max(...ys) : 0;

      return {
        id: `room-${room.id}`,
        name: room.name || 'Unnamed Room',
        type: 'Room',
        area: room.area || 0,
        capacity: 0,
        status: 'Active',
        floor: room.floor || selectedFloor,
        description: '',
        color: ROOM_COLOR_PALETTE[idx % ROOM_COLOR_PALETTE.length],
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY,
        isDefined: true,
        boundaries,
        sourceRoomId: room.id,
      };
    });

    // Only update if we got new rooms from backend (don't overwrite user edits)
    const existingSourceIds = new Set(
      zones.map((z) => z.sourceRoomId).filter(Boolean)
    );
    const newRooms = transformedZones.filter(
      (z) => !existingSourceIds.has(z.sourceRoomId)
    );
    if (newRooms.length > 0) {
      setZones([...zones, ...newRooms]);
    }
  }, [parsedGeometry, selectedFloor]); // intentionally NOT including zones/setZones

  // ── Floor tabs from parsedGeometry ────────────────────────────────────────
  const availableFloors = useMemo<string[]>(() => {
    if (parsedGeometry?.rooms && parsedGeometry.rooms.length > 0) {
      const floorOrder = [
        'ground',
        'Ground',
        '1st',
        '2nd',
        '3rd',
        '4th',
        '5th',
      ];
      return [
        ...new Set(
          parsedGeometry.rooms
            .map((r) => r.floor)
            .filter((f): f is string => typeof f === 'string' && f.length > 0)
        ),
      ].sort((a, b) => {
        const ia = floorOrder.indexOf(a);
        const ib = floorOrder.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });
    }
    return [selectedFloor];
  }, [parsedGeometry, selectedFloor]);

  useEffect(() => {
    if (
      availableFloors.length > 0 &&
      !availableFloors.includes(activeFloorTab)
    ) {
      setActiveFloorTab(availableFloors[0]);
    }
  }, [availableFloors, activeFloorTab]);

  // ── Derived data for current floor ───────────────────────────────────────
  const currentFloorZones = useMemo(
    () => zones.filter((z) => z.floor === activeFloorTab),
    [zones, activeFloorTab]
  );

  // Rooms from parsedGeometry for the active floor (passed to canvas for polygon rendering)
  const currentFloorParsedRooms = useMemo(
    () =>
      (parsedGeometry?.rooms ?? []).filter((r) => r.floor === activeFloorTab),
    [parsedGeometry, activeFloorTab]
  );

  const selectedZone =
    currentFloorZones.find((z) => z.id === selectedZoneId) ||
    currentFloorZones[0] ||
    null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleZoneClick = useCallback(
    (zoneId: string) => setSelectedZoneId(zoneId),
    [setSelectedZoneId]
  );

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 10, 200));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 10, 50));
  const handleFitToView = () => setZoomLevel(100);

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
    const scale = zoomLevel / 100;
    setSelectionPoints((prev) => [
      ...prev,
      { x: point.x / scale, y: point.y / scale },
    ]);
  };

  const handleFinishSelection = () => {
    if (selectionPoints.length < 2) return;
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
      area: Math.round(pendingZonePosition.w * pendingZonePosition.h),
      capacity: 0,
      status: 'Active',
      floor: activeFloorTab,
      description: '',
      color: 'bg-gray-200',
      x: pendingZonePosition.x,
      y: pendingZonePosition.y,
      w: pendingZonePosition.w,
      h: pendingZonePosition.h,
      isDefined: true,
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

  // ── Stats ─────────────────────────────────────────────────────────────────

  const totalZones = currentFloorZones.filter((z) => z.isDefined).length;
  const autoDetected = currentFloorZones.filter((z) => !!z.sourceRoomId).length;
  const manualZones = currentFloorZones.filter((z) => !z.sourceRoomId).length;

  // ── Guards ────────────────────────────────────────────────────────────────

  if (isLoadingFloorPlan) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">
          Loading floor plan data...
        </span>
      </div>
    );
  }

  if (!floorPlanId) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <AlertTriangle className="h-10 w-10 text-amber-500" />
        <p className="text-sm text-amber-700 font-medium">
          Floor plan ID is missing. Please go back and create a floor plan
          first.
        </p>
        <Button variant="outline" onClick={onPrevious}>
          Go Back
        </Button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── No geometry info note ──────────────────────────────────────────── */}
      {!parsedGeometry?.rooms?.length && !isLoadingFloorPlan && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <Eye className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">
              No rooms detected yet
            </p>
            <p className="text-xs text-blue-600">
              Go back and upload a DWG file to auto-detect rooms, or draw zones
              manually below.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-blue-700 hover:bg-blue-100"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* ── Left Panel – Floor Plan Editor ──────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Floor Plan Editor</h3>
              {floorPlan && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {floorPlan.name}
                  {parsedGeometry?.rooms?.length
                    ? ` · ${parsedGeometry.rooms.length} rooms detected`
                    : ''}
                </span>
              )}
            </div>

            {/* Floor Tabs */}
            {/* {availableFloors.length > 1 && (
              <Tabs
                value={activeFloorTab}
                onValueChange={setActiveFloorTab}
                className="mb-4"
              >
                <TabsList className="w-full">
                  {availableFloors.map((floor) => {
                    const roomsOnFloor = (parsedGeometry?.rooms ?? []).filter(
                      (r) => r.floor === floor
                    );
                    return (
                      <TabsTrigger
                        key={floor}
                        value={floor}
                        className="flex items-center gap-2 flex-1"
                      >
                        <Layers className="h-3 w-3" />
                        {floor}
                        {roomsOnFloor.length > 0 && (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            )} */}

            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Zoom: {zoomLevel}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                className="h-8 w-8 p-0"
                title="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="h-8 w-8 p-0"
                title="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFitToView}
                className="h-8"
              >
                <Maximize2 className="mr-1 h-3 w-3" />
                Fit
              </Button>
              <Button
                variant={isAddZoneMode ? 'default' : 'outline'}
                size="sm"
                onClick={handleAddZone}
                className={`h-8 ${isAddZoneMode ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Zone
              </Button>
            </div>

            {/* Drawing instructions */}
            {isAddZoneMode && (
              <div className="mb-2 rounded-md bg-blue-50 border border-blue-200 px-3 py-2 space-y-2">
                <p className="text-sm text-blue-700 font-medium">
                  {isDrawing
                    ? `Click points on the floor plan (${selectionPoints.length} point${selectionPoints.length !== 1 ? 's' : ''} selected). Click "Finish" when done.`
                    : 'Click "Add Zone" to start drawing.'}
                </p>
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

            {/* Canvas */}
            <div
              ref={containerRef}
              className="relative rounded-lg shadow-md border border-gray-200 bg-gray-50 overflow-auto max-h-[600px]"
            >
              <FloorPlanCanvas
                zones={currentFloorZones}
                selectedZoneId={selectedZoneId}
                zoomLevel={zoomLevel}
                dwgImageUrl={floorPlan?.imageUrl}
                parsedRooms={currentFloorParsedRooms}
                onZoneClick={handleZoneClick}
                onStageClick={handleStageClick}
                stageRef={stageRef as React.RefObject<KonvaStage>}
                isDrawing={isDrawing}
                selectionPoints={selectionPoints}
              />
            </div>
          </div>
        </div>

        {/* ── Right Panel – Zone Properties ───────────────────────────────── */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Zone Properties</h3>

          {/* Selected zone editor */}
          {selectedZone ? (
            <>
              {/* Info card */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      ROOM_COLOR_PALETTE[
                        currentFloorZones.indexOf(selectedZone) %
                          ROOM_COLOR_PALETTE.length
                      ]
                    } border border-gray-300`}
                  />
                  Selected Zone
                </h4>
                <div className="space-y-0.5 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">Name: </span>
                    {selectedZone.name}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Type: </span>
                    {selectedZone.type}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Area: </span>
                    {selectedZone.area.toFixed(1)} m²
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Floor: </span>
                    {selectedZone.floor}
                  </div>
                  {selectedZone.sourceRoomId && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      Auto-detected from DWG
                    </div>
                  )}
                </div>
              </div>

              {/* Edit card */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                <h4 className="text-sm font-semibold">Edit Zone</h4>

                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Zone Name
                  </label>
                  <Input
                    value={selectedZone.name}
                    onChange={(e) =>
                      updateZone(selectedZone.id, { name: e.target.value })
                    }
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Zone Type
                  </label>
                  <Select
                    value={selectedZone.type}
                    onValueChange={(value) =>
                      updateZone(selectedZone.id, { type: value })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ZONE_TYPES.map((t) => (
                        <SelectItem key={t} value={t} className="text-xs">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Description
                  </label>
                  <Textarea
                    value={selectedZone.description}
                    className="min-h-[70px] text-xs"
                    placeholder="Enter zone description…"
                    onChange={(e) =>
                      updateZone(selectedZone.id, {
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-muted-foreground">
              Click a room on the floor plan or select one from the list below.
            </div>
          )}

          {/* Zone list */}
          {currentFloorZones.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-2 bg-muted text-xs font-semibold text-muted-foreground border-b">
                Zones on this floor ({currentFloorZones.length})
              </div>
              <div className="divide-y max-h-[260px] overflow-y-auto">
                {currentFloorZones.map((zone, idx) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-left text-xs hover:bg-accent transition-colors ${
                      zone.id === selectedZoneId ? 'bg-accent' : ''
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                        DOT_COLORS[idx % DOT_COLORS.length]
                      }`}
                    />
                    <span className="flex-1 truncate font-medium">
                      {zone.name}
                    </span>
                    <span className="text-muted-foreground">{zone.type}</span>
                    {zone.sourceRoomId && (
                      <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-1 text-xs text-muted-foreground">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Floor Statistics
            </h4>
            <div>
              Total Zones:{' '}
              <span className="font-medium text-foreground">{totalZones}</span>
            </div>
            <div>
              Auto-detected:{' '}
              <span className="font-medium text-green-600">{autoDetected}</span>
            </div>
            <div>
              Manual:{' '}
              <span className="font-medium text-blue-600">{manualZones}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Actions ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-t pt-4">
        <Button variant="outline" type="button" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={currentFloorZones.length === 0}
        >
          Next
        </Button>
        {currentFloorZones.length === 0 && (
          <p className="text-xs text-amber-600 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            At least one zone is required to continue.
          </p>
        )}
      </div>

      {/* ── Add Zone Dialog ───────────────────────────────────────────────── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Zone</DialogTitle>
            <DialogDescription>
              Name and classify the area you selected on the floor plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-zone-name">Zone Name *</Label>
              <Input
                id="new-zone-name"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="e.g. Server Room"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newZoneName.trim())
                    handleCreateZone();
                }}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-zone-type">Zone Type *</Label>
              <Select value={newZoneType} onValueChange={setNewZoneType}>
                <SelectTrigger id="new-zone-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ZONE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
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
