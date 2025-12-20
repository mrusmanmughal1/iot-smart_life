import React, { useState, useMemo } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import type {
  FilterFormValues,
  Device,
  Room,
} from '@/features/floorPlan/types';

interface DeviceLinkStepProps {
  register: UseFormRegister<FilterFormValues>;
  control: Control<FilterFormValues>;
  onPrevious: () => void;
  onNext: () => void;
}

// Mock rooms from DWG file (would come from step 3)
const mockRooms: Room[] = [
  {
    id: 'room-101',
    name: 'Room 101',
    devices: [
      {
        id: 'device-1',
        name: 'Gateway-01',
        type: 'LoRa WAN',
        status: 'online',
        assignedTo: 'room-101',
      },
    ],
  },
  {
    id: 'room-102',
    name: 'Room 102',
    devices: [
      {
        id: 'device-2',
        name: 'Sensor-05',
        type: 'Temperature',
        status: 'online',
        assignedTo: 'room-102',
      },
      {
        id: 'device-3',
        name: 'Sensor-12',
        type: 'Temperature',
        status: 'online',
        assignedTo: 'room-102',
      },
    ],
  },
  {
    id: 'room-103',
    name: 'Room 103',
    devices: [],
  },
];

// Mock available devices
const mockAvailableDevices: Device[] = [
  {
    id: 'device-1',
    name: 'Gateway-01',
    type: 'LoRa WAN',
    status: 'online',
    assignedTo: 'room-101',
  },
  {
    id: 'device-2',
    name: 'Sensor-05',
    type: 'Temperature',
    status: 'online',
    assignedTo: 'room-102',
  },
  {
    id: 'device-3',
    name: 'Sensor-12',
    type: 'Temperature',
    status: 'online',
    assignedTo: 'room-102',
  },
  {
    id: 'device-4',
    name: 'Gateway-02',
    type: 'LoRa WAN',
    status: 'online',
  },
  {
    id: 'device-5',
    name: 'Sensor-08',
    type: 'Humidity',
    status: 'online',
  },
  {
    id: 'device-6',
    name: 'Sensor-15',
    type: 'Motion',
    status: 'offline',
  },
];

const getDeviceTypeColor = (type: string): string => {
  const typeLower = type.toLowerCase();
  if (typeLower.includes('gateway') || typeLower.includes('lora')) {
    return 'bg-yellow-500';
  }
  if (
    typeLower.includes('sensor') ||
    typeLower.includes('temperature') ||
    typeLower.includes('humidity')
  ) {
    return 'bg-green-500';
  }
  return 'bg-red-500';
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

export const DeviceLinkStep: React.FC<DeviceLinkStepProps> = ({
  register,
  control,
  onPrevious,
  onNext,
}) => {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [availableDevices, setAvailableDevices] =
    useState<Device[]>(mockAvailableDevices);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [draggedDevice, setDraggedDevice] = useState<Device | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>('room-101');

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
    setDraggedDevice(device);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, roomId: string) => {
    e.preventDefault();
    if (!draggedDevice) return;

    // Remove device from current assignment
    const updatedRooms = rooms.map((room) => ({
      ...room,
      devices: room.devices.filter((d) => d.id !== draggedDevice.id),
    }));

    // Add device to new room
    const updatedRoomsWithDevice = updatedRooms.map((room) => {
      if (room.id === roomId) {
        return {
          ...room,
          devices: [...room.devices, { ...draggedDevice, assignedTo: roomId }],
        };
      }
      return room;
    });

    // Update available devices
    const updatedDevices = availableDevices.map((device) =>
      device.id === draggedDevice.id
        ? { ...device, assignedTo: roomId }
        : device
    );

    setRooms(updatedRoomsWithDevice);
    setAvailableDevices(updatedDevices);
    setDraggedDevice(null);
  };

  const handleRemoveDevice = (deviceId: string, roomId: string) => {
    const updatedRooms = rooms.map((room) => {
      if (room.id === roomId) {
        return {
          ...room,
          devices: room.devices.filter((d) => d.id !== deviceId),
        };
      }
      return room;
    });

    const updatedDevices = availableDevices.map((device) =>
      device.id === deviceId ? { ...device, assignedTo: undefined } : device
    );

    setRooms(updatedRooms);
    setAvailableDevices(updatedDevices);
  };

  const getDeviceTypeDot = (device: Device): string => {
    const typeLower = device.type.toLowerCase();
    if (typeLower.includes('gateway') || typeLower.includes('lora')) {
      return 'bg-yellow-500';
    }
    if (typeLower.includes('sensor')) {
      return 'bg-green-500';
    }
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Left Column - Floor Plan View */}
        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Floor Plan View</h3>
            <div className="space-y-3">
              {rooms.map((room) => {
                const isSelected = room.id === selectedRoom;
                const hasUnassigned = room.devices.length === 0;

                return (
                  <Card
                    key={room.id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary shadow-md bg-amber-50'
                        : 'border-gray-200 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedRoom(room.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, room.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {room.name}
                          </span>
                          {room.devices.map((device) => (
                            <span
                              key={device.id}
                              className={`inline-block w-2 h-2 rounded-full ${getDeviceTypeDot(
                                device
                              )}`}
                              title={device.type}
                            />
                          ))}
                          {hasUnassigned && (
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                          )}
                        </div>
                        {room.devices.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {room.devices.length} device
                            {room.devices.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      {room.devices.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {room.devices.map((device) => (
                            <div
                              key={device.id}
                              className="flex items-center justify-between text-xs text-gray-600 bg-white rounded p-2"
                            >
                              <span>{device.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveDevice(device.id, room.id);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-semibold">Legend</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
                <span>Gateway</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                <span>Sensor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                <span>Unassigned</span>
              </div>
            </div>
          </div>
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
                <Card
                  key={device.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, device)}
                  className="cursor-move hover:shadow-md transition-shadow border-gray-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${getStatusColor(
                            device.status
                          )}`}
                          title={device.status}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">
                            {device.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Status:{' '}
                            {device.status.charAt(0).toUpperCase() +
                              device.status.slice(1)}{' '}
                            | Type: {device.type}
                            {device.assignedTo && (
                              <>
                                {' '}
                                | Assigned to:{' '}
                                {rooms.find((r) => r.id === device.assignedTo)
                                  ?.name || 'Unknown'}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredDevices.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-500">
                  No devices found
                </div>
              )}
            </div>
          </div>
        </div>
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
