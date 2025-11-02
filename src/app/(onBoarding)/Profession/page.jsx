import SleekStepper from "@/components/SleekStepper";
import ProfessionClient from "./ProfessionClient";
import { cookies } from "next/headers";

export const metadata = { title: "Profession | Growly" };

export default async function ProfessionPage({ searchParams }) {
  const domainSlug = searchParams?.domain || "";
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const token = cookies().get("auth_token")?.value;

  let professionsForClient = [];
  let fetchErr = "";

  if (domainSlug) {
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
        const options = Array.isArray(data)
          ? data.map((p) => ({
              id: p.slug || String(p.id),
              label: p.name ?? "",
              description: p.description ?? "",
            }))
          : [];
        professionsForClient = [
          {
            id: "main",
            title: "لیست تخصص‌ها",
            options,
          },
        ];
      } else if (res.status === 401) {
        fetchErr = "برای ادامه باید وارد شده باشی.";
      } else {
        fetchErr = "خطا در دریافت تخصص‌ها";
      }
    } catch (err) {
      console.error("[ProfessionPage] fetch error:", err);
      fetchErr = "خطا در دریافت تخصص‌ها";
    }
  } else {
    fetchErr = "دامین نامعتبر است.";
  }

  return (
    <div
      className="min-h-screen bg-white flex flex-col px-6 py-25 my-auto"
      dir="rtl"
    >
      <div className="flex flex-col flex-1 max-w-sm w-full mx-auto">
        <SleekStepper current={2} steps={3} logoSrc="/logo.png" />

        <div className="text-center">
          <h1 className="text-2xl font-medium mt-10">
            می‌خوای تو چه شغلی متخصص بشی؟
          </h1>
          <p className="text-growly-gray text-base mt-4">
            مهم‌ترین تخصصی رو که مد نظرته انتخاب کن.
          </p>
        </div>

        <div className="mt-6 flex flex-col flex-1 min-h-0">
          <ProfessionClient
            professions={professionsForClient}
            fetchErr={fetchErr}
            domainSlug={domainSlug}
          />
        </div>
      </div>
    </div>
  );
}
