import { useAuth } from "../../context/AuthContext.jsx";
import { LogOut, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

// Top bar — shows user info, dark-mode toggle, and logout.
export default function Navbar() {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Welcome back, <span className="font-semibold text-gray-800 dark:text-gray-100">{user?.name}</span>
      </h2>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDark((d) => !d)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
}
