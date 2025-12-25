// src/app/api/auth/password-register/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { message: "phone و password لازم است" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    // اگر OTP verify انجام نشده باشد، طبیعی‌ست که Invalid credentials بخوری
    if (!token) {
      return NextResponse.json(
        { message: "ابتدا کد OTP را تایید کن (توکن یافت نشد)" },
        { status: 401 }
      );
    }

    const base = process.env.NEXT_PUBLIC_API_BASE;

    const upstream = await fetch(`${base}/auth/password/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ phone, password }),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        {
          message:
            data?.message ||
            data?.detail ||
            data?.error ||
            `Password register failed (${upstream.status})`,
        },
        { status: upstream.status }
      );
    }

    // اگر بک احیاناً توکن جدید برگرداند، کوکی را آپدیت کن (اختیاری ولی مفید)
    const newToken =
      data?.token || data?.access || data?.access_token || data?.jwt;

    const res = NextResponse.json({ ok: true }, { status: 200 });

    if (newToken) {
      res.cookies.set("auth_token", newToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return res;
  } catch (e) {
    console.error("proxy /api/auth/password-register error:", e);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
