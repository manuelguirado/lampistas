import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import toast from "react-hot-toast";

interface DecodedToken {
    userID: number;
    role: string;
    email: string;
    name?: string;        // ✅ Agregar name opcional
    username?: string;    // ✅ Mantener username opcional
    companyID?: number;
}

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState<string>('');
    const toggleMenu = () => setIsOpen(!isOpen);
    const token = localStorage.getItem('userToken');
    
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
             
                
                // ✅ Intentar name primero, luego username, luego email
                const displayName = decoded.name || decoded.username || decoded.email || 'Usuario';
                setUserName(displayName);
                
              
            } catch (error) {
                toast.error('Error decoding token: ' + (error as Error).message);
            }
        }
    }, [token]);
    
    return (
        <header className="w-full bg-amber-100 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-between p-4 gap-4">
                <Link to="/">
                    <h1 className="text-xl md:text-2xl text-amber-800 font-bold flex-shrink-0">
                       {userName || "Cargando..."}
                    </h1>
                </Link>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-2 flex-wrap justify-end flex-1 overflow-x-auto md:overflow-visible">
                    <Link to="/user/myMachinery">
                        <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
                            Mi maquinaria
                        </button>
                    </Link>
                    <Link to="/user/MisInciendencias">
                        <button className="rounded-md bg-amber-500 px-3 py-2 hover:bg-amber-600 transition-colors text-white text-sm whitespace-nowrap">
                           Mis incidencias
                        </button>
                    </Link>
                    <Link to="/user/myBudgets">
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
                            <Link to="/user/myMachinery" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Mi maquinaria
                            </Link>
                            <Link to="/user/createIncident" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Crear incidencias
                            </Link>
                            <Link to="/user/myBudgets" className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white">
                                Mis presupuestos
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}