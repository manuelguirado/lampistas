import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
export default function UserRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
       
        try {
            const response = await fetch('http://localhost:3000/user/userRegister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log('Response data:', data);
            if (data ) {
                alert('User registered successfully!');
                setFormData({ name: '', email: '', password: '' });
                navigate('/user/userLogin');
            } else {
                alert('Error registering user.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error registering user.');
        }
    }

    return (
        <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
            <Header />
            <h2 className="text-2xl font-bold p-20">User Registration</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border p-2"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border p-2"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border p-2"
                    required
                />  
                <button type="submit" className="bg-amber-500 text-white px-4 py-2 rounded">Register User</button>
            </form>
        </div>
    );
}