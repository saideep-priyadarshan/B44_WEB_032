import { createContext, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const storedPref = localStorage.getItem("theme");
    if (storedPref && ["light", "dark"].includes(storedPref)) {
      return storedPref;
    }
    return "system";
  });

  const applyTheme = useCallback((effectiveTheme) => {
    const root = window.document.documentElement;
    if (effectiveTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    let effectiveTheme = theme;

    const handleSystemThemeChange = (e) => {
      if (theme === "system") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (theme === "system") {
      effectiveTheme = mediaQuery.matches ? "dark" : "light";
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }

    applyTheme(effectiveTheme);

    if (theme === "light" || theme === "dark") {
      localStorage.setItem("theme", theme);
    } else {
      localStorage.removeItem("theme");
    }

    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme, applyTheme]);

  const cycleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === "light") return "dark";
      if (prevTheme === "dark") return "system";
      return "light";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
