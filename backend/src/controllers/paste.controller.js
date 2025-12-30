import { nanoid } from "nanoid";

import { Paste } from "../models/paste.model.js";
import { escapeHtml } from "../utils/escape.util.js";
import { getCurrentTime } from "../utils/time.util.js";
import { validateCreatePasteBody } from "../utils/validate.util.js";

function buildActivePasteQuery({ id, now }) {
  return {
    _id: id,
    $and: [
      {
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
      },
      {
        $or: [
          { maxViews: null },
          {
            $expr: {
              $lt: ["$viewCount", "$maxViews"]
            }
          }
        ]
      }
    ]
  };
}

async function fetchPasteAndIncrementView({ id, now }) {
  const query = buildActivePasteQuery({ id, now });

  return Paste.findOneAndUpdate(query, { $inc: { viewCount: 1 } }, { new: true });
}

export async function createPaste(req, res) {
  const now = getCurrentTime(req);
  const validated = validateCreatePasteBody(req.body);

  if (!validated.ok) {
    return res.status(400).json({ error: "validation_error", details: validated.errors });
  }

  const { content, ttlSeconds, maxViews } = validated.value;

  const id = nanoid(10);
  const expiresAt = ttlSeconds ? new Date(now.getTime() + ttlSeconds * 1000) : null;

  await Paste.create({
    _id: id,
    content,
    createdAt: now,
    expiresAt,
    maxViews,
    viewCount: 0
  });

  return res.status(201).json({ id });
}

export async function getPasteJson(req, res) {
  const now = getCurrentTime(req);
  const { id } = req.params;

  const paste = await fetchPasteAndIncrementView({ id, now });

  if (!paste) {
    return res.status(404).json({ error: "not_found" });
  }

  return res.json({
    id: paste._id,
    content: paste.content,
    createdAt: paste.createdAt,
    expiresAt: paste.expiresAt,
    maxViews: paste.maxViews,
    viewCount: paste.viewCount
  });
}

export async function getPasteHtml(req, res) {
  const now = getCurrentTime(req);
  const { id } = req.params;

  const paste = await fetchPasteAndIncrementView({ id, now });

  if (!paste) {
    res.status(404);
    res.setHeader("content-type", "text/html; charset=utf-8");
    return res.end("<!doctype html><html><body><h1>Paste not found</h1></body></html>");
  }

  const remainingViews =
    paste.maxViews === null ? null : Math.max(0, paste.maxViews - paste.viewCount);

  const safeContent = escapeHtml(paste.content);
  const safeExpires = paste.expiresAt ? escapeHtml(paste.expiresAt.toISOString()) : "";
  const safeRemaining = remainingViews === null ? "∞" : String(remainingViews);

  res.setHeader("content-type", "text/html; charset=utf-8");
  return res.end(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Paste ${escapeHtml(id)}</title>
    <style>
      body{margin:0;background:#0b1220;color:#e5e7eb;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial}
      .wrap{max-width:980px;margin:0 auto;padding:32px}
      .meta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;font-size:14px;color:#9ca3af}
      .badge{display:inline-block;padding:4px 10px;border-radius:999px;background:#111827;border:1px solid #1f2937}
      pre{white-space:pre-wrap;word-break:break-word;background:#0f172a;border:1px solid #1f2937;border-radius:12px;padding:16px;line-height:1.5;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}
      a{color:#93c5fd}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="meta">
        <span class="badge">Views: ${paste.viewCount}${paste.maxViews === null ? "" : ` / ${paste.maxViews}`}</span>
        <span class="badge">Remaining: ${safeRemaining}</span>
        ${paste.expiresAt ? `<span class="badge">Expires: ${safeExpires}</span>` : ""}
        <span class="badge"><a href="/api/pastes/${escapeHtml(id)}">JSON</a></span>
      </div>
      <pre>${safeContent}</pre>
    </div>
  </body>
</html>`);
}
