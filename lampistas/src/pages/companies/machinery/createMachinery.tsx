
import { useEffect, useState } from "react";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import toast from "react-hot-toast";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { CreateMachinerySchema, type CreateMachineryType } from "../schemas/CreateMachinerySchema";
import { useTranslation } from "react-i18next";

import api from "../../../api/intercepttors";
export default function CreateMachinery() {
    const { t } = useTranslation("companies.createMachineryPage");
    const token = localStorage.getItem("companyToken");
    const [clients, setClients] = useState<Array<{ userID: number; name: string }>>([]); // ✅ Cambiar clientID a userID
    const navigate = useNavigate();
    const {
        register,
        handleSubmit: handleSubmitForm,
        setValue,
        formState: { errors }
    } = useForm<CreateMachineryType>({
        resolver: zodResolver(CreateMachinerySchema),
        mode: "onChange",
    });
    
  
    useEffect(() => {
        api.get("/company/listClients", {
            params : {
                search: "",
                limit: 100,
                offset: 0,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            setClients(response.data.clients); // ✅ Ajustar según la estructura de la respuesta
        })
        .catch((error) => {
            toast.error(t("errorClientes", { message: error.message }));
        });
    }, [token, t]);

    async function handleSubmit(data: CreateMachineryType) {
       
        const payload = {
            ...data,
            installedAt: new Date(data.installedAt).toISOString(),
            clientID: data.clientID ? Number(data.clientID) : undefined,
        };
        
      
        try {
            const response = await api.post("/company/createMachinery", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response.data.token || response.status === 200 || response.status === 201) {
                toast.success(t("success"));
                navigate("/company/maquinaria/listarMaquinaria");
            } else {
                toast.error(t("errorCrear"));
            }
        } catch (error :any ) {
            toast.error(t("errorCrearDetalle", { message: error.response?.data?.message || error.message }));
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
            <Header />
            <h2 className="text-2xl font-bold mb-6">{t("titulo")}</h2>
            <form
                onSubmit={handleSubmitForm(handleSubmit)}
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
            >
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        {t("nombre")}
                    </label>
                    <input
                        type="text"
                        {...register("name")}
                        placeholder={t("nombrePh")}                      
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                    {errors.name && (<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>)}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        {t("descripcion")}
                    </label>
                    <textarea
                      
                        placeholder={t("descripcionPh")}
                       {...register("description")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        rows={4}
                    />
                    {errors.description && (<p className="text-red-500 text-sm mt-1">{errors.description.message}</p>)}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        {t("marca")}
                    </label>
                    <input
                        type="text"
                
                        placeholder={t("marcaPh")}
                        {...register("brand")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {errors.brand && (<p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>)}
                </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    {t("modelo")}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t("modeloPh")}
                                    {...register("model")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    required
                                />
                                {errors.model && (<p className="text-red-500 text-sm mt-1">{errors.model.message}</p>)}
                            </div>
            
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    {t("cliente")}
                                </label>
                              <AsyncSelect
                                          className="border p-2 rounded w-full"
                                          isLoading={false}
                                          cacheOptions
                                          defaultOptions={clients.map((cl) => ({
                                            value: cl.userID,
                                            label: cl.name,
                                          }))}
                                          loadOptions={async (inputValue: string) => {
                                            return clients
                                              .filter((cl) =>
                                                cl.name.toLowerCase().includes(inputValue.toLowerCase())
                                              )
                                              .map((cl) => ({
                                                value: cl.userID,
                                                label: cl.name,
                                              }));
                                          }}
                                          placeholder={t("selectClient")}
                                          noOptionsMessage={() => t("noClients")}
                                          onChange={(selectedOption: { value: number; label: string } | null) => {
                                            setValue("clientID", selectedOption?.value?.toString() || "");
                                          }}
                                        />

                                {errors.clientID && (<p className="text-red-500 text-sm mt-1">{errors.clientID.message}</p>)}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    {t("serie")}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t("seriePh")}
                                    {...register("serialNumber")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {errors.serialNumber && (<p className="text-red-500 text-sm mt-1">{errors.serialNumber.message}</p>)}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    {t("tipo")}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t("tipoPh")}
                                    {...register("machineType")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {errors.machineType && (<p className="text-red-500 text-sm mt-1">{errors.machineType.message}</p>)}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    {t("fechaInstalacion")}
                                </label>
                                <input
                                    type="date"
                                    {...register("installedAt")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {errors.installedAt && (<p className="text-red-500 text-sm mt-1">{errors.installedAt.message}</p>)}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    {t("empresa")}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t("empresaPh")}
                                    {...register("companyName")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {errors.companyName && (<p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>)}
                            </div>
            
                            <button
                                type="submit"
                                className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors font-medium"
                            >
                                {t("submit")}
                            </button>
                        </form>
                    </div>
                );
}