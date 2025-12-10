import { useState,useEffect} from "react";
import { useNavigate } from "react-router";

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
 
        fetch(`http://localhost:3000/company/listMachinery?limit=${limit}&offset=${offset}`, {
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
            console.error("Error fetching machinery list:", error);
        });
    }, [token]);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch(`http://localhost:3000/company/updateMaintenceDate/${formData.machineryID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then(() => {

  
            alert("Maintenance updated successfully!");
            navigate("/company/machinery/listarMaquinaria");
        })
        .catch((error) => {
            console.error("Error updating maintenance:", error);
        });
    };
    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <h2 className="text-2xl font-bold mb-6">Actualizar Mantenimiento</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
                {/* Form fields for machinery details */}
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Seleccione Maquinaria
                    </label>
                    <select
                        name="machineryID"
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    >
                        <option value="">-- Seleccione Maquinaria --</option>
                        {machineryList.map((machinery) => (
                            <option key={machinery.machineryID} value={machinery.machineryID}>
                                {machinery.name}
                            </option>
                        ))}
                    </select>
                    </div>
                    
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Fecha de Última Inspección
                    </label>
                    <input
                        type="date"
                        name="lastInspectionDate"
                        value={formData.lastInspectionDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors"
                >
                    Actualizar Mantenimiento
                </button>
            </form>
        </div>
    );
}