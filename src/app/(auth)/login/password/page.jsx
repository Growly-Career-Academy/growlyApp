"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import Button from "@/components/Button";
import PassInput from "@/components/inputs/PassInput";
import NumInput from "@/components/inputs/NumInput";

// Force dynamic rendering to avoid build errors with useSearchParams
export const dynamic = 'force-dynamic';

function LoginPasswordContent() {
  const router = useRouter();


  // state ها
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // برای دکمه "ورود"
  const [forgotLoading, setForgotLoading] = useState(false); // برای "فراموشی رمز"
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      const savedPhone = localStorage.getItem("phone");
      if (savedPhone) {
        setPhone(savedPhone);
      }
    } catch { }
  }, []);

  // --- ۱) لاگین با پسورد ---
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
  
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/auth/password/login/`;
  
      // 👇 برای دیباگ: ببین چی داری می‌فرستی
      console.log("LOGIN REQUEST =>", {
        url,
        body: { phone: normalizedPhone, password },
      });
  
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          password,
        }),
      });
  
      const text = await res.text();
      console.log("LOGIN RESPONSE =>", res.status, text);
  
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {}
  
      if (!res.ok) {
        // 👇 متن دقیق خطا از بک
        throw new Error(
          data?.message ||
            data?.detail ||
            data?.error ||
            "ورود ناموفق بود"
        );
      }
  
      if (data?.token) {
        localStorage.setItem("authToken", data.token);
      }
  
      router.push("/Domain");
    } catch (e) {
      console.error("LOGIN ERROR:", e);
      setErr(e.message || "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }
  

  // --- ۲) فراموشی رمز عبور ---
  // این تابع اول به بک میگه "برای این شماره OTP بفرست"
  // بعد کاربر رو می‌فرسته به صفحه‌ی OTP مخصوص فراموشی رمز
  async function handleForgot() {
    setErr("");

    const normalizedPhone = phone.replace(/\D/g, "");
    if (!normalizedPhone) {
      setErr("اول شماره موبایل رو وارد کن");
      return;
    }

    try {
      setForgotLoading(true);

      // مستقیم می‌زنیم به بک‌اند خارجی (نه route داخلی)
      // چون این فقط OTP می‌فرسته و هنوز توکنی لازم نیست.
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/password/forgot/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            phone: normalizedPhone,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("forgot failed", text);
        setErr("ارسال کد تایید ناموفق بود");
        setForgotLoading(false);
        return;
      }

      // موفق بود → بفرستش صفحه OTP
      setForgotLoading(false);

      router.push(
        `/forgot-password/otp?phone=${encodeURIComponent(
          normalizedPhone
        )}`
      );
    } catch (err) {
      console.error("network error (forgot):", err);
      setErr("خطای شبکه در ارسال کد تایید");
      setForgotLoading(false);
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
        {/* هدر */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-medium text-gray-800 mb-2">
            رمز عبور خودت رو وارد کن
          </h1>
        </div>

        {/* فرم ورود */}
        <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
          {/* شماره موبایل */}
          <NumInput
            value={phone}
            onChange={(e) => {
              // فقط عدد نگه‌دار
              setPhone(e.target.value.replace(/\D/g, ""));
            }}
            onEdit={() => router.push("/login")}
          />

          {/* پسورد */}
          <PassInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          {/* خطا */}
          {err && (
            <p className="text-red-600 text-xs text-center mt-1">
              {err}
            </p>
          )}

          {/* دکمه ورود */}
          <Button
            className="mt-4"
            type="submit"
            disabled={loading}
          >
            {loading ? "در حال ورود..." : "ورود"}
          </Button>

          {/* فراموشی رمز عبور */}
          <button
            type="button"
            onClick={handleForgot}
            className="text-blue-600 text-xs text-center mt-2 disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={forgotLoading}
          >
            {forgotLoading
              ? "در حال ارسال کد..."
              : "فراموشی رمز عبور"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPasswordPage() {
  return (
    <Suspense fallback={
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
    }>
      <LoginPasswordContent />
    </Suspense>
  );
}
