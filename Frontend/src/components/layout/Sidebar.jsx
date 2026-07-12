import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route as RouteIcon,
  Wrench,
  Fuel,
  BarChart3,
  X,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { ROLES } from "../../utils/constants";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: [] },
  { label: "Vehicles", path: "/vehicles", icon: Truck, roles: [ROLES.FLEET_MANAGER] },
  { label: "Drivers", path: "/drivers", icon: Users, roles: [ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER] },
  { label: "Trips", path: "/trips", icon: RouteIcon, roles: [] },
  { label: "Maintenance", path: "/maintenance", icon: Wrench, roles: [ROLES.FLEET_MANAGER] },
  { label: "Fuel & Expense", path: "/fuel-expense", icon: Fuel, roles: [] },
  { label: "Reports", path: "/reports", icon: BarChart3, roles: [ROLES.FINANCIAL_ANALYST, ROLES.FLEET_MANAGER] },
];

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuthStore();

  const visibleItems = NAV_ITEMS.filter(
    (item) => item.roles.length === 0 || item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 md:translate-x-0 md:w-0"
        } fixed md:relative h-full bg-bg-card border-r border-border-dark text-text-primary transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 shadow-2xl z-30`}
      >
        <div className="p-5 border-b border-border-dark flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-[#00C2FF] p-2 rounded-xl shadow-[0_0_15px_rgba(0,194,255,0.4)]">
              <Truck size={24} className="text-black" />
            </div>
            <h1 className="text-2xl font-bold font-heading tracking-tight whitespace-nowrap text-text-primary">
              TransitOps
            </h1>
          </div>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden text-text-secondary hover:text-brand-500 p-1">
            <X size={20} />
          </button>
        </div>
        
        {/* User profile section matching mockup */}
        <Link to="/profile" className="px-6 py-4 border-b border-border-dark flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="h-10 w-10 rounded-full bg-slate-700 overflow-hidden border border-border-dark shadow-sm flex items-center justify-center group-hover:border-[#00C2FF] transition-colors">
            {user?.profileImage ? (
              <img src={user?.profileImage} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <Users size={20} className="text-slate-400" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-text-primary truncate">{user?.email ? user.email.split('@')[0] : "User"}</p>
            <p className="text-xs text-text-secondary truncate">{user?.role}</p>
          </div>
        </Link>

        <nav className="mt-4 flex flex-col gap-1 px-3">
          {visibleItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-[#00C2FF]/10 text-[#00C2FF] border-l-2 border-[#00C2FF] shadow-[inset_4px_0_0_0_#00C2FF,0_0_15px_rgba(0,194,255,0.1)]"
                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? "text-[#00C2FF]" : "opacity-80"} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;