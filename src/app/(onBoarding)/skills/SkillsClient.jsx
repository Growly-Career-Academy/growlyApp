"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";

function Pill({ checked, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-4 py-2 rounded-xl text-sm transition border",
        checked
          ? "bg-[#E7F4EE] text-[#0B834F] border-[#0B834F]"
          : "bg-white text-[#111827] border-[#E5E7EB]"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/**
 * props:
 * groups = [{ id, title, options: [{id, label, raw}] }]
 */
export default function SkillsClient({ groups = [] }) {
  const [selected, setSelected] = useState(new Set());
  const minRequired = 3;

  const flat = useMemo(
    () => groups.flatMap(g => g.options.map(o => ({ ...o, group: g.title }))),
    [groups]
  );

  const toggle = (id) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const isEmpty = flat.length === 0;
  const canContinue = selected.size >= minRequired;

  const handleContinue = async () => {
    // TODO: اینجا می‌تونی ذخیره کنی یا بری مرحله بعدی
    // فعلا فقط لاگ:
    console.log("skills:", Array.from(selected));
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* لیست اسکرول‌دار */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {isEmpty ? (
          <div className="text-center text-[#6B7280] text-sm py-10">
            برای این تخصص هنوز مهارتی ثبت نشده.
          </div>
        ) : (
          groups.map(group => (
            <div key={group.id} className="mb-4">
              {/* عنوان گروه (اختیاری) */}
              {/* <div className="text-[#6B7280] text-sm mb-3">{group.title}</div> */}

              {/* شبکهٔ چِپس‌ها */}
              <div className="grid grid-cols-2 gap-3">
                {group.options.map(opt => {
                  const checked = selected.has(opt.id);
                  return (
                    <Pill
                      key={opt.id}
                      checked={checked}
                      onClick={() => toggle(opt.id)}
                    >
                      {opt.label}
                    </Pill>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* راهنمای حداقل انتخاب */}
        {!canContinue && !isEmpty && (
          <div className="text-center text-[#9CA3AF] text-sm py-4">
            حداقل {minRequired} مهارت رو انتخاب کن.
          </div>
        )}
      </div>

      {/* فوتر استیکی — دقیقاً هم‌استایل Domain.jsx */}
      <div className="shrink-0 -mx-10">
        <div className="rounded-t-[28px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.08)] px-10 pt-5 pb-20">
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full rounded-[28px] text-[18px] font-semibold"
          >
            <span className="inline-flex text-xl font-medium items-center justify-center gap-3">
              <span>ادامه</span>
              <Image
                src="/ArrowUp.svg"
                alt="ادامه"
                width={13.55}
                height={16.5}
                className="object-contain"
              />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
