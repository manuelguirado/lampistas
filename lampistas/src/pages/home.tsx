import Header from "../components/header";
export default function Home() {
    return (
        <div className="bg-white/80 w-full h-full  p-16 rounded-xl border border-amber-100  hover:shadow-sm transition-shadow duration-300  mt-0">
            <Header />
            <h2 className="text-2xl  text-center font-bold mb-4">Bienvenido a Lampistas</h2>
            <section className="flex flex-col w-96 h-500 bg-amber-100 p-4 rounded-lg ml-0 mb-4 text-wrap shadow-lg">
                <p className="text-left">
                    ¿Eres un cliente que necesita asistencia con una reparación de fontanería o electricidad?
                </p>
                <p className="text-left">
                    Registrese mediante el código proporcionado por la empresa o busque empresas disponibles en su área.
                </p>
                <button className="mt-4 bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600">
                    Buscar Empresas
                </button>
                <button className="mt-4 bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600">
                    Registrarse
                </button>
            </section>
        </div>
    );

}