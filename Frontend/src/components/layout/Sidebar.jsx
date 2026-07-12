import { NavLink } from "react-router-dom";
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
        } fixed md:relative h-full bg-[#0F172A] border-r border-[#1F2937] text-white transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 shadow-2xl z-30`}
      >
        <div className="p-5 border-b border-[#1F2937] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-[#00C2FF] p-2 rounded-xl shadow-[0_0_15px_rgba(0,194,255,0.4)]">
              <Truck size={24} className="text-black" />
            </div>
            <h1 className="text-2xl font-bold font-heading tracking-tight whitespace-nowrap text-white">
              TransitOps
            </h1>
          </div>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden text-brand-200 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-1.5 px-3">
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
                    : "text-[#9CA3AF] hover:bg-[#121821] hover:text-[#E5E7EB]"
                }`
              }
            >
              <Icon size={18} className="opacity-90" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;