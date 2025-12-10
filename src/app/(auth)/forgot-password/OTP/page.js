import ForgotPasswordOTPClient from "./ForgotPasswordOTPClient";

export const metadata = {
  title: "کد تایید | فراموشی رمز عبور",
};

export default function ForgotPasswordOTPPage() {
  // شماره از داخل خود کامپوننت و از localStorage خوانده می‌شود
  return <ForgotPasswordOTPClient />;
}
