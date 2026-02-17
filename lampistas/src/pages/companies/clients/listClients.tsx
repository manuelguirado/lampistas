import Header from '../components/header';
import { useState, useEffect } from 'react';
import { Eye,Code } from 'lucide-react';
import type { Contract } from '../../../types/contract';
import type { Client } from '../../../types/clientType';
import toast from 'react-hot-toast';
import api from '../../../api/intercepttors';
import { useTranslation } from "react-i18next";

export default function ListClients() {
    const { t, i18n } = useTranslation("companies.listClientsPage");
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClientContracts, setSelectedClientContracts] = useState<Contract[] | null>(null);
    const [selectedClientName, setSelectedClientName] = useState<string>('');
    const [showContractsModal, setShowContractsModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalClient, setTotalClient] = useState(0);
    const pageSize = 5;
    const token = localStorage.getItem('companyToken');
   

    useEffect(() => {
        fetchClients();
    }, [currentPage]);
        async function handleGenerateCode(userID: number) {
        try {
               api.get('/company/assignCode/' + userID, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "role": 'COMPANY',
                },
            }).then((res) => res.data).then((data) => {
                if (data.code) {
                    toast.success(t("codeGenerated", { code: data.code }));
                    window.navigator.clipboard.writeText(data.code);
                } else {
                    toast.error(t("codeError"));
                }
            });
        } catch (error) {
            toast.error(t("codeError") + " " + (error as Error).message);
        }
    }
    function fetchClients() {
        api.get(`/company/listClients?page=${currentPage}&pageSize=${pageSize}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                "role": 'COMPANY',
            },
        })
        .then((response) => {
            const data = response.data;
            setClients(data.clients);
            setTotalClient(data.total);
        })
        .catch((error) => {
            toast.error(t("fetchClientsError", { message: (error as Error).message }));
        });
    }

    async function viewClientContracts(userID: number, clientName: string) {
        try {
            const response = await api.get(`/company/getClientContracts/${userID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.data;
         
            if (data.contracts) {
                setSelectedClientContracts(data.contracts);
                setSelectedClientName(clientName);
                setShowContractsModal(true);
            }
        } catch (error) {
            toast.error(t("fetchContractsError", { message: (error as Error).message }));
        }
    }

    function formatDate(dateString: string | null) {
        if (!dateString) return t("na");
        return new Date(dateString).toLocaleDateString(i18n.language === "ca" ? "ca-ES" : i18n.language === "en" ? "en-US" : "es-ES");
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">{t("titulo")}</h2>
            
            <div className="w-full max-w-7xl overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md">
                    <thead>
                        <tr className="bg-amber-200">
                            <th className="py-2 px-4 border border-gray-300 text-left">{t("thId")}</th>
                            <th className="py-2 px-4 border border-gray-300 text-left">{t("thNombre")}</th>
                            <th className="py-2 px-4 border border-gray-300 text-left">{t("thEmail")}</th>
                            <th className="py-2 px-4 border border-gray-300 text-left">{t("thContrato")}</th>
                            <th className="py-2 px-4 border border-gray-300 text-left">{t("thAcciones")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.userID} className="hover:bg-amber-50">
                                <td className="py-2 px-4 border border-gray-300">{client.userID}</td>
                                <td className="py-2 px-4 border border-gray-300">{client.name}</td>
                                <td className="py-2 px-4 border border-gray-300">{client.email}</td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        client.contract === ' CONTRACT' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {client.contract === ' CONTRACT' ? t("contract") : t("freeChoice")}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <button
                                        onClick={() => viewClientContracts(client.userID, client.name)}
                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                                        title={t("viewContracts")}
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span className="text-sm">{t("viewContracts")}</span>
                                    
                                    </button>
                                        <button 
                                            className="p-2 hover:bg-amber-200 rounded transition-colors"
                                            title={t("generateCode")}
                                            onClick={() => handleGenerateCode(client.userID)}
                                        >
                                            <Code size={18} className="text-purple-600" />
                                        </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4 flex justify-center items-center gap-4">
                    <button
                        className="bg-amber-500 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        {t("previous")}
                    </button>
                    <span className="font-medium">{t("page", { current: currentPage, total: Math.ceil(totalClient / pageSize) })}</span>
                    <button
                        className="bg-amber-500 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage * pageSize >= totalClient}
                    >
                        {t("next")}
                    </button>
                </div>
            </div>

            {/* Modal de contratos */}
            {showContractsModal && selectedClientContracts && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold">{t("contractsFor", { name: selectedClientName })}</h3>
                            <button
                                onClick={() => {
                                    setShowContractsModal(false);
                                    setSelectedClientContracts(null);
                                }}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {selectedClientContracts.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">{t("noContracts")}</p>
                            ) : (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("contractType")}</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("startDate")}</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("endDate")}</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("status")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {selectedClientContracts.map((contract) => (
                                            <tr key={contract.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        contract.contractType === " CONTRACT"
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {contract.contractType === " CONTRACT" ? t("contract") : t("freeChoice")}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {formatDate(contract.startDate)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {formatDate(contract.endDate)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        contract.isActive 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {contract.isActive ? t("active") : t("inactive")}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
