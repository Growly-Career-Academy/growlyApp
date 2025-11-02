"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import Button from "@/components/Button";
import PassInput from "@/components/inputs/PassInput";
import NumInput from "@/components/inputs/NumInput";

export default function SignupPasswordPage() {
  const router = useRouter();
  const search = useSearchParams();

  const initialPhone = useMemo(
    () => search.get("phone") || "",
    [search]
  );

  const [phone, setPhone] = useState(initialPhone);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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

      const res = await fetch("/api/auth/password-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message ||
            data?.detail ||
            data?.error ||
            "ثبت رمز عبور ناموفق بود"
        );
      }

      // موفقیت:
      // - یوزر ایجاد شد
      // - اگر بک‌اند توکن داده باشه، route ما کوکی auth_token رو ست کرده
      // حالا بفرستش به Domain
      router.push("/Domain");
    } catch (e) {
      setErr(e.message || "خطای ناشناخته");
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
          {/* شماره موبایل نمایش داده می‌شه و قابل ادیت هم هست */}
          <NumInput
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, ""))
            }
            onEdit={() => router.push("/login")} // یا هرجایی که باید برگرده
          />

          <PassInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          {/* زیرش همون bullet point های دیزاین تو */}
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

          {err && (
            <p className="text-red-600 text-xs text-center">{err}</p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "در حال ثبت..." : "ورود"}
          </Button>
        </form>
      </div>
    </div>
  );
}
