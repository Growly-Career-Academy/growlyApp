"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import Button from "@/components/Button";
import Input from "@/components/inputs/Input";
import PassInput from "@/components/inputs/PassInput";
import NumInput from "@/components/inputs/NumInput";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const search = useSearchParams();
  
  // دریافت پارامترها از URL
  const initialPhone = useMemo(() => search.get("phone") || "", [search]);
  const isOTPVerified = useMemo(() => !!initialPhone, [initialPhone]);
  
  // state ها
  const [phone, setPhone] = useState(initialPhone);
  const [password, setPassword] = useState("");

  function handlePhoneSubmit(e) {
    e.preventDefault();
    if (!phone) return;
    const normalized = phone.replace(/\D/g, "");
    // بعد از وارد کردن شماره، به صفحه OTP می‌رویم
    router.push(`/forgot-password/otp?phone=${encodeURIComponent(normalized)}`);
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!password) return;

    // TODO: API برای تغییر رمز عبور
    console.log("Changing password for:", phone, "New password:", password);
    
    // بعد از موفقیت، به داشبورد می‌رویم
    router.push("/Domain");
  }

  // اگر OTP تایید شده، صفحه تنظیم رمز عبور را نشان می‌دهیم
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

            {/* Password Requirements */}
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

            <Button type="submit">ورود</Button>
          </form>
        </div>
      </div>
    );
  }

  // صفحه اولیه برای وارد کردن شماره موبایل
  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-medium color-foreground mb-4">
            فراموشی رمز عبور
          </h1>
          <p className="text-[#595959] text-xs leading-[20px]">
            شماره موبایل خودت رو وارد کن تا<br />
            کد تایید برات ارسال بشه
          </p>
        </div>

        {/* Form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handlePhoneSubmit}>
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

          <Button type="submit">
            ارسال کد تایید
          </Button>
        </form>
      </div>
    </div>
  );
}


