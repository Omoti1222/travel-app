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
  const v = sp.get("return");
  if (!v) return fallback;
  try {
    return decodeURIComponent(v);
  } catch {
    return fallback;
  }
}
