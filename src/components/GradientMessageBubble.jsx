import React, { useState, useRef, useLayoutEffect } from "react";

const GradientMessageBubble = ({ children }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const r = 16;
  const tailWidth = 24;
  const tailHeight = 20;
  const tipRoundness = 3;
  const strokeWidth = 1.5;
  const sw = strokeWidth / 2;

  const { width: w, height: h } = dimensions;

  const pathData =
    w && h
      ? `
      M ${r} ${sw}
      H ${w - r}
      Q ${w - sw} ${sw} ${w - sw} ${r}
      V ${h - r}
      Q ${w - sw} ${h - sw} ${w - r} ${h - sw}
      H ${w / 2 + tailWidth / 2}
      L ${w / 2 + tipRoundness * 0.8} ${h + tailHeight - tipRoundness * 0.8}
      Q ${w / 2} ${h + tailHeight} ${
          w / 2 - tipRoundness * 0.8
        } ${h + tailHeight - tipRoundness * 0.8}
      L ${w / 2 - tailWidth / 2} ${h - sw}
      H ${r}
      Q ${sw} ${h - sw} ${sw} ${h - r}
      V ${r}
      Q ${sw} ${sw} ${r} ${sw}
      Z
    `
      : "";

  return (
    // 🔹 این div دیگه padding نداره؛ فقط عرضش = عرض ستون والدته
    <div className="relative w-full max-w-md mx-auto mt-10">
      {/* SVG دقیقا هم‌عرض containerRef خواهد بود */}
      <svg
        className="absolute top-0 left-0 overflow-visible pointer-events-none"
        style={{ width: w, height: h + tailHeight + strokeWidth }}
      >
        <defs>
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B834F" />
            <stop offset="100%" stopColor="#FFCC29" />
          </linearGradient>
        </defs>
        <path
          d={pathData}
          fill="white"
          stroke="url(#borderGradient)"
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* 🔹 padding اینجا میاد، روی همون دیوی که اندازه گرفته می‌شه */}
      <div ref={containerRef} className="relative z-10 px-7 py-10">
        {children}
      </div>
    </div>
  );
};

export default GradientMessageBubble;
