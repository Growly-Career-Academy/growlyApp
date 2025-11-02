"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function ProfessionClient({
  professions = [],   // [{ id, title, options:[{id,label,raw}] }]
  fetchErr = "",
  domainSlug = "",
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // id همان slug

  const wrapRef = useRef(null);

  // بستن دراپ‌داون با کلیک خارج
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const flatOptions = useMemo(
    () =>
      professions.flatMap((g) =>
        g.options.map((o) => ({ ...o, group: g.title }))
      ),
    [professions]
  );

  const selectedLabel =
    flatOptions.find((o) => o.id === selectedId)?.label || "انتخاب تخصص";

  const handlePick = async (opt) => {
    setSelectedId(opt.id);
    setOpen(false);
    // ارسال به بک‌اند (Placeholder Route داخلی ما)
    try {
      await fetch("/api/selection/profession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: domainSlug,
          profession: opt.id, // همان slug
        }),
      }).catch(() => null);
    } finally {
      // رفتن به مرحله‌ی بعد
      router.push(`/skills?profession=${encodeURIComponent(opt.id)}`);
    }
  };

  const handleContinue = async () => {
    if (!selectedId) return;
    setSubmitting(true);
    try {
      router.push(`/skills?profession=${encodeURIComponent(selectedId)}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (fetchErr) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-600">
        {fetchErr}
      </div>
    );
  }

  if (flatOptions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#6B7280]">
        برای این حوزه هنوز تخصصی ثبت نشده.
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* فیلد بسته/باز شونده */}
      <div className="relative" ref={wrapRef} dir="rtl">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full h-12 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-base text-right px-4 flex items-center justify-between"
        >
          <span className={`${selectedId ? "text-[#111827]" : "text-[#BFBFBF]"}`}>
            {selectedLabel}
          </span>
          <svg width="14" height="8" viewBox="0 0 14 8" className={`ml-1 transition ${open ? "rotate-180" : ""}`}>
            <path d="M1 1.5L7 6.5L13 1.5" stroke="#6B7280" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </button>

        {/* پنل باز شونده */}
        {open && (
          <div className="absolute z-50 mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white shadow-lg overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {flatOptions.map((opt) => {
                const active = opt.id === selectedId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handlePick(opt)}
                    className={`w-full text-right px-4 py-3 flex items-center gap-3 hover:bg-[#F3F4F6] ${
                      active ? "bg-[#F3F4F6]" : ""
                    }`}
                  >
                    {/* تیک سبز گزینه انتخاب‌شده */}
                    <div className="w-5 text-center">
                      {active && (
                        <svg width="16" height="16" viewBox="0 0 16 16">
                          <path d="M3.5 8.5L6.5 11.5L12.5 5.5" stroke="#0B834F" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[#111827]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="shrink-0 -mx-10">
        <div className="rounded-t-[28px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.08)] px-10 pt-5 pb-20">
          <Button
            onClick={handleContinue}
            disabled={submitting || noneSelected}
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
