import { useNavigate } from "react-router";
import Header from "../../components/header";
import { useState } from "react";
export default function WorkerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyCode: "",
  });
  function handleValidateCode(event: React.FormEvent) {
    event.preventDefault();
    fetch(`http://localhost:3000/worker/validateCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userType: "worker",
        code: formData.companyCode,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
      console.log(data);
        // Guardar el token en localStorage
        if (data.token) {
          localStorage.setItem("workerToken", data.token);

          navigate("/worker/workerDashboard");
        } else {
          console.error("No se recibió token en la respuesta");
        }
      })
      .catch((error) => {
        console.error("Error en login:", error);
      });
  }
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetch("http://localhost:3000/worker/workerLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("workerToken", data.token);
          navigate("/worker/workerDashboard");
        } else {
          alert("Login failed");
        }
      })
      .catch((err) => {
        console.error("Error during login:", err);
      });
  }
  return (
    <div className="w-full h-full   flex  flex-col items-center justify-center bg-white/80  p-16 rounded-xl border border-amber-100  hover:shadow-sm transition-shadow duration-300 ">
      <Header />
      <h2 className="text-2xl font-bold mb-6 text-center">Acceso Empresas</h2>
      <form className="w-full max-w-md" onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Ingrese su correo electrónico"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
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
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button
            type="submit"
            onClick={handleLogin}
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
            value={formData.companyCode}
            onChange={(e) =>
              setFormData({ ...formData, companyCode: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-2 mt-4 px-4 rounded-lg hover:bg-amber-600 transition-colors"
            onClick={handleValidateCode}
          >
            Ingresar con codigo
          </button>
        </div>
      </form>
    </div>
  );
}
