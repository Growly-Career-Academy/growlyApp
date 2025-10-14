import OTPClient from "@/components/OTPClient";

export const metadata = { title: "کد تایید | Growly" };

export default function Page({ searchParams }) {
  const phone = searchParams?.phone || "";
  const flow = searchParams?.flow || "signup";

  const getFlowContent = () => {
    if (flow === "forgot-password") {
      return {
        title: "کد تایید رو وارد کن",
        description: `کد تایید برای بازیابی رمز عبور شماره ${phone} پیامک شد`
      };
    }
    return {
      title: "کد تایید رو وارد کن",
      description: `کد تایید برای شماره ${phone} پیامک شد`
    };
  };

  const { title, description } = getFlowContent();

  return (
    <div className="min-h-[100dvh] grid place-items-center bg-white">
      <section className="w-full max-w-md px-4">
        <h1 className="text-center text-xl font-bold text-[#141414] mb-2">
          {title}
        </h1>
        <p className="text-center text-[#595959] mb-6">
          {description}
        </p>

        <OTPClient phone={phone} flow={flow} />
      </section>
    </div>
  );
}

// export { default } from "../otp/page";
