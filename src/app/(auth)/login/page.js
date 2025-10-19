"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/inputs/Input";

export default function AuthPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!phone) return;
    const normalized = phone.replace(/\D/g, "");
    
    // TODO: Check if user exists and route accordingly
    // فعلاً برای تست، فرض می‌کنیم کاربر موجود است و مستقیماً به پسورد می‌رویم
    // بعداً اینجا API چک می‌کنیم که آیا کاربر موجود است یا نه
    
    // اگر کاربر موجود است -> صفحه پسورد
    router.push(`/login/password?phone=${encodeURIComponent(normalized)}`);
    
    // اگر کاربر جدید است -> صفحه OTP برای ثبت نام
    // router.push(`/signup/OTP?phone=${encodeURIComponent(normalized)}&flow=signup`);
  }

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-medium color-foreground mb-4">
            ورود | ثبت نام
          </h1>
          <p className="text-[#595959] text-xs leading-[20px]">
            یادگیری برای همه یکسان نیست؛ وارد شو تا<br />
            مسیر شخصی خودت رو پیدا کنی.
          </p>
        </div>

        {/* Form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="text-right mb-2">
            <label className="text-sm font-medium block mb-4 text-center">
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
            ادامه
          </Button>
        </form>
      </div>
    </div>
  );
}


