import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarDays, Stethoscope, UserCircle, LogOut, ShieldCheck } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/auth-context";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const role = user?.role || "MR";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Doctors", path: "/doctors", icon: Stethoscope },
    { name: "Visits", path: "/visits", icon: CalendarDays },
    { name: "Follow Ups", path: "/followups", icon: ShieldCheck },
    { name: "Profile", path: "/profile", icon: UserCircle },
  ];

  if (role === "ADMIN") {
    navItems.push({ name: "Users", path: "/users", icon: Users });
    navItems.push({ name: "MR Stats", path: "/mr-performance", icon: Users });
  }

  return (
    <div className="w-64 h-full glass-panel flex flex-col z-20 border-r border-border relative shadow-lg">
      {/* Brand */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br - - flex items-center justify-center shadow-glow">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r - - !m-0">
          MRTracker
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? "bg-primary/10 text-primary shadow-sm font-semibold" 
                  : "text-text hover:text-text-h hover:bg-surface-hover"}`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-text group-hover:text-primary"}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 bg-surface-hover rounded-xl mb-2 border border-border">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              {(user.name || user.email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-h truncate">{user.name || "User"}</p>
              <p className="text-xs text-text font-mono truncate">{user.role}</p>
            </div>
          </div>
        )}
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-text hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
