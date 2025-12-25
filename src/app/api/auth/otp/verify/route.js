import { NextResponse } from "next/server";
// POST /api/auth/otp/verify
// body: { phone, code }
// این روت:
// 1. می‌فرسته به بک /auth/otp/verify/
// 2. اگر موفق بود token رو از پاسخ می‌گیره
// 3. همون‌جا کوکی auth_token رو ست می‌کنه (که بعداً برای /api/domains و غیره استفاده می‌کنیم)

export async function POST(req) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return Response.json(
        { message: "phone و code لازم است" },
        { status: 400 }
      );
    }

    const base = process.env.NEXT_PUBLIC_API_BASE;

    // درخواست به بک
    const upstream = await fetch(`${base}/auth/otp/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ phone, code }),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const message =
        data?.message ||
        data?.detail ||
        data?.error ||
        `OTP verify failed (${upstream.status})`;

      return Response.json({ message }, { status: upstream.status });
    }

    // طبق مستند بک‌اند جدید:
    // /auth/otp/verify/ وقتی موفق باشه 200 برمی‌گردونه با { token: "..." }
    // ولی برای اطمینان همه اسامی ممکن رو چک می‌کنیم
    const token =
      data?.token ||
      data?.access ||
      data?.access_token ||
      data?.jwt ||
      data?.authentication_token;

    const res = NextResponse.json(
      { ok: true, hasToken: !!token },
      { status: 200 }
    );

    if (token) {
      const isProd = process.env.NODE_ENV === "production";
      res.cookies.set("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return res;
  } catch (e) {
    console.error("[/api/auth/otp/verify] crashed:", e);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
