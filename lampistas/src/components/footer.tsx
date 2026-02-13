import { useState } from "react";
import api from '../api/intercepttors'

export default function Footer() {
    const [email, setEmail] = useState("");
    function handleSubscribe(e: React.FormEvent) {
        e.preventDefault();
        api.post('/mailing/subscribeNewsletter', { email })
            .then(response => {
                alert('¡Gracias por suscribirte a nuestra newsletter!');
                setEmail("");
            })
            .catch(error => {
                alert('Error al suscribirse: ' + error.response?.data?.message || error.message);
            });
    }

         
    return (
        <footer className="w-full bg-amber-100 text-black py-5 mt-auto shadow-lg bottom-0">
            <div className="container mx-auto flex flex-col gap-4 px-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
                <p className="text-sm md:text-base">
                    &copy; {new Date().getFullYear()} Lampistas. All rights reserved. coded by{' '}
                    <a
                        href="https://manuelguiradobaeza.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-amber-800 hover:text-amber-900"
                    >
                        ManuDev
                    </a>
                </p>
                <div className="flex items-center justify-center gap-2 md:justify-start">
                    <span className="text-sm font-medium">Seleccione el idioma:</span>
                    <select className="rounded bg-amber-500 px-2 py-1 text-sm text-white shadow-sm">
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="cat">Català</option>
                    </select>
                </div>
                <form
                    className="flex flex-col items-center gap-2 md:flex-row md:justify-end"
                    onSubmit={handleSubscribe}
                >
                    <label htmlFor="newsletter-email" className="text-sm font-medium">
                        Suscribirse a la newsletter
                    </label>
                    <input
                        id="newsletter-email"
                        type="email"
                        autoComplete="email"
                        placeholder="Introduce tu email"
                        className="w-full max-w-xs rounded border border-amber-300 bg-white px-3 py-2 text-base text-black placeholder-slate-500 caret-amber-700 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="rounded bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
                    >
                        Suscribirse
                    </button>
                </form>
            </div>
        </footer>
    );
}