import SleekStepper from "@/components/SleekStepper";
import CareerClient from "./CareerClient";

export const metadata = { title: "Career | Growly" };

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-25 my-auto" dir="rtl">
      <div className="flex flex-col flex-1 max-w-sm w-full mx-auto">
        <SleekStepper current={2} steps={3} logoSrc="/logo.png" />
        <div className="text-center">
          <h1 className="text-2xl font-medium mt-10">
            می‌خوای تو چه شغلی
            <br />
            متخصص بشی؟
          </h1>
          <p className="text-growly-gray text-base mt-4">
            مهم‌ترین تخصصی رو که مد نظرته رو انتخاب کن.
          </p>
        </div>
        <div className="mt-6 flex flex-col flex-1 min-h-0">
          <CareerClient />
        </div>
      </div>
    </div>
  );
}


