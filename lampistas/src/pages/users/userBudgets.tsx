import { useState,useEffect } from "react";
import type { BudgetType } from "../../types/budgetType";
import Header from "./components/header";
export default function UserBudgets() {
    const token = localStorage.getItem('userToken');
    const [budgets, setBudgets] = useState<BudgetType[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/user/recievedBudgets', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
                , 'Authorization': `Bearer ${token}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setBudgets(data.budgets);
            })
            .catch((error) => {
                console.error('Error fetching budgets:', error);
            });
    }, [token]);
        return (
            <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
                <Header />
                <h2 className="text-2xl font-bold mb-6">Presupuestos Recibidos</h2>
                <div className="w-full max-w-7xl overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 shadow-md">
                        <thead>
                            <tr className="bg-amber-200">
                                <th className="py-2 px-4 border border-gray-300 text-left">ID de Presupuesto</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">ID de Incidente</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Título</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Estado</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Descripción</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Monto Total</th>
                                <th className="py-2 px-4 border border-gray-300 text-left">Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgets.map((budget) => (
                                <tr key={budget.budgetID} className="hover:bg-amber-50">
                                    <td className="py-2 px-4 border border-gray-300">{budget.budgetID}</td>
                                    <td className="py-2 px-4 border border-gray-300">{budget.incidentID}</td>
                                    <td className="py-2 px-4 border border-gray-300">{budget.title}</td>
                                    <td className="py-2 px-4 border border-gray-300">{budget.status}</td>
                                    <td className="py-2 px-4 border border-gray-300">{budget.description}</td>
                                    <td className="py-2 px-4 border border-gray-300">{budget.totalAmount}</td>
                                    <td className="py-2 px-4 border border-gray-300">
                                    <ul>
                                        {budget.items?.map((item, index) => (
                                            <li key={index}>
                                                {item.name} - Cantidad: {item.quantity} - Precio Unitario: {item.price}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
