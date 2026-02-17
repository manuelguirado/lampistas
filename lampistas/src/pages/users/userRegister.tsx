import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Header from "../../components/header";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useTranslation } from "react-i18next";
export default function UserRegister() {
    const navigate = useNavigate();
    const { t } = useTranslation("users.registerPage");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
       
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/user/userRegister`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
          
            if (data ) {
                toast.success(t("success"));
                setFormData({ name: '', email: '', password: '' });
                navigate('/user/userLogin');
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
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    name="name"
                                    placeholder={t("namePh")}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    required
                                />
                            </div>
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
                                    name="email"
                                    placeholder={t("emailPh")}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    required
                                />
                            </div>
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
                                    name="password"
                                    placeholder={t("passwordPh")}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    required
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
                        </div>

                        {/* Botón de registro */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            {t("submit")}
                        </button>
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