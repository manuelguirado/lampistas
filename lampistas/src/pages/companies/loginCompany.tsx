import toast from 'react-hot-toast';
import Header from '../../components/header';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {loginSchema } from './schemas/loginSchema';
import type {LoginSchema} from './schemas/loginSchema';

export default function LoginCompany() {

    // Formulario para email/password
    const {
        register: registerEmail,
        handleSubmit: handleSubmitEmailForm,
        formState: { errors: errorsEmail },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',   
    });

    // Formulario para código
    const {
        register: registerCode,
        handleSubmit: handleSubmitCodeForm,
        formState: { errors: errorsCode },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',   
    });
    function handleSubmitCompanyCode(data : LoginSchema) {
        
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/validateCode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "userType": "company",
                "code": data.code
            }),
        })
            .then((response) => response.json()
        )
            .then((data) => {
                // Guardar el token en localStorage
               
                if (data.token) {
                    toast.success('¡Código válido! Inicio de sesión exitoso.');
                    localStorage.setItem('companyToken', data.token);
                 
                    // Redirigir al dashboard de la empresa
                        window.location.href = "/company/dashboard";
                } else {
                    toast.error('No se recibió token en la respuesta');
                }
              
            
            })
            .catch((error) => {
                toast.error('Error en login: ' + (error as Error).message);
            });
    }
    function handleSubmitEmail(data : LoginSchema) {
        
        // Aquí puedes manejar el envío del formulario
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/companyLogin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                data
        )
        })
            .then((response) => response.json())
            .then((data) => {
               
                // Guardar el token en localStorage
                if (data.token) {
                    toast.success('¡Inicio de sesión exitoso!');
                    localStorage.setItem('companyToken', data.token);
                    // Redirigir al dashboard de la empresa
                    window.location.href = "/company/dashboard";
                } else {
                    toast.error('No se recibió token en la respuesta');
                }
            })
            .catch((error) => {
                toast.error('Error en login: ' + (error as Error).message);
            });
    }
    return (
        <div className="w-full h-full   flex  flex-col items-center justify-center bg-white/80  p-16 rounded-xl border border-amber-100  hover:shadow-sm transition-shadow duration-300 ">
            <Header />
                <h2 className="text-2xl font-bold mb-6 text-center">Acceso Empresas</h2>
                
                {/* Formulario Email/Password */}
                <form onSubmit={handleSubmitEmailForm(handleSubmitEmail)} className="w-full max-w-md">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Ingrese su correo electrónico"
                            {...registerEmail("email")}
                         
                        />
                        {errorsEmail.email && <p className="text-red-500 text-sm mt-1">{errorsEmail.email.message}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Ingrese su contraseña"
                            {...registerEmail("password")}
                       
                            />
                            {errorsEmail.password && <p className="text-red-500 text-sm mt-1">{errorsEmail.password.message}</p>}
                         <button
                        type="submit"
                        className="w-full bg-amber-500 text-white py-2 px-4 mt-4 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        Iniciar Sesión con Email
                    </button>
                    </div>
                </form>

                {/* Formulario Código */}
                <form onSubmit={handleSubmitCodeForm(handleSubmitCompanyCode)} className="w-full max-w-md">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">o Ingrese su código de empresa</h2>
                        <input
                            type="text"
                            id="companyCode"
                            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Ingrese su código de empresa"
                            {...registerCode("code")}
    
                        />
                        {errorsCode.code && <p className="text-red-500 text-sm mt-1">{errorsCode.code.message}</p>}
                        <button type="submit" className='w-full bg-amber-500 text-white py-2 mt-4 px-4 rounded-lg hover:bg-amber-600 transition-colors'>Ingresar con codigo</button>
                     </div>   
                </form>
            </div>
    );
}   