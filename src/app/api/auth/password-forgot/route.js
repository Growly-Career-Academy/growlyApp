// src/app/api/auth/password-forgot/route.js
export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return Response.json(
        { message: "phone لازم است" },
        { status: 400 }
      );
    }

    const upstream = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/auth/password/forgot/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ phone }),
      }
    );

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return Response.json(
        {
          message:
            data?.message ||
            data?.detail ||
            data?.error ||
            `password/forgot failed (${upstream.status})`,
        },
        { status: upstream.status }
      );
    }

    return Response.json(
      { ok: true, detail: data.detail },
      { status: 200 }
    );
  } catch (err) {
    console.error("proxy /api/auth/password-forgot error:", err);
    return Response.json(
      { message: "proxy request failed" },
      { status: 500 }
    );
  }
}
