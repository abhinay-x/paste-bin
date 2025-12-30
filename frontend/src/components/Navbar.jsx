import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, FilePlus, Eye } from "lucide-react";

import { getTheme, setTheme } from "../utils/theme.util.js";

export default function Navbar() {
  const location = useLocation();
  const [theme, setThemeState] = useState("dark");

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Pastebin-Lite
          </span>
          {/* <span className="text-xs text-slate-500 dark:text-slate-400">MERN</span> */}
        </Link>
        <div className="flex items-center gap-4">
          {location.pathname === "/" ? <FilePlus size={18} className="text-slate-800 dark:text-slate-200" /> : <Eye size={18} className="text-slate-800 dark:text-slate-200" />}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
