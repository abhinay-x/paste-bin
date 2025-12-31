// In production on Vercel, default to relative base so requests go to the same domain
// Locally, you can set VITE_API_BASE_URL=http://localhost:8080 to point to the dev server
const rawBase = import.meta.env.VITE_API_BASE_URL || "";

function trimTrailingSlash(s) {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

const baseUrl = trimTrailingSlash(rawBase);

async function request(path, options) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      "content-type": "application/json",
      ...(options?.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error === "not_found") msg = "Paste not found or expired";
      else if (body?.error === "validation_error") msg = "Validation error";
    } catch {

    }
    throw new Error(msg);
  }

  return res.json();
}

export const api = {
  baseUrl,
  async createPaste({ content, ttlSeconds, maxViews }) {
    return request("/api/pastes", {
      method: "POST",
      body: JSON.stringify({ content, ttl_seconds: ttlSeconds, max_views: maxViews })
    });
  },
  async getPaste(id) {
    const raw = await request(`/api/pastes/${encodeURIComponent(id)}`, {
      method: "GET"
    });
    return {
      ...raw,
      remainingViews: raw.remaining_views,
      expiresAt: raw.expires_at
    };
  }
};
