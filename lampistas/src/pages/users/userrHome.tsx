import Header from "./components/header";
import { useState, useEffect } from "react";
import type { IncidentType } from "../../types/incidentType"; 
export default function WorkerHome() {

  const [myIncidents, setMyIncidents] = useState<IncidentType[]>([]);
  const token = localStorage.getItem("userToken");
    useState<boolean>(false);
 
  useEffect(() => {
    fetch(`http://localhost:3000/user/myIncidents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
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
              <th className="py-2 px-4 border border-gray-300 text-left">Título</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Fecha de Reporte</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Estado</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {myIncidents.map((incident) => (
              <tr key={incident.IncidentsID} className="hover:bg-amber-50">
                <td className="py-2 px-4 border border-gray-300">{incident.IncidentsID}</td>
                <td className="py-2 px-4 border border-gray-300">{incident.title}</td>
                <td className="py-2 px-4 border border-gray-300">
                {incident.dateReported instanceof Date
                  ? incident.dateReported.toLocaleString()
                  : incident.dateReported}
              </td>

                <td className="py-2 px-4 border border-gray-300">
                  {incident.status}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {incident.priority}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
