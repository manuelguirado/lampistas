import { useState, useEffect } from "react";
import type { MachineryType } from "../../types/machineryType";
import Header from "../users/components/header";
export default function MyMachinery() {
  const [machinery, setMachinery] = useState<MachineryType[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
   fetch("http://localhost:3000/user/userMachinery", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => response.json()).then((data) => {
        if (Array.isArray(data.machinery)) {
          setMachinery(data.machinery);
        }
      });



    } catch (error) {
      console.error("Error fetching machinery:", error);
    }
  }, []);
  return (
    <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
      <Header />
      <h2 className="text-2xl font-bold p-20">User Home Page</h2>

      {/* Tabla de incidencias */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Nombre </th>
            <th className="py-2 px-4 border ">modelo</th>
            <th className="py-2 px-4 border">Descripción</th>
            <th className="py-2 px-4 border">Marca</th>
            <th className="py-2 px-4 border">Número de serie</th>
            <th className="py-2 px-4 border">Fecha de instalación</th>
            <th className="py-2 px-4 border">Última fecha de inspección</th>
          </tr>
        </thead>
        <tbody>
          {machinery.map((machine) => (
            <tr key={machine.machineryID}>
              <td className="py-2 px-4 border">{machine.machineryID}</td>
              <td className="py-2 px-4 border">{machine.name}</td>
              <td className="py-2 px-4 border">{machine.model}</td>
              <td className="py-2 px-4 border">{machine.description}</td>
              <td className="py-2 px-4 border">{machine.brand}</td>
              <td className="py-2 px-4 border">{machine.serialNumber}</td>
              <td className="py-2 px-4 border">{machine.installedAt ? machine.installedAt.toString() : ""}</td>
              <td className="py-2 px-4 border">{machine.lastInspectionDate ? machine.lastInspectionDate.toString() : ""}</td>
        
            </tr>
          ))}
        </tbody>
      </table>
    </div>  
  );
}
