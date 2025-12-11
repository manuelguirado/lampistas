import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../components/header";

export default function RegisterUser() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contractType: '',
    });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const token = localStorage.getItem('companyToken');

        try {
            // PASO 1: Crear el usuario primero
            const userResponse = await fetch(`http://localhost:3000/company/companyCreateUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
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
                    contractType: formData.contractType,
                }),
            });

            const contractData = await contractResponse.json();

            if (contractData.token || contractData.id) {
                alert('User and contract created successfully!');
                setFormData({ name: '', email: '', password: '', contractType: '' });
                navigate('/company/mis-clientes');
            } else {
                alert('User created but error creating contract.');
            }

        } catch (error) {
            toast.error('Error durante el proceso de registro.' + (error as string));
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">Registrar Usuario</h2>
            <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border p-2 mb-4"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border p-2 mb-4"
                    required
                    inputMode="email"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border p-2 mb-4"
                    required
                />
                <select 
                    className="border p-2 mb-4"
                    value={formData.contractType}
                    onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                    required
                >
                    <option value="" disabled>Select Contract Type</option>
                    <option value="contract">Contract</option>
                    <option value="freeChoice">Free Choice</option>
                </select>

                <button type="submit" className="bg-amber-500 text-white px-4 py-2 rounded">
                    Register User
                </button>
            </form>
        </div>
    );
}