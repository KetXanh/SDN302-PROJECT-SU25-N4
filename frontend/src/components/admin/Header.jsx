import React from "react";
import { FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Header = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Đăng xuất thành công !");
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <nav className="top-0 left-0 z-50 w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Sidebar Toggle + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 dark:text-gray-200 text-2xl hover:text-green-600 transition-colors"
          >
            {/* <HiOutlineMenuAlt2 /> */}
          </button>

          <a href="#" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              Admin
            </span>
          </a>
        </div>

        {/* Right: Tools */}
        <div className="flex items-center gap-4">
          {/* Username display */}
          {user && (
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              {user.username}
            </span>
          )}
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-gray-700 dark:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;