import AdminRoutes from './adminRoutes';
import CompanyRoutes from './companyRoutes';
import WorkerRoutes from './workerRoutes';
import UserRoutes from './userRoutes';
import {Routes,Route} from 'react-router-dom';
import PaymentRoutes from './paymentRoutes';
import Home from '../pages/home';
import App from '../App';

export default function AppRouter(){
    return (
        <Routes>
            <Route element={<App />}>
                <Route index element={<Home />} />
                <Route path="admin/*" element={<AdminRoutes />} />
                <Route path="company/*" element={<CompanyRoutes />} />
                <Route path="worker/*" element={<WorkerRoutes />} />
                <Route path="user/*" element={<UserRoutes />} />
                <Route path="payment/*" element={<PaymentRoutes />} />
            </Route>
        </Routes>
    );
}