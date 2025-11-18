"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import SelectableCard from "@/components/SelectableCard";

export default function DomainClient({ domains = [], fetchErr = "" }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleSelect = (Domain) => {
    setSelected((prev) => (prev?.slug === Domain.slug ? null : Domain)); // انتخاب مجدد = لغو
  };

  const handleSubmit = async () => {
    if (!selected) return;
  
    setSubmitting(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "selectedDomain",
          JSON.stringify({
            id: selected.id,        // 👈 عدد واقعی که از API دامین می‌آد
            slug: selected.slug,    // فقط برای URL
            title: selected.title,
          })
        );
      }
  
      router.push(`/Profession?domain=${encodeURIComponent(selected.slug)}`);
    } finally {
      setSubmitting(false);
    }
  };
  


  return (
    <div className="flex flex-col flex-1 min-h-0">
      {fetchErr ? (
        <div className="flex-1 flex items-center justify-center text-red-600 text-base">
          {fetchErr}
        </div>
      ) : domains.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-growly-gray text-base">
          موردی برای نمایش وجود ندارد.
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <div className="grid grid-cols-2 gap-3 pb-3">
            {domains.map((f) => {
              const iconSrc = f.icon || "/DomainIcons/default.png"; // 👈 اگر null بود، fallback نمایش داده میشه
              const shouldUnoptimize =
                typeof f.icon === "string" && /^https?:\/\//i.test(f.icon);

              return (
                <SelectableCard
                  key={f.slug}
                  checked={selected?.slug === f.slug}
                  onChange={() => toggleSelect(f)}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="h-10 w-10 flex items-center justify-center">
                      <Image
                        src={iconSrc}
                        alt={f.title || "icon"}
                        width={24}
                        height={24}
                        className="object-contain"
                        unoptimized={shouldUnoptimize}
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium mb-2 text-[#111827]">
                        {f.title}
                      </span>
                      <span className="text-xs text-[#747474]">
                        {f.description}
                      </span>
                    </div>
                  </div>
                </SelectableCard>
              );
            })}
          </div>
        </div>
      )}

      {/* فوتر استیکی */}
      <div className="shrink-0 -mx-10">
        <div className="rounded-t-[28px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.08)] px-10 pt-5 pb-20">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !selected}
            className="w-full rounded-[28px] text-[18px] font-semibold"
          >
            <span className="inline-flex text-xl font-medium items-center justify-center gap-3">
              <span>{submitting ? "در حال ذخیره..." : "ادامه"}</span>
              <Image
                src="/ArrowUp.svg"
                alt="ادامه"
                width={13.55}
                height={16.5}
              />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
