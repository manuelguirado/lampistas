import {Routes,Route} from 'react-router-dom';
import RegisterAdmin from '../pages/admin/registerAdmin';

export default function AdminRoutes() {


    return (
        <Routes>
            <Route path="registerAdmin" element={<RegisterAdmin />} />

        </Routes>
    );
}