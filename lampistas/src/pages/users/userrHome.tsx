import Header from "./components/header";
import { useState, useEffect } from "react";
export default function WorkerHome() {
  const [workerid, setWorkerId] = useState<string>("");
  type Incident = {
    incidentID: number;
    title: string;
    description: string;
    status: string;
    dateReported: Date | string;
  };
  const [myIncidents, setMyIncidents] = useState<Incident[]>([]);
  const token = localStorage.getItem("userToken");
  const [showSearchCompanies, setShowSearchCompanies] =
    useState<boolean>(false);
  useEffect(() => {
    // Replace userID with the actual variable if needed
    fetch(`http://localhost:3000/user/myContracts/${workerid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.contract) {
          setShowSearchCompanies(true);
        }
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:3000/user/myIncidents", {
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
      {showSearchCompanies && (
        <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
          Buscar Empresas para Contratar
        </button>
      )}
      {/* Tabla de incidencias */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Título</th>
            <th className="py-2 px-4 border ">fecha de reporte</th>
            <th className="py-2 px-4 border">usuario que reporto</th>
            <th className="py-2 px-4 border">Estado</th>
            <th className="py-2 px-4 border">Prioridad</th>
          </tr>
        </thead>
        <tbody>
          {myIncidents.map((incident) => (
            <tr key={incident.incidentID}>
              <td className="py-2 px-4 border">{incident.incidentID}</td>
              <td className="py-2 px-4 border">{incident.title}</td>
              <td className="py-2 px-4 border">
                {incident.dateReported instanceof Date
                  ? incident.dateReported.toLocaleString()
                  : incident.dateReported}
              </td>

              <td className="py-2 px-4 border">
                <select name="estado" id="">
                  <option value="open" selected={incident.status === "open"}>
                    Open
                  </option>
                  <option
                    value="in_progress"
                    selected={incident.status === "in_progress"}
                  >
                    In Progress
                  </option>
                  <option
                    value="resolved"
                    selected={incident.status === "resolved"}
                  >
                    Resolved
                  </option>
                  <option
                    value="closed"
                    selected={incident.status === "closed"}
                  >
                    Closed
                  </option>
                </select>
                <button className="ml-2 bg-amber-500 text-white px-2 py-1 rounded">
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
