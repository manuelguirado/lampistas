import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MachineryIndex() {
  const { t } = useTranslation("companies.incidentIndex");
  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-20 md:pt-24 px-4 pb-8">
      <h2 className="text-2xl font-bold mb-6">{t("titulo")}</h2>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="Mis-incidencias"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-amber-600 mb-2">
             {t("verIncidenciasTitulo")}
          </h3>
          <p className="text-gray-600">
            {t("verIncidenciasDesc")}
          </p>
        </Link>

        <Link
          to="incidentHistory"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-amber-600 mb-2">
            {t("historialTitulo")}
          </h3>
          <p className="text-gray-600">
            {t("historialDesc")}
          </p>
        </Link>
        

      

       
      </div>
    </div>
  );
}
