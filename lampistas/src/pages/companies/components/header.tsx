import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { toast } from "react-hot-toast";

interface DecodedToken {
    companyID: number;
    role: string;
    email: string;
    name?: string;        // ✅ Agregar name opcional
}
export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
    const token = localStorage.getItem('companyToken');
    const [companyName, setCompanyName] = useState<string>('');
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
           
                setCompanyName(decoded.name || 'Empresa');
            } catch (error) {
                toast.error('❌ Error decoding token: ' + (error as Error).message);
            }
        }
    }, [token]);
    
    return (
        <header className="w-full bg-amber-100 text-white shadow-lg fixed top-0 left-0 z-50">
            <div className="flex items-center justify-between p-4">
                <Link to="/">
                <h1 className="text-xl md:text-2xl text-amber-800 font-bold">{companyName || "Cargando..."}</h1>
                </Link>
                
                {/* Desktop Navigation - Ajustado para pantallas md */}
                <nav className="hidden md:flex gap-2 flex-wrap justify-end flex-1">
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
                            <Link to="/company/trabajadores" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Trabajadores
                            </Link>
                           
                            <Link to="/company/clientes" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Registrar Cliente
                            </Link>
                           
                            <Link to="/company/incidencias" className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black">
                                Incidencias
                            </Link>
                            <Link to="/company/crear-presupuesto" className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black">
                                Crear presupuesto
                            </Link>
                            <Link to="/company/crear-maquinaria" className="text-left w-full rounded-md bg-yellow-500 px-4 py-3 hover:bg-yellow-600 transition-colors text-black">
                                Crear maquinaria
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}