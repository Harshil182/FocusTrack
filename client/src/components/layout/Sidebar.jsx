import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { LayoutDashboard, BarChart3, Target, FileDown, Settings, Clock } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/reports", label: "Reports", icon: FileDown },
  { to: "/settings", label: "Settings", icon: Settings },
];

// Left navigation — present on every authenticated page via DashboardLayout.
export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:block">
      <div className="mb-8 flex items-center gap-2 px-2">
        <Clock className="text-brand-600" size={22} />
        <span className="text-lg font-bold">FocusTrack</span>
      </div>
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
