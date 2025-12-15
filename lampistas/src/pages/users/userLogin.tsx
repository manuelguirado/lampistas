import { useNavigate } from "react-router";
import Header from "../../components/header";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userloginSchema,
  type UserLoginSchema,
} from "./schemas/userLoginSchema";
export default function UserLogin() {
  const navigate = useNavigate();
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<UserLoginSchema>({
    resolver: zodResolver(userloginSchema),
    mode: "onChange",
  });

  const handleValidateCode = (data: UserLoginSchema) => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/user/validateCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userType: "user",
        code: data.code,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Guardar el token en localStorage

        if (data.token) {
          toast.success("✅ Código válido! Inicio de sesión exitoso.");
          localStorage.setItem("userToken", data.token);

          // Redirigir al dashboard del usuario
          navigate("/user/userDashboard");
        } else {
          toast.error("No se recibió token en la respuesta");
        }
      })
      .catch((error) => {
        toast.error("Error en login: " + (error as Error).message);
      });
  };
  const handleSubmit = async (data: UserLoginSchema) => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/user/userLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          toast.success("¡Inicio de sesión exitoso!");
          // Guardar el token en localStorage
          localStorage.setItem("userToken", data.token);

          navigate("/user/userDashboard");
        } else {
          toast.error("No se recibió token en la respuesta");
        }
      });
  };
  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">Login de Usuario</h2>

      <form
        onSubmit={handleLoginSubmit(handleSubmit)}
        className="w-full max-w-md bg-white p-6 rounded-lg space-y-4"
      >
        {/* Input text/email */}

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            {...loginRegister("email")}
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            inputMode="email"
          />
          {loginErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {loginErrors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            {...loginRegister("password")}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {loginErrors.password && (
            <p className="text-red-500 text-sm mt-1">
              {loginErrors.password.message}
            </p>
          )}
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          className="w-full bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
        >
          Login
        </button>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">o Ingrese su código de empresa</h2>
          <input
            type="text"
            id="companyCode"
            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Ingrese su código de empresa"
            {...loginRegister("code")}
          />
          {loginErrors.code && (
            <p className="text-red-500 text-sm mt-1">
              {loginErrors.code.message}
            </p>
          )}
          <button
            type="submit"
            onClick={handleLoginSubmit(handleValidateCode)}
            className="w-full bg-amber-500 text-white py-2 mt-4 px-4 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Ingresar con codigo
          </button>
        </div>
      </form>
    </div>
  );
}
