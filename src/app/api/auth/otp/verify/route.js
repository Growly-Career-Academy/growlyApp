import { cookies } from "next/headers";

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

    // این دقیقا همون نقطه‌ایه که باعث 401 تو /api/domains شده بود 👇
    if (token) {
      const isProd = process.env.NODE_ENV === "production";

      cookies().set({
        name: "auth_token",
        value: token,

        // با این فلگ httpOnly، جاوااسکریپت فرانت نمی‌تونه کوکی رو بخونه (امنیت)
        httpOnly: true,

        // همون رفتار قبلی: اجازه بده توی ناوبری‌های معمول ارسال بشه
        sameSite: "lax",

        // تغییر اصلی:
        // قبلاً همیشه true بود → روی localhost (http) مرورگر کوکی رو attach نمی‌کرد
        // الان فقط روی پرود true می‌ذاریم
        secure: isProd,

        // برای کل سایت معتبره
        path: "/",

        // 7 روز
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    // جواب استاندارد خودمون برای فرانت
    return Response.json(
      {
        ok: true,
        hasToken: !!token, // برای دیباگ
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("[/api/auth/otp/verify] crashed:", e);
    return Response.json(
      { message: "server error" },
      { status: 500 }
    );
  }
}
