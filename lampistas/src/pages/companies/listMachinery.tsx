import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function ListMachinery() {
  const navigate = useNavigate();
  const [machine, setMachine] = useState<
    Array<{
      machineryID: number;
      name: string;
      machineType: string;
      brand: string;
      model: string;
      serialNumber: string;
      installedAt: Date;
      clientID: number;
    }>
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const offset = (currentPage - 1) * itemsPerPage;
  const token = localStorage.getItem("companyToken");
  function eliminateMachinery(machineryID: number) {
    fetch(`http://localhost:3000/company/eliminateMachinery/${machineryID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        alert("Machinery eliminated successfully!");
        // Refresh the machinery list after deletion
        setMachine((prevMachines) =>
          prevMachines.filter(
            (machinery) => machinery.machineryID !== machineryID
          )
        );
        window.location.reload();
      }).catch((error) => {
        console.error("Error eliminating machinery:", error);
      });
  }

    useEffect(() => {
      fetch(
        `http://localhost:3000/company/listMachinery?limit=${itemsPerPage}&offset=${offset}`,
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
          setMachine(data.machinery || []);
        })
        .catch((error) => {
          console.error("Error fetching machinery:", error);
        });
    }, [currentPage, offset, token]);
    function handleNextPage() {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    function handlePreviousPage() {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    }
    return (
      <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
        <h2 className="text-2xl font-bold mb-6">Lista de Maquinarias</h2>
        <div className="w-full max-w-7xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-amber-200">
                <th className="py-2 px-4 border border-gray-300 text-left">ID</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Nombre</th>
                <th className="py-2 px-4 border border-gray-300 text-left">
                  Tipo de Maquinaria
                </th>
                <th className="py-2 px-4 border border-gray-300 text-left">Marca</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Modelo</th>
                <th className="py-2 px-4 border border-gray-300 text-left">
                  Número de Serie
                </th>
                <th className="py-2 px-4 border border-gray-300 text-left">
                  Fecha de Instalación
                </th>
                <th className="py-2 px-4 border border-gray-300 text-left">Cliente</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {machine.map((machinery) => (
                <tr key={machinery.machineryID} className="hover:bg-amber-50">
                  <td className="py-2 px-4 border border-gray-300">
                    {machinery.machineryID}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {machinery.name}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {machinery.machineType}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {machinery.brand || "-"}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {machinery.model}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {machinery.serialNumber}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {machinery.installedAt 
                      ? new Date(machinery.installedAt).toLocaleDateString('es-ES')
                      : <span className="text-gray-400 italic">Sin instalar</span>
                    }
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {machinery.clientID || <span className="text-gray-400 italic">Sin asignar</span>}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <div className="flex gap-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() =>
                      navigate(
                        `/company/maquinaria/editarMaquinaria/${machinery.machineryID}`
                      )
                    }
                  >
                    <Edit size={16} />
                  </button>
                  <button className="text-red-500 hover:text-red-700" onClick={() => eliminateMachinery(machinery.machineryID)}>
                    <Trash size={16} />
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-1 border border-gray-300 rounded ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-black hover:bg-gray-200"
            }`}
          >
            <ChevronLeft size={16} className="mr-1" /> Anterior
          </button>
          <button
            onClick={handleNextPage}
            className="flex items-center px-3 py-1 border border-gray-300 rounded text-black hover:bg-gray-200"
          >
            Siguiente <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    );
  }

