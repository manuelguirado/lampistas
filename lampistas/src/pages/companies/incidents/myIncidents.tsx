import Header from "../components/header";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, UserPlus, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/intercepttors";
import { useTranslation } from "react-i18next";

export default function MyIncidents() {
  const { t, i18n } = useTranslation("companies.myIncidents");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [selectedIncident, setSelectedIncident] = useState<{
    incidentID: number;
    name: string;
    description?: string;
    dateReported?: string;
    files?: Array<{
      bucketName?: string;
      key: string;
      signedUrl: string;
      size?: number;
      url?: string;
      lastModified?: Date;
      token: string;
    }>;
  } | null>(null);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [workers, setWorkers] = useState<
    Array<{ workerid: number; name: string }>
  >([]);
  const pageSize = 5;
  const offset = (currentPage - 1) * pageSize;

  const [incidents, setIncidents] = useState<
    Array<{
      IncidentsID: number;
      title: string;
      description: string;
      status: string;
      priority: string;
      createdAt: string;
      assignedWorkerID: number | null;
      assignedWorker?: { workerid: number; name: string } | null;
    }>
  >([]);

  const token = localStorage.getItem("companyToken");
  function handleOpenIncidentModal(incident: {
    incidentID: number;
    name: string;
    description: string;
    dateReported: string;
  }) {
    setSelectedIncident({
      incidentID: incident.incidentID,
      name: incident.name,
      description: incident.description,
      dateReported: incident.dateReported,
      files: [],
    });
    setIsModalOpen(true);

    // Cargar archivos del trabajador para la incidencia seleccionada
    api
      .get("/company/listFiles", {
        params: { incidentID: incident.incidentID },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data;
        const files = Array.isArray(data) ? data : data.files || [];
        setSelectedIncident((prev) =>
          prev ? { ...prev, files: files } : null,
        );
      })
      .catch((error) => {
        toast.error(t("toasts.loadFilesError", { message: error.message }));
        setSelectedIncident((prev) => (prev ? { ...prev, files: [] } : null));
      });
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedIncident(null);
  }
  // Cargar trabajadores
  useEffect(() => {
    api
      .get("/company/listWorkers", {
        params: { limit: 100, offset: 0 },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setWorkers(response.data.workers || []);
      })
      .catch((err) =>
        toast.error(
          t("toasts.loadWorkersError", { message: (err as Error).message }),
        ),
      );
  }, [token, t]);

  // Cargar incidencias
  useEffect(() => {
    api
      .get("/company/listIncidents", {
        params: { limit: pageSize, offset },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
    
        setIncidents(response.data.incidents || []);
        setTotalIncidents(response.data.total || 0);
      })
      .catch((error) => {
        toast.error(
          t("toasts.loadIncidentsError", { message: (error as Error).message }),
        );
      });
  }, [currentPage, token, offset, t]);

  // Función para asignar trabajador
  async function handleAssignWorker(incidentID: number, workerID: number) {
    if (!workerID) return;

    try {
      await api.post(
        "/company/assignIncident",
        { incidentID, workerID },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(t("toasts.assignSuccess"));
      // Actualizar la lista para reflejar el cambio
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.IncidentsID === incidentID
            ? {
                ...inc,
                assignedWorkerID: workerID,
                assignedWorker:
                  workers.find((worker) => worker.workerid === workerID) ||
                  null,
              }
            : inc,
        ),
      );
    } catch (error: unknown) {
      const apiMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;

      const fallbackMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(
        t("toasts.assignError", { message: apiMessage || fallbackMessage }),
      );
    }
  }

  const totalPages = Math.ceil(totalIncidents / pageSize);

  const getStatusBadgeClass = (status: string) => {
    if (status === "OPEN") return "bg-emerald-100 text-emerald-800";
    if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-800";
    return "bg-rose-100 text-rose-800";
  };

  const getPriorityBadgeClass = (priority: string) => {
    if (priority === "HIGH") return "bg-rose-100 text-rose-800";
    if (priority === "MEDIUM") return "bg-orange-100 text-orange-800";
    return "bg-sky-100 text-sky-800";
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">{t("title")}</h2>

      <div className="w-full max-w-7xl overflow-x-auto rounded-2xl border border-amber-100 bg-white shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-amber-50">
            <tr className="text-amber-900">
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">ID</th>
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("table.title")}
              </th>
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("table.description")}
              </th>
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("table.status")}
              </th>
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("table.priority")}
              </th>
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("table.date")}
              </th>
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("table.assignTo")}
              </th>
              <th className="sticky top-0 z-10 bg-amber-50 py-3 px-4 text-left font-semibold">
                {t("table.workerReports")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {incidents
              .filter(
                (incident) => incident.status?.toUpperCase() !== "CLOSED",
              )
              .map((incident) => {
                const normalizedStatus = incident.status?.toUpperCase();

                return (
              <tr key={incident.IncidentsID} className="hover:bg-amber-50/60 transition-colors">
                <td className="py-3 px-4 font-semibold text-gray-700">
                  {incident.IncidentsID}
                </td>
                <td className="py-3 px-4 text-gray-900 font-medium">
                  {incident.title}
                </td>
                <td className="py-3 px-4 text-gray-600 max-w-xs truncate" title={incident.description}>
                  {incident.description}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(normalizedStatus)}`}
                  >
                    {normalizedStatus === "OPEN"
                      ? t("status.open")
                      : normalizedStatus === "IN_PROGRESS"
                        ? t("status.inProgress")
                        : t("status.closed")}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeClass(incident.priority)}`}
                  >
                    {incident.priority === "HIGH"
                      ? t("priority.high")
                      : incident.priority === "MEDIUM"
                        ? t("priority.medium")
                        : t("priority.low")}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                  {new Date(incident.createdAt).toLocaleDateString(
                    i18n.language === "ca"
                      ? "ca-ES"
                      : i18n.language === "en"
                        ? "en-US"
                        : "es-ES",
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {incident.assignedWorkerID && (
                      <span className="text-sm text-gray-700 font-medium">
                        {(incident.assignedWorker &&
                          incident.assignedWorker.name) ||
                          workers.find(
                            (worker) =>
                              worker.workerid === incident.assignedWorkerID,
                          )?.name ||
                          "Asignado"}
                      </span>
                    )}

                    <select
                      value={incident.assignedWorkerID || ""}
                      onChange={(e) =>
                        handleAssignWorker(
                          incident.IncidentsID,
                          Number(e.target.value),
                        )
                      }
                      className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">{t("assign.unassigned")}</option>
                      {workers.map((worker) => (
                        <option key={worker.workerid} value={worker.workerid}>
                          {worker.name}
                        </option>
                      ))}
                    </select>
                    {incident.assignedWorkerID && (
                      <UserPlus size={16} className="text-green-600" />
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() =>
                      handleOpenIncidentModal({
                        incidentID: incident.IncidentsID,
                        name: incident.title,
                        description: incident.description,
                        dateReported: incident.createdAt,
                      })
                    }
                    className="px-3.5 py-2 rounded-lg border border-amber-400 text-amber-700 hover:bg-amber-100 transition-colors font-semibold"
                  >
                    {t("assign.viewReports")}
                  </button>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center space-x-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} className="mr-2" />
          {t("pagination.previous")}
        </button>
        <span className="font-semibold">
          {t("pagination.page", { current: currentPage, total: totalPages })}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("pagination.next")}
          <ChevronRight size={16} className="ml-2" />
        </button>
      </div>

      {/* Modal para ver reportes del trabajador */}
      {isModalOpen && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {t("modal.title")}
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
              <p className="text-sm text-gray-600">{t("modal.incident")}</p>
              <p className="font-semibold text-gray-800">
                {selectedIncident.name}
              </p>
              {selectedIncident.description && (
                <>
                  <p className="text-sm text-gray-600 mt-2">
                    {t("modal.description")}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedIncident.description}
                  </p>
                </>
              )}
              {selectedIncident.dateReported && (
                <>
                  <p className="text-sm text-gray-600 mt-2">
                    {t("modal.reportDate")}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedIncident.dateReported).toLocaleString()}
                  </p>
                </>
              )}
            </div>

            {/* Files Section */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                {t("modal.workerFiles")}
              </h4>

              {selectedIncident.files && selectedIncident.files.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedIncident.files.map((file, index) => {
                    const fileName =
                      file.key.split("/").pop() ||
                      t("modal.file", { index: index + 1 });
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
                        {isImage && file.signedUrl && (
                          <div className="mb-2">
                            <img
                              src={file.signedUrl}
                              alt={fileName}
                              className="max-w-full h-32 object-cover rounded border"
                              onError={(e) => {
                                console.error(
                                  "Error loading image:",
                                  file.signedUrl,
                                  file,
                                );
                                e.currentTarget.style.display = "none";
                                // Mostrar mensaje de error
                                const errorDiv = document.createElement("div");
                                errorDiv.className =
                                  "bg-red-100 p-2 rounded text-center";
                                errorDiv.innerHTML = `<span class="text-red-600 text-sm">⚠️ ${t("modal.imageError")}</span>`;
                                e.currentTarget.parentNode?.appendChild(
                                  errorDiv,
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
                                📄 PDF
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
                              🔍 {t("modal.view")}
                            </a>
                          )}
                          {file.signedUrl && (
                            <button
                              onClick={() => {
                                // Función para descargar - puedes implementar la lógica aquí
                                window.open(file.signedUrl, "_blank");
                              }}
                              className="text-green-600 hover:bg-green-100 text-sm flex-1 text-center py-1 px-2 bg-green-50 rounded border-none cursor-pointer"
                            >
                              💾 {t("modal.download")}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>{t("modal.noReports")}</p>
                  <p className="text-sm mt-2">{t("modal.noReportsDesc")}</p>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                {t("modal.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
