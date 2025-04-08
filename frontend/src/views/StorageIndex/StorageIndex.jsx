import * as React from "react";
import StorageTable from "./components/StorageTable.jsx";
import SearchBox from "../../shared/components/SearchBox.jsx";
import BackButton from "../../shared/components/BackButton.jsx";
import ArrowIcon from "../../shared/components/ArrowIcon.jsx";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Divider } from "antd";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../shared/contexts/ThemeContext.jsx";

function StorageIndex() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { isLightMode } = useTheme();
  const [invoices, setInvoices] = useState([]);
  const [importantInvoices, setImportantInvoices] = useState([]);
  const [loadingSearchResult, setLoadingSearchResult] = useState(false);
  const [loadingImportantInvoices, setLoadingImportantInvoices] =
    useState(false);
  const [storageName, setStorageName] = useState("");

  useEffect(() => {
    const fetchStorageName = async () => {
      try {
        const { data } = await ipcRenderer.invoke("fetch-storage-by-id", id);
        setStorageName(data.name);
      } catch (error) {
        console.error("Error fetching storages:", error);
      }
    };

    fetchStorageName();
    fetchImportantInvoices();
    fetchInvoices();
  }, []);

  const fetchImportantInvoices = async (input = "") => {
    setLoadingImportantInvoices(true);
    try {
      const filters = {
        invoiceId: String(input),
        storageId: id,
        status: "",
        date: "",
        isImportant: true,
        isMissing: false,
        pageNumber: 1,
        status: "Pending",
      };
      const data = await ipcRenderer.invoke("fetch-orders", filters);
      setImportantInvoices(data?.data || []);
    } catch (e) {
      throw e;
    } finally {
      setLoadingImportantInvoices(false);
    }
  };

  const searchAction = (input) => {
    fetchInvoices(input);
    fetchImportantInvoices(input);
  };

  const fetchInvoices = async (input = "") => {
    setLoadingSearchResult(true);
    try {
      const filters = {
        invoiceId: String(input),
        storageId: id,
        status: "",
        date: "",
        isImportant: false,
        isMissing: false,
        pageNumber: 1,
        status: "Pending",
      };
      const data = await ipcRenderer.invoke("fetch-orders", filters);

      setInvoices(data?.data || []);
    } catch (e) {
      throw e;
    } finally {
      setLoadingSearchResult(false);
    }
  };

  const basePackerValidator = async (_, value) => {
    if (isNaN(value) || !value) {
      return Promise.reject();
    }

    const packer = await ipcRenderer.invoke("fetch-packer", value);
    if (!packer.id) {
      return Promise.reject(new Error(t("packer.idNotValid")));
    }
    return packer;
  };

  const invoicesPackerValidator = async (_, value) => {
    await basePackerValidator(_, value);
    return Promise.resolve();
  };

  const importantInvoicesPackerValidator = async (_, value) => {
    const packer = await basePackerValidator(_, value);
    if (!packer.can_submit_important_invoices) {
      return Promise.reject(new Error(t("packer.cannotSubmit")));
    }
    return Promise.resolve();
  };

  return (
    <>
      <div>
        <div className="flex justify-between w-full px-5 py-4">
          <div className="flex justify-center">
            <div className="min-h-[5vh] w-full flex justify-start">
              <BackButton />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="h-full w-full flex justify-center text-center font-sans dark:text-slate-300 text-slate-800 text-xl">
              - {storageName && t("storage." + storageName)} -
            </div>
          </div>
          <div className="flex justify-center]">
            <div className="min-h-[5vh] w-full flex justify-end">
              <Link
                title={t("storage.log")}
                to={`logs`}
                type="button"
                className="text-slate-400 hover:text-slate-100 border border-slate-400 hover:bg-slate-700 focus:ring-2 focus:outline-none focus:ring-slate-300 font-semibold rounded-xl text-sm px-4 py-2 text-center flex items-center transition-all duration-75 group/start"
              >
                <p>{t("storage.log")}</p>
                &nbsp;
                <ArrowIcon
                  height="20px"
                  groupName="start"
                  reversed={true}
                ></ArrowIcon>
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
                <h1 className="py-3 text-center font-cocon text-xl dark:text-slate-200 text-slate-950">
                  {t("common.loading")}
                </h1>
              ) : (
                <StorageTable
                  invoices={invoices}
                  rowModalIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="gray"
                    >
                      <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                    </svg>
                  }
                  packerValidator={invoicesPackerValidator}
                />
              )}
            </div>

            <Divider />

            <div className="my-6">
              <div className="flex items-center gap-5">
                <span className="dark:text-slate-50 text-slate-800 text-xl font-sans font-medium">
                  {t("invoice.importantInvoices")}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 900"
                  width="24px"
                  fill={isLightMode ? "#1e293b" : "#e8eaed"}
                  className="rtl:rotate-180"
                >
                  <path d="M600-160H160q-25 0-36-22t4-42l192-256-192-256q-15-20-4-42t36-22h440q19 0 36 8.5t28 23.5l180 240q16 21 16 48t-16 48L664-192q-11 15-28 23.5t-36 8.5Zm-360-80h360l180-240-180-240H240l144 192q16 21 16 48t-16 48L240-240Zm270-240Z" />
                </svg>
              </div>
              <div className="w-[80vw] my-4 overflow-x-auto shadow-gray-950 shadow-md rounded-xl">
                {loadingImportantInvoices ? (
                  <h1 className="py-3 text-center font-cocon text-xl dark:text-slate-200 text-slate-950">
                    {t("common.loading")}
                  </h1>
                ) : (
                  <StorageTable
                    invoices={importantInvoices}
                    rowModalIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#db5d5b"
                      >
                        <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm280-590q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z" />
                      </svg>
                    }
                    packerValidator={importantInvoicesPackerValidator}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StorageIndex;
