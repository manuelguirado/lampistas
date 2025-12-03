import ProtectedRoute from "./protectedRoute";
import RegisterUser from "../pages/users/userRegister";

import UserLogin from "../pages/users/userLogin";
import {Routes, Route} from "react-router-dom";
import UserDashboard from "../pages/users/userDashboard";
import UserHome from "../pages/users/userrHome";

export default function UserRoutes() {
    return (
        <Routes>
            {/* Ruta pública */}
            <Route path="userRegister" element={<RegisterUser />} />
            <Route path="userLogin" element={<UserLogin />} />

            {/* Rutas protegidas */}
            <Route path="userDashboard/*" element={<ProtectedRoute userType="user"><UserDashboard /></ProtectedRoute>} />
            <Route index element={<ProtectedRoute userType="user"><UserHome /></ProtectedRoute>} />
            {/* Aquí puedes agregar rutas protegidas para usuarios si es necesario */}
        </Routes>
    );
}