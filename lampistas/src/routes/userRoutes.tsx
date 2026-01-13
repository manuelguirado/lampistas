import ProtectedRoute from "./protectedRoute";
import RegisterUser from "../pages/users/userRegister";
import UserLogin from "../pages/users/userLogin";
import CreateIncident from "../pages/users/incidents/createIncident";
import MyMachinery from "../pages/users/myMachinery";
import { Routes, Route } from "react-router-dom";
import UserDashboard from "../pages/users/userDashboard";
import UserHome from "../pages/users/userrHome";
import UserBudgets from "../pages/users/userBudgets";
import IncidentIndex from "../pages/users/incidents/incidentIndex";
import IncidentLayout from "../pages/users/incidents/incidentLayout";
import IncidentHistory from "../pages/users/incidents/incidentHistory";
export default function UserRoutes() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="userRegister" element={<RegisterUser />} />
      <Route path="userLogin" element={<UserLogin />} />

      {/* Rutas protegidas */}
      <Route
        path="userdashboard"
        element={
          <ProtectedRoute userType="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      >
        {/* ✅ Ruta index - se muestra en /worker/workerdashboard */}
        <Route index element={<UserHome />} />
      </Route>
    
        <Route path="myMachinery" element={ <ProtectedRoute userType="user"><MyMachinery /></ProtectedRoute> } />
        <Route path="myBudgets" element={ <ProtectedRoute userType="user"><UserBudgets /></ProtectedRoute> } />
      <Route
        path="MisInciendencias/*"
        element={
          <ProtectedRoute userType="user">
            <IncidentLayout />
          </ProtectedRoute>
        }
      >
    
        <Route index element={<IncidentIndex />} />
        <Route path="createIncident" element={<CreateIncident />} />
        <Route path="incidentHistory" element={<IncidentHistory />} />
      </Route>
    </Routes>
  );
}
