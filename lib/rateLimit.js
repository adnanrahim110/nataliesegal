import "server-only";

const buckets = new Map();
const MAX_BUCKETS = 10_000;

function nowMs() {
  return Date.now();
}

function pruneIfNeeded() {
  if (buckets.size <= MAX_BUCKETS) return;
  const toRemove = buckets.size - MAX_BUCKETS;
  let removed = 0;
  for (const key of buckets.keys()) {
    buckets.delete(key);
    removed += 1;
    if (removed >= toRemove) break;
  }
}

export function getClientIp(req) {
  const xff = req?.headers?.get?.("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim() || "unknown";
  const xri = req?.headers?.get?.("x-real-ip");
  if (xri) return xri.trim() || "unknown";
  return "unknown";
}

export function rateLimit(key, { limit, windowMs }) {
  const now = nowMs();
  const safeLimit = Math.max(1, Math.floor(Number(limit) || 1));
  const safeWindowMs = Math.max(1000, Math.floor(Number(windowMs) || 60_000));

  pruneIfNeeded();

  const current = buckets.get(key);
  if (!current || now >= current.resetAt) {
    const next = { count: 1, resetAt: now + safeWindowMs };
    buckets.set(key, next);
    return {
      allowed: true,
      remaining: safeLimit - 1,
      resetAt: next.resetAt,
      retryAfterMs: 0,
    };
  }

  const nextCount = current.count + 1;
  const allowed = nextCount <= safeLimit;
  const entry = { count: nextCount, resetAt: current.resetAt };

  // Move to the end to approximate LRU.
  buckets.delete(key);
  buckets.set(key, entry);

  const remaining = Math.max(0, safeLimit - nextCount);
  const retryAfterMs = allowed ? 0 : Math.max(0, entry.resetAt - now);

  return { allowed, remaining, resetAt: entry.resetAt, retryAfterMs };
}

