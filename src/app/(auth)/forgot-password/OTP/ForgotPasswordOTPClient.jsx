"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function ForgotPasswordOTPClient() {
  const router = useRouter();

  // شماره موبایل از localStorage
  const [phone, setPhone] = useState("");
  const normalizedPhone = (phone || "").replace(/\D/g, "");

  const [digits, setDigits] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef([]);

  // خواندن شماره از localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("phone");
      if (stored) {
        setPhone(stored);
      }
    } catch {}
  }, []);

  // شروع cooldown اولیه (برای کدی که صفحه قبل فرستاده)
  useEffect(() => {
    setCooldown(120); // ۲ دقیقه
  }, []);

  // تایمر برای کم شدن countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  function handleChangeDigit(i, raw) {
    const v = raw.replace(/\D/g, "").slice(0, 1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v && i < 5) {
      inputsRef.current[i + 1]?.focus();
    }
  }

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

  async function handleResend() {
    if (!normalizedPhone) return;
    if (cooldown > 0) return;

    setResendLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/password-forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      const text = await res.text();

      if (!res.ok) {
        console.error("[Forgot OTP] resend failed:", text);
        if (res.status === 429) {
          setErrorMsg(
            "به دلیل درخواست‌های متعدد، تا حدود ۳۰ دقیقه امکان ارسال مجدد کد وجود ندارد."
          );
        } else {
          setErrorMsg("ارسال مجدد کد ناموفق بود");
        }
        return;
      }

      setErrorMsg("");
      setCooldown(120);
    } catch (err) {
      console.error("[Forgot OTP] resend network error:", err);
      setErrorMsg("خطای شبکه در ارسال مجدد کد");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] grid place-items-center bg-white">
      <section className="w-full max-w-md px-6">
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

          {errorMsg && (
            <p className="text-red-600 text-xs text-center">{errorMsg}</p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "در حال بررسی..." : "تایید"}
          </Button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || cooldown > 0}
            className={`block mx-auto text-xs ${
              resendLoading || cooldown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600"
            }`}
          >
            {resendLoading
              ? "در حال ارسال..."
              : cooldown > 0
              ? ` ارسال مجدد ${cooldown}`
              : "دریافت مجدد کد"}
          </button>
        </form>
      </section>
    </div>
  );
}
