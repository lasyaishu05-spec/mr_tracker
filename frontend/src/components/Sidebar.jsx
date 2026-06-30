import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarDays, Stethoscope, UserCircle, LogOut, BarChart2 } from "lucide-react";
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
    { name: "Follow Ups", path: "/followups", icon: CalendarDays },
    { name: "Profile", path: "/profile", icon: UserCircle },
    { name: "Users", path: "/users", icon: Users, reqAdmin: true },
    { name: "MR Stats", path: "/mr-performance", icon: BarChart2, reqAdmin: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.reqAdmin || role === "ADMIN");

  return (
    <div className="w-64 h-full bg-white dark:bg-[#111827] flex flex-col z-20 border-r border-border dark:border-gray-800 relative transition-colors duration-300">
      {/* Brand */}
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary m-0 leading-tight">
          MRTracker
        </h1>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold tracking-widest uppercase mt-1">
          Clinical Precision
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-6">
        {visibleNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-full transition-all duration-300 group
                ${isActive 
                  ? "bg-[#FFF1F5] dark:bg-primary/20 text-black dark:text-white font-semibold" 
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-1">
        {user && (
          <div className="flex items-center gap-3 px-5 py-3 bg-[#FFF1F5] dark:bg-primary/10 rounded-full mb-4">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
              {(user.name || user.email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-black dark:text-white truncate">{user.name || "Admin"}</p>
              <p className="text-[10px] text-primary uppercase font-bold tracking-wider truncate">{user.role}</p>
            </div>
          </div>
        )}
        
        <ThemeToggle />

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-5 py-3 w-full rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
