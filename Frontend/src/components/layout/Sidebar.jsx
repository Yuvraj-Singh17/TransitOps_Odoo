import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route as RouteIcon,
  Wrench,
  Fuel,
  BarChart3,
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

function Sidebar({ isOpen }) {
  const { user } = useAuthStore();

  // Show item if roles array empty (open to all) OR user's role is included
  const visibleItems = NAV_ITEMS.filter(
    (item) => item.roles.length === 0 || item.roles.includes(user?.role)
  );

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-0"
      } bg-gray-900 text-white transition-all duration-200 overflow-hidden flex-shrink-0`}
    >
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold whitespace-nowrap">🚛 TransitOps</h1>
      </div>

      <nav className="mt-4 flex flex-col gap-1 px-2">
        {visibleItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;