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

export default function ListCompany() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  function handleGenerateCode(companyId: string) {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/admin/assignCode/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        navigator.clipboard.writeText(data.code);
        toast.success("Code generated and copied to clipboard! " + data.code);
      })
      .catch((error) => {
        toast.error("Error generating code: " + (error as Error).message);
      });
  }
  function handleActivateCompany(companyId: string) {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/admin/activateCompany/${companyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify({ companyID: Number(companyId) }),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Company activated successfully");
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Error activating company: " + (error as Error).message);
      });
  }

  function handleDeleteCompany(companyId: string) {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/admin/eliminateCompany/${companyId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Company deleted successfully");
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Error deleting company: " + (error as Error).message);
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
    fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/admin/listCompany?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setCompanies(data.companies || []);
        setTotalCompanies(data.total || 0);
      })
      .catch((error) => {
        toast.error("Error fetching companies: " + (error as Error).message);
      });
  }, [currentPage, pageSize]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white/80 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <h2 className="text-2xl font-bold mb-6">Lista de Empresas</h2>

      <div className="w-full max-w-7xl overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md ">
          <thead>
            <tr className="bg-amber-200">
              <th className="py-2 px-4 border border-gray-300 text-left">ID</th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Nombre
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Email
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Teléfono
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Estado
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Dirección
              </th>
              <th className="py-2 px-4 border border-gray-300 text-left">
                Acciones
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
                    {company.suspended ? "Suspended" : "Active"}
                  </span>
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {company.directions?.address || "N/A"}
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
          Anterior
        </button>
        <span className="px-4 py-2 flex items-center">
          Página {currentPage} de {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
          <ChevronRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
}
