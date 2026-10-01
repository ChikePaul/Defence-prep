import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "emerald" | "oxford" | "ivory";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("siwes_app_theme");
    return (saved as Theme) || "emerald";
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("siwes_app_theme", t);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-emerald", "theme-oxford", "theme-ivory");
    root.classList.add(`theme-${theme}`);
    root.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
