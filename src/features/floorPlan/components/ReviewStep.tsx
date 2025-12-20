import React, { useState } from 'react';
import { Control, UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RotateCw, ZoomIn, Move, Download, Share2 } from 'lucide-react';
import type { FilterFormValues } from '@/features/floorPlan/types';

interface ReviewStepProps {
  register: UseFormRegister<FilterFormValues>;
  control: Control<FilterFormValues>;
  onPrevious: () => void;
  onSave: () => void;
}

// Mock data for the 3D preview
const mockFloors = [
  {
    id: 'ground',
    name: 'Ground Floor',
    color: 'bg-blue-500',
    devices: [
      { id: 'gw-01', name: 'GW-01', type: 'gateway', x: 30, y: 40, color: 'bg-yellow-500' },
      { id: 's-10', name: 'S-10', type: 'sensor', x: 50, y: 30, color: 'bg-green-500' },
      { id: 's-12', name: 'S-12', type: 'sensor', x: 70, y: 50, color: 'bg-purple-500' },
    ],
  },
  {
    id: 'first',
    name: 'First Floor',
    color: 'bg-red-500',
    devices: [
      { id: 'gw-02', name: 'GW-02', type: 'gateway', x: 30, y: 40, color: 'bg-yellow-500' },
      { id: 's-08', name: 'S-08', type: 'sensor', x: 60, y: 35, color: 'bg-green-500' },
    ],
  },
];

export const ReviewStep: React.FC<ReviewStepProps> = ({
  register,
  control,
  onPrevious,
  onSave,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<string>('ground');
  const [showGateways, setShowGateways] = useState<boolean>(true);
  const [showSensors, setShowSensors] = useState<boolean>(true);
  const [showConnections, setShowConnections] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);

  const currentFloor = mockFloors.find((f) => f.id === selectedFloor) || mockFloors[0];
  const filteredDevices = currentFloor.devices.filter((device) => {
    if (device.type === 'gateway' && !showGateways) return false;
    if (device.type === 'sensor' && !showSensors) return false;
    return true;
  });

  const handleRotate = () => {
    setRotation((prev) => (prev + 45) % 360);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handlePan = () => {
    setIsPanning(!isPanning);
  };

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
              {/* 3D Building Model Container */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  perspective: '1200px',
                  perspectiveOrigin: 'center center',
                }}
              >
                <div
                  className="relative"
                  style={{
                    transform: `rotateY(${rotation}deg) scale(${zoom})`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Ground Floor (Blue) */}
                  <div
                    className={`absolute transition-opacity duration-300 ${currentFloor.id === 'ground' ? 'opacity-100' : 'opacity-40'}`}
                    style={{
                      width: '350px',
                      height: '250px',
                      transform: 'translateZ(0px)',
                    }}
                  >
                    <div
                      className={`w-full h-full ${mockFloors[0].color} rounded-lg shadow-2xl relative border-2 border-white/20`}
                      style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)',
                      }}
                    >
                      {currentFloor.id === 'ground' &&
                        filteredDevices.map((device) => (
                          <div
                            key={device.id}
                            className={`absolute ${device.color} w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-xl border-2 border-white/50`}
                            style={{
                              left: `${device.x}%`,
                              top: `${device.y}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                            title={device.name}
                          >
                            <span>{device.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* First Floor (Red) - Positioned above ground floor */}
                  <div
                    className={`absolute transition-opacity duration-300 ${currentFloor.id === 'first' ? 'opacity-100' : 'opacity-40'}`}
                    style={{
                      width: '350px',
                      height: '250px',
                      transform: 'translateZ(0px) translateY(-270px)',
                    }}
                  >
                    <div
                      className={`w-full h-full ${mockFloors[1].color} rounded-lg shadow-2xl relative border-2 border-white/20`}
                      style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)',
                      }}
                    >
                      {currentFloor.id === 'first' &&
                        filteredDevices.map((device) => (
                          <div
                            key={device.id}
                            className={`absolute ${device.color} w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-xl border-2 border-white/50`}
                            style={{
                              left: `${device.x}%`,
                              top: `${device.y}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                            title={device.name}
                          >
                            <span>{device.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Connections (if enabled) */}
                  {showConnections && currentFloor.devices.length > 1 && (
                    <svg
                      className="absolute pointer-events-none"
                      style={{
                        width: '350px',
                        height: currentFloor.id === 'ground' ? '250px' : '250px',
                        top: currentFloor.id === 'ground' ? '0' : '-270px',
                        left: '0',
                        zIndex: 10,
                      }}
                    >
                      {filteredDevices.map((device, idx) => {
                        if (idx === 0 || filteredDevices.length <= 1) return null;
                        const prevDevice = filteredDevices[idx - 1];
                        return (
                          <line
                            key={`line-${device.id}`}
                            x1={`${(prevDevice.x / 100) * 350}`}
                            y1={`${(prevDevice.y / 100) * 250}`}
                            x2={`${(device.x / 100) * 350}`}
                            y2={`${(device.y / 100) * 250}`}
                            stroke="#94a3b8"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            opacity="0.6"
                          />
                        );
                      })}
                    </svg>
                  )}
                </div>
              </div>

              {/* Building Label */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md shadow-md">
                <span className="text-sm font-semibold text-gray-900">
                  3D Floor Map Preview - Building A
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
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleRotate}
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Rotate
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 justify-start"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="mr-2 h-4 w-4" />
                  Zoom In
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 justify-start"
                  onClick={handleZoomOut}
                >
                  <ZoomIn className="mr-2 h-4 w-4 rotate-180" />
                  Zoom Out
                </Button>
              </div>
              <Button
                variant="outline"
                className={`w-full justify-start ${isPanning ? 'bg-primary text-white' : ''}`}
                onClick={handlePan}
              >
                <Move className="mr-2 h-4 w-4" />
                Pan
              </Button>
            </CardContent>
          </Card>

          {/* Floor Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Floor Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedFloor} onValueChange={setSelectedFloor}>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="ground" id="ground" />
                  <Label
                    htmlFor="ground"
                    className={`cursor-pointer ${selectedFloor === 'ground' ? 'font-semibold text-blue-600' : ''}`}
                  >
                    Ground Floor
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="first" id="first" />
                  <Label
                    htmlFor="first"
                    className={`cursor-pointer ${selectedFloor === 'first' ? 'font-semibold text-red-600' : ''}`}
                  >
                    First Floor
                  </Label>
                </div>
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

