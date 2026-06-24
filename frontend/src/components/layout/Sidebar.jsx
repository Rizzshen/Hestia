import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Package,
  Users,
  ShoppingCart,
  X,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Raw Materials", path: "/raw-materials", icon: Box },
  { name: "Products", path: "/products", icon: Package },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Orders", path: "/orders", icon: ShoppingCart },
];

export default function Sidebar({ onClose }) {
  return (
    <aside className="w-64 h-full md:h-screen bg-sidebar flex flex-col border-r border-white/10">
      {/* App name & Close button */}
      <div className="px-6 h-16 flex items-center justify-between border-b border-white/10">
        <span className="text-xl font-semibold text-white tracking-wide">
          HESTIA
        </span>
        
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="md:hidden p-1 text-sidebar-foreground hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose} // Auto-close sidebar on mobile when a link is clicked
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-black/30 text-white [&>svg]:text-blue-400"
                  : "text-sidebar-foreground hover:bg-black/20 hover:text-white [&>svg]:transition [&>svg]:duration-200 hover:[&>svg]:text-blue-400 hover:[&>svg]:drop-shadow-[0_0_4px_rgba(96,165,250,0.7)]"
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