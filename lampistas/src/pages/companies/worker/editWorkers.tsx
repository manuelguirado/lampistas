import Header from '../components/header';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {editSchema } from '../schemas/editSchema';
import type {EditSchema} from '../schemas/editSchema';

export default function EditWorkers() {
    const navigate = useNavigate();
  
    const {register, handleSubmit : handleEditWorker, formState: { errors } } = useForm<EditSchema>({
        resolver: zodResolver(editSchema),
        mode: 'onChange',
    });
    const token = localStorage.getItem('companyToken');
    function handleSubmit(data : EditSchema) {
       

        // Excluir workerID del body, solo enviarlo en la URL
        const { workerid, ...updateData } = data;
     
        // Filtrar campos vacíos - solo enviar los que tienen valor
        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value && value.length > 0)
        );
  

        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/editWorker/${workerid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            
            body: JSON.stringify({
                data: filteredData // Solo campos con valor
            }),
        })
            .then((response) => response.json())
            .then(() => {
                toast.success('Worker modified successfully!');
                navigate('/company/trabajadores/misTrabajadores');
            })
            .catch((error) => {
                toast.error('Error modifying worker: ' + error.message);
            });
    }
    return (
        <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
            <Header />
            <h2 className="text-2xl font-bold p-20">Edit Worker Page</h2>
            <form action="" method="post" onSubmit={handleEditWorker(handleSubmit)} className='flex flex-col space-y-4'>
                <input
                    type="number"
                    placeholder="Worker ID"
                    {...register('workerid')}
                    className="border p-2 mb-4"
                />
                {errors.workerid && <p className="text-red-500">{errors.workerid.message}</p>}
                <input
                    type='text'
                    placeholder='Name'
                    {...register('name')}
                    
                    className='border p-2 mb-4'
                />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                <input
                    type='email'
                    placeholder='Email'
                    {...register('email')}
                    className='border p-2 mb-4'
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                <input
                    type='password'
                    placeholder='Password'
                    {...register('password')}
                    className='border p-2 mb-4'
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                <button type="submit" className="bg-amber-300 text-white p-2 rounded">Edit Worker</button>
            </form>
        </div>
    );
} 