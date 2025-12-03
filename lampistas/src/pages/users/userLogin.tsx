import { useState } from "react";
import { useNavigate } from "react-router";
import Header from "../../components/header";
export default function UserLogin() {
  const [Formdata, setFormdata] = useState({ email: "", password: "",code : "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormdata({ ...Formdata, [e.target.name]: e.target.value });
  };

  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`http://localhost:3000/user/validateCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userType": "user",
        code: Formdata.code,
      }),
    })
      .then((response) => response.json()
    )
      .then((data) => {
        // Guardar el token en localStorage
        
        if (data.token) {
          localStorage.setItem('userToken', data.token);
       
          // Redirigir al dashboard del usuario
             navigate("/user/userDashboard");
        } else {
          console.error('No se recibió token en la respuesta');
        }
      
      
      })
      .catch((error) => {
        console.error('Error en login:', error);
      });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:3000/user/userLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: Formdata.email,
        password: Formdata.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
    
        if (data.token) {
          // Guardar el token en localStorage
          localStorage.setItem("userToken", data.token);

          navigate("/user/userDashboard");
        } else {
          console.error("No se recibió token en la respuesta");
        }
      });
  };
  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">Login de Usuario</h2>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg space-y-4"
      >
        {/* Input text/email */}

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
         
            inputMode="email"
            value={Formdata.email}
            onChange={handleChange}
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          
            value={Formdata.password}
            onChange={handleChange}
          />
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
                            value={Formdata.code}
                            onChange={(e) => setFormdata({ ...Formdata, code: e.target.value })}
    
                        />
                        <button  type="submit"  onClick={handleValidateCode} className='w-full bg-amber-500 text-white py-2 mt-4 px-4 rounded-lg hover:bg-amber-600 transition-colors'>Ingresar con codigo</button>
                     </div>   
                    
      </form>
    </div>
  );
}
