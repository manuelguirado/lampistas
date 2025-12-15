import type { MachineryType } from "../../../types/machineryType";
import { useEffect, useState } from "react";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { CreateMachinerySchema, type CreateMachineryType } from "../schemas/CreateMachinerySchema";

export default function CreateMachinery() {
    const token = localStorage.getItem("companyToken");
    const [clients, setClients] = useState<Array<{ userID: number; name: string }>>([]); // ✅ Cambiar clientID a userID
    const navigate = useNavigate();
    const {
        register,
        handleSubmit: handleSubmitForm,
        formState: { errors },
    } = useForm<CreateMachineryType>({
        resolver: zodResolver(CreateMachinerySchema),
        mode: "onChange",
    });
    
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

    function handleSubmit(data: CreateMachineryType) {
        // Convertir la fecha a ISO string para el backend
        const payload = {
            ...data,
            installedAt: new Date(data.installedAt).toISOString(),
            clientID: data.clientID ? Number(data.clientID) : undefined,
        };
        
        fetch("http://localhost:3000/company/createMachinery", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
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
                onSubmit={handleSubmitForm(handleSubmit)}
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
            >
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        {...register("name")}
                        placeholder="Nombre de la maquinaria"                      
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                    {errors.name && (<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>)}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Descripción
                    </label>
                    <textarea
                      
                        placeholder="Descripción de la maquinaria"
                       {...register("description")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        rows={4}
                    />
                    {errors.description && (<p className="text-red-500 text-sm mt-1">{errors.description.message}</p>)}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Marca
                    </label>
                    <input
                        type="text"
                
                        placeholder="Marca de la maquinaria"
                        {...register("brand")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {errors.brand && (<p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>)}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Modelo
                    </label>
                    <input
                        type="text"
                    
                        placeholder="Modelo de la maquinaria"
                        {...register("model")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />  
                    {errors.model && (<p className="text-red-500 text-sm mt-1">{errors.model.message}</p>)}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Número de Serie
                    </label>
                    <input
                        type="text"
                        {...register("serialNumber")}
                        placeholder="Número de serie"
                       
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                    {errors.serialNumber && (<p className="text-red-500 text-sm mt-1">{errors.serialNumber.message}</p>)}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Tipo de Maquinaria
                    </label>
                    <select
                        {...register("machineType")}
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
                    {errors.machineType && (<p className="text-red-500 text-sm mt-1">{errors.machineType.message}</p>)}
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Fecha de Instalación
                    </label>
                    <input
                        type="date"
                        {...register("installedAt")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {errors.installedAt && (<p className="text-red-500 text-sm mt-1">{errors.installedAt.message}</p>)}
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Nombre de la Empresa
                    </label>
                    <input
                        type="text"
                        {...register("companyName")}
                        placeholder="Nombre de la empresa"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />  
                    {errors.companyName && (<p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>)}
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Asignar a Cliente (Opcional)
                    </label>
                    <select
                        {...register("clientID")}
                      
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="">Sin asignar</option> 
                        {clients.map((client) => (
                            console.log('Rendering client option:', client),
                            <option key={client.userID} value={client.userID}> {/* ✅ Cambiar a userID */}
                                {client.name}
                            </option>
                        ))}
                    </select>
                    {errors.clientID && (<p className="text-red-500 text-sm mt-1">{errors.clientID.message}</p>)}
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