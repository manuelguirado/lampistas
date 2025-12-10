import { Link } from "react-router-dom";

export default function MachineryIndex() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-20 md:pt-24 px-4 pb-8">
      <h2 className="text-2xl font-bold mb-6">Gestión de Maquinaria</h2>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="crearMaquinaria"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-amber-600 mb-2">
            Crear Maquinaria
          </h3>
          <p className="text-gray-600">
            Registra nueva maquinaria en el sistema
          </p>
        </Link>

        <Link
          to="listarMaquinaria"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-amber-600 mb-2">
            Listar Maquinaria
          </h3>
          <p className="text-gray-600">
            Ver toda la maquinaria registrada
          </p>
        </Link>
        <Link to="actualizarMantenimiento"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-amber-600 mb-2">
            Actualizar Mantenimiento
          </h3>
          <p className="text-gray-600">
            Registrar una nueva fecha de mantenimiento para la maquinaria
          </p>
        </Link>

      

       
      </div>
    </div>
  );
}
