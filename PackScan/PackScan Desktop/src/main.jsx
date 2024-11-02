import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./index.css";

createRoot(document.getElementById("root")).render(
    // sometimes counting, barcoding, and decrumenting the count of items goes
    // insane and starts being excuted multiple times per click,
    // THATS BECAUSE of the strict mode that is enabled in dev env..
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
