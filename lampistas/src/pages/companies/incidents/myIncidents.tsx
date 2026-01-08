import Header from "../components/header";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, UserPlus, X } from "lucide-react";
import toast from 'react-hot-toast';
export default function MyIncidents() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<{ 
    incidentID: number; 
    name: string;
    description?: string;
    dateReported?: string;
    files?: Array<{
      bucketName?: string;
      key: string;
      signedUrl: string;
      size?: number;
      url?: string;
      lastModified?: Date;
      token: string;
    }>;
  } | null>(null);
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
function handleOpenIncidentModal(incident: { 
  incidentID: number; 
  name: string;
  description: string;
  dateReported: string;
}) {
  setSelectedIncident({
    incidentID: incident.incidentID,
    name: incident.name,
    description: incident.description,
    dateReported: incident.dateReported,
    files: []
  });
  setIsModalOpen(true);
  // Cargar archivos del trabajador para la incidencia seleccionada
  fetch(
    `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/listFiles?incidentID=${incident.incidentID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Fetched incident files:', data);
      // Verificar la estructura de la respuesta
      const files = Array.isArray(data) ? data : data.files || [];
      setSelectedIncident((prev) => prev ? { ...prev, files: files } : null);
    })
    .catch((error) => {
      console.error("Error fetching incident files:", error);
      toast.error("Error al cargar archivos: " + error.message);
      // Establecer archivos vacíos en caso de error
      setSelectedIncident((prev) => prev ? { ...prev, files: [] } : null);
    });
  

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
                
                </td>
                  <td className="py-2 px-4 border border-gray-300">
                     <button  
                       onClick={() => handleOpenIncidentModal({
                         incidentID: incident.IncidentsID,
                         name: incident.title,
                         description: incident.description,
                         dateReported: incident.createdAt
                       })} 
                       className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors font-semibold"
                     >
                      Ver Reportes del Trabajador
                     </button>
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

      {/* Modal para ver reportes del trabajador */}
      {isModalOpen && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Reportes del Trabajador
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Incident Info */}
            <div className="mb-4 p-3 bg-amber-50 rounded">
              <p className="text-sm text-gray-600">Incidencia:</p>
              <p className="font-semibold text-gray-800">
                {selectedIncident.name}
              </p>
              {selectedIncident.description && (
                <>
                  <p className="text-sm text-gray-600 mt-2">Descripción:</p>
                  <p className="font-semibold text-gray-800">
                    {selectedIncident.description}
                  </p>
                </>
              )}
              {selectedIncident.dateReported && (
                <>
                  <p className="text-sm text-gray-600 mt-2">Fecha de reporte:</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedIncident.dateReported).toLocaleString()}
                  </p>
                </>
              )}
            </div>

            {/* Files Section */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Archivos del Trabajador:</h4>
              {console.log('Rendering files:', selectedIncident.files)}
              {selectedIncident.files && selectedIncident.files.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedIncident.files.map((file, index) => {
                    const fileName = file.key.split('/').pop() || `Archivo ${index + 1}`;
                    const fileExtension = fileName.split('.').pop()?.toLowerCase();
                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '');
                    const isPdf = fileExtension === 'pdf';

                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800 truncate">
                            📎 {fileName}
                          </span>
                          {file.size && (
                            <span className="text-sm text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          )}
                        </div>
                        
                        {/* Preview para imágenes */}
                        {isImage && file.signedUrl && (
                          <div className="mb-2">
                            <img 
                              src={file.signedUrl} 
                              alt={fileName}
                              className="max-w-full h-32 object-cover rounded border"
                              onError={(e) => {
                                console.error('Error loading image:', file.signedUrl, file);
                                e.currentTarget.style.display = 'none';
                                // Mostrar mensaje de error
                                const errorDiv = document.createElement('div');
                                errorDiv.className = 'bg-red-100 p-2 rounded text-center';
                                errorDiv.innerHTML = '<span class="text-red-600 text-sm">⚠️ No se pudo cargar la imagen</span>';
                                e.currentTarget.parentNode?.appendChild(errorDiv);
                              }}
                              onLoad={() => {
                                console.log('Image loaded successfully:', file.signedUrl);
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Preview para PDFs */}
                        {isPdf && (
                          <div className="mb-2">
                            <div className="bg-red-100 p-2 rounded text-center">
                              <span className="text-red-600 font-medium">📄 PDF</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          {file.signedUrl && (
                            <a
                              href={file.signedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:bg-blue-100 text-sm flex-1 text-center py-1 px-2 bg-blue-50 rounded border-none cursor-pointer"
                            >
                              🔍 Ver
                            </a>
                          )}
                          {file.signedUrl && (
                            <button
                              onClick={() => {
                                // Función para descargar - puedes implementar la lógica aquí
                                window.open(file.signedUrl, '_blank');
                              }}
                              className="text-green-600 hover:bg-green-100 text-sm flex-1 text-center py-1 px-2 bg-green-50 rounded border-none cursor-pointer"
                            >
                              💾 Descargar
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay reportes del trabajador para esta incidencia.</p>
                  <p className="text-sm mt-2">Los archivos aparecerán aquí cuando el trabajador suba reportes.</p>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
