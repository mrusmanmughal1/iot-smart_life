import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  Layers,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
} from 'lucide-react';
import {
  Stage,
  Layer,
  Rect,
  Text,
  Group,
  Image as KonvaImage,
} from 'react-konva';
import type { Stage as KonvaStage } from 'konva/lib/Stage';
import type {
  FilterFormValues,
  Device,
  Zone,
} from '@/features/floorPlan/types';
import { useFloorMapStore } from '@/features/floorPlan/store';
import { LoadingOverlay } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useDevices } from '@/features/devices/hooks';
import type { Device as ApiDevice } from '@/services/api/devices.api';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragableDevies from './DragableDevies';

interface DeviceLinkStepProps {
  register: UseFormRegister<FilterFormValues>;
  control: Control<FilterFormValues>;
  onPrevious: () => void;
  onNext: () => void;
}

// Transform API Device to floorPlan Device format
const transformDevice = (apiDevice: ApiDevice): Device => {
  // Map API DeviceStatus enum to floorPlan Device status
  const mapStatus = (
    status: string | number
  ): 'online' | 'offline' | 'idle' | 'error' => {
    const statusStr = String(status).toLowerCase();
    if (statusStr === 'online' || statusStr === 'active') return 'online';
    if (statusStr === 'offline' || statusStr === 'inactive') return 'offline';
    if (statusStr === 'idle' || statusStr === 'standby') return 'idle';
    if (
      statusStr === 'error' ||
      statusStr === 'maintenance' ||
      statusStr === 'warning'
    )
      return 'error';
    return 'offline'; // Default
  };

  // Map API DeviceType enum to string
  const mapType = (type: string | number): string => {
    const typeStr = String(type).toLowerCase();
    return typeStr || 'sensor';
  };

  return {
    id: apiDevice.id,
    name: apiDevice.name,
    type: mapType(apiDevice.type),
    status: mapStatus(apiDevice.status),
    assignedTo: undefined, // Will be set when device is assigned to a zone
  };
};
// Helper function to get zone color
const getZoneColor = (type: string): string => {
  const colors: Record<string, string> = {
    Room: '#3B82F6',
    Office: '#10B981',
    Lobby: '#F59E0B',
    Corridor: '#8B5CF6',
    Storage: '#EF4444',
  };
  return colors[type] || '#E5E7EB';
};
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'offline':
      return 'bg-red-500';
    case 'idle':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

