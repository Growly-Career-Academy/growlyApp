"use client";

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ...props
}) {
  const baseClasses =
    "bg-growly-green hover:bg-growly-green-hover active:bg-growly-green-active text-white rounded-xl px-4 py-3 text-base font-medium transition-colors duration-200 touch-manipulation w-full disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
