import Header from "../components/header";
import { useNavigate } from "react-router";
export default function Home() {
    const navigate = useNavigate();
    return (
        <div className="bg-white/80 w-full min-h-screen p-8">
            <Header />
            <div className="max-w-7xl mx-auto mt-20">
                <h2 className="text-3xl font-bold mb-8 text-center text-amber-800">Bienvenido a Lampistas</h2>
                
                {/* Contenedor principal con grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    
                    {/* Columna izquierda - Texto */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
                            <p className="text-lg text-gray-700 leading-relaxed">
                                ¿Eres un cliente que necesita asistencia con una reparación de fontanería o electricidad?
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Regístrese mediante el código proporcionado por la empresa o busque empresas disponibles en su área.
                            </p>
                        </div>
                    </div>

                    {/* Columna derecha - Botones */}
                    <div className="flex flex-col gap-4">
                        <button 
                            className="w-full bg-amber-500 text-white py-4 px-8 rounded-lg text-xl font-semibold hover:bg-amber-600 transition-colors shadow-lg"
                        >
                            Buscar Empresas
                        </button>
                        <button 
                            className="w-full bg-amber-500 text-white py-4 px-8 rounded-lg text-xl font-semibold hover:bg-amber-600 transition-colors shadow-lg" 
                            onClick={() => navigate('/user/userRegister')}
                        >
                            Registrarse
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}