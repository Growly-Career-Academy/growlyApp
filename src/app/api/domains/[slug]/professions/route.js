// src/app/api/domains/[slug]/professions/route.js
import { cookies } from "next/headers";

export async function GET(_req, { params }) {
  try {
    const { slug } = params; // domain_slug
    if (!slug) {
      return new Response(
        JSON.stringify({ message: "domain slug لازم است" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const base = process.env.NEXT_PUBLIC_API_BASE; // مثلا https://api.growly.ir/api/v1
    if (!base) {
      return new Response(
        JSON.stringify({ message: "API base not set" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ توکن را از کوکی بخوان
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const upstream = await fetch(
      `${base.replace(/\/$/, "")}/domains/${encodeURIComponent(slug)}/professions/`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}), // DRF TokenAuthentication
        },
        cache: "no-store",
      }
    );

    const text = await upstream.text().catch(() => "");
    if (!upstream.ok) {
      return new Response(
        JSON.stringify({
          message: "professions upstream failed",
          status: upstream.status,
          raw: text,
        }),
        { status: upstream.status, headers: { "Content-Type": "application/json" } }
      );
    }

    let data = [];
    try {
      data = JSON.parse(text);
    } catch {}

    // نرمال‌سازی برای UI
    const normalized = Array.isArray(data)
      ? data.map((p) => ({
          id: p.id,
          title: p.name ?? "",
          description: p.description ?? "",
          slug: p.slug ?? "",
          icon: null, // فعلاً بک آیکون نداده
        }))
      : [];

    return new Response(JSON.stringify({ professions: normalized }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET /api/domains/[slug]/professions error:", err);
    return new Response(JSON.stringify({ message: "server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
