import ForgotPasswordOTPClient from "./ForgotPasswordOTPClient";

export const metadata = {
  title: "کد تایید | فراموشی رمز عبور",
};

export default function ForgotPasswordOTPPage({ searchParams }) {
  // نکست اینو سمت سرور صدا می‌زنه، پس این بدون "use client" امنه.
  const phone = searchParams?.phone || "";

  return <ForgotPasswordOTPClient phone={phone} />;
}
