import type { MachineryType } from "../../types/machineryType";
import { useEffect, useState } from "react";
import Header from "./components/header";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateMachinery() {
    const token = localStorage.getItem("companyToken");
    const [clients, setClients] = useState<Array<{ userID: number; name: string }>>([]); // ✅ Cambiar clientID a userID
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<MachineryType>({
        machineryID: 0,
        name: "",
        description: "",
        brand: "",
        model: "",
        installedAT: new Date(),
        serialNumber: "",
        companyName: "",
        machineType: "",
        clientID: null, // ✅ Cambiar de 0 a null
    });

    useEffect(() => {
        fetch("http://localhost:3000/company/listClients?limit=100&offset=0", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setClients(data.clients || []);
            })
            .catch((err) => toast.error("Error fetching clients: " + err.message));
    }, [token]);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        
        fetch("http://localhost:3000/company/createMachinery", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: formData.name,
                description: formData.description || null,
                brand: formData.brand || null,
                model: formData.model,
                serialNumber: formData.serialNumber,
                installedAT: new Date(),
                machineType: formData.machineType,
                companyName : formData.companyName || null,
                clientID: formData.clientID && formData.clientID !== 0 ? formData.clientID : null, // ✅ null si es 0 o vacío
            }),
        })
            .then((response) => response.json())
            .then((data) => {
            
        
                if (data.token) {
                    toast.success("Maquinaria creada exitosamente!");
                    navigate("/company/maquinaria/listarMaquinaria");
                } else {
                    toast.error('Error al crear maquinaria.');
                }
            })
            .catch((error) => {
                toast.error("Error creating machinery: " + error.message);
            });
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">Crear Maquinaria</h2>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
            >
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre de la maquinaria"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Descripción
                    </label>
                    <textarea
                        name="description"
                        placeholder="Descripción de la maquinaria"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        rows={4}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Marca
                    </label>
                    <input
                        type="text"
                        name="brand"
                        placeholder="Marca de la maquinaria"
                        value={formData.brand}
                        onChange={(e) =>
                            setFormData({ ...formData, brand: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Modelo
                    </label>
                    <input
                        type="text"
                        name="model"
                        placeholder="Modelo de la maquinaria"
                        value={formData.model}
                        onChange={(e) =>
                            setFormData({ ...formData, model: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />  
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Número de Serie
                    </label>
                    <input
                        type="text"
                        name="serialNumber"
                        placeholder="Número de serie"
                        value={formData.serialNumber}
                        onChange={(e) =>
                            setFormData({ ...formData, serialNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Tipo de Maquinaria
                    </label>
                    <select
                        name="machineType"
                        value={formData.machineType}
                        onChange={(e) =>
                            setFormData({ ...formData, machineType: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    >
                        <option value="">Selecciona un tipo</option>
                        <option value="CALDERA">Caldera</option>
                        <option value="BOMBA">Bomba</option>
                        <option value="COMPRESOR">Compresor</option>
                        <option value="HVAC">HVAC</option>
                        <option value="GENERADOR">Generador</option>
                        <option value="EXCAVADORA">Excavadora</option>
                        <option value="GRUA">Grúa</option>
                        <option value="OTRO">Otro</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Fecha de Instalación
                    </label>
                    <input
                        type="date"
                        name="installedAT"
                        value={formData.installedAT.toISOString().split('T')[0]}
                        onChange={(e) =>
                            setFormData({ ...formData, installedAT: new Date(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Nombre de la Empresa
                    </label>
                    <input
                        type="text"
                        name="companyName"
                        placeholder="Nombre de la empresa"
                        value={formData.companyName}
                        onChange={(e) =>
                            setFormData({ ...formData, companyName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />  
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Asignar a Cliente (Opcional)
                    </label>
                    <select
                        value={formData.clientID !== null && formData.clientID !== 0 ? formData.clientID.toString() : ""}
                        onChange={(e) => {
                            const value = e.target.value;
                    
                            setFormData({ 
                                ...formData, 
                                clientID: value !== "" ? Number(value) : null
                            });
                          
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="">Sin asignar</option> 
                        {clients.map((client) => (
                            <option key={client.userID} value={client.userID}> {/* ✅ Cambiar a userID */}
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
                >
                    Crear Maquinaria
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/company/maquinaria")}
                    className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}