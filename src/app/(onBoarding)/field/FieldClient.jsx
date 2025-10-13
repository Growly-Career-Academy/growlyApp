"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SelectableCard from "@/components/SelectableCard";
import Button from "@/components/Button";

export default function FieldClient({ fields = [] }) {
  // ✅ اگر props نیاد، fields پیش‌فرض آرایه‌ی خالی است
  const list = Array.isArray(fields) ? fields : []; // ✅ محافظ دوم

  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const icons = useMemo(() => ({
    "برنامه نویسی": "💻",
    "کسب و کار": "📈",
    "آی تی و نرم‌افزار": "🖥️",
  }), []);

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
      const res = await fetch("/api/fields/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => null);
      if (res && res.ok) {
        await res.json().catch(() => null);
      }
    } catch (e) {
      // ignore and continue navigation
    } finally {
      setSubmitting(false);
      router.push("/career");
    }
  };

  const noneSelected = selected.size === 0;

  return (
    <div className="flex flex-col flex-1">
      {/* اگر خالی بود پیام ملایم بده */}
      {list.length === 0 ? (
        <div className="text-center text-growly-gray text-base py-8">
          موردی برای نمایش وجود ندارد.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {list.map((f) => (
            <SelectableCard
              key={f.id}
              checked={selected.has(f.id)}
              onChange={(next) => setChecked(f.id, next)}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[#F4F5F6] text-[#0B834F] text-base">
                  {icons[f.title] ?? "⬚"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#111827]">{f.title}</span>
                  <span className="text-xs text-[var(--growly-gray,#747474)]">{f.description}</span>
                </div>
              </div>
            </SelectableCard>
          ))}
        </div>
      )}

      <div className="mt-auto pt-6">
        <Button onClick={handleSubmit} disabled={submitting || noneSelected}>
          {submitting ? "در حال ذخیره..." : "ادامه"}
        </Button>
      </div>
    </div>
  );
}
