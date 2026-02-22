export function getString(
  sp: URLSearchParams,
  key: string,
  fallback = "",
): string {
  return sp.get(key) ?? fallback;
}

export function getInt(
  sp: URLSearchParams,
  key: string,
  fallback: number,
): number {
  const raw = sp.get(key);
  if (raw == null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function getIntMin(
  sp: URLSearchParams,
  key: string,
  fallback: number,
  min: number,
): number {
  const n = getInt(sp, key, fallback);
  return Math.max(min, n);
}

export function getEnum<T extends string>(
  sp: URLSearchParams,
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  const v = sp.get(key);
  return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

export function getReturnTo(
  sp: URLSearchParams,
  fallback = "/results",
): string {
  const v = sp.get("returnTo");
  if (!v) return fallback;

  let decoded = "";
  try {
    decoded = decodeURIComponent(v);
  } catch {
    return fallback;
  }

  if (!decoded.startsWith("/")) return fallback;

  if (decoded.startsWith("//")) return fallback;

  const allowedPrefixes = ["/results", "/plan", "/book", "/"];
  const ok = allowedPrefixes.some(
    (p) =>
      decoded === p ||
      decoded.startsWith(p + "?") ||
      decoded.startsWith(p + "/"),
  );
  if (!ok) return fallback;

  return decoded;
}

export function setParam(
  sp: URLSearchParams,
  setSp: (next: URLSearchParams) => void,
  key: string,
  value: string | null,
) {
  const next = new URLSearchParams(sp);
  if (value == null || value === "") next.delete(key);
  else next.set(key, value);
  setSp(next);
}

export function setParams(
  sp: URLSearchParams,
  setSp: (next: URLSearchParams) => void,
  patch: Record<string, string | null>,
) {
  const next = new URLSearchParams(sp);
  for (const [k, v] of Object.entries(patch)) {
    if (v == null || v === "") next.delete(k);
    else next.set(k, v);
  }
  setSp(next);
}
