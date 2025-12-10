import ProtectedRoute from "./protectedRoute";
import RegisterUser from "../pages/users/userRegister";
import UserLogin from "../pages/users/userLogin";
import CreateIncident from "../pages/users/createIncident";
import MyMachinery from "../pages/users/myMachinery";
import { Routes, Route } from "react-router-dom";
import UserDashboard from "../pages/users/userDashboard";
import UserHome from "../pages/users/userrHome";
import UserBudgets from "../pages/users/userBudgets";
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
          <ProtectedRoute userType="worker">
            <UserDashboard />
          </ProtectedRoute>
        }
      >
        {/* ✅ Ruta index - se muestra en /worker/workerdashboard */}
        <Route index element={<UserHome />} />
      </Route>
        <Route path="createIncident" element={ <ProtectedRoute userType="worker"><CreateIncident /></ProtectedRoute> } />
        <Route path="myMachinery" element={ <ProtectedRoute userType="worker"><MyMachinery /></ProtectedRoute> } />
        <Route path="myBudgets" element={ <ProtectedRoute userType="worker"><UserBudgets /></ProtectedRoute> } />
      {/* Aquí puedes agregar rutas protegidas para usuarios si es necesario */}
    </Routes>
  );
}
