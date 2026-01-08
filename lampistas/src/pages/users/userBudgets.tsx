import { useState, useEffect } from "react";
import type { BudgetType } from "../../types/budgetType";
import toast from "react-hot-toast";
import Header from "./components/header";
import { ChevronRight,ChevronLeft } from "lucide-react";
export default function UserBudgets() {
  const token = localStorage.getItem("userToken");
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBudgets, setTotalBudgets] = useState(0);
  const pageSize = 5;
  const offset = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(totalBudgets / pageSize);

function handleDownloadPDF(budgetID: number) {
   fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/user/downloadFile/${budgetID}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("response:", response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Para archivos PDF, usar .blob() en lugar de .json()
        return response.blob();
      })
      .then((blob) => {
       
        
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `budget_${budgetID}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Limpiar
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        toast.error("Error downloading PDF: " + (error as Error).message);
      });
}
  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function handlePreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/user/recievedBudgets?limit=${pageSize}&offset=${offset}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBudgets(data.budgets);
        setTotalBudgets(data.totalBudgets || data.budgets.length);
      })
      .catch((error) => {
        toast.error("Error fetching budgets: " + (error as Error).message);
      });
  }, [token, currentPage, offset]);
  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">Presupuestos Recibidos</h2>
      <div className="w-full max-w-7xl overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead>
            <tr className="bg-amber-200">
              <th className="py-2 px-4 border border-gray-300 text-left">
                ID de Presupuesto
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                ID de Incidente
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Título
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Descripción
              </th>
             
              <th className="py-2 px-4 border border-gray-300 text-left">
                Items
              </th>
               <th className="py-2 px-4 border border-gray-300 text-left">
                Monto Total
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
               Descargar PDF
              </th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => (
              <tr key={budget.budgetID} className="hover:bg-amber-50">
                <td className="py-2 px-4 border border-gray-300">
                  {budget.budgetID}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {budget.incidentID}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {budget.title}
                </td>

                <td className="py-2 px-4 border border-gray-300">
                  {budget.description}
                </td>
               
                <td className="py-2 px-4 border border-gray-300">
                  <ul className="list-disc list-inside space-y-1">
                    {budget.items?.map((item, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-semibold">{item.description}</span> - 
                        Cantidad: <span className="text-amber-600">{item.quantity}</span> - 
                        Precio: <span className="text-green-600">{item.total}€</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {budget.totalAmount}€
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <button  onClick={() => budget.budgetID && handleDownloadPDF(budget.budgetID)} className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors font-semibold">descargar PDF</button>
                </td>
              </tr>
               
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="w-full max-w-7xl mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Mostrando {offset + 1} a {Math.min(offset + pageSize, totalBudgets)} de {totalBudgets} presupuestos
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Botón Anterior */}
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            } transition-colors`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </button>

          {/* Números de página */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const showPage = 
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);
              
              if (!showPage) {
                // Mostrar "..." para páginas omitidas
                if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                  return (
                    <span key={pageNumber} className="px-2 py-1 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-amber-500 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-amber-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Botón Siguiente */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            } transition-colors`}
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
