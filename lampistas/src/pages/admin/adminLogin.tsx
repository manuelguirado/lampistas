import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import toast from "react-hot-toast";
export default function AdminLogin() {
  const navigate = useNavigate();
  
      const [formData, setFormData] = useState({ email: "", password: "" });
  
    
  
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      fetch("http://localhost:3000/admin/adminLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),

      })
        .then((response) => response.json())
        .then((data) => {
          // Guardar el token en localStorage
          if (data.token) {
            localStorage.setItem('adminToken', data.token);
             toast.success('Login successful!');
            navigate("/admin/adminDashboard");
          } else {
            toast.error('Login failed. Please check your credentials.');
            
          }
        })
        .catch((error) => {
          toast.error('Error during login: ' + (error as Error).message);
        });
    }
return (
    <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
      <Header />
      <h2 className="text-2xl font-bold p-20">Login de Administrador</h2>
      {/* Formulario de login */}
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
        <button
          className="bg-amber-300 text-white p-2 rounded hover:bg-amber-400 transition"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}