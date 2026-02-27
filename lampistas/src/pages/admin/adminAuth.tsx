import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./schemas/registerSchema";
import type { RegisterSchema } from "./schemas/registerSchema";
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Shield, Mail, Lock, UserPlus, LogIn } from "lucide-react";
import api from '../../api/intercepttors'
import { useTranslation } from "react-i18next";

export default function AdminAuth() {
  const navigate = useNavigate();
  const { t } = useTranslation("admin.authPage");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  const toggleRegisterPassword = () => {
    setShowRegisterPassword(!showRegisterPassword);
  };
  
  const toggleLoginPassword = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  // ✅ FORMULARIO DE REGISTRO CON ZOD
  const {
    register: registerForm, // renombrado para evitar conflicto con función handleRegister
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // ✅ Valida mientras escribes
  });

  // ✅ FORMULARIO DE LOGIN CON ZOD (creamos otro schema)
  const {
    register: loginForm,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema), // mismo schema (email + password)
    mode: "onChange", // ✅ Valida mientras escribes
  });

  // ✅ FUNCIÓN DE REGISTRO - Recibe data validada por Zod
  const onRegisterSubmit = async (data: RegisterSchema) => {
    try {
      const response = await api.post('/admin/adminRegister', data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = response.data;

      if (result.token) {
        localStorage.setItem("adminToken", result.token);
        localStorage.setItem("userType", "admin");
        toast.success(t("registerSuccess"));
        navigate("/admin/adminDashboard");
      } else {
        // ✅ Mostrar el mensaje específico del backend
        const errorMsg = result.message || t("registerError");
  
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("💥 Error de conexión:", error); // ✅ Debug
      toast.error(t("serverError"));
    }
  };

  // ✅ FUNCIÓN DE LOGIN - Recibe data validada por Zod
  const onLoginSubmit = async (data: RegisterSchema) => {
    try {
      const response =api.post('/admin/adminLogin', data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = (await response).data;

      if (result.token) {
        localStorage.setItem("adminToken", result.token);
        localStorage.setItem("userType", "admin");
        toast.success(t("loginSuccess"));
        navigate("/admin/adminDashboard");
      } else {
        // ✅ Mostrar el mensaje específico del backend
        toast.error(result.message || t("loginError"));
      }
    } catch (error) {
      toast.error(
        t("serverError") + (error as Error).message
      );
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-indigo-100 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      
      {/* Título principal */}
      <div className="text-center mb-12">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full flex items-center justify-center mb-6 shadow-xl">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {t("panelTitle")}
        </h1>
        <p className="text-gray-600 text-lg">{t("panelSubtitle")}</p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registro de Administrador */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-purple-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("registerTitle")}</h2>
            <p className="text-gray-600 text-sm">{t("registerSubtitle")}</p>
          </div>
          
          <form
            onSubmit={handleRegisterSubmit(onRegisterSubmit)}
            className="space-y-6"
          >
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
                  placeholder="admin@example.com"
                  {...registerForm("email")}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    registerErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {registerErrors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {registerErrors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                {t("password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder={t("password")}
                  {...registerForm("password")}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    registerErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleRegisterPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showRegisterPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
                  )}
                </button>
              </div>
              {registerErrors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {registerErrors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              {t("registerButton")}
            </button>
          </form>
        </div>

        {/* Login de Administrador */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-purple-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("loginTitle")}</h2>
            <p className="text-gray-600 text-sm">{t("loginSubtitle")}</p>
          </div>
          
          <form
            onSubmit={handleLoginSubmit(onLoginSubmit)}
            className="space-y-6"
          >
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
                  placeholder="admin@example.com"
                  {...loginForm("email")}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    loginErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {loginErrors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {loginErrors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                {t("password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder={t("password")}
                  {...loginForm("password")}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    loginErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleLoginPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showLoginPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-purple-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-purple-600 transition-colors" />
                  )}
                </button>
              </div>
              {loginErrors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {loginErrors.password.message}
                </p>
              )}
               <a href="/forgotPassword" className="text-amber-600 hover:text-amber-700 font-semibold">
                {t("forgotPassword")}
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {t("loginButton")}
            </button>
          </form>
        </div>
      </div>
      
      {/* Footer de seguridad */}
      <div className="text-center mt-12 max-w-2xl">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-800">{t("secureAccess")}</span>
          </div>
          <p className="text-gray-600 text-sm">
            {t("secureDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
