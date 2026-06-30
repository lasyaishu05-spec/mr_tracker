import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Search, Bell, HelpCircle, Plus } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

const Layout = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role || "MR";

  return (
    <div className="flex h-screen text-text overflow-hidden bg-[#FAFAFA] dark:bg-[#090e17] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-20 bg-transparent flex items-center justify-between px-10 pt-4 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input 
              type="text" 
              placeholder="Search visits, doctors..." 
              className="w-full bg-[#FFF1F5] dark:bg-[#111827] text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent dark:border-gray-800 focus:border-primary/30 dark:focus:border-primary/50 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            {role !== "ADMIN" && (
              <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-md shadow-primary/20">
                <Plus className="w-4 h-4" />
                Add Visit
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-10 pb-10 pt-6 relative z-10 animate-fade-in custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
