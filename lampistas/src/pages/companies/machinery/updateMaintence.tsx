import { useState,useEffect} from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Header from "../components/header";
import { Settings, Calendar, CheckCircle, Wrench } from 'lucide-react';

export default function EditMachinery() {
    const [formData, setFormData] = useState({
        machineryID: 0,
        lastInspectionDate: "",
    })
    const [machineryList, setMachineryList] = useState<{machineryID: number, name:string}[]>([]);
    const navigate = useNavigate();
    const limit = 5;
    const offset = 0
    
    const token = localStorage.getItem("companyToken");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    useEffect(() => {
 
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/listMachinery?limit=${limit}&offset=${offset}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setMachineryList(data.machinery);
           
        })
        .catch((error) => {
            toast.error("Error fetching machinery list: " + (error as Error).message);
        });
    }, [token]);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/updateMaintenceDate/${formData.machineryID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then(() => {

  
            toast.success('¡Mantenimiento actualizado exitosamente!');
            navigate("/company/machinery/listarMaquinaria");
        })
        .catch((error) => {
            toast.error("Error updating maintenance: " + (error as Error).message);
        });
    };
    return (
        <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-teal-100 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            
            <div className="w-full max-w-md">
                {/* Título */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-teal-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Wrench className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Actualizar Mantenimiento</h2>
                    <p className="text-gray-600">Registrar última inspección de maquinaria</p>
                </div>

                {/* Formulario moderno */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-green-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Selección de maquinaria */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 text-sm font-semibold">
                                Seleccionar Maquinaria
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Settings className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    name="machineryID"
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    required
                                >
                                    <option value="">-- Seleccione Maquinaria --</option>
                                    {machineryList.map((machinery) => (
                                        <option key={machinery.machineryID} value={machinery.machineryID}>
                                            ⚙️ {machinery.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Fecha de última inspección */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 text-sm font-semibold">
                                Fecha de Última Inspección
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    name="lastInspectionDate"
                                    value={formData.lastInspectionDate}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Botón de actualización */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-600 to-teal-700 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-teal-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Actualizar Mantenimiento
                        </button>
                    </form>
                    
                    {/* Información adicional */}
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-start gap-2">
                            <Wrench className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-green-800 font-semibold text-sm">Importante:</h4>
                                <p className="text-green-700 text-xs mt-1">
                                    Esta fecha se utilizará para calcular el próximo mantenimiento 
                                    programado y generar alertas automáticas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}