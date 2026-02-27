import Header from "./components/header";
import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import type { IncidentType } from "../../types/incidentType";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import api from "../../api/intercepttors";
import axios from "axios";

export default function WorkerHome() {
  const { t } = useTranslation("users.homePage");
  const [myIncidents, setMyIncidents] = useState<IncidentType[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedIncident, setSelectedIncident] = useState<{
    incidentID: number;
    name: string;
    status?: string;
    files: Array<{
      bucketName?: string;
      key: string;
      signedUrl: string;
      size?: number;
      url?: string;
      lastModified?: Date;
      token: string;
    }>;
    description: string;
    dateReported: Date;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5); // Cambiado para permitir modificación

  // Pagination logic
  const totalPages = Math.ceil(myIncidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIncidents = myIncidents.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Resetear a la primera página cuando cambie el número de elementos
  };

  function handleOpenIncidentModal(incident: {
    incidentID: number;
    name: string;
    files: Array<{
      bucketName?: string;
      key: string;
      signedUrl: string;
      size?: number;
      url?: string;
      lastModified?: Date;
      token: string;
    }>;
    description: string;
    dateReported: Date;
  }) {
    setSelectedIncident(incident);
    setIsModalOpen(true);

    fetchIncidentFiles(incident.incidentID);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedIncident(null);
  }
  useEffect(() => {
    api
      .get("/user/myIncidents")
      .then((response) => {
        
        setMyIncidents(response.data.incidents || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching incidents:", error);
        toast.error(
          t("fetchIncidentsError", {
            message: error?.response?.data?.message || error.message,
          })
        );
        setIsLoading(false);
      });
  }, [t]);

  // Resetear página cuando no hay suficientes elementos
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  function fetchIncidentFiles(incidentID: number): void {
    api
      .get(`/user/listFiles/${incidentID}`)
      .then((response) => {
        // El backend devuelve directamente el array de archivos
        const files = Array.isArray(response.data)
          ? response.data
          : response.data.files;
        if (files && Array.isArray(files) && files.length > 0) {
          setSelectedIncident((prevIncident) => {
            if (prevIncident) {
              return {
                ...prevIncident,
                files: files,
              };
            }
            return prevIncident;
          });
        } else {
          // No mostrar error si simplemente no hay archivos
        }
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        // Solo mostrar error si no es un 404 o similar
        if (error?.response?.status !== 404) {
          toast.error(
            t("fetchFilesError", {
              message: error?.response?.data?.message || error.message,
            })
          );
        }
      });
  }

  // Función para descargar archivos
  async function downloadFile(
    file: {
      bucketName?: string;
      key: string;
      signedUrl: string;
      token?: string;
    },
    fileName: string
  ) {
    try {
      // Usar axios directamente (sin interceptor) para URLs externas firmadas
      const response = await axios.get(file.signedUrl, {
        responseType: "blob",
        // No enviar headers de autorización a URLs externas
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(t("downloadSuccess"));
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error(t("downloadError"));
      // Fallback: abrir en nueva ventana
      window.open(file.signedUrl, "_blank");
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <div className="w-full max-w-7xl mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("title")}</h2>

        {/* Selector de elementos por página */}
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
            {t("show")}
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600">{t("perPage")}</span>
        </div>
      </div>

      <div className="w-full max-w-7xl overflow-x-auto rounded-2xl border border-amber-100 bg-white shadow-lg">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            <span className="ml-2 text-gray-600">{t("loading")}</span>
          </div>
        ) : (
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
                  {t("status")}
                </th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  {t("priority")}
                </th>
                <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                  {t("viewIncident")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedIncidents.length > 0 ? (
                paginatedIncidents.map((incident) => (
                  <tr key={incident.IncidentsID} className="hover:bg-amber-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-700">
                      {incident.IncidentsID}
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {incident.title}
                    </td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                      {incident.createdAt instanceof Date
                        ? incident.createdAt.toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : new Date(incident.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {incident.status}
                      </span>
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
                        {incident.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          handleOpenIncidentModal({
                            incidentID: incident.IncidentsID,
                            name: incident.title,
                            files: [],
                            description: incident.description,
                            dateReported: incident.createdAt,
                          })
                        }
                        className="border border-amber-400 text-amber-700 hover:bg-amber-100 transition-colors px-3.5 py-1.5 rounded-lg font-semibold text-sm"
                      >
                        {t("view")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 px-4 text-center text-gray-500"
                  >
                    {t("noIncidents")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Paginación */}
        {!isLoading && myIncidents.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border border-gray-300 rounded-b-lg">
            <div className="flex items-center text-sm text-gray-500">
              {t("showing", {
                from: startIndex + 1,
                to: Math.min(endIndex, myIncidents.length),
                total: myIncidents.length,
              })}
            </div>

            <div className="flex items-center space-x-2">
              {/* Botón Anterior */}
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                } transition-colors`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t("previous")}
              </button>

              {/* Números de página */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const showPage =
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1);

                  if (!showPage) {
                    // Mostrar "..." para páginas omitidas
                    if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="px-2 py-1 text-gray-500"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === pageNumber
                          ? "bg-amber-500 text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-amber-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              {/* Botón Siguiente */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                } transition-colors`}
              >
                {t("next")}
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {t("modalTitle")}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Worker Info */}
            <div className="mb-4 p-3 bg-amber-50 rounded">
              <p className="text-sm text-gray-600">{t("incident")}</p>
              <p className="font-semibold text-gray-800">
                {selectedIncident.name}
              </p>
              <p className="text-sm text-gray-600 mt-2">{t("description")}</p>
              <p className="font-semibold text-gray-800">
                {selectedIncident.description}
              </p>
              <p className="text-sm text-gray-600 mt-2">{t("reportDateLabel")}</p>
              <p className="font-semibold text-gray-800">
                {new Date(selectedIncident.dateReported).toLocaleDateString(
                  "es-ES",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </p>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">{t("files")}</h4>
                {selectedIncident.files && selectedIncident.files.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedIncident.files.map((file, index) => {
                      const fileName =
                        file.key.split("/").pop() || t("file", { index: index + 1 });
                      const fileExtension = fileName
                        .split(".")
                        .pop()
                        ?.toLowerCase();
                      const isImage = [
                        "jpg",
                        "jpeg",
                        "png",
                        "gif",
                        "webp",
                      ].includes(fileExtension || "");
                      const isPdf = fileExtension === "pdf";

                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800 truncate">
                              📎 {fileName}
                            </span>
                            {file.size && (
                              <span className="text-sm text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            )}
                          </div>

                          {/* Preview para imágenes */}
                          {isImage && (
                            <div className="mb-2">
                              <img
                                src={file.signedUrl}
                                alt={fileName}
                                className="max-w-full h-32 object-cover rounded border"
                                onError={(e) => {
                                  toast.error(
                                    `${t("imageLoadError")}: ${file.signedUrl}`
                                  );
                                  e.currentTarget.style.display = "none";
                                  // Mostrar mensaje de error
                                  const errorDiv =
                                    document.createElement("div");
                                  errorDiv.className =
                                    "bg-red-100 p-2 rounded text-center";
                                  errorDiv.innerHTML =
                                    `<span class="text-red-600 text-sm">⚠️ ${t("imageLoadError")}</span>`;
                                  e.currentTarget.parentNode?.appendChild(
                                    errorDiv
                                  );
                                }}
                                onLoad={() => {
                                  toast.success(
                                    `${t("imageLoaded")}: ${file.signedUrl}`
                                  );
                                }}
                              />
                            </div>
                          )}

                          {/* Preview para PDFs */}
                          {isPdf && (
                            <div className="mb-2">
                              <div className="bg-red-100 p-2 rounded text-center">
                                <span className="text-red-600 font-medium">
                                  📄 {t("pdf")}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {file.signedUrl && (
                              <a
                                href={file.signedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:bg-blue-100 text-sm flex-1 text-center py-1 px-2 bg-blue-50 rounded border-none cursor-pointer"
                              >
                                🔍 {t("open")}
                              </a>
                            )}
                            <button
                              onClick={() => downloadFile(file, fileName)}
                              className="text-green-600 hover:bg-green-100 text-sm flex-1 text-center py-1 px-2 bg-green-50 rounded border-none cursor-pointer"
                            >
                              💾 {t("download")}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-600">{t("noAttachments")}</p>
                )}
              </div>
            </div>

            {/* Form */}
          </div>
        </div>
      )}
    </div>
  );
}
