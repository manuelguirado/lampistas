import { useState, useEffect } from "react";
import type { MachineryType } from "../../types/machineryType";
import Header from "../users/components/header";
import toast from "react-hot-toast";
export default function MyMachinery() {
  const [machinery, setMachinery] = useState<MachineryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    fetch("http://localhost:3000/user/userMachinery", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.machinery)) {
          toast.success("Maquinarias cargadas correctamente");
          setMachinery(data.machinery);
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error fetching machinery: " + (error as Error).message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando maquinarias...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">Mis Maquinarias</h2>

      {machinery.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          No tienes maquinarias asignadas
        </div>
      ) : (
        <div className="w-full max-w-7xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-amber-200">
                <th className="py-2 px-4 border border-gray-300 text-left">ID</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Nombre</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Modelo</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Descripción</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Marca</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Nº Serie</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Instalación</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Última Inspección</th>
              </tr>
            </thead>
            <tbody>
              {machinery.map((machine) => (
                <tr key={machine.machineryID} className="hover:bg-amber-50">
                  <td className="py-2 px-4 border border-gray-300">{machine.machineryID}</td>
                  <td className="py-2 px-4 border border-gray-300">{machine.name}</td>
                  <td className="py-2 px-4 border border-gray-300">{machine.model}</td>
                  <td className="py-2 px-4 border border-gray-300">{machine.description || "-"}</td>
                  <td className="py-2 px-4 border border-gray-300">{machine.brand || "-"}</td>
                  <td className="py-2 px-4 border border-gray-300">{machine.serialNumber}</td>
                  <td className="py-2 px-4 border border-gray-300">
                    {machine.installedAt 
                      ? new Date(machine.installedAt).toLocaleDateString('es-ES')
                      : <span className="text-gray-400 italic">Sin instalar</span>
                    }
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {machine.lastInspectionDate 
                      ? new Date(machine.lastInspectionDate).toLocaleDateString('es-ES')
                      : <span className="text-gray-400 italic">No inspeccionada</span>
                    }
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
