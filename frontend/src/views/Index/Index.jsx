import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { Pagination } from "flowbite-react";
import IndexTable from "./components/IndexTable.jsx";
import BackButton from "../../shared/components/BackButton.jsx";
import ReloadButton from "../../shared/components/ReloadButton.jsx";
import IndexInvoiceFilter from "./components/IndexInvoiceFilter.jsx";
import { useTranslation } from "react-i18next";

function Index() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagingMeta, setPagingMeta] = useState();
  const [filters, setFilters] = useState({});

  const getInvoices = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const newFilters = { ...filters, pageNumber: page };
        const data = await ipcRenderer.invoke("fetch-orders", newFilters);
        setInvoices(data.data);
        setPagingMeta(data.meta);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getInvoices();
    }, 999999);
    return () => clearInterval(intervalId);
  }, [getInvoices]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <div>
        <div className="flex flex-col items-center pt-2 gap-4">
          <div className="min-h-[5vh] w-[90vw] flex gap-5">
            <BackButton />
            <ReloadButton callback={getInvoices} />
          </div>
          <div className="w-[85vw]">
            <IndexInvoiceFilter onChange={handleFilterChange} />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[80vw] my-4 overflow-x-auto shadow-gray-950 shadow-md rounded-xl">
            {loading ? (
              <h1 className="py-3 text-center font-cocon text-xl dark:text-slate-200 text-slate-950">
                {t("common.loading")}
              </h1>
            ) : (
              <IndexTable invoices={invoices} reloadInvoices={getInvoices} />
            )}
          </div>
        </div>

        {/* Pagination Navigators */}
        <div className="flex justify-center pb-10">
          {!loading && pagingMeta && (
            <Pagination
              className="w-fit"
              currentPage={pagingMeta.current_page}
              totalPages={pagingMeta.last_page}
              onPageChange={getInvoices}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Index;
