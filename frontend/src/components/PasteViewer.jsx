import { useEffect, useMemo, useState } from "react";

import { formatDateTime } from "../utils/format.util.js";

function Badge({ children }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
      {children}
    </span>
  );
}

function formatCountdown(ms) {
  if (!Number.isFinite(ms)) return "";
  if (ms <= 0) return "0s";

  const totalSeconds = Math.floor(ms / 1000);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function PasteViewer({ paste }) {
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remainingViews = useMemo(() => {
    return paste.remainingViews == null ? null : paste.remainingViews;
  }, [paste]);

  const expiresInMs = useMemo(() => {
    if (!paste.expiresAt) return null;
    const expiry = new Date(paste.expiresAt).getTime();
    if (Number.isNaN(expiry)) return null;
    return expiry - nowMs;
  }, [paste.expiresAt, nowMs]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge>
          Remaining views: {remainingViews == null ? "∞" : remainingViews}
        </Badge>
        <Badge>Created: {formatDateTime(paste.createdAt)}</Badge>
        {paste.expiresAt ? <Badge>Expires: {formatDateTime(paste.expiresAt)}</Badge> : null}
        {expiresInMs != null ? <Badge>In: {formatCountdown(expiresInMs)}</Badge> : null}
      </div>

      {remainingViews === 1 ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          Warning: this paste has only 1 view remaining.
        </div>
      ) : null}

      <pre className="whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm leading-6 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        {paste.content}
      </pre>
    </div>
  );
}
