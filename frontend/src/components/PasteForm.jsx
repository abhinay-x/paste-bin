import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";

import InputField from "./InputField.jsx";

function parseOptionalPositiveInt(v) {
  if (v === "") return { ok: true, value: null };
  const n = Number(v);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    return { ok: false, error: "Must be a positive integer" };
  }
  return { ok: true, value: n };
}

export default function PasteForm({ onCreate, loading }) {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const validation = useMemo(() => {
    const errors = {};

    if (content.trim().length === 0) {
      errors.content = "Paste content is required";
    }

    const ttlParsed = parseOptionalPositiveInt(ttlSeconds);
    if (!ttlParsed.ok) {
      errors.ttlSeconds = ttlParsed.error;
    }

    const mvParsed = parseOptionalPositiveInt(maxViews);
    if (!mvParsed.ok) {
      errors.maxViews = mvParsed.error;
    }

    return {
      ok: Object.keys(errors).length === 0,
      errors,
      value: {
        content,
        ttlSeconds: ttlParsed.ok ? ttlParsed.value : null,
        maxViews: mvParsed.ok ? mvParsed.value : null
      }
    };
  }, [content, ttlSeconds, maxViews]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-end justify-between">
          <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Paste</label>
          <span className="text-xs text-slate-500">{content.length}/200000</span>
        </div>
        <textarea
          className={
            "min-h-[260px] w-full resize-y rounded-xl border bg-white px-4 py-3 font-mono text-sm leading-6 text-slate-900 outline-none transition dark:bg-slate-900 dark:text-slate-100 " +
            (validation.errors.content
              ? "border-rose-500/70 focus:border-rose-500"
              : "border-slate-200 focus:border-slate-400 dark:border-slate-800 dark:focus:border-slate-600")
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your text here..."
        />
        {validation.errors.content ? (
          <div className="text-xs text-rose-400">{validation.errors.content}</div>
        ) : null}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="text-left text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center"
        >
          {showAdvanced ? (
            <>
              <ChevronUp className="mr-2" /> Hide advanced options
            </>
          ) : (
            <>
              <ChevronDown className="mr-2" /> Show advanced options
            </>
          )}
        </button>

        {showAdvanced ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="TTL (seconds)"
              hint="Optional"
              value={ttlSeconds}
              onChange={(e) => setTtlSeconds(e.target.value)}
              placeholder="e.g. 3600"
              inputMode="numeric"
              error={validation.errors.ttlSeconds}
            />
            <InputField
              label="Max views"
              hint="Optional"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              placeholder="e.g. 10"
              inputMode="numeric"
              error={validation.errors.maxViews}
            />
          </div>
        ) : null}
      </div>

      <button
        type="button"
        disabled={!validation.ok || loading}
        onClick={() => onCreate(validation.value)}
        className={
          "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition " +
          (!validation.ok || loading
            ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            : "bg-blue-600 text-white hover:bg-blue-500")
        }
      >
        {loading ? "Creating..." : "Create Paste"}
      </button>
    </div>
  );
}
