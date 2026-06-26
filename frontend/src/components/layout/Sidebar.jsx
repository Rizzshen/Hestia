import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Package,
  Users,
  ShoppingCart,
  X,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

// Import your SVG logo
import hestiaLogo from "../../assets/hestia.svg"; 

const links = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Raw Materials", path: "/raw-materials", icon: Box },
  { name: "Products", path: "/products", icon: Package },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Orders", path: "/orders", icon: ShoppingCart },
];

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    if (onClose) onClose(); 
  };

  return (
    <aside className="w-64 h-full md:h-screen bg-sidebar flex flex-col border-r border-white/10">
      {/* App Logo & Close button */}
      <div className="px-6 h-20 flex items-center justify-between border-b border-white/10 shrink-0">
        {/* Larger Logo */}
        <img 
          src={hestiaLogo} 
          alt="Hestia" 
          className="h-15 w-auto object-contain" 
        />
        
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
            onClick={onClose}
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

      {/* Bottom Section: User Info & Logout */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-sidebar-foreground truncate">
            Signed in as
          </p>
          <p className="text-sm font-medium text-white truncate">
            {user?.name || "User"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}