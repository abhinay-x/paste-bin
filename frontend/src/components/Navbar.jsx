import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-semibold tracking-tight">Pastebin-Lite</span>
          <span className="text-xs text-slate-400">MERN</span>
        </Link>
        <div className="text-sm text-slate-400">
          {location.pathname === "/" ? "Create" : "View"}
        </div>
      </div>
    </header>
  );
}
