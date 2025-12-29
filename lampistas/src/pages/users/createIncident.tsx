import { useNavigate } from "react-router";
import Header from "./components/header";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  incidentSchema,
  type typeIncidentSchema,
} from "./schemas/incidentSchema";
import { useState } from "react";
import { 
  AlertTriangle, 
  FileText, 
  MapPin, 
  Flag, 
  Zap, 
  Paperclip,
  Send,
  Image,
  Upload
} from 'lucide-react';

export default function CreateIncident() {
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate(); 
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: incidentRegister,
    handleSubmit: handleIncidentSubmit,
    formState: { errors: incidentErrors },
  } = useForm<typeIncidentSchema>({
    resolver: zodResolver(incidentSchema),
    mode: "onChange",
  });

  // Función para subir archivos que retorna una promesa
  async function uploadFiles(): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/user/uploadFile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error uploading file ${file.name}`);
      }

      const result = await response.json();
      return result.fileUrl || result.fileName; // Ajusta según tu respuesta del backend
    });

    return Promise.all(uploadPromises);
  }

  // Función principal que maneja todo el flujo
  async function handleSubmit(data: typeIncidentSchema) {
 
    setIsSubmitting(true);
    
    try {
      // 1. Primero subir los archivos
      let uploadedFiles: string[] = [];
      if (files && files.length > 0) {
        toast.loading("Subiendo archivos...", { id: "upload" });
        uploadedFiles = await uploadFiles();
        toast.success("Archivos subidos correctamente!", { id: "upload" });
      }

      // 2. Crear la incidencia con los archivos subidos
      toast.loading("Creando incidencia...", { id: "incident" });
      
      const incidentData = {
        ...data,
        files: uploadedFiles, // Añadir las URLs/nombres de los archivos subidos
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/user/createIncident`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
         
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(incidentData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la incidencia");
      }

      toast.success("Incidencia creada correctamente!", { id: "incident" });
      navigate("/user/userDashboard");

    } catch (error) {
      toast.error("Error: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Manejador para cuando se seleccionan archivos
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-red-50 to-orange-100 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      
      <div className="w-full max-w-2xl">
        {/* Título con diseño de emergencia */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Reportar Incidencia</h2>
          <p className="text-gray-600">Describe el problema que necesita atención</p>
        </div>

        {/* Formulario moderno */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-red-100">
          <form
            onSubmit={handleIncidentSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Título */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                Título de la Incidencia
              </label>
              <input
                type="text"
                placeholder="Ej: Fuga de agua en tubería principal"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                {...incidentRegister("title")}
                required
              />
              {incidentErrors.title && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {incidentErrors.title.message}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                Descripción Detallada
              </label>
              <textarea
                placeholder="Describe el problema con el mayor detalle posible..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                rows={4}
                {...incidentRegister("description")}
                required
              />
              {incidentErrors.description && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {incidentErrors.description.message}
                </p>
              )}
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Ubicación
              </label>
              <input
                type="text"
                placeholder="Ej: Planta baja, oficina 201, baño principal"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                {...incidentRegister("location")}
                required
              />
              {incidentErrors.location && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {incidentErrors.location.message}
                </p>
              )}
            </div>

            {/* Fila de prioridad y urgencia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prioridad */}
              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-semibold flex items-center gap-2">
                  <Flag className="w-4 h-4 text-red-500" />
                  Nivel de Prioridad
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  {...incidentRegister("priority")}
                  required
                >
                  <option value="">Selecciona el nivel</option>
                  <option value="LOW">🟢 Baja - No urgente</option>
                  <option value="MEDIUM">🟡 Media - Moderada</option>
                  <option value="HIGH">🔴 Alta - Crítica</option>
                </select>
                {incidentErrors.priority && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span>
                    {incidentErrors.priority.message}
                  </p>
                )}
              </div>

              {/* Checkbox de urgencia */}
              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Estado Especial
                </label>
                <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50">
                  <input
                    type="checkbox"
                    id="urgency"
                    className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    {...incidentRegister("urgency")}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="urgency"
                    className="text-gray-700 text-sm font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Marcar como URGENTE
                  </label>
                </div>
              </div>
            </div>

            {/* Archivos adjuntos */}
            <div className="space-y-3">
              <label className="block text-gray-700 text-sm font-semibold flex items-center gap-2">
                <Image className="w-4 h-4 text-red-500" />
                Evidencias (Fotos, documentos)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/zip,application/x-rar-compressed,application/gzip"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 hover:bg-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  multiple
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
                <div className="absolute right-3 top-3 pointer-events-none">
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {files && files.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
                  <Paperclip className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    {files.length} archivo{files.length > 1 ? 's' : ''} seleccionado{files.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Formatos soportados: Imágenes, PDF, Word, Excel, ZIP, etc.
              </p>
            </div>

            {/* Botón de envío */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-4 rounded-xl hover:from-red-600 hover:to-orange-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Procesando incidencia...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Reporte
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-blue-800 font-semibold text-sm">Información importante:</h4>
                <p className="text-blue-700 text-xs mt-1">
                  Tu reporte será revisado y asignado a un técnico especializado. 
                  Recibirás notificaciones sobre el progreso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
