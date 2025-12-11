import { Link } from "react-router";
export default function ClientsIndex() {
    return (
      <div className="w-full min-h-screen flex flex-col items-center pt-20 md:pt-24 px-4 pb-8">
      <h2 className="text-2xl font-bold mb-6">Gestión de clientes</h2>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="registrarCliente"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-amber-600 mb-2">
            Crear Cliente
          </h3>
          <p className="text-gray-600">
            Registra un nuevo cliente en el sistema
          </p>
        </Link>

        <Link
          to="mis-Clientes"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-amber-600 mb-2">
            Listar Clientes
          </h3>
          <p className="text-gray-600">
            Ver tus clientes
          </p>
        </Link>
        

      

       
      </div>
    </div>
    );
}