import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { Lights } from "./components/Lights";
import { Climate } from "./components/Climate";
import { Security } from "./components/Security";
import { Appliances } from "./components/Appliances";
import { Energy } from "./components/Energy";
import { Rooms } from "./components/Rooms";
import { Login } from "./components/Login";
import { UserManagement } from "./components/UserManagement";
import { Environmental } from "./components/Environmental";
import { SecurityMonitoring } from "./components/SecurityMonitoring";
import { Automation } from "./components/Automation";
import { FaceID } from "./components/FaceID";
import { ActivityLog } from "./components/ActivityLog";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "lights", Component: Lights },
      { path: "climate", Component: Climate },
      { path: "security", Component: Security },
      { path: "appliances", Component: Appliances },
      { path: "energy", Component: Energy },
      { path: "rooms", Component: Rooms },
      { path: "users", Component: UserManagement },
      { path: "environmental", Component: Environmental },
      { path: "security-monitoring", Component: SecurityMonitoring },
      { path: "automation", Component: Automation },
      { path: "faceid", Component: FaceID },
      { path: "activity-log", Component: ActivityLog },
    ],
  },
]);