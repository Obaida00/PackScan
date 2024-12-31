import * as React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./views/Index.jsx";
import DefaultLayout from "./components/Layout/DefaultLayout.jsx";
import Navigator from "./views/Navigator.jsx";
import StorageSelector from "./views/StorageSelector.jsx";
import StorageIndex from "./views/StorageIndex.jsx";
import Logs from "./views/Logs.jsx";
import Packing from "./views/Packing.jsx";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  // sometimes counting, barcoding, and decrumenting the count of items goes
  // insane and starts being excuted multiple times per click,
  // THATS BECAUSE of the strict mode that is enabled in dev env..
  // <StrictMode>
  //   <RouterProvider router={router} />
  // </StrictMode>

    // <div className="min-h-screen max-h-full bg-gray-800">
      <Router>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Navigator />} />
            <Route path="/monitor" element={<Index />} />
            <Route path="/storage" element={<StorageSelector />} />
            <Route
              path="/storage/almousoaa"
              element={<StorageIndex storageIndex={0} />}
            />
            <Route
              path="/storage/advanced"
              element={<StorageIndex storageIndex={1} />}
            />
            <Route
              path="/storage/almousoaa/logs"
              element={<Logs storageIndex={0} />}
            />
            <Route
              path="/storage/advanced/logs"
              element={<Logs storageIndex={1} />}
            />
            <Route
              path="/storage/almousoaa/:id"
              element={<Packing storageIndex={0} />}
            />
            <Route
              path="/storage/advanced/:id"
              element={<Packing storageIndex={1} />}
            />
          </Route>
        </Routes>
      </Router>
);
