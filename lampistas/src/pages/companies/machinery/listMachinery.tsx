import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Edit, Trash } from "lucide-react";
import api from "../../../api/intercepttors";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
export default function ListMachinery() {
  const { t, i18n } = useTranslation("companies.listMachineryPage");
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
  useEffect(() => {
    if (!token) {
      navigate("/company/login");
    }
  }, [navigate, token]);
  function eliminateMachinery(machineryID: number) {
    api
      .delete(`/company/eliminateMachinery/${machineryID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success(t("eliminadaOk"));
        // Refresh the machinery list after deletion
        setMachine((prevMachines) =>
          prevMachines.filter(
            (machinery) => machinery.machineryID !== machineryID
          )
        );
      })
      .catch((error) => {
        toast.error(t("errorEliminar", { message: (error as Error).message }));
      });
  }

    useEffect(() => {
      api
        .get(`/company/listMachinery?limit=${itemsPerPage}&offset=${offset}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMachine(response.data.machinery || []);
        })
        .catch((error) => {
          toast.error(t("errorCargar", { message: (error as Error).message }));
        });
    }, [currentPage, offset, token, t]);
          
        
    
    function handleNextPage() {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    function handlePreviousPage() {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    }
    return (
      <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
        <h2 className="text-2xl font-bold mb-6">{t("titulo")}</h2>
        <div className="w-full max-w-7xl overflow-x-auto rounded-2xl border border-amber-100 bg-white shadow-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-amber-50">
              <tr className="text-amber-900">
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">ID</th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("thNombre")}</th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  {t("thTipo")}
                </th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("thMarca")}</th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("thModelo")}</th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  {t("thSerie")}
                </th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  {t("thFechaInstalacion")}
                </th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("thCliente")}</th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("thAcciones")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {machine.map((machinery) => (
                <tr key={machinery.machineryID} className="hover:bg-amber-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-700">
                    {machinery.machineryID}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {machinery.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {machinery.machineType}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {machinery.brand || "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {machinery.model}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-600">
                    {machinery.serialNumber}
                  </td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                    {machinery.installedAt 
                      ? new Date(machinery.installedAt).toLocaleDateString(i18n.language === "ca" ? "ca-ES" : i18n.language === "en" ? "en-US" : "es-ES")
                      : <span className="text-gray-400 italic">{t("sinInstalar")}</span>
                    }
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {machinery.clientID || <span className="text-gray-400 italic">{t("sinAsignar")}</span>}
                  </td>
                  <td className="py-3 px-4">
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
            <ChevronLeft size={16} className="mr-1" /> {t("anterior")}
          </button>
          <button
            onClick={handleNextPage}
            className="flex items-center px-3 py-1 border border-gray-300 rounded text-black hover:bg-gray-200"
          >
            {t("siguiente")} <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    );
  }

