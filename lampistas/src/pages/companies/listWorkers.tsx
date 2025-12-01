import { useEffect, useState } from "react";
import  Header from  "../companies/components/header";
import { Edit, Code, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
export default function ListWorkers() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalWorkers, setTotalWorkers] = useState(0);
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
    function handleGenerateCode(workerID: number){
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
                console.error('Error:', error);
                alert('Error generating code.');
            });

    }
    function handleEliminarWorker(workerID: number){
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
            alert('Worker deleted successfully!');
          window.location.reload();
      }); 
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
            console.log('Workers data:', data);
            setWorkers(data.workers || []);
            setTotalWorkers(data.total || 0);
        })
        .catch((error) => {
            console.error('Error fetching workers:', error);
        });
}, [currentPage]);
    return (
        <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
            <Header />
            <h2 className="text-2xl font-bold p-20">List Workers Page</h2>
            <table className="min-w-full bg-white border border-gray-300">
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
                            <td className="py-2 px-4 border-b border-gray-300 flex gap-2">
                                <button className="text-blue-500 hover:text-blue-700">
                                    <Edit size={16} onClick={() => navigate('/company/editarTrabajador')} />
                                </button>
                                <button className="text-red-500 hover:text-red-700">
                                    <Trash2 size={16} onClick={() => handleEliminarWorker(worker.workerid)} />
                                </button>
                                <button 
                                    className="text-purple-500 hover:text-purple-700"
                                  
                                >
                                    <Code size={16}   onClick={() => handleGenerateCode(worker.workerid)} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
        </div>
    );
   
}

