"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import Button from "@/components/Button";
import Input from "@/components/inputs/Input";
import PassInput from "@/components/inputs/PassInput";

function extractApiMessage(data, fallback) {
  if (!data) return fallback;

  // اگر بک field error بده مثل { new_password: ["too short"] }
  if (typeof data === "object") {
    const firstFieldError = Object.values(data)
      .flat()
      .find((x) => typeof x === "string");
    if (firstFieldError) return firstFieldError;
  }

  return data?.message || data?.detail || data?.error || fallback;
}

function ForgotPasswordContent() {
  const router = useRouter();
  const search = useSearchParams();

  const queryPhone = useMemo(
    () => (search.get("phone") || "").replace(/\D/g, ""),
    [search]
  );
  const queryCode = useMemo(
    () => (search.get("code") || "").replace(/\D/g, ""),
    [search]
  );

  const isOTPVerified = useMemo(
    () => !!queryPhone && !!queryCode,
    [queryPhone, queryCode]
  );

  // شماره برای مرحله اول (گرفتن شماره) و نمایش
  const [phone, setPhone] = useState(queryPhone);
  // رمز جدید
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ✅ اگر query دیرتر رسید، state هم آپدیت بشه
  useEffect(() => {
    if (queryPhone) setPhone(queryPhone);
  }, [queryPhone]);

  // مرحله اول: گرفتن شماره و رفتن به OTP
  async function handlePhoneSubmit(e) {
    e.preventDefault();
    setErr("");

    const normalized = (phone || "").replace(/\D/g, "");
    if (!normalized) {
      setErr("شماره موبایل لازم است");
      return;
    }

    // ✅ برای اینکه OTP page همیشه شماره داشته باشه
    try {
      localStorage.setItem("phone", normalized);
    } catch {}

    router.push(`/forgot-password/OTP?phone=${encodeURIComponent(normalized)}`);
  }

  // مرحله دوم: ست کردن رمز جدید
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setErr("");

    const normalizedPhone = (queryPhone || phone || "").replace(/\D/g, "");
    const normalizedCode = (queryCode || "").replace(/\D/g, "");

    if (!normalizedPhone) {
      setErr("شماره موبایل نامعتبر است");
      return;
    }
    if (!normalizedCode || normalizedCode.length !== 6) {
      setErr("کد ۶ رقمی معتبر نیست");
      return;
    }
    if (!password) {
      setErr("رمز عبور جدید لازم است");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          code: normalizedCode,
          new_password: password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(extractApiMessage(data, "تغییر رمز ناموفق بود"));
        return;
      }

      // موفق → برو لاگین با پسورد
      router.replace(
        `/login/password?phone=${encodeURIComponent(normalizedPhone)}`
      );
    } catch (e) {
      setErr(e?.message || "خطای شبکه");
    } finally {
      setLoading(false);
    }
  }

  // ---------- اگر phone و code داریم: فرم پسورد جدید ----------
  if (isOTPVerified) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
        <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
          <div className="text-center mb-8">
            <h1 className="text-xl font-medium text-foreground mb-6">
              بازیابی رمز عبور
            </h1>
            <p className="text-sm font-medium text-foreground">
              رمز عبور جدید خودت رو وارد کن
            </p>
          </div>

          <form className="w-full flex flex-col gap-6" onSubmit={handlePasswordSubmit}>
            <PassInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            {err && <p className="text-red-600 text-xs text-center">{err}</p>}

            <Button type="submit" disabled={loading}>
              {loading ? "در حال ذخیره..." : "ذخیره رمز جدید"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ---------- مرحله گرفتن شماره ----------
  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-xl font-medium color-foreground mb-4">
            فراموشی رمز عبور
          </h1>
          <p className="text-[#595959] text-xs leading-[20px]">
            شماره موبایل خودت رو وارد کن تا<br />
            کد تایید برات ارسال بشه
          </p>
        </div>

        <form className="w-full flex flex-col gap-4" onSubmit={handlePhoneSubmit}>
          <div className="text-right">
            <label className="text-sm font-medium block mb-2 text-center">
              شماره موبایل خودت رو وارد کن
            </label>

            <Input
              type="tel"
              placeholder="0912..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>

          {err && <p className="text-red-600 text-xs text-center">{err}</p>}

          <Button type="submit">ارسال کد تایید</Button>
        </form>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
          <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
            <div className="text-center mb-8">
              <h1 className="text-xl font-medium color-foreground mb-4">
                فراموشی رمز عبور
              </h1>
            </div>
            <div className="w-full">در حال بارگذاری...</div>
          </div>
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
