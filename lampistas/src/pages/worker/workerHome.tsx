import { useEffect, useState } from 'react';
import type { IncidentType } from '../../types/incidentType';
import toast from 'react-hot-toast';
import type { incidentStatus } from '../../types/incidentStatus';

export default function WorkerHome() {
  const [activeIncidents, setActiveIncidents] = useState<IncidentType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('workerToken');

  function handleupdateStatusIncident(incidentID: number, status: incidentStatus) {
    fetch(`http://localhost:3000/worker/updateIncidentStatus`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        incidentID: incidentID,
        status: status
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
    fetch(`http://localhost:3000/worker/assignedIncidents`, { 
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}