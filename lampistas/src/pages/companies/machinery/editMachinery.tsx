import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
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
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <h2 className="text-2xl font-bold mb-6">Editar Maquinaria</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        {/* Form fields for machinery details */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Tipo de Maquinaria
          </label>
          <input
            type="text"
            name="machineType"
            value={formData.machineType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Marca
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Modelo
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Número de Serie
          </label>
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Fecha de Instalación
          </label>
          <input
            type="date"
            name="installationDate"
            value={formData.installedAt}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
        >
          Actualizar Maquinaria
        </button>
      </form>
    </div>
  );
}
