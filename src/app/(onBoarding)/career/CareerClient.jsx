"use client";

import { useMemo, useState } from "react";
import Button from "@/components/Button";
import SelectableCard from "@/components/SelectableCard";

const sampleCareers = [
  {
    id: 1,
    title: "زبان‌های برنامه‌نویسی",
    options: [
      { id: "web", label: "برنامه‌نویسی وب" },
      { id: "mobile", label: "برنامه‌نویسی موبایل" },
      { id: "game", label: "برنامه‌نویسی بازی" },
    ],
  },
];

export default function CareerClient({ careers = sampleCareers }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  const flatOptions = useMemo(() => {
    return careers.flatMap((c) => c.options.map((o) => ({
      group: c.title,
      id: o.id,
      label: o.label,
    })));
  }, [careers]);

  const toggle = (id) => {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      // TODO: submit or navigate next
    } finally {
      setSubmitting(false);
    }
  };

  const noneSelected = selected.size === 0;

  return (
    <div className="flex flex-col flex-1">
      {/* Select input mock */}
      <button
        type="button"
        className="w-full h-12 rounded-xl border border-[#E5E7EB] text-[#9CA3AF] text-base text-right px-4 flex items-center justify-between"
        onClick={() => setOpen((v) => !v)}
      >
        <span>انتخاب تخصص</span>
        <span className="text-[#9CA3AF]">▾</span>
      </button>

      {/* List box */}
      <div className="mt-3 rounded-2xl border border-[#E5E7EB] overflow-hidden flex-1 min-h-[280px]">
        {careers.map((group) => (
          <div key={group.id} className="px-4 py-4">
            <div className="text-[#6B7280] text-sm mb-2">{group.title}</div>
            <div className="flex flex-col divide-y divide-[#F3F4F6]">
              {group.options.map((opt) => {
                const checked = selected.has(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    className={`text-right w-full py-4 px-2 flex items-center justify-between ${checked ? "bg-[#F3F4F6]" : ""}`}
                    onClick={() => toggle(opt.id)}
                  >
                    <span className="text-[#111827]">{opt.label}</span>
                    {checked && <span className="text-[#0B834F]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Button disabled={submitting || noneSelected} onClick={handleSubmit}>
          {submitting ? "در حال ذخیره..." : "ادامه"}
        </Button>
      </div>
    </div>
  );
}


