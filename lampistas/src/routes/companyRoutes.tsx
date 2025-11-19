import LoginCompany from "../pages/companies/loginCompany";
import DashboardCompany from "../pages/companies/dashboardCompany";
import {Routes,Route} from 'react-router-dom';
import ProtectedRoute from './protectedRoute';
import RegisterWorker from "../pages/companies/registerWorker";

export default function CompanyRoutes(){
    return (
        <Routes>
            {/* Ruta pública */}
            <Route path="companyLogin" element={<LoginCompany />} />
            
            {/* Rutas protegidas */}
            <Route path="dashboard" element={<ProtectedRoute userType="company"><DashboardCompany /></ProtectedRoute>} />
            <Route path="registrarTrabajador" element={<ProtectedRoute userType="company"><RegisterWorker /></ProtectedRoute>} />
        </Routes>
    );
}