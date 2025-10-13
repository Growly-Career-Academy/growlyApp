import SleekStepper from "@/components/SleekStepper";
import FieldClient from "./FieldClient";

export const metadata = { title: "Field | Growly" };

const fields = [
  { id: 1, title: "برنامه نویسی", description: "Programming" },
  { id: 2, title: "کسب و کار", description: "Business" },
  { id: 3, title: "آی تی و نرم‌افزار", description: "IT and Software" },
  // { id: 4, title: "مالی و حسابداری", description: "Finance & Accounting" },
  // { id: 5, title: "توسعه فردی", description: "Personal Development" },
  // { id: 6, title: "بهره‌وری در محیط کار", description: "Office Productivity" },
  // { id: 7, title: "بازاریابی", description: "Marketing" },
  // { id: 8, title: "طراحی", description: "Design" },
  // { id: 9, title: "سلامت و فیتنس", description: "Health & Fitness" },
  // { id: 10, title: "عکاسی و ویدئو", description: "Photography & Video" },
  // { id: 11, title: "آکادمیک و دانشگاهی", description: "Academics" },
  // { id: 12, title: "موسیقی", description: "Music" },
];

export default function FieldPage() {
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
          <FieldClient fields={fields} />
        </div>
      </div>
    </div>
  );
}
