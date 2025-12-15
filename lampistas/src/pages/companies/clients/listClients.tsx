import Header from '../components/header';
import { useState, useEffect } from 'react';
import { Eye,Code } from 'lucide-react';
import type { Contract } from '../../../types/contract';
import type { Client } from '../../../types/clientType';
import toast from 'react-hot-toast';

export default function ListClients() {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/assignUserCode/${userID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
         
            });

            const data = await response.json();
            if (data.code) {
                toast.success(`Code generated successfully: ${data.code}`);
                window.navigator.clipboard.writeText(data.code);
            } else {
                toast.error('Error generating code.');
            }
        } catch (error) {
            toast.error('Error generating code.' + (error as Error).message);
        }
    }
    function fetchClients() {
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/listClients?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                
                setClients(data.clients);
                setTotalClient(data.total);
            })
            .catch((error) => {
                toast.error('Error fetching clients.' + (error as Error).message);
            });
    }

    async function viewClientContracts(userID: number, clientName: string) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/getClientContracts/${userID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
         
            if (data.contracts) {
                setSelectedClientContracts(data.contracts);
                setSelectedClientName(clientName);
                setShowContractsModal(true);
            }
        } catch (error) {
            toast.error('Error fetching client contracts.' + (error as Error).message);
        }
    }

    function formatDate(dateString: string | null) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES');
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">Lista de Clientes</h2>
            
            <div className="w-full max-w-7xl overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md">
                    <thead>
                        <tr className="bg-amber-200">
                            <th className="py-2 px-4 border border-gray-300 text-left">ID Cliente</th>
                            <th className="py-2 px-4 border border-gray-300 text-left">Nombre</th>
                            <th className="py-2 px-4 border border-gray-300 text-left">Email</th>
                            <th className="py-2 px-4 border border-gray-300 text-left">Tipo de Contrato</th>
                            <th className="py-2 px-4 border border-gray-300 text-left">Acciones</th>
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
                                        {client.contract === ' CONTRACT' ? 'Contract' : 'Free Choice'}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <button
                                        onClick={() => viewClientContracts(client.userID, client.name)}
                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                                        title="View Contracts"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span className="text-sm">View Contracts</span>
                                    
                                    </button>
                                        <button 
                                            className="p-2 hover:bg-amber-200 rounded transition-colors"
                                            title="Generate code"
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
                        Previous
                    </button>
                    <span className="font-medium">Page {currentPage} of {Math.ceil(totalClient / pageSize)}</span>
                    <button
                        className="bg-amber-500 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage * pageSize >= totalClient}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal de contratos */}
            {showContractsModal && selectedClientContracts && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Contracts for {selectedClientName}</h3>
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
                                <p className="text-center text-gray-500 py-8">No contracts found</p>
                            ) : (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
                                                        {contract.contractType === " CONTRACT" ? 'Contract' : 'Free Choice'}
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
                                                        {contract.isActive ? 'Active' : 'Inactive'}
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
