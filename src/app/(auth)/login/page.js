"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/inputs/Input";

export default function AuthPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    const normalized = (phone || "").replace(/\D/g, "");
    if (!normalized) {
      setErr("شماره موبایل را وارد کن");
      return;
    }

    try {
      setLoading(true);

      // ۱) چک شماره
      const checkRes = await fetch("/api/auth/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });

      const checkData = await checkRes.json().catch(() => ({}));
      if (!checkRes.ok) {
        throw new Error(
          checkData?.message || "خطا در بررسی شماره"
        );
      }

      console.log("[check-phone response]", checkData);

      const registered = checkData.registered === true;
      const hasPassword = checkData.has_password === true;

      // حالت: کاربر قبلاً ثبت شده و پسورد هم داره → صفحه ورود با پسورد
      if (registered && hasPassword) {
        localStorage.setItem("phone", normalized);
        router.push(
          `/login/password`
        );
        return;
      }

      // حالت‌های دیگه:
      // - کاربر ثبت‌شده ولی پسورد نداره (registered && !hasPassword)
      // - یا اصلاً ثبت نشده (registered === false)
      // تو هر دو حالت باید OTP بگیریم برای ادامه ثبت نام / ست پسورد

      const otpRes = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });

      const otpData = await otpRes.json().catch(() => ({}));
      if (!otpRes.ok) {
        throw new Error(
          otpData?.message || "خطا در ارسال کد تایید"
        );
      }

      router.push(
        `/signup/OTP?phone=${encodeURIComponent(normalized)}&flow=signup`
      );
    } catch (e) {
      console.error("[login first step error]", e);
      setErr(e.message || "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-xl font-medium color-foreground mb-4">
            ورود | ثبت نام
          </h1>
          <p className="text-[#595959] text-xs leading-[20px]">
            یادگیری برای همه یکسان نیست؛ وارد شو تا
            <br />
            مسیر شخصی خودت رو پیدا کنی.
          </p>
        </div>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
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

          {err && (
            <p className="text-red-600 text-sm text-center">
              {err}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "در حال ادامه..." : "ادامه"}
          </Button>
        </form>
      </div>
    </div>
  );
}
