import { useState, useEffect } from "react";
import UserPayments from "./components/userPayments";
import type { BudgetType } from "../../types/budgetType";
import toast from "react-hot-toast";
import Header from "./components/header";
import { ChevronRight,ChevronLeft } from "lucide-react";
import api from '../../api/intercepttors'
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
const token = localStorage.getItem('userToken');
interface DecodedToken {
  userID: number;
  role: string;
  email: string;
  name?: string;        // ✅ Agregar name opcional
    username?: string;    // ✅ Mantener username opcional
    companyID?: number;
  }

 
  const decoded = token ? jwtDecode<DecodedToken>(token) : null;
  const companyID = decoded?.companyID;
  const userID = decoded?.userID;

export default function UserBudgets() {
  const { t } = useTranslation("users.userBudgetsPage");
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBudgets, setTotalBudgets] = useState(0);
  const pageSize = 5;
  const offset = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(totalBudgets / pageSize);
  
 
  // Estado para mostrar el pago y guardar datos del presupuesto seleccionado
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<{ userID: number ; ammount: number , companyID: number} | null>(null);
  async function handleDownloadPDF(budgetID: number) {
    try {
      const response = await api.get(`/user/downloadFile/${budgetID}`, {
        responseType: 'blob',
      });

      // Crear blob del PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Crear enlace temporal para descargar
      const link = document.createElement("a");
      link.href = url;
      link.download = `presupuesto_${budgetID}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(t('pdfDownloaded'));
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(t("pdfDownloadError"));
    }
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
    api.get(`/user/recievedBudgets?limit=${pageSize}&offset=${offset}`)
      .then((response) => {
        setBudgets(response.data.budgets || []);
        setTotalBudgets(response.data.totalBudgets || response.data.budgets?.length || 0);
      })
      .catch((error) => {
        console.error("Error fetching budgets:", error);
        toast.error(t("loadError"));
      });
  }, [currentPage, offset, t]);
  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">{t("title")}</h2>
      <div className="w-full max-w-7xl overflow-x-auto rounded-2xl border border-amber-100 bg-white shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-amber-50">
            <tr className="text-amber-900">
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("budgetId")}
              </th>
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("incidentId")}
              </th>
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("titleCol")}
              </th>
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("description")}
              </th>
             
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("items")}
              </th>
               <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("totalAmount")}
              </th>
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
               {t("downloadPdf")}
              </th>
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("pay")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {budgets.map((budget) => (
              <tr key={budget.budgetID} className="hover:bg-amber-50/60 transition-colors">
                <td className="py-3 px-4 font-semibold text-gray-700">
                  {budget.budgetID}
                </td>
                <td className="py-3 px-4 font-semibold text-gray-700">
                  {budget.incidentID}
                </td>
                <td className="py-3 px-4 text-gray-900 font-medium">
                  {budget.title}
                </td>

                <td className="py-3 px-4 text-gray-600">
                  {budget.description}
                </td>
               
                <td className="py-3 px-4">
                  <ul className="list-disc list-inside space-y-1">
                    {budget.items?.map((item, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-semibold">{item.description}</span> - 
                        {t("quantity")}: <span className="text-amber-600">{item.quantity}</span> - 
                        {t("price")}: <span className="text-emerald-600 font-semibold">{item.total}€</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-3 px-4 font-semibold text-gray-900">
                  {budget.totalAmount}€
                </td>
                <td className="py-3 px-4">
                  <button  onClick={() => budget.budgetID && handleDownloadPDF(budget.budgetID)} className="border border-amber-400 text-amber-700 hover:bg-amber-100 transition-colors px-3.5 py-2 rounded-lg font-semibold text-sm">{t("downloadPdfBtn")}</button>
                </td>
                <td className="py-3 px-4">
                  <button
                    className="bg-emerald-500 text-white px-3.5 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-semibold text-sm"
                    onClick={() => {
                      setPaymentData({
                        userID : userID || 0,
                        ammount: budget.totalAmount || 0,
                        companyID: companyID || 0,
                      });
                      setShowPayment(true);
                    }}
                  >
                    {t("pay")}
                  </button>
                </td>
              </tr>
               
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="w-full max-w-7xl mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {t("showing", {
            from: offset + 1,
            to: Math.min(offset + pageSize, totalBudgets),
            total: totalBudgets,
          })}
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
            {t("previous")}
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
            {t("next")}
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    {/* Renderizar UserPayments si showPayment es true */}
    {showPayment && paymentData && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-lg w-full">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            onClick={() => setShowPayment(false)}
            aria-label={t("close")}
          >
            ×
          </button>
          <UserPayments userID={paymentData.userID} ammount={paymentData.ammount ?? 0} companyID={paymentData.companyID ?? 0} />
        </div>
      </div>
    )}
  </div>
  );
}
