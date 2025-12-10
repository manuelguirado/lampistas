import LoginCompany from "../pages/companies/loginCompany";
import DashboardCompany from "../pages/companies/dashboardCompany";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import CreateMachinery from "../pages/companies/createMachinery";
import RegisterWorker from "../pages/companies/registerWorker";
import ListWorkers from "../pages/companies/listWorkers";
import EditWorkers from "../pages/companies/editWorkers";
import RegisterUser from "../pages/companies/registerUser";
import ListClients from "../pages/companies/listClients";
import CreateBudget from "../pages/companies/createBudget";
import MyIncidents from "../pages/companies/myIncidents";
import MachineryLayout from "../pages/companies/machinery/MachineryLayout";
import MachineryIndex from "../pages/companies/machinery/MachineryIndex";
import ListMachinery from "../pages/companies/listMachinery";
import EditMachinery from "../pages/companies/editMachinery";
import UpdateMaintence from "../pages/companies/updateMaintence";

export default function CompanyRoutes() {
  return (
    <Routes >
      {/* Ruta pública */}
      <Route path="companyLogin" element={<LoginCompany />} />

      {/* Rutas protegidas */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute userType="company">
            <DashboardCompany />
          </ProtectedRoute>
        }
      />
      <Route
        path="registrarTrabajador"
        element={
          <ProtectedRoute userType="company">
            <RegisterWorker />
          </ProtectedRoute>
        }
      />
      <Route
        path="misTrabajadores"
        element={
          <ProtectedRoute userType="company">
            <ListWorkers />
          </ProtectedRoute>
        }
      />
      <Route
        path="editarTrabajador"
        element={
          <ProtectedRoute userType="company">
            <EditWorkers />
          </ProtectedRoute>
        }
      />
      <Route
        path="registrarCliente"
        element={
          <ProtectedRoute userType="company">
            <RegisterUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="mis-Clientes"
        element={
          <ProtectedRoute userType="company">
            <ListClients />
          </ProtectedRoute>
        }
      />
      <Route
        path="crear-presupuesto"
        element={
          <ProtectedRoute userType="company">
            <CreateBudget />
          </ProtectedRoute>
        }
      />
      <Route path="Mis-incidencias" element={
        <ProtectedRoute userType="company">
          <MyIncidents />
        </ProtectedRoute>
      }> 
     
    
      </Route>
      
      {/* Nested routes para maquinaria */}
      <Route
        path="maquinaria"
        element={
          <ProtectedRoute userType="company">
            <MachineryLayout />
          </ProtectedRoute>
        }
      >
        {/* Ruta index - se muestra cuando estás en /company/maquinaria */}
        <Route index element={<MachineryIndex />} />
        
        {/* Rutas hijas - /company/maquinaria/crear, /company/maquinaria/listar, etc */}
        <Route path="crearMaquinaria" element={<CreateMachinery />} />
        <Route path="listarMaquinaria" element={<ListMachinery />} />
        <Route path="editarMaquinaria/:machineryID" element={<EditMachinery />} />
        <Route path="actualizarMantenimiento" element={<UpdateMaintence />} />
      </Route>
    </Routes>
    
  );
}
