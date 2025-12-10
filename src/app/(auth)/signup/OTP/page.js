// src/app/(auth)/signup/OTP/page.jsx
import SignupOTPClient from "./SignupOTPClient";

export const metadata = { title: "کد تایید | Growly" };

export default async function SignupOTPPage({ searchParams }) {
  const params = await searchParams;
  const flow = params?.flow || "signup";

  return (
    <div className="min-h-[100dvh] grid place-items-center bg-white">
      <section className="w-full max-w-md px-4">
        <h1 className="text-center text-xl font-bold text-[#141414] mb-2">
          کد تایید رو وارد کن
        </h1>

        {/* phone از URL نمیاد؛ فقط flow رو می‌فرستیم */}
        <SignupOTPClient flow={flow} />
      </section>
    </div>
  );
}
