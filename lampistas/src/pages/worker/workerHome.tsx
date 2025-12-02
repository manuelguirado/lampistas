import { useEffect, useState } from 'react';
import type { IncidentType } from '../../types/incidentType';
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
        alert('Incident status updated successfully!');
        // Optionally, refresh the list of incidents
        setActiveIncidents((prevIncidents) =>
          prevIncidents.map((incident) =>
            incident.IncidentsID === incidentID
              ? { ...incident, status: status }
              : incident
          )
        );
      })
      .catch((error) => {
        console.error('Error updating incident status:', error);
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
        console.error('Error fetching incidents:', err);
        setError(err.message);
        setActiveIncidents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Incidencias Asignadas</h1>

      {/* Tabla de incidencias */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Título</th>
            <th className='py-2 px-4 border '>
                fecha de reporte
            </th>
            <th className='py-2 px-4 border'>
                usuario que reporto
            </th>
            <th className="py-2 px-4 border">Estado</th>
            <th className="py-2 px-4 border">Prioridad</th>
          </tr>
        </thead>
        <tbody>
          {activeIncidents.map(incident  => (
            <tr key={incident.IncidentsID}>
              <td className="py-2 px-4 border">{incident.IncidentsID}</td>
              <td className="py-2 px-4 border">{incident.title}</td>
              <td className='py-2 px-4 border'>{incident.dateReported instanceof Date ? incident.dateReported.toLocaleString() : incident.dateReported}</td>
              <td className="py-2 px-4 border">{incident.reportedByUserID}</td>
              <td className="py-2 px-4 border">
                <select name="estado" id="">
                    <option value="open" selected={incident.status === 'open'}>Open</option>
                    <option value="in_progress" selected={incident.status === 'in_progress'}>In Progress</option>
                    <option value="resolved" selected={incident.status === 'resolved'}>Resolved</option>
                    <option value="closed" selected={incident.status === 'closed'}>Closed</option>
                </select>
                <button onClick={() => handleupdateStatusIncident(incident.IncidentsID, (document.querySelector(`select[name="estado"]`) as HTMLSelectElement).value as incidentStatus)} className='ml-2 bg-amber-500 text-white px-2 py-1 rounded'>Update</button>
              </td>
              <td className="py-2 px-4 border">{incident.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}