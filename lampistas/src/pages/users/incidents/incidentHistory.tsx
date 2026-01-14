import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../components/header";
import api from '../../../api/intercepttors'
import type { IncidentHistoryItem } from "../../../types/incidentHistory";

export default function IncidentHistory() {
    const [history, setHistory] = useState<IncidentHistoryItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalHistory, setTotalHistory] = useState(0);
    const pageSize = 10;
    const [loading, setLoading] = useState(true);
    const totalPages = Math.ceil(totalHistory / pageSize);
    
    useEffect(() => {
       api.get('/user/getIncidentHistory')
        .then(response => {
           
            const data = response.data;
            
            if (data.mappedIncidentHistory && Array.isArray(data.mappedIncidentHistory)) {
                // Si viene como array directo
                setHistory(data.mappedIncidentHistory);
                setTotalHistory(data.mappedIncidentHistory.length);
            } else {
                // Si los datos están expandidos como propiedades numéricas
                const entries = Object.entries(data)
                    .filter(([key]) => !isNaN(Number(key)))
                    .map(([, value]) => value as IncidentHistoryItem);
                
                setHistory(entries);
                setTotalHistory(entries.length);
            }
            
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching incident history:", error);
            setHistory([]);
            setLoading(false);
        });
    }, [currentPage]);
    
    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-xl">Cargando historial...</div>
            </div>
        );
    }
    
    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">Historial de Incidencias</h2>
            
            {history.length === 0 ? (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                    No hay incidencias en el historial
                </div>
            ) : (
                <div className="w-full max-w-7xl overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 shadow-md">
                        <thead>
                            <tr className="bg-amber-200">
                                <th className="py-2 px-4 border border-gray-300 text-left">ID</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Título</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Descripción</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Estado</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Usuario</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Trabajador</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Empresa</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Creado</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Cerrado</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Último Cambio</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Log de Cambio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((incident, index) => (
                                <tr key={`${incident.id}-${index}`} className="hover:bg-amber-50">
                                    <td className="py-2 px-4 border border-gray-300">{incident.id}</td>
                                    <td className="py-2 px-4 border border-gray-300 max-w-xs">
                                        <div className="truncate" title={incident.title}>
                                            {incident.title}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300 max-w-xs">
                                        <div className="truncate" title={incident.description}>
                                            {incident.description}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            incident.status?.toLowerCase() === 'closed' ? 'bg-green-100 text-green-800' :
                                            incident.status?.toLowerCase() === 'open' ? 'bg-red-100 text-red-800' :
                                            incident.status?.toLowerCase() === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {incident.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <span className="font-medium text-blue-600">
                                            {incident.userName || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        {incident.workerName ? (
                                            <span className="font-medium text-purple-600">
                                                {incident.workerName}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic">Sin asignar</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <span className="font-medium text-green-600">
                                            {incident.companyName || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300 text-sm">
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
                                    <td className="py-2 px-4 border border-gray-300 text-sm">
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
                                            <span className="text-gray-400 italic">No cerrada</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300 text-sm">
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
                                            <span className="text-gray-400 italic">N/A</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300 max-w-xs">
                                        <div className="truncate" title={incident.changeLog}>
                                            {incident.changeLog || 'N/A'}
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
                                Mostrando {Math.min((currentPage - 1) * pageSize + 1, totalHistory)} a {Math.min(currentPage * pageSize, totalHistory)} de {totalHistory} registros
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
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
                    )}
                </div>
            )}
        </div>
    );
}
