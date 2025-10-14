import SleekStepper from "@/components/SleekStepper";
import DomainClient from "./Domain";

export const metadata = { title: "Domain | Growly" };

const domain = [
  { id: 1, title: "برنامه نویسی", description: "Programming" },
  { id: 2, title: "کسب و کار", description: "Business" },
  { id: 3, title: "آی تی و نرم‌افزار", description: "IT and Software" },
];

export default function DomainPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-25 my-auto" dir="rtl">
      <div className="flex flex-col flex-1 max-w-sm w-full mx-auto">
        <SleekStepper current={1} steps={3} logoSrc="/logo.png" />
        <div className="text-center">
          <h1 className="text-2xl font-medium mt-10">
            می‌خوای تو چه زمینه‌ای
            <br />
            آموزش ببینی؟
          </h1>
          <p className="text-growly-gray text-base mt-4">
            این فقط یک نقطه شروعه. انتخابت، محدودیتی در استفاده از منابع ایجاد نمی‌کنه.
          </p>
        </div>
        <div className="mt-6 flex flex-col flex-1 min-h-0">
          <DomainClient domain={domain} />
        </div>
      </div>
    </div>
  );
}
