import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PasteViewer from "../components/PasteViewer.jsx";
import { api } from "../services/api.js";

export default function ViewPaste() {
  const { id } = useParams();
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState({ status: "loading" });

      try {
        const paste = await api.getPaste(id);
        if (!cancelled) setState({ status: "ready", paste });
      } catch (err) {
        if (!cancelled)
          setState({ status: "error", message: err.message || "Failed to load" });
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") {
    return (
      <div className="space-y-2">
        <div className="text-sm text-slate-500 dark:text-slate-400">Loading paste...</div>
        <div className="h-40 w-full animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-800 dark:text-rose-200">
          {state.message}
        </div>
        <Link to="/" className="text-sm text-blue-600 hover:underline dark:text-blue-300">
          Back to create
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Paste</h1>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-mono">{id}</span>
        </div>
      </div>

      <PasteViewer paste={state.paste} />

      <div className="text-sm text-slate-600 dark:text-slate-400">
        <a
          className="text-blue-600 hover:underline dark:text-blue-300"
          href={`${api.baseUrl}/p/${id}`}
          target="_blank"
          rel="noreferrer"
        >
          Open server-rendered view
        </a>
      </div>
    </div>
  );
}
