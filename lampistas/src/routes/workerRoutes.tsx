import ProtectedRoute from "./protectedRoute";
import WorkerLogin from "../pages/worker/workerLogin";
import { Routes, Route } from "react-router-dom";
import WorkerDashboard from "../pages/worker/workerDashboard";
import WorkerHome from "../pages/worker/workerHome";
import WorkerShifts from "../pages/worker/workerShifts";
import IncidentHistory from "../pages/worker/workerHistory";

export default function WorkerRoutes() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="workerLogin" element={<WorkerLogin />} />

      {/* Rutas protegidas - Dashboard como contenedor */}
      <Route
        path="workerdashboard"
        element={
          <ProtectedRoute userType="worker">
            <WorkerDashboard />
          </ProtectedRoute>
        }
      >
        {/* ✅ Ruta index - se muestra en /worker/workerdashboard */}
        <Route index element={<WorkerHome />} />
      </Route>

      {/* ✅ Ruta independiente para guardias */}
      <Route
        path="misGuardias"
        element={
          <ProtectedRoute userType="worker">
            <WorkerShifts />
          </ProtectedRoute>
        }
      />
      <Route
        path="incidentHistory"
        element={
          <ProtectedRoute userType="worker">
            <IncidentHistory />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
