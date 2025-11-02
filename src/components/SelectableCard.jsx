// components/SelectableCard.jsx
export default function SelectableCard({ checked = false, onChange, children, className = "" }) {
    return (
      <label className="block cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <div
          className={[
            "w-full rounded-2xl border px-1 py-5 text-right transition-colors duration-150",
          // انتخاب‌شده
            checked ? "border-[#0B834F] bg-[#E7F3ED]" :
          // انتخاب‌نشده
            "border-[#EAEAEA] bg-white hover:border-[#0B834F]/60",
            className,
          ].join(" ")}
        >
          {children}
        </div>
      </label>
    );
  }
  