import { Link } from "react-router-dom";

export default function MachineryIndex() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-20 md:pt-24 px-4 pb-8">
      <h2 className="text-2xl font-bold mb-6">Gestión de Incidencias</h2>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="createIncident"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-amber-600 mb-2">
             Crear una nueva Incidencia
          </h3>
          <p className="text-gray-600">
            Reporta una nueva incidencia relacionada con tu maquinaria
          </p>
        </Link>

        

        <Link
          to="incidentHistory"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-amber-600 mb-2">
            visualiza el Historial de Incidencias
          </h3>
          <p className="text-gray-600">
            Ver todo el historial de incidencias registradas
          </p>
        </Link>
        

      

       
      </div>
    </div>
  );
}
