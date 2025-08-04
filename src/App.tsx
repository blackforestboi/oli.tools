import { useState } from "react";
import styled from "styled-components";
import {
  InteractiveImage,
  type HoverArea,
} from "./components/InteractiveImage";
import { AdminDashboard } from "./components/AdminDashboard";
import { HOVER_AREAS } from "./constants/hoverAreas";
import "./App.css";

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const AdminButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const Notification = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #28a745;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 1001;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

function App() {
  const [hoverAreas, setHoverAreas] = useState<HoverArea[]>(HOVER_AREAS);
  const [showAdmin, setShowAdmin] = useState(false);
  const [notification, setNotification] = useState("");

  const handleAreaHover = (area: HoverArea) => {
    console.log("Hovered area:", area);
  };

  const handleAreaLeave = (area: HoverArea) => {
    console.log("Left area:", area);
  };

  const handleAdminSave = (areas: HoverArea[]) => {
    setHoverAreas(areas);
    setShowAdmin(false);
    setNotification("Hover areas saved!");
    setTimeout(() => setNotification(""), 2000);
  };

  const toggleAdmin = () => {
    setShowAdmin(!showAdmin);
  };

  return (
    <AppContainer>
      <InteractiveImage
        imageSrc="/main_image.png"
        hoverAreas={hoverAreas}
        onAreaHover={handleAreaHover}
        onAreaLeave={handleAreaLeave}
      />

      {import.meta.env.DEV && (
        <AdminButton onClick={toggleAdmin}>
          {showAdmin ? "Close Admin" : "Admin Dashboard"}
        </AdminButton>
      )}

      <Notification visible={!!notification}>{notification}</Notification>

      {showAdmin && import.meta.env.DEV && (
        <AdminDashboard
          imageSrc="/main_image.png"
          onSave={handleAdminSave}
          initialAreas={hoverAreas}
        />
      )}
    </AppContainer>
  );
}

export default App;
