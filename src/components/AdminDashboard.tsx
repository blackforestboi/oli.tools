import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import type { HoverArea } from "./InteractiveImage";
import { HOVER_AREAS } from "../constants/hoverAreas";
import { PROJECTS } from "../constants/projects";

interface AdminDashboardProps {
  imageSrc: string;
  onSave: (areas: HoverArea[]) => void;
  initialAreas?: HoverArea[];
}

const DashboardContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 10000;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Header = styled.div`
  background-color: #1a1a1a;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
`;

const Title = styled.h1`
  color: white;
  margin: 0;
  font-size: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" | "danger" }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  ${(props) => {
    switch (props.variant) {
      case "primary":
        return `
          background-color: #007bff;
          color: white;
          &:hover { background-color: #0056b3; }
        `;
      case "danger":
        return `
          background-color: #dc3545;
          color: white;
          &:hover { background-color: #c82333; }
        `;
      default:
        return `
          background-color: #6c757d;
          color: white;
          &:hover { background-color: #545b62; }
        `;
    }
  }}
`;

const ImageContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  display: block;
`;

const DraggableRectangle = styled.div<{
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
}>`
  position: absolute;
  left: ${(props) => props.x}%;
  top: ${(props) => props.y}%;
  width: ${(props) => props.width}%;
  height: ${(props) => props.height}%;
  border: 2px solid ${(props) => (props.isSelected ? "#00ff00" : "#ff0000")};
  background-color: ${(props) =>
    props.isSelected ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)"};
  cursor: move;
  user-select: none;
  z-index: 5;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background-color: ${(props) => (props.isSelected ? "#00ff00" : "#ff0000")};
    cursor: se-resize;
  }
`;

const RectangleLabel = styled.div`
  position: absolute;
  top: -20px;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 2px;
`;

const Sidebar = styled.div`
  width: 300px;
  height: 100%;
  background-color: #1a1a1a;
  border-left: 1px solid #333;
  padding: 16px;
  overflow-y: auto;
  flex-shrink: 0;
`;

const SidebarTitle = styled.h3`
  color: white;
  margin: 0 0 16px 0;
  font-size: 18px;
`;

const AreaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AreaItem = styled.div<{ isSelected: boolean }>`
  padding: 8px;
  background-color: ${(props) => (props.isSelected ? "#007bff" : "#2a2a2a")};
  border-radius: 4px;
  cursor: pointer;
  color: white;
  font-size: 12px;

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#0056b3" : "#3a3a3a")};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: white;
  font-size: 14px;
  margin-bottom: 8px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: white;
  font-size: 14px;
  margin-bottom: 8px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  option {
    background-color: #2a2a2a;
    color: white;
  }
`;

const Label = styled.label`
  color: white;
  font-size: 12px;
  margin-bottom: 4px;
  display: block;
`;

const JSONOutput = styled.pre`
  background-color: #2a2a2a;
  color: #00ff00;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  margin-top: 16px;
  border: 1px solid #333;
`;

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  imageSrc,
  onSave,
  initialAreas = [],
}) => {
  const [areas, setAreas] = useState<HoverArea[]>(
    initialAreas.length > 0 ? initialAreas : HOVER_AREAS
  );
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStart, setDrawingStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [draggedArea, setDraggedArea] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [resizingArea, setResizingArea] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 }
  );
  const [_, setActualImageSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      // Get the actual image dimensions
      const actualWidth = imageRef.current.naturalWidth;
      const actualHeight = imageRef.current.naturalHeight;
      setActualImageSize({ width: actualWidth, height: actualHeight });

      // Get the displayed image dimensions
      const rect = imageRef.current.getBoundingClientRect();
      setImageSize({ width: rect.width, height: rect.height });
    }
  }, []);

  const getMousePosition = (
    event: React.MouseEvent
  ): { x: number; y: number } | null => {
    if (!imageRef.current) return null;

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return { x, y };
  };

  const getPercentagePosition = (
    x: number,
    y: number
  ): { x: number; y: number } => {
    // Convert displayed coordinates to percentage based on actual image dimensions
    return {
      x: (x / imageSize.width) * 100,
      y: (y / imageSize.height) * 100,
    };
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    // Check if we clicked on a rectangle
    const target = event.target as HTMLElement;
    if (target.closest("[data-rectangle]")) {
      return; // Let the rectangle handle the event
    }

    const pos = getMousePosition(event);
    if (!pos) return;

    setIsDrawing(true);
    setDrawingStart(pos);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDrawing || !drawingStart) return;

    const pos = getMousePosition(event);
    if (!pos) return;

    // Drawing logic remains the same for creating new areas
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (!isDrawing || !drawingStart) return;

    const pos = getMousePosition(event);
    if (!pos) return;

    const startPercent = getPercentagePosition(drawingStart.x, drawingStart.y);
    const endPercent = getPercentagePosition(pos.x, pos.y);

    const newArea: HoverArea = {
      id: `area_${Date.now()}`,
      x: Math.min(startPercent.x, endPercent.x),
      y: Math.min(startPercent.y, endPercent.y),
      width: Math.abs(endPercent.x - startPercent.x),
      height: Math.abs(endPercent.y - startPercent.y),
      label: `Area ${areas.length + 1}`,
    };

    setAreas((prev) => [...prev, newArea]);
    setIsDrawing(false);
    setDrawingStart(null);
  };

  const handleRectangleMouseDown = (
    event: React.MouseEvent,
    areaId: string
  ) => {
    event.stopPropagation();
    setSelectedArea(areaId);

    const pos = getMousePosition(event);
    if (!pos) return;

    setDraggedArea(areaId);
    setDragStart(pos);
  };

  const handleRectangleMouseMove = (event: React.MouseEvent) => {
    if (!draggedArea || !dragStart) return;

    const pos = getMousePosition(event);
    if (!pos) return;

    const deltaX = pos.x - dragStart.x;
    const deltaY = pos.y - dragStart.y;

    const deltaXPercent = (deltaX / imageSize.width) * 100;
    const deltaYPercent = (deltaY / imageSize.height) * 100;

    setAreas((prev) =>
      prev.map((area) => {
        if (area.id === draggedArea) {
          return {
            ...area,
            x: Math.max(0, Math.min(100 - area.width, area.x + deltaXPercent)),
            y: Math.max(0, Math.min(100 - area.height, area.y + deltaYPercent)),
          };
        }
        return area;
      })
    );

    setDragStart(pos);
  };

  const handleRectangleMouseUp = () => {
    setDraggedArea(null);
    setDragStart(null);
  };

  const handleResizeMouseDown = (event: React.MouseEvent, areaId: string) => {
    event.stopPropagation();
    setSelectedArea(areaId);
    setResizingArea(areaId);

    const pos = getMousePosition(event);
    if (!pos) return;

    setResizeStart(pos);
  };

  const handleResizeMouseMove = (event: React.MouseEvent) => {
    if (!resizingArea || !resizeStart) return;

    const pos = getMousePosition(event);
    if (!pos) return;

    const deltaX = pos.x - resizeStart.x;
    const deltaY = pos.y - resizeStart.y;

    const deltaXPercent = (deltaX / imageSize.width) * 100;
    const deltaYPercent = (deltaY / imageSize.height) * 100;

    setAreas((prev) =>
      prev.map((area) => {
        if (area.id === resizingArea) {
          const newWidth = Math.max(10, area.width + deltaXPercent);
          const newHeight = Math.max(10, area.height + deltaYPercent);

          return {
            ...area,
            width: Math.min(newWidth, 100 - area.x),
            height: Math.min(newHeight, 100 - area.y),
          };
        }
        return area;
      })
    );

    setResizeStart(pos);
  };

  const handleResizeMouseUp = () => {
    setResizingArea(null);
    setResizeStart(null);
  };

  const handleDeleteArea = (areaId: string) => {
    setAreas((prev) => prev.filter((area) => area.id !== areaId));
    if (selectedArea === areaId) {
      setSelectedArea(null);
    }
  };

  const handleUpdateArea = (areaId: string, updates: Partial<HoverArea>) => {
    setAreas((prev) =>
      prev.map((area) => (area.id === areaId ? { ...area, ...updates } : area))
    );
  };

  const handleSave = () => {
    onSave(areas);
  };

  const handleExport = () => {
    const json = JSON.stringify(areas, null, 2);
    navigator.clipboard.writeText(json);
    alert("JSON copied to clipboard!");
  };

  const handleClose = () => {
    onSave(areas);
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard - Draw Hover Areas</Title>
        <ButtonGroup>
          <Button onClick={handleExport}>Export JSON</Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </ButtonGroup>
      </Header>

      <MainContent>
        <ImageContainer>
          <ImageWrapper>
            <StyledImage
              ref={imageRef}
              src={imageSrc}
              alt="Admin image"
              onLoad={handleImageLoad}
            />

            {/* Draggable rectangles */}
            {areas.map((area, index) => (
              <DraggableRectangle
                key={area.id}
                data-rectangle="true"
                x={area.x}
                y={area.y}
                width={area.width}
                height={area.height}
                isSelected={selectedArea === area.id}
                onMouseDown={(e) => handleRectangleMouseDown(e, area.id)}
                onMouseMove={handleRectangleMouseMove}
                onMouseUp={handleRectangleMouseUp}
              >
                <RectangleLabel>Area {index + 1}</RectangleLabel>
                {/* Resize handle */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "10px",
                    height: "10px",
                    backgroundColor:
                      selectedArea === area.id ? "#00ff00" : "#ff0000",
                    cursor: "se-resize",
                  }}
                  onMouseDown={(e) => handleResizeMouseDown(e, area.id)}
                  onMouseMove={handleResizeMouseMove}
                  onMouseUp={handleResizeMouseUp}
                />
              </DraggableRectangle>
            ))}

            {/* Drawing canvas for new areas */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                cursor: "crosshair",
                pointerEvents: "auto",
                zIndex: 1,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </ImageWrapper>
        </ImageContainer>

        <Sidebar>
          <SidebarTitle>Hover Areas ({areas.length})</SidebarTitle>

          <AreaList>
            {areas.map((area, index) => {
              const project = area.project_id
                ? PROJECTS.find((p) => p.id === area.project_id)
                : null;
              return (
                <AreaItem
                  key={area.id}
                  isSelected={selectedArea === area.id}
                  onClick={() => setSelectedArea(area.id)}
                >
                  <div>Area {index + 1}</div>
                  <div style={{ fontSize: "10px", opacity: 0.7 }}>
                    {area.x.toFixed(1)}%, {area.y.toFixed(1)}% -{" "}
                    {area.width.toFixed(1)}x{area.height.toFixed(1)}
                  </div>
                  {project && (
                    <div
                      style={{
                        fontSize: "10px",
                        opacity: 0.5,
                        color: "#007bff",
                      }}
                    >
                      {project.title}
                    </div>
                  )}
                </AreaItem>
              );
            })}
          </AreaList>

          {selectedArea && (
            <div style={{ marginTop: "16px" }}>
              <Label>Label:</Label>
              <Input
                value={areas.find((a) => a.id === selectedArea)?.label || ""}
                onChange={(e) =>
                  handleUpdateArea(selectedArea, { label: e.target.value })
                }
                placeholder="Enter label..."
              />

              <Label>Project:</Label>
              <Select
                value={
                  areas.find((a) => a.id === selectedArea)?.project_id || ""
                }
                onChange={(e) =>
                  handleUpdateArea(selectedArea, {
                    project_id: e.target.value || undefined,
                  })
                }
              >
                <option value="">No Project</option>
                {PROJECTS.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </Select>

              <Button
                variant="danger"
                onClick={() => handleDeleteArea(selectedArea)}
                style={{ width: "100%", marginTop: "8px" }}
              >
                Delete Area
              </Button>
            </div>
          )}

          <JSONOutput>{JSON.stringify(areas, null, 2)}</JSONOutput>
        </Sidebar>
      </MainContent>
    </DashboardContainer>
  );
};
