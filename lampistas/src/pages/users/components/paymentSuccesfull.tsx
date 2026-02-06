import api from "../../../api/intercepttors"
import Header from "../components/header";
import { jwtDecode } from "jwt-decode";
interface DecodedToken {
  companyID: number;
  role: string;
  email: string;
  name?: string; // ✅ Agregar name opcional
}
export default function PaymentSuccesfull() {
    async function returntDashboard() {
        try {
           
       
            window.location.href =  "http://localhost:5173/user/userdashboard"; // Redirige al usuario a al dasboard 
        } catch (error) {
            console.error("Error fetching return URL:", error);
        }
    }
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-amber-100">
                    <Header />
                <h1 className="text-3xl font-bold text-amber-800 mb-4">¡Pago realizado con éxito!</h1>
                <button className="px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                    onClick={returntDashboard}
                >
                    Ir al dashboard 
                </button>
            </div>  
        )
    }
