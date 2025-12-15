import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full h-16 bg-amber-100 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center p-4 gap-4">
        <h1 className="text-2xl text-amber-800 font-bold flex-shrink-0">
          Lampistas
        </h1>

        {/* Desktop Navigation */}

        <nav className="hidden lg:flex space-x-4 justify-end flex-1 overflow-x-auto lg:overflow-visible">
          <Link to="/user/userLogin">
            <button className="flex items-center rounded-md bg-amber-500 px-4 py-2 hover:bg-amber-600 transition-colors text-white">
              Acceso Clientes
            </button>
          </Link>

          <Link to="/company/companyLogin">
            <button className="flex items-center rounded-md bg-amber-500 px-4 py-2 hover:bg-amber-600 transition-colors text-white">
              Acceso Empresas
            </button>
          </Link>
          <Link to="/admin/registerAdmin">
            <button
              id="administrator"
              className="flex items-center rounded-md bg-amber-500 px-4 py-2 hover:bg-amber-600 transition-colors text-white mr-2"
            >
              Administradores
            </button>
          </Link>
          <Link to="/worker/workerLogin">
            <button className="flex items-center rounded-md bg-yellow-500 px-4 py-2 hover:bg-yellow-600 transition-colors text-black">
              Acceso Trabajadores
            </button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 rounded-md hover:bg-amber-600 transition-colors text-amber-400"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-amber-100 border-t border-amber-400 overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-2">
              <Link to="/user/userLogin">
                <button className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                  Acceso Clientes
                </button>
              </Link>
              <Link to="/company/companyLogin">
                <button className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                  Acceso Empresas
                </button>
              </Link>
              <Link to="/admin/registerAdmin">
                <button className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black">
                  Acesso Administradores
                </button>
              </Link>

              <Link to="/worker/workerLogin">
                <button className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black">
                  Acceso Trabajadores
                </button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
