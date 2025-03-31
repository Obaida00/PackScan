import * as React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./views/Index/Index.jsx";
import DefaultLayout from "./views/Layout/DefaultLayout.jsx";
import Navigator from "./views/Navigator/Navigator.jsx";
import StorageSelector from "./views/StorageSelector/StorageSelector.jsx";
import StorageIndex from "./views/StorageIndex/StorageIndex.jsx";
import StorageLog from "./views/StorageLog/StorageLog.jsx";
import Packing from "./views/Packing/Packing.jsx";
import Settings from "./views/Settings/Settings.jsx";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { LoadingProvider } from "./shared/contexts/LoadingContext.jsx";
import { ThemeProvider, useTheme } from "./shared/contexts/ThemeContext.jsx";
import LoadingOverlay from "./shared/components/LoadingOverlay.jsx";
import { useEffect, useState } from "react";
import { initializeLanguage } from "./i18n.js";
import "./i18n.js";
import { ConfigProvider, theme } from "antd";
import { defaultTheme } from "antd/es/theme/context.js";
import { blue } from "@mui/material/colors";

initializeLanguage();

const DynamicThemeProvider = ({ children }) => {
  const [muiTheme, setMuiTheme] = useState(null);
  const { isLightMode } = useTheme();
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const settings = await ipcRenderer.invoke("get-settings");
        const mode = settings?.theme || "dark";

        updateMuiTheme(mode);
      } catch (error) {
        console.error("Failed to load theme setting:", error);
        updateMuiTheme("dark");
      }
    };

    loadTheme();

    const handleThemeChange = (event, newTheme) => {
      updateMuiTheme(newTheme);
    };

    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  const updateMuiTheme = (mode) => {
    const newTheme = createTheme({
      palette: {
        mode: mode,
        primary: {
          main: mode === "light" ? "#1976d2" : "#90caf9",
        },
        secondary: {
          main: mode === "light" ? "#dc004e" : "#f48fb1",
        },
        background: {
          default: mode === "light" ? "#f8fafc" : "#1e293b",
          paper: mode === "light" ? "#ffffff" : "#0f172a",
        },
        text: {
          primary: mode === "light" ? "#1e293b" : "#f8fafc",
          secondary: mode === "light" ? "#475569" : "#e2e8f0",
        },
      },
      components: {
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: "16px",
              backgroundColor: mode === "light" ? "#ffffff" : "#1e293b",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: mode === "light" ? "#ffffff" : "#1e293b",
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: mode === "light" ? "#cbd5e1" : "#334155",
                },
                "&:hover fieldset": {
                  borderColor: mode === "light" ? "#94a3b8" : "#64748b",
                },
                "&.Mui-focused fieldset": {
                  borderColor: mode === "light" ? "#3b82f6" : "#60a5fa",
                },
              },
            },
          },
        },
      },
    });

    setMuiTheme(newTheme);
  };
  const { darkAlgorithm, defaultAlgorithm } = theme;
  if (!muiTheme) {
    return null;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isLightMode ? defaultAlgorithm : darkAlgorithm,
        components: {
          Select: {
            selectorBg: isLightMode ? "#eeeeee" : "#1f2937",
          },
          Button: {
            colorBgContainer: isLightMode? "#eeeeee" : "#1f2937",
          },
          DatePicker: {
            colorBgContainer: isLightMode? "" : "#1f2937"
          },

        },
      }}
    >
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ConfigProvider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <DynamicThemeProvider>
      <LoadingProvider>
        <LoadingOverlay></LoadingOverlay>
        <Router>
          <Routes>
            <Route path="/" element={<DefaultLayout />}>
              <Route index element={<Navigator />} />
              <Route path="/monitor" element={<Index />} />
              <Route path="/storage" element={<StorageSelector />} />
              <Route path="/storage/:id" element={<StorageIndex />} />
              <Route path="/storage/:id/logs" element={<StorageLog />} />
              <Route path="/packing/:id" element={<Packing />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </LoadingProvider>
    </DynamicThemeProvider>
  </ThemeProvider>
);
