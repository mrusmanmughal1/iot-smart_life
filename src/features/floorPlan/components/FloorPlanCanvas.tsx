import {
  Stage,
  Layer,
  Rect,
  Text,
  Group,
  Line,
  Image as KonvaImage,
} from 'react-konva';
import type { Zone } from '@/features/floorPlan/types';
import type { ParsedGeometry } from '@/services/api/floor-plans.api';
import type { Stage as KonvaStage } from 'konva/lib/Stage';
import { useState, useEffect } from 'react';

// ─── helpers ────────────────────────────────────────────────────────────────

const ZONE_COLORS: Record<string, string> = {
  Room: '#93C5FD',
  Office: '#FCD34D',
  Lobby: '#86EFAC',
  Corridor: '#C4B5FD',
  Storage: '#FCA5A5',
  Default: '#E5E7EB',
};

const ROOM_STROKE_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EF4444',
  '#06B6D4',
  '#EC4899',
  '#84CC16',
];

function getZoneColor(type: string): string {
  return ZONE_COLORS[type] ?? ZONE_COLORS.Default;
}

/** Compute the bounding box of a set of points */
function getBBox(points: Array<{ x: number; y: number }>) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
}

/**
 * Scale a set of rooms to fit within the canvas (stageWidth × stageHeight).
 * Returns a scale factor + offset so the geometry fills ~85% of the canvas.
 */
function computeScaleTransform(
  rooms: NonNullable<ParsedGeometry['rooms']>,
  stageWidth: number,
  stageHeight: number
): { scaleX: number; scaleY: number; offsetX: number; offsetY: number } {
  if (!rooms.length) {
    return { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 };
  }

  let globalMinX = Infinity;
  let globalMinY = Infinity;
  let globalMaxX = -Infinity;
  let globalMaxY = -Infinity;

  for (const room of rooms) {
    if (!room.boundaries?.length) continue;
    const { minX, minY, maxX, maxY } = getBBox(room.boundaries);
    globalMinX = Math.min(globalMinX, minX);
    globalMinY = Math.min(globalMinY, minY);
    globalMaxX = Math.max(globalMaxX, maxX);
    globalMaxY = Math.max(globalMaxY, maxY);
  }

  const geomW = globalMaxX - globalMinX || 1;
  const geomH = globalMaxY - globalMinY || 1;

  const padding = 0.85; // use 85% of stage
  const scaleX = (stageWidth * padding) / geomW;
  const scaleY = (stageHeight * padding) / geomH;
  const scale = Math.min(scaleX, scaleY);

  // Centre the geometry
  const scaledW = geomW * scale;
  const scaledH = geomH * scale;
  const offsetX = (stageWidth - scaledW) / 2 - globalMinX * scale;
  const offsetY = (stageHeight - scaledH) / 2 - globalMinY * scale;

  return { scaleX: scale, scaleY: scale, offsetX, offsetY };
}

// ─── types ───────────────────────────────────────────────────────────────────

interface FloorPlanCanvasProps {
  zones: Zone[];
  selectedZoneId: string | null;
  zoomLevel: number;
  dwgImageUrl?: string;
  /** Parsed geometry from the backend for the active floor */
  parsedRooms?: ParsedGeometry['rooms'];
  onZoneClick: (zoneId: string) => void;
  onStageClick: () => void;
  stageRef: React.RefObject<KonvaStage>;
  isDrawing: boolean;
  selectionPoints: Array<{ x: number; y: number }>;
  onDwgError?: (hasError: boolean) => void;
}

// ─── component ───────────────────────────────────────────────────────────────

