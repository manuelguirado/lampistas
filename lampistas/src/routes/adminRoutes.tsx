import {Routes,Route} from 'react-router-dom';
import RegisterAdmin from '../pages/admin/adminAuth';

import DashboardAdmin from '../pages/admin/adminDashboard';
import RegisterCompany from '../pages/admin/registerCompany';
import ListCompany from '../pages/admin/listCompany';
import SuspendCompany from '../pages/admin/suspendCompany';
import EditCompany from '../pages/admin/editCompany';
import ProtectedRoute from './protectedRoute';
import AdminHome from '../pages/admin/adminHome';
import CreateNewsLetter from '../pages/admin/createNewsLetter';

export default function AdminRoutes() {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="registerAdmin" element={<RegisterAdmin />} />
       
            
            {/* Rutas protegidas */}
            <Route path="adminDashboard/*" element={<ProtectedRoute userType="admin"><DashboardAdmin /></ProtectedRoute>}
            >
                <Route index element={<ProtectedRoute userType="admin"><AdminHome /></ProtectedRoute>} />
            </Route>
            
            
            <Route path="registerCompany" element={<ProtectedRoute userType="admin"><RegisterCompany /></ProtectedRoute>} />
            <Route path="listCompany" element={<ProtectedRoute userType="admin"><ListCompany /></ProtectedRoute>} />
            <Route path="suspendCompany/:companyID" element={<ProtectedRoute userType="admin"><SuspendCompany /></ProtectedRoute>} />
            <Route path="editCompany" element={<ProtectedRoute userType="admin"><EditCompany /></ProtectedRoute>} />
            <Route path="createNewsLetter" element={<ProtectedRoute userType="admin"><CreateNewsLetter /></ProtectedRoute>} />
            
        </Routes>
    );
}