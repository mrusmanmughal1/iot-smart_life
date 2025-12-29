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
import type { Stage as KonvaStage } from 'konva/lib/Stage';
import { useState, useEffect, useRef } from 'react';

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

// Floor Plan Canvas with Drop Zone
const FloorPlanCanvas: React.FC<{
  zones: Zone[];
  selectedZoneId: string | null;
  zoomLevel: number;
  dwgImageUrl?: string;
  dwgFile?: File;
  onZoneClick: (zoneId: string) => void;
  onStageClick: () => void;
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
              console.log(
                'Rendering to canvas, size:',
                scaledWidth,
                'x',
                scaledHeight
              );
              const canvas = canvasRef.current;

              // Make canvas temporarily visible for getBoundingClientRect to work
              const originalDisplay = canvas.style.display;
              canvas.style.display = 'block';
              canvas.style.width = scaledWidth + 'px';
              canvas.style.height = scaledHeight + 'px';

              // Force a reflow to ensure dimensions are set
              void canvas.offsetHeight;

              // Render the DXF to canvas (this will use getBoundingClientRect)
              try {
                EnhancedCADParser.renderDXFToCanvas(dxf, canvas);
                console.log('DXF rendered to canvas');

                // Hide canvas again
                canvas.style.display = originalDisplay || 'none';

                // Convert canvas to image
                const img = new Image();
                img.onload = () => {
                  console.log(
                    'DWG image loaded successfully, dimensions:',
                    img.width,
                    'x',
                    img.height
                  );
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
                console.log(
                  'Canvas data URL generated, length:',
                  dataUrl.length
                );
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

  return (
    <div className="relative">
      {/* Hidden canvas for DWG rendering */}
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
        onClick={onStageClick}
        style={{ cursor: isDrawing ? 'crosshair' : 'default' }}
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
        </Layer>
      </Stage>
    </div>
  );
};
export default FloorPlanCanvas;