
import Header from "./components/header";
import toast from 'react-hot-toast';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { suspendCompanySchema, type SuspendCompanySchema } from './schemas/suspendCompanySchema';

export default function SuspendCompany() {
    const navigate = useNavigate();
    
    const {
        register: registerSuspend,
        handleSubmit: handleSubmitSuspend,
        formState: { errors: suspendCompanyErrors },
    } = useForm<SuspendCompanySchema>({
        resolver: zodResolver(suspendCompanySchema),
        mode: "onChange",
    });

    async function handleSubmit(data: SuspendCompanySchema) {
        try {
            const response = await fetch(`http://localhost:3000/admin/suspendCompany/${data.companyId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                },
                body: JSON.stringify({
                    until: new Date(data.until), // Convertir string a Date
                }),
            });
            
            const result = await response.json();
          
            
            if (result.company || result.success !== false) {
                toast.success('¡Empresa suspendida exitosamente!');
                navigate('/admin/listCompany');
            } else {
                toast.error(result.message || 'Error al suspender empresa');
            }
        } catch (error) {
            console.error('💥 Error:', error);
            toast.error('Error de conexión con el servidor');
        }
    }
  return (
    <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
        <Header />
      <h2 className="text-2xl font-bold p-20">Suspender Empresa</h2>
       <form onSubmit={handleSubmitSuspend(handleSubmit)} className="flex flex-col space-y-4 w-full max-w-md">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            ID de la Empresa
          </label>
          <input
            type="text"
            placeholder="ID de la empresa"
            {...registerSuspend("companyId")}
            className={`w-full border p-2 rounded ${
              suspendCompanyErrors.companyId ? 'border-red-500' : 'border-amber-300'
            }`}
          />
          {suspendCompanyErrors.companyId && (
            <p className="text-red-500 text-sm mt-1">{suspendCompanyErrors.companyId.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Suspender hasta
          </label>
          <input
            type="date"
            placeholder="Fecha de fin"
            {...registerSuspend("until")}
            className={`w-full border p-2 rounded ${
              suspendCompanyErrors.until ? 'border-red-500' : 'border-amber-300'
            }`}
          />
          {suspendCompanyErrors.until && (
            <p className="text-red-500 text-sm mt-1">{suspendCompanyErrors.until.message}</p>
          )}
        </div>
        
        <button type="submit" className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors">
          Suspender Empresa
        </button>
      </form>
    </div>
  );
}
