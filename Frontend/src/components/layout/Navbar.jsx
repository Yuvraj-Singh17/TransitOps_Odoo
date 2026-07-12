import { Menu, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User size={18} />
          <span className="font-medium">{user?.name || "User"}</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {user?.role}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;