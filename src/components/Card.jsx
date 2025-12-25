import React from "react";

const defaultCourse = {
  title: "مبانی برنامه‌نویسی Css",
  instructor: "معین حشمتی",
  description:
    "دوره آموزش زبان برنامه‌نویسی جاوا در این دوره ما به سراغ آموزش برنامه‌نویسی جاوا از سطح مقدماتی تا پیشرفته خواهیم رفت.",
  level: "مقدماتی",
  duration: "۳ ساعت",
  rating: 4.7,
  ratingCount: 850,
  coverLabel: "Css",
  coverAccent: "#F8D84B",
  avatarUrl:
    "https://ui-avatars.com/api/?name=%D9%85%D8%B9%DB%8C%D9%86+%D8%AD%D8%B4%D9%85%D8%AA%DB%8C&background=0B834F&color=fff",
};

export default function Card({ course = {} }) {
  const {
    title,
    instructor,
    description,
    level,
    duration,
    rating,
    ratingCount,
    coverLabel,
    coverAccent,
    avatarUrl,
  } = { ...defaultCourse, ...course };

  return (
    <div
      className="w-full max-w-sm rounded-2xl border border-[#E8E8E8] bg-white shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)] p-5"
      dir="rtl"
    >
      <div className="mb-4 rounded-2xl border border-[#EAEAEA] bg-[#F5F7F9] aspect-[16/11] overflow-hidden">
        <div className="flex h-full items-center justify-center">
          <div className="flex h-[96px] w-[96px] items-center justify-center rounded-2xl bg-white shadow-sm border border-[#EAEAEA]">
            <div
              className="flex h-[78px] w-[78px] flex-col items-center justify-center rounded-xl text-lg font-bold text-[#2A2A2A]"
              style={{ background: coverAccent }}
            >
              {coverLabel}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-[#1F1F1F]">{title}</h2>

      <div className="mt-2 flex items-center gap-2">
        <span className="h-8 w-8 overflow-hidden rounded-full border border-[#E5E5E5] bg-[#F5F5F5]">
          <img
            src={avatarUrl}
            alt={instructor}
            className="h-full w-full object-cover"
          />
        </span>
        <span className="text-sm font-semibold text-[#2E2E2E]">{instructor}</span>
      </div>

      <p className="mt-3 text-sm leading-6 text-[#555555] text-justify">
        {description}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-[#6B6B6B]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9C9C9]" />
            {level}
          </span>
          <span className="text-[#B1B1B1]">·</span>
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1 text-[#F3B400]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span className="text-sm font-semibold text-[#2E2E2E]">{rating}</span>
          <span className="text-[11px] text-[#8D8D8D]">
            ({ratingCount.toLocaleString("fa-IR")} امتیاز)
          </span>
        </div>
      </div>
    </div>
  );
}
