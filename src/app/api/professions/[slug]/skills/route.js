// src/app/api/professions/[slug]/skills/route.js
import { cookies } from "next/headers";

export async function GET(_req, { params }) {
  try {
    const { slug } = params;
    if (!slug) {
      return new Response(JSON.stringify({ message: "profession slug لازم است" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    const base = process.env.NEXT_PUBLIC_API_BASE;
    const token = cookies().get("auth_token")?.value;

    const upstream = await fetch(`${base}/professions/${slug}/skills/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return new Response(JSON.stringify({
        message: "skills upstream failed",
        status: upstream.status,
        raw: text,
      }), { status: upstream.status, headers: { "Content-Type": "application/json" }});
    }

    const data = await upstream.json().catch(() => []);
    const normalized = Array.isArray(data)
      ? data.map(s => ({
          id: s.id,
          title: s.name ?? "",
          description: s.description ?? "",
          slug: s.slug ?? "",
        }))
      : [];

    return new Response(JSON.stringify({ skills: normalized }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET /api/professions/[slug]/skills error:", err);
    return new Response(JSON.stringify({ message: "server error" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
