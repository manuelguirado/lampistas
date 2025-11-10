//import {  useState } from "react";
import Footer from "../../components/footer";
export default function RegisterAdmin() {
/*
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
      .then((data) => {
        // Puedes manejar la respuesta aquí
        setFormData({ email: "", password: "" });
        console.log(data);
      });
  }
*/
  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-amber-100 justify-center items-center p-4">
      <h2 className="text-2xl font-bold p-20">Registro de Administrador</h2>
      {/* Formulario de registro */}
      <form className="flex flex-col">
        <input
        className="mb-4 p-2 border border-amber-300 rounded"
          type="email"
          name="email"
          placeholder="Email"
          required
          inputMode="email"
        />
        <input
          className="mb-4 p-2 border border-amber-300 rounded"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button className="bg-amber-500 text-white p-2 rounded" type="submit">Registrar</button>
      </form>
      <Footer />
    </div>
  );
}
