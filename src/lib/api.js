// src/lib/api.js
const BASE = process.env.NEXT_PUBLIC_API_BASE;

// یک تابع کمکی برای همهٔ درخواست‌ها
export async function apiFetch(
  path,
  { method = "GET", headers = {}, body, token } = {}
) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      // برای FormData خودش ست نکن
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body:
      body instanceof FormData
        ? body
        : body
        ? JSON.stringify(body)
        : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
