import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  isLightMode: false,
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const settings = await ipcRenderer.invoke("get-settings");
        if (settings && settings.theme) {
          console.log("settings theme context theme to.. ", settings.theme);
          setTheme(settings.theme);
        }
      } catch (error) {
        console.error("Failed to load theme setting:", error);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    ipcRenderer.invoke("save-settings", { theme: newTheme });
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isLightMode: theme === "light" }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
