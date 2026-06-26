import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  User, 
  Menu, 
  LogOut,
  LayoutDashboard,
  Box,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

// Map routes to their icons and titles
const routeConfig = {
  "/dashboard": { title: "Dashboard", icon: LayoutDashboard },
  "/raw-materials": { title: "Raw Materials", icon: Box },
  "/products": { title: "Products", icon: Package },
  "/clients": { title: "Clients", icon: Users },
  "/orders": { title: "Orders", icon: ShoppingCart },
};

export default function Topbar({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get route config or fallback
  const routeInfo = routeConfig[location.pathname] || { title: "Hestia", icon: LayoutDashboard };
  const IconComponent = routeInfo.icon;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Get the first letter of the user's name for the avatar
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
      {/* Left Side: Mobile Toggle & Page Title with Icon */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 -ml-2 text-text-muted hover:text-text hover:bg-surface-secondary rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        
        {/* Title with Icon */}
        <div className="flex items-center gap-3">
          <IconComponent size={20} className="text-primary" />
          <h1 className="text-2xl font-semibold text-text">{routeInfo.title}</h1>
        </div>
      </div>
      
      {/* Right Side: User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {/* Avatar Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm hover:bg-primary/20 transition-colors border border-primary/20"
          aria-label="User menu"
        >
          {user?.name ? initials : <User size={18} />}
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-lg shadow-lg py-1 z-50">
            {/* User Details Header */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-text truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-text-muted truncate mt-0.5">
                {user?.email || "user@hestia.com"}
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-danger-bg transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}