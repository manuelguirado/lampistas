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
    files: string[];
    description: string;
    dateReported: Date;
  } | null>(null);
  const token = localStorage.getItem("userToken");
  
    try{
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/user/listFiles/${selectedIncident?.incidentID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.files) {
          setSelectedIncident((prevIncident) =>
            prevIncident
              ? { ...prevIncident, files: data.files }
              : prevIncident
          );
        }
      });

    }catch(error){
      toast.error("Error fetching files: " + (error as Error).message);
    }
  
  function handleOpenIncidentModal(incident: {
    incidentID: number;
    name: string;
    files: string[];
    description: string;
    dateReported: Date;
  }) {
    setSelectedIncident(incident);
    setIsModalOpen(true);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onLoad={() => fetchIncidentFiles(selectedIncident.incidentID)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
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
                  <ul className="list-disc list-inside space-y-1">
                    {selectedIncident.files.map((fileUrl, index) => (
                      <li key={index}>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Archivo {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
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
