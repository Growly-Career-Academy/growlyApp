import React from "react";

/**
 * Simple pill badge for roadmap steps.
 * Usage: <Step label="گام اول" number={1} />
 */
export default function Step({ label, number}) {

    const isFirst = number === 1;
    const isEven = number/2 === 0;
    const bgClass = isFirst ? "bg-step1" : isEven ? "bg-step-even" : "bg-step-odd";

    return (
        <div className={`flex flex-col justify-center items-center gap-2
        bg-no-repeat bg-[position:170px_40px] ${bgClass} p-7`}>
            <div
                className="relative inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 w-max"
                dir="rtl">
                <span className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#0B834F] text-sm font-semibold text-white">
                    {number}
                </span>
                <span className="text-sm font-semibold text-[#2A2A2A] mr-7">{label}</span>
            </div>
            <div
                className="relative inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 w-max"
                dir="rtl">
                <span className="text-xs font-semibold text-[#2A2A2A] mr-7">برای گام اول یکی از دوره‌های زیر رو ببین</span>
            </div>
        </div>

    );
}
