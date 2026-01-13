import { useEffect, useState } from 'react';
import type { IncidentType } from '../../types/incidentType';
import toast from 'react-hot-toast';
import type { incidentStatus } from '../../types/incidentStatus';
import { X } from 'lucide-react';
import Header from './components/header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadFilesSchema, type typeUploadFilesSchema } from '../worker/schemas/uploadFilesSchema';
export default function WorkerHome() {
  const [activeIncidents, setActiveIncidents] = useState<IncidentType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<{ incidentID: number; name: string } | null>(null);
  const token = localStorage.getItem('workerToken');
  const {
    register: filesRegister,
    handleSubmit: handleFilesSubmit,
    formState: { errors: filesErrors },
    reset: filesReset,
  } = useForm<typeUploadFilesSchema>({
    resolver: zodResolver(uploadFilesSchema),
    mode: "onChange",
  }); 
  function uploadfile(data: typeUploadFilesSchema) {
    console.log('Uploading files:', data.files);
    const formData = new FormData();
    formData.append('incidentID', selectedIncident?.incidentID.toString() || '');
    
    if (data.files && data.files.length > 0) {
      Array.from(data.files).forEach((file) => {
        formData.append('files', file);
      });
    }

    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/worker/uploadFile/${selectedIncident?.incidentID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
          });
        }
        return response.json();
      })
      .then(() => {
        toast.success('¡Fotos subidas exitosamente!');
        filesReset();
        handleCloseModal();
      })
      .catch((error) => {
        console.error('Error uploading files:', error);
        toast.error('Error al subir las fotos: ' + error.message);
      });
  }
  

  function handleOpenIncidentModal(incident: { incidentID: number; name: string }) {
        setSelectedIncident(incident);
        setIsModalOpen(true);
     
        
    }

    function handleCloseModal() {
        setIsModalOpen(false);
        setSelectedIncident(null);
        filesReset();
    }
  function handleupdateStatusIncident(incidentID: number, status: incidentStatus) {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/worker/updateIncidentStatus`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        incidentID: incidentID,
        status: status,

      }),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success('¡Estado de incidencia actualizado exitosamente!');
        setActiveIncidents((prevIncidents) =>
          prevIncidents.map((incident) =>
            incident.IncidentsID === incidentID
              ? { ...incident, status: status }
              : incident
          )
        );
      })
      .catch((error) => {
        toast.error('Error al actualizar el estado: ' + error.message);
      });
  }

  useEffect(() => {
    if (!token) {
      setError('No hay token de autenticación');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/worker/assignedIncidents`, { 
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        setActiveIncidents(data.assignedIncidents || []); 
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setActiveIncidents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando incidencias...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h1 className="text-3xl font-bold mb-6 text-amber-800">Incidencias Asignadas</h1>

      {activeIncidents.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          No tienes incidencias asignadas
        </div>
      ) : (
        <div className="w-full max-w-7xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-amber-200">
                <th className="py-2 px-4 border border-gray-300 text-left">ID</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Título</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Fecha de Reporte</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Usuario que Reportó</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Estado</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Prioridad</th>
                <th className='py-2 px-4 border border-gray-300 text-left'>Añadir fotos </th>
              </tr>
            </thead>
            <tbody>
              {activeIncidents.map((incident) => (
                <tr key={incident.IncidentsID} className="hover:bg-amber-50">
                  <td className="py-2 px-4 border border-gray-300">{incident.IncidentsID}</td>
                  <td className="py-2 px-4 border border-gray-300">{incident.title}</td>
                  <td className="py-2 px-4 border border-gray-300">
                    {incident.dateReported instanceof Date 
                      ? incident.dateReported.toLocaleDateString('es-ES')
                      : new Date(incident.dateReported).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">{incident.reportedByUserID}</td>
                  <td className="py-2 px-4 border border-gray-300">
                    <div className="flex items-center gap-2">
                      <select 
                        name="estado" 
                        id={`status-${incident.IncidentsID}`}
                        defaultValue={incident.status}
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="open">Abierta</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="resolved">Resuelta</option>
                        <option value="closed">Cerrada</option>
                      </select>
                      <button 
                        onClick={() => {
                          const selectElement = document.getElementById(`status-${incident.IncidentsID}`) as HTMLSelectElement;
                          handleupdateStatusIncident(incident.IncidentsID, selectElement.value as incidentStatus);
                        }}
                        className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 transition-colors"
                      >
                        Actualizar
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      incident.priority === 'high' ? 'bg-red-100 text-red-800' :
                      incident.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {incident.priority === 'high' ? 'Alta' : 
                       incident.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <button 
                      onClick={() => handleOpenIncidentModal({ incidentID: incident.IncidentsID, name: incident.title })}
                      className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 transition-colors"
                    >
                      Añadir Fotos
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      )}
   
            {/* Modal para subir fotos */}
            {isModalOpen && selectedIncident && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                Añadir Fotos a Incidencia
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
                            <p className="font-semibold text-gray-800">{selectedIncident.name}</p>
                        </div>

                        {/* Form */}
                        <form 
                            onSubmit={handleFilesSubmit(uploadfile)}
                            method="POST"
                            encType="multipart/form-data"
                            className="space-y-4"
                        >
                            <input type="hidden" name="incidentID" value={selectedIncident.incidentID} />
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Selecciona fotos o documentos
                                </label>
                                <input 
                                    {...filesRegister("files")}
                                    type="file" 
                                    multiple 
                                    accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/zip,application/x-rar-compressed,application/gzip"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {filesErrors.files && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {filesErrors.files.message}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Formatos permitidos: JPG, PNG, PDF, DOC, XLS, ZIP, RAR
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                                >
                                    Subir Fotos
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
