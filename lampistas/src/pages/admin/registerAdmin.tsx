import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { toast } from "react-hot-toast";

export default function AdminAuth() {
  const navigate = useNavigate();
  
  const [registerData, setRegisterData] = useState({ email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    fetch("http://localhost:3000/admin/adminRegister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("adminToken", data.token);
         toast.success('Admin registered successfully!');
          navigate("/admin/adminDashboard");
        } else {
          toast.error('Error registering admin.');
        }
      })
      .catch((error) => {
       
        toast.error('Error registering admin.' + (error as Error).message);
      });
  }

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    fetch("http://localhost:3000/admin/adminLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("adminToken", data.token);
          toast.success('Login successful!');
          navigate("/admin/adminDashboard");
        } else {
          
          toast.error('Credenciales incorrectas');
        }
      })
      .catch((error) => {
    
        toast.error('Error al iniciar sesión' + error.message);
      });
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h1 className="text-3xl font-bold mb-8 text-amber-800">Administradores</h1>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Registro de Administrador */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
          <form onSubmit={handleRegister} className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                inputMode="email"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Contraseña segura"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
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
          <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                inputMode="email"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Tu contraseña"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
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
