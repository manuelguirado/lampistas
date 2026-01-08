import BudgetPDFButton from "./components/budgetPDFButton";
import AsyncSelect from "react-select/async";
import Header from "../companies/components/header";
import {
  budgetFormSchema,
  type BudgetFormData,
} from "../companies/schemas/budgetSchema";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import api from "../../api/intercepttors"; // ✅ Importar
import toast from "react-hot-toast";
function CreateBudget() {
  const navigate = useNavigate();
  const token = localStorage.getItem("companyToken");
  const [client, setClients] = useState<
    Array<{ userID: number; name: string }>
  >([]);
  const [incidents, setIncidents] = useState<
    Array<{ IncidentsID: number; title: string }>
  >([]);
  const [selectedClient, setSelectedClient] = useState<{
    userID: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incidentLoading, setIncidentLoading] = useState(false);
  

  // ✅ FUNCIÓN para descargar el PDF
  const downloadPDF = (pdfBuffer: ArrayBuffer, filename: string) => {
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  const uploadFile = async (file: File) => {
  
    const formData = new FormData();
    
    // ✅ VERIFICAR: ¿El backend espera "file" o "files"?
    formData.append("files", file); // Cambiar a "files" si el backend lo espera así
    
    // ✅ AGREGAR: companyID y userID si son necesarios
    const companyID = localStorage.getItem("companyID");
    
    if (companyID) {
      formData.append("companyID", companyID);
    }
    
    try {
      const response = await api.post("/company/uploadFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ ASEGURAR que el token está incluido
        },
      });
      
     
      toast.success("PDF subido al servidor exitosamente");
      return response.data;
      
    } catch (error: any) {
      console.error("Upload error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMsg = error.response?.data?.message || 
                      error.response?.statusText || 
                      "Error desconocido al subir archivo";
      
      toast.error(`Error subiendo PDF: ${errorMsg}`);
      throw error; // Re-throw para manejar en onSubmit
    }
  };

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    mode: "onChange",
    defaultValues: {
      items: [],
      budgetNumber: "",
      companyName: "",
      title: "",
      date: "",
      
      clientID: undefined,
      incidentID: undefined,
    },
  });

  // ✅ SOLUCIÓN: Usar watch directamente en lugar de useMemo intermedio
  const watchedItems = watch("items") || [];
   

  // ✅ SOLUCIÓN: Calcular totales directamente con watchedItems
  const calculatedTotals = useMemo(() => {
    
    
    const itemsWithTotal = watchedItems.map((item) => ({
      ...item,
      total: (item.quantity || 0) * (item.unitPrice || 0),
    }));
    
    // ✅ CORREGIDO: Sumar los totales de cada item, no el precio unitario
    const subtotal = itemsWithTotal.reduce(
      (sum, item) => sum + item.total, // ✅ Cambiar a item.total
      0
    );
    
    const tax = subtotal * 0.21;
    const total = subtotal + tax;

  

    return { itemsWithTotal, subtotal, tax, total };
  }, [watchedItems]); // ✅ Dependencia directa de watchedItems

  const { itemsWithTotal, subtotal, tax, total } = calculatedTotals;

  // ✅ MEJORAR: onSubmit con una sola llamada API
  const onSubmit = async (data: BudgetFormData) => {
    
    
    // ✅ VERIFICAR companyID
    const companyID = token["companyID"] ? parseInt(token["companyID"]) : 0;
  
    
    
    // ✅ OBTENER datos del cliente seleccionado
    const selectedClientData = client.find(c => c.userID === data.clientID) || {
      name: 'Cliente no encontrado',
      userID: data.clientID || 0
    };
    
    
    
    // ✅ VERIFICAR que hay items con datos
    if (!itemsWithTotal || itemsWithTotal.length === 0) {
      toast.error("Debes agregar al menos un item al presupuesto");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const requestData = {
        budgetNumber: data.budgetNumber,
        title: data.title,
        userID: data.clientID,
        companyID, // ✅ Usar variable verificada
        date: data.date,
        incidentID: data.incidentID,
        companyName: data.companyName,
        items: itemsWithTotal,
        subtotal,
        tax,
        totalAmount: total,
        clientName: selectedClientData.name,
        clientEmail: selectedClientData.email || '',
        clientPhone: selectedClientData.phone || '',
        clientAddress: selectedClientData.address || '',
      };
      

      
      const response = await api.post('/company/createBudget', requestData, {
        responseType: 'blob' 
      });

      
      
      // ✅ DESCARGAR el PDF automáticamente
      const filename = `presupuesto_${data.budgetNumber || 'nuevo'}.pdf`;
      downloadPDF(response.data, filename);
      
      // ✅ MEJORAR: Subir PDF con manejo de errores
      try {
        await uploadFile(new File([response.data], filename, { type: 'application/pdf', }));
        toast.success("Presupuesto creado, PDF descargado y subido al servidor!");
      } catch (uploadError) {
        console.error("Error uploading PDF:", uploadError);
        toast.success("Presupuesto creado y PDF descargado (error al subir al servidor)");
      }
      
      navigate("/company/companyDashboard");
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error creating budget";
      toast.error(errorMessage);
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
    useEffect(() => {
      try {
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/listClients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setClients(data.clients || []);
          });
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    }, [token]);

  // ✅ MEJORAR: handleAddItem más simple
  function handleAddItem() {
    const currentItems = watchedItems;
   
    
    const newItems = [
      ...currentItems,
      { description: "", quantity: 1, unitPrice: 0, total: 0 },
    ];
    
    setValue("items", newItems, { 
      shouldValidate: true, 
      shouldDirty: true, 
      shouldTouch: true 
    });
  }

  // ✅ MEJORAR: handleRemoveItem más simple
  function handleRemoveItem(index: number) {
    const currentItems = watchedItems;
    const newItems = currentItems.filter((_, i) => i !== index);
    
    setValue("items", newItems, { 
      shouldValidate: true, 
      shouldDirty: true, 
      shouldTouch: true 
    });
  }

  

  const loadIncidents = async (inputValue: string) => {
    setIncidentLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/listIncidents?search=${inputValue}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setIncidentLoading(false);
      return data.incidents?.map((inc: any) => ({
        value: inc.IncidentsID,
        label: inc.title,
      })) || [];
    } catch (error) {
      console.error("Error fetching incidents:", error);
      setIncidentLoading(false);
      return [];
    }
  };

  useEffect(() => {
    try {
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/company/listIncidents?search=&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setIncidents(data.incidents || []);
          setIncidentLoading(false);
        });
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  }, [token]);

  return (
    <div className="w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
      <Header />
      <h2 className="text-2xl font-bold p-4">Create Budget</h2>

      <div className="w-full max-w-4xl">
        <form
          className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleFormSubmit(onSubmit, (errors) => {
            toast.error(
              "Por favor completa todos los campos requeridos" +
                Object.values(errors)
                  .map((err) => `\n- ${err.message}`)
                  .join("")
            );
          })}
        >
          <div>
            <input
              type="text"
              placeholder="Budget Number"
              {...register("budgetNumber")}
              className="border p-2 rounded w-full"
            />
            {errors.budgetNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.budgetNumber.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Company Name"
              {...register("companyName")}
              className="border p-2 rounded w-full"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="budget title"
              {...register("title")}
              className="border p-2 rounded w-full"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <AsyncSelect
              className="border p-2 rounded w-full"
              isLoading={incidentLoading}
              loadOptions={loadIncidents}
              defaultOptions={incidents.map((inc) => ({
                value: inc.IncidentsID,
                label: inc.title,
              }))}
              placeholder="Select Incident"
              noOptionsMessage={() => "No incidents found"}
              onChange={(selectedOption: { value: number; label: string } | null) => {
                setValue("incidentID", selectedOption?.value || undefined);
              }}
            />
            {errors.incidentID && (
              <p className="text-red-500 text-sm mt-1">
                {errors.incidentID.message}
              </p>
            )}
          </div>

          <div>
            <select
              {...register("clientID", { valueAsNumber: true })}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Client</option>
              {client.map((cl) => (
                <option key={cl.userID} value={cl.userID}>
                  {cl.name}
                </option>
              ))}
            </select>
            {errors.clientID && (
              <p className="text-red-500 text-sm mt-1">
                {errors.clientID.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="date"
              {...register("date")}
              className="border p-2 rounded w-full"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-bold mb-2">Items</h3>
            
            {/* Debug temporal */}
            <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
              <p>Items count: {watchedItems.length}</p>
              <p>Subtotal: {subtotal.toFixed(2)}€</p>
              <p>Items debug: {JSON.stringify(watchedItems.map(i => ({desc: i.description, qty: i.quantity, price: i.unitPrice})))}</p>
            </div>
            
            {/* Items dinámicos */}
            {watchedItems.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2 p-4 border rounded-lg">
                <input
                  type="text"
                  placeholder="Descripción"
                  {...register(`items.${index}.description`)}
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  {...register(`items.${index}.quantity`, { 
                    valueAsNumber: true,
                  })}
                  className="border p-2 rounded w-24"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Precio Unit."
                  {...register(`items.${index}.unitPrice`, { 
                    valueAsNumber: true,
                  })}
                  className="border p-2 rounded w-32"
                />
                <input
                  type="number"
                  step="0.01"
                  value={((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)} // ✅ CORREGIDO
                  readOnly
                  className="border p-2 rounded w-32 bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddItem}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
            >
              + Agregar Item
            </button>
          </div>

          <div className="border-t pt-4 mt-4 space-y-2">
            {/* Totales */}
            <div className="flex justify-end space-x-4 text-lg">
              <div>
                <span className="font-semibold">Subtotal: </span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div>
                <span className="font-semibold">IVA (21%): </span>
                <span>{tax.toFixed(2)}€</span>
              </div>
              <div className="text-xl font-bold">
                <span>Total: </span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 mt-4 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creando..." : "Crear Presupuesto"}
          </button>

         
        </form>
      </div>
    </div>
  );
}

export default CreateBudget;
