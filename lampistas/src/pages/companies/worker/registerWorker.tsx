import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import Header from '../components/header';
import {useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { registerSchema, type RegisterSchema } from '../schemas/workerSchema';
import toast from "react-hot-toast";
export default  function RegisterWorker() {
  
    const navigate = useNavigate();
    const { register, handleSubmit: handleSubmitRegister, formState: { errors } } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    });
   function handleSubmit(data: RegisterSchema) {
        const token = localStorage.getItem('companyToken');
    
        fetch('http://localhost:3000/company/RegisterWorker', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token && data.workerid) {
                    toast.success('¡Trabajador registrado exitosamente!');
        
                
                    navigate('/company/trabajadores/misTrabajadores');
                } else {
                   toast.error('Error registering worker: ' + (data.message || 'No se pudo registrar'));
                }
            })
            .catch((error) => {
                alert('Error registering worker: ' + error.message);
            });
    }
    const token = localStorage.getItem('companyToken');
    if (!token) {
        return <Navigate to="/company/companyLogin" replace />;
    }
    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">Registrar Trabajador</h2>
            
            <form onSubmit={handleSubmitRegister(handleSubmit)} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Nombre
                    </label>
                    <input
                     
                        placeholder="Nombre completo"
                        {...register("name")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Contraseña
                    </label>
                    <input
                        type="password"
                    
                        placeholder="Contraseña"
                        {...register("password")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
                >
                    Registrar Trabajador
                </button>
            </form>
        </div>
    );
}