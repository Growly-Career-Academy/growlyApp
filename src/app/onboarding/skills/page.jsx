import SleekStepper from "@/components/SleekStepper";
import SkillsClient from "./SkillsClient";
import Link from "next/link";
import { headers } from "next/headers";
import BackButton from "@/components/BackButton";

export const metadata = { title: "Skills | Growly" };

export default async function SkillsPage({ searchParams }) {
  const professionSlug = searchParams?.profession || "";
  const baseApp = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const h = await headers();
const cookieHeader = h.get("cookie") ?? "";


  let groups = [];

  if (professionSlug) {
    try {
      const res = await fetch(
        `${baseApp}/api/professions/${encodeURIComponent(
          professionSlug
        )}/skills/`,                     // ✅ ۱) اسلش آخر اضافه شد
        {
          cache: "no-store",
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        }
      );

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        // data.skills = [{id,title,slug,description}]
        const options = Array.isArray(data.skills)
          ? data.skills.map((s) => ({
            id: s.id,                         // 👈 عدد واقعی
            label: s.title || "",
            description: s.description || "",
          }))
          : [];

        groups = [
          {
            id: "main",            
            options,
          },
        ];
      }
    } catch (e) {
      console.error("[SkillsPage] fetch error:", e);
    }
  } else {
    console.warn("[SkillsPage] professionSlug خالیه");
  }

  return (
    <div
      className="h-[100dvh] overflow-hidden bg-white flex flex-col px-6 py-10 pb-0"
      dir="rtl"
    >
      {/* دکمه بازگشت بالا، سمت چپ */}
      <BackButton />

      <div className="flex flex-col flex-1 max-w-sm w-full mx-auto min-h-0">
        <SleekStepper current={3} steps={3} logoSrc="/logo.png" />

        <div className="text-center shrink-0">
          <h1 className="text-2xl font-medium mt-10 leading-[1.4]">
            کدوم مهارت‌های برنامه‌نویسی وب
            <br />
            رو می‌خوای یاد بگیری؟
          </h1>
          <p className="text-growly-gray text-base mt-4">
            لطفاً حداقل ۳ مورد رو انتخاب کن.
          </p>
        </div>

        <div className="mt-6 flex flex-col flex-1 min-h-0">
          <SkillsClient groups={groups} />
        </div>
      </div>
    </div>
  );
}
