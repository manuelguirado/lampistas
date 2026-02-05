import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Wallet, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

import api from "../../../api/intercepttors";
interface DecodedToken {
  companyID: number;
  role: string;
  email: string;
  name?: string; // ✅ Agregar name opcional
}
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [returnUrl, setReturnUrl] = useState<string>("");

  const toggleMenu = () => setIsOpen(!isOpen);
    async function fetchDashboardUrl() {
      try {
         const response = await api.post("/payments/create-login-link",  {
          email: jwtDecode<DecodedToken>(token as string).email
         })
         const  { loginLink } = response.data;
          window.location.href = loginLink; // Redirige al usuario al dashboard de Stripe
      }catch (error) {
        toast.error("❌ Error fetching dashboard URL: " + (error as Error).message);
      }
    }
   async function fetchReturnUrl() {
    try {
      const decoded = jwtDecode<DecodedToken>(token as string);
      const response = await api.get("/payments/create-account", {
        params: { email: decoded.email }
      });

      setReturnUrl(response.data.url);
      window.location.href = response.data.url; // Redirige al usuario a la URL de Stripe
    }catch (error) {
      toast.error("❌ Error fetching return URL: " + (error as Error).message);
    }
  }

  const token = localStorage.getItem("companyToken");
  const [companyName, setCompanyName] = useState<string>("");
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);

        setCompanyName(decoded.name || "Empresa");
      } catch (error) {
        toast.error("❌ Error decoding token: " + (error as Error).message);
      }
    }
  }, [token]);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const handleProfileClick = () => setShowProfileMenu((prev) => !prev);

  return (
    <header className="w-full bg-amber-100 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between p-4 gap-4">
        <Link to="/">
          <h1 className="text-xl md:text-2xl text-amber-800 font-bold flex-shrink-0">
            {companyName || "Cargando..."}
          </h1>
        </Link>

        {/* Desktop Navigation - Ajustado para pantallas md */}
        <nav className="hidden md:flex gap-2 flex-wrap justify-end flex-1 overflow-x-auto md:overflow-visible items-center">
          <Link to="/company/trabajadores">
            <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
              Trabajadores
            </button>
          </Link>
          <Link to="/company/clientes">
            <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
              clientes
            </button>
          </Link>
          <Link to="/company/incidencias">
            <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
              incidencias
            </button>
          </Link>
          <Link to="/company/crear-presupuesto">
            <button className="rounded-md bg-yellow-500 px-3 py-2 hover:bg-yellow-600 transition-colors text-black text-sm whitespace-nowrap">
              Crear presupuesto
            </button>
          </Link>
          <Link to="/company/maquinaria">
            <button className="rounded-md bg-yellow-500 px-3 py-2 hover:bg-yellow-600 transition-colors text-black text-sm whitespace-nowrap">
              Maquinaria
            </button>
          </Link>
          {/* Perfil con menú */}
          <div className="relative ml-4">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white text-amber-700 hover:bg-amber-200 transition-colors border border-amber-300 shadow-sm"
              aria-label="Perfil"
            >
              <User size={22} />
              <span className="font-semibold text-sm">Perfil</span>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-amber-200 z-50 animate-fade-in">
                <button
                  className="flex items-center gap-2 w-full px-4 py-3 text-amber-700 hover:bg-amber-100 transition-colors text-left"
                  onClick={() => {
                    setShowProfileMenu(false);
                    fetchReturnUrl();
                  }}
                >
                  <Wallet size={18} className="text-amber-600" />
                  <span>Vincular pagos</span>
                </button>
                <button 
                className="flex items-center gap-2 w-full px-4 py-3 text-amber-700 hover:bg-amber-100 transition-colors text-left"
                onClick={() => {
                  setShowProfileMenu(false)
                  fetchDashboardUrl()
                }}
                >
                  <LayoutDashboard size={18} className="text-amber-600" />
                  <span>Dashboard</span>
                </button>

              </div>
              
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md hover:bg-amber-600 transition-colors text-amber-800"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-amber-100 border-t border-amber-400 overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-2">
              <Link
                to="/company/trabajadores"
                className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white"
                onClick={toggleMenu}
              >
                Trabajadores
              </Link>
              <Link
                to="/company/clientes"
                className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white"
                onClick={toggleMenu}
              >
                Registrar Cliente
              </Link>
              <Link
                to="/company/incidencias"
                className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black"
                onClick={toggleMenu}
              >
                Incidencias
              </Link>
              <Link
                to="/company/crear-presupuesto"
                className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black"
                onClick={toggleMenu}
              >
                Crear presupuesto
              </Link>
              <Link
                to="/company/crear-maquinaria"
                className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black"
                onClick={toggleMenu}
              >
                Crear maquinaria
              </Link>
              <button
                className="flex items-center gap-2 w-full px-4 py-3 rounded-md bg-white text-amber-700 hover:bg-amber-100 transition-colors border border-amber-300 shadow-sm"
                onClick={() => {
                  toggleMenu();
                  fetchReturnUrl();
                  
                }}
              >
                <Wallet size={18} className="text-amber-600" />
                <span>Vincular pagos</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
