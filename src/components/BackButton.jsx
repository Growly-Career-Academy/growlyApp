"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="ml-4 self-end mt-5 mb-10 flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#111827]"
    >
      <span className="text-sm font-normal text-[#595959]">بازگشت</span>
      <img src="/Arrow-Up.svg" alt="بازگشت" />
    </button>
  );
}
