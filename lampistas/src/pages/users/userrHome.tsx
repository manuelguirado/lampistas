import Header from "./components/header";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { IncidentType } from "../../types/incidentType";
import toast from "react-hot-toast";
export default function WorkerHome() {
  const [myIncidents, setMyIncidents] = useState<IncidentType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<{
    incidentID: number;
    name: string;
    files: Array<{
      key: string;
      signedUrl: string;
      size?: number;
      lastModified?: Date;
      token: string;
    }>;
    description: string;
    dateReported: Date;
  } | null>(null);
  const token = localStorage.getItem("userToken");
  
  function handleOpenIncidentModal(incident: {
    incidentID: number;
    name: string;
    files: Array<{
      key: string;
      signedUrl: string;
      size?: number;
      lastModified?: Date;
      token: string;
    }>;
    description: string;
    dateReported: Date;
  }) {
    setSelectedIncident(incident);
    setIsModalOpen(true);
    // Cargar archivos cuando se abra la modal
    fetchIncidentFiles(incident.incidentID);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedIncident(null);
  }
  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      }/user/myIncidents`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.incidents)) {
          setMyIncidents(data.incidents);
        }
      });
  }, [token]);
  function fetchIncidentFiles(incidentID: number): void {
    try {
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/user/listFiles/${incidentID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched files:", data);
          if (data && Array.isArray(data)) {
            setSelectedIncident((prevIncident) =>
              prevIncident
                ? { ...prevIncident, files: data }
                : prevIncident
            );
          } else {
            setSelectedIncident((prevIncident) =>
              prevIncident
                ? { ...prevIncident, files: [] }
                : prevIncident
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching files:", error);
          toast.error("Error al cargar archivos");
        });
    } catch (error) {
      toast.error("Error fetching files: " + (error as Error).message);
    }
  }

  // Función para descargar archivos
  async function downloadFile(file: { key: string; signedUrl: string; token?: string }, fileName: string) {
    try {
      const response = await fetch(file.signedUrl, {
        method: 'GET',
        headers: {
          ...(file.token && { 'Authorization': `Bearer ${file.token}` })
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Archivo descargado exitosamente');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error al descargar el archivo');
      // Fallback: abrir en nueva ventana
      window.open(file.signedUrl, '_blank');
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">Mis Incidencias</h2>

      <div className="w-full max-w-7xl overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead>
            <tr className="bg-amber-200">
              <th className="py-2 px-4 border border-gray-300 text-left">ID</th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Título
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Fecha de Reporte
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Estado
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Prioridad
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Ver incidencia
              </th>
            </tr>
          </thead>
          <tbody>
            {myIncidents.map((incident) => (
              <tr key={incident.IncidentsID} className="hover:bg-amber-50">
                <td className="py-2 px-4 border border-gray-300">
                  {incident.IncidentsID}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {incident.title}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {incident.dateReported instanceof Date
                    ? incident.dateReported.toLocaleString("")
                    : incident.dateReported}
                </td>

                <td className="py-2 px-4 border border-gray-300">
                  {incident.status}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {incident.priority}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <button
                    onClick={() =>
                      handleOpenIncidentModal({
                        incidentID: incident.IncidentsID,
                        name: incident.title,
                        files: [],
                        description: incident.description,
                        dateReported: incident.dateReported,
                      })
                    }
                    className="text-blue-600 hover:underline"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Detalles de la Incidencia
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Worker Info */}
            <div className="mb-4 p-3 bg-amber-50 rounded">
              <p className="text-sm text-gray-600">Incidencia:</p>
              <p className="font-semibold text-gray-800">
                {selectedIncident.name}
              </p>
              <p className="text-sm text-gray-600 mt-2">Descripción:</p>
              <p className="font-semibold text-gray-800">
                {selectedIncident.description}
              </p>
              <p className="text-sm text-gray-600 mt-2">Fecha de reporte:</p>
              <p className="font-semibold text-gray-800">
                {new Date(selectedIncident.dateReported).toLocaleString()}
              </p>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Archivos:</h4>
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
                          {isImage && (
                            <div className="mb-2">
                              <img 
                                src={file.signedUrl} 
                                alt={fileName}
                                className="max-w-full h-32 object-cover rounded border"
                                onError={(e) => {
                                  console.error('Error loading image:', file.signedUrl);
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
                            <a
                              href={file.signedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm flex-1 text-center py-1 px-2 bg-blue-50 rounded"
                            >
                              👁️ Ver
                            </a>
                            <button
                              onClick={() => downloadFile(file, fileName)}
                              className="text-green-600 hover:bg-green-100 text-sm flex-1 text-center py-1 px-2 bg-green-50 rounded border-none cursor-pointer"
                            >
                              💾 Descargar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-600">No hay archivos adjuntos.</p>
                )}
              </div>
            </div>


            {/* Form */}
          </div>
        </div>
      )}
    </div>
  );
}