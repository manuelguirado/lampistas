import {Link } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from "react";
export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
    
    return (
        <header className="w-full bg-amber-100 text-white shadow-lg fixed top-0 left-0 z-50">
            <div className="flex items-center justify-between p-4">
                <h1 className="text-xl md:text-2xl text-amber-800 font-bold">Lampistas - Trabajadores</h1>
                
                {/* Desktop Navigation - Ajustado para pantallas md */}
                <nav className="hidden md:flex gap-2 flex-wrap justify-end flex-1">
                 
                    <Link to="/worker/misGuardias">
                        <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
                            Mis guardias
                        </button>
                    </Link>
                    <Link to="/worker/historialIncidencias">
                        <button className="rounded-md bg-yellow-500 px-3 py-2 hover:bg-yellow-600 transition-colors text-black text-sm whitespace-nowrap">
                            Historial de incidencias
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
                          
                            <Link to="/company/misGuardias" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                               Mis guardias 
                            </Link>
                            <Link to="/worker/historialIncidencias" className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black">
                               Historial de incidencias 
                            </Link>
                           
                        </nav>
                          
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}