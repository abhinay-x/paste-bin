import { formatDateTime } from "../utils/format.util.js";

function Badge({ children }) {
  return (
    <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}

export default function PasteViewer({ paste }) {
  const remainingViews =
    paste.maxViews == null ? null : Math.max(0, paste.maxViews - paste.viewCount);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge>
          Views: {paste.viewCount}
          {paste.maxViews == null ? "" : ` / ${paste.maxViews}`}
        </Badge>
        <Badge>Remaining: {remainingViews == null ? "∞" : remainingViews}</Badge>
        <Badge>Created: {formatDateTime(paste.createdAt)}</Badge>
        {paste.expiresAt ? <Badge>Expires: {formatDateTime(paste.expiresAt)}</Badge> : null}
      </div>

      <pre className="whitespace-pre-wrap break-words rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-sm leading-6">
        {paste.content}
      </pre>
    </div>
  );
}
