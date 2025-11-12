import SleekStepper from "@/components/SleekStepper";
import DomainClient from "./Domain";
import { cookies } from "next/headers";

export const metadata = { title: "Domain | Growly" };

const assetBase =
  process.env.NEXT_PUBLIC_MEDIA_BASE || process.env.NEXT_PUBLIC_API_BASE;

const slugToIcon = (slug) => {
  if (typeof slug !== "string") return null;
  const trimmed = slug.trim();
  if (!trimmed) return null;
  return `/DomainIcons/${trimmed}.svg`;
};

const toAbsoluteUrl = (value) => {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  const trimmed = value.trim();

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return trimmed;

  if (!assetBase) return trimmed;

  try {
    return new URL(trimmed, assetBase).toString();
  } catch {
    return trimmed;
  }
};

const extractIcon = (item) => {
  if (!item || typeof item !== "object") return null;

  const candidates = [
    item.icon_url,
    item.iconUrl,
    typeof item.icon === "string" ? item.icon : null,
    item.icon?.url,
    item.icon?.file,
    item.assets?.icon,
    item.assets?.icon_url,
    item.image,
    slugToIcon(item.slug),
  ];

  for (const candidate of candidates) {
    const resolved = toAbsoluteUrl(candidate);
    if (resolved) return resolved;
  }

  return null;
};

export default async function DomainPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE; // مثلا https://api.growly.ir/api/v1
  const token = cookies().get("auth_token")?.value;

  let domains = [];
  let fetchErr = "";

  try {
    const res = await fetch(`${base}/domains/`, {
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
        domains = data.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.name,
          description: item.description || "",
          icon: extractIcon(item),
        }));
      } else {
        fetchErr = "داده نامعتبر از سرور";
      }
    } else if (res.status === 401) {
      fetchErr = "برای ادامه باید وارد شده باشی.";
    } else {
      fetchErr = "خطا در دریافت حوزه‌ها";
    }
  } catch (err) {
    console.error("[DomainPage] fetch /domains error:", err);
    fetchErr = "خطا در دریافت حوزه‌ها";
  }

  return (
    <div
      className="h-[100dvh] overflow-hidden bg-white flex flex-col px-10 py-25 pb-0"
      dir="rtl"
    >
      <div className="flex flex-col flex-1 max-w-sm w-full mx-auto min-h-0">
        <SleekStepper current={1} steps={3} logoSrc="/logo.png" />

        <div className="text-center shrink-0">
          <h1 className="text-2xl font-medium mt-10 leading-[1.4]">
            می‌خوای تو چه زمینه‌ای
            <br />
            آموزش ببینی؟
          </h1>

          <p className="text-growly-gray text-base mt-4">
            این فقط یک نقطه شروعه. انتخابت، محدودیتی در استفاده از منابع ایجاد
            نمی‌کنه.
          </p>
        </div>

        <div className="mt-6 flex flex-col flex-1 min-h-0">
          {/* 👇 Client component برای تعامل */}
          <DomainClient domains={domains} fetchErr={fetchErr} />
        </div>
      </div>
    </div>
  );
}
