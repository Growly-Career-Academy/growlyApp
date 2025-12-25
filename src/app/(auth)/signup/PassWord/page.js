"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import Button from "@/components/Button";
import PassInput from "@/components/inputs/PassInput";
import NumInput from "@/components/inputs/NumInput";

function SignupPasswordContent() {
  const router = useRouter();
  const search = useSearchParams();

  const initialPhone = useMemo(() => search.get("phone") || "", [search]);

  const [phone, setPhone] = useState(initialPhone);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // اگر phone تو URL نبود، از localStorage پرش کن (برای وقتی از OTP میای)
  useEffect(() => {
    if (phone) return;
    try {
      const saved = localStorage.getItem("phone");
      if (saved) setPhone(saved);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    const normalizedPhone = (phone || "").replace(/\D/g, "");
    if (!normalizedPhone || !password) {
      setErr("شماره و رمز عبور را کامل وارد کن");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/password-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.message || data?.detail || data?.error || "ثبت رمز عبور ناموفق بود";

        // ✅ نکته اصلی: اگر بک گفت از قبل پسورد دارد، یعنی باید بره فلو لاگین
        if (String(msg).toLowerCase().includes("already has password")) {
          // برای UX بهتر: replace تا کاربر با Back دوباره برنگرده همینجا
          router.replace(
            `/login/password?phone=${encodeURIComponent(normalizedPhone)}`
          );
          return;
        }

        setErr(msg);
        return;
      }

      // شماره رو ذخیره کن که تو صفحات بعدی لازم میشه
      try {
        localStorage.setItem("phone", normalizedPhone);
      } catch {}

      // ✅ مسیر درست پروژه جدیدت
      router.push("/onboarding/domain");
    } catch (e) {
      setErr(e?.message || "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            رمز عبور خودت رو انتخاب کن
          </h1>
        </div>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
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

          <div className="space-y-2 mr-2">
            <div className="flex items-center gap-2 text-xs text-foreground">
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>شامل عدد</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>حداقل ۸ حرف</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>شامل یک حرف بزرگ و کوچک</span>
            </div>
          </div>

          {err && <p className="text-red-600 text-xs text-center">{err}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "در حال ثبت..." : "ورود"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function SignupPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
          <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold text-gray-800 mb-2">
                رمز عبور خودت رو انتخاب کن
              </h1>
            </div>
            <div className="w-full">در حال بارگذاری...</div>
          </div>
        </div>
      }
    >
      <SignupPasswordContent />
    </Suspense>
  );
}
