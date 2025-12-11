import LoginCompany from "../pages/companies/loginCompany.tsx";
import DashboardCompany from "../pages/companies/dashboardCompany";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import CreateMachinery from "../pages/companies/machinery/createMachinery";
import RegisterWorker from "../pages/companies/worker/registerWorker";
import ListWorkers from "../pages/companies/worker/listWorkers";
import EditWorkers from "../pages/companies/worker/editWorkers";
import RegisterUser from "../pages/companies/clients/registerUser";
import ListClients from "../pages/companies/clients/listClients";
import CreateBudget from "../pages/companies/createBudget";
import MyIncidents from "../pages/companies/incidents/myIncidents";
import MachineryLayout from "../pages/companies/machinery/MachineryLayout";
import MachineryIndex from "../pages/companies/machinery/MachineryIndex";
import ListMachinery from "../pages/companies/machinery/listMachinery";
import EditMachinery from "../pages/companies/machinery/editMachinery";
import UpdateMaintence from "../pages/companies/machinery/updateMaintence";
import WorkerIndex from "../pages/companies/worker/workerIndex";
import WorkerLayout from "../pages/companies/worker/workerLayout";
import ClientLayout from "../pages/companies/clients/clientLayout";
import ClientsIndex from "../pages/companies/clients/clientsIndex";
import IncidentIndex from "../pages/companies/incidents/incidentIndex";
import IncidentLayout from "../pages/companies/incidents/incidentsLayout";
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
        path="crear-presupuesto"
        element={
          <ProtectedRoute userType="company">
            <CreateBudget />
          </ProtectedRoute>
        }
      />
     
      
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
      <Route path="trabajadores" element={
        <ProtectedRoute userType="company">
          <WorkerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<WorkerIndex />} />
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

      </Route>
      <Route path="clientes" element={
        <ProtectedRoute userType="company">
          <ClientLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ClientsIndex />} />
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
        
  
        </Route>
        <Route path="incidencias" element={
        <ProtectedRoute userType="company">
          <IncidentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<IncidentIndex />} />
         <Route path="Mis-incidencias" element={
        <ProtectedRoute userType="company">
          <MyIncidents />
        </ProtectedRoute>
      }> 
     
    
      </Route>
        
  
        </Route>
    </Routes>
    
  );
}
