import SignupOTPClient from "./SignupOTPClient";

export const metadata = { title: "کد تایید | Growly" };

export default async function SignupOTPPage({ searchParams }) {
  // در Next 15 این searchParams یه Promiseـه
  const params = await searchParams;
  const phone = params?.phone || "";
  const flow = params?.flow || "signup";

  return (
    <div className="min-h-[100dvh] grid place-items-center bg-white">
      <section className="w-full max-w-md px-4">
        <h1 className="text-center text-xl font-bold text-[#141414] mb-2">
          کد تایید رو وارد کن
        </h1>

        <p className="text-center text-[#595959] mb-6">
          {flow === "forgot-password"
            ? `کد تایید برای بازیابی رمز عبور شماره ${phone} پیامک شد`
            : `کد تایید برای شماره ${phone} پیامک شد`}
        </p>

        {/* این واقعی‌ترین تفاوتشه: کل منطق OTP میره تو کلاینت */}
        <SignupOTPClient phone={phone} flow={flow} />
      </section>
    </div>
  );
}
