import type { MachineryType } from "../../types/machineryType";
import { useEffect, useState } from "react";
import Header from "./components/header";

export default function CreateMachinery() {
    const token = localStorage.getItem("companyToken");
    const [clients,setClients] = useState<Array<{ clientID: number; name: string }>>([]);
const [formData, setFormData] = useState<MachineryType>({
    machineryID: 0,
    name: "",
    description: "",
    brand: "",
    model: "",
    serialNumber: "",
    companyName: "",
    machineType: ""
});

useEffect(() => {
    fetch("http://localhost:3000/company/listClients?limit=100&offset=0", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setClients(data.clients || []);
      })
      .catch((err) => console.error("Error fetching clients:", err));
  }, [token]);
 function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        fetch("http://localhost:3000/company/createMachinery", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
               if (data.token) {
                    alert("Machinery created successfully!");
                } else {
                    alert("Error creating machinery.");
               }
                

            })
            .catch((error) => {
                console.error("Error creating machinery:", error);
                alert("Error creating machinery.");
            });
    }
    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">Crear Maquinaria</h2>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
            >
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre de la maquinaria"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Descripción
                    </label>
                    <textarea
                        name="description"
                        placeholder="Descripción de la maquinaria"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        rows={4}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Marca
                    </label>
                    <input
                        type="text"
                        name="brand"
                        placeholder="Marca de la maquinaria"
                        value={formData.brand}
                        onChange={(e) =>
                            setFormData({ ...formData, brand: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Modelo
                    </label>
                    <input
                        type="text"
                        name="model"
                        placeholder="Modelo de la maquinaria"
                        value={formData.model}
                        onChange={(e) =>
                            setFormData({ ...formData, model: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />  
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Número de Serie</label>
                    <input
                        type="text"
                        name="serialNumber"
                        placeholder="Número de serie"
                        value={formData.serialNumber}
                        onChange={(e) =>
                            setFormData({ ...formData, serialNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Tipo de Maquinaria</label>
                    <input
                        type="text"
                        name="machineType"
                        placeholder="Tipo de maquinaria"
                        value={formData.machineType}
                        onChange={(e) =>
                            setFormData({ ...formData, machineType: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Nombre de la Empresa</label>
                    <input
                        type="text"
                        name="companyName"
                        placeholder="Nombre de la empresa"
                        value={formData.companyName}
                        onChange={(e) =>
                            setFormData({ ...formData, companyName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>
              <div className="flex items-center gap-2">
                    <select
                      value={formData.ClientID || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, ClientID: Number(e.target.value) })
                      }
                      
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Sin asignar</option>
                      {clients.map((client) => (
                        <option key={client.clientID} value={client.clientID}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
                >
                    Crear Maquinaria
                </button>
            </form>
        </div>
    );
}