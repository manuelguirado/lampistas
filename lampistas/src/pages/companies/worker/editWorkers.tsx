import Header from '../components/header';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {editSchema } from '../schemas/editSchema';
import type {EditSchema} from '../schemas/editSchema';
import { useState } from 'react';
import { HardHat, User, Mail, Lock, Eye, EyeOff, Edit, Hash } from 'lucide-react';

export default function EditWorkers() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
  
    const {register, handleSubmit : handleEditWorker, formState: { errors } } = useForm<EditSchema>({
        resolver: zodResolver(editSchema),
        mode: 'onChange',
    });
    const token = localStorage.getItem('companyToken');
    function handleSubmit(data : EditSchema) {
       

        // Excluir workerID del body, solo enviarlo en la URL
        const { workerid, ...updateData } = data;
     
        // Filtrar campos vacíos - solo enviar los que tienen valor
        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value && value.length > 0)
        );
  

        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/editWorker/${workerid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            
            body: JSON.stringify({
                data: filteredData // Solo campos con valor
            }),
        })
            .then((response) => response.json())
            .then(() => {
                toast.success('Worker modified successfully!');
                navigate('/company/trabajadores/misTrabajadores');
            })
            .catch((error) => {
                toast.error('Error modifying worker: ' + error.message);
            });
    }
    return (
        <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-yellow-100 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            
            <div className="w-full max-w-md">
                {/* Título */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-600 to-yellow-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Edit className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Editar Trabajador</h2>
                    <p className="text-gray-600">Actualizar información del empleado</p>
                </div>

                {/* Formulario moderno */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-100">
                    <form onSubmit={handleEditWorker(handleSubmit)} className="space-y-6">
                        {/* ID del trabajador */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 text-sm font-semibold">
                                ID del Trabajador
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Hash className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    placeholder="Ingrese el ID del trabajador"
                                    {...register('workerid')}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                />
                            </div>
                            {errors.workerid && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <span>⚠️</span>
                                    {errors.workerid.message}
                                </p>
                            )}
                        </div>

                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 text-sm font-semibold">
                                Nombre Completo
                                <span className="text-xs text-gray-500 ml-2">(Opcional)</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nuevo nombre (dejar vacío si no desea cambiarlo)"
                                    {...register('name')}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
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
                                <span className="text-xs text-gray-500 ml-2">(Opcional)</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Nuevo email (dejar vacío si no desea cambiarlo)"
                                    {...register('email')}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
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
                                Nueva Contraseña
                                <span className="text-xs text-gray-500 ml-2">(Opcional)</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nueva contraseña (dejar vacío si no desea cambiarla)"
                                    {...register('password')}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={togglePassword}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-orange-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-orange-600 transition-colors" />
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

                        {/* Botón de envío */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-600 to-yellow-700 text-white py-3 px-4 rounded-xl hover:from-orange-700 hover:to-yellow-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <Edit className="w-5 h-5" />
                            Actualizar Trabajador
                        </button>
                    </form>
                    
                    {/* Información adicional */}
                    <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                        <div className="flex items-start gap-2">
                            <HardHat className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-orange-800 font-semibold text-sm">Importante:</h4>
                                <p className="text-orange-700 text-xs mt-1">
                                    Solo se actualizarán los campos que tengan un valor. 
                                    Los campos vacíos se mantendrán sin cambios.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 