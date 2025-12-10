"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function SignupOTPClient({ flow = "signup" }) {
  const router = useRouter();

  const LENGTH = 6;
  const [vals, setVals] = useState(Array(LENGTH).fill("")); // کد
  const [sec, setSec] = useState(90); // تایمر resend
  const [loadingVerify, setLoadingVerify] = useState(false); // لودینگ تایید
  const [loadingResend, setLoadingResend] = useState(false); // لودینگ ارسال مجدد
  const [err, setErr] = useState(""); // پیام خطا
  const inputsRef = useRef([]);

  // 👇 شماره را از localStorage بگیر
  const [phone, setPhone] = useState("");
  useEffect(() => {
    try {
      const stored = localStorage.getItem("phone");
      if (stored) setPhone(stored);
    } catch {}
  }, []);

  const normalizedPhone = (phone || "").replace(/\D/g, "");
  const code = vals.join("");
  const canSubmit = code.length === LENGTH && !loadingVerify;

  // تایمر شمارش معکوس
  useEffect(() => {
    if (sec <= 0) return;
    const id = setInterval(() => setSec((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [sec]);

  // پر کردن هر خونه OTP
  const setAt = (i, v) => {
    const digit = v.replace(/\D/g, "").slice(0, 1);
    setVals((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < LENGTH - 1) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  // Backspace بره خونه قبلی اگه خالی باشه
  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !vals[i] && i > 0) {
      setVals((prev) => {
        const next = [...prev];
        next[i - 1] = "";
        return next;
      });
      inputsRef.current[i - 1]?.focus();
    }
  };

  // Paste یک‌جا کل کد
  const onPaste = (e) => {
    e.preventDefault();
    const digits = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, LENGTH);

    if (!digits) return;

    const next = digits.split("");
    while (next.length < LENGTH) next.push("");

    setVals(next);
    inputsRef.current[Math.min(digits.length, LENGTH - 1)]?.focus();
  };

  // --- تأیید کد OTP (verify) ---
  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoadingVerify(true);
    setErr("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          code,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("[SignupOTPClient] verify failed body:", data);
        throw new Error(
          data?.message ||
            data?.detail ||
            data?.error ||
            "کد تایید اشتباهه"
        );
      }

      // لاجیک بعد از تایید کد:
      // الان ما کاری که می‌خوایم انجام بدیم اینه:
      // اگر flow === "forgot-password" بفرست به صفحه‌ای که پسورد جدید رو می‌گیره
      // اگر flow === "signup" بفرست به صفحه ست کردن پسورد اولیه
      //
      // توجه: تو گفتی دیگه confirm password نداریم، پس مستقیم میریم همون صفحه انتخاب پسورد
      //
      if (flow === "forgot-password") {
        router.push(
          `/forgot-password?phone=${encodeURIComponent(normalizedPhone)}`
        );
      } else {
        router.push(
          `/signup/PassWord?phone=${encodeURIComponent(normalizedPhone)}`
        );
      }
    } catch (e) {
      setErr(e.message || "خطای تایید کد");
    } finally {
      setLoadingVerify(false);
    }
  };

  // --- ارسال مجدد کد ---
  const handleResend = async () => {
    if (sec > 0 || loadingResend) return;
    setLoadingResend(true);
    setErr("");

    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("[SignupOTPClient] resend failed:", data);
        throw new Error(
          data?.message ||
            data?.detail ||
            data?.error ||
            "ارسال مجدد ناموفق بود"
        );
      }

      // شروع دوباره تایمر
      setSec(90);
    } catch (e) {
      setErr(e.message || "خطا در ارسال مجدد");
    } finally {
      setLoadingResend(false);
    }
  };

  return (
    <form onSubmit={handleSubmitOTP} className="space-y-6">
      {/* نمایش شماره اگر پیدا شد */}
      {normalizedPhone && (
        <p className="text-center mt-5 text-sm text-[#595959]">
          کد تایید برای شماره{" "}
          <span dir="ltr" className="font-medium text-[#141414]">
            {normalizedPhone}
          </span>{" "}
          پیامک شد
        </p>
      )}
      {/* ورودی‌های OTP */}
      <div
        className="flex justify-center gap-2"
        dir="ltr"
        onPaste={onPaste}
      >
        {vals.map((v, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            value={v}
            maxLength={1}
            inputMode="numeric"
            onChange={(e) => setAt(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            className="
              w-13 h-13 text-center text-lg
              border-2 border-gray-200 rounded-xl outline-none bg-white
              focus:border-growly-green transition-colors
            "
          />
        ))}
      </div>

      {/* خطا */}
      {err && (
        <p className="text-red-600 text-xs text-center">{err}</p>
      )}

      {/* تایید */}
      <Button type="submit" disabled={!canSubmit || loadingVerify}>
        {loadingVerify ? "در حال بررسی..." : "تایید"}
      </Button>

      {/* ارسال مجدد */}
      <button
        type="button"
        onClick={handleResend}
        disabled={sec > 0 || loadingResend}
        className={`block mx-auto text-xs ${
          sec > 0 || loadingResend
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-600"
        }`}
      >
        {sec > 0
          ? `ارسال مجدد کد (${sec})`
          : loadingResend
          ? "در حال ارسال..."
          : "دریافت مجدد کد"}
      </button>
    </form>
  );
}
