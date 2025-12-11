import {Toaster,toast} from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import Header from '../admin/components/header';
export default function RegisterCompany() {
    const navigate = useNavigate();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
              <Toaster
                    position='top-right'
                    toastOptions={{
                        success: {duration:3000},
                        error: {duration : 400}
                    }}
                    />
        
        // Obtener el adminID del token almacenado
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

        // Construir el objeto con la estructura que espera el backend
        const data = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            admin: adminID,
            directions: {
                address: formData.get('address') as string,
                city: formData.get('city') as string,
                state: formData.get('state') as string,
                zipCode: formData.get('zipCode') as string,
            }
        };

        fetch('http://localhost:3000/admin/registerCompany', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    toast.success('Company registered successfully!');

                    navigate('/admin/listCompany');
                } else {
                    toast.error('Error registering company.');
                }
            })
            .catch((error) => {
              
                toast.error('Error al registrar empresa.' + (error as Error).message);
            });
    }
    return (
        <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
        <Header />
        <h2 className="text-2xl font-bold p-20">Register Company</h2>
        {/* Formulario de registro de empresa */}
        <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
                className="mb-4 p-2 border border-amber-300 rounded"
                type="text"
                name="name"
                placeholder="Company Name"
                required
            />
            <input
                className="mb-4 p-2 border border-amber-300 rounded"
                type="email"
                name="email"
                placeholder="Company Email"
                required
            />
         
            <input
                className="mb-4 p-2 border border-amber-300 rounded"
                type="password"
                name="password"
                placeholder="Company Password"
                required
            />
                <input
                    className="mb-4 p-2 border border-amber-300 rounded"
                    type="tel"
                    name="phone"
                    placeholder="Company Phone"
                    required
                />
            <input
                className="mb-4 p-2 border border-amber-300 rounded"
                type="text"
                name="address"
                placeholder="Company Address"
                required
            />
            <input
                className="mb-4 p-2 border border-amber-300 rounded"
                type="text"
                name="city"
                placeholder="City"
                required
            />
            <input
                className="mb-4 p-2 border border-amber-300 rounded"
                type="text"
                name="state"
                placeholder="State"
                required
            />
            <input
                className="mb-4 p-2 border border-amber-300 rounded"
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                required
            />
            
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