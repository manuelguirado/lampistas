import {toast} from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {registerCompanySchema, type RegisterCompanySchema } from './schemas/registerCompanySchema';
import Header from '../admin/components/header';
export default function RegisterCompany() {
    const navigate = useNavigate();
  const {
            register : registerForm, // renombrado para evitar conflicto con función handleRegister
            handleSubmit : handleSubmitregister,
            formState: { errors : registerErrors },
        } = useForm<RegisterCompanySchema>({
            resolver: zodResolver(registerCompanySchema),
            mode: "onChange", // ✅ Valida mientras escribes
        });
        
    
    

        const token = localStorage.getItem('adminToken');
   async function handleSubmit(data : RegisterCompanySchema) {
        // Obtener el adminID del token almacenado
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/admin/registerCompany`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
             
            const result = await response.json();
        
            
            if (result.token){
                toast.success('¡Empresa registrada exitosamente!');
                navigate('/admin/adminDashboard');
            } else {
                const errorMsg = result.message || 'Error al registrar empresa';
              
                toast.error(errorMsg);
            }
        } catch (error) {
         
            toast.error('Error de conexión con el servidor' + (error as Error).message);
        }
    }
    return (
        <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
        <Header />
        <h2 className="text-2xl font-bold p-20">Register Company</h2>
        {/* Formulario de registro de empresa */}
        <form className="flex flex-col w-full max-w-md space-y-4" onSubmit={handleSubmitregister(handleSubmit)}>
            <div>
                <input
                    className={`w-full p-2 border rounded ${
                        registerErrors.name ? 'border-red-500' : 'border-amber-300'
                    }`}
                    type="text"
                    placeholder="Company Name"
                    {...registerForm("name")}
                />
                {registerErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.name.message}</p>
                )}
            </div>

            <div>
                <input
                    className={`w-full p-2 border rounded ${
                        registerErrors.email ? 'border-red-500' : 'border-amber-300'
                    }`}
                    type="email"
                    inputMode='email'
                    placeholder="Company Email"
                    {...registerForm("email")}
                />
                {registerErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.email.message}</p>
                )}
            </div>
         
            <div>
                <input
                    className={`w-full p-2 border rounded ${
                        registerErrors.password ? 'border-red-500' : 'border-amber-300'
                    }`}
                    type="password"
                    {...registerForm("password")}
                    placeholder="Company Password"
                />
                {registerErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.password.message}</p>
                )}
            </div>

            <div>
                <input
                    className={`w-full p-2 border rounded ${
                        registerErrors.phone ? 'border-red-500' : 'border-amber-300'
                    }`}
                    type="tel"
                    inputMode='tel'
                    {...registerForm("phone")}
                    placeholder="Company Phone"
                />
                {registerErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.phone.message}</p>
                )}
            </div>

            <div>
                <input
                    className={`w-full p-2 border rounded ${
                        registerErrors.directions?.address ? 'border-red-500' : 'border-amber-300'
                    }`}
                    type="text"
                    {...registerForm("directions.address")}
                    placeholder="Company Address"
                />
                {registerErrors.directions?.address && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.directions.address.message}</p>
                )}
            </div>

            <div>
                <input
                    className={`w-full p-2 border rounded ${
                        registerErrors.directions?.city ? 'border-red-500' : 'border-amber-300'
                    }`}
                    type="text"
                    {...registerForm("directions.city")}
                    placeholder="City"
                />
                {registerErrors.directions?.city && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.directions.city.message}</p>
                )}
            </div>

            <div>
                <input
                    className={`w-full p-2 border rounded ${
                        registerErrors.directions?.state ? 'border-red-500' : 'border-amber-300'
                    }`}
                    type="text"
                    {...registerForm("directions.state")}
                    placeholder="State"
                />
                {registerErrors.directions?.state && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.directions.state.message}</p>
                )}
            </div>

            <div>
                <input
                    className={`w-full p-2 border rounded ${
                        registerErrors.directions?.zipCode ? 'border-red-500' : 'border-amber-300'
                    }`}
                    type="text"
                    {...registerForm("directions.zipCode")}
                    placeholder="Zip Code"
                />
                {registerErrors.directions?.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.directions.zipCode.message}</p>
                )}
            </div>
            
            <button
                type="submit"
                className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors"
            >
                Register Company
            </button>
        </form>
        </div>
    
    );
}