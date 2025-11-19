import LoginCompany from "../pages/companies/loginCompany";
import DashboardCompany from "../pages/companies/dashboardCompany";
import {Routes,Route} from 'react-router-dom';
import ProtectedRoute from './protectedRoute';

export default function CompanyRoutes(){
    return (
        <Routes>
            {/* Ruta pública */}
            <Route path="companyLogin" element={<LoginCompany />} />
            
            {/* Rutas protegidas */}
            <Route path="dashboard" element={<ProtectedRoute userType="company"><DashboardCompany /></ProtectedRoute>} />
        </Routes>
    );
}