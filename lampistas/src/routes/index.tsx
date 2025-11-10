import AdminRoutes from './adminRoutes';
import CompanyRoutes from './companyRoutes';
import {Routes,Route} from 'react-router-dom';
import Home from '../pages/home';
import App from '../App';

export default function AppRouter(){
    return (
        <Routes>
            <Route element={<App />}>
                <Route index element={<Home />} />
                <Route path="admin/*" element={<AdminRoutes />} />
                <Route path="company/*" element={<CompanyRoutes />} />
            </Route>
        </Routes>
    );
}