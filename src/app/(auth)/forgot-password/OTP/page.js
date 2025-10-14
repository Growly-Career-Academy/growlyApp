import OTPClient from "@/components/OTPClient";

export const metadata = { title: "کد تایید | فراموشی رمز عبور" };

export default function ForgotPasswordOTPPage({ searchParams }) {
  const phone = searchParams?.phone || "";

  return (
    <div className="min-h-[100dvh] grid place-items-center bg-white">
      <section className="w-full max-w-md px-6">
        <h1 className="text-center text-xl font-bold text-[#141414] mb-2">
          کد تایید رو وارد کن
        </h1>
        <p className="text-center text-sm mb-6 mt-6">
          کد تایید برای شماره <span dir="ltr" className="font-medium text-[#141414]">{phone}</span> پیامک شد
        </p>

        <OTPClient phone={phone} flow="forgot-password" />
      </section>
    </div>
  );
}

// export { default } from "../otp/page";
