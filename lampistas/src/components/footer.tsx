export default function Footer() {
    return (
        <footer className="w-full bg-amber-100 text-black py-4 mt-auto shadow-lg bottom-0" >
            <div className="container mx-auto text-center flex flex-row ">
                <p className="mr-52">&copy; {new Date().getFullYear()} Lampistas. All rights reserved. coded by <a href="https://manuelguiradobaeza.com/" target="_blank" rel="noopener noreferrer">ManuDev</a></p>
                <div className="flex items-center">
                    <span>Seleccione el idioma:</span>
                    <select className="ml-2 p-1 rounded bg-amber-500 text-white">
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="cat">Català</option>
                    </select>
                </div>
            </div>
        </footer>
    );
}