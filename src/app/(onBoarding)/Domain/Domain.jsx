"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SelectableCard from "@/components/SelectableCard";
import Button from "@/components/Button";

export default function DomainClient({ domain = [] }) {
  const list = Array.isArray(domain) ? domain : [];

  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const setChecked = (id, next) => {
    setSelected(prev => {
      const s = new Set(prev);
      next ? s.add(id) : s.delete(id);
      return s;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { selected: Array.from(selected) };
      const res = await fetch("/api/domain/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => null);
      if (res && res.ok) await res.json().catch(() => null);
    } finally {
      setSubmitting(false);
      router.push("/career");
    }
  };

  const noneSelected = selected.size === 0;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* ناحیه کارت‌ها: تنها قسمت اسکرولی */}
      {list.length === 0 ? (
        <div className="text-center text-growly-gray text-base py-8">
          موردی برای نمایش وجود ندارد.
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 pb-3">
            {list.map((f) => (
              <SelectableCard
                key={f.id}
                checked={selected.has(f.id)}
                onChange={(next) => setChecked(f.id, next)}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  {f.icon ? (
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[#F4F5F6]">
                      <Image src={f.icon} alt={f.title} width={24} height={24} className="object-contain" />
                    </div>
                  ) : null}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#111827]">{f.title}</span>
                    <span className="text-xs text-[var(--growly-gray,#747474)]">{f.description}</span>
                  </div>
                </div>
              </SelectableCard>
            ))}
          </div>
        </div>
      )}

      {/* فوتر تمام‌عرض، چسبیده به لبه‌ها */}
      <div className="shrink-0 -mx-10">                 {/* 👈 منفیِ px-10 والد */}
        <div className="rounded-t-[28px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.08)] px-10 pt-5 pb-5 border-t border-[#F0F0F0]">
          <Button
            onClick={handleSubmit}
            disabled={submitting || noneSelected}
            className="w-full rounded-[28px] text-[18px] font-semibold"
          >
            <span className="inline-flex items-center justify-center gap-3">
              <span className="text-xl leading-none">←</span>
              <span>{submitting ? "در حال ذخیره..." : "ادامه"}</span>
            </span>
          </Button>
        </div>
      </div>

    </div>
  );



}
