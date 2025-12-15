import Header from '../admin/components/header';
import {useState} from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
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
         <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
                <Header />
              <h2 className="text-2xl font-bold mb-6">Editar Empresa</h2>
              
               <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        ID de Empresa
                    </label>
                    <input
                        type="text"
                        placeholder="ID de la empresa"
                        value={formData.companyID}
                        onChange={(e) => setFormData({ ...formData, companyID: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Nombre
                    </label>
                    <input
                        type='text'
                        placeholder='Nombre de la empresa'
                        value={formData.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Teléfono
                    </label>
                    <input
                        type='text'
                        placeholder='Teléfono'
                        value={formData.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        type='email'
                        placeholder='Email'
                        value={formData.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
                >
                    Actualizar Empresa
                </button>
              </form>
            </div>
          );

}