import Header from '../companies/components/header';
import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import type { Contract } from '../../types/contract';
import type { Client } from '../../types/clientType';

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

    function fetchClients() {
        fetch(`http://localhost:3000/company/listClients?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched clients:', data);
                setClients(data.clients);
                setTotalClient(data.total);
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error fetching clients.');
            });
    }

    async function viewClientContracts(userID: number, clientName: string) {
        try {
            const response = await fetch(`http://localhost:3000/company/getClientContracts/${userID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log('Contracts data:', data);

            if (data.contracts) {
                setSelectedClientContracts(data.contracts);
                setSelectedClientName(clientName);
                setShowContractsModal(true);
            }
        } catch (error) {
            console.error('Error fetching contracts:', error);
            alert('Error loading contracts');
        }
    }

    function formatDate(dateString: string | null) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES');
    }

    return (
        <div className="w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
            <Header />
            <h2 className="text-2xl font-bold p-4">List Clients Page</h2>
            
            <div className="w-full max-w-6xl">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b text-left">Client ID</th>
                            <th className="py-3 px-4 border-b text-left">Name</th>
                            <th className="py-3 px-4 border-b text-left">Email</th>
                            <th className="py-3 px-4 border-b text-left">Contract Type</th>
                            <th className="py-3 px-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.userID} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b">{client.userID}</td>
                                <td className="py-3 px-4 border-b">{client.name}</td>
                                <td className="py-3 px-4 border-b">{client.email}</td>
                                <td className="py-3 px-4 border-b">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        client.contract === 'contract' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {client.contract === 'contract' ? 'Contract' : 'Free Choice'}
                                    </span>
                                </td>
                                <td className="py-3 px-4 border-b text-center">
                                    <button
                                        onClick={() => viewClientContracts(client.userID, client.name)}
                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                                        title="View Contracts"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span className="text-sm">View Contracts</span>
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
                                                        contract.contractType === 'contract' 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {contract.contractType === 'contract' ? 'Contract' : 'Free Choice'}
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
