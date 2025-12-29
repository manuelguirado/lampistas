import { Navigate, useNavigate } from "react-router";
import Header from "../components/header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "../schemas/workerSchema";
import toast from "react-hot-toast";
import { useState } from "react";
import { HardHat, User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
export default function RegisterWorker() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const {
    register,
    handleSubmit: handleSubmitRegister,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });
  function handleSubmit(data: RegisterSchema) {
    const token = localStorage.getItem("companyToken");

    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/RegisterWorker`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token && data.workerid) {
          toast.success("¡Trabajador registrado exitosamente!");

          navigate("/company/trabajadores/misTrabajadores");
        } else {
          toast.error(
            "Error registering worker: " +
              (data.message || "No se pudo registrar")
          );
        }
      })
      .catch((error) => {
        alert("Error registering worker: " + error.message);
      });
  }
  const token = localStorage.getItem("companyToken");
  if (!token) {
    return <Navigate to="/company/companyLogin" replace />;
  }
  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-100 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      
      <div className="w-full max-w-md">
        {/* Título con diseño */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <HardHat className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Nuevo Trabajador</h2>
          <p className="text-gray-600">Agregar miembro al equipo</p>
        </div>

        {/* Formulario moderno */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-green-100">
          <form
            onSubmit={handleSubmitRegister(handleSubmit)}
            className="space-y-6"
          >
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
                  placeholder="Nombre del trabajador"
                  {...register("name")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
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
                  placeholder="trabajador@email.com"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
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
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
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
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                El trabajador podrá cambiar esta contraseña después del primer acceso
              </p>
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Registrar Trabajador
            </button>
          </form>
          
          {/* Información adicional */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-start gap-2">
              <HardHat className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-green-800 font-semibold text-sm">Información importante:</h4>
                <p className="text-green-700 text-xs mt-1">
                  Se generará automáticamente un código de trabajador que será 
                  enviado al email del nuevo empleado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
