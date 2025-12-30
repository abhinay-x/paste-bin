import { useMemo, useState } from "react";

import PasteForm from "../components/PasteForm.jsx";
import { api } from "../services/api.js";

function buildUrl(path) {
  return `${window.location.origin}${path}`;
}

export default function Home() {
  const [creating, setCreating] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const [toast, setToast] = useState(null);

  const createdPath = useMemo(() => {
    if (!createdId) return null;
    return `/p/${createdId}`;
  }, [createdId]);

  async function onCreate({ content, ttlSeconds, maxViews }) {
    setCreating(true);
    setToast(null);

    try {
      const { id } = await api.createPaste({ content, ttlSeconds, maxViews });
      setCreatedId(id);
      setToast({ type: "success", message: "Paste created" });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to create paste" });
    } finally {
      setCreating(false);
    }
  }

  async function copyLink() {
    if (!createdPath) return;
    const url = buildUrl(createdPath);

    try {
      await navigator.clipboard.writeText(url);
      setToast({ type: "success", message: "Link copied" });
    } catch {
      setToast({ type: "error", message: "Could not copy link" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create a paste</h1>
        <p className="text-sm text-slate-400">
          Optional TTL and max views are enforced atomically on the backend.
        </p>
      </div>

      {toast ? (
        <div
          className={
            "rounded-xl border px-4 py-3 text-sm " +
            (toast.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-rose-500/30 bg-rose-500/10 text-rose-200")
          }
        >
          {toast.message}
        </div>
      ) : null}

      {createdPath ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-200">Your paste</div>
              <a className="font-mono text-sm text-blue-300 hover:underline" href={createdPath}>
                {buildUrl(createdPath)}
              </a>
            </div>
            <button
              type="button"
              onClick={copyLink}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 hover:border-slate-600"
            >
              Copy link
            </button>
          </div>
        </div>
      ) : null}

      <PasteForm onCreate={onCreate} loading={creating} />
    </div>
  );
}
