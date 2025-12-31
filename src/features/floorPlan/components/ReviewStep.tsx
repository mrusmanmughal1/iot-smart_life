import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { Control, UseFormRegister } from 'react-hook-form';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Text,
  Line,
} from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, Share2 } from 'lucide-react';
import type { FilterFormValues } from '@/features/floorPlan/types';
import { useFloorMapStore } from '@/features/floorPlan/store';
import { useDevices } from '@/features/devices/hooks';
import type { Device as ApiDevice } from '@/services/api/devices.api';
import * as THREE from 'three';

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

// 3D Floor Component
const Floor3D: React.FC<{
  floorIndex: number;
  floorName: string;
  zones: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    name: string;
    type: string;
  }>;
  devices: Array<{
    id: string;
    name: string;
    type: string;
    x: number;
    y: number;
  }>;
  showGateways: boolean;
  showSensors: boolean;
  showZones: boolean;
  showDwgOutline: boolean;
  dwgFile?: File;
  dwgImageUrl?: string;
  isSelected: boolean;
}> = ({
  floorIndex,
  zones,
  devices,
  showGateways,
  showSensors,
  showZones,
  showDwgOutline,
  dwgFile,
  dwgImageUrl,
  isSelected,
}) => {
  const floorHeight = 0.1;
  const wallHeight = 2.5; // Height of walls in 3D units
  const wallThickness = 0.2; // Thickness of walls
  const floorY = floorIndex * 3; // 3 units between floors
  const [dwgGeometry, setDwgGeometry] = useState<THREE.BufferGeometry | null>(
    null
  );

  // Parse and render DWG outline
  useEffect(() => {
    const parseDwgFor3D = async () => {
      if (!showDwgOutline || (!dwgFile && !dwgImageUrl)) {
        setDwgGeometry(null);
        return;
      }

      try {
        if (dwgFile) {
          const { EnhancedCADParser } = await import(
            '@/features/floorPlan/services/EnhancedCADParser'
          );

          let dxf: {
            entities?: Array<{
              type?: string;
              vertices?: Array<{ x: number; y: number; z?: number }>;
              start?: { x: number; y: number; z?: number };
              end?: { x: number; y: number; z?: number };
              startPoint?: { x: number; y: number; z?: number };
              endPoint?: { x: number; y: number; z?: number };
              center?: { x: number; y: number; z?: number };
              radius?: number;
              position?: { x: number; y: number; z?: number };
              closed?: boolean;
              flag?: number;
              controlPoints?: Array<{ x: number; y: number; z?: number }>;
            }>;
            tables?: {
              layer?: any;
            };
          };

          try {
            if (dwgFile.name.toLowerCase().endsWith('.dxf')) {
              const result = await EnhancedCADParser.parseDXF(dwgFile);
              dxf = result.dxf;
            } else if (dwgFile.name.toLowerCase().endsWith('.dwg')) {
              const result = await EnhancedCADParser.parseDWG(dwgFile);
              dxf = result.dxf;
            } else {
              return;
            }

            // Use the parser's calculateOverallBounds method for accurate bounds
            const bounds = EnhancedCADParser.calculateOverallBounds(
              dxf.entities || []
            );

            // Calculate bounds from entities to normalize coordinates
            let minX = Infinity,
              maxX = -Infinity,
              minY = Infinity,
              maxY = -Infinity;

            const extractBounds = (entity: any) => {
              // Handle LINE entities - DXF parser format (startPoint/endPoint) first
              if (entity.startPoint && entity.endPoint) {
                minX = Math.min(
                  minX,
                  entity.startPoint.x || 0,
                  entity.endPoint.x || 0
                );
                maxX = Math.max(
                  maxX,
                  entity.startPoint.x || 0,
                  entity.endPoint.x || 0
                );
                minY = Math.min(
                  minY,
                  entity.startPoint.y || 0,
                  entity.endPoint.y || 0
                );
                maxY = Math.max(
                  maxY,
                  entity.startPoint.y || 0,
                  entity.endPoint.y || 0
                );
              }
              // Alternative format: start and end
              else if (entity.start && entity.end) {
                minX = Math.min(minX, entity.start.x || 0, entity.end.x || 0);
                maxX = Math.max(maxX, entity.start.x || 0, entity.end.x || 0);
                minY = Math.min(minY, entity.start.y || 0, entity.end.y || 0);
                maxY = Math.max(maxY, entity.start.y || 0, entity.end.y || 0);
              }

              // Handle vertices array
              if (entity.vertices && Array.isArray(entity.vertices)) {
                entity.vertices.forEach((v: any) => {
                  let x = 0,
                    y = 0;
                  if (typeof v === 'object') {
                    x =
                      v.x !== undefined
                        ? v.x
                        : Array.isArray(v)
                        ? v[0] || 0
                        : 0;
                    y =
                      v.y !== undefined
                        ? v.y
                        : Array.isArray(v)
                        ? v[1] || 0
                        : 0;
                  } else if (Array.isArray(v)) {
                    x = v[0] || 0;
                    y = v[1] || 0;
                  }
                  if (x !== 0 || y !== 0) {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                  }
                });
              }

              // Handle center-based entities (CIRCLE, ARC)
              if (entity.center) {
                const radius = entity.radius || 0;
                const cx = entity.center.x || 0;
                const cy = entity.center.y || 0;
                minX = Math.min(minX, cx - radius);
                maxX = Math.max(maxX, cx + radius);
                minY = Math.min(minY, cy - radius);
                maxY = Math.max(maxY, cy + radius);
              }

              // Handle position-based entities (INSERT, TEXT)
              if (entity.position) {
                minX = Math.min(minX, entity.position.x || 0);
                maxX = Math.max(maxX, entity.position.x || 0);
                minY = Math.min(minY, entity.position.y || 0);
                maxY = Math.max(maxY, entity.position.y || 0);
              }
            };

            // First pass: calculate bounds from all entities
            let entitiesForBounds: any[] = [];
            if (dxf.entities && Array.isArray(dxf.entities)) {
              entitiesForBounds = dxf.entities;
            }
            entitiesForBounds.forEach(extractBounds);

            // Use parser bounds if available, otherwise use calculated bounds
            if (bounds && bounds.minX !== Infinity) {
              minX = bounds.minX;
              maxX = bounds.maxX;
              minY = bounds.minY;
              maxY = bounds.maxY;
            }

            // Use calculated bounds or defaults
            const width = maxX > minX && maxX !== Infinity ? maxX - minX : 800;
            const height = maxY > minY && maxY !== Infinity ? maxY - minY : 500;
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            // Scale to fit 3D space (20x15 units)
            const scaleX = 20 / Math.max(width, 1);
            const scaleZ = 15 / Math.max(height, 1);
            const scale = Math.min(scaleX, scaleZ); // Use uniform scale

            // Create geometry from DWG entities
            const points: number[] = [];

            // Helper function to convert 2D point to 3D
            const to3D = (x: number, y: number, z: number = 0.02) => {
              const normalizedX = (x - centerX) * scale;
              const normalizedY = (y - centerY) * scale;
              return [normalizedX, z, normalizedY];
            };

            // Helper function to add line segment
            const addLine = (
              x1: number,
              y1: number,
              x2: number,
              y2: number
            ) => {
              const [px1, py1, pz1] = to3D(x1, y1);
              const [px2, py2, pz2] = to3D(x2, y2);
              points.push(px1, py1, pz1, px2, py2, pz2);
            };

            // Helper function to add arc segments
            const addArc = (
              centerX: number,
              centerY: number,
              radius: number,
              startAngle: number,
              endAngle: number,
              segments: number = 32
            ) => {
              for (let i = 0; i <= segments; i++) {
                const angle =
                  startAngle + (endAngle - startAngle) * (i / segments);
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                if (i > 0) {
                  const prevAngle =
                    startAngle + (endAngle - startAngle) * ((i - 1) / segments);
                  const prevX = centerX + radius * Math.cos(prevAngle);
                  const prevY = centerY + radius * Math.sin(prevAngle);
                  addLine(prevX, prevY, x, y);
                }
              }
            };

            // Normalize entities - handle both direct entities and nested structures
            let entitiesToRender: any[] = [];
            if (dxf.entities && Array.isArray(dxf.entities)) {
              entitiesToRender = dxf.entities;
            } else if (dxf.tables?.layer && dxf.entities) {
              // Some parsers nest entities differently
              entitiesToRender = Array.isArray(dxf.entities)
                ? dxf.entities
                : [];
            }

            console.log('Total entities to render:', entitiesToRender.length);

            // Log entity type distribution
            const entityTypes: Record<string, number> = {};
            entitiesToRender.forEach((e: any) => {
              const type = (e.type || 'UNKNOWN').toUpperCase();
              entityTypes[type] = (entityTypes[type] || 0) + 1;
            });
            console.log('Entity type distribution:', entityTypes);

            let renderedCount = 0;

            entitiesToRender.forEach((entity: any) => {
              try {
                const entityType = (entity.type || '').toUpperCase();

                // LINE entity - handle multiple formats (DXF parser uses startPoint/endPoint)
                if (entityType === 'LINE' || entityType === 'line') {
                  let x1 = 0,
                    y1 = 0,
                    x2 = 0,
                    y2 = 0;
                  let hasValidLine = false;

                  // Format 1: DXF parser format (startPoint, endPoint) - PRIMARY FORMAT
                  if (entity.startPoint && entity.endPoint) {
                    x1 = entity.startPoint.x || 0;
                    y1 = entity.startPoint.y || 0;
                    x2 = entity.endPoint.x || 0;
                    y2 = entity.endPoint.y || 0;
                    hasValidLine = true;
                  }
                  // Format 2: start and end properties
                  else if (entity.start && entity.end) {
                    x1 = entity.start.x || 0;
                    y1 = entity.start.y || 0;
                    x2 = entity.end.x || 0;
                    y2 = entity.end.y || 0;
                    hasValidLine = true;
                  }
                  // Format 3: vertices array
                  else if (
                    entity.vertices &&
                    Array.isArray(entity.vertices) &&
                    entity.vertices.length >= 2
                  ) {
                    const v1 = entity.vertices[0];
                    const v2 = entity.vertices[1];
                    x1 =
                      typeof v1 === 'object' && v1.x !== undefined
                        ? v1.x
                        : Array.isArray(v1)
                        ? v1[0]
                        : 0;
                    y1 =
                      typeof v1 === 'object' && v1.y !== undefined
                        ? v1.y
                        : Array.isArray(v1)
                        ? v1[1]
                        : 0;
                    x2 =
                      typeof v2 === 'object' && v2.x !== undefined
                        ? v2.x
                        : Array.isArray(v2)
                        ? v2[0]
                        : 0;
                    y2 =
                      typeof v2 === 'object' && v2.y !== undefined
                        ? v2.y
                        : Array.isArray(v2)
                        ? v2[1]
                        : 0;
                    hasValidLine = x1 !== 0 || y1 !== 0 || x2 !== 0 || y2 !== 0;
                  }

                  if (hasValidLine) {
                    addLine(x1, y1, x2, y2);
                    renderedCount++;
                  }
                }
                // LWPOLYLINE entity - handle DXF parser format
                else if (
                  entityType === 'LWPOLYLINE' ||
                  entityType === 'lwpolyline'
                ) {
                  if (
                    entity.vertices &&
                    Array.isArray(entity.vertices) &&
                    entity.vertices.length > 0
                  ) {
                    const isClosed = entity.closed || entity.flag === 1;
                    for (let i = 0; i < entity.vertices.length; i++) {
                      const vertex = entity.vertices[i];
                      const nextIdx =
                        i < entity.vertices.length - 1
                          ? i + 1
                          : isClosed
                          ? 0
                          : -1;

                      if (nextIdx === -1) break; // Don't connect last to first if not closed

                      const nextVertex = entity.vertices[nextIdx];

                      // Handle different vertex formats from DXF parser
                      let x1 = 0,
                        y1 = 0,
                        x2 = 0,
                        y2 = 0;

                      if (typeof vertex === 'object') {
                        x1 =
                          vertex.x !== undefined
                            ? vertex.x
                            : Array.isArray(vertex)
                            ? vertex[0] || 0
                            : 0;
                        y1 =
                          vertex.y !== undefined
                            ? vertex.y
                            : Array.isArray(vertex)
                            ? vertex[1] || 0
                            : 0;
                      } else if (Array.isArray(vertex)) {
                        x1 = vertex[0] || 0;
                        y1 = vertex[1] || 0;
                      }

                      if (typeof nextVertex === 'object') {
                        x2 =
                          nextVertex.x !== undefined
                            ? nextVertex.x
                            : Array.isArray(nextVertex)
                            ? nextVertex[0] || 0
                            : 0;
                        y2 =
                          nextVertex.y !== undefined
                            ? nextVertex.y
                            : Array.isArray(nextVertex)
                            ? nextVertex[1] || 0
                            : 0;
                      } else if (Array.isArray(nextVertex)) {
                        x2 = nextVertex[0] || 0;
                        y2 = nextVertex[1] || 0;
                      }

                      if (x1 !== 0 || y1 !== 0 || x2 !== 0 || y2 !== 0) {
                        addLine(x1, y1, x2, y2);
                        renderedCount++;
                      }
                    }
                  }
                }
                // POLYLINE entity - handle DXF parser format
                else if (
                  entityType === 'POLYLINE' ||
                  entityType === 'polyline'
                ) {
                  if (
                    entity.vertices &&
                    Array.isArray(entity.vertices) &&
                    entity.vertices.length > 0
                  ) {
                    const isClosed = entity.closed || entity.flag === 1;
                    for (let i = 0; i < entity.vertices.length; i++) {
                      const vertex = entity.vertices[i];
                      const nextIdx =
                        i < entity.vertices.length - 1
                          ? i + 1
                          : isClosed
                          ? 0
                          : -1;

                      if (nextIdx === -1) break; // Don't connect last to first if not closed

                      const nextVertex = entity.vertices[nextIdx];

                      // Handle different vertex formats
                      let x1 = 0,
                        y1 = 0,
                        x2 = 0,
                        y2 = 0;

                      if (typeof vertex === 'object') {
                        x1 =
                          vertex.x !== undefined
                            ? vertex.x
                            : Array.isArray(vertex)
                            ? vertex[0] || 0
                            : 0;
                        y1 =
                          vertex.y !== undefined
                            ? vertex.y
                            : Array.isArray(vertex)
                            ? vertex[1] || 0
                            : 0;
                      } else if (Array.isArray(vertex)) {
                        x1 = vertex[0] || 0;
                        y1 = vertex[1] || 0;
                      }

                      if (typeof nextVertex === 'object') {
                        x2 =
                          nextVertex.x !== undefined
                            ? nextVertex.x
                            : Array.isArray(nextVertex)
                            ? nextVertex[0] || 0
                            : 0;
                        y2 =
                          nextVertex.y !== undefined
                            ? nextVertex.y
                            : Array.isArray(nextVertex)
                            ? nextVertex[1] || 0
                            : 0;
                      } else if (Array.isArray(nextVertex)) {
                        x2 = nextVertex[0] || 0;
                        y2 = nextVertex[1] || 0;
                      }

                      if (x1 !== 0 || y1 !== 0 || x2 !== 0 || y2 !== 0) {
                        addLine(x1, y1, x2, y2);
                        renderedCount++;
                      }
                    }
                  }
                }
                // ARC entity - handle DXF parser format
                else if (entityType === 'ARC' || entityType === 'arc') {
                  if (entity.center && entity.radius !== undefined) {
                    const centerX = entity.center.x || 0;
                    const centerY = entity.center.y || 0;
                    const radius = entity.radius || 0;
                    // DXF parser uses startAngle and endAngle in degrees
                    const startAngle =
                      (entity.startAngle !== undefined
                        ? entity.startAngle
                        : entity.startAngleDegrees || 0) *
                      (Math.PI / 180);
                    const endAngle =
                      (entity.endAngle !== undefined
                        ? entity.endAngle
                        : entity.endAngleDegrees || 360) *
                      (Math.PI / 180);
                    if (radius > 0) {
                      addArc(centerX, centerY, radius, startAngle, endAngle);
                      renderedCount++;
                    }
                  }
                }
                // CIRCLE entity - handle DXF parser format
                else if (entityType === 'CIRCLE' || entityType === 'circle') {
                  if (entity.center && entity.radius !== undefined) {
                    const centerX = entity.center.x || 0;
                    const centerY = entity.center.y || 0;
                    const radius = entity.radius || 0;
                    if (radius > 0) {
                      addArc(centerX, centerY, radius, 0, 2 * Math.PI);
                      renderedCount++;
                    }
                  }
                }
                // SPLINE entity
                else if (entityType === 'SPLINE' || entityType === 'spline') {
                  if (
                    entity.controlPoints &&
                    Array.isArray(entity.controlPoints) &&
                    entity.controlPoints.length > 1
                  ) {
                    for (let i = 0; i < entity.controlPoints.length - 1; i++) {
                      const cp1 = entity.controlPoints[i];
                      const cp2 = entity.controlPoints[i + 1];
                      const x1 =
                        cp1.x !== undefined
                          ? cp1.x
                          : Array.isArray(cp1)
                          ? cp1[0]
                          : 0;
                      const y1 =
                        cp1.y !== undefined
                          ? cp1.y
                          : Array.isArray(cp1)
                          ? cp1[1]
                          : 0;
                      const x2 =
                        cp2.x !== undefined
                          ? cp2.x
                          : Array.isArray(cp2)
                          ? cp2[0]
                          : 0;
                      const y2 =
                        cp2.y !== undefined
                          ? cp2.y
                          : Array.isArray(cp2)
                          ? cp2[1]
                          : 0;
                      addLine(x1, y1, x2, y2);
                    }
                  } else if (
                    entity.vertices &&
                    Array.isArray(entity.vertices) &&
                    entity.vertices.length > 1
                  ) {
                    for (let i = 0; i < entity.vertices.length - 1; i++) {
                      const v1 = entity.vertices[i];
                      const v2 = entity.vertices[i + 1];
                      const x1 =
                        v1.x !== undefined
                          ? v1.x
                          : Array.isArray(v1)
                          ? v1[0]
                          : 0;
                      const y1 =
                        v1.y !== undefined
                          ? v1.y
                          : Array.isArray(v1)
                          ? v1[1]
                          : 0;
                      const x2 =
                        v2.x !== undefined
                          ? v2.x
                          : Array.isArray(v2)
                          ? v2[0]
                          : 0;
                      const y2 =
                        v2.y !== undefined
                          ? v2.y
                          : Array.isArray(v2)
                          ? v2[1]
                          : 0;
                      addLine(x1, y1, x2, y2);
                    }
                  }
                }
                // DIMENSION entity (render as line)
                else if (
                  entityType === 'DIMENSION' ||
                  entityType === 'dimension'
                ) {
                  if (
                    entity.vertices &&
                    Array.isArray(entity.vertices) &&
                    entity.vertices.length >= 2
                  ) {
                    const v1 = entity.vertices[0];
                    const v2 = entity.vertices[1];
                    const x1 =
                      v1.x !== undefined ? v1.x : Array.isArray(v1) ? v1[0] : 0;
                    const y1 =
                      v1.y !== undefined ? v1.y : Array.isArray(v1) ? v1[1] : 0;
                    const x2 =
                      v2.x !== undefined ? v2.x : Array.isArray(v2) ? v2[0] : 0;
                    const y2 =
                      v2.y !== undefined ? v2.y : Array.isArray(v2) ? v2[1] : 0;
                    addLine(x1, y1, x2, y2);
                  }
                }
              } catch (error) {
                // Skip entities that can't be parsed
                console.warn('Error parsing entity:', entity.type, error);
              }
            });

            console.log(
              `Rendered ${renderedCount} entities, total points: ${
                points.length / 3
              }`
            );

            if (points.length > 0) {
              const geometry = new THREE.BufferGeometry();
              geometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(points, 3)
              );
              setDwgGeometry(geometry);
            } else {
              console.warn('No points generated from DWG entities');
              setDwgGeometry(null);
            }
          } catch (error) {
            console.error('Error parsing DWG for 3D:', error);
            setDwgGeometry(null);
          }
        } else {
          setDwgGeometry(null);
        }
      } catch (error) {
        console.error('Error loading DWG file for 3D:', error);
        setDwgGeometry(null);
      }
    };

    parseDwgFor3D();
  }, [dwgFile, dwgImageUrl, showDwgOutline]);

  // Filter devices based on display options
  const filteredDevices = devices.filter((device) => {
    const deviceType = device.type.toLowerCase();
    if (deviceType.includes('gateway') && !showGateways) return false;
    if (deviceType.includes('sensor') && !showSensors) return false;
    return true;
  });

  // Calculate building bounds from zones
  const buildingBounds = useMemo(() => {
    if (zones.length === 0) {
      return { minX: -10, maxX: 10, minZ: -7.5, maxZ: 7.5 };
    }
    const scaleX = 20 / 800;
    const scaleZ = 15 / 500;
    let minX = Infinity,
      maxX = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity;
    zones.forEach((zone) => {
      const x1 = zone.x * scaleX - 10;
      const x2 = (zone.x + zone.w) * scaleX - 10;
      const z1 = zone.y * scaleZ - 7.5;
      const z2 = (zone.y + zone.h) * scaleZ - 7.5;
      minX = Math.min(minX, x1, x2);
      maxX = Math.max(maxX, x1, x2);
      minZ = Math.min(minZ, z1, z2);
      maxZ = Math.max(maxZ, z1, z2);
    });
    // Add padding for outer walls
    const padding = 0.5;
    return {
      minX: minX - padding,
      maxX: maxX + padding,
      minZ: minZ - padding,
      maxZ: maxZ + padding,
    };
  }, [zones]);

  // Helper function to check if zones are adjacent
  const checkAdjacentZones = useMemo(() => {
    const scaleX = 20 / 800;
    const scaleZ = 15 / 500;
    const adjacencyMap: Record<
      number,
      { north: boolean; south: boolean; east: boolean; west: boolean }
    > = {};

    zones.forEach((zone, idx) => {
      const zoneMinX = zone.x * scaleX - 10;
      const zoneMaxX = (zone.x + zone.w) * scaleX - 10;
      const zoneMinZ = zone.y * scaleZ - 7.5;
      const zoneMaxZ = (zone.y + zone.h) * scaleZ - 7.5;

      adjacencyMap[idx] = {
        north: zones.some((otherZone, otherIdx) => {
          if (otherIdx === idx) return false;
          const otherMinZ = otherZone.y * scaleZ - 7.5;
          const otherMinX = otherZone.x * scaleX - 10;
          const otherMaxX = (otherZone.x + otherZone.w) * scaleX - 10;
          return (
            Math.abs(otherMinZ - zoneMaxZ) < 0.1 &&
            !(otherMaxX < zoneMinX || otherMinX > zoneMaxX)
          );
        }),
        south: zones.some((otherZone, otherIdx) => {
          if (otherIdx === idx) return false;
          const otherMaxZ = (otherZone.y + otherZone.h) * scaleZ - 7.5;
          const otherMinX = otherZone.x * scaleX - 10;
          const otherMaxX = (otherZone.x + otherZone.w) * scaleX - 10;
          return (
            Math.abs(otherMaxZ - zoneMinZ) < 0.1 &&
            !(otherMaxX < zoneMinX || otherMinX > zoneMaxX)
          );
        }),
        east: zones.some((otherZone, otherIdx) => {
          if (otherIdx === idx) return false;
          const otherMinX = otherZone.x * scaleX - 10;
          const otherMinZ = otherZone.y * scaleZ - 7.5;
          const otherMaxZ = (otherZone.y + otherZone.h) * scaleZ - 7.5;
          return (
            Math.abs(otherMinX - zoneMaxX) < 0.1 &&
            !(otherMaxZ < zoneMinZ || otherMinZ > zoneMaxZ)
          );
        }),
        west: zones.some((otherZone, otherIdx) => {
          if (otherIdx === idx) return false;
          const otherMaxX = (otherZone.x + otherZone.w) * scaleX - 10;
          const otherMinZ = otherZone.y * scaleZ - 7.5;
          const otherMaxZ = (otherZone.y + otherZone.h) * scaleZ - 7.5;
          return (
            Math.abs(otherMaxX - zoneMinX) < 0.1 &&
            !(otherMaxZ < zoneMinZ || otherMinZ > zoneMaxZ)
          );
        }),
      };
    });

    return adjacencyMap;
  }, [zones]);

  return (
    <group position={[0, floorY, 0]}>
      {/* Floor Base */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[20, floorHeight, 15]} />
        <meshStandardMaterial
          color={isSelected ? '#E5E7EB' : '#9CA3AF'}
          opacity={isSelected ? 1 : 0.5}
          transparent
        />
      </mesh>

      {/* Outer Building Walls */}
      <group>
        {/* North Wall (front) */}
        <mesh
          position={[
            (buildingBounds.minX + buildingBounds.maxX) / 2,
            wallHeight / 2,
            buildingBounds.maxZ,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[
              buildingBounds.maxX - buildingBounds.minX,
              wallHeight,
              wallThickness,
            ]}
          />
          <meshStandardMaterial color="#D1D5DB" />
        </mesh>
        {/* South Wall (back) */}
        <mesh
          position={[
            (buildingBounds.minX + buildingBounds.maxX) / 2,
            wallHeight / 2,
            buildingBounds.minZ,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[
              buildingBounds.maxX - buildingBounds.minX,
              wallHeight,
              wallThickness,
            ]}
          />
          <meshStandardMaterial color="#D1D5DB" />
        </mesh>
        {/* East Wall (right) */}
        <mesh
          position={[
            buildingBounds.maxX,
            wallHeight / 2,
            (buildingBounds.minZ + buildingBounds.maxZ) / 2,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[
              wallThickness,
              wallHeight,
              buildingBounds.maxZ - buildingBounds.minZ,
            ]}
          />
          <meshStandardMaterial color="#D1D5DB" />
        </mesh>
        {/* West Wall (left) */}
        <mesh
          position={[
            buildingBounds.minX,
            wallHeight / 2,
            (buildingBounds.minZ + buildingBounds.maxZ) / 2,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[
              wallThickness,
              wallHeight,
              buildingBounds.maxZ - buildingBounds.minZ,
            ]}
          />
          <meshStandardMaterial color="#D1D5DB" />
        </mesh>
      </group>

      {/* DWG Outline - Green color */}
      {showDwgOutline && dwgGeometry && (
        <lineSegments geometry={dwgGeometry}>
          <lineBasicMaterial color="#10B981" linewidth={2} />
        </lineSegments>
      )}

      {/* Zones with Walls */}
      {showZones &&
        zones.map((zone, idx) => {
          // Convert 2D coordinates to 3D (scale down for 3D space)
          const scaleX = 20 / 800; // Assuming canvas width is 800
          const scaleZ = 15 / 500; // Assuming canvas height is 500
          const x = (zone.x + zone.w / 2) * scaleX - 10;
          const z = (zone.y + zone.h / 2) * scaleZ - 7.5;
          const width = zone.w * scaleX;
          const depth = zone.h * scaleZ;
          const zoneMinX = zone.x * scaleX - 10;
          const zoneMaxX = (zone.x + zone.w) * scaleX - 10;
          const zoneMinZ = zone.y * scaleZ - 7.5;
          const zoneMaxZ = (zone.y + zone.h) * scaleZ - 7.5;

          return (
            <group key={`zone-${idx}`}>
              {/* Zone Floor */}
              <mesh
                position={[x, floorHeight / 2 + 0.01, z]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[width, 0.05, depth]} />
                <meshStandardMaterial
                  color={getZoneColor(zone.type)}
                  opacity={0.6}
                  transparent
                />
              </mesh>

              {/* Zone Name Label */}
              <Text
                position={[x, wallHeight / 2 + 0.1, z]}
                fontSize={0.5}
                color="#1F2937"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="#FFFFFF"
                maxWidth={width * 0.9}
              >
                {zone.name}
              </Text>

              {/* Zone Walls - Only render if no adjacent zone */}
              <group>
                {(() => {
                  const adj = checkAdjacentZones[idx] || {
                    north: false,
                    south: false,
                    east: false,
                    west: false,
                  };
                  return (
                    <>
                      {/* North Wall - only if no adjacent zone */}
                      {!adj.north && (
                        <mesh
                          position={[x, wallHeight / 2, zoneMaxZ]}
                          castShadow
                          receiveShadow
                        >
                          <boxGeometry
                            args={[width, wallHeight, wallThickness]}
                          />
                          <meshStandardMaterial
                            color="#E5E7EB"
                            opacity={0.8}
                            transparent
                          />
                        </mesh>
                      )}
                      {/* South Wall - only if no adjacent zone */}
                      {!adj.south && (
                        <mesh
                          position={[x, wallHeight / 2, zoneMinZ]}
                          castShadow
                          receiveShadow
                        >
                          <boxGeometry
                            args={[width, wallHeight, wallThickness]}
                          />
                          <meshStandardMaterial
                            color="#E5E7EB"
                            opacity={0.8}
                            transparent
                          />
                        </mesh>
                      )}
                      {/* East Wall - only if no adjacent zone */}
                      {!adj.east && (
                        <mesh
                          position={[zoneMaxX, wallHeight / 2, z]}
                          castShadow
                          receiveShadow
                        >
                          <boxGeometry
                            args={[wallThickness, wallHeight, depth]}
                          />
                          <meshStandardMaterial
                            color="#E5E7EB"
                            opacity={0.8}
                            transparent
                          />
                        </mesh>
                      )}
                      {/* West Wall - only if no adjacent zone */}
                      {!adj.west && (
                        <mesh
                          position={[zoneMinX, wallHeight / 2, z]}
                          castShadow
                          receiveShadow
                        >
                          <boxGeometry
                            args={[wallThickness, wallHeight, depth]}
                          />
                          <meshStandardMaterial
                            color="#E5E7EB"
                            opacity={0.8}
                            transparent
                          />
                        </mesh>
                      )}
                    </>
                  );
                })()}
              </group>
            </group>
          );
        })}

      {/* Ceiling */}
      <mesh position={[0, wallHeight, 0]} receiveShadow>
        <boxGeometry args={[20, 0.1, 15]} />
        <meshStandardMaterial color="#F3F4F6" opacity={0.7} transparent />
      </mesh>

      {/* Devices */}
      {filteredDevices.map((device) => {
        // Convert 2D coordinates to 3D
        const scaleX = 20 / 800;
        const scaleZ = 15 / 500;
        const x = device.x * scaleX - 10;
        const z = device.y * scaleZ - 7.5;
        const deviceHeight = 0.3; // Height of device above floor

        return (
          <group
            key={device.id}
            position={[x, floorHeight / 2 + deviceHeight, z]}
          >
            {/* Device Marker (Cylinder) */}
            <mesh castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
              <meshStandardMaterial color={getDeviceColor(device.type)} />
            </mesh>
            {/* Device Label */}
            <Text
              position={[0, 0.5, 0]}
              fontSize={0.3}
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
    zones: Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      name: string;
      type: string;
    }>;
    devices: Array<{
      id: string;
      name: string;
      type: string;
      x: number;
      y: number;
    }>;
    dwgFile?: File;
    dwgImageUrl?: string;
  }>;
  selectedFloor: string;
  showGateways: boolean;
  showSensors: boolean;
  showZones: boolean;
  showConnections: boolean;
  showDwgOutline: boolean;
}> = ({
  floors,
  selectedFloor,
  showGateways,
  showSensors,
  showZones,
  showConnections,
  showDwgOutline,
}) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -5]} intensity={0.5} />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[15, 10, 15]} fov={50} />

      {/* Orbit Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />

      {/* Grid Helper */}
      <gridHelper args={[30, 30, '#4B5563', '#1F2937']} />

      {/* Floors */}
      {floors.map((floorData, index) => {
        const floorNames = ['Ground', '1st', '2nd', '3rd', '4th', '5th'];
        const floorName = floorNames[index] || `Floor ${index}`;
        const isSelected = floorData.floor === selectedFloor;

        return (
          <Floor3D
            key={`floor-${index}`}
            floorIndex={index}
            floorName={floorName}
            zones={floorData.zones}
            devices={floorData.devices}
            showGateways={showGateways}
            showSensors={showSensors}
            showZones={showZones}
            showDwgOutline={showDwgOutline}
            dwgFile={floorData.dwgFile}
            dwgImageUrl={floorData.dwgImageUrl}
            isSelected={isSelected}
          />
        );
      })}

      {/* Connections between devices */}
      {showConnections &&
        floors.map((floorData, floorIndex) => {
          if (floorData.devices.length < 2) return null;

          return floorData.devices.map((device, idx) => {
            if (idx === 0) return null;
            const prevDevice = floorData.devices[idx - 1];
            const scaleX = 20 / 800;
            const scaleZ = 15 / 500;
            const floorY = floorIndex * 3;

            const x1 = prevDevice.x * scaleX - 10;
            const z1 = prevDevice.y * scaleZ - 7.5;
            const x2 = device.x * scaleX - 10;
            const z2 = device.y * scaleZ - 7.5;

            return (
              <Line
                key={`connection-${floorIndex}-${device.id}`}
                points={[
                  [x1, floorY + 0.3, z1],
                  [x2, floorY + 0.3, z2],
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
  const { zones, uploadedFiles, assignedDevices, devicePositions } =
    useFloorMapStore();

  // Get all devices from API
  const { data: devicesData } = useDevices();
  // Handle nested API response structure: response.data.data.data
  const apiDevices = useMemo(() => {
    const apiResponse = devicesData?.data as unknown as {
      data?: { data?: ApiDevice[] };
    };
    return apiResponse?.data?.data || [];
  }, [devicesData]);

  // Transform API Device to floorPlan Device format
  const transformDevice = (apiDevice: ApiDevice) => {
    const mapType = (type: string | number): string => {
      const typeStr = String(type).toLowerCase();
      return typeStr || 'sensor';
    };

    return {
      id: apiDevice.id,
      name: apiDevice.name,
      type: mapType(apiDevice.type),
    };
  };

  // Get all available devices (transformed from API)
  const availableDevices = useMemo(() => {
    return apiDevices.map(transformDevice);
  }, [apiDevices]);

  // Force re-render when component mounts or when devicePositions/zones change
  // This ensures the 3D view updates when returning from DeviceLinkStep
  const [renderCounter, setRenderCounter] = useState(0);
  const assignedDevicesKeysCount = Object.keys(assignedDevices).length;
  React.useEffect(() => {
    // Increment counter to force Canvas re-render when data changes
    setRenderCounter(prev => prev + 1);
  }, [devicePositions, zones.length, assignedDevicesKeysCount]);

  const [selectedFloor, setSelectedFloor] = useState<string>('Ground');
  const [showAllFloors, setShowAllFloors] = useState<boolean>(false);
  const [showGateways, setShowGateways] = useState<boolean>(true);
  const [showSensors, setShowSensors] = useState<boolean>(true);
  const [showConnections, setShowConnections] = useState<boolean>(false);
  const [showZones, setShowZones] = useState<boolean>(true);
  const [showDwgOutline, setShowDwgOutline] = useState<boolean>(true);

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

  // Create a key that changes when data changes to force re-render
  // This ensures the 3D view re-renders when returning from DeviceLinkStep
  const renderKey = useMemo(() => {
    const devicePositionsKey = JSON.stringify(devicePositions);
    const zonesKey = JSON.stringify(zones.map(z => ({ id: z.id, x: z.x, y: z.y, w: z.w, h: z.h, floor: z.floor })));
    const assignedDevicesKey = JSON.stringify(Object.keys(assignedDevices).map(k => ({ zoneId: k, deviceIds: assignedDevices[k].map(d => d.id) })));
    // Include renderCounter to force re-render when component mounts
    return `${devicePositionsKey}-${zonesKey}-${assignedDevicesKey}-${renderCounter}`;
  }, [devicePositions, zones, assignedDevices, renderCounter]);

  // Prepare floor data for 3D visualization - filter by showAllFloors
  const floorsData = useMemo(() => {
    const floorsToShow = showAllFloors ? availableFloors : [selectedFloor];
    return floorsToShow.map((floorName) => {
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

      // Get devices for this floor - include ALL devices from devicePositions
      const floorDevices: Array<{
        id: string;
        name: string;
        type: string;
        x: number;
        y: number;
      }> = [];
      const deviceMap = new Map<
        string,
        { id: string; name: string; type: string; x: number; y: number }
      >();

      // First, get all devices from devicePositions (all devices positioned on canvas)
      Object.entries(devicePositions).forEach(([deviceId, position]) => {
        if (position.floor === floorName) {
          const device = availableDevices.find((d) => d.id === deviceId);
          if (device) {
            deviceMap.set(deviceId, {
              id: device.id,
              name: device.name,
              type: device.type,
              x: position.x,
              y: position.y,
            });
          }
        }
      });

      // Also include devices from zones (in case they're not in devicePositions)
      floorZones.forEach((zone) => {
        const zoneId = zones.find(
          (z) => z.name === zone.name && z.floor === floorName
        )?.id;
        if (zoneId && assignedDevices[zoneId]) {
          assignedDevices[zoneId].forEach((device) => {
            // Only add if not already in deviceMap (from devicePositions)
            if (!deviceMap.has(device.id)) {
              // Check if device has a position in devicePositions first
              const devicePosition = devicePositions[device.id];
              if (devicePosition && devicePosition.floor === floorName) {
                deviceMap.set(device.id, {
                  id: device.id,
                  name: device.name,
                  type: device.type,
                  x: devicePosition.x,
                  y: devicePosition.y,
                });
              } else {
                deviceMap.set(device.id, {
                  id: device.id,
                  name: device.name,
                  type: device.type,
                  x: zone.x + zone.w / 2,
                  y: zone.y + zone.h / 2,
                });
              }
            }
          });
        }
      });

      // Convert map to array
      floorDevices.push(...Array.from(deviceMap.values()));

      // Get DWG file for this floor
      const floorDwgFile = uploadedFiles.find(
        (f) => f.floor === floorName && f.status === 'completed'
      );

      return {
        floor: floorName,
        zones: floorZones,
        devices: floorDevices,
        dwgFile: floorDwgFile?.file,
        dwgImageUrl: floorDwgFile?.previewUrl,
      };
    });
  }, [
    availableFloors,
    zones,
    assignedDevices,
    devicePositions,
    availableDevices,
    showAllFloors,
    selectedFloor,
    uploadedFiles,
  ]);

  // Set default selected floor
  React.useEffect(() => {
    if (
      availableFloors.length > 0 &&
      !availableFloors.includes(selectedFloor)
    ) {
      setSelectedFloor(availableFloors[0]);
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
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p>Loading 3D Model...</p>
                    </div>
                  </div>
                }
              >
                <Canvas
                  key={renderKey}
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
                    showDwgOutline={showDwgOutline}
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
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-all-floors" className="cursor-pointer">
                  Show All Floors
                </Label>
                <Switch
                  id="show-all-floors"
                  checked={showAllFloors}
                  onCheckedChange={setShowAllFloors}
                />
              </div>
              {!showAllFloors && (
                <RadioGroup
                  value={selectedFloor}
                  onValueChange={setSelectedFloor}
                >
                  {availableFloors.map((floor) => (
                    <div
                      key={floor}
                      className="flex items-center space-x-2 mb-3"
                    >
                      <RadioGroupItem value={floor} id={floor} />
                      <Label
                        htmlFor={floor}
                        className={`cursor-pointer ${
                          selectedFloor === floor
                            ? 'font-semibold text-blue-600'
                            : ''
                        }`}
                      >
                        {floor} Floor
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="show-dwg-outline" className="cursor-pointer">
                  Show DWG Outline
                </Label>
                <Switch
                  id="show-dwg-outline"
                  checked={showDwgOutline}
                  onCheckedChange={setShowDwgOutline}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">
                Status:{' '}
                <span className="font-semibold text-green-600">
                  3D Model Generated Successfully
                </span>
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
