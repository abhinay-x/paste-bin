import { useMemo, useState } from "react";

import PasteForm from "../components/PasteForm.jsx";
import { Copy } from "lucide-react";
import { api } from "../services/api.js";

function buildUrl(path) {
  return `${window.location.origin}${path}`;
}

export default function Home() {
  const [creating, setCreating] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const [createdUrl, setCreatedUrl] = useState(null);
  const [toast, setToast] = useState(null);

  const createdPath = useMemo(() => {
    if (!createdId) return null;
    return `/p/${createdId}`;
  }, [createdId]);

  async function onCreate({ content, ttlSeconds, maxViews }) {
    setCreating(true);
    setToast(null);

    try {
      const { id, url } = await api.createPaste({ content, ttlSeconds, maxViews });
      setCreatedId(id);
      setCreatedUrl(url || null);
      setToast({ type: "success", message: "Paste created" });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to create paste" });
    } finally {
      setCreating(false);
    }
  }

  async function copyLink() {
    const url = createdUrl || (createdPath ? buildUrl(createdPath) : null);
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setToast({ type: "success", message: "Link copied" });
      return;
    } catch {}

    // Fallback copy method for environments where navigator.clipboard is restricted
    try {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setToast({ type: "success", message: "Link copied" });
    } catch {
      setToast({ type: "error", message: "Could not copy link" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create a paste</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Optional TTL and max views are enforced atomically on the backend.
        </p>
      </div>

      {toast ? (
        <div
          className={
            "rounded-xl border px-4 py-3 text-sm " +
            (toast.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
              : "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200")
          }
        >
          {toast.message}
        </div>
      ) : null}

      {createdPath ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-200">Your paste</div>
              <a
                className="font-mono text-sm text-blue-600 hover:underline dark:text-blue-300"
                href={createdUrl || createdPath}
              >
                {createdUrl || buildUrl(createdPath)}
              </a>
            </div>
            <button
              type="button"
              onClick={copyLink}
              disabled={!createdUrl && !createdPath}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600"
              title="Copy link"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      ) : null}

      <PasteForm onCreate={onCreate} loading={creating} />
    </div>
  );
}
