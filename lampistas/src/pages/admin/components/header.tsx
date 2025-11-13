import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
    <header className="w-full h-16 bg-amber-100 text-white shadow-lg lg:fixed lg:top-0 lg:left-0 lg:right-0 z-50">
            <div className="flex items-center p-4">
                <h1 className="text-2xl text-amber-800 font-bold">Admin Dashboard</h1>
                {/* Desktop Navigation */}
                <nav className="hidden lg:flex space-x-4 justify-end flex-1">
                    <Link to="/admin/registerCompany" >
                        <button
                            className="flex items-center rounded-md bg-amber-500 px-4 py-2 hover:bg-amber-600 transition-colors text-white"
                        >
                            Register Company
                        </button>
                    </Link>
                    <Link to="/admin/editCompanies" >
                        <button
                            className="flex items-center rounded-md bg-amber-500 px-4 py-2 hover:bg-amber-600 transition-colors text-white"
                        >
                            Edit Companies
                        </button>
                    </Link>
                    <Link to="/admin/listCompanies" >
                        <button
                            className="flex items-center rounded-md bg-amber-500 px-4 py-2 hover:bg-amber-600 transition-colors text-white"
                        >
                            List Companies
                        </button>
                    </Link>
                    <Link to="/admin/modifyCompany" >
                        <button
                            className="flex items-center rounded-md bg-amber-500 px-4 py-2 hover:bg-amber-600 transition-colors text-white"
                        >
                            Modify Company
                        </button>
                    </Link>
                    <Link to="/admin/suspendCompany" >
                        <button
                            className="flex items-center rounded-md bg-amber-500 px-4 py-2 hover:bg-amber-600 transition-colors text-white"
                        >
                            Suspend Company
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
                            <Link to="/admin/editCompanies" >
                                <button
                                    className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white"
                                >
                                    Edit Companies
                                </button>
                            </Link>
                            <Link to="/admin/listCompanies" >
                                <button
                                    className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white"
                                >
                                    List Companies
                                </button>
                            </Link>
                            <Link to="/admin/modifyCompany" >
                                <button
                                    className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white"
                                >
                                    Modify Company
                                </button>
                            </Link>
                            <Link to="/admin/suspendCompany" >
                                <button
                                    className="text-left w-full rounded-md bg-amber-500 px-4 py-3 hover:bg-amber-600 transition-colors text-white"
                                >
                                    Suspend Company
                                </button>
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}