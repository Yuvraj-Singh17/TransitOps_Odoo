import { Menu, LogOut, User, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import toast from "react-hot-toast";

function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="h-16 glass-panel border-b border-border-dark flex items-center justify-between px-6 sticky top-0 z-10">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-xl hover:bg-bg-card text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/30"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 bg-bg-card px-4 py-1.5 rounded-full border border-border-dark shadow-sm">
          <div className="bg-[#00C2FF]/10 p-1.5 rounded-full text-[#00C2FF]">
            <User size={16} />
          </div>
          <span className="text-sm font-medium text-text-primary">{user?.email ? user.email.split('@')[0] : "User"}</span>
          <span className="text-[11px] font-semibold tracking-wide uppercase bg-[#00C2FF]/10 text-[#00C2FF] px-2.5 py-0.5 rounded-full border border-brand-200/50">
            {user?.role}
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-text-secondary hover:bg-bg-card transition-colors focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/30"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

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