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
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { LoadingProvider } from "./shared/contexts/LoadingContext.jsx";
import LoadingOverlay from "./shared/components/LoadingOverlay.jsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
        },
      },
    },
  },
});

const root = createRoot(document.getElementById("root"));
root.render(
  // sometimes counting, barcoding, and decrumenting the count of items goes
  // insane and starts being excuted multiple times per click,
  // THATS BECAUSE of the strict mode that is enabled in dev env..
  // <StrictMode>
  //   <RouterProvider router={router} />
  // </StrictMode>

  // <div className="min-h-screen max-h-full bg-gray-800">
  <ThemeProvider theme={theme}>
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
          </Route>
        </Routes>
      </Router>
    </LoadingProvider>
  </ThemeProvider>
);
