import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface DecodedToken {
    adminID: number;
    role: string;
    email: string;
    
}
export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const token = localStorage.getItem('adminToken');
    const [adminEmail, setAdminEmail] = useState<string>('');
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setAdminEmail(decoded.email);
            } catch (error) {
                toast.error('❌ Error decoding token: ' + (error as Error).message);
            }
        }
    }, [token]);
    return (
    <header className="w-full h-16 bg-amber-100 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center p-4 gap-4">
                <Link to="/"><h1 className="text-2xl text-amber-800 font-bold flex-shrink-0">{adminEmail}</h1></Link>
                {/* Desktop Navigation */}
                <nav className="hidden lg:flex space-x-4 justify-end flex-1 overflow-x-auto lg:overflow-visible">
                    <Link to="/admin/registerCompany" >
                        <button
                            className="flex items-center rounded-md bg-amber-500 px-4 py-2 hover:bg-amber-600 transition-colors text-white"
                        >
                            Register Company
                        </button>
                    </Link>
                  
                    <Link to="/admin/listCompany" >
                        <button
                            className="flex items-center rounded-md bg-amber-500 px-4 py-2 hover:bg-amber-600 transition-colors text-white"
                        >
                            List Companies
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
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden bg-amber-100 border-t border-amber-400 overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 space-y-2">
                            <Link to="/admin/registerCompany" >
                                <button
                                    className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white"
                                >
                                    Register Company
                                </button>
                            </Link>
                            
                            <Link to="/admin/listCompany" >
                                <button
                                    className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white"
                                >
                                    List Companies
                                </button>
                            </Link>
                          
                         
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}