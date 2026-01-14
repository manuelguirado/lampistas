import { useNavigate } from "react-router";
import Header from "../../components/header";
import { Eye, EyeOff, User, Lock, Building } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  userloginSchema,
  type UserLoginSchema,
} from "./schemas/userLoginSchema";
import api from '../../api/intercepttors'
export default function UserLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<UserLoginSchema>({
    resolver: zodResolver(userloginSchema),
    mode: "onChange",
  });
  
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleValidateCode = (data: UserLoginSchema) => {
    api.post('/user/validateCompanyCode', { code: data.code })
      .then((response) => {
        if (response.data.valid) {
          toast.success("¡Código de empresa válido!");
          // Redirigir o realizar alguna acción adicional
          navigate("/user/userDashboard");
        } else {
          toast.error("Código de empresa inválido");
        }
      })
      .catch(() => {
        toast.error("Error al validar el código de empresa");
      });
  };
  const handleSubmit = async (data: UserLoginSchema) => {
    api.post('/user/userLogin', data)
      .then((response) => {
        if (response.data.token) {
          toast.success("¡Inicio de sesión exitoso!");
          // Guardar el token y userType en localStorage
          localStorage.setItem("userToken", response.data.token);
          localStorage.setItem("userType", "user");
          if (response.data.refreshToken) {
            localStorage.setItem("userRefreshToken", response.data.refreshToken);
          }
          if (response.data.userID) {
            localStorage.setItem("userID", response.data.userID.toString());
          }

          navigate("/user/userdashboard");
        } else {
          toast.error("No se recibió token en la respuesta");
        }
      })
      .catch(() => {
        toast.error("Error al iniciar sesión");
      });
  };

     
  
  return (
    <div className="w-full  min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-100 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      
      <div className="w-full max-w-md">
        {/* Título con mejor diseño */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h2>
          <p className="text-gray-600">Inicia sesión en tu cuenta</p>
        </div>

        {/* Formulario con diseño moderno */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-amber-100">
          <form
            onSubmit={handleLoginSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...loginRegister("email")}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  inputMode="email"
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
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...loginRegister("password")}
                  placeholder="Tu contraseña"
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
              {loginErrors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {loginErrors.password.message}
                </p>
              )}
            </div>

            {/* Botón Login */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm font-medium">O</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Código de empresa */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Building className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-gray-800">Código de Empresa</h3>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...loginRegister("code")}
                  placeholder="Ingresa tu código de empresa"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white"
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
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Acceder con Código
            </button>
          </div>
        </div>
        
        {/* Footer del login */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            ¿Problemas para acceder?{" "}
            <a href="#" className="text-amber-600 hover:text-amber-700 font-semibold">
              Contacta soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
