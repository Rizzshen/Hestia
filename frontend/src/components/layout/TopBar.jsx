import { useLocation } from "react-router-dom";
import { User, Menu } from "lucide-react";
import { ROUTE_TITLES } from "../../constants/routes.js";

export default function Topbar({ onToggleSidebar }) {
  const location = useLocation();
  const title = ROUTE_TITLES[location.pathname] || "Hestia";

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 -ml-2 text-text-muted hover:text-text hover:bg-surface-secondary rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        
        <h1 className="text-lg font-semibold text-text">{title}</h1>
      </div>
      
      <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center">
        <User size={18} className="text-text-muted" />
      </div>
    </header>
  );
}