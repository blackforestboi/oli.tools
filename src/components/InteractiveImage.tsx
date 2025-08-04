import React, { useState, useRef } from "react";
import styled from "styled-components";
import { PROJECTS, type Project } from "../constants/projects";

export interface HoverArea {
  id: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  width: number; // percentage of image width (0-100)
  height: number; // percentage of image height (0-100)
  label?: string;
  project_id?: string;
}

interface InteractiveImageProps {
  imageSrc: string;
  hoverAreas: HoverArea[];
  onAreaHover?: (area: HoverArea) => void;
  onAreaLeave?: (area: HoverArea) => void;
  onAreaClick?: (area: HoverArea) => void;
}

export const InteractiveImage: React.FC<InteractiveImageProps> = ({
  imageSrc,
  hoverAreas,
  onAreaHover,
  onAreaLeave,
  onAreaClick,
}) => {
  const [hoveredArea, setHoveredArea] = useState<HoverArea | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    text: "",
    visible: false,
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAreaMouseEnter = (area: HoverArea, event: React.MouseEvent) => {
    setHoveredArea(area);
    onAreaHover?.(area);
  };

  const handleAreaMouseLeave = (area: HoverArea) => {
    setHoveredArea(null);
    onAreaLeave?.(area);
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const handleAreaClick = (area: HoverArea) => {
    onAreaClick?.(area);

    console.log(area);

    // Find the project associated with this area
    if (area.project_id) {
      const project = PROJECTS.find((p) => p.id === area.project_id);
      if (project) {
        setSelectedProject(project);
      }
    }
  };

  const closeOverlay = () => {
    setSelectedProject(null);
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeOverlay();
    }
  };

  return (
    <>
      <ImageContainer ref={containerRef}>
        <BackgroundImage backgroundImage={imageSrc} />
        <ImageWrapper>
          <StyledImage src={imageSrc} alt="Interactive image" />

          {hoverAreas.map((area) => (
            <HoverAreaOverlay
              key={area.id}
              x={area.x}
              y={area.y}
              width={area.width}
              height={area.height}
              isHovered={hoveredArea?.id === area.id}
              onMouseEnter={(e) => handleAreaMouseEnter(area, e)}
              onMouseLeave={() => handleAreaMouseLeave(area)}
              onClick={() => handleAreaClick(area)}
            />
          ))}
        </ImageWrapper>
      </ImageContainer>

      {selectedProject && (
        <>
          <OverlayBackdrop onClick={handleBackdropClick} />
          <OverlayContent>
            <CloseButton onClick={closeOverlay}>&times;</CloseButton>

            <ProjectTitle>{selectedProject.title.toUpperCase()}</ProjectTitle>
            <ProjectDescription>
              {selectedProject.description}
            </ProjectDescription>

            {selectedProject.status === "live" && selectedProject.url ? (
              <LabelContainer>
                <VisitButton
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit
                </VisitButton>
              </LabelContainer>
            ) : (
              <LabelContainer>
                <ComingSoonText>Coming Soon</ComingSoonText>
              </LabelContainer>
            )}

            {selectedProject.collaborators &&
              selectedProject.collaborators.length > 0 && (
                <CollaboratorsSection>
                  <CollaboratorsTitle>Collaborators</CollaboratorsTitle>
                  <CollaboratorsList>
                    {selectedProject.collaborators.map(
                      (collaborator, index) => (
                        <CollaboratorLink
                          key={index}
                          href={collaborator.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {collaborator.name}
                        </CollaboratorLink>
                      )
                    )}
                  </CollaboratorsList>
                </CollaboratorsSection>
              )}
          </OverlayContent>
        </>
      )}

      <Tooltip x={tooltip.x} y={tooltip.y} visible={tooltip.visible}>
        {tooltip.text}
      </Tooltip>
    </>
  );
};

const ImageContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackgroundImage = styled.div<{ backgroundImage?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: ${(props) =>
    props.backgroundImage ? `url(${props.backgroundImage})` : "none"};
  background-size: 120% 120%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(8px) brightness(0.3);
  z-index: 0;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
  background-color: rgba(255, 0, 0, 0.1);
  height: 100vh;
  width: fit-content;
  z-index: 1;
`;

const StyledImage = styled.img`
  height: 100vh;
  width: auto;
  object-fit: contain;
  user-select: none;
`;

const HoverAreaOverlay = styled.div<{
  x: number;
  y: number;
  width: number;
  height: number;
  isHovered: boolean;
}>`
  position: absolute;
  left: ${(props) => props.x}%;
  top: ${(props) => props.y}%;
  width: ${(props) => props.width}%;
  height: ${(props) => props.height}%;
  background-color: ${(props) =>
    props.isHovered ? "rgba(255, 255, 0, 0.3)" : "transparent"};
  border: ${(props) => (props.isHovered ? "2px solid yellow" : "none")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 0, 0.3);
    border: 2px solid yellow;
  }
`;

const Tooltip = styled.div<{ x: number; y: number; visible: boolean }>`
  position: fixed;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  z-index: 1000;
  white-space: nowrap;
`;

// New overlay components
const OverlayBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  cursor: pointer;
`;

const OverlayContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url("/paper_background.png");
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  padding: 32px 40px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 2001;
  cursor: default;
  font-family: "Itim", cursive;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: #333;
  }
`;

const ProjectTitle = styled.h2`
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 900;
  color: #321919;
  font-family: "Itim", cursive;
`;

const ProjectDescription = styled.p`
  margin: 0 0 24px 0;
  font-size: 20px;
  line-height: 1.6;
  font-weight: 400;
  color: #251515;
  font-family: "Itim", cursive;
`;

const CollaboratorsSection = styled.div`
  margin-top: 24px;
`;

const CollaboratorsTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CollaboratorsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CollaboratorLink = styled.a`
  color: #a3d0ff;
  text-decoration: none;
  font-size: 18px;
  transition: color 0.2s ease;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;

const VisitButton = styled.a`
  display: inline-block;
  padding: 12px 24px;
  backdrop-filter: blur(2px);
  background-color: rgba(14, 11, 11, 0.1);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  margin-top: 16px;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
  }
`;

const ComingSoonText = styled.span`
  display: inline-block;
  padding: 12px 24px;
  backdrop-filter: blur(2px);
  background-color: #a0a07e43;

  color: white;
  border-radius: 60px;
  font-weight: 600;
  font-size: 14px;
  margin-top: 16px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 14px;
  right: 30px;
`;
