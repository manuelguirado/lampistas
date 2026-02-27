import { useState } from "react";
import { setNewPassword } from "../utils/newPassword";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../components/header";
import { KeyRound, Lock, User } from "lucide-react";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPasswordValue] = useState("");
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await setNewPassword(newPassword, email);
      toast.success("Password updated successfully");
      navigate("/");
    } catch (error) {
      toast.error("Could not update password");
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-100 items-center pt-20 md:pt-24 px-4 pb-8">
      <Header />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Restablecer contrasena
          </h2>
          <p className="text-gray-600">
            Introduce tu correo y una nueva contrasena
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-amber-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="tucorreo@ejemplo.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  inputMode="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">
                Nueva contrasena
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  placeholder="Tu nueva contrasena"
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Actualizar contrasena
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
