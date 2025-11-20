import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import Header from '../companies/components/header';
export default  function RegisterWorker() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });
    const navigate = useNavigate();
 
   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const token = localStorage.getItem('companyToken');
        console.log('Submitting worker registration with data:', formData);
        fetch('http://localhost:3000/company/RegisterWorker', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token && data.workerid) {
                    alert('Worker registered successfully!');
        
                    setFormData({ name: '', email: '', password: '' });
                    navigate('/company/misTrabajadores');
                } else {
                    alert('Error registering worker.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error registering worker.');
            });
    }
    const token = localStorage.getItem('companyToken');
    if (!token) {
        return <Navigate to="/company/companyLogin" replace />;
    }
    return (
        <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
            <Header />
            <h2 className="text-2xl font-bold p-20">Register Worker Page</h2>
            <form action="" method="post" onSubmit={handleSubmit} className='flex flex-col space-y-4'>
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
                <button type="submit" className="bg-amber-500 text-white px-4 py-2 rounded">
                    Register Worker
                </button>
            </form>
        </div>
    );
}