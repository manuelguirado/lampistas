import { useState } from "react";
import { Link, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
    return (
        <header className="w-full h-13 bg-amber-100 text-white shadow-lg lg:fixed lg:top-0 lg:left-0 lg:right-0">
            <div className="flex items-center p-4">
                <h1 className="text-2xl text-amber-800 font-bold">Lampistas - Empresas</h1>
            </div>
            <nav className="hidden lg:flex space-x-4 justify-end flex-1">
                {/* Ajuste para unificar estilos */}
                <li> <a href="/trabajadores" className="text-amber-800 hover:underline">Trabajadores</a></li>
                <li> <a href="/mis-clientes" className="text-amber-800 hover:underline">Mis clientes</a></li>
                <li> <a href="/historial-incidencias" className="text-amber-800 hover:underline">Historial de incidencias</a></li>
                <li> <a href="/crear-presupuesto" className="text-amber-800 hover:underline">Crear presupuesto</a></li>
            </nav>
            {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="lg:hidden p-2 rounded-md hover:bg-amber-600 transition-colors text-amber-400"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden bg-amber-100 border-t border-amber-400 overflow-hidden"
                    >
                        {/* Ajuste para unificar estilos en móvil */}
                        <nav className="flex flex-col p-4 space-y-2">
                            <Link to="/trabajadores" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Trabajadores
                            </Link>
                            <Link to="/mis-clientes" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Mis clientes
                            </Link>
                            <Link to="/historial-incidencias" className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black">
                                Historial de incidencias
                            </Link>
                            <Link to="/crear-presupuesto" className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black">
                                Crear presupuesto
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}