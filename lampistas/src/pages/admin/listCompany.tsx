import Header from "./components/header";
import React, { useEffect, useState } from "react";
import { UserX, Edit, UserCheck,Code } from 'lucide-react';

export default function ListCompany() {
    function handleGenerateCode() {
        fetch(`http://localhost:3000/admin/generateCode`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
              const jsonData = JSON.stringify(data);
              const decodedData = JSON.parse(jsonData).code ;
    
                navigator.clipboard.writeText(decodedData);
                console.log('Code copied to clipboard:', data.code);
                alert('Code copied to clipboard: ' + data.code);    
            })
            .catch(error => {
                console.error('Error generating code:', error);
            });
    }
    function handleActivateCompany(companyId: string) {
        fetch(`http://localhost:3000/admin/activateCompany/${companyId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error activating company:', error);
            });
    }
    function handleSuspendCompany(companyId: string) {
        fetch(`http://localhost:3000/admin/suspendCompany/${companyId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error suspending company:', error);
            });
    }
    function handleEditCompany(companyId: string) {
        fetch(`http://localhost:3000/admin/editCompany/${companyId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error fetching company details:', error);
            });
    };
    const [companies, setCompanies] = useState<
        Array<{ name: string; email: string; phone: string; directions: { address: string } }>
    >([]);

    useEffect(() => {
        fetch('http://localhost:3000/admin/listCompany', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setCompanies(data.companies || []);
            })
            .catch(error => {
                console.error('Error fetching companies:', error);
            });
    }, []);

    return (
        <div className="min-h-screen bg-amber-50">
            <Header />
            <main className="pt-20 p-4">
                <h2 className="text-3xl font-bold text-amber-800 mb-6">List Companies</h2>
                <table className="w-full h-full border-solid">
                    <thead>
                        <tr className="bg-amber-200">
                            <th className="border px-4 py-2">Company name</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Phone</th>
                            <th className="border px-4 py-2">Address</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <tr key={company.name} className="hover:bg-amber-100">
                                <td className="border px-4 py-2">{company.name}</td>
                                <td className="border px-4 py-2">{company.email}</td>
                                <td className="border px-4 py-2">{company.phone}</td>
                                <td className="border px-4 py-2">{company.directions?.address || 'N/A'}</td>
                                <td className="border px-4 py-2">
                                    <div className="flex gap-2 justify-center">
                                        <button 
                                            className="p-2 hover:bg-amber-200 rounded transition-colors"
                                            title="Edit company"
                                        >
                                            <Edit size={18} className="text-blue-600" onClick={() => handleEditCompany(company.name)}
                                             />
                                        </button>
                                        <button 
                                            className="p-2 hover:bg-amber-200 rounded transition-colors"
                                            title="Suspend company"
                                        >
                                            <UserX size={18} className="text-red-600" onClick={() => handleSuspendCompany(company.name)} />
                                        </button>
                                        <button 
                                            className="p-2 hover:bg-amber-200 rounded transition-colors"
                                            title="Activate company"
                                        >
                                            <UserCheck size={18} className="text-green-600" onClick={() => handleActivateCompany(company.name)} />
                                        </button>
                                        <button 
                                            className="p-2 hover:bg-amber-200 rounded transition-colors"
                                            title="Generate code"
                                        >
                                            <Code size={18} className="text-purple-600" onClick={() => handleGenerateCode()} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}
    