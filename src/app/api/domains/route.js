// GET /api/domains
// این پراکسی می‌زنه به بک: GET {API_BASE}/domains/
// و کوکی auth_token رو به Authorization تبدیل می‌کنه

import { cookies } from "next/headers";

export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE; // مثلا https://api.growly.ir/api/v1

    // توکن رو از کوکی کاربر بخون
    const token = cookies().get("auth_token")?.value;
    console.log("[/api/domains] has token?", Boolean(token)); // فقط برای dev
    // هدرها رو بساز
    const headers = {
      Accept: "application/json",
    };

    // اگه توکن داریم، بفرستیمش برای بک
    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    // درخواست به بک
    const upstream = await fetch(`${base}/domains/`, {
      method: "GET",
      headers,
      // credentials لازم نیست اینجا چون این fetch روی سرور Next اجرا میشه
    });

    // متن خام رو برای دیباگ هم نگه می‌داریم
    const text = await upstream.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    if (!upstream.ok) {
      console.error(
        "[api/domains] backend error:",
        upstream.status,
        text
      );
      return new Response(
        JSON.stringify({
          ok: false,
          status: upstream.status,
          message: "backend refused (domains)",
        }),
        {
          status: upstream.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // بک طبق مستند می‌گه خروجی‌اش یه آرایه مثل:
    // [
    //   { id, name, slug, description },
    //   ...
    // ]
    // ما برای کلاینت یه شکل ثابت می‌دیم:
    return new Response(
      JSON.stringify({
        ok: true,
        domains: Array.isArray(json) ? json : [],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("[api/domains] proxy crashed:", err);
    return new Response(
      JSON.stringify({
        ok: false,
        message: "proxy crashed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
