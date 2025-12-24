import React, { useState, useRef, useEffect, useMemo } from 'react';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Plus,
  Layers,
  Eye,
  Package,
  X,
  AlertTriangle,
} from 'lucide-react';
import type { FilterFormValues, Zone, Device } from '@/features/floorPlan/types';
import { Stage, Layer, Rect, Text, Group, Line, Image as KonvaImage } from 'react-konva';
import type { Stage as KonvaStage } from 'konva/lib/Stage';
import { useFloorMapStore } from '@/features/floorPlan/store';

interface ZoneSetupStepProps {
  register: UseFormRegister<FilterFormValues>;
  control: Control<FilterFormValues>;
  onPrevious: () => void;
  onNext: () => void;
}

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

// Mock device library
const deviceLibrary: Device[] = [
  { id: 'device-1', name: 'Temperature Sensor', type: 'sensor', status: 'online' },
  { id: 'device-2', name: 'Motion Detector', type: 'sensor', status: 'online' },
  { id: 'device-3', name: 'Smart Light', type: 'actuator', status: 'online' },
  { id: 'device-4', name: 'Door Lock', type: 'actuator', status: 'online' },
  { id: 'device-5', name: 'Gateway', type: 'gateway', status: 'online' },
];

// Device Draggable Component
const DraggableDevice: React.FC<{ device: Device }> = ({ device }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'device',
    item: { device },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as unknown as React.RefObject<HTMLDivElement>}
      className={`flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg cursor-move hover:border-primary hover:shadow-sm transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ cursor: 'grab' }}
    >
      <Package className="h-4 w-4 text-primary" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{device.name}</p>
        <p className="text-xs text-muted-foreground">{device.type}</p>
      </div>
      <Badge variant={device.status === 'online' ? 'default' : 'secondary'} className="text-[10px]">
        {device.status}
      </Badge>
    </div>
  );
};

// Floor Plan Canvas with Drop Zone
const FloorPlanCanvas: React.FC<{
  zones: Zone[];
  selectedZoneId: string | null;
  zoomLevel: number;
  dwgImageUrl?: string;
  dwgFile?: File;
  onZoneClick: (zoneId: string) => void;
  onStageClick: () => void;
  onDeviceDrop: (device: Device, x: number, y: number) => void;
  stageRef: React.RefObject<KonvaStage>;
  isDrawing: boolean;
  selectionPoints: Array<{ x: number; y: number }>;
  onDwgError?: (hasError: boolean) => void;
}> = ({
  zones,
  selectedZoneId,
  zoomLevel,
  dwgImageUrl,
  dwgFile,
  onZoneClick,
  onStageClick,
  onDeviceDrop,
  stageRef,
  isDrawing,
  selectionPoints,
  onDwgError,
}) => {
  const [dwgImage, setDwgImage] = useState<HTMLImageElement | null>(null);
  const [dwgError, setDwgError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stageWidth = 800;
  const stageHeight = 500;
  const scaledWidth = (stageWidth * zoomLevel) / 100;
  const scaledHeight = (stageHeight * zoomLevel) / 100;

  // Parse and render DWG/DXF file
  useEffect(() => {
    const parseAndRenderDWG = async () => {
      if (!dwgFile && !dwgImageUrl) {
        setDwgImage(null);
        setDwgError(false);
        onDwgError?.(false);
        return;
      }

      try {
        setDwgError(false);
        
        // If we have a file, parse it
        if (dwgFile) {
          console.log('Parsing DWG file:', dwgFile.name);
          const { EnhancedCADParser } = await import('@/features/floorPlan/services/EnhancedCADParser');
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let dxf: { entities?: any[]; header?: any; layers?: any; tables?: any; blocks?: any };
          try {
            if (dwgFile.name.toLowerCase().endsWith('.dxf')) {
              console.log('Parsing as DXF...');
              const result = await EnhancedCADParser.parseDXF(dwgFile);
              dxf = result.dxf;
              console.log('DXF parsed successfully:', dxf);
            } else if (dwgFile.name.toLowerCase().endsWith('.dwg')) {
              console.log('Parsing as DWG...');
              const result = await EnhancedCADParser.parseDWG(dwgFile);
              dxf = result.dxf;
              console.log('DWG parsed successfully:', dxf);
            } else {
              throw new Error('Unsupported file format');
            }

            // Wait for canvas to be ready
            if (canvasRef.current) {
              console.log('Rendering to canvas, size:', scaledWidth, 'x', scaledHeight);
              const canvas = canvasRef.current;
              
              // Make canvas temporarily visible for getBoundingClientRect to work
              const originalDisplay = canvas.style.display;
              canvas.style.display = 'block';
              canvas.style.width = scaledWidth + 'px';
              canvas.style.height = scaledHeight + 'px';
              
              // Force a reflow to ensure dimensions are set
              canvas.offsetHeight;
              
              // Render the DXF to canvas (this will use getBoundingClientRect)
              try {
                EnhancedCADParser.renderDXFToCanvas(dxf, canvas);
                console.log('DXF rendered to canvas');
                
                // Hide canvas again
                canvas.style.display = originalDisplay || 'none';
                
                // Convert canvas to image
                const img = new Image();
                img.onload = () => {
                  console.log('DWG image loaded successfully, dimensions:', img.width, 'x', img.height);
                  setDwgImage(img);
                  setDwgError(false);
                  onDwgError?.(false);
                };
                img.onerror = (error) => {
                  console.error('Error loading image from canvas:', error);
                  setDwgError(true);
                  onDwgError?.(true);
                };
                const dataUrl = canvas.toDataURL('image/png');
                console.log('Canvas data URL generated, length:', dataUrl.length);
                if (dataUrl.length < 100) {
                  console.warn('Canvas data URL is very short, might be empty');
                }
                img.src = dataUrl;
              } catch (renderError) {
                console.error('Error rendering DXF to canvas:', renderError);
                canvas.style.display = originalDisplay || 'none';
                setDwgError(true);
                onDwgError?.(true);
              }
            } else {
              console.error('Canvas ref is not available');
              setDwgError(true);
              onDwgError?.(true);
            }
          } catch (error) {
            console.error('Error parsing DWG/DXF:', error);
            setDwgError(true);
            onDwgError?.(true);
          }
        } else if (dwgImageUrl) {
          // Fallback to image loading for non-DWG files
          console.log('Loading image from URL:', dwgImageUrl);
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            console.log('Image loaded from URL');
            setDwgImage(img);
            setDwgError(false);
            onDwgError?.(false);
          };
          img.onerror = (error) => {
            console.error('Error loading image from URL:', error);
            setDwgImage(null);
            setDwgError(true);
            onDwgError?.(true);
          };
          img.src = dwgImageUrl;
        }
      } catch (error) {
        console.error('Error loading DWG file:', error);
        setDwgError(true);
        onDwgError?.(true);
      }
    };

    parseAndRenderDWG();
  }, [dwgFile, dwgImageUrl, onDwgError, scaledWidth, scaledHeight]);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'device',
    drop: (item: { device: Device }) => {
      if (stageRef.current) {
        const stage = stageRef.current;
        const point = stage.getPointerPosition();
        if (point) {
          const scale = zoomLevel / 100;
          const x = point.x / scale;
          const y = point.y / scale;
          onDeviceDrop(item.device, x, y);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={dropRef as unknown as React.RefObject<HTMLDivElement>} className="relative">
      {/* Hidden canvas for DWG rendering */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', visibility: 'hidden', width: scaledWidth, height: scaledHeight }}
      />
      <Stage
        ref={stageRef}
        width={scaledWidth}
        height={scaledHeight}
        onClick={onStageClick}
        style={{ cursor: isDrawing ? 'crosshair' : isOver ? 'copy' : 'default' }}
      >
        <Layer>
          {/* DWG Background Image or Placeholder */}
          {dwgImage ? (
            <KonvaImage
              image={dwgImage}
              x={0}
              y={0}
              width={scaledWidth}
              height={scaledHeight}
              opacity={0.7}
            />
          ) : dwgError ? (
            // Placeholder for DWG files that can't be displayed as images
            <Group>
              <Rect
                x={0}
                y={0}
                width={scaledWidth}
                height={scaledHeight}
                fill="#F3F4F6"
                stroke="#D1D5DB"
                strokeWidth={2}
                dash={[5, 5]}
              />
              <Text
                x={scaledWidth / 2}
                y={scaledHeight / 2 - 20}
                text="DWG File Loaded"
                fontSize={16}
                fontStyle="bold"
                fill="#6B7280"
                align="center"
                verticalAlign="middle"
                offsetX={60}
                offsetY={8}
              />
              <Text
                x={scaledWidth / 2}
                y={scaledHeight / 2 + 10}
                text="(DWG files require conversion to image format for preview)"
                fontSize={12}
                fill="#9CA3AF"
                align="center"
                verticalAlign="middle"
                offsetX={150}
                offsetY={6}
              />
            </Group>
          ) : null}

          {/* Existing Zones */}
          {zones.map((zone) => {
            const isSelected = zone.id === selectedZoneId;
            const zoneColor = getZoneColor(zone.type);

            return (
              <Group
                key={zone.id}
                onClick={() => onZoneClick(zone.id)}
                onTap={() => onZoneClick(zone.id)}
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
                  points={selectionPoints.flatMap((p) => [p.x, p.y])}
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

          {/* Drop indicator */}
          {isOver && (
            <Rect
              x={0}
              y={0}
              width={scaledWidth}
              height={scaledHeight}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3B82F6"
              strokeWidth={2}
              dash={[10, 5]}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

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
    assignedDevices,
    assignDeviceToRoom,
  } = useFloorMapStore();

  // Local state
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
  const [activeFloorTab, setActiveFloorTab] = useState(selectedFloor);
  const [showDeviceLibrary, setShowDeviceLibrary] = useState(true);
  const [dwgError, setDwgError] = useState(false);
  const stageRef = useRef<KonvaStage>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current floor's DWG file
  const currentDwgFile = useMemo(() => {
    return uploadedFiles.find((f) => f.floor === activeFloorTab && f.status === 'completed');
  }, [uploadedFiles, activeFloorTab]);

  const dwgImageUrl = currentDwgFile?.previewUrl;
  const dwgFile = currentDwgFile?.file;

  // Get zones for current floor
  const currentFloorZones = useMemo(() => {
    return zones.filter((z) => z.floor === activeFloorTab);
  }, [zones, activeFloorTab]);

  const selectedZone = currentFloorZones.find((z) => z.id === selectedZoneId) || currentFloorZones[0];

  // Get available floors from uploaded files
  const availableFloors = useMemo(() => {
    const floors = uploadedFiles
      .filter((f) => f.status === 'completed')
      .map((f) => f.floor)
      .filter((floor, index, self) => self.indexOf(floor) === index);
    return floors.length > 0 ? floors : [selectedFloor];
  }, [uploadedFiles, selectedFloor]);

  useEffect(() => {
    if (availableFloors.length > 0 && !availableFloors.includes(activeFloorTab)) {
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
      area: 0,
      capacity: 0,
      status: 'Draft',
      floor: activeFloorTab,
      description: '',
      color: 'bg-gray-200',
      x: pendingZonePosition.x,
      y: pendingZonePosition.y,
      w: pendingZonePosition.w,
      h: pendingZonePosition.h,
      isDefined: false,
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

  const handleDeviceDrop = (device: Device, x: number, y: number) => {
    // Find which zone the device was dropped in
    const targetZone = currentFloorZones.find(
      (zone) => x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h
    );

    if (targetZone) {
      assignDeviceToRoom(device.id, targetZone.id);
    }
  };

  const totalZones = currentFloorZones.filter((z) => z.isDefined).length;
  const totalArea = currentFloorZones.reduce((sum, z) => sum + z.area, 0);
  const definedArea = currentFloorZones
    .filter((z) => z.isDefined)
    .reduce((sum, z) => sum + z.area, 0);
  const coverage = totalArea > 0 ? (definedArea / totalArea) * 100 : 0;
  const undefinedArea = 100 - coverage;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className={`grid gap-6 ${showDeviceLibrary ? 'lg:grid-cols-[1fr_3fr_1fr]' : 'lg:grid-cols-[1.2fr_1fr]'}`}>
          {/* Device Library Sidebar */}
          {showDeviceLibrary && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Device Library
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeviceLibrary(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {deviceLibrary.map((device) => (
                    <DraggableDevice key={device.id} device={device} />
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground text-center">
                  Drag devices onto the floor plan
                </div>
              </div>
            </div>
          )}

          {/* Left Panel - Floor Plan Editor */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Floor Plan Editor</h3>
                {!showDeviceLibrary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeviceLibrary(true)}
                    className="h-8"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Show Devices
                  </Button>
                )}
              </div>

              {/* Floor Tabs */}
              {availableFloors.length > 1 && (
                <Tabs value={activeFloorTab} onValueChange={setActiveFloorTab} defaultValue={activeFloorTab} className="mb-4">
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${availableFloors.length}, 1fr)`, width: '100%' }}>
                    <TabsList className="w-full">
                      {availableFloors.map((floor) => (
                        <TabsTrigger key={floor} value={floor} className="flex items-center gap-2">
                          <Layers className="h-3 w-3" />
                          {floor}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </Tabs>
              )}

              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Zoom: {zoomLevel}%</span>
                <Button variant="outline" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="default" size="sm" onClick={handleFitToView} className="h-8">
                  <Maximize2 className="mr-1 h-3 w-3" />
                  Fit to View
                </Button>
                <Button variant="outline" size="sm" onClick={handleAutoDetect} className="h-8">
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
                      <Button variant="outline" size="sm" onClick={handleCancelSelection} className="h-8">
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
                  onDeviceDrop={handleDeviceDrop}
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
                  No DWG file found for {activeFloorTab} floor. Upload a file in the DWG Import step.
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
                        <label className="mb-1 block text-xs text-muted-foreground">Zone Name:</label>
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
                                updateZone(selectedZone.id, { name: e.target.value });
                              }}
                              className="h-8 text-xs"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Zone Type:</label>
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
                        <label className="mb-1 block text-xs text-muted-foreground">Description:</label>
                        <Textarea
                          {...register('zoneDescription')}
                          defaultValue={selectedZone.description}
                          className="min-h-[80px] text-xs"
                          placeholder="Enter zone description..."
                          onChange={(e) => {
                            updateZone(selectedZone.id, { description: e.target.value });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Devices in Zone */}
                  {assignedDevices[selectedZone.id] && assignedDevices[selectedZone.id].length > 0 && (
                    <div className="mb-4 space-y-2 rounded-lg shadow border border-gray-200 bg-white p-4">
                      <h4 className="text-sm font-semibold">Devices in Zone</h4>
                      <div className="space-y-1">
                        {assignedDevices[selectedZone.id].map((device) => (
                          <div key={device.id} className="text-xs text-muted-foreground flex items-center gap-2">
                            <Package className="h-3 w-3" />
                            {device.name || device.id}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
    </DndProvider>
  );
};
