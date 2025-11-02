// src/app/api/auth/password-login/route.js
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

    const base = process.env.NEXT_PUBLIC_API_BASE; // e.g. https://api.growly.ir/api/v1
    const upstream = await fetch(`${base}/auth/password/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ phone, password }),
    });

    const text = await upstream.text();
    let data; try { data = JSON.parse(text); } catch { data = {}; }

    if (!upstream.ok) {
      const message = data?.message || data?.detail || data?.error || "Login failed";
      return NextResponse.json({ message }, { status: upstream.status });
    }

    const token =
      data?.token || data?.access || data?.access_token || data?.jwt || data?.authentication_token;

    if (!token) {
      return NextResponse.json({ message: "no token in upstream login response" }, { status: 500 });
    }

    // ✅ ست‌کردن کوکی روی پاسخِ Next
    const res = NextResponse.json({ ok: true });
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (err) {
    console.error("[password-login] proxy crash:", err);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
