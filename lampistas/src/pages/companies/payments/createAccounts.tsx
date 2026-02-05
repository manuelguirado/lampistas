import {useState } from "react";
import api from '../../../api/intercepttors'
import toast from "react-hot-toast";
export default function CreateAccounts() {
    const [email, setEmail] = useState("");
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        api.post("/payments/create-account", { email })
            .then((response) => {
                const { url, token } = response.data;
                localStorage.setItem("stripeAccountToken", token);
                window.location.href = url;
            })
            .catch((error) => {
                toast.error("❌ Error creating account: " + (error as Error).message);
            });
    }
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-amber-800">Crear Cuenta de Pagos</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="ingrese su email de empresa para vincular"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 transition-colors"
                >
                    Crear Cuenta
                </button>
            </form>
        </div>
    );
}
