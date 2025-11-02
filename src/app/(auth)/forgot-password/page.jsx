"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import Button from "@/components/Button";
import Input from "@/components/inputs/Input";
import PassInput from "@/components/inputs/PassInput";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const search = useSearchParams();

  // از URL
  const initialPhone = useMemo(() => (search.get("phone") || "").replace(/\D/g, ""), [search]);
  const initialCode  = useMemo(() => (search.get("code")  || "").replace(/\D/g, ""), [search]);

  // OTP تایید شده یعنی هم phone داریم هم code داریم
  const isOTPVerified = useMemo(
    () => !!initialPhone && !!initialCode,
    [initialPhone, initialCode]
  );

  // state
  const [phone, setPhone] = useState(initialPhone);
  const [code, setCode]   = useState(initialCode); // اینو کاربر توی این صفحه ویرایش نمی‌کنه معمولا
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // مرحله اول: فقط شماره می‌گیره و می‌فرستیم صفحه OTP
  async function handlePhoneSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!phone) {
      setErr("شماره موبایل لازم است");
      return;
    }

    const normalized = phone.replace(/\D/g, "");

    // مستقیم می‌بریمش صفحه OTP فراموشی رمز
    router.push(`/forgot-password/OTP?phone=${encodeURIComponent(normalized)}`);
  }

  // مرحله دوم: ست کردن رمز جدید
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!password) {
      setErr("رمز عبور جدید لازم است");
      return;
    }

    try {
      setLoading(true);

      // POST به /api/auth/password-reset
      const res = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          code,              // کد ۶ رقمی که تو صفحه OTP گرفتیم
          new_password: password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message ||
            data?.detail ||
            data?.error ||
            "تغییر رمز ناموفق بود"
        );
      }

      // موفق بود → بفرستش صفحه ورود با پسورد
      router.push(`/login/password?phone=${encodeURIComponent(phone)}`);
    } catch (e) {
      setErr(e.message || "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }

  // ---------- اگر OTP تأیید شده (یعنی phone و code داریم): فرم وارد کردن پسورد جدید ----------
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

          <form
            className="w-full flex flex-col gap-6"
            onSubmit={handlePasswordSubmit}
          >
            {/* شماره رو فقط نشون می‌دیم که بدونه برای کدوم حسابه */}
            {/* <div className="text-xs text-center text-gray-500" dir="ltr">
              {phone}
            </div> */}

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

            {err && (
              <p className="text-red-600 text-xs text-center">{err}</p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "در حال ذخیره..." : "ورود"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ---------- اگر هنوز OTP تایید نشده: فرم گرفتن شماره موبایل ----------
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

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handlePhoneSubmit}
        >
          <div className="text-right">
            <label className="text-sm font-medium block mb-2 text-center">
              شماره موبایل خودت رو وارد کن
            </label>

            <Input
              type="tel"
              placeholder="۰۹۱۲۲۲۲۲۲۲۲"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>

          {err && (
            <p className="text-red-600 text-xs text-center">{err}</p>
          )}

          <Button type="submit">
            ارسال کد تایید
          </Button>
        </form>
      </div>
    </div>
  );
}
