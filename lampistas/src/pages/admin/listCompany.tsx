import Header from "./components/header";
import  { useEffect, useState } from "react";
import { UserX, Edit, UserCheck,Code,Trash2,ChevronRight,ChevronLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";


export default function ListCompany() {
    const navigate = useNavigate();
   const [currentPage, setCurrentPage] = useState(1);
   const pageSize = 5;

    function handleGenerateCode(companyId: string) {
        fetch(`http://localhost:3000/admin/assignCode/${companyId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
              
                navigator.clipboard.writeText(data.code);
                alert('Code copied to clipboard: ' + data.code);
            })
            .catch(error => {
                console.error('Error generating code:', error);
            });
    }
    function handleActivateCompany(companyId: string) {
        fetch(`http://localhost:3000/admin/activateCompany/${companyId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
            body: JSON.stringify({ companyID: Number(companyId) })
        })
            .then(response => response.json())
            .then( () => {
                alert('Company activated successfully');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error activating company:', error);
            });
    }
  
  
    function handleDeleteCompany(companyId: string) {   
        fetch(`http://localhost:3000/admin/eliminateCompany/${companyId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        })
            .then(response => response.json())
            .then(() => {
                alert('Company deleted successfully');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error deleting company:', error);
            });
    }
    const [companies, setCompanies] = useState<
        Array<{ companyID: string; name: string; email: string; phone: string; suspended: boolean; directions: { address: string } }>
    >([]);
    const [totalCompanies, setTotalCompanies] = useState(0);
    const totalPages = Math.ceil(totalCompanies / pageSize);

    useEffect(() => {
        const limit = pageSize;
        const offset = (currentPage - 1) * pageSize;
        fetch(`http://localhost:3000/admin/listCompany?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setCompanies(data.companies || []);
                setTotalCompanies(data.total || 0);
            })
            .catch(error => {
                console.error('Error fetching companies:', error);
            });
    }, [currentPage, pageSize]);

    return (
        <div className="min-h-screen bg-amber-50">
            <Header />
            <main className="pt-20 p-4">
                <h2 className="text-3xl font-bold text-amber-800 mb-6">List Companies</h2>
                <table className="w-full h-full border-solid">
                    <thead>
                        <tr className="bg-amber-200">
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Company name</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Phone</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Address</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <tr key={company.name} className="hover:bg-amber-100">
                                <td className="border px-4 py-2">{company.companyID}</td>
                                <td className="border px-4 py-2">{company.name}</td>
                                <td className="border px-4 py-2">{company.email}</td>
                                <td className="border px-4 py-2">{company.phone}</td>
                                <td className="border px-4 py-2">
                                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                                        company.suspended 
                                            ? 'bg-red-200 text-red-800' 
                                            : 'bg-green-200 text-green-800'
                                    }`}>
                                        {company.suspended ? 'Suspended' : 'Active'}
                                    </span>
                                </td>
                                <td className="border px-4 py-2">{company.directions?.address || 'N/A'}</td>
                                <td className="border px-4 py-2">
                                    <div className="flex gap-2 justify-center">
                                        <button 
                                            className="p-2 hover:bg-amber-200 rounded transition-colors"
                                            title="Edit company"
                                            onClick={() => navigate('/admin/editCompany')}
                                        >
                                            <Edit size={18} className="text-blue-600" />
                                        </button>
                                        
                                        {!company.suspended && (
                                            <button 
                                                className="p-2 hover:bg-amber-200 rounded transition-colors"
                                                title="Suspend company"
                                                onClick={() => navigate('/admin/suspendCompany')}
                                            >
                                                <UserX size={18} className="text-red-600" />
                                            </button>
                                        )}
                                        
                                        {company.suspended && (
                                            <button 
                                                className="p-2 hover:bg-amber-200 rounded transition-colors"
                                                title="Activate company"
                                                onClick={() => handleActivateCompany(company.companyID)}
                                            >
                                                <UserCheck size={18} className="text-green-600" />
                                            </button>
                                        )}
                                        <button
                                        className="p-2 hover:bg-amber-200 rounded transition-colors"
                                        title="Delete company"
                                        onClick={() => handleDeleteCompany(company.companyID)}
                                        >
                                            <Trash2 size={18} className="text-red-600" />
                                        </button>
                                        <button 
                                            className="p-2 hover:bg-amber-200 rounded transition-colors"
                                            title="Generate code"
                                            onClick={() => handleGenerateCode(company.companyID)}
                                        >
                                            <Code size={18} className="text-purple-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-t ">
                        <tr>
                            <td colSpan={7} className="flex justify-end space-x-4 p-4">
                                <button
                                    className="p-2 bg-amber-300 text-white rounded hover:bg-amber-400 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="px-4 py-2">Page {currentPage} of {totalPages || 1}</span>
                                <button
                                    className="p-2 bg-amber-300 text-white rounded hover:bg-amber-400 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    onClick={() => setCurrentPage((prev) => prev + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </main>
        </div>
    );
}
