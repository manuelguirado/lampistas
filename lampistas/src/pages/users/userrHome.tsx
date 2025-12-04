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
    <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
      <Header />
      <h2 className="text-2xl font-bold p-20">User Home Page</h2>
      
      {/* Tabla de incidencias */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Título</th>
            <th className="py-2 px-4 border ">fecha de reporte</th>
            <th className="py-2 px-4 border">Estado</th>
            <th className="py-2 px-4 border">Prioridad</th>
          </tr>
        </thead>
        <tbody>
          {myIncidents.map((incident) => (
            <tr key={incident.IncidentsID}>
              <td className="py-2 px-4 border">{incident.IncidentsID}</td>
              <td className="py-2 px-4 border">{incident.title}</td>
              <td className="py-2 px-4 border">
                {incident.dateReported instanceof Date
                  ? incident.dateReported.toLocaleString()
                  : incident.dateReported}
              </td>

              <td className="py-2 px-4 border">
                {incident.status}
              </td>
              <td className="py-2 px-4 border">
                {incident.priority}
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
