import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Header from "../../components/header";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Map, MapPin } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { userRegisterSchema, type UserRegisterData } from "./schemas/userRegisterSchema";
import { API_BASE_URL } from "../../config/baseUrl";
export default function UserRegister() {
    const navigate = useNavigate();
    const { t } = useTranslation("users.registerPage");
    const [showPassword, setShowPassword] = useState(false);
   const {
    register :  registerForm,
    handleSubmit : handleFormSubmit,
    formState: { errors: registerErrors },
   } = useForm<UserRegisterData>({
    resolver: zodResolver(userRegisterSchema),
    mode: "onChange",
    })

   
    
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
    
    async function handleSubmit(data : UserRegisterData) {
        try {
            const response = await fetch(`${API_BASE_URL}/user/userRegister`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();

            if (!response.ok) {
                toast.error(responseData?.message || t("registerError"));
                return;
            }

            if (responseData) {
                const loginResponse = await fetch(`${API_BASE_URL}/user/userLogin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: data.email, password: data.password }),
                });

                const loginData = await loginResponse.json();

                if (!loginResponse.ok || !loginData?.token) {
                    toast.error(loginData?.message || t("registerError"));
                    return;
                }

                localStorage.setItem("userToken", loginData.token);
                localStorage.setItem("userType", "user");
                if (loginData.userID) {
                    localStorage.setItem("userID", loginData.userID.toString());
                }

                toast.success(t("success"));

                navigate('/user/searchCompanies');
            } else {
                toast.error(t("registerError"));
            }
        } catch (error) {
    
            toast.error(t("registerErrorDetail", { message: (error as Error).message }));
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-100 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            
            <div className="w-full max-w-md">
                {/* Título mejorado */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{t("title")}</h2>
                    <p className="text-gray-600">{t("subtitle")}</p>
                </div>

                {/* Formulario moderno */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-amber-100">
                    <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-6">
                        {/* Campo Nombre */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 text-sm font-semibold">
                                {t("name")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    {...registerForm("name")}
                                    placeholder={t("namePh")}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                />
                            </div>
                            {registerErrors.name && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <span>⚠️</span>
                                    {registerErrors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Campo Email */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 text-sm font-semibold">
                                {t("email")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    {...registerForm("email")}
                                    placeholder={t("emailPh")}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                />
                            </div>
                            {registerErrors.email && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <span>⚠️</span>
                                    {registerErrors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Campo Contraseña */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 text-sm font-semibold">
                                {t("password")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...registerForm("password")}
                                    placeholder={t("passwordPh")}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={togglePassword}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-amber-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-amber-600 transition-colors" />
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
                        {/*direcciones*/}
                       <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Map className="w-5 h-5 text-blue-600" />
                                {t("addressInfo")}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Dirección */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        {t("address")}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder={t("addressPh")}
                                            {...registerForm("directions.0.address")}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                                registerErrors.directions?.[0]?.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {registerErrors.directions?.[0]?.address && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {registerErrors.directions[0]?.address?.message}
                                        </p>
                                    )}
                                </div>

                                {/* Ciudad */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        {t("city")}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t("city")}
                                        {...registerForm("directions.0.city")}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                            registerErrors.directions?.[0]?.city ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {registerErrors.directions?.[0]?.city && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {registerErrors.directions[0]?.city?.message}
                                        </p>
                                    )}
                                </div>

                                {/* Estado */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        {t("state")}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t("state")}
                                        {...registerForm("directions.0.state")}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                            registerErrors.directions?.[0]?.state ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {registerErrors.directions?.[0]?.state && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {registerErrors.directions[0]?.state?.message}
                                        </p>
                                    )}
                                </div>

                                {/* Código postal */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        {t("zipCode")}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t("zipCode")}
                                        {...registerForm("directions.0.zipCode")}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                            registerErrors.directions?.[0]?.zipCode ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {registerErrors.directions?.[0]?.zipCode && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {registerErrors.directions[0]?.zipCode?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                                {t("registerButton")}
                            </button>
                        </div>

                    </form>
                    
                    {/* Link al login */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600 text-sm">
                            {t("hasAccount")} {" "}
                            <button
                                onClick={() => navigate('/user/userLogin')}
                                className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                            >
                                {t("goLogin")}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
