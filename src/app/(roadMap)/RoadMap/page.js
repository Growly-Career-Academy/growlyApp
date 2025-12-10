"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import toasterAnimation from "@/assets/lottie/Toaster.json";
// import fetch from "@/functions/fetch";

function RoadMap() {
  const [roadMapResponse, setRoadMapResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [uiReady, setUiReady] = useState(false); // 👈 فقط برای هم‌زمان کردن نمایش
  const base = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    setUiReady(true); // 👈 بعد از اولین رندر کلاینت
  }, []);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        // ۱) سعی کن توکن را از localStorage بخوانی
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;

        // ۲) اگر توکن وجود نداشت → خطا بده و ادامه نده
        if (!token) {
          setErr("باید وارد شده باشی");
          return; // اینجا اصلاً به سمت fetch نمی‌ریم
        }

        // const res = await fetch("/user/roadmaps/", {requiredAuth: true})

        // ۳) اگر توکن داریم → درخواست به API بفرست
        const res = await fetch(`${base}/user/roadmaps/`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
          cache: "no-store",
        });

        // ۴) چک کن جواب ok هست یا نه
        if (!res.ok) {
          const text = await res.text();
          console.error(text);
          setErr("false response");
          return;
        }

        // ۵) اگر ok بود → JSON را بخوان و در state بریز
        const data = await res.json();
        setRoadMapResponse(data);

        // ۶) اگر خطای شبکه یا چیز دیگری بود → در catch هندل می‌کنیم
      } catch (e) {
        console.error(e);
        setErr("خطای شبکه");
      } finally {
        // ۷) در هر صورت لودینگ را خاموش کن
        setLoading(false);
      }
    }

    // این فانکشن را فقط یک بار بعد از اولین رندر صدا می‌زنیم
    fetchRoadmap();
  }, [base]);

  if (loading) {
    return (
      <div
        className="h-[100dvh] overflow-hidden bg-white flex flex-col pb-0"
        dir="rtl"
      >
        <div
          className={[
            "flex flex-col flex-1 max-w-sm w-full mx-auto min-h-0 px-5",
            "items-center justify-center gap-6",
            "transition-opacity duration-150",     // برای یک fade خیلی کوتاه
            uiReady ? "opacity-100" : "opacity-0" // 👈 تا uiReady نشه، هیچ‌کدوم دیده نمی‌شن
          ].join(" ")}
        >
          {/* انیمیشن لودینگ (Lottie JSON) */}
          <Lottie
            animationData={toasterAnimation}
            loop
            autoplay
            style={{ width: 213, height: 213 }}
          />

          {/* متن لودینگ */}
          <p className="text-2xl font-bold leading-[40px] text-center">
            تا چند لحظه دیگه مسیر یادگیریت آماده می‌شه...
          </p>
        </div>
      </div>
    );
  }

  if (err) {
    return <div style={{ color: "red" }}>{err}</div>;
  }

  // اگر لازم شد بعداً این حالت را فعال کنی:
  // if (!roadMapResponse || roadMapResponse.length === 0) {
  //   return (
  //     <div>
  //       هنوز مسیری ساخته نشده
  //     </div>
  //   );
  // }

  return <>
    <div
      className="h-[100dvh] overflow-hidden bg-white flex flex-col pb-0"
      dir="rtl"
    >
      <div className="flex flex-col flex-1 max-w-sm w-full mx-auto min-h-0 px-5 pt-25">
        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-[#0B834F] to-[#FFCC29]">
          <div className="relative bg-white rounded-2xl p-6">
            <div className="flex flex-row items-center gap-2">
              <img src="/course-code.png" alt="hint" width={32} className="mb-2" />
              <h1 className="text-xl font-bold leading-[1.4]">
                مسیر یادگیری برنامه‌نویسی وب
              </h1>
            </div>
            <p className="text-xs text-[#595959] leading-[20px] mt-4">
              این مسیر یادگیری برای تو شخصی‌سازی شده و بهت کمک می‌کنه از پایه شروع کنی و قدم‌به‌قدم تا حرفه‌ای شدن پیش بری. همیشه شروع سخته، اما اگه همین الان دوره اول رو تهیه کنی و فقط 2 دقیقه‌اش رو ببینی، ادامه مسیر برات هموار می‌شه!
              </p>
              <div className="flex flex-row items-center gap-2 mt-4">
              <img src="/teach.svg" alt="teaching" width={18} className="mb-2" />
              <p className="text-sm font-medium leading-[1.4] text-[#595959]">
              10 گام آموزشی
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </>;
}

export default RoadMap;