// Floor Plan Canvas Component
const FloorPlanCanvas: React.FC<{
  zones: Zone[];
  selectedZoneId: string | null;
  zoomLevel: number;
  dwgImageUrl?: string;
  dwgFile?: File;
  assignedDevices: Record<string, Device[]>;
  onZoneClick: (zoneId: string) => void;
  stageRef: React.RefObject<KonvaStage>;
  onDwgError?: (hasError: boolean) => void;
}> = ({
  zones,
  selectedZoneId,
  zoomLevel,
  dwgImageUrl,
  dwgFile,
  assignedDevices,
  onZoneClick,
  stageRef,
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

        if (dwgFile) {
          console.log('Parsing DWG file:', dwgFile.name);
          const { EnhancedCADParser } = await import(
            '@/features/floorPlan/services/EnhancedCADParser'
          );

          let dxf: {
            entities?: unknown[];
            header?: unknown;
            layers?: unknown;
            tables?: unknown;
            blocks?: unknown;
          };
          try {
            if (dwgFile.name.toLowerCase().endsWith('.dxf')) {
              const result = await EnhancedCADParser.parseDXF(dwgFile);
              dxf = result.dxf;
            } else if (dwgFile.name.toLowerCase().endsWith('.dwg')) {
              const result = await EnhancedCADParser.parseDWG(dwgFile);
              dxf = result.dxf;
            } else {
              throw new Error('Unsupported file format');
            }

            if (canvasRef.current) {
              const canvas = canvasRef.current;
              const originalDisplay = canvas.style.display;
              canvas.style.display = 'block';
              canvas.style.width = scaledWidth + 'px';
              canvas.style.height = scaledHeight + 'px';
              void canvas.offsetHeight;

              try {
                EnhancedCADParser.renderDXFToCanvas(dxf, canvas);
                canvas.style.display = originalDisplay || 'none';

                const img = new Image();
                img.onload = () => {
                  setDwgImage(img);
                  setDwgError(false);
                  onDwgError?.(false);
                };
                img.onerror = () => {
                  setDwgError(true);
                  onDwgError?.(true);
                };
                const dataUrl = canvas.toDataURL('image/png');
                img.src = dataUrl;
              } catch (renderError) {
                console.error('Error rendering DXF to canvas:', renderError);
                canvas.style.display = originalDisplay || 'none';
                setDwgError(true);
                onDwgError?.(true);
              }
            }
          } catch (error) {
            console.error('Error parsing DWG/DXF:', error);
            setDwgError(true);
            onDwgError?.(true);
          }
        } else if (dwgImageUrl) {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            setDwgImage(img);
            setDwgError(false);
            onDwgError?.(false);
          };
          img.onerror = () => {
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


  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          width: scaledWidth,
          height: scaledHeight,
        }}
      />
      <Stage
        ref={stageRef}
        width={scaledWidth}
        height={scaledHeight}
        style={{ cursor: 'default' }}
      >
          <Layer>
            {/* DWG Background Image */}
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
                  y={scaledHeight / 2}
                  text="DWG File Loaded"
                  fontSize={16}
                  fontStyle="bold"
                  fill="#6B7280"
                  align="center"
                  verticalAlign="middle"
                  offsetX={60}
                  offsetY={8}
                />
              </Group>
            ) : null}

            {/* Zones */}
            {zones.map((zone) => {
              const isSelected = zone.id === selectedZoneId;
              const zoneColor = getZoneColor(zone.type);
              const zoneDevices = assignedDevices[zone.id] || [];

              return (
                <Group
                  key={zone.id}
                  x={zone.x}
                  y={zone.y}
                  onClick={() => onZoneClick(zone.id)}
                  onTap={() => onZoneClick(zone.id)}
                >
                  {/* Zone Rectangle */}
                  <Rect
                    width={zone.w}
                    height={zone.h}
                    fill={zoneColor}
                    opacity={isSelected ? 0.4 : 0.2}
                    stroke={isSelected ? '#3B82F6' : zoneColor}
                    strokeWidth={isSelected ? 3 : 2}
                    dash={isSelected ? [] : [5, 5]}
                    cornerRadius={8}
                  />
                  {/* Zone Title Overlay */}
                  <Rect
                    x={zone.w / 2 - 60}
                    y={zone.h / 2 - 12}
                    width={120}
                    height={24}
                    fill="rgba(255, 255, 255, 0.95)"
                    cornerRadius={4}
                    shadowBlur={4}
                    shadowColor="rgba(0, 0, 0, 0.1)"
                  />
                  <Text
                    x={zone.w / 2}
                    y={zone.h / 2}
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
                        x={0}
                        y={zone.h - 20}
                        width={zone.w}
                        height={20}
                        fill="rgba(0, 0, 0, 0.6)"
                        cornerRadius={[0, 0, 8, 8]}
                      />
                      <Text
                        x={zone.w / 2}
                        y={zone.h - 10}
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
                  {/* Device Indicators */}
                  {zoneDevices.length > 0 && (
                    <Group x={10} y={zone.h - (isSelected ? 50 : 30)}>
                      {zoneDevices
                        .filter((device) => device && device.name)
                        .map((device, index) => (
                          <Group key={device.id} x={index * 20} y={0}>
                            <Rect
                              width={15}
                              height={15}
                              fill={getStatusColor(device.status || 'offline')}
                              cornerRadius={2}
                            />
                            <Text
                              x={7.5}
                              y={7.5}
                              text={device.name?.charAt(0)?.toUpperCase() || '?'}
                              fontSize={8}
                              fill="white"
                              align="center"
                              verticalAlign="middle"
                              offsetX={3}
                              offsetY={4}
                            />
                          </Group>
                        ))}
                    </Group>
                  )}
                </Group>
              );
            })}
          </Layer>
        </Stage>
    </div>
  );
};

