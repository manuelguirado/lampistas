import {  useState } from "react";
import Header from "../../components/header";
import {useNavigate} from 'react-router-dom';
export default function RegisterAdmin() {
  const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });

  

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    fetch("http://localhost:3000/admin/adminRegister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        // Puedes manejar la respuesta aquí si es necesario
        const email = formData.email;
        const password = formData.password;
        setFormData({ email: email, password: password });

        navigate("/admin/adminLogin");

      });
      
      
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">Registro de Administrador</h2>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            type="email"
            name="email"
            placeholder="Email"
            required
            inputMode="email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Contraseña
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <button
          className="w-full bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
          type="submit"
        >
          Registrar
        </button>
      </form>

    </div>
  );
}
