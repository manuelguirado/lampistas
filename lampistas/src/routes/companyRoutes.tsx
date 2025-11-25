import LoginCompany from "../pages/companies/loginCompany";
import DashboardCompany from "../pages/companies/dashboardCompany";
import {Routes,Route} from 'react-router-dom';
import ProtectedRoute from './protectedRoute';
import RegisterWorker from "../pages/companies/registerWorker";
import ListWorkers from "../pages/companies/listWorkers";
import EditWorkers from "../pages/companies/editWorkers";
import RegisterUser from "../pages/companies/registerUser";
import ListClients from "../pages/companies/listClients";
import CreateBudget from "../pages/companies/createBudget";
export default function CompanyRoutes(){
    return (
        <Routes>
            {/* Ruta pública */}
            <Route path="companyLogin" element={<LoginCompany />} />
            
            {/* Rutas protegidas */}
            <Route path="dashboard" element={<ProtectedRoute userType="company"><DashboardCompany /></ProtectedRoute>} />
            <Route path="registrarTrabajador" element={<ProtectedRoute userType="company"><RegisterWorker /></ProtectedRoute>} />
            <Route path="misTrabajadores" element={<ProtectedRoute userType="company"><ListWorkers /></ProtectedRoute>} />
            <Route path="editarTrabajador" element={<ProtectedRoute userType="company"><EditWorkers /></ProtectedRoute>} />
            <Route path="registrarCliente" element={<ProtectedRoute userType="company"><RegisterUser /></ProtectedRoute>} />
            <Route path="mis-Clientes" element={<ProtectedRoute userType="company"><ListClients /></ProtectedRoute>} />
            <Route path="crear-presupuesto" element={<ProtectedRoute userType="company"><CreateBudget /></ProtectedRoute>} />
        </Routes>
    );
}