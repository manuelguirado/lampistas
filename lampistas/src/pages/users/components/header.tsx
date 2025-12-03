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
                    <Link to="/user/miMaquinaria">
                        <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
                            Mi maquinaria
                        </button>
                    </Link>
                    <Link to="/user/crearIncidencia">
                        <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
                            Crear Incidencia
                        </button>
                    </Link>
                    <Link to="/user/misPresupuestos">
                        <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
                           Mis presupuestos
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
                            <Link to="/user/miMaquinaria" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Mi maquinaria
                            </Link>
                            <Link to="/user/crearIncidencia" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Crear incidencias
                            </Link>
                            <Link to="/user/misPresupuestos" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Mis presupuestos
                            </Link>
                          
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}