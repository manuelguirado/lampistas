
import {useNavigate} from 'react-router-dom';
import Header from '../admin/components/header';
export default function RegisterCompany() {
    const navigate = useNavigate();
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        fetch('http://localhost:3000/admin/registerCompany', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data),
            
        })
            .then((response) => response.json())
            .then((data) => {
                // Puedes manejar la respuesta aquí si es necesario
                console.log(data);
                if (data.success) {
                    alert('Company registered successfully!');
                } else {
                    alert('Error registering company.');
                }
                navigate('/admin/adminDashboard');
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
                type="text"
                name="address"
                placeholder="Company Address"
                required
            />
            <input
                className="mb-4 p-2 border border-amber-300 rounded"
                type="tel"
                name="phone"
                placeholder="Company Phone"
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