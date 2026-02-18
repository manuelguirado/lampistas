import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "./components/header";
import type { IncidentHistoryItem } from "../../types/incidentHistory";
import api from '../../api/intercepttors'
import { useTranslation } from "react-i18next";

export default function IncidentHistory() {
    const { t } = useTranslation("worker.historyPage");
    const [history, setHistory] = useState<IncidentHistoryItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalHistory, setTotalHistory] = useState(0);
    const pageSize = 10;
    const token = localStorage.getItem("workerToken");
    const [loading, setLoading] = useState(true);
    const totalPages = Math.ceil(totalHistory / pageSize);
    const offset = (currentPage - 1) * pageSize;
    
    useEffect(() => {
        api.get('/worker/getIncidentHistory', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.data)
        .then(data => {
         
    
            // Manejar la respuesta que viene como objeto numerado
            if (data.mappedIncidentHistory) {
                // Si es un array directo, úsalo
                if (Array.isArray(data.mappedIncidentHistory)) {
                    setHistory(data.mappedIncidentHistory);
                } else {
                    // Si es un objeto numerado, conviértelo a array
                    const arrayData = Object.values(data.mappedIncidentHistory) as IncidentHistoryItem[];
                    setHistory(arrayData);
                }
            } else {
                // Si la estructura es diferente y los datos están directamente en data
                const entries = Object.entries(data)
                    .filter(([key]) => !isNaN(Number(key))) // Solo las claves numéricas
                    .map(([_, value]) => value as IncidentHistoryItem);
                
                setHistory(entries.length > 0 ? entries : []);
            }
            
            // Set total count if available
            setTotalHistory(data.totalHistory || data.total || history.length);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching incident history:", error);
            setHistory([]);
            setLoading(false);
        });
    }, [token, currentPage, offset]);
    
    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-xl">{t("loading")}</div>
            </div>
        );
    }
    
    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">{t("title")}</h2>
            
            {history.length === 0 ? (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                    {t("empty")}
                </div>
            ) : (
                <div className="w-full max-w-7xl overflow-x-auto rounded-2xl border border-amber-100 bg-white shadow-lg">
                    <table className="min-w-full text-sm">
                        <thead className="bg-amber-50">
                            <tr className="text-amber-900">
                                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("id")}</th>
                                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("titleCol")}</th>
                                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("description")}</th>
                                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("status")}</th>
                                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("user")}</th>
                                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("worker")}</th>
                                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("company")}</th>
                                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("created")}</th>
                                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("closed")}</th>
                                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("lastChange")}</th>
                                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">{t("changeLog")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.map((incident, index) => (
                                <tr key={`${incident.id}-${index}`} className="hover:bg-amber-50/60 transition-colors">
                                    <td className="py-3 px-4 font-semibold text-gray-700">{incident.id}</td>
                                    <td className="py-3 px-4 max-w-xs">
                                        <div className="truncate font-medium text-gray-900" title={incident.title}>
                                            {incident.title}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 max-w-xs">
                                        <div className="truncate text-gray-600" title={incident.description}>
                                            {incident.description}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            incident.status?.toLowerCase() === 'closed' ? 'bg-emerald-100 text-emerald-800' :
                                            incident.status?.toLowerCase() === 'open' ? 'bg-rose-100 text-rose-800' :
                                            incident.status?.toLowerCase() === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {incident.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="font-medium text-sky-600">
                                            {incident.userName || t("na")}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {incident.workerName ? (
                                            <span className="font-medium text-purple-600">
                                                {incident.workerName}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic">{t("unassigned")}</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="font-medium text-emerald-600">
                                            {incident.companyName || t("na")}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                                        {new Date(incident.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                        <br />
                                        <span className="text-xs text-gray-500">
                                            {new Date(incident.createdAt).toLocaleTimeString('es-ES')}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                                        {incident.closedAt ? (
                                            <>
                                                {new Date(incident.closedAt).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                                <br />
                                                <span className="text-xs text-gray-500">
                                                    {new Date(incident.closedAt).toLocaleTimeString('es-ES')}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-gray-400 italic">{t("notClosed")}</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                                        {incident.changedAt ? (
                                            <>
                                                {new Date(incident.changedAt).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                                <br />
                                                <span className="text-xs text-gray-500">
                                                    {new Date(incident.changedAt).toLocaleTimeString('es-ES')}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-gray-400 italic">{t("na")}</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 max-w-xs">
                                        <div className="truncate text-gray-600" title={incident.changeLog}>
                                            {incident.changeLog || t("na")}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Pagination Controls */}
                    {totalHistory > pageSize && (
                        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                            <div className="flex items-center text-sm text-gray-500">
                                {t("showing", {
                                    from: Math.min((currentPage - 1) * pageSize + 1, totalHistory),
                                    to: Math.min(currentPage * pageSize, totalHistory),
                                    total: totalHistory
                                })}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                {/* Botón Anterior */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
                    )}
                </div>
            )}
        </div>
    );
}
