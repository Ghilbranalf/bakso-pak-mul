import React from "react";

interface BrandLogoProps {
  className?: string;
  variant?: "light" | "dark" | "monochrome";
  size?: "sm" | "md" | "lg";
  withSubtitle?: boolean;
}

export default function BrandLogo({
  className = "",
  variant = "dark",
  size = "md",
  withSubtitle = true,
}: BrandLogoProps) {
  const isLight = variant === "light";

  const iconDimensions = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-9 h-9 rounded-xl",
    lg: "w-11 h-11 rounded-xl",
  }[size];

  const titleSize = {
    sm: "text-base font-bold tracking-tight",
    md: "text-lg font-extrabold tracking-tight",
    lg: "text-xl font-black tracking-tight",
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Modern Red Bowl Mark */}
      <div
        className={`${iconDimensions} flex items-center justify-center shrink-0 ${
          isLight
            ? "bg-white text-red-600"
            : "bg-red-600 text-white shadow-sm"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          {/* Steam */}
          <path
            d="M8.5 4.5C8 5.8 9.5 6.5 9 7.8M12 3.5C11.5 5 13 6 12.5 7.5M15.5 4.5C15 5.8 16.5 6.5 16 7.8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Modern Bowl */}
          <path
            d="M4.5 10C4.5 10 5.2 18 12 18C18.8 18 19.5 10 19.5 10H4.5Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* Rim */}
          <path
            d="M3.5 10H20.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          {/* Meatballs */}
          <circle cx="9.5" cy="11.5" r="1.8" fill="currentColor" />
          <circle cx="14.5" cy="11.5" r="1.8" fill="currentColor" />
          {/* Base */}
          <path
            d="M9 18L8.5 20H15.5L15 18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <span
          className={`${titleSize} ${
            isLight ? "text-white" : "text-slate-900"
          }`}
        >
          Bakso Pak Mul
        </span>
        {withSubtitle && (
          <span
            className={`text-[10px] font-medium tracking-wide mt-0.5 ${
              isLight ? "text-slate-300" : "text-slate-500"
            }`}
          >
            Kramat Jati • Est. 2000
          </span>
        )}
      </div>
    </div>
  );
}
