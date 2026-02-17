import Header from "./components/header";
import { useEffect, useState } from "react";
import {
  UserX,
  Edit,
  UserCheck,
  Code,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/intercepttors"
import { useTranslation } from "react-i18next";



export default function ListCompany() {
  const { t } = useTranslation("admin.listCompanyPage");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const token = localStorage.getItem("adminToken") || "";

  function handleGenerateCode(companyId: string) {
    api.get( '/admin/assignCode/' + companyId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.data)
      .then((data) => {
        navigator.clipboard.writeText(data.code);
        toast.success(t("codeGenerated", { code: data.code }));
      })
      .catch((error) => {
        toast.error(t("codeError", { message: (error as Error).message }));
      });
  }
  function handleActivateCompany(companyId: string) {
    api.patch(`/admin/activateCompany/${companyId}`, {
      companyID: Number(companyId)
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.data)
      .then(() => {
        toast.success(t("activateOk"));
        window.location.reload();
      })
      .catch((error) => {
        toast.error(t("activateError", { message: (error as Error).message }));
      });
  }

  function handleDeleteCompany(companyId: string) {
    api.post( '/admin/eliminateCompany/' + companyId, {}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.data)
      .then(() => {
        toast.success(t("deleteOk"));
        window.location.reload();
      })
      .catch((error) => {
        toast.error(t("deleteError", { message: (error as Error).message }));
      });
  }
  const [companies, setCompanies] = useState<
    Array<{
      companyID: string;
      name: string;
      email: string;
      phone: string;
      suspended: boolean;
      directions: { address: string };
    }>
  >([]);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const totalPages = Math.ceil(totalCompanies / pageSize);

  useEffect(() => {
    const limit = pageSize;
    const offset = (currentPage - 1) * pageSize;
    api.get( `/admin/listCompany?limit=${limit}&offset=${offset}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.data)
      .then((data) => {
        setCompanies(data.companies || []);
        setTotalCompanies(data.total || 0);
      })
      .catch((error) => {
        toast.error(t("fetchError", { message: (error as Error).message }));
      });
  }, [currentPage, pageSize, t]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">{t("title")}</h2>

      <div className="w-full max-w-7xl overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md ">
          <thead>
            <tr className="bg-amber-200">
              <th className="py-2 px-4 border border-gray-300 text-left">ID</th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                {t("name")}
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                {t("email")}
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                {t("phone")}
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                {t("status")}
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                {t("address")}
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.name} className="hover:bg-amber-50">
                <td className="py-2 px-4 border border-gray-300">
                  {company.companyID}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {company.name}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {company.email}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {company.phone}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      company.suspended
                        ? "bg-red-200 text-red-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {company.suspended ? t("suspended") : t("active")}
                  </span>
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {company.directions?.address || t("na")}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <div className="flex gap-2 justify-center">
                    <button
                      className="p-2 hover:bg-amber-200 rounded transition-colors"
                      title="Edit company"
                      onClick={() => navigate("/admin/editCompany")}
                    >
                      <Edit size={18} className="text-blue-600" />
                    </button>

                    {!company.suspended && (
                      <button
                        className="p-2 hover:bg-amber-200 rounded transition-colors"
                        title="Suspend company"
                        onClick={() => navigate(`/admin/suspendCompany/${company.companyID}`)}
                      >
                        <UserX size={18} className="text-red-600" />
                      </button>
                    )}

                    {company.suspended && (
                      <button
                        className="p-2 hover:bg-amber-200 rounded transition-colors"
                        title="Activate company"
                        onClick={() => handleActivateCompany(company.companyID)}
                      >
                        <UserCheck size={18} className="text-green-600" />
                      </button>
                    )}
                    <button
                      className="p-2 hover:bg-amber-200 rounded transition-colors"
                      title="Delete company"
                      onClick={() => handleDeleteCompany(company.companyID)}
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-amber-200 rounded transition-colors"
                      title="Generate code"
                      onClick={() => handleGenerateCode(company.companyID)}
                    >
                      <Code size={18} className="text-purple-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} className="mr-2" />
          {t("previous")}
        </button>
        <span className="px-4 py-2 flex items-center">
          {t("page", { current: currentPage, total: totalPages || 1 })}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("next")}
          <ChevronRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
}
