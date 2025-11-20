import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header";

export default function RegisterUser() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
        
    });
    function handleContractTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
          const token = localStorage.getItem('companyToken');
          fetch(`http://localhost:3000/company/createContract`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ contractType: event.target.value } ),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
               
                if (data.token ) {
                    alert('Contract created successfully!');

                    
                } else {
                    alert('Error creating contract.');
                }
            })
    }
 

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const token = localStorage.getItem('companyToken');
     fetch(`http://localhost:3000/company/companyCreateUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
               
                if (data.token ) {
                    alert('User registered successfully!');

                    setFormData({ name: '', email: '', password: '' });
                    navigate('/company/mis-clientes');
                } else {
                    alert('Error registering user.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error registering user.');
            });
        }

        return (
            <div className="w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
                <Header />
                <h2 className="text-2xl font-bold p-20">Register User Page</h2>
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
                    onSubmit={handleContractTypeChange}
                    >
                        <option value="" disabled selected>Select Contract Type</option>
                        <option value="contract">Contract</option>
                        <option value="freechoice">Free Choice</option>
                    </select>

                    <button type="submit" className="bg-amber-500 text-white px-4 py-2 rounded">
                        Register User
                    </button>
                </form>
            </div>
        );
    
}