import { useNavigate } from "react-router";
import Header from "../../components/header";
import { useState } from "react";
import toast from "react-hot-toast";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {workerLoginSchema, type WorkerLoginSchema} from '../worker/schemas/workerLogin';
export default function WorkerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyCode: "",
  });
    const {
        register : loginRegister,
        handleSubmit : handleLoginSubmit,
        formState: { errors : loginErrors },
    } = useForm<WorkerLoginSchema>({
        resolver: zodResolver(workerLoginSchema),
        mode: "onChange",
    });
  function handleValidateCode(data : WorkerLoginSchema) {

    fetch(`http://localhost:3000/worker/validateCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userType: "worker",
        code: data.code,
      }),
    })
      .then((response) => response.json())
      .then((data) => {

        // Guardar el token en localStorage
        if (data.token) {
          localStorage.setItem("workerToken", data.token);

          navigate("/worker/workerDashboard");
        } else {
          toast.error('Código inválido. Por favor, inténtelo de nuevo.');
        }
      })
      .catch((error) => {
        toast.error('Error en login: ' + error.message);
      });
  }
  function handleLogin(data : WorkerLoginSchema) {
 
    fetch("http://localhost:3000/worker/workerLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          toast.success('¡Inicio de sesión exitoso!');
          localStorage.setItem("workerToken", data.token);
          navigate("/worker/workerDashboard");
        } else {
          toast.error('Credenciales incorrectas');
        }
      })
      .catch((err) => {
        toast.error('Error during login: ' + err.message);
      });
  }
  return (
    <div className="w-full h-full   flex  flex-col items-center justify-center bg-white/80  p-16 rounded-xl border border-amber-100  hover:shadow-sm transition-shadow duration-300 ">
      <Header />
      <h2 className="text-2xl font-bold mb-6 text-center">Acceso Empresas</h2>
      <form className="w-full max-w-md" onSubmit={handleLoginSubmit(handleLogin)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Ingrese su correo electrónico"
           {...loginRegister("email")}
            required
          />
          {loginErrors.email && (
            <p className="text-red-500 text-sm mt-1">{loginErrors.email.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Ingrese su contraseña"
           {...loginRegister("password")}
            required
          />
          {loginErrors.password && (
            <p className="text-red-500 text-sm mt-1">{loginErrors.password.message}</p>
          )}
        </div>
        <div className="mb-6">
          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-2 px-4 mt-4 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Iniciar Sesión con Email
          </button>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">o Ingrese su código de trabajador</h2>
          <input
            type="text"
            id="companyCode"
            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Ingrese su código de empresa"
           {...loginRegister("code")}
          />
          {loginErrors.code && (
            <p className="text-red-500 text-sm mt-1">{loginErrors.code.message}</p>
          )}
          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-2 mt-4 px-4 rounded-lg hover:bg-amber-600 transition-colors"
            onClick={handleLoginSubmit(handleValidateCode)}
          >
            Ingresar con codigo
          </button>
        </div>
      </form>
    </div>
  );
}
