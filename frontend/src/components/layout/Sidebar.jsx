import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "RawMaterials", path: "/raw-materials", icon: Box },
  { name: "Products", path: "/products", icon: Package },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Orders", path: "/orders", icon: ShoppingCart },
];
export default function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r bg-white flex flex-col">
      <div className="px-6 py-5 border-b">
        <h1 className="text-xl font-bold">Hestia</h1>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Icon size={18} />
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
