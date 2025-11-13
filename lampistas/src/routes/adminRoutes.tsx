import {Routes,Route} from 'react-router-dom';
import RegisterAdmin from '../pages/admin/registerAdmin';
import AdminLogin from '../pages/admin/adminLogin';
import DashboardAdmin from '../pages/admin/adminDashboard';
import RegisterCompany from '../pages/admin/registerCompany';

export default function AdminRoutes() {


    return (
        <Routes>
            <Route path="registerAdmin" element={<RegisterAdmin />} />
            <Route path="adminLogin" element={<AdminLogin />} />
            <Route path="adminDashboard/*" element={<DashboardAdmin />} />
            <Route path="registerCompany" element={<RegisterCompany />} />
        </Routes>
    );
}