import Header from '../admin/components/header';
import {useState} from 'react';
export default function EditCompany() {
    
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
            console.error('Error decoding token:', error);
        }
    }
    
    // Construir el objeto data solo con campos que tienen valor
    const data: { name?: string; phone?: string; email?: string } = {};
    if (formData.name) data.name = formData.name;
    if (formData.phone) data.phone = formData.phone;
    if (formData.email) data.email = formData.email;
    
    fetch(`http://localhost:3000/admin/editCompany/${formData.companyID}`, {
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
        alert('Company modified successfully!');
      })
      .catch((error) => {
        console.error('Error modifying company:', error);
      });
  }
  return ( 
         <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
                <Header />
              <h2 className="text-2xl font-bold p-20">edit company Page</h2>
               <form action="" method="post" onSubmit={handleSubmit} className='flex flex-col space-y-4'>
                <input
                  type="text"
                  placeholder="Company ID"
                  value={formData.companyID}
                  onChange={(e) => setFormData({ ...formData, companyID: e.target.value })}
                  className="border p-2 mb-4"
                  required
                />
                <input
                   type='text'
                   placeholder='name'
                value={formData.name}
                className='border p-2 mb-4'
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                   type='text'
                   placeholder='phone'
                value={formData.phone}
                className='border p-2 mb-4'
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                   type='email'
                   placeholder='email'
                value={formData.email}
                className='border p-2 mb-4'
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <button type="submit" className="bg-amber-500 text-white px-4 py-2 rounded">
                  Edit Company
                </button>
              </form>
            </div>
          );

}