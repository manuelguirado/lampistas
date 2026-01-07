import Header from '../companies/components/header';
import { Outlet } from 'react-router';

export default function DashboardCompany() {
    return (
        <div >
            <Header />
            <main className='p-4'>
            <h2 className='text-2xl font-bold p-20 text-amber-800'>Company Dashboard</h2>
            <Outlet />
            </main>
        

        </div>
    );
}
        