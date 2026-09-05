/**
 * Minimal rate-limit abstraction.
 *
 * The default store is in-memory. That is correct for local development and
 * acceptable for a low-traffic single-instance deployment, but it has a real
 * production limitation: on a serverless platform each instance keeps its own
 * counters, so the effective limit is (limit x number of warm instances) and
 * resets whenever an instance is recycled.
 *
 * To make it durable, implement `RateLimitStore` against Upstash Redis or any
 * Vercel KV-compatible client and pass it to `createRateLimiter`. Nothing else
 * needs to change.
 */

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the caller may retry. Only meaningful when blocked. */
  retryAfter: number;
  remaining: number;
};

export type RateLimitStore = {
  /** Records a hit and returns the timestamps still inside the window. */
  hit: (key: string, windowMs: number) => Promise<number[]> | number[];
};

/** Process-local sliding window. No dependency, no network call. */
export function createMemoryStore(): RateLimitStore {
  const buckets = new Map<string, number[]>();

  return {
    hit(key, windowMs) {
      const now = Date.now();
      const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
      recent.push(now);
      buckets.set(key, recent);

      // Cheap bound so a burst of unique keys cannot grow the map without limit.
      if (buckets.size > 10_000) {
        for (const [k, times] of buckets) {
          if (times.length === 0 || now - (times[times.length - 1] ?? 0) > windowMs) {
            buckets.delete(k);
          }
        }
      }
      return recent;
    },
  };
}

export function createRateLimiter({
  limit,
  windowMs,
  store = createMemoryStore(),
}: {
  limit: number;
  windowMs: number;
  store?: RateLimitStore;
}) {
  return async function check(key: string): Promise<RateLimitResult> {
    const hits = await store.hit(key, windowMs);
    const allowed = hits.length <= limit;
    const oldest = hits[0] ?? Date.now();
    const retryAfter = allowed ? 0 : Math.max(1, Math.ceil((windowMs - (Date.now() - oldest)) / 1000));

    return { allowed, retryAfter, remaining: Math.max(0, limit - hits.length) };
  };
}

/** Best-effort client identity from proxy headers. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";
  return ip;
}
