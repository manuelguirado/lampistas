import {Routes,Route} from 'react-router-dom';
import RegisterAdmin from '../pages/admin/registerAdmin';
import AdminLogin from '../pages/admin/adminLogin';
import DashboardAdmin from '../pages/admin/adminDashboard';
import RegisterCompany from '../pages/admin/registerCompany';
import ListCompany from '../pages/admin/listCompany';
import SuspendCompany from '../pages/admin/suspendCompany';
import EditCompany from '../pages/admin/editCompany';
import ProtectedRoute from './protectedRoute';

export default function AdminRoutes() {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="registerAdmin" element={<RegisterAdmin />} />
            <Route path="adminLogin" element={<AdminLogin />} />
            
            {/* Rutas protegidas */}
            <Route path="adminDashboard/*" element={<ProtectedRoute userType="admin"><DashboardAdmin /></ProtectedRoute>} />
            <Route path="registerCompany" element={<ProtectedRoute userType="admin"><RegisterCompany /></ProtectedRoute>} />
            <Route path="listCompany" element={<ProtectedRoute userType="admin"><ListCompany /></ProtectedRoute>} />
            <Route path="suspendCompany" element={<ProtectedRoute userType="admin"><SuspendCompany /></ProtectedRoute>} />
            <Route path="editCompany" element={<ProtectedRoute userType="admin"><EditCompany /></ProtectedRoute>} />
        </Routes>
    );
}