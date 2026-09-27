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
  
  const iconSize = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  const titleSize = {
    sm: "text-base font-bold",
    md: "text-lg font-bold tracking-tight",
    lg: "text-xl font-extrabold tracking-tight",
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Artisanal Culinary Emblem */}
      <div
        className={`${iconSize} rounded-xl flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden ${
          isLight
            ? "bg-amber-400 text-[#540B13]"
            : "bg-[#540B13] text-amber-300 ring-1 ring-white/10"
        }`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          {/* Steam wisps */}
          <path
            d="M15 8C14 10 16 11 15 13M20 6C19 8.5 21 10 20 12M25 8C24 10 26 11 25 13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.75"
          />
          {/* Traditional Bakso Bowl */}
          <path
            d="M8 18C8 18 9 29 20 29C31 29 32 18 32 18H8Z"
            fill="currentColor"
            fillOpacity={isLight ? "0.2" : "0.35"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Bowl Rim */}
          <path
            d="M6 18C6 17 8 16 20 16C32 16 34 17 34 18"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Meatballs inside */}
          <circle cx="16" cy="19" r="3" fill="currentColor" />
          <circle cx="24" cy="19" r="3" fill="currentColor" />
          <circle cx="20" cy="16.5" r="2.5" fill="currentColor" />
          {/* Bowl Pedestal */}
          <path
            d="M15 29L14 32H26L25 29"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <span
          className={`${titleSize} ${
            isLight ? "text-white" : "text-[#18181B]"
          }`}
        >
          Bakso Pak Mul
        </span>
        {withSubtitle && (
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase mt-1 ${
              isLight ? "text-white/60" : "text-amber-800/80"
            }`}
          >
            Kramat Jati • Est. 2000
          </span>
        )}
      </div>
    </div>
  );
}
