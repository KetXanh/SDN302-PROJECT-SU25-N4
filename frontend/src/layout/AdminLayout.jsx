import Sidebar from "../components/admin/Sidebar";
import HeaderAdmin from "../components/admin/Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
     <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <HeaderAdmin />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
