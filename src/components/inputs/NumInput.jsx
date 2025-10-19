"use client";
import Input from "@/components/inputs/Input";

export default function NumInput({ value, onChange, onEdit }) {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={value}                  // 👈 شماره از props میاد
        onChange={onChange}
        inputMode="numeric"
        pattern="[0-9]*"
        className="pr-16 text-left placeholder:text-left"
        dir="ltr"                      // اعداد همیشه چپ‌چین
      />
      <button
        type="button"
        className="absolute inset-y-0 right-3 flex items-center text-blue-600 text-xs"
        onClick={onEdit}
      >
        تغییر
      </button>
    </div>
  );
}
