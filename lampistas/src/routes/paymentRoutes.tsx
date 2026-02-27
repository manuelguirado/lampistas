import {Routes,Route} from 'react-router-dom';
import   Payment from '../pages/payments/Payment';
import  SuccessPage from '../pages/payments/successPage';

export default function PaymentRoutes() {
    return (
        <Routes>
            <Route path="comenzarRegistro" element={<Payment />} />
            <Route path="success" element={<SuccessPage />} />
        </Routes>
    );
}