import {toast} from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {registerCompanySchema, type RegisterCompanySchema } from './schemas/registerCompanySchema';
import Header from '../admin/components/header';
import { useState } from 'react';
import api from '../../api/intercepttors'   
import { 
  Building2, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Image, 
  Eye, 
  EyeOff,
  Send,
  Building,
  Map
} from 'lucide-react';
export default function RegisterCompany() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
  const {
            register : registerForm, // renombrado para evitar conflicto con función handleRegister
            handleSubmit : handleSubmitregister,
            formState: { errors : registerErrors },
        } = useForm<RegisterCompanySchema>({
            resolver: zodResolver(registerCompanySchema),
            mode: "onChange", // ✅ Valida mientras escribes
        });
        
   async function handleSubmit(data : RegisterCompanySchema) {
        try {
            // Crear FormData para enviar archivos
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('phone', data.phone);
            
            formData.append('directions', JSON.stringify(data.directions));
            
            // Añadir el logo si existe
            if (data.companyLogo && data.companyLogo.length > 0) {
                formData.append('logo', data.companyLogo[0]);
            }

            const response = await api.post('/admin/registerCompany', formData);
             
            const result = response.data;
        
            
            if (result.token){
                toast.success('¡Empresa registrada exitosamente!');
                navigate('/admin/adminDashboard');
            } else {
                const errorMsg = result.message || 'Error al registrar empresa';
              
                toast.error(errorMsg);
            }
        } catch (error) {
            console.error('Error registering company:', error);
            toast.error('Error de conexión con el servidor');
        }
    }
    return (
        <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            
            <div className="w-full max-w-4xl">
                {/* Título */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Registrar Nueva Empresa</h2>
                    <p className="text-gray-600">Agrega una empresa al sistema</p>
                </div>

                {/* Formulario moderno */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                    <form onSubmit={handleSubmitregister(handleSubmit)} className="space-y-8">
                        {/* Información Básica */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Building className="w-5 h-5 text-blue-600" />
                                Información de la Empresa
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nombre de la empresa */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        Nombre de la Empresa
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Nombre de la empresa"
                                            {...registerForm("name")}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                                registerErrors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {registerErrors.name && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {registerErrors.name.message}
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
                                            inputMode="email"
                                            placeholder="correo@empresa.com"
                                            {...registerForm("email")}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                                registerErrors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {registerErrors.email && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {registerErrors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Contraseña */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Contraseña segura"
                                            {...registerForm("password")}
                                            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                                registerErrors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePassword}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors" />
                                            )}
                                        </button>
                                    </div>
                                    {registerErrors.password && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {registerErrors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        Teléfono
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            inputMode="tel"
                                            placeholder="+1 234 567 890"
                                            {...registerForm("phone")}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                                registerErrors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {registerErrors.phone && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {registerErrors.phone.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Logo de la empresa */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Image className="w-5 h-5 text-blue-600" />
                                Imagen Corporativa
                            </h3>
                            
                            <div className="space-y-2">
                                <label className="block text-gray-700 text-sm font-semibold">
                                    Logo de la Empresa
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...registerForm("companyLogo")}
                                    className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                                        registerErrors.companyLogo ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {registerErrors.companyLogo && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span>
                                        {registerErrors.companyLogo.message}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Formatos soportados: JPG, PNG, GIF. Máximo 5MB.
                                </p>
                            </div>
                        </div>

                        {/* Dirección */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Map className="w-5 h-5 text-blue-600" />
                                Dirección de la Empresa
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Dirección */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        Dirección
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Calle, número, edificio..."
                                            {...registerForm("directions.address")}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                                registerErrors.directions?.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {registerErrors.directions?.address && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {registerErrors.directions.address.message}
                                        </p>
                                    )}
                                </div>

                                {/* Ciudad */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ciudad"
                                        {...registerForm("directions.city")}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                            registerErrors.directions?.city ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {registerErrors.directions?.city && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {registerErrors.directions.city.message}
                                        </p>
                                    )}
                                </div>

                                {/* Estado */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        Estado/Provincia
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Estado"
                                        {...registerForm("directions.state")}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                            registerErrors.directions?.state ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {registerErrors.directions?.state && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {registerErrors.directions.state.message}
                                        </p>
                                    )}
                                </div>

                                {/* Código postal */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        Código Postal
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="C.P."
                                        {...registerForm("directions.zipCode")}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                            registerErrors.directions?.zipCode ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {registerErrors.directions?.zipCode && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {registerErrors.directions.zipCode.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botón de envío */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                            >
                                <Send className="w-5 h-5" />
                                Registrar Empresa
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}