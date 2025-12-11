import { useEffect, useState } from "react";
import Header from "../companies/components/header";
import { Edit, Code, Trash2, ChevronRight, ChevronLeft, X, Calendar } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export default function ListWorkers() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalWorkers, setTotalWorkers] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState<{ workerid: number; name: string } | null>(null);
    const pageSize = 5;
    
    const [workers, setWorkers] = useState<
        Array<{ 
            workerid: number; 
            name: string; 
            email: string; 
            activeIncidents: Array<{
                IncidentsID: number;
                title: string;
                status: string;
                priority: string;
                urgency: boolean;
            }>;
        }>
    >([]);

    // Estado para el formulario de guardias
    const [shiftData, setShiftData] = useState({
        startDate: '',
        endDate: '',
        shiftType: 'morning', // morning, afternoon, night
        notes: ''
    });

    function handleGenerateCode(workerID: number) {
        const token = localStorage.getItem('companyToken');

        fetch(`http://localhost:3000/company/assignWorkerCode/${workerID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code) {
                    alert(`Code generated successfully: ${data.code}`);
                    window.navigator.clipboard.writeText(data.code);
                } else {
                    alert('Error generating code.');
                }
            })
            .catch((error) => {
                toast.error('Error generating code: ' + (error as Error).message);
            });
    }

    function handleEliminarWorker(workerID: number) {
        const token = localStorage.getItem('companyToken');
        fetch(`http://localhost:3000/company/deleteWorker/${workerID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then(() => {
                toast.success('¡Trabajador eliminado exitosamente!');
                window.location.reload();
            });
    }

    function handleOpenShiftModal(worker: { workerid: number; name: string }) {
        setSelectedWorker(worker);
        setIsModalOpen(true);
        // Reset form
        setShiftData({
            startDate: '',
            endDate: '',
            shiftType: 'morning',
            notes: ''
        });
    }

    function handleCloseModal() {
        setIsModalOpen(false);
        setSelectedWorker(null);
    }

    async function handleSubmitShift(e: React.FormEvent) {
        e.preventDefault();
        
        if (!selectedWorker) return;

        const token = localStorage.getItem('companyToken');

        try {
            const response = await fetch(`http://localhost:3000/company/assignShiftWorker`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    workerID: selectedWorker.workerid,
                    ...shiftData
                })
            });

            const data = await response.json();
         

            if (response.ok) {
                toast.success('¡Guardia asignada exitosamente!');
                handleCloseModal();
            } else {
                toast.error('Error: ' + (data.message || 'No se pudo asignar la guardia'));
            }
        } catch (error) {
         
            toast.error('Error al asignar guardia: ' + (error as Error).message);
        }
    }

    useEffect(() => {
        const limit = pageSize;
        const offset = (currentPage - 1) * pageSize;
        const token = localStorage.getItem('companyToken');

        fetch(`http://localhost:3000/company/listWorkers?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
              
                setWorkers(data.workers || []);
                setTotalWorkers(data.total || 0);
            })
            .catch((error) => {
                toast.error('Error fetching workers: ' + (error as Error).message);
            });
    }, [currentPage]);

    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">List Workers Page</h2>
            
            <div className="w-full max-w-7xl overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md">
                    <thead>
                        <tr className="bg-amber-200">
                            <th className="py-2 px-4 border border-gray-300">workerid</th>
                            <th className="py-2 px-4 border border-gray-300">Name</th>
                            <th className="py-2 px-4 border border-gray-300">Email</th>
                            <th className="py-2 px-4 border border-gray-300">Active Incidents</th>
                            <th className="py-2 px-4 border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workers.map((worker) => (
                            <tr key={worker.workerid} className="hover:bg-amber-100">
                                <td className="py-2 px-4 border border-gray-300">{worker.workerid}</td>
                                <td className="py-2 px-4 border border-gray-300">{worker.name}</td>
                                <td className="py-2 px-4 border border-gray-300">{worker.email}</td>
                                <td className="py-2 px-4 border border-gray-300">
                                    {worker.activeIncidents.length}
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <div className="flex gap-2 flex-wrap">
                                        <button 
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Editar"
                                        >
                                            <Edit size={16} onClick={() => navigate('/company/editarTrabajador')} />
                                        </button>
                                        <button 
                                            className="text-red-500 hover:text-red-700"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} onClick={() => handleEliminarWorker(worker.workerid)} />
                                        </button>
                                        <button 
                                            className="text-purple-500 hover:text-purple-700"
                                            title="Generar código"
                                        >
                                            <Code size={16} onClick={() => handleGenerateCode(worker.workerid)} />
                                        </button>
                                        <button 
                                            className="text-green-600 hover:text-green-800 text-sm px-2 py-1 bg-green-100 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                                            onClick={() => handleOpenShiftModal(worker)}
                                        >
                                            <Calendar size={14} />
                                            Guardia
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50"
                >
                    <ChevronLeft size={16} className="mr-2" />
                    Anterior
                </button>
                <span className="flex items-center px-4 py-2">
                    Página {currentPage} de {Math.ceil(totalWorkers / pageSize)}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage >= Math.ceil(totalWorkers / pageSize)}
                    className="flex items-center px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50"
                >
                    Siguiente
                    <ChevronRight size={16} className="ml-2" />
                </button>
            </div>

            {/* Modal para asignar guardias */}
            {isModalOpen && selectedWorker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                Asignar Guardia
                            </h3>
                            <button 
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Worker Info */}
                        <div className="mb-4 p-3 bg-amber-50 rounded">
                            <p className="text-sm text-gray-600">Trabajador:</p>
                            <p className="font-semibold text-gray-800">{selectedWorker.name}</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmitShift} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de Inicio
                                </label>
                                <input
                                    type="datetime-local"
                                    value={shiftData.startDate}
                                    onChange={(e) => setShiftData({ ...shiftData, startDate: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de Fin
                                </label>
                                <input
                                    type="datetime-local"
                                    value={shiftData.endDate}
                                    onChange={(e) => setShiftData({ ...shiftData, endDate: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Guardia
                                </label>
                                <select
                                    value={shiftData.shiftType}
                                    onChange={(e) => setShiftData({ ...shiftData, shiftType: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="morning">Mañana (8:00 - 16:00)</option>
                                    <option value="afternoon">Tarde (16:00 - 00:00)</option>
                                    <option value="night">Noche (00:00 - 8:00)</option>
                                    <option value="fullday">Día completo (24h)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notas (opcional)
                                </label>
                                <textarea
                                    value={shiftData.notes}
                                    onChange={(e) => setShiftData({ ...shiftData, notes: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    rows={3}
                                    placeholder="Ej: Zona sur, urgencias prioritarias..."
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                                >
                                    Asignar Guardia
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

