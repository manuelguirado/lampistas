import { useNavigate } from "react-router";
import Header from "./components/header";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  incidentSchema,
  type typeIncidentSchema,
} from "./schemas/incidentSchema";
export default function CreateIncident() {
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  const {
    register: incidentRegister,
    handleSubmit: handleIncidentSubmit,
    formState: { errors: incidentErrors },
  } = useForm<typeIncidentSchema>({
    resolver: zodResolver(incidentSchema),
    mode: "onChange",
  });

  function handleSubmit(data: typeIncidentSchema) {
    fetch("http://localhost:3000/user/createIncident", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Incident created successfully!");
        navigate("/user/userDashboard");
      })
      .catch((error) => {
        toast.error("Error creating incident: " + (error as Error).message);
      });
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">Crear Incidencia</h2>

      <form
        onSubmit={handleIncidentSubmit(handleSubmit)}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Título
          </label>
          <input
            type="text"
            placeholder="Título de la incidencia"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            {...incidentRegister("title")}
            required
          />
          {incidentErrors.title && (
            <p className="text-red-500 text-sm mt-1">
              {incidentErrors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Descripción
          </label>
          <textarea
            placeholder="Describe la incidencia"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={4}
            {...incidentRegister("description")}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Ubicación
          </label>
          <input
            type="text"
            placeholder="Ubicación"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            {...incidentRegister("location")}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Prioridad
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            {...incidentRegister("priority")}
            required
          >
            <option value="">Selecciona prioridad</option>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>
          {incidentErrors.priority && (
            <p className="text-red-500 text-sm mt-1">
              {incidentErrors.priority.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="urgency"
            className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
            {...incidentRegister("urgency")}
          />
          <label
            htmlFor="urgency"
            className="text-gray-700 text-sm font-medium"
          >
            Marcar como urgente
          </label>
          {incidentErrors.urgency && (
            <p className="text-red-500 text-sm mt-1">
              {incidentErrors.urgency.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
        >
          Crear Incidencia
        </button>
      </form>
    </div>
  );
}
