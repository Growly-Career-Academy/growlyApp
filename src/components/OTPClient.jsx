"use client";

import { useRef, useState } from "react";
import Button from "@/components/Button";

export default function OTPClient({
  length = 6,                // چند رقمیه کد
  loading,                   // لودینگ تایید کد از والد
  resendLoading,             // لودینگ ارسال مجدد از والد
  errorMessage,              // پیام خطا از والد
  onSubmit,                  // تابعی که والد برای تایید کد میده
  onResend,                  // تابعی که والد برای ارسال مجدد میده
}) {
  // استیت اعداد کد
  const [vals, setVals] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  // ست کردن هر رقم
  const setAt = (i, v) => {
    const digit = v.replace(/\D/g, "").slice(0, 1); // فقط یک رقم
    setVals((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });

    // اگر رقم وارد شد و خونه بعدی هست، فوکوس بره بعدی
    if (digit && i < length - 1) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  // بک‌اسپیس هوشمند: اگر این خونه خالیه و Backspace زد، برگرد خونه قبلی
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

  // اگر کد رو پیست کنه یکجا
  const onPaste = (e) => {
    e.preventDefault();
    const digits = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!digits) return;

    const next = digits.split("");
    while (next.length < length) next.push("");

    setVals(next);
    // فوکوس بره آخرین خونه‌ای که پر شده
    inputsRef.current[Math.min(digits.length, length - 1)]?.focus();
  };

  const code = vals.join("");
  const canSubmit = code.length === length && !loading;

  // وقتی فرم سابمیت میشه (دکمه تایید)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (typeof onSubmit === "function") {
      await onSubmit(code);
    }
  };

  // کلیک روی "ارسال مجدد کد"
  const handleResend = async () => {
    if (typeof onResend === "function") {
      await onResend();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* باکس‌های OTP */}
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

      {/* اگر اروری از والد گرفتیم */}
      {errorMessage && (
        <p className="text-red-600 text-xs text-center">
          {errorMessage}
        </p>
      )}

      {/* دکمه تایید کد */}
      <Button type="submit" disabled={!canSubmit}>
        {loading ? "در حال بررسی..." : "تایید"}
      </Button>

      {/* دکمه ارسال مجدد کد - بدون تایمر، فقط وقتی درحال ارسالیم disable بشه */}
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
        {resendLoading ? "در حال ارسال..." : "ارسال مجدد کد"}
      </button>
    </form>
  );
}
