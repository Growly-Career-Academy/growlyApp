"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function ForgotPasswordOTPClient({ phone }) {
  const router = useRouter();

  // شماره تمیز شده فقط برای API
  const normalizedPhone = (phone || "").replace(/\D/g, "");

  // استیت‌های صفحه
  const [digits, setDigits] = useState(Array(6).fill("")); // ۶ رقم OTP
  const [loading, setLoading] = useState(false); // لودینگ دکمه "تایید"
  const [resendLoading, setResendLoading] = useState(false); // لودینگ "دریافت مجدد کد"
  const [errorMsg, setErrorMsg] = useState(""); // پیام خطا
  const inputsRef = useRef([]);

  // وقتی صفحه لود میشه: درخواست ارسال SMS (forgot-password OTP)
  useEffect(() => {
    async function sendInitialSMS() {
      if (!normalizedPhone) return;

      try {
        // این روت لوکال ماست → proxy به بک `/auth/password/forgot/`
        // body: { phone }
        await fetch("/api/auth/password-forgot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: normalizedPhone }),
        });
        // حتی اگر fail کنه، UI رو نشون می‌دیم
      } catch (err) {
        console.error("[Forgot OTP] initial send error:", err);
      }
    }

    sendInitialSMS();
  }, [normalizedPhone]);

  // تغییر هر خونه OTP
  function handleChangeDigit(i, raw) {
    const v = raw.replace(/\D/g, "").slice(0, 1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });

    // اگر چیزی وارد شد و هنوز به آخر نرسیدیم، فوکوس بعدی
    if (v && i < 5) {
      inputsRef.current[i + 1]?.focus();
    }
  }

  // Backspace روی خونه خالی → برگرد قبلی
  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      setDigits((prev) => {
        const next = [...prev];
        next[i - 1] = "";
        return next;
      });
      inputsRef.current[i - 1]?.focus();
    }
  }

  // Paste کل کد
  function handlePaste(e) {
    e.preventDefault();
    const pasted = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const arr = pasted.split("");
    while (arr.length < 6) arr.push("");

    setDigits(arr);
    inputsRef.current[Math.min(arr.length - 1, 5)]?.focus();
  }

  // دکمه تایید
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    const code = digits.join("");

    if (code.length !== 6) {
      setErrorMsg("کد ۶ رقمی رو کامل وارد کن");
      return;
    }
    if (!normalizedPhone) {
      setErrorMsg("شماره معتبر نیست");
      return;
    }

    setLoading(true);
    try {
      // طبق نیاز تو:
      // اینجا هنوز verify واقعی نمیزنیم
      // فقط میریم صفحه بعدی (forgot-password)
      // و phone + code رو با query میبریم
      router.push(
        `/forgot-password?phone=${encodeURIComponent(
          normalizedPhone
        )}&code=${encodeURIComponent(code)}`
      );
    } catch (err) {
      console.error("[Forgot OTP] submit error:", err);
      setErrorMsg("اشکال پیش اومد");
    } finally {
      setLoading(false);
    }
  }

  // دکمه "دریافت مجدد کد"
  async function handleResend() {
    if (!normalizedPhone) return;

    setResendLoading(true);
    setErrorMsg("");

    try {
      // همون api که اول صفحه هم صدا زدیم:
      // POST /api/auth/password-forgot  →  calls backend /auth/password/forgot/
      const res = await fetch("/api/auth/password-forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("[Forgot OTP] resend failed:", text);
        setErrorMsg("ارسال مجدد کد ناموفق بود");
      }
    } catch (err) {
      console.error("[Forgot OTP] resend network error:", err);
      setErrorMsg("خطای شبکه در ارسال مجدد کد");
    } finally {
      setResendLoading(false);
    }
  }

  // ---- UI ----
  return (
    <div className="min-h-[100dvh] grid place-items-center bg-white">
      <section className="w-full max-w-md px-6">
        {/* تیتر و توضیح مطابق دیزاین تو */}
        <h1 className="text-center text-xl font-medium text-[#141414] mb-2">
          کد تایید رو وارد کن
        </h1>

        <p className="text-center text-sm mb-6 mt-6">
          کد تایید برای شماره{" "}
          <span dir="ltr" className="font-medium text-[#141414]">
            {normalizedPhone}
          </span>{" "}
          پیامک شد
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* باکس های OTP */}
          <div
            className="flex justify-center gap-2"
            dir="ltr"
            onPaste={handlePaste}
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={d}
                maxLength={1}
                inputMode="numeric"
                onChange={(e) => handleChangeDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="
                  w-14 h-14 text-center text-lg
                  border-2 border-gray-200 rounded-xl outline-none bg-white
                  focus:border-growly-green transition-colors
                "
              />
            ))}
          </div>

          {/* پیام خطا */}
          {errorMsg && (
            <p className="text-red-600 text-xs text-center">{errorMsg}</p>
          )}

          {/* دکمه تایید */}
          <Button type="submit" disabled={loading}>
            {loading ? "در حال بررسی..." : "تایید"}
          </Button>

          {/* دکمه دریافت مجدد کد - از همون اول فعاله */}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className={`block mx-auto text-xs ${
              resendLoading
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600"
            }`}
          >
            {resendLoading ? "در حال ارسال..." : "دریافت مجدد کد"}
          </button>
        </form>
      </section>
    </div>
  );
}
