import Sidebar from "../components/admin/Sidebar";
import HeaderAdmin from "../components/admin/Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex flex-col">
      <HeaderAdmin />
        <div className="flex-1">
            <Sidebar />
          <Outlet />
      </div>
    </div>
  );
}
