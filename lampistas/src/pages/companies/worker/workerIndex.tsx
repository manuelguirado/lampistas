import {Link } from "react-router-dom";

export default function WorkerIndex() {
  return (
    <div className="w-full min-h-screen bg-white/80 flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Bienvenido al Panel de Trabajadores</h1>
      <div className="flex flex-col gap-4">
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
            <h3 className="text-xl font-semibold text-amber-600 mb-2">Mis Trabajadores</h3>
            <p className="text-gray-600">
              Visualiza y administra los trabajadores de tu empresa
            </p>
          </Link>
        </div>
    </div>
  );
}