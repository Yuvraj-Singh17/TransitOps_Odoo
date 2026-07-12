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
    <header className="h-16 glass-panel border-b border-[#1F2937] flex items-center justify-between px-6 sticky top-0 z-10">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-xl hover:bg-[#121821] text-[#E5E7EB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/30"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 bg-[#121821]/60 px-4 py-1.5 rounded-full border border-[#1F2937] shadow-sm">
          <div className="bg-[#00C2FF]/10 p-1.5 rounded-full text-[#00C2FF]">
            <User size={16} />
          </div>
          <span className="text-sm font-medium text-[#E5E7EB]">{user?.name || "User"}</span>
          <span className="text-[11px] font-semibold tracking-wide uppercase bg-[#00C2FF]/10 text-[#00C2FF] px-2.5 py-0.5 rounded-full border border-brand-200/50">
            {user?.role}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 px-3 py-2 rounded-xl transition-colors font-medium border border-transparent hover:border-red-500/30"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;