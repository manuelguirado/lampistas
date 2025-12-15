import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./schemas/registerSchema";
import type { RegisterSchema } from "./schemas/registerSchema";

import toast from "react-hot-toast";

export default function AdminAuth() {
  const navigate = useNavigate();

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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/admin/adminRegister`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data), // ✅ data ya está validada por Zod
        }
      );

      const result = await response.json();

      if (result.token) {
        localStorage.setItem("adminToken", result.token);
        toast.success("¡Administrador registrado exitosamente!");
        navigate("/admin/adminDashboard");
      } else {
        // ✅ Mostrar el mensaje específico del backend
        const errorMsg = result.message || "Error al registrar administrador";
  
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("💥 Error de conexión:", error); // ✅ Debug
      toast.error("Error de conexión con el servidor");
    }
  };

  // ✅ FUNCIÓN DE LOGIN - Recibe data validada por Zod
  const onLoginSubmit = async (data: RegisterSchema) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/admin/adminLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // ✅ data ya está validada por Zod
      });

      const result = await response.json();

      if (result.token) {
        localStorage.setItem("adminToken", result.token);
        toast.success("¡Login exitoso!");
        navigate("/admin/adminDashboard");
      } else {
        // ✅ Mostrar el mensaje específico del backend
        toast.error(result.message || "Credenciales incorrectas");
      }
    } catch (error) {
      toast.error(
        "Error de conexión con el servidor" + (error as Error).message
      );
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h1 className="text-3xl font-bold mb-8 text-amber-800">
        Administradores
      </h1>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Registro de Administrador */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
          {/* ✅ handleRegisterSubmit conecta Zod con onRegisterSubmit */}
          <form
            onSubmit={handleRegisterSubmit(onRegisterSubmit)}
            className="flex flex-col space-y-4"
          >
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              {/* ✅ register del hook form conecta el input con Zod */}
              <input
                type="email"
                placeholder="admin@example.com"
                {...registerForm("email")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  registerErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {/* ✅ Mostrar error de validación de Zod */}
              {registerErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {registerErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                {...registerForm("password")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  registerErrors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {/* ✅ Mostrar error de validación de Zod */}
              {registerErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {registerErrors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
            >
              Registrar Administrador
            </button>
          </form>
        </div>

        {/* Login de Administrador */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Iniciar Sesión
          </h2>
          {/* ✅ handleLoginSubmit conecta Zod con onLoginSubmit */}
          <form
            onSubmit={handleLoginSubmit(onLoginSubmit)}
            className="flex flex-col space-y-4"
          >
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                {...loginForm("email")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  loginErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {loginErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {loginErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Tu contraseña"
                {...loginForm("password")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  loginErrors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {loginErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {loginErrors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