const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  zones,
  selectedZoneId,
  zoomLevel,
  dwgImageUrl,
  parsedRooms,
  onZoneClick,
  onStageClick,
  stageRef,
  isDrawing,
  selectionPoints,
}) => {
  const [dwgImage, setDwgImage] = useState<HTMLImageElement | null>(null);

  const stageWidth = 800;
  const stageHeight = 500;
  const scaledWidth = (stageWidth * zoomLevel) / 100;
  const scaledHeight = (stageHeight * zoomLevel) / 100;

  // Load background image from URL (provided by backend after DWG upload)
  useEffect(() => {
    if (!dwgImageUrl) {
      setDwgImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setDwgImage(img);
    img.onerror = () => setDwgImage(null);
    img.src = dwgImageUrl;
  }, [dwgImageUrl]);

  // Compute scale transform for parsed rooms
  const validRooms = (parsedRooms ?? []).filter(
    (r) => r.boundaries && r.boundaries.length >= 3
  );
  const { scaleX, scaleY, offsetX, offsetY } = computeScaleTransform(
    validRooms,
    stageWidth,
    stageHeight
  );

  /** Convert a raw boundary point to canvas pixels */
  const toCanvas = (pt: { x: number; y: number }) => ({
    x: pt.x * scaleX + offsetX,
    y: pt.y * scaleY + offsetY,
  });

  const userScale = zoomLevel / 100;

  return (
    <div className="relative">
      <Stage
        ref={stageRef}
        width={scaledWidth}
        height={scaledHeight}
        onClick={onStageClick}
        scaleX={userScale}
        scaleY={userScale}
        style={{ cursor: isDrawing ? 'crosshair' : 'default' }}
      >
        <Layer>
          {/* ── Background Image (from backend) ─────────────────────────── */}
          {dwgImage && (
            <KonvaImage
              image={dwgImage}
              x={0}
              y={0}
              width={stageWidth}
              height={stageHeight}
              opacity={0.55}
            />
          )}

          {/* ── No image placeholder ─────────────────────────────────────── */}
          {!dwgImage && validRooms.length === 0 && (
            <Group>
              <Rect
                x={0}
                y={0}
                width={stageWidth}
                height={stageHeight}
                fill="#F9FAFB"
                stroke="#E5E7EB"
                strokeWidth={2}
              />
              <Text
                x={stageWidth / 2}
                y={stageHeight / 2}
                text="Upload a DWG file to see the floor plan"
                fontSize={14}
                fill="#9CA3AF"
                align="center"
                verticalAlign="middle"
                offsetX={160}
                offsetY={7}
              />
            </Group>
          )}

          {/* ── Parsed Room Polygons (backend geometry) ──────────────────── */}
          {validRooms.map((room, idx) => {
            const canvasPts = room.boundaries!.map(toCanvas);
            const flatPoints = canvasPts.flatMap((p) => [p.x, p.y]);
            const strokeColor =
              ROOM_STROKE_COLORS[idx % ROOM_STROKE_COLORS.length];

            // Compute centroid for label
            const cx =
              canvasPts.reduce((s, p) => s + p.x, 0) / canvasPts.length;
            const cy =
              canvasPts.reduce((s, p) => s + p.y, 0) / canvasPts.length;

            const isSelected =
              zones.find((z) => z.sourceRoomId === room.id)?.id ===
              selectedZoneId;

            return (
              <Group
                key={room.id}
                onClick={() => {
                  const zone = zones.find((z) => z.sourceRoomId === room.id);
                  if (zone) onZoneClick(zone.id);
                }}
                onTap={() => {
                  const zone = zones.find((z) => z.sourceRoomId === room.id);
                  if (zone) onZoneClick(zone.id);
                }}
              >
                <Line
                  points={flatPoints}
                  closed
                  fill={isSelected ? `${strokeColor}55` : `${strokeColor}25`}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  dash={isSelected ? [] : []}
                />
                {/* Room label */}
                <Rect
                  x={cx - 50}
                  y={cy - 10}
                  width={100}
                  height={20}
                  fill="rgba(255,255,255,0.85)"
                  cornerRadius={3}
                />
                <Text
                  x={cx}
                  y={cy}
                  text={room.name || 'Room'}
                  fontSize={10}
                  fontStyle="bold"
                  fill="#374151"
                  align="center"
                  verticalAlign="middle"
                  offsetX={50}
                  offsetY={5}
                  width={100}
                />
              </Group>
            );
          })}

          {/* ── Manually Drawn Zones (user-created on top) ───────────────── */}
          {zones
            .filter((z) => !z.sourceRoomId) // only manually created zones
            .map((zone) => {
              const isSelected = zone.id === selectedZoneId;
              const zoneColor = getZoneColor(zone.type);

              return (
                <Group
                  key={zone.id}
                  onClick={() => onZoneClick(zone.id)}
                  onTap={() => onZoneClick(zone.id)}
                >
                  <Rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.w}
                    height={zone.h}
                    fill={zoneColor}
                    opacity={0.65}
                    stroke={isSelected ? '#3B82F6' : '#9CA3AF'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    cornerRadius={6}
                  />
                  {/* Title pill */}
                  <Rect
                    x={zone.x + zone.w / 2 - 55}
                    y={zone.y + zone.h / 2 - 12}
                    width={110}
                    height={24}
                    fill="rgba(255,255,255,0.95)"
                    cornerRadius={4}
                    shadowBlur={4}
                    shadowColor="rgba(0,0,0,0.1)"
                  />
                  <Text
                    x={zone.x + zone.w / 2}
                    y={zone.y + zone.h / 2}
                    text={zone.name}
                    fontSize={11}
                    fontStyle="bold"
                    fill="#1F2937"
                    align="center"
                    verticalAlign="middle"
                    offsetX={55}
                    offsetY={6}
                    width={110}
                  />
                  {isSelected && (
                    <>
                      <Rect
                        x={zone.x}
                        y={zone.y + zone.h - 20}
                        width={zone.w}
                        height={20}
                        fill="rgba(0,0,0,0.6)"
                        cornerRadius={[0, 0, 6, 6]}
                      />
                      <Text
                        x={zone.x + zone.w / 2}
                        y={zone.y + zone.h - 10}
                        text={zone.type}
                        fontSize={9}
                        fill="#FFFFFF"
                        align="center"
                        verticalAlign="middle"
                        offsetX={zone.w / 2}
                        offsetY={4}
                        width={zone.w}
                      />
                    </>
                  )}
                </Group>
              );
            })}

          {/* ── Drawing Selection Preview ─────────────────────────────────── */}
          {isDrawing && selectionPoints.length > 0 && (
            <Group>
              {selectionPoints.length > 1 && (
                <Line
                  points={selectionPoints.flatMap((p) => [p.x, p.y])}
                  closed={false}
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dash={[6, 4]}
                  fill="rgba(59,130,246,0.15)"
                />
              )}
              {selectionPoints.map((point, idx) => (
                <Group key={idx}>
                  <Rect
                    x={point.x - 5}
                    y={point.y - 5}
                    width={10}
                    height={10}
                    fill="#3B82F6"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    cornerRadius={5}
                  />
                </Group>
              ))}
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default FloorPlanCanvas;