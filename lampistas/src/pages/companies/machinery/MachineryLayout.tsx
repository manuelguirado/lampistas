import { Outlet } from "react-router-dom";
import Header from "../components/header";

export default function MachineryLayout() {
  return (
    <div className="w-full min-h-screen bg-white/80">
      <Header />
      {/* Aquí se renderizan las rutas hijas */}
      <Outlet />
    </div>
  );
}
