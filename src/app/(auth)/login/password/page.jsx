"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Button from "@/components/Button";
import PassInput from "@/components/inputs/PassInput";
import NumInput from "@/components/inputs/NumInput";

function LoginPasswordContent() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      const savedPhone = localStorage.getItem("phone");
      if (savedPhone) setPhone(savedPhone);
    } catch {}
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    const normalizedPhone = phone.replace(/\D/g, "");

    if (!normalizedPhone || !password) {
      setErr("شماره و رمز عبور را کامل وارد کن");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/password-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // پیام برگشتی بک را نمایش بده
        setErr(
          data?.message || data?.detail || data?.error || "ورود ناموفق بود"
        );
        return;
      }

      // شماره را نگه می‌داریم (برای مراحل بعد)
      try {
        localStorage.setItem("phone", normalizedPhone);
      } catch {}

      router.push("/onboarding/domain");
    } catch (e) {
      console.error("LOGIN ERROR:", e);
      setErr(e?.message || "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot() {
    setErr("");

    const normalizedPhone = phone.replace(/\D/g, "");
    if (!normalizedPhone) {
      setErr("اول شماره موبایل رو وارد کن");
      return;
    }

    try {
      localStorage.setItem("phone", normalizedPhone);
    } catch {}

    try {
      setForgotLoading(true);

      // ✅ به روت داخلی خودمون
      const res = await fetch("/api/auth/password-forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(
          data?.message || data?.detail || data?.error || "ارسال کد تایید ناموفق بود"
        );
        return;
      }

      router.push("/forgot-password/OTP");
    } catch (e) {
      console.error("network error (forgot):", e);
      setErr("خطای شبکه در ارسال کد تایید");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-xl font-medium text-gray-800 mb-2">
            رمز عبور خودت رو وارد کن
          </h1>
        </div>

        <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
          <NumInput
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            onEdit={() => router.push("/login")}
          />

          <PassInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          {err && (
            <p className="text-red-600 text-xs text-center mt-1">{err}</p>
          )}

          <Button className="mt-4" type="submit" disabled={loading}>
            {loading ? "در حال ورود..." : "ورود"}
          </Button>

          <button
            type="button"
            onClick={handleForgot}
            className="text-blue-600 text-xs text-center mt-2 disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={forgotLoading}
          >
            {forgotLoading ? "در حال ارسال کد..." : "فراموشی رمز عبور"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
          <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
            <div className="text-center mb-8">
              <h1 className="text-xl font-medium text-gray-800 mb-2">
                رمز عبور خودت رو وارد کن
              </h1>
            </div>
            <div className="w-full">در حال بارگذاری...</div>
          </div>
        </div>
      }
    >
      <LoginPasswordContent />
    </Suspense>
  );
}
