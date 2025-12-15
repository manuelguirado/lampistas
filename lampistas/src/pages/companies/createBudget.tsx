import BudgetPDFButton from "./components/budgetPDFButton";
import Header from "../companies/components/header";
import {
  budgetFormSchema,
  type BudgetFormData,
} from "../companies/schemas/budgetSchema";
import { useState } from "react";
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
  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    mode: "onChange",
  });

  const items = watch("items") || [];
  useEffect(() => {
    fetch("http://localhost:3000/company/listIncidents?limit=5&offset=0", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

      }).then((response) => response.json())
      .then((data) => {
        setIncidents(data.incidents);
      })
      .catch((error) => {
        toast.error("Error fetching incidents:" + error.message);
      });
  }, [token]);
  useEffect(() => {
    fetch("http://localhost:3000/company/listClients?limit=5&offset=0", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setClients(data.clients);
      })
      .catch((error) => {
        toast.error("Error fetching clients:" + error.message);
      });
  }, [token]);
  useEffect(() => {
    items.forEach((item, index) => {
      const newTotal = (item.quantity || 0) * (item.unitPrice || 0);
      if (item.total !== newTotal) {
        setValue(`items.${index}.total`, newTotal);
      }
    });
  }, [items, setValue]);


  async function onSubmit(data: BudgetFormData) {
 
    try {
      const { itemsWithTotal, subtotal, tax, total } = calculateTotals();
      const token = localStorage.getItem("companyToken");
    
      
        await api.post( // ✅ Agregar await
        "/company/CreateBudget",
        {
          budgetNumber: data.budgetNumber,
          userID: data.clientID,
          items: itemsWithTotal,
          title: data.title,
          subtotal: subtotal,
          tax: tax,
          totalAmount: total,
          incidentID: data.incidentID || undefined,
          description: `Presupuesto ${data.budgetNumber} `,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Presupuesto creado exitosamente!");
    
      navigate("/company/dashboard");
    } catch (error: any) {
     toast.error("Error creating budget: " + error.message);
    }
  }

  function handleAddItem() {
    const currentItems = watch("items") || [];
    setValue("items", [
      ...currentItems,
      { description: "", quantity: 0, unitPrice: 0, total: 0 },
    ]);
  }

  function handleRemoveItem(index: number) {
    const currentItems = watch("items") || [];
    setValue(
      "items",
      currentItems.filter((_, i) => i !== index)
    );
  }

  function calculateTotals() {
    const itemsWithTotal = items.map((item) => ({
      ...item,
      total: (item.quantity || 0) * (item.unitPrice || 0),
    }));

    const subtotal = itemsWithTotal.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    const tax = subtotal * 0.21;
    const total = subtotal + tax;

    return { itemsWithTotal, subtotal, tax, total };
  }

  const { itemsWithTotal, subtotal, tax, total } = calculateTotals();

  function getBudgetData() {
    const formValues = watch();
    return {
      ...formValues,
      budgetTitle: formValues.title, 
      items: itemsWithTotal,
      subtotal,
      tax,
      total,
    };
  }

  return (
    <div className="w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
      <Header />
      <h2 className="text-2xl font-bold p-4">Create Budget</h2>

      <div className="w-full max-w-4xl">
        <form
          className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleFormSubmit(
            onSubmit,
            (errors) => {
             
              toast.error('Por favor completa todos los campos requeridos' + JSON.stringify(errors));
            }
          )}
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
            <select 
              {...register("incidentID", { valueAsNumber: true })}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Incident</option>
              {incidents.map((incident) => (
                <option key={incident.IncidentsID} value={incident.IncidentsID}>
                  {incident.title}
                </option>
              ))}
            </select>
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
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Description"
                  {...register(`items.${index}.description`)}
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  className="border p-2 rounded w-24"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Unit Price"
                  {...register(`items.${index}.unitPrice`, {
                    valueAsNumber: true,
                  })}
                  className="border p-2 rounded w-32"
                  min="0"
                  step="0.01"
                />
                <span className="border p-2 rounded w-32 bg-gray-50 flex items-center justify-end">
                  {((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}€
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  disabled={items.length === 1}
                >
                  ×
                </button>
              </div>
            ))}
            {errors.items && (
              <p className="text-red-500 text-sm mt-1">
                {errors.items.message}
              </p>
            )}
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
            >
              + Add Item
            </button>
          </div>

          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal:</span>
              <span>{subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">IVA (21%):</span>
              <span>{tax.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{total.toFixed(2)}€</span>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 mt-4 font-semibold"
          >
            💾 Crear Presupuesto
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <BudgetPDFButton budgetData={getBudgetData()} />
        </div>
      </div>
    </div>
  );
}

export default CreateBudget;
