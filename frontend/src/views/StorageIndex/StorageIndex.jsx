import * as React from "react";
import StorageTable from "./components/StorageTable.jsx";
import SearchBox from "../../shared/components/SearchBox.jsx";
import BackButton from "../../shared/components/BackButton.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Divider } from "@mui/material";

function StorageIndex({ storageIndex }) {
  const [orders, setOrders] = useState([]);
  const [importantOrders, setImportantOrders] = useState([]);
  const [loadingSearchResult, setLoadingSearchResult] = useState(false);
  const [loadingImportantData, setLoadingImportantData] = useState(false);

  const storageCode = storageIndex == 0 ? "mo" : "ad";
  const storageName = storageIndex == 0 ? "Almousoaa" : "Advanced";

  useEffect(() => {
    fetchImportantData(storageCode);
  }, []);

  const fetchImportantData = async (storageCode) => {
    setLoadingImportantData(true);
    try {
      // todo
      // const data = await ipcRenderer.invoke(
      //   "fetch-storage-orders",
      //   1,
      //   storageCode,
      //   true
      // );
      const data = {};
      setImportantOrders(data?.data || []);
    } catch (e) {
      throw e;
    } finally {
      setLoadingImportantData(false);
    }
  };

  const searchAction = (input) => {
    fetchOrders(storageCode, input);
  };

  const fetchOrders = async (storageCode, input) => {
    setLoadingSearchResult(true);
    try {
      const filters = {
        invoiceId: String(input),
        storage: storageCode,
        status: "",
        date: "",
        // todo add imp[eq]=0
      };
      const data = await ipcRenderer.invoke("fetch-orders", filters);

      setOrders(data?.data || []);
    } catch (e) {
      throw e;
    } finally {
      setLoadingSearchResult(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between w-full px-5 py-4">
          {/* Back Button */}
          <div className="flex justify-center">
            <div className="min-h-[5vh] w-full flex justify-start">
              <BackButton />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="h-full w-full flex justify-center text-center font-sans text-slate-300 text-xl">
              - {storageName} -
            </div>
          </div>
          {/* Logs */}
          <div className="flex justify-center]">
            <div className="min-h-[5vh] w-full flex justify-end">
              <Link
                to={`logs`}
                type="button"
                className="text-slate-400 hover:text-slate-100 border border-slate-400 hover:bg-slate-700 focus:ring-2 focus:outline-none focus:ring-slate-300 font-semibold rounded-xl text-sm px-4 py-2 text-center flex items-center transition-all duration-75 group/start"
              >
                <p>Logs</p>
                &nbsp;
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  className="fill-slate-500 group-hover/start:fill-slate-200"
                >
                  <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* search */}
        <SearchBox action={searchAction} eraseOnPaste={false} />

        {/* table */}
        <div className="flex justify-center ">
          <div className="my-2">
            <div className="w-[80vw] my-4 overflow-x-auto shadow-gray-950 shadow-md rounded-xl">
              {loadingSearchResult ? (
                <h1 className="py-3 text-center font-cocon text-xl text-slate-950">
                  Loading...
                </h1>
              ) : (
                <StorageTable data={orders} />
              )}
            </div>
            <Divider color="#1f2937" />

            {!loadingImportantData && importantOrders.length > 0 && (
              <div className="my-4">
                <div className="flex items-center gap-5">
                  <span className="text-slate-50 text-xl font-sans font-medium">
                    Important Orders
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 900"
                    width="24px"
                    fill="#e8eaed"
                  >
                    <path d="M600-160H160q-25 0-36-22t4-42l192-256-192-256q-15-20-4-42t36-22h440q19 0 36 8.5t28 23.5l180 240q16 21 16 48t-16 48L664-192q-11 15-28 23.5t-36 8.5Zm-360-80h360l180-240-180-240H240l144 192q16 21 16 48t-16 48L240-240Zm270-240Z" />
                  </svg>
                </div>
                <div className="w-[80vw] my-4 overflow-x-auto shadow-gray-950 shadow-md rounded-xl">
                  <StorageTable data={importantOrders} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StorageIndex;
