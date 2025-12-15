import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../components/header";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { registerUserSchema, type RegisterUserSchema } from "../schemas/registerUser";

export default function RegisterUser() {
    const navigate = useNavigate();
  
    const { register, handleSubmit:handleSubmitRegister, formState: { errors } } = useForm<RegisterUserSchema>({
        resolver: zodResolver(registerUserSchema),
        mode: "onChange",
    });

    async function handleSubmit(data : RegisterUserSchema) {
     
        const token = localStorage.getItem('companyToken');

        try {
            // PASO 1: Crear el usuario primero
            const userResponse = await fetch(`http://localhost:3000/company/companyCreateUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const userData = await userResponse.json();

            if (!userData.userID) {
                toast.error('Error al registrar usuario.');
                return;
            }

            // PASO 2: Crear el contrato con el userID obtenido
            const contractResponse = await fetch(`http://localhost:3000/company/createContract`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userID: userData.userID, // ✅ Ahora sí tenemos el userID
                    contractType: data.contractType,
                }),
            });

            const contractData = await contractResponse.json();

            if (contractData.token || contractData.id) {
                toast.success('¡Usuario y contrato creados exitosamente!');
                navigate('/company/clientes/mis-clientes');
            } else {
                toast.error('Usuario creado pero error al crear el contrato.');
            }

        } catch (error) {
            toast.error('Error durante el proceso de registro.' + (error as string));
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">Registrar Usuario</h2>
            <form onSubmit={handleSubmitRegister(handleSubmit)} className='flex flex-col space-y-4'>
                <div className="mb-4">
                <input
                    type="text"
                  
                    placeholder="Name"
                    {...register("name")}
                    className="border p-2 mb-4"
                    required
                    
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div className="mb-6">
                <input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className="border p-2 mb-4"
                    required
                    inputMode="email"
                    
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
                <input
                    type="password"
                  
                    placeholder="Password"
                    {...register("password")}
                 
                    className="border p-2 mb-4"
                    required
                />  
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="mb-4">        
                <select 
                    className="border p-2 mb-4"
                    {...register("contractType")}
                  
                    required
                >
                    <option value="" disabled>Select Contract Type</option>
                    <option value="contract">Contract</option>
                    <option value="freeChoice">Free Choice</option>
                </select>
                {errors.contractType && <p className="text-red-500 text-sm mt-1">{errors.contractType.message}</p>}
            </div>

                <button type="submit" className="bg-amber-500 text-white px-4 py-2 rounded">
                    Register User
                </button>
            </form>
        </div>
    );
}