import { NavLink } from "react-router-dom";
import { LayoutDashboard, Folder, ListTodo, LogOut } from "lucide-react";
import { useAppDispatch } from "@/redux/app/reduxHook";
import { logout } from "@/redux/features/authSlice";

const Sidebar = () => {
  const dispatch = useAppDispatch();

  const navLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      to: "/project/create",
      label: "Create Project",
      icon: <Folder size={20} />,
    },
    {
      to: "/task/create",
      label: "Create Task",
      icon: <ListTodo size={20} />,
    },
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
              `flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all hover:bg-white/10 ${
                isActive ? "bg-white/20" : ""
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}

        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all hover:bg-white/10 mt-auto"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
