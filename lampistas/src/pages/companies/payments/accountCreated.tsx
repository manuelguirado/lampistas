import api from "../../../api/intercepttors"
import Header from "../components/header";
import { jwtDecode } from "jwt-decode";
interface DecodedToken {
  companyID: number;
  role: string;
  email: string;
  name?: string; // ✅ Agregar name opcional
}
export default function AccountCreated() {
    async function returntDashboard() {
        try {
            const token = localStorage.getItem("companyToken");
            const decoded = jwtDecode<DecodedToken>(token as string);
            const response = await api.post("/payments/create-login-link", { email: decoded.email });
            console.log('Received create-login-link response:', response.data);
            const { loginLink } = response.data;
            window.location.href = loginLink; // Redirige al usuario a la URL de Stripe
        } catch (error) {
            console.error("Error fetching return URL:", error);
        }
    }
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-amber-100">
                    <Header />
                <h1 className="text-3xl font-bold text-amber-800 mb-4">Cuenta creada con éxito</h1>
                <button className="px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                    onClick={returntDashboard}
                >
                    Ir al dashboard 
                </button>
            </div>  
        )
    }
