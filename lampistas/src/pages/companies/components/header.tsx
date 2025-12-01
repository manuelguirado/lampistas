import { useState } from "react";
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
    
    return (
        <header className="w-full bg-amber-100 text-white shadow-lg fixed top-0 left-0 z-50">
            <div className="flex items-center justify-between p-4">
                <h1 className="text-xl md:text-2xl text-amber-800 font-bold">Lampistas - Empresas</h1>
                
                {/* Desktop Navigation - Ajustado para pantallas md */}
                <nav className="hidden md:flex gap-2 flex-wrap justify-end flex-1">
                    <Link to="/company/registrarTrabajador">
                        <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
                            Registrar Trabajador
                        </button>
                    </Link>
                    <Link to="/company/misTrabajadores">
                        <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
                            Mis Trabajadores
                        </button>
                    </Link>
                    <Link to="/company/registrarCliente">
                        <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
                            Registrar Cliente
                        </button>
                    </Link>
                    <Link to="/company/mis-Clientes">
                        <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
                            Mis clientes
                        </button>
                    </Link>
                    <Link to="/company/Mis-incidencias">
                        <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
                            Mis incidencias
                        </button>
                    </Link>
                    <Link to="/historial-incidencias">
                        <button className="rounded-md bg-yellow-500 px-3 py-2 hover:bg-yellow-600 transition-colors text-black text-sm whitespace-nowrap">
                            Historial de incidencias
                        </button>
                    </Link>
                    <Link to="/company/crear-presupuesto">
                        <button className="rounded-md bg-yellow-500 px-3 py-2 hover:bg-yellow-600 transition-colors text-black text-sm whitespace-nowrap">
                            Crear presupuesto
                        </button>
                    </Link>
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
                            <Link to="/company/registrarTrabajador" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Registrar Trabajador
                            </Link>
                            <Link to="/company/misTrabajadores" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                               Mis Trabajadores
                            </Link>
                            <Link to="/company/registrarCliente" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Registrar Cliente
                            </Link>
                            <Link to="/company/mis-Clientes" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Mis clientes
                            </Link>
                            <Link to="/historial-incidencias" className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black">
                                Historial de incidencias
                            </Link>
                            <Link to="/company/crear-presupuesto" className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black">
                                Crear presupuesto
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}