export const DeviceLinkStep: React.FC<DeviceLinkStepProps> = ({
  control,
  onPrevious,
  onNext,
}) => {
  // Get data from Zustand store
  const {
    zones,
    uploadedFiles,
    selectedFloor,
    assignedDevices,
    assignDeviceToRoom,
    unassignDeviceFromRoom,
    devicePositions: storeDevicePositions,
    setDevicePosition,
    removeDevicePosition,
  } = useFloorMapStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [activeFloorTab, setActiveFloorTab] = useState(selectedFloor);
  const [dwgError, setDwgError] = useState(false);
  const stageRef = useRef<KonvaStage>(null);
  const zoomLevel = 100;

  // Get devices from API
  const { data: devicesData, isLoading, isError } = useDevices();
  // Handle nested API response structure: response.data.data.data
  const apiDevices = useMemo(() => {
    const apiResponse = devicesData?.data as unknown as {
      data?: { data?: ApiDevice[] };
    };
    return apiResponse?.data?.data || [];
  }, [devicesData]);

  // Transform API devices to floorPlan Device format and update assignedTo from store
  const availableDevices = useMemo(() => {
    const transformed = apiDevices.map(transformDevice);

    // Update assignedTo status for devices that are assigned to zones
    return transformed.map((device) => {
      // Check if device is assigned to any zone
      const assignedZoneId = Object.keys(assignedDevices).find((zoneId) =>
        assignedDevices[zoneId].some((d) => d.id === device.id)
      );
      return {
        ...device,
        assignedTo: assignedZoneId || device.assignedTo,
      };
    });
  }, [apiDevices, assignedDevices]);

  // Get available floors from uploaded files
  const availableFloors = useMemo(() => {
    const floors = uploadedFiles
      .map((f) => f.floor)
      .filter((floor, index, self) => self.indexOf(floor) === index)
      .sort((a, b) => {
        const floorOrder = ['Ground', '1st', '2nd', '3rd', '4th', '5th'];
        const indexA = floorOrder.indexOf(a);
        const indexB = floorOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    return floors.length > 0 ? floors : [selectedFloor];
  }, [uploadedFiles, selectedFloor]);

  // Get current floor's DWG file
  const currentDwgFile = useMemo(() => {
    return uploadedFiles.find(
      (f) => f.floor === activeFloorTab && f.status === 'completed'
    );
  }, [uploadedFiles, activeFloorTab]);

  const dwgImageUrl = currentDwgFile?.previewUrl;
  const dwgFile = currentDwgFile?.file;

  // Get zones for current floor (show all zones, not just defined ones)
  const currentFloorZones = useMemo(() => {
    return zones.filter((z) => z.floor === activeFloorTab);
  }, [zones, activeFloorTab]);

  const filteredDevices = useMemo(() => {
    return availableDevices.filter((device) => {
      const matchesSearch =
        !searchQuery ||
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        filterType === 'all' ||
        device.type.toLowerCase().includes(filterType.toLowerCase());

      return matchesSearch && matchesType;
    });
  }, [availableDevices, searchQuery, filterType]);

  const handleDragStart = (e: React.DragEvent, device: Device) => {
    e.dataTransfer.effectAllowed = 'move';
    // Set data as JSON string
    const deviceJson = JSON.stringify(device);
    e.dataTransfer.setData('application/json', deviceJson);
    // Also set as text/plain as fallback
    e.dataTransfer.setData('text/plain', deviceJson);
    console.log('Drag started with device:', device, 'JSON:', deviceJson);
  };

  // Use device positions from store instead of local state
  const devicePositions = storeDevicePositions;

  // Filter device positions by current floor
  const currentFloorDevicePositions = useMemo(() => {
    const filtered: Record<string, { x: number; y: number; zoneId: string | null; floor: string }> = {};
    Object.entries(devicePositions).forEach(([deviceId, position]) => {
      if (position.floor === activeFloorTab) {
        filtered[deviceId] = position;
      }
    });
    return filtered;
  }, [devicePositions, activeFloorTab]);

  // Debug: Log device positions when they change
  useEffect(() => {
    if (Object.keys(devicePositions).length > 0) {
      console.log('Device positions:', devicePositions);
      console.log('Available devices:', availableDevices.map(d => ({ id: d.id, name: d.name })));
      console.log('Current floor zones:', currentFloorZones.map(z => ({ id: z.id, name: z.name })));
    }
  }, [devicePositions, availableDevices, currentFloorZones]);

  const handleZoneDrop = (
    zoneId: string | null,
    device: Device,
    dropX?: number,
    dropY?: number
  ) => {
    // Remove from previous assignment if device was assigned to a zone
    if (device.assignedTo && zoneId) {
      unassignDeviceFromRoom(device.id, device.assignedTo);
    }
    
    // If dropped on a zone, assign to that zone
    if (zoneId) {
      assignDeviceToRoom(device, zoneId);
    } else if (device.assignedTo) {
      // If dropped outside any zone but was previously assigned, unassign it
      unassignDeviceFromRoom(device.id, device.assignedTo);
    }
    
    // Store device position if drop coordinates are provided
    if (dropX !== undefined && dropY !== undefined) {
      setDevicePosition(device.id, { x: dropX, y: dropY, zoneId: zoneId || null, floor: activeFloorTab });
    }
  };

  const handleRemoveDevice = (deviceId: string, zoneId: string) => {
    // Unassign from zone (this will update the store, and availableDevices will update via useMemo)
    unassignDeviceFromRoom(deviceId, zoneId);
    // Remove device position when unassigned
    removeDevicePosition(deviceId);
  };

  const handleDeleteDevice = (deviceId: string) => {
    // Remove device from any zone assignment
    const position = devicePositions[deviceId];
    if (position?.zoneId) {
      unassignDeviceFromRoom(deviceId, position.zoneId);
    }
    
    // Remove device position
    removeDevicePosition(deviceId);
  };

  const handleRepositionDevice = (e: React.DragEvent, deviceId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    // Mark this as a reposition drag (not a new device)
    e.dataTransfer.setData('application/json', JSON.stringify({ 
      type: 'reposition', 
      deviceId 
    }));
    e.dataTransfer.setData('text/plain', JSON.stringify({ 
      type: 'reposition', 
      deviceId 
    }));
  };

  const selectedZone = currentFloorZones.find((z) => z.id === selectedZoneId);

  if (isLoading) return <LoadingOverlay />;
  if (isError)
    return (
      <ErrorMessage
        title="Error loading devices"
        error={
          typeof isError === 'object' &&
          isError !== null &&
          'message' in isError
            ? (isError as Error)
            : new Error('Failed to load devices')
        }
        onRetry={() => window.location.reload()}
      />
    );
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Link Devices to Zones</h2>
        <p className="text-sm text-muted-foreground">
          Drag and drop devices from the list onto zones on the floor plan to
          assign them.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left Column - Floor Plan with Zones */}
        <DndProvider backend={HTML5Backend}>
          <div className="space-y-4">
            <h3 className="mb-3 text-lg font-semibold">Floor Plan View</h3>
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
                      const floorFiles = uploadedFiles.filter(
                        (f) => f.floor === floor
                      );
                      const hasCompletedFile = floorFiles.some(
                        (f) => f.status === 'completed'
                      );
                      const isUploading = floorFiles.some(
                        (f) => f.status === 'uploading'
                      );

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
             {/* Canvas Container - handles drops anywhere on canvas */}
             <div 
               className="relative rounded-lg shadow-md border border-gray-200 bg-gray-50 overflow-auto max-h-[600px]"
               onDragOver={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 e.dataTransfer.dropEffect = 'move';
               }}
               onDrop={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 
                 // Try to get data from application/json first, then text/plain as fallback
                 let deviceData = e.dataTransfer.getData('application/json');
                 if (!deviceData || deviceData === '[object Object]') {
                   deviceData = e.dataTransfer.getData('text/plain');
                 }
                 
                 if (deviceData && deviceData !== '[object Object]') {
                   try {
                     const parsed = JSON.parse(deviceData);
                     
                     // Get drop position relative to the container
                     const container = e.currentTarget;
                     const rect = container.getBoundingClientRect();
                     const dropX = e.clientX - rect.left;
                     const dropY = e.clientY - rect.top;
                     
                     // Check if this is a reposition drag
                     if (parsed.type === 'reposition' && parsed.deviceId) {
                       // Reposition existing device
                       const device = availableDevices.find((d) => d.id === parsed.deviceId);
                       if (device) {
                         // Check if drop is within any zone
                         let droppedZoneId: string | null = null;
                         for (const zone of currentFloorZones) {
                           if (
                             dropX >= zone.x &&
                             dropX <= zone.x + zone.w &&
                             dropY >= zone.y &&
                             dropY <= zone.y + zone.h
                           ) {
                             droppedZoneId = zone.id;
                             break;
                           }
                         }
                         
                         // Update position and zone assignment
                         const currentPosition = devicePositions[parsed.deviceId];
                         
                         // If zone changed, update assignment
                         if (droppedZoneId && currentPosition?.zoneId !== droppedZoneId) {
                           // Remove from old zone
                           if (currentPosition?.zoneId) {
                             unassignDeviceFromRoom(parsed.deviceId, currentPosition.zoneId);
                           }
                           // Add to new zone
                           if (droppedZoneId) {
                             assignDeviceToRoom(device, droppedZoneId);
                           }
                         } else if (!droppedZoneId && currentPosition?.zoneId) {
                           // Removed from zone
                           unassignDeviceFromRoom(parsed.deviceId, currentPosition.zoneId);
                         }
                         
                         // Update position
                         setDevicePosition(parsed.deviceId, { x: dropX, y: dropY, zoneId: droppedZoneId, floor: activeFloorTab });
                       }
                     } else {
                       // New device drop
                       const device = parsed as Device;
                       
                       // Check if drop is within any zone
                       let droppedZoneId: string | null = null;
                       for (const zone of currentFloorZones) {
                         if (
                           dropX >= zone.x &&
                           dropX <= zone.x + zone.w &&
                           dropY >= zone.y &&
                           dropY <= zone.y + zone.h
                         ) {
                           droppedZoneId = zone.id;
                           break;
                         }
                       }
                       
                       handleZoneDrop(droppedZoneId, device, dropX, dropY);
                     }
                   } catch (error) {
                     console.error('Error parsing device data:', error, 'Raw data:', deviceData);
                   }
                 } else {
                   console.error('Invalid device data received:', deviceData);
                 }
               }}
             >
               <FloorPlanCanvas
                 zones={currentFloorZones}
                 selectedZoneId={selectedZoneId}
                 zoomLevel={zoomLevel}
                 dwgImageUrl={dwgImageUrl}
                 dwgFile={dwgFile}
                 assignedDevices={assignedDevices}
                 onZoneClick={setSelectedZoneId}
                 stageRef={stageRef as React.RefObject<KonvaStage>}
                 onDwgError={setDwgError}
               />
               {/* Drop Zones Overlay - positioned over Konva zones for visual feedback only */}
               {currentFloorZones.map((zone) => {
                 return (
                   <div
                     key={`drop-${zone.id}`}
                     data-zone-id={zone.id}
                     style={{
                       position: 'absolute',
                       left: `${zone.x}px`,
                       top: `${zone.y}px`,
                       width: `${zone.w}px`,
                       height: `${zone.h}px`,
                       pointerEvents: 'none', // Changed to none so parent container handles drops
                       zIndex: 10,
                       borderRadius: '8px',
                     }}
                     className="transition-colors"
                     onDragEnter={(e) => {
                       e.preventDefault();
                       e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                       e.currentTarget.style.border = '2px dashed #3B82F6';
                     }}
                     onDragLeave={(e) => {
                       e.preventDefault();
                       e.currentTarget.style.backgroundColor = '';
                       e.currentTarget.style.border = '';
                     }}
                   />
                 );
               })}
               {/* Device Name Labels - displayed where devices are dropped (anywhere on canvas) */}
               {Object.entries(currentFloorDevicePositions).map(([deviceId, position]) => {
                 // Get the device object
                 const device = availableDevices.find((d) => d.id === deviceId);
                 if (!device) return null;

                 // Check if device is in a zone (for styling)
                 const isInZone = position.zoneId !== null;
                 const zone = isInZone ? currentFloorZones.find((z) => z.id === position.zoneId) : null;

                 return (
                   <div
                     key={`device-label-${deviceId}`}
                     className="group"
                     style={{
                       position: 'absolute',
                       left: `${position.x}px`,
                       top: `${position.y}px`,
                       transform: 'translate(-50%, -50%)',
                       pointerEvents: 'auto',
                       zIndex: 30,
                     }}
                   >
                     <div
                       draggable={true}
                       onDragStart={(e) => {
                         e.stopPropagation();
                         handleRepositionDevice(e, deviceId);
                       }}
                       style={{
                         backgroundColor: isInZone ? '#ffffff' : '#f0f9ff',
                         padding: '6px 10px',
                         borderRadius: '6px',
                         boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                         border: isInZone ? '1px solid #d1d5db' : '1px solid #3b82f6',
                         fontSize: '12px',
                         fontWeight: '600',
                         color: '#111827',
                         whiteSpace: 'nowrap',
                         cursor: 'move',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '6px',
                         userSelect: 'none',
                       }}
                       title={isInZone ? `In zone: ${zone?.name || 'Unknown'}` : 'Not assigned to any zone. Drag to move.'}
                     >
                       <span>{device.name}</span>
                       {isInZone && (
                         <span className="text-xs text-gray-500">
                           ({zone?.name})
                         </span>
                       )}
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           handleDeleteDevice(deviceId);
                         }}
                         onMouseDown={(e) => {
                           // Prevent drag when clicking delete button
                           e.stopPropagation();
                         }}
                         className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-0.5 hover:bg-red-100 rounded text-red-600 hover:text-red-700"
                         title="Delete device"
                         style={{
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           cursor: 'pointer',
                         }}
                       >
                         <X className="h-3 w-3" />
                       </button>
                     </div>
                   </div>
                 );
               })}
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
            {/* Selected Zone Info */}
            {selectedZone && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold mb-2">
                    Selected Zone: {selectedZone.name}
                  </h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Type: {selectedZone.type}</div>
                    <div>Area: {selectedZone.area} m²</div>
                    <div>
                      Devices: {assignedDevices[selectedZone.id]?.length || 0}
                    </div>
                  </div>
                  {assignedDevices[selectedZone.id]?.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {assignedDevices[selectedZone.id].map((device) => (
                        <div
                          key={device.id}
                          className="flex items-center justify-between text-xs bg-white rounded p-2"
                        >
                          <span>{device.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-2 text-xs"
                            onClick={() =>
                              handleRemoveDevice(device.id, selectedZone.id)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Available Devices */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Available Devices</h3>
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search devices.."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      value={filterType}
                      onValueChange={(value) => {
                        setFilterType(value);
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="gateway">Gateway</SelectItem>
                        <SelectItem value="sensor">Sensor</SelectItem>
                        <SelectItem value="temperature">Temperature</SelectItem>
                        <SelectItem value="humidity">Humidity</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredDevices.map((device) => (
                  <DragableDevies
                    key={device.id}
                    device={device}
                    handleDragStart={handleDragStart}
                    getStatusColor={getStatusColor}
                  />
                ))}
                {filteredDevices.length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-500">
                    No devices found
                  </div>
                )}
              </div>
            </div>
          </div>
        </DndProvider>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t pt-4">
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
