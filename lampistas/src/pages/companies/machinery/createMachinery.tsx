
import { useEffect, useState } from "react";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { CreateMachinerySchema, type CreateMachineryType } from "../schemas/CreateMachinerySchema";
import { 
  Settings, 
  FileText, 
  Tag, 
  Calendar, 
  User, 
  MapPin, 
  Send,
  Wrench
} from 'lucide-react';

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
    
  
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/listClients?limit=100&offset=0`, {
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
        
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/createMachinery`, {
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
                                    Cliente
                                </label>
                                <select
                                    {...register("clientID")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="">Seleccionar cliente (opcional)</option>
                                    {clients.map((client) => (
                                        <option key={client.userID} value={client.userID}>
                                            {client.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.clientID && (<p className="text-red-500 text-sm mt-1">{errors.clientID.message}</p>)}
                            </div>
            
                            <button
                                type="submit"
                                className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors font-medium"
                            >
                                Crear Maquinaria
                            </button>
                        </form>
                    </div>
                );
}