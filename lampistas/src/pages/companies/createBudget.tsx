import BudgetPDFButton from "./components/budgetPDFButton";
import Header from '../companies/components/header';
import { useState } from 'react';
import type { ItemType } from '../../types/itemType';
import type { FormData } from '../../types/formData';
import { useNavigate } from "react-router";




function CreateBudget() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        incidentID : 0,
        clientName: "",
        clientEmail: "",
        clientID: 0,
        date: "",
        items: [{ description: "", quantity: 0, unitPrice: 0, total: 0 }],
        budgetNumber: "",
        companyName: "",
        subtotal: 0,
        tax: 0,
        totalAmmount: 0
    });
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const token = localStorage.getItem('companyToken');
        
        const { itemsWithTotal, subtotal, tax, total } = calculateTotals();
        
        fetch('http://localhost:3000/company/CreateBudget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                budgetNumber: formData.budgetNumber,
                userID: formData.clientID,
                items: itemsWithTotal, 
                subtotal: subtotal,
                tax: tax,
                totalAmount: total,
                incidentID: formData.incidentID || undefined,
                description: `Presupuesto ${formData.budgetNumber} para ${formData.clientName}`,
            }),
        })
        .then((response) => response.json())
        .then(() => {
            alert('Presupuesto creado exitosamente!');
            // Resetear formulario
            navigate('/company/dashboard');
            setFormData({
                incidentID: 0,
                clientName: "",
                clientEmail: "",
                clientID: 0,
                date: "",
                items: [{ description: "", quantity: 0, unitPrice: 0, total: 0 }],
                budgetNumber: "",
                companyName: "",
                subtotal: 0,
                tax: 0,
                totalAmmount: total 
            });
        })
        .catch((error) => {
            console.error('Error creating budget:', error);
            alert('Error al crear el presupuesto');
        }); 
    }

    function handleAddItem() {
        setFormData({
            ...formData,
            items: [...formData.items, { description: "", quantity: 0, unitPrice: 0 , total: 0}],
        });
    }

    function handleItemChange(index: number, field: keyof ItemType, value: string | number) {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    }

    function handleRemoveItem(index: number) {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    }

    // Calcular totales solo para mostrar en el formulario (no en el estado)
    function calculateTotals() {
        const itemsWithTotal = formData.items.map(item => ({
            ...item,
            total: item.quantity * item.unitPrice
        }));
        const subtotal = itemsWithTotal.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.21;
        const total = subtotal + tax;

        return { itemsWithTotal, subtotal, tax, total };
    }

    const { itemsWithTotal, subtotal, tax, total } = calculateTotals();

    // Preparar datos para el PDF con totales calculados
    function getBudgetData() {
        return {
            ...formData,
            items: itemsWithTotal,
            subtotal,
            tax,
            total
        };
    }

    return (
        <div className="w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
            <Header />
            <h2 className="text-2xl font-bold p-4">Create Budget</h2>
            
            <div className="w-full max-w-4xl">
                <form className='flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-md' onSubmit={handleSubmit}> 
                    <input
                        type="text"
                        placeholder="Budget Number"
                        value={formData.budgetNumber}
                        onChange={(e) => setFormData({ ...formData, budgetNumber: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Client Name"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input 
                    type="text"
                    placeholder="clientid"
                    value={formData.clientID || ''}
                    onChange={(e) => setFormData({ ...formData, clientID: Number(e.target.value)})}
                    className="border p-2 rounded"
                    required
                    />
                    <input
                        type="number"
                        placeholder="Incident ID"
                        value={formData.incidentID}
                        onChange={(e) => setFormData({ ...formData, incidentID: Number(e.target.value) })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Client Email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />

                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-bold mb-2">Items</h3>
                        {formData.items.map((item, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    className="border p-2 rounded flex-1"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={item.quantity || ''}
                                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                    className="border p-2 rounded w-24"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Unit Price"
                                    value={item.unitPrice || ''}
                                    onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                                    className="border p-2 rounded w-32"
                                    required
                                />
                                <span className="border p-2 rounded w-32 bg-gray-50 flex items-center justify-end">
                                    {(item.quantity * item.unitPrice).toFixed(2)}€
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                    disabled={formData.items.length === 1}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                        >
                            + Add Item
                        </button>
                    </div>

                    <div className="border-t pt-4 mt-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="font-semibold">Subtotal:</span>
                            <span>{subtotal.toFixed(2)}€</span> {/* ✅ Usar el calculado */}
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">IVA (21%):</span>
                            <span>{tax.toFixed(2)}€</span> {/* ✅ Usar el calculado */}
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>{total.toFixed(2)}€</span> {/* ✅ Usar el calculado */}
                        </div>
                    </div>
                    <button type="submit" className=" bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 m5-4 font-semibold">Crear Presupuesto </button>
                </form>

                <div className="mt-4 flex justify-center flex-row gap-20">
                    <BudgetPDFButton budgetData={getBudgetData()} />
                </div>
            </div>
        </div>
    );
}

export default CreateBudget;