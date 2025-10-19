"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

// TODO: OTP component - فعلاً کامنت شده و بعداً پیاده‌سازی می‌شود
export default function OTPClient({ phone, length = 5, flow = "signup" }) {
  const router = useRouter();
  const [vals, setVals] = useState(Array(length).fill(""));
  const [sec, setSec] = useState(90);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  // timer
  useEffect(() => {
    if (sec <= 0) return;
    const t = setInterval(() => setSec((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [sec]);

  const setAt = (i, v) => {
    const digit = v.replace(/\D/g, "").slice(0, 1);
    setVals((p) => {
      const n = [...p]; n[i] = digit; return n;
    });
    if (digit && i < length - 1) inputsRef.current[i + 1]?.focus();
  };
  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !vals[i] && i > 0) {
      setVals((p) => { const n = [...p]; n[i - 1] = ""; return n; });
      inputsRef.current[i - 1]?.focus();
    }
  };
  const onPaste = (e) => {
    e.preventDefault();
    const digits = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, length);
    if (!digits) return;
    const next = digits.split("");
    while (next.length < length) next.push("");
    setVals(next);
    inputsRef.current[Math.min(digits.length, length - 1)]?.focus();
  };

  const code = vals.join("");
  const canSubmit = code.length === length && !loading;

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    // TODO: call API verify - بعداً پیاده‌سازی می‌شود
    
    // بعد از تایید OTP، بر اساس نوع فلو به صفحه مناسب می‌رویم
    setTimeout(() => {
      setLoading(false);
      if (flow === "forgot-password") {
        // برای فراموشی رمز عبور، به صفحه forgot password می‌رویم
        router.push(`/forgot-password?phone=${encodeURIComponent(phone)}`);
      } else {
        // برای ثبت نام، به صفحه تنظیم رمز عبور می‌رویم
        router.push(`/signup/PassWord?phone=${encodeURIComponent(phone)}`);
      }
    }, 300);
  };

  const resend = () => {
    if (sec > 0) return;
    // TODO: call API resend - بعداً پیاده‌سازی می‌شود
    setSec(90);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* OTP boxes */}
      <div className="flex justify-center gap-3" dir="ltr" onPaste={onPaste}>
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
              w-14 h-14 text-center text-lg
              border-2 border-gray-200 rounded-xl outline-none bg-white
              focus:border-growly-green transition-colors
            "
          />
        ))}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={!canSubmit}>
        {loading ? "در حال بررسی..." : "تایید"}
      </Button>

      {/* Resend */}
      <button
        type="button"
        onClick={resend}
        disabled={sec > 0}
        className={`block mx-auto text-xs ${
          sec > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
        }`}
      >
        {sec > 0 ? `ارسال مجدد کد (${sec})` : "دریافت مجدد کد"}
      </button>
    </form>
  );
}
