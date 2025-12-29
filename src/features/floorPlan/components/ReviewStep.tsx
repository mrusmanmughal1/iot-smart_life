import React, { useState, useMemo, Suspense } from 'react';
import { Control, UseFormRegister } from 'react-hook-form';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Line } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, Share2 } from 'lucide-react';
import type { FilterFormValues, Device } from '@/features/floorPlan/types';
import { useFloorMapStore } from '@/features/floorPlan/store';

interface ReviewStepProps {
  register: UseFormRegister<FilterFormValues>;
  control: Control<FilterFormValues>;
  onPrevious: () => void;
  onSave: () => void;
}

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

// Helper function to get device color by type
const getDeviceColor = (type: string): string => {
  const colors: Record<string, string> = {
    gateway: '#FCD34D',
    sensor: '#10B981',
    controller: '#3B82F6',
    actuator: '#EF4444',
  };
  return colors[type.toLowerCase()] || '#9CA3AF';
};

// 3D Room Component with Walls
const Room3D: React.FC<{
  x: number;
  z: number;
  width: number;
  depth: number;
  name: string;
  type: string;
  wallHeight: number;
}> = ({ x, z, width, depth, name, type, wallHeight }) => {
  const wallThickness = 0.1;
  const roomColor = getZoneColor(type);
  const wallColor = '#8B7355'; // Brown/tan color for walls

  return (
    <group position={[x, wallHeight / 2, z]}>
      {/* Room Floor */}
      <mesh position={[0, -wallHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[width, 0.05, depth]} />
        <meshStandardMaterial
          color={roomColor}
          opacity={0.8}
          transparent
        />
      </mesh>

      {/* Walls */}
      {/* Front Wall */}
      <mesh
        position={[0, 0, -depth / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, wallHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Back Wall */}
      <mesh
        position={[0, 0, depth / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, wallHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left Wall */}
      <mesh
        position={[-width / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[width / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Room Label (on top of room) */}
      <Text
        position={[0, wallHeight / 2 + 0.1, 0]}
        fontSize={0.4}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {name}
      </Text>
    </group>
  );
};

// 3D Floor Component - Horizontal Plan View
const Floor3D: React.FC<{
  floorIndex: number;
  floorName: string;
  zones: Array<{ x: number; y: number; w: number; h: number; name: string; type: string }>;
  devices: Array<{ id: string; name: string; type: string; x: number; y: number }>;
  showGateways: boolean;
  showSensors: boolean;
  showZones: boolean;
  isSelected: boolean;
  showAllFloors: boolean;
}> = ({ floorIndex, zones, devices, showGateways, showSensors, showZones, isSelected, showAllFloors }) => {
  const floorHeight = 0.2;
  const wallHeight = 2.5; // Height of room walls
  // Horizontal layout: offset floors in X or Z direction instead of Y
  const floorOffsetX = showAllFloors ? floorIndex * 25 : 0; // Offset by 25 units per floor horizontally
  const floorY = 0; // All floors at same Y level for plan view
  
  // Filter devices based on display options
  const filteredDevices = devices.filter((device) => {
    const deviceType = device.type.toLowerCase();
    if (deviceType.includes('gateway') && !showGateways) return false;
    if (deviceType.includes('sensor') && !showSensors) return false;
    return true;
  });

  // Calculate floor bounds from zones
  const scaleX = 20 / 800; // Assuming canvas width is 800
  const scaleZ = 15 / 500; // Assuming canvas height is 500
  
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  zones.forEach((zone) => {
    const x1 = zone.x * scaleX - 10;
    const x2 = (zone.x + zone.w) * scaleX - 10;
    const z1 = zone.y * scaleZ - 7.5;
    const z2 = (zone.y + zone.h) * scaleZ - 7.5;
    minX = Math.min(minX, x1);
    maxX = Math.max(maxX, x2);
    minZ = Math.min(minZ, z1);
    maxZ = Math.max(maxZ, z2);
  });

  // Default floor size if no zones
  if (zones.length === 0) {
    minX = -10;
    maxX = 10;
    minZ = -7.5;
    maxZ = 7.5;
  }

  const floorWidth = maxX - minX + 2;
  const floorDepth = maxZ - minZ + 2;
  const floorCenterX = (minX + maxX) / 2;
  const floorCenterZ = (minZ + maxZ) / 2;

  return (
    <group position={[floorOffsetX, floorY, 0]}>
      {/* Floor Base */}
      <mesh position={[floorCenterX, -floorHeight / 2, floorCenterZ]} receiveShadow>
        <boxGeometry args={[floorWidth, floorHeight, floorDepth]} />
        <meshStandardMaterial
          color={isSelected ? '#4B5563' : '#6B7280'}
          opacity={isSelected ? 1 : 0.7}
          transparent
        />
      </mesh>

      {/* Rooms with Walls */}
      {showZones && zones.map((zone, idx) => {
        // Convert 2D coordinates to 3D (scale down for 3D space)
        const x = (zone.x + zone.w / 2) * scaleX - 10;
        const z = (zone.y + zone.h / 2) * scaleZ - 7.5;
        const width = Math.max(zone.w * scaleX, 0.5); // Minimum width
        const depth = Math.max(zone.h * scaleZ, 0.5); // Minimum depth

        return (
          <Room3D
            key={`room-${idx}`}
            x={x}
            z={z}
            width={width}
            depth={depth}
            name={zone.name}
            type={zone.type}
            wallHeight={wallHeight}
          />
        );
      })}

      {/* Devices */}
      {filteredDevices.map((device) => {
        // Convert 2D coordinates to 3D
        const x = device.x * scaleX - 10;
        const z = device.y * scaleZ - 7.5;

        return (
          <group key={device.id} position={[x, wallHeight / 2 + 0.1, z]}>
            {/* Device Marker (Cylinder) */}
            <mesh castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
              <meshStandardMaterial color={getDeviceColor(device.type)} />
            </mesh>
            {/* Device Label */}
            <Text
              position={[0, 0.4, 0]}
              fontSize={0.25}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              {device.name}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

// 3D Scene Component
const Scene3D: React.FC<{
  floors: Array<{
    floor: string;
    zones: Array<{ x: number; y: number; w: number; h: number; name: string; type: string }>;
    devices: Array<{ id: string; name: string; type: string; x: number; y: number }>;
  }>;
  selectedFloor: string;
  showGateways: boolean;
  showSensors: boolean;
  showZones: boolean;
  showConnections: boolean;
}> = ({ floors, selectedFloor, showGateways, showSensors, showZones, showConnections }) => {
  const showAllFloors = selectedFloor === 'All';
  const filteredFloors = showAllFloors 
    ? floors 
    : floors.filter((floorData) => floorData.floor === selectedFloor);
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -5]} intensity={0.5} />

      {/* Camera - Top-down view for plan */}
      <PerspectiveCamera makeDefault position={[0, 30, 0]} fov={50} rotation={[-Math.PI / 2, 0, 0]} />

      {/* Orbit Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={100}
        target={showAllFloors ? [floors.length * 12.5, 0, 0] : [0, 0, 0]} // Focus on center of visible floors
      />

      {/* Grid Helper */}
      <gridHelper args={[40, 40, '#4B5563', '#1F2937']} />
      
      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1F2937" opacity={0.3} transparent />
      </mesh>

      {/* Floors - Show all or filtered based on selection */}
      {filteredFloors.map((floorData) => {
        const floorNames = ['Ground', '1st', '2nd', '3rd', '4th', '5th'];
        const originalIndex = floors.findIndex((f) => f.floor === floorData.floor);
        const floorName = floorNames[originalIndex] || `Floor ${originalIndex}`;
        const isSelected = floorData.floor === selectedFloor || showAllFloors;

        return (
          <Floor3D
            key={`floor-${floorData.floor}`}
            floorIndex={originalIndex}
            floorName={floorName}
            zones={floorData.zones}
            devices={floorData.devices}
            showGateways={showGateways}
            showSensors={showSensors}
            showZones={showZones}
            isSelected={isSelected}
            showAllFloors={showAllFloors}
          />
        );
      })}

      {/* Connections between devices */}
      {showConnections &&
        filteredFloors.map((floorData) => {
          if (floorData.devices.length < 2) return null;
          
          const wallHeight = 2.5;
          const originalIndex = floors.findIndex((f) => f.floor === floorData.floor);
          const floorOffsetX = showAllFloors ? originalIndex * 25 : 0;
          const floorY = 0;
          
          return floorData.devices.map((device, idx) => {
            if (idx === 0) return null;
            const prevDevice = floorData.devices[idx - 1];
            const scaleX = 20 / 800;
            const scaleZ = 15 / 500;
            
            const x1 = (prevDevice.x * scaleX - 10) + floorOffsetX;
            const z1 = prevDevice.y * scaleZ - 7.5;
            const x2 = (device.x * scaleX - 10) + floorOffsetX;
            const z2 = device.y * scaleZ - 7.5;
            
            return (
              <Line
                key={`connection-${floorData.floor}-${device.id}`}
                points={[
                  [x1, floorY + wallHeight / 2 + 0.2, z1],
                  [x2, floorY + wallHeight / 2 + 0.2, z2],
                ]}
                color="#94a3b8"
                lineWidth={2}
                dashed
                dashScale={0.5}
                dashSize={0.5}
                gapSize={0.5}
              />
            );
          });
        })}
    </>
  );
};

export const ReviewStep: React.FC<ReviewStepProps> = ({
  onPrevious,
  onSave,
}) => {
  // Get data from Zustand store
  const {
    zones,
    uploadedFiles,
    assignedDevices,
    devicePositions,
  } = useFloorMapStore();

  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [showGateways, setShowGateways] = useState<boolean>(true);
  const [showSensors, setShowSensors] = useState<boolean>(true);
  const [showConnections, setShowConnections] = useState<boolean>(false);
  const [showZones, setShowZones] = useState<boolean>(true);

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
    return floors.length > 0 ? floors : ['Ground'];
  }, [uploadedFiles]);

  // Prepare floor data for 3D visualization
  const floorsData = useMemo(() => {
    return availableFloors.map((floorName) => {
      // Get zones for this floor
      const floorZones = zones
        .filter((z) => z.floor === floorName)
        .map((zone) => ({
          x: zone.x,
          y: zone.y,
          w: zone.w,
          h: zone.h,
          name: zone.name,
          type: zone.type,
        }));

      // Get devices for this floor (from devicePositions and assignedDevices)
      const floorDevices: Array<{ id: string; name: string; type: string; x: number; y: number }> = [];
      
      // Get all devices that have positions on this floor
      Object.entries(devicePositions).forEach(([deviceId, position]) => {
        if (position.floor === floorName) {
          // Find the device in assignedDevices to get its details
          let device: Device | undefined;
          for (const zoneDevices of Object.values(assignedDevices)) {
            device = zoneDevices.find((d) => d.id === deviceId);
            if (device) break;
          }
          
          if (device) {
            floorDevices.push({
              id: device.id,
              name: device.name,
              type: device.type,
              x: position.x,
              y: position.y,
            });
          }
        }
      });
      
      // Also add devices from zones that might not have positions yet (fallback to zone center)
      floorZones.forEach((zone) => {
        const zoneId = zones.find((z) => z.name === zone.name && z.floor === floorName)?.id;
        if (zoneId && assignedDevices[zoneId]) {
          assignedDevices[zoneId].forEach((device) => {
            // Only add if device doesn't already have a position
            if (!floorDevices.find((d) => d.id === device.id)) {
              floorDevices.push({
                id: device.id,
                name: device.name,
                type: device.type,
                x: zone.x + zone.w / 2,
                y: zone.y + zone.h / 2,
              });
            }
          });
        }
      });

      return {
        floor: floorName,
        zones: floorZones,
        devices: floorDevices,
      };
    });
  }, [availableFloors, zones, assignedDevices, devicePositions]);

  // Set default selected floor to "All" if available
  React.useEffect(() => {
    if (availableFloors.length > 0 && selectedFloor !== 'All' && !availableFloors.includes(selectedFloor)) {
      setSelectedFloor('All');
    }
  }, [availableFloors, selectedFloor]);

  const handleExport3D = () => {
    // TODO: Implement 3D export functionality
    console.log('Export 3D model');
  };

  const handleShareLink = () => {
    // TODO: Implement share link functionality
    console.log('Share link');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left Panel - 3D Interactive View */}
        <Card>
          <CardHeader>
            <CardTitle>3D Interactive View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[600px] bg-slate-900 rounded-lg overflow-hidden">
              <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading 3D Model...</p>
                  </div>
                </div>
              }>
                <Canvas
                  shadows
                  gl={{ antialias: true, alpha: false }}
                  camera={{ position: [15, 10, 15], fov: 50 }}
                >
                  <Scene3D
                    floors={floorsData}
                    selectedFloor={selectedFloor}
                    showGateways={showGateways}
                    showSensors={showSensors}
                    showZones={showZones}
                    showConnections={showConnections}
                  />
                </Canvas>
              </Suspense>

              {/* Building Label */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md shadow-md z-10">
                <span className="text-sm font-semibold text-gray-900">
                  3D Floor Map Preview
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Controls */}
        <div className="space-y-4">
          {/* 3D Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">3D Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">
                Use mouse to rotate, scroll to zoom, and drag to pan
              </p>
            </CardContent>
          </Card>

          {/* Floor Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Floor Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedFloor} onValueChange={setSelectedFloor}>
                {/* All Floors Option */}
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="All" id="all" />
                  <Label
                    htmlFor="all"
                    className={`cursor-pointer ${selectedFloor === 'All' ? 'font-semibold text-blue-600' : ''}`}
                  >
                    All Floors
                  </Label>
                </div>
                {/* Individual Floor Options */}
                {availableFloors.map((floor) => (
                  <div key={floor} className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value={floor} id={floor} />
                    <Label
                      htmlFor={floor}
                      className={`cursor-pointer ${selectedFloor === floor ? 'font-semibold text-blue-600' : ''}`}
                    >
                      {floor} Floor
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Display Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Display Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-gateways" className="cursor-pointer">
                  Show Gateways
                </Label>
                <Switch
                  id="show-gateways"
                  checked={showGateways}
                  onCheckedChange={setShowGateways}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-sensors" className="cursor-pointer">
                  Show Sensors
                </Label>
                <Switch
                  id="show-sensors"
                  checked={showSensors}
                  onCheckedChange={setShowSensors}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-connections" className="cursor-pointer">
                  Show Connections
                </Label>
                <Switch
                  id="show-connections"
                  checked={showConnections}
                  onCheckedChange={setShowConnections}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-zones" className="cursor-pointer">
                  Show Zones
                </Label>
                <Switch
                  id="show-zones"
                  checked={showZones}
                  onCheckedChange={setShowZones}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">
                Status: <span className="font-semibold text-green-600">3D Model Generated Successfully</span>
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button className="w-full" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={onPrevious}>
            Back
          </Button>
          <Button variant="outline" type="button" onClick={handleExport3D}>
            <Download className="mr-2 h-4 w-4" />
            Export 3D
          </Button>
          <Button variant="outline" type="button" onClick={handleShareLink}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Link
          </Button>
        </div>
      </div>
    </div>
  );
};

