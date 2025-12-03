import Header  from '../users/components/header';

import { Outlet } from 'react-router';
export default function UserDashboard() {
    return (
        <div >
            <Header />
            <main className="p-4">
                <Outlet />
            </main>
   
        </div>
    );
}