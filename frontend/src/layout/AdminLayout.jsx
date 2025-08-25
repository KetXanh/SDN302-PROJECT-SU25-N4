import Sidebar from "../components/admin/Sidebar";
import HeaderAdmin from "../components/admin/Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">

      <HeaderAdmin />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
