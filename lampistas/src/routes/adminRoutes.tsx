import {Routes,Route} from 'react-router-dom';
import RegisterAdmin from '../pages/admin/registerAdmin';
import AdminLogin from '../pages/admin/adminLogin';
import DashboardAdmin from '../pages/admin/adminDashboard';
import RegisterCompany from '../pages/admin/registerCompany';
import ListCompany from '../pages/admin/listCompany';
import SuspendCompany from '../pages/admin/suspendCompany';
import EditCompany from '../pages/admin/editCompany';

export default function AdminRoutes() {


    return (
        <Routes>
            <Route path="registerAdmin" element={<RegisterAdmin />} />
            <Route path="adminLogin" element={<AdminLogin />} />
            <Route path="adminDashboard/*" element={<DashboardAdmin />} />
            <Route path="registerCompany" element={<RegisterCompany />} />
            <Route path="listCompany" element={<ListCompany />} />
            <Route path="suspendCompany" element={<SuspendCompany />} />
            <Route path="editCompany" element={<EditCompany />} />
        </Routes>
    );
}