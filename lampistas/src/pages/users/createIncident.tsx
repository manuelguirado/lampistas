import { useState } from "react";
import Header from "./components/header";
export default function CreateIncident() {
    const token = localStorage.getItem("userToken");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        priority: "",
        status : "",
        urgency: false,
        createdAt : new Date().toISOString().slice(0, 10),
        updateAT : new Date().toISOString().slice(0, 10),
    });

     
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        fetch("http://localhost:3000/user/createIncident", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...formData,
            

               
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">Crear Incidencia</h2>
            
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Título
                    </label>
                    <input
                        type="text"
                        placeholder="Título de la incidencia"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Descripción
                    </label>
                    <textarea
                        placeholder="Describe la incidencia"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Prioridad
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        required
                    >
                        <option value="">Selecciona prioridad</option>
                        <option value="LOW">Baja</option>
                        <option value="MEDIUM">Media</option>
                        <option value="HIGH">Alta</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Estado
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                    >
                        <option value="">Selecciona estado</option>
                        <option value="OPEN">Abierta</option>
                        <option value="IN_PROGRESS">En progreso</option>
                        <option value="CLOSED">Cerrada</option>
                        <option value="RESOLVED">Resuelta</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="urgency"
                        className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                        checked={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.checked })}
                    />
                    <label htmlFor="urgency" className="text-gray-700 text-sm font-medium">
                        Marcar como urgente
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
                >
                    Crear Incidencia
                </button>
            </form> 
        </div>
    )
}