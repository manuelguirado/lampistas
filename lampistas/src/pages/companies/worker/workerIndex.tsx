import {Link } from "react-router-dom";

export default function WorkerIndex() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-20 md:pt-24 px-4 pb-8">
      <h2 className="text-2xl font-bold mb-6">Gestión de Trabajadores</h2>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="registrarTrabajador"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-amber-600 mb-2">
            Registrar Trabajador
          </h3>
          <p className="text-gray-600">
            Agrega un nuevo trabajador al sistema
          </p>
        </Link>

        <Link
          to="misTrabajadores"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-amber-600 mb-2">
            Mis Trabajadores
          </h3>
          <p className="text-gray-600">
            Visualiza y administra los trabajadores de tu empresa
          </p>
        </Link>
      </div>
    </div>
  );
}