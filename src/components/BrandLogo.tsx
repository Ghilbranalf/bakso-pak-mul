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
    sm: "text-lg font-bold tracking-tight",
    md: "text-xl sm:text-2xl font-bold tracking-tight",
    lg: "text-2xl sm:text-3xl font-extrabold tracking-tight",
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Authentic BPM Monogram Emblem */}
      <div
        className={`${iconSizes} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          isLight
            ? "bg-white p-1 rounded-xl shadow-xs ring-1 ring-white/10"
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

      {/* Modern Culinary Display Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-display font-extrabold ${titleSizes} ${
            isLight ? "text-white" : "text-[#51000d]"
          }`}
        >
          Bakso Pak Mul
        </span>
        {withSubtitle && (
          <span
            className={`font-sans text-[9px] font-bold tracking-[0.24em] uppercase mt-1 ${
              isLight ? "text-amber-200/90" : "text-[#7a0019]"
            }`}
          >
            Kramat Jati • Est. 2000
          </span>
        )}
      </div>
    </div>
  );
}
