import Image from "next/image";
import { useMemo } from "react";

// Sleek Stepper — Mobile-friendly version (logo on right, steps fill from left)
export default function SleekStepper({ current = 1, steps = 3, logoSrc = "/logo.svg", className = "" }) {
  const safeCurrent = Math.min(Math.max(current, 1), steps);
  const segments = useMemo(() => Array.from({ length: steps }), [steps]);

  return (
    <div
      className={`w-full flex items-center justify-center gap-4 sm:gap-4 select-none ${className}`}
      aria-label={`Progress: step ${safeCurrent} of ${steps}`}
    >
      {/* logo */}
      <div className="shrink-0 mr-2 sm:mr-4">
        <Image
          src={logoSrc}
          alt="Brand Logo"
          width={30}
          height={30}
          className="object-contain sm:w-[36px] sm:h-[36px]"
        />
      </div>

      {/* segments */}
      <div className="flex items-center gap-2 sm:gap-4">
        {segments.map((_, i) => {
          const isFilled = i >= (steps - safeCurrent);
          return (
            <span
              key={i}
              className={`h-2 w-14 sm:w-24 md:w-28 rounded-full transition-all duration-300 ${
                isFilled ? "bg-[#0B834F]" : "bg-[#EAEAEA]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

