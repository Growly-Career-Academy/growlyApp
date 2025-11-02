// src/app/api/auth/password-register/route.js
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return Response.json(
        { message: "phone و password لازم است" },
        { status: 400 }
      );
    }

    const upstream = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/auth/password/register/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ phone, password }),
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
            "Password register failed",
        },
        { status: upstream.status }
      );
    }

    // این endpoint ظاهراً فقط detail می‌ده و لزوماً token نمی‌ده.
    // پس اینجا احتمالا هنوز لاگین نشده.
    return Response.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("proxy /api/auth/password-register error:", e);
    return Response.json(
      { message: "server error" },
      { status: 500 }
    );
  }
}
