import { NavLink } from "react-router-dom";
import { LayoutDashboard, Folder, List, Search, ArchiveRestore } from "lucide-react";

const Sidebar = () => {

  const navLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      to: "/dashboard/project/create",
      label: "Create Project",
      icon: <Folder size={20} />,
    },
    {
      to: "/dashboard/task/list",
      label: "Task List",
      icon: <List size={20} />,
    },
    {
      to: "/dashboard/search",
      label: "Search",
      icon: <Search size={20} />,
    },
    {
      to: "/dashboard/trash",
      label: "Recycle Bin",
      icon: <ArchiveRestore size={20} />,
    }
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-indigo-600 to-emerald-500 text-white shadow-lg hidden md:block z-40">
      <div className="h-20 flex items-center justify-center text-2xl font-bold border-b border-white/20">
        Task<span className="text-emerald-200">Flow</span>
      </div>
      <nav className="flex flex-col py-6 px-4 space-y-2">
        {navLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all hover:bg-white/10 ${isActive ? "bg-white/20" : ""
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
