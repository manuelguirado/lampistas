import Header from "../worker/components/header";
import { Outlet } from "react-router";
export default function WorkerDashboard() {
  return (
    <div>
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
