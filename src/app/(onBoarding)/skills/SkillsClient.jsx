"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";

function Pill({ checked, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "p-2 m-1 rounded-xl text-sm transition border",
        checked
          ? "bg-[#E7F4EE] text-black border-growly-green"
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
  const router = useRouter();
  const [selected, setSelected] = useState(new Set());
  const [domainId, setDomainId] = useState(null);
  const [professionId, setProfessionId] = useState(null);
  const [domainSlug, setDomainSlug] = useState(null);
  const [professionSlug, setProfessionSlug] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const minRequired = 3;

  useEffect(() => {
    try {
      const rawDomain = localStorage.getItem("selectedDomain");
      if (rawDomain) {
        const d = JSON.parse(rawDomain);
        if (d?.id) setDomainId(d.id);
        if (d?.slug) setDomainSlug(d.slug);
      }

      const rawProfession = localStorage.getItem("selectedProfession");
      if (rawProfession) {
        const p = JSON.parse(rawProfession);
        if (p?.id) setProfessionId(p.id);
        if (p?.slug) setProfessionSlug(p.slug);
      }
    } catch (e) {
      console.error("cannot read selected domain/profession", e);
    }
  }, []);


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
    setErr("");
  
    // حداقل ۳ مهارت
    if (!canContinue) return;
  
    // مهارت‌های انتخاب شده
    const skillsArray = Array.from(selected);
  
    // توکن لاگین
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  
    if (!token) {
      setErr("برای ثبت مهارت‌ها باید وارد حساب کاربری شده باشی.");
      return;
    }
  
    // domainId و professionId را قبلاً در useEffect از localStorage خواندی
    if (!domainId || !professionId) {
      setErr(
        "اطلاعات حوزه یا تخصص پیدا نشد. لطفاً مراحل قبلی را دوباره انجام بده."
      );
      return;
    }
  
    // 👈 دقیقا مطابق چیزی که تو Swagger جواب داد
    const payload = {
      domain_id: domainId,
      profession_id: professionId,
      skills: skillsArray,
    };
  
    console.log("FINAL SELECTION PAYLOAD =>", payload);
  
    try {
      setSaving(true);
  
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/selections/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Token ${token}`, // اگر تو Swagger Bearer بود، این را بکن Bearer
          },
          body: JSON.stringify(payload),
        }
      );
  
      const text = await res.text();
  
      if (!res.ok) {
        console.error("selection save failed:", text);
        setErr("ثبت مهارت‌ها با مشکل مواجه شد. لطفاً دوباره تلاش کن.");
        return;
      }
  
      // اینجا یعنی 201 شده
      console.log("SELECTION SAVED:", text);
      // مثلاً:
      // router.push("/dashboard");
    } catch (e) {
      console.error("network error (save selection):", e);
      setErr("خطا در ارتباط با سرور. لطفاً بعداً دوباره تلاش کن.");
    } finally {
      setSaving(false);
    }
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
              <div className="text-[#6B7280] text-sm mb-3">{group.title}</div>

              {/* شبکهٔ چِپس‌ها */}
              <div className="text-center">
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
      </div>
      {err && (
        <p className="text-red-600 text-xs text-center mt-2 px-4">
          {err}
        </p>
      )}

      {/* فوتر استیکی — دقیقاً هم‌استایل Domain.jsx */}
      <div className="shrink-0 -mx-10">
        <div className="rounded-t-[28px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.08)] px-10 pt-5 pb-20">
          <Button
            onClick={handleContinue}
            disabled={!canContinue || saving}
            className="w-full rounded-[28px] text-[18px] font-semibold"
          >
            <span className="inline-flex text-xl font-medium items-center justify-center gap-3">
              <span>{saving ? "در حال ثبت مهارت‌ها..." : "ادامه"}</span>
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
