export default function LoginCompany() {
    return (
        <div className="min-h-screen  flex  flex-col items-center justify-center bg-amber-100">

                <h2 className="text-2xl font-bold mb-6 text-center">Acceso Empresas</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Ingrese su correo electrónico"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Ingrese su contraseña"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">o Ingrese su código de empresa</h2>
                        <input
                            type="text"
                            id="companyCode"
                            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Ingrese su código de empresa"
    
                        />
                     </div>   
                    
                    <button
                        type="submit"
                        className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
    );
}   