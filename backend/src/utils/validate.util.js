function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function parseOptionalPositiveInt(v) {
  if (v === null || v === undefined || v === "") return null;

  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    return { error: "must_be_positive_integer" };
  }
  return n;
}

export function validateCreatePasteBody(body) {
  const errors = {};

  if (!isNonEmptyString(body?.content)) {
    errors.content = "required";
  } else if (body.content.length > 200_000) {
    errors.content = "too_large";
  }

  const ttlSeconds = parseOptionalPositiveInt(body?.ttl_seconds);
  if (ttlSeconds && typeof ttlSeconds === "object") {
    errors.ttl_seconds = ttlSeconds.error;
  }

  const maxViews = parseOptionalPositiveInt(body?.max_views);
  if (maxViews && typeof maxViews === "object") {
    errors.max_views = maxViews.error;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      content: body.content,
      ttl_seconds: ttlSeconds ?? null,
      max_views: maxViews ?? null
    }
  };
}
