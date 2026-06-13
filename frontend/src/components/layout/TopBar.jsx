import {useLocation} from "react-router-dom";
import {User} from "lucide-react";
import{ROUTE_TITLES} from "../../constants/routes.js";

export default function Topbar(){
    const location = useLocation();
    const title = ROUTE_TITLES[location.pathname] || "Hestia";


return (<header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
    <h1 className="text-lg font-semibold text-text">{title}</h1>
    <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center">
        <User size={18} className="text-text-muted"/>
    </div>
</header>)
}