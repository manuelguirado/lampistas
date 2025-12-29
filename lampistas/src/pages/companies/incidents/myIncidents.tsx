import Header from "../components/header";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, UserPlus } from "lucide-react";
import toast from 'react-hot-toast';
export default function MyIncidents() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<{ incidentID: number; name: string } | null>(null);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [workers, setWorkers] = useState<
    Array<{ workerid: number; name: string }>
  >([]);
  const pageSize = 5;
  const offset = (currentPage - 1) * pageSize;

  const [incidents, setIncidents] = useState<
    Array<{
      IncidentsID: number;
      title: string;
      description: string;
      status: string;
      priority: string;
      createdAt: string;
      assignedWorkerID: number | null;
      assignedWorker?: { name: string };
    }>
  >([]);

  const token = localStorage.getItem("companyToken");
function handleOpenIncidentModal(incident: { incidentID: number; name: string }) {
        setSelectedIncident(incident);
        setIsModalOpen(true);
     
        
    }

    function handleCloseModal() {
        setIsModalOpen(false);
        setSelectedIncident(null);
    }
  // Cargar trabajadores
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/listWorkers?limit=100&offset=0`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data.workers || []);
      })
      .catch((err) => toast.error("Error fetching workers: " + (err as Error).message));
  }, [token]);

  // Cargar incidencias
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/listIncidents?limit=${pageSize}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setIncidents(data.incidents);
        setTotalIncidents(data.total);
      })
      .catch((error) => {
        toast.error("Error fetching incidents: " + (error as Error).message);
      });
  }, [currentPage, token, offset]);

  // Función para asignar trabajador
  async function handleAssignWorker(incidentID: number, workerID: number) {
    if (!workerID) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/assignIncident`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            incidentID,
            workerID,
          }),
        }
      );

      const data = await response.json();
     

      if (response.ok) {
        toast.success('¡Trabajador asignado exitosamente!');
        // Actualizar la lista para reflejar el cambio
        setIncidents((prev) =>
          prev.map((inc) =>
            inc.IncidentsID === incidentID
              ? { ...inc, assignedWorkerID: workerID }
              : inc
          )
        );
      } else {
        toast.error('Error: ' + (data.message || 'No se pudo asignar'));
      }
    } catch (error) {
      toast.error('Error al asignar trabajador: ' + (error as Error).message);
     
    }
  }

  const totalPages = Math.ceil(totalIncidents / pageSize);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">Mis Incidencias</h2>

      <div className="w-full max-w-7xl overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead>
            <tr className="bg-amber-200">
              <th className="py-2 px-4 border border-gray-300">ID</th>
              <th className="py-2 px-4 border border-gray-300">Título</th>
              <th className="py-2 px-4 border border-gray-300">Descripción</th>
              <th className="py-2 px-4 border border-gray-300">Estado</th>
              <th className="py-2 px-4 border border-gray-300">Prioridad</th>
              <th className="py-2 px-4 border border-gray-300">Fecha</th>
              <th className="py-2 px-4 border border-gray-300">Asignar a</th>
              <th className="py-2 px-4 border border-gray-300">Reportes del trabajador</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.IncidentsID} className="hover:bg-amber-50">
                <td className="py-2 px-4 border border-gray-300">
                  {incident.IncidentsID}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {incident.title}
                </td>
                <td className="py-2 px-4 border border-gray-300 max-w-xs truncate">
                  {incident.description}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      incident.status === "OPEN"
                        ? "bg-red-200 text-red-800"
                        : incident.status === "IN_PROGRESS"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {incident.status}
                  </span>
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      incident.priority === "HIGH"
                        ? "bg-red-200 text-red-800"
                        : incident.priority === "MEDIUM"
                        ? "bg-orange-200 text-orange-800"
                        : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    {incident.priority}
                  </span>
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {new Date(incident.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <div className="flex items-center gap-2">
                    <select
                      value={incident.assignedWorkerID || ""}
                      onChange={(e) =>
                        handleAssignWorker(
                          incident.IncidentsID,
                          Number(e.target.value)
                        )
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Sin asignar</option>
                      {workers.map((worker) => (
                        <option key={worker.workerid} value={worker.workerid}>
                          {worker.name}
                        </option>
                      ))}
                    </select>
                    {incident.assignedWorkerID && (
                      <UserPlus size={16} className="text-green-600" />
                    )}
                  </div>
                  <td className="py-2 px-4 border border-gray-300">
                     <button  onClick={() => handleOpenIncidentModal(incident)} className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors font-semibold">
                      Ver Reportes del Trabajador
                     </button>
                  </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center space-x-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} className="mr-2" />
          Anterior
        </button>
        <span className="font-semibold">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
          <ChevronRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
}
