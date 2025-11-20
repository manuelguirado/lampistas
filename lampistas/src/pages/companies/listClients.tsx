import Header from '../companies/components/header';
import {useState, useEffect} from 'react';
export default function ListClients(){
    const [clients, setClients] = useState<Array<{userID:number; name:string; email:string}>>([]);

    const token = localStorage.getItem('companyToken');
      const [currentPage, setCurrentPage] = useState(1);
        const [totalClient, setTotalClient] = useState(0);
        const pageSize = 5;
    useEffect(() => {
        fetch(`http://localhost:3000/company/listClients?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}`, {
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
                console.error('Error:', error);
                alert('Error fetching clients.');
            });
    }, [currentPage, token]);
    return(
        <div className="w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
            <Header />
            <h2 className="text-2xl font-bold p-4">List Clients Page</h2>
            <table className="min-w-full bg-white">
                <thead></thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Client ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                    </tr>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.userID}>
                            <td className="py-2 px-4 border-b">{client.userID}</td>
                            <td className="py-2 px-4 border-b">{client.name}</td>
                            <td className="py-2 px-4 border-b">{client.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <button
                    className="bg-amber-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button
                    className="bg-amber-500 text-white px-4 py-2 rounded ml-2"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage * pageSize >= totalClient}
                >
                    Next
                </button>
            </div>
        </div>
    );
}   
    