import SleekStepper from "@/components/SleekStepper";
import ProfessionClient from "./ProfessionClient";
import { cookies } from "next/headers";
import Link from "next/link";


export const metadata = { title: "Profession | Growly" };

export default async function ProfessionPage({ searchParams }) {
  const domainSlug = searchParams?.domain || "";
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const token = cookies().get("auth_token")?.value;

  let professions = [];
  let fetchErr = "";

  if (!domainSlug) {
    fetchErr = "دامنه نامعتبر است.";
  } else {
    try {
      const res = await fetch(`${base}/domains/${domainSlug}/professions/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json().catch(() => []);
        if (Array.isArray(data)) {
          professions = [
            {
              id: "main",
              title: "لیست تخصص‌ها",
              options: data.map((item) => ({
                id: item.slug || String(item.id),
                label: item.name,
                description: item.description || "",
              })),
            },
          ];
        } else {
          fetchErr = "داده نامعتبر از سرور";
        }
      } else if (res.status === 401) {
        fetchErr = "برای ادامه باید وارد شده باشی.";
      } else {
        fetchErr = "خطا در دریافت تخصص‌ها";
      }
    } catch (err) {
      console.error("[ProfessionPage] fetch error:", err);
      fetchErr = "خطا در دریافت تخصص‌ها";
    }
  }

  return (
    <div
      className="h-[100dvh] overflow-hidden bg-white flex flex-col px-6 py-10 pb-0"
      dir="rtl"
    >
      {/* دکمه بازگشت بالا، سمت چپ */}
      <Link
        href="/Domain"
        className="ml-4 self-end mt-5 mb-10 flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#111827]"
      >
        <span className="text-sm font-normal text-[#595959]">بازگشت</span>
        <img src="/Arrow-Up.svg" alt="بازگشت" />
      </Link>
      <div className="flex flex-col flex-1 max-w-sm w-full mx-auto min-h-0">

        {/* استپر بالای صفحه */}
        <SleekStepper current={2} steps={3} logoSrc="/logo.png" />

        {/* تیتر صفحه */}
        <div className="text-center shrink-0">
          <h1 className="text-2xl font-medium mt-10 leading-[1.4]">
            می‌خوای تو چه شغلی
            <br />
            متخصص بشی؟
          </h1>

          <p className="text-growly-gray text-base mt-4">
            مهم‌ترین تخصصی رو که مد نظرته انتخاب کن.
          </p>
        </div>

        {/* بخش اینتراکتیو */}
        <div className="mt-6 flex flex-col flex-1 min-h-0">
          <ProfessionClient
            professions={professions}
            fetchErr={fetchErr}
            domainSlug={domainSlug}
          />
        </div>
      </div>
    </div>
  );
}
