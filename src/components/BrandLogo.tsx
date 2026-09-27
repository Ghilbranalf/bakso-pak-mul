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

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  const titleSizes = {
    sm: "text-base font-extrabold tracking-tight",
    md: "text-lg sm:text-xl font-black tracking-tight",
    lg: "text-xl sm:text-2xl font-black tracking-tight",
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Authentic BPM Monogram Logo */}
      <div
        className={`${iconSizes} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
          isLight
            ? "bg-white p-1 rounded-xl shadow-sm ring-1 ring-white/20"
            : "p-0.5"
        }`}
      >
        <img
          src="/images/logo.png"
          alt="Bakso Pak Mul (BPM) Logo"
          className={`w-full h-full object-contain ${
            isLight ? "" : "mix-blend-multiply drop-shadow-xs"
          }`}
        />
      </div>

      {/* Classic, Professional Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`${titleSizes} ${
            isLight ? "text-white" : "text-[#51000d]"
          }`}
        >
          Bakso Pak Mul
        </span>
        {withSubtitle && (
          <span
            className={`text-[9.5px] font-bold tracking-[0.16em] uppercase mt-1 ${
              isLight ? "text-slate-300" : "text-[#7a0019]"
            }`}
          >
            Kramat Jati • Est. 2000
          </span>
        )}
      </div>
    </div>
  );
}
