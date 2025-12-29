import Header from '../admin/components/header';
import {useState} from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { Building2, Hash, Phone, Mail, Edit, Shield } from 'lucide-react';
export default function EditCompany() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ companyID: "" , name:"", phone:"", email:""});
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Obtener el adminID del token
    const token = localStorage.getItem('adminToken');
    let adminID = null;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            adminID = payload.adminID;
        } catch (error) {
            toast.error('Error decoding token: ' + (error as Error).message);
        }
    }
    
    // Construir el objeto data solo con campos que tienen valor
    const data: { name?: string; phone?: string; email?: string } = {};
    if (formData.name) data.name = formData.name;
    if (formData.phone) data.phone = formData.phone;
    if (formData.email) data.email = formData.email;
    
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/admin/editCompany/${formData.companyID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        adminID: adminID,
        data: data
      }),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success('Company updated successfully!');
        navigate('/admin/listCompany');
      })
      .catch((error) => {
        
        toast.error('Error updating company.' + error.message);
      });
  }
  return ( 
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-indigo-100 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      
      <div className="w-full max-w-md">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Edit className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Editar Empresa</h2>
          <p className="text-gray-600">Actualizar información de la empresa</p>
        </div>

        {/* Formulario moderno */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-purple-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ID de la empresa */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                ID de Empresa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ID de la empresa a editar"
                  value={formData.companyID}
                  onChange={(e) => setFormData({ ...formData, companyID: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Nombre de la empresa */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                Nombre de la Empresa
                <span className="text-xs text-gray-500 ml-2">(Opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Nuevo nombre (dejar vacío si no desea cambiarlo)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                Teléfono
                <span className="text-xs text-gray-500 ml-2">(Opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder="Nuevo teléfono (dejar vacío si no desea cambiarlo)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                Correo Electrónico
                <span className="text-xs text-gray-500 ml-2">(Opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Nuevo email (dejar vacío si no desea cambiarlo)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Botón de actualización */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Actualizar Empresa
            </button>
          </form>
          
          {/* Información adicional */}
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-purple-800 font-semibold text-sm">Importante:</h4>
                <p className="text-purple-700 text-xs mt-1">
                  Solo se actualizarán los campos que contengan un valor nuevo. 
                  Los campos vacíos mantendrán su valor actual en la base de datos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}