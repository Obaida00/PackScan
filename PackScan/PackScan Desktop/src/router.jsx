import { createBrowserRouter } from "react-router-dom";
import Index from "./views/Index";
import DefaultLayout from "./components/Layout/DefaultLayout";
import Navigator from "./views/Navigator";
import StorageSelector from "./views/StorageSelector";
import StorageIndex from "./views/StorageIndex";
import Logs from "./views/Logs";
import Packing from "./views/Packing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        // path selector
        path: "/",
        element: <Navigator />,
      },
      {
        // monitor view
        path: "/monitor",
        element: <Index />,
      },
      {
        // storage chooser
        path: "/storage",
        element: <StorageSelector />
      },
      {
        // Almousoaa Storage
        path: "/storage/almousoaa",
        element: <StorageIndex storageIndex={0} />
      },
      {
        // Advanced Storage
        path: "/storage/advanced",
        element: <StorageIndex storageIndex={1} />
      },
      {
        // Almousoaa Storage Logs
        path: "/storage/almousoaa/logs",
        element: <Logs storageIndex={0} />
      },
      {
        // Advanced Storage Logs
        path: "/storage/advanced/logs",
        element: <Logs storageIndex={1} />
      },
      {
        // Almousoaa Storage Packing
        path: "/storage/almousoaa/:id",
        element: <Packing storageIndex={0}/>
      },
      {
        // Almousoaa Storage Packing
        path: "/storage/advanced/:id",
        element: <Packing storageIndex={1}/>
      }
    ],
  },
]);

export default router;
