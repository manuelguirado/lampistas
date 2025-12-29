import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../components/header";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { registerUserSchema, type RegisterUserSchema } from "../schemas/registerUser";
import { useState } from 'react';
import { Users, User, Mail, Lock, Eye, EyeOff, FileText, UserPlus } from 'lucide-react';

export default function RegisterUser() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
  
    const { register, handleSubmit:handleSubmitRegister, formState: { errors } } = useForm<RegisterUserSchema>({
        resolver: zodResolver(registerUserSchema),
        mode: "onChange",
    });

    async function handleSubmit(data : RegisterUserSchema) {
     
        const token = localStorage.getItem('companyToken');

        try {
            // PASO 1: Crear el usuario primero
            const userResponse = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/companyCreateUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const userData = await userResponse.json();

            if (!userData.userID) {
                toast.error('Error al registrar usuario.');
                return;
            }

            // PASO 2: Crear el contrato con el userID obtenido
            const contractResponse = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/createContract`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userID: userData.userID, // ✅ Ahora sí tenemos el userID
                    contractType: data.contractType,
                }),
            });

            const contractData = await contractResponse.json();

            if (contractData.token || contractData.id) {
                toast.success('¡Usuario y contrato creados exitosamente!');
                navigate('/company/clientes/mis-clientes');
            } else {
                toast.error('Usuario creado pero error al crear el contrato.');
            }

        } catch (error) {
            toast.error('Error durante el proceso de registro.' + (error as string));
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 to-blue-100 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            
            <div className="w-full max-w-md">
                {/* Título */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Nuevo Cliente</h2>
                    <p className="text-gray-600">Registrar cliente y crear contrato</p>
                </div>

                {/* Formulario moderno */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-cyan-100">
                    <form onSubmit={handleSubmitRegister(handleSubmit)} className="space-y-6">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 text-sm font-semibold">
                                Nombre Completo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nombre del cliente"
                                    {...register("name")}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    required
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <span>⚠️</span>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 text-sm font-semibold">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="cliente@email.com"
                                    {...register("email")}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    required
                                    inputMode="email"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <span>⚠️</span>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 text-sm font-semibold">
                                Contraseña Temporal
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Contraseña temporal"
                                    {...register("password")}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePassword}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-cyan-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-cyan-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <span>⚠️</span>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Tipo de contrato */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 text-sm font-semibold">
                                Tipo de Contrato
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    {...register("contractType")}
                                    required
                                >
                                    <option value="" disabled>Selecciona tipo de contrato</option>
                                    <option value="contract">📄 Contrato Fijo</option>
                                    <option value="freeChoice">🔄 Libre Elección</option>
                                </select>
                            </div>
                            {errors.contractType && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <span>⚠️</span>
                                    {errors.contractType.message}
                                </p>
                            )}
                        </div>

                        {/* Botón de registro */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-cyan-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            Registrar Cliente
                        </button>
                    </form>
                    
                    {/* Información adicional */}
                    <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
                        <div className="flex items-start gap-2">
                            <Users className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-cyan-800 font-semibold text-sm">Proceso automático:</h4>
                                <p className="text-cyan-700 text-xs mt-1">
                                    Se creará el usuario y automáticamente se generará el contrato asociado. 
                                    El cliente recibirá las credenciales por email.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}