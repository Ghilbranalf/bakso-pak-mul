"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";

interface AdminThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: true,
});

export const AdminThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("adminTheme") as Theme;
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
    } else {
      // Default to dark on localhost, light if on vercel production
      if (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
        setThemeState("light");
      } else {
        setThemeState("dark");
      }
    }
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("adminTheme", t);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      <div className={mounted && isDark ? "dark" : "light"}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => useContext(AdminThemeContext);
