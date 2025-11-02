// src/app/api/auth/password-reset/route.js

export async function POST(req) {
  try {
    const { phone, code, new_password } = await req.json();

    if (!phone || !code || !new_password) {
      return Response.json(
        { message: "phone و code و new_password لازم است" },
        { status: 400 }
      );
    }

    const upstream = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/auth/password/reset/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          phone,
          code,
          new_password,
        }),
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
              `password reset failed (${upstream.status})`,
          },
          { status: upstream.status }
        );
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("proxy /api/auth/password-reset error:", err);
    return Response.json(
      { message: "server error" },
      { status: 500 }
    );
  }
}
