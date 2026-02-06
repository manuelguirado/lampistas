import toast from 'react-hot-toast';
import Header from '../../components/header';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {loginSchema } from './schemas/loginSchema';
import type {LoginSchema} from './schemas/loginSchema';
import { useState } from 'react';
import { Eye, EyeOff, Building2, Mail, Lock } from 'lucide-react';
import api from '../../api/intercepttors'
import  {useNavigate} from 'react-router-dom';

export default function LoginCompany() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Formulario para email/password
    const {
        register: registerEmail,
        handleSubmit: handleSubmitEmailForm,
        formState: { errors: errorsEmail },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',   
    });

    // Formulario para código
    const {
        register: registerCode,
        handleSubmit: handleSubmitCodeForm,
        formState: { errors: errorsCode },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',   
    });
    function handleSubmitCompanyCode(data : LoginSchema) {
        
        api.post('/company/companyLoginCode', data)
        .then((response) => {
            const responseData = response.data
            if (responseData.token) {
                toast.success('¡Inicio de sesión exitoso!');
                localStorage.setItem('companyToken', responseData.token);

            }
        })
        .catch((error) => {
            toast.error('Error en login: ' + (error as Error).message);
        });
    }
    function handleSubmitEmail(data : LoginSchema) {
        
       
        api.post('/company/companyLogin', data)
        .then((response) => {
            const responseData = response.data
            if (responseData.token) {
                toast.success('¡Inicio de sesión exitoso!');
                navigate("/company/companyDashboard");
                localStorage.setItem('companyToken', responseData.token);
                localStorage.setItem('userType', 'COMPANY');
            }
        })
        .catch((error) => {
            toast.error('Error en login: ' + (error as Error).message);
        });
    }
              
    
    return (
        <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-100 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            
            <div className="w-full max-w-md">
                {/* Título con diseño empresarial */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Portal Empresas</h2>
                    <p className="text-gray-600">Accede a tu panel de control</p>
                </div>

                {/* Formulario principal */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-amber-100">
                    {/* Email/Password Form */}
                    <form onSubmit={handleSubmitEmailForm(handleSubmitEmail)} className="space-y-6">
                        {/* Email Input */}
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
                                    id="email"
                                    {...registerEmail("email")}
                                    placeholder="empresa@ejemplo.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                />
                            </div>
                            {errorsEmail.email && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errorsEmail.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
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
                                    id="password"
                                    {...registerEmail("password")}
                                    placeholder="Tu contraseña"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
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
                            {errorsEmail.password && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errorsEmail.password.message}
                                </p>
                            )}
                        </div>

                        {/* Botón Login */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Acceder con Email
                        </button>
                    </form>

                    {/* Separador */}
                    <div className="flex items-center my-8">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-gray-500 text-sm font-medium">O</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Código de empresa */}
                    <form onSubmit={handleSubmitCodeForm(handleSubmitCompanyCode)} className="space-y-4">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Building2 className="w-5 h-5 text-amber-600" />
                                <h3 className="text-lg font-semibold text-gray-800">Código de Empresa</h3>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="companyCode"
                                    {...registerCode("code")}
                                    placeholder="Código de empresa"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                />
                            </div>
                            {errorsCode.code && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errorsCode.code.message}
                                </p>
                            )}
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Acceder con Código
                        </button>
                    </form>
                </div>
                
                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm">
                        ¿Problemas para acceder?{" "}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Contacta soporte
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}   