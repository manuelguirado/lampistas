import LoginCompany from "../pages/empresas/loginCompany";
import DashboardCompany from "../pages/empresas/dashboardCompany";
import {Routes,Route} from 'react-router-dom';

export default function CompanyRoutes(){
    return (
        <Routes>
            <Route path="companyLogin" element={<LoginCompany />} />
            <Route path="dashboard" element={<DashboardCompany />} />
        </Routes>
    );
}