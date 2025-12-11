import Header from '../companies/components/header';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
export default function EditWorkers() {
    const navigate = useNavigate();
    const [FormData, setFormData] = useState({
        workerID: '',
        name: '',
        email: '',
        password: ''
    });
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = localStorage.getItem('companyToken');

        // Construir el objeto data solo con campos que tienen valor
        const data: { name?: string; email?: string; password?: string } = {};
        if (FormData.name) data.name = FormData.name;
        if (FormData.email) data.email = FormData.email;
        if (FormData.password) data.password = FormData.password;

        fetch(`http://localhost:3000/company/editWorker/${FormData.workerID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                data: data
            }),
        })
            .then((response) => response.json())
            .then(() => {
                toast.success('Worker modified successfully!');
                navigate('/company/misTrabajadores');
            })
            .catch((error) => {
                toast.error('Error modifying worker: ' + error.message);
            });
    }
    return (
        <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
            <Header />
            <h2 className="text-2xl font-bold p-20">Edit Worker Page</h2>
            <form action="" method="post" onSubmit={handleSubmit} className='flex flex-col space-y-4'>
                <input
                    type="text"
                    placeholder="Worker ID"
                    value={FormData.workerID}
                    onChange={(e) => setFormData({ ...FormData, workerID: e.target.value })}
                    className="border p-2 mb-4"
                    required
                />
                <input
                    type='text'
                    placeholder='Name'
                    value={FormData.name}
                    onChange={(e) => setFormData({ ...FormData, name: e.target.value })}
                    className='border p-2 mb-4'
                />
                <input
                    type='email'
                    placeholder='Email'
                    value={FormData.email}
                    onChange={(e) => setFormData({ ...FormData, email: e.target.value })}
                    className='border p-2 mb-4'
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={FormData.password}
                    onChange={(e) => setFormData({ ...FormData, password: e.target.value })}
                    className='border p-2 mb-4'
                />
                <button type="submit" className="bg-amber-300 text-white p-2 rounded">Edit Worker</button>
            </form>
        </div>
    );
} 