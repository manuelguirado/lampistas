import { Outlet } from "react-router";
import Header from "../components/header";

export default function WorkerLayout() {
  return (
    <div className="w-full min-h-screen bg-white/80">
      <Header />
      {/* Aquí se renderizan las rutas hijas */}
      <Outlet />
    </div>
  );
}