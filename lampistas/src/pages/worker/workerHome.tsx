import { useEffect, useState } from "react";
// Removed unused react-leaflet imports
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
import { useTranslation } from "react-i18next";

export default function WorkerHome() {
  const { t } = useTranslation("worker.homePage");
  const [activeIncidents, setActiveIncidents] = useState<IncidentType[]>([]);
  
  const [setDirections] = useState<string[]>([]);
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
        throw new Error(t("noAddressResults"));
      }
      return fetchGeocode(sanitized).then((fallback) => {
        if (fallback) return fallback;
        throw new Error(t("noAddressResults"));
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

        const coords = [];

        try {
          const address = data?.fullAddress || data?.fullAddres;
          if (!address || typeof address !== "string") {
            throw new Error(t("invalidAddress"));
          }
          const geocoded = await geocodeAddress(address);
       
          coords.push(geocoded);
        } catch (err) {
          console.error("Error geocoding address:", err);
        }

        setCoordinates(coords);
       
      })
      .catch((err) => {
        console.error("Error fetching incident directions:", err);
  
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
      toast.error(t("noIncidentSelected"));
      return;
    }

    if (!data.files || data.files.length === 0) {
      toast.error(t("selectAtLeastOneFile"));
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
        toast.success(t("filesUploaded"));
        filesReset();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
        toast.error(t("uploadError", {
          message: error?.response?.data?.message || error.message,
        }));
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
        toast.success(t("statusUpdated"));
        setActiveIncidents((prevIncidents) =>
          prevIncidents.map((incident) =>
            incident.IncidentsID === incidentID
              ? { ...incident, status: status }
              : incident,
          ),
        );
      })
      .catch((error) => {
        toast.error(t("statusUpdateError", { message: error.message }));
      });
  }

  useEffect(() => {
    if (!token) {
      setError(t("noAuthToken"));
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
  }, [token, t]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-xl">{t("loadingIncidents")}</div>
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
        {t("assignedTitle")}
      </h1>

      {activeIncidents.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          {t("noAssigned")}
        </div>
      ) : (
        <div className="w-full max-w-7xl overflow-x-auto rounded-2xl border border-amber-100 bg-white shadow-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-amber-50">
              <tr className="text-amber-900">
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  ID
                </th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  {t("incidentTitle")}
                </th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  {t("reportDate")}
                </th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  {t("reportedBy")}
                </th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  {t("status")}
                </th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  {t("priority")}
                </th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  {t("addPhotos")}{" "}
                </th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  {t("details")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeIncidents.map((incident) => (
                <tr key={incident.IncidentsID} className="hover:bg-amber-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-700">
                    {incident.IncidentsID}
                  </td>
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    {incident.title}
                  </td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                    {incident.createdAt instanceof Date
                      ? incident.createdAt.toLocaleDateString("es-ES")
                      : new Date(incident.createdAt).toLocaleDateString(
                          "es-ES",
                        )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {incident.reportedByUserID || t("unknown")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <select
                        name="estado"
                        id={`status-${incident.IncidentsID}`}
                        defaultValue={incident.status}
                        className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="open">{t("open")}</option>
                        <option value="in_progress">{t("inProgress")}</option>
                        <option value="resolved">{t("resolved")}</option>
                        <option value="closed">{t("closed")}</option>
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
                        className="bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                      >
                        {t("update")}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        incident.priority === "high"
                          ? "bg-rose-100 text-rose-800"
                          : incident.priority === "medium"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {incident.priority === "high"
                        ? t("priorityHigh")
                        : incident.priority === "medium"
                          ? t("priorityMedium")
                          : t("priorityLow")}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() =>
                        handleOpenIncidentModal({
                          incidentID: incident.IncidentsID,
                          name: incident.title,
                        })
                      }
                      className="px-3.5 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors font-semibold text-sm"
                    >
                      {t("addPhotosButton")}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={async () => {
                        const files = await getIncidentFiles(
                          incident.IncidentsID,
                        );
                        handleViewDetails({
                          incidentID: incident.IncidentsID,
                          title: incident.title,
                          date:
                            incident.createdAt instanceof Date
                              ? incident.createdAt
                              : new Date(incident.createdAt),
                          priority: incident.priority,
                          photoURL: files,
                        });
                      }}
                      className="px-3.5 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors font-semibold text-sm"
                    >
                      {t("viewDetails")}
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
                {t("addPhotosModal")}
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
              <p className="text-sm text-gray-600">{t("incident")}</p>
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
                  {t("selectFiles")}
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
                  {t("allowedFormats")}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                >
                  {t("uploadPhotos")}
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
                {t("incidentDetails")}
              </h3>
              <div className="flex flex-col gap-1">
                <span>
                  {t("reportDateLabel", {
                    date: modal.date,
                  })}
                </span>
                <span className="font-semibold">
                  {t("titleLabel", { title: modal.title })}
                </span>
                <span>{t("priorityLabel", { priority: modal.priority })}</span>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {t("files")}
                  </h4>
             
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
                            t("file", { index: index + 1 });
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
                                    {t("downloadFile")}
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {t("noFilesAvailable")}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <p>{t("clientLocation")}</p>
              {coordinates.length === 0 && (
                <div className="text-center text-red-500 mb-2">
                  {t("noLocations")}
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
