
import Header from "./components/header";
import toast from 'react-hot-toast';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { suspendCompanySchema, type SuspendCompanySchema } from './schemas/suspendCompanySchema';
import { Building2, Hash, Calendar, Shield, Pause, AlertTriangle } from 'lucide-react';
import api from '../../api/intercepttors';
export default function SuspendCompany() {
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');
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
            const response = await api.patch(`/admin/suspendCompany/${data.companyId}`, {
                until: new Date(data.until), // Convertir string a Date
            }, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
                 
            
            const result = await response.data;
          
            
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
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-red-50 to-orange-100 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      
      <div className="w-full max-w-md">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-600 to-orange-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Pause className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Suspender Empresa</h2>
          <p className="text-gray-600">Suspender temporalmente acceso de la empresa</p>
        </div>

        {/* Formulario moderno */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-red-100">
          <form onSubmit={handleSubmitSuspend(handleSubmit)} className="space-y-6">
            {/* ID de la empresa */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                ID de la Empresa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ID de la empresa a suspender"
                  {...registerSuspend("companyId")}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    suspendCompanyErrors.companyId
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                  }`}
                />
              </div>
              {suspendCompanyErrors.companyId && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {suspendCompanyErrors.companyId.message}
                </p>
              )}
            </div>

            {/* Fecha de suspensión */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                Suspender hasta
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  {...registerSuspend("until")}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    suspendCompanyErrors.until
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                  }`}
                />
              </div>
              {suspendCompanyErrors.until && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {suspendCompanyErrors.until.message}
                </p>
              )}
            </div>

            {/* Botón de suspensión */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-orange-700 text-white py-3 px-4 rounded-xl hover:from-red-700 hover:to-orange-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Pause className="w-5 h-5" />
              Suspender Empresa
            </button>
          </form>
          
          {/* Advertencia de seguridad */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-red-800 font-semibold text-sm">Acción Crítica:</h4>
                <p className="text-red-700 text-xs mt-1">
                  La empresa no podrá acceder al sistema hasta la fecha especificada. 
                  Esta acción afecta a todos los usuarios de la empresa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
