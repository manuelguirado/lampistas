import { useState, useEffect } from "react";
import type { MachineryType } from "../../types/machineryType";
import Header from "../users/components/header";
import toast from "react-hot-toast";
import api from '../../api/intercepttors'
import { useTranslation } from "react-i18next";
export default function MyMachinery() {
  const { t } = useTranslation("users.myMachineryPage");
  const [machinery, setMachinery] = useState<MachineryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    api.get('/user/userMachinery', {   
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.data)
      .then((data) => {
        if (Array.isArray(data.machinery)) {
          toast.success(t("loaded"));
          setMachinery(data.machinery);
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error(t("fetchError", { message: (error as Error).message }));
        setLoading(false);
      });
  }, [t]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-xl">{t("loading")}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">{t("title")}</h2>

      {machinery.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          {t("empty")}
        </div>
      ) : (
        <div className="w-full max-w-7xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-amber-200">
                <th className="py-2 px-4 border border-gray-300 text-left">{t("id")}</th>
                <th className="py-2 px-4 border border-gray-300 text-left">{t("name")}</th>
                <th className="py-2 px-4 border border-gray-300 text-left">{t("model")}</th>
                <th className="py-2 px-4 border border-gray-300 text-left">{t("description")}</th>
                <th className="py-2 px-4 border border-gray-300 text-left">{t("brand")}</th>
                <th className="py-2 px-4 border border-gray-300 text-left">{t("serial")}</th>
                <th className="py-2 px-4 border border-gray-300 text-left">{t("installation")}</th>
                <th className="py-2 px-4 border border-gray-300 text-left">{t("lastInspection")}</th>
              </tr>
            </thead>
            <tbody>
              {machinery.map((machine) => (
                <tr key={machine.machineryID} className="hover:bg-amber-50">
                  <td className="py-2 px-4 border border-gray-300">{machine.machineryID}</td>
                  <td className="py-2 px-4 border border-gray-300">{machine.name}</td>
                  <td className="py-2 px-4 border border-gray-300">{machine.model}</td>
                  <td className="py-2 px-4 border border-gray-300">{machine.description || "-"}</td>
                  <td className="py-2 px-4 border border-gray-300">{machine.brand || "-"}</td>
                  <td className="py-2 px-4 border border-gray-300">{machine.serialNumber}</td>
                  <td className="py-2 px-4 border border-gray-300">
                    {machine.installedAt 
                      ? new Date(machine.installedAt).toLocaleDateString('es-ES')
                      : <span className="text-gray-400 italic">{t("notInstalled")}</span>
                    }
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {machine.lastInspectionDate 
                      ? new Date(machine.lastInspectionDate).toLocaleDateString('es-ES')
                      : <span className="text-gray-400 italic">{t("notInspected")}</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
