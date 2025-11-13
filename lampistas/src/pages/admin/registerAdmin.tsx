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
    <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
      <Header />
      <h2 className="text-2xl font-bold p-20">Registro de Administrador</h2>
      {/* Formulario de registro */}
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input
        className="mb-4 p-2 border border-amber-300 rounded"
          type="email"
          name="email"
          placeholder="Email"
          required
          inputMode="email"
         
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          
        />
        <input
          className="mb-4 p-2 border border-amber-300 rounded"
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button className="bg-amber-500 text-white p-2 rounded" type="submit">Registrar</button>
      </form>

    </div>
  );
}
