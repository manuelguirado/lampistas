import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { IncidentType } from "../../types/incidentType";
import toast from "react-hot-toast";
import type { incidentStatus } from "../../types/incidentStatus";
import { X } from "lucide-react";
import Header from "./components/header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  uploadFilesSchema,
  type typeUploadFilesSchema,
} from "../worker/schemas/uploadFilesSchema";
import api from "../../api/intercepttors";

export default function WorkerHome() {
  const [activeIncidents, setActiveIncidents] = useState<IncidentType[]>([]);
  const [incidentFiles, setIncidentFiles] = useState<
    { incidentID: number; files: string[] }[]
  >([]);
  const [directions, setDirections] = useState<
    { address: string; city: string; zipCode: string; state: string }[]
  >([]);
  const [coordinates, setCoordinates] = useState<
    { longitude: number; latitude: number }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<{
    incidentID: number;
    title: string;
    date: Date;
    priority: string;
    photoURL?: string[];
  } | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<{
    incidentID: number;
    name: string;
  } | null>(null);
  const token = localStorage.getItem("workerToken");
  const {
    register: filesRegister,
    handleSubmit: handleFilesSubmit,
    formState: { errors: filesErrors },
    reset: filesReset,
  } = useForm<typeUploadFilesSchema>({
    resolver: zodResolver(uploadFilesSchema),
    mode: "onChange",
  });
  function geocodeAddress(
    address: string,
  ): Promise<{ longitude: number; latitude: number }> {
    const normalizeAddress = (value: string) =>
      value
        .replace(/nº/gi, "")
        .replace(/º/gi, "")
        .replace(/\b\d+\s*[A-Za-z]?\b\s*(?=,|$)/g, "")
        .replace(/,+/g, ",")
        .replace(/\s+/g, " ")
        .trim();

    const buildUrl = (value: string) => {
      const fullAddress = encodeURIComponent(value);
      console.log("Encoded address for geocoding:", fullAddress);
      console.log("Geocoding address:", value);
      return `https://nominatim.openstreetmap.org/search?q=${fullAddress}&format=json&limit=1&addressdetails=0&countrycodes=es`;
    };

    const fetchGeocode = (value: string) =>
      fetch(buildUrl(value))
        .then((resp) => resp.json())
        .then((data) => {
          if (data && data.length > 0) {
            return {
              longitude: parseFloat(data[0].lon),
              latitude: parseFloat(data[0].lat),
            };
          }
          return null;
        });

    return fetchGeocode(address).then((result) => {
      if (result) return result;
      const sanitized = normalizeAddress(address);
      if (sanitized === address) {
        throw new Error("No se encontraron resultados para la dirección");
      }
      return fetchGeocode(sanitized).then((fallback) => {
        if (fallback) return fallback;
        throw new Error("No se encontraron resultados para la dirección");
      });
    });
  }



  useEffect(() => {
    if (!modal?.incidentID || isNaN(Number(modal.incidentID))) return;
    api
      .get(`/worker/getDirections/${modal.incidentID}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        if (!res.status) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data = res.data;
        console.log("Raw response data from getDirections API:", data);

        const coords = [];

        try {
          const address = data?.fullAddress || data?.fullAddres;
          if (!address || typeof address !== "string") {
            throw new Error("Dirección inválida para geocodificar");
          }
          const geocoded = await geocodeAddress(address);
          console.log(`Geocoded coordinates for address "${address}":`, geocoded);
          coords.push(geocoded);
        } catch (err) {
          console.error("Error geocoding address:", err);
        }

        setCoordinates(coords);
        console.log("Final coordinates array:", coords);
      })
      .catch((err) => {
        console.error("Error fetching incident directions:", err);
        setDirections([]);
        setCoordinates([]);
      });
  }, [modal?.incidentID]);

  async function getIncidentFiles(incidentID: number) {
    const incident = await api.get(
      `/worker/getIncidentPhotos?incidentID=${incidentID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Incident photos response:", incident);
    return incident.data.files;
  }
  function handleViewDetails(incident: {
    incidentID: number;
    title: string;
    date: Date;
    priority: string;
    photoURL?: string[];
  }) {
    setModal(incident);
  }
  function handleCloseDetails() {
    setModal(null);
  }
  function uploadfile(data: typeUploadFilesSchema) {
    if (!selectedIncident?.incidentID) {
      toast.error("No se ha seleccionado ninguna incidencia");
      return;
    }

    if (!data.files || data.files.length === 0) {
      toast.error("Por favor selecciona al menos un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("incidentID", selectedIncident.incidentID.toString());

    // Añadir cada archivo al FormData con el campo 'files'
    Array.from(data.files).forEach((file) => {
      formData.append("files", file);
    });

    api
      .post("/worker/uploadFile", formData)
      .then(() => {
        toast.success("¡Archivos subidos exitosamente!");
        filesReset();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
        toast.error(
          "Error al subir los archivos: " +
            (error?.response?.data?.message || error.message),
        );
      });
  }

  function handleOpenIncidentModal(incident: {
    incidentID: number;
    name: string;
  }) {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedIncident(null);
    filesReset();
  }
  function handleupdateStatusIncident(
    incidentID: number,
    status: incidentStatus,
  ) {
    api
      .patch("/worker/updateIncidentStatus", {
        incidentID,
        status,
      })
      .then(() => {
        toast.success("¡Estado de incidencia actualizado exitosamente!");
        setActiveIncidents((prevIncidents) =>
          prevIncidents.map((incident) =>
            incident.IncidentsID === incidentID
              ? { ...incident, status: status }
              : incident,
          ),
        );
      })
      .catch((error) => {
        toast.error("Error al actualizar el estado: " + error.message);
      });
  }

  useEffect(() => {
    if (!token) {
      setError("No hay token de autenticación");
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get(`/worker/assignedIncidents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (!res.status) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.data;
      })
      .then((data) => {
        setActiveIncidents(data.assignedIncidents || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setActiveIncidents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando incidencias...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h1 className="text-3xl font-bold mb-6 text-amber-800">
        Incidencias Asignadas
      </h1>

      {activeIncidents.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          No tienes incidencias asignadas
        </div>
      ) : (
        <div className="w-full max-w-7xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-amber-200">
                <th className="py-2 px-4 border border-gray-300 text-left">
                  ID
                </th>
                <th className="py-2 px-4 border border-gray-300 text-left">
                  Título
                </th>
                <th className="py-2 px-4 border border-gray-300 text-left">
                  Fecha de Reporte
                </th>
                <th className="py-2 px-4 border border-gray-300 text-left">
                  Usuario que Reportó
                </th>
                <th className="py-2 px-4 border border-gray-300 text-left">
                  Estado
                </th>
                <th className="py-2 px-4 border border-gray-300 text-left">
                  Prioridad
                </th>
                <th className="py-2 px-4 border border-gray-300 text-left">
                  Añadir fotos{" "}
                </th>
                <th className="py-2 px-4 border border-gray-300 text-left">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody>
              {activeIncidents.map((incident) => (
                <tr key={incident.IncidentsID} className="hover:bg-amber-50">
                  <td className="py-2 px-4 border border-gray-300">
                    {incident.IncidentsID}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {incident.title}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {incident.dateReported instanceof Date
                      ? incident.dateReported.toLocaleDateString("es-ES")
                      : new Date(incident.dateReported).toLocaleDateString(
                          "es-ES",
                        )}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {incident.reportedByUserID}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <div className="flex items-center gap-2">
                      <select
                        name="estado"
                        id={`status-${incident.IncidentsID}`}
                        defaultValue={incident.status}
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="open">Abierta</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="resolved">Resuelta</option>
                        <option value="closed">Cerrada</option>
                      </select>
                      <button
                        onClick={() => {
                          const selectElement = document.getElementById(
                            `status-${incident.IncidentsID}`,
                          ) as HTMLSelectElement;
                          handleupdateStatusIncident(
                            incident.IncidentsID,
                            selectElement.value as incidentStatus,
                          );
                        }}
                        className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 transition-colors"
                      >
                        Actualizar
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        incident.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : incident.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {incident.priority === "high"
                        ? "Alta"
                        : incident.priority === "medium"
                          ? "Media"
                          : "Baja"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <button
                      onClick={() =>
                        handleOpenIncidentModal({
                          incidentID: incident.IncidentsID,
                          name: incident.title,
                        })
                      }
                      className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 transition-colors"
                    >
                      Añadir Fotos
                    </button>
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <button
                      onClick={async () => {
                        const files = await getIncidentFiles(
                          incident.IncidentsID,
                        );
                        handleViewDetails({
                          incidentID: incident.IncidentsID,
                          title: incident.title,
                          date:
                            incident.dateReported instanceof Date
                              ? incident.dateReported
                              : new Date(incident.dateReported),
                          priority: incident.priority,
                          photoURL: files,
                        });
                      }}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para subir fotos */}
      {isModalOpen && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Añadir Fotos a Incidencia
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Incident Info */}
            <div className="mb-4 p-3 bg-amber-50 rounded">
              <p className="text-sm text-gray-600">Incidencia:</p>
              <p className="font-semibold text-gray-800">
                {selectedIncident.name}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleFilesSubmit(uploadfile)}
              method="POST"
              encType="multipart/form-data"
              className="space-y-4"
            >
              <input
                type="hidden"
                name="incidentID"
                value={selectedIncident.incidentID}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecciona fotos o documentos
                </label>
                <input
                  {...filesRegister("files")}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/zip,application/x-rar-compressed,application/gzip"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {filesErrors.files && (
                  <p className="text-red-500 text-sm mt-1">
                    {filesErrors.files.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Formatos permitidos: JPG, PNG, PDF, DOC, XLS, ZIP, RAR
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                >
                  Subir Fotos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal para ver detalles */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
             <div className="flex justify-end">
              <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Detalles de Incidencia
              </h3>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">Título: {modal.title}</span>
                <span>
                  Fecha de reporte: {modal.date.toLocaleDateString("es-ES")}
                </span>
                <span>Prioridad: {modal.priority}</span>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Archivos:
                  </h4>
                  {console.log("DEBUG modal.photoURL:", modal.photoURL)}
                  {Array.isArray(modal.photoURL) &&
                  modal.photoURL.filter(Boolean).length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {modal.photoURL
                        .filter(Boolean)
                        .map((file: any, index: number) => {
                          let fileUrl: string | undefined = undefined;
                          let fileName: string | undefined = undefined;

                          if (typeof file === "string") {
                            fileUrl = file;
                          } else if (file && typeof file === "object") {
                            fileUrl =
                              file.signedUrl ||
                              file.url ||
                              file.fileURL ||
                              file.downloadUrl;
                            fileName = file.fileName || file.name;
                          }

                          if (!fileUrl) return null;
                          const derivedName =
                            fileName ||
                            fileUrl.split("/").pop() ||
                            file.key ||
                            `Archivo ${index + 1}`;
                          const fileExtension =
                            derivedName.split(".").pop()?.toLowerCase() || "";
                          const isImage = [
                            "jpg",
                            "jpeg",
                            "png",
                            "gif",
                            "webp",
                          ].includes(fileExtension);
                          return (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center gap-4 hover:bg-gray-100 transition"
                            >
                              {isImage ? (
                                <div className="flex-shrink-0">
                                  <img
                                    src={fileUrl}
                                    alt={fileName}
                                    className="w-40 h-40 object-cover rounded-lg border shadow-md hover:scale-105 transition-transform"
                                  />
                                </div>
                              ) : (
                                <div className="flex-shrink-0 text-2xl text-blue-500">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-8 h-8"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 17a4 4 0 005.656-5.656l-6.586 6.586A2 2 0 007 17z"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div className="flex flex-col justify-center">
                                <span className="font-medium text-gray-800 truncate mb-1">
                                  {derivedName}
                                </span>
                                {!isImage && (
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-sm hover:text-blue-800"
                                  >
                                    Descargar archivo
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No hay archivos disponibles
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <p>Ubicación del Cliente </p>
              {coordinates.length === 0 && (
                <div className="text-center text-red-500 mb-2">
                  No hay ubicaciones para mostrar en el mapa.
                </div>
              )}
              {coordinates.length > 0 && (
                <div
                  style={{
                    width: "100%",
                    height: 300,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates[0].longitude - 0.01},${coordinates[0].latitude - 0.01},${coordinates[0].longitude + 0.01},${coordinates[0].latitude + 0.01}&layer=mapnik&marker=${coordinates[0].latitude},${coordinates[0].longitude}`}
                    frameBorder="0"
                  ></iframe>
                </div>
              )}
            </div>
           
          </div>
        </div>
      )}
    </div>
  );
}
