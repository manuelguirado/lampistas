import { useNavigate } from "react-router";
import Header from "../../components/header";
import toast from "react-hot-toast";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {workerLoginSchema, type WorkerLoginSchema} from '../worker/schemas/workerLogin';
import { useState } from 'react';
import { Eye, EyeOff, Wrench, Mail, Lock, HardHat } from 'lucide-react';
import api from '../../api/intercepttors'
import { useTranslation } from "react-i18next";
export default function WorkerLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation("worker.loginPage");
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

    const {
        register : loginRegister,
        handleSubmit : handleLoginSubmit,
        formState: { errors : loginErrors },
    } = useForm<WorkerLoginSchema>({
        resolver: zodResolver(workerLoginSchema),
        mode: "onChange",
    });
  function handleValidateCode(data : WorkerLoginSchema) {

    api.post('/worker/validateCode', {
      userType: "worker",
      code: data.code,
    })
      .then((response) => response.data)
      
      .then((response) => response.json())
      .then((data) => {

        // Guardar el token en localStorage
        if (data.token) {
          localStorage.setItem("workerToken", data.token);

          navigate("/worker/workerDashboard");
        } else {
          toast.error(t("invalidCode"));
        }
      })
      .catch((error) => {
        toast.error(t("codeError", { message: error.message }));
      });
  }
  function handleLogin(data : WorkerLoginSchema) {
 
    api.post('/worker/workerLogin' , {
      userType: "worker",
      ...data
    })
      .then((res) => res.data)
      .then((data) => {
        if (data.token) {
          toast.success(t("loginSuccess"));
          // Guardar token y userType en localStorage
          localStorage.setItem("workerToken", data.token);
          localStorage.setItem("userType", "worker");
          if (data.refreshToken) {
            localStorage.setItem("workerRefreshToken", data.refreshToken);
          }
          if (data.workerID) {
            localStorage.setItem("workerID", data.workerID.toString());
          }
          navigate("/worker/workerDashboard");
        } else {
          toast.error(t("invalidCredentials"));
        }
      })
      .catch((err) => {
        toast.error(t("loginError", { message: err.message }));
      });
  }
  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-100 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      
      <div className="w-full max-w-md">
        {/* Título con diseño de trabajadores */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <HardHat className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t("title")}</h2>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Formulario principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-green-100">
          {/* Email/Password Form */}
          <form onSubmit={handleLoginSubmit(handleLogin)} className="space-y-6">
            {/* Email Input */}
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
                  id="email"
                  {...loginRegister("email")}
                  placeholder={t("emailPh")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              {loginErrors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {loginErrors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
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
                  id="password"
                  {...loginRegister("password")}
                  placeholder={t("passwordPh")}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
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

            {/* Botón Login */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t("loginEmail")}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm font-medium">{t("or")}</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Código de trabajador */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">{t("workerCodeTitle")}</h3>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Wrench className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="workerCode"
                  {...loginRegister("code")}
                  placeholder={t("workerCodePh")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              {loginErrors.code && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {loginErrors.code.message}
                </p>
              )}
            </div>
            
            <button
              type="button"
              onClick={handleLoginSubmit(handleValidateCode)}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t("loginCode")}
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {t("support")}{" "}
            <a href="#" className="text-green-600 hover:text-green-700 font-semibold">
              {t("contactSupport")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
