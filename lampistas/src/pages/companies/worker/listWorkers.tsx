import { useEffect, useState } from "react";
import Header from "../components/header";
import { Edit, Code, Trash2, ChevronRight, ChevronLeft, X, Calendar } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {shiftSchema } from '../schemas/shiftSchema';
import type {ShiftSchema} from '../schemas/shiftSchema';
import api from "../../../api/intercepttors";
import { useTranslation } from "react-i18next";

export default function ListWorkers() {
    const { t } = useTranslation("companies.listWorkersPage");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalWorkers, setTotalWorkers] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState<{ workerid: number; name: string } | null>(null);
    const pageSize = 5;
    const {register, handleSubmit, formState: { errors }, reset} = useForm<ShiftSchema>({
        resolver: zodResolver(shiftSchema),
        mode: 'onChange',
    });
   
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
    const token = localStorage.getItem('companyToken');

    function handleGenerateCode(workerID: number) {
       

        api.get(`/company/assignWorkerCode/${workerID}`,  {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                const { code } = response.data;
                navigator.clipboard.writeText(code);
                toast.success(t("codeGenerated", { code }));
            })
            .catch((error) => {
                toast.error(t("codeError", { message: (error as Error).message }));
            });
    }

    function handleEliminarWorker(workerID: number) {

        api.delete(`/company/deleteWorker/${workerID}`, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            }
        })
            .then(() => {
                toast.success(t("deleteSuccess"));
                // Refrescar la lista de trabajadores
                setWorkers((prevWorkers) => prevWorkers.filter((worker) => worker.workerid !== workerID));
                window.location.reload();
            })
            .catch((error) => {
                toast.error(t("deleteError", { message: (error as Error).message }));
            });
    }

    function handleOpenShiftModal(worker: { workerid: number; name: string }) {
        setSelectedWorker(worker);
        setIsModalOpen(true);
        // Reset form con valores por defecto
        reset({
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

    async function handleSubmitShift(data : ShiftSchema) {
  
     
        if (!selectedWorker) return;

    
      
        try {
            const response = await api.post(`/company/assignShiftWorker`, {
                workerID: selectedWorker.workerid,
                data : {
               ...data
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => res.data);

       

            // Si el backend devuelve token, significa que se creó correctamente
            if (response.token || response.shiftScheduleID) {
                toast.success(t("assignSuccess"));
                handleCloseModal();
            } else {
                toast.error(t("assignApiError", { message: response.message || "-" }));
            }
        } catch (error) {
         
            toast.error(t("assignError", { message: (error as Error).message }));
        }
    }

    useEffect(() => {
        const limit = pageSize;
        const offset = (currentPage - 1) * pageSize;
        const token = localStorage.getItem('companyToken');

        api.get(`/company/listWorkers?limit=${limit}&offset=${offset}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                setWorkers(response.data.workers || []);
                setTotalWorkers(response.data.total || 0);
            })
            .catch((error) => {
                toast.error(t("listError", { message: (error as Error).message }));
            });
    }, [currentPage, t]);

    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">{t("titulo")}</h2>
            
            <div className="w-full max-w-7xl overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md">
                    <thead>
                        <tr className="bg-amber-200">
                            <th className="py-2 px-4 border border-gray-300">{t("thWorkerId")}</th>
                            <th className="py-2 px-4 border border-gray-300">{t("thName")}</th>
                            <th className="py-2 px-4 border border-gray-300">{t("thEmail")}</th>
                            <th className="py-2 px-4 border border-gray-300">{t("thActiveIncidents")}</th>
                            <th className="py-2 px-4 border border-gray-300">{t("thActions")}</th>
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
                                            title={t("edit")}
                                        >
                                            <Edit size={16} onClick={() => navigate('/company/trabajadores/editarTrabajador')} />
                                        </button>
                                        <button 
                                            className="text-red-500 hover:text-red-700"
                                            title={t("delete")}
                                        >
                                            <Trash2 size={16} onClick={() => handleEliminarWorker(worker.workerid)} />
                                        </button>
                                        <button 
                                            className="text-purple-500 hover:text-purple-700"
                                            title={t("generateCode")}
                                        >
                                            <Code size={16} onClick={() => handleGenerateCode(worker.workerid)} />
                                        </button>
                                        <button 
                                            className="text-green-600 hover:text-green-800 text-sm px-2 py-1 bg-green-100 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                                            onClick={() => handleOpenShiftModal(worker)}
                                        >
                                            <Calendar size={14} />
                                            {t("shift")}
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
                    {t("previous")}
                </button>
                <span className="flex items-center px-4 py-2">
                    {t("page", { current: currentPage, total: Math.ceil(totalWorkers / pageSize) })}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage >= Math.ceil(totalWorkers / pageSize)}
                    className="flex items-center px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50"
                >
                    {t("next")}
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
                                {t("assignShift")}
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
                            <p className="text-sm text-gray-600">{t("worker")}</p>
                            <p className="font-semibold text-gray-800">{selectedWorker.name}</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(handleSubmitShift)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("startDate")}
                                </label>
                                <input
                                    type="date"
                                    {...register('startDate')}
                                    
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                        errors.startDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.startDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("endDate")}
                                </label>
                                <input
                                    type="date"
                                    {...register('endDate')}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                        errors.endDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.endDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("shiftType")}
                                </label>
                                <select
                                    {...register('shiftType')}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                        errors.shiftType ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="morning">{t("morning")}</option>
                                    <option value="afternoon">{t("afternoon")}</option>
                                    <option value="night">{t("night")}</option>
                                    <option value="fullday">{t("fullday")}</option>
                                </select>
                                {errors.shiftType && (
                                    <p className="text-red-500 text-sm mt-1">{errors.shiftType.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("notes")}
                                </label>
                                <textarea
                                    {...register('notes')}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    rows={3}
                                    placeholder={t("notesPlaceholder")}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                >
                                    {t("cancel")}
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                                >
                                    {t("assignShiftBtn")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

