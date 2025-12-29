import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Header from "../components/header";
import { Settings, Tag, Factory, Hash, MapPin, FileText, Edit, Wrench } from 'lucide-react';
export default function EditMachinery() {
  const [formData, setFormData] = useState({
    name: "",
    machineType: "",
    brand: "",
    model: "",
    serialNumber: "",
    installedAt: "",
    description: "",
  });
  const navigate = useNavigate();
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("companyToken");
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/editMachinery`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
       
        toast.success("Machinery updated successfully!");
        navigate("/company/maquinaria/listarMaquinaria");
        
      })
      .catch((error) => {
        toast.error("Error updating machinery: " + error.message);
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      
      <div className="w-full max-w-2xl">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Edit className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Editar Maquinaria</h2>
          <p className="text-gray-600">Actualizar especificaciones técnicas</p>
        </div>

        {/* Formulario moderno */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-semibold">
                  Nombre de la Máquina
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Bomba Principal A1"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Tipo de maquinaria */}
              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-semibold">
                  Tipo de Maquinaria
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Settings className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="machineType"
                    value={formData.machineType}
                    onChange={handleChange}
                    placeholder="Ej: Bomba centrífu ga"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Especificaciones técnicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Marca */}
              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-semibold">
                  Marca
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Factory className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Ej: Grundfos"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Modelo */}
              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-semibold">
                  Modelo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Ej: CR 3-8"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Número de serie */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                Número de Serie
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Número de serie único"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Fecha de instalación */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                Fecha de Instalación
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="installedAt"
                  value={formData.installedAt}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                Descripción Técnica
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Descripción detallada de la máquina, especificaciones, ubicación, etc."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                ></textarea>
              </div>
            </div>

            {/* Botón de actualización */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Actualizar Maquinaria
            </button>
          </form>
          
          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-2">
              <Wrench className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-blue-800 font-semibold text-sm">Gestión de Equipos:</h4>
                <p className="text-blue-700 text-xs mt-1">
                  Mantenga actualizada toda la información técnica para un mejor 
                  seguimiento del mantenimiento y la gestión de incidencias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
