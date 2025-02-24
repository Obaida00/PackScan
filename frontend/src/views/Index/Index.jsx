import * as React from "react";
import { useEffect, useState } from "react";
import { Pagination } from "flowbite-react";
import IndexTable from "./components/IndexTable.jsx";
import BackButton from "../../shared/components/BackButton.jsx";
import ReloadButton from "../../shared/components/ReloadButton.jsx";
import IndexInvoiceFilter from "./components/IndexInvoiceFilter.jsx";

function Index() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagingMeta, setPagingMeta] = useState();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    getOrders();
  }, [filters]);

  const getOrders = async (page = 1) => {
    setLoading(true);
    try {
      const newFilters = { ...filters, pageNumber: page };
      const data = await ipcRenderer.invoke("fetch-orders", newFilters);
      setOrders(data.data);
      setPagingMeta(data.meta);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    setFilters(filters);
  };

  // Compute min and max IDs for the current page.
  const minId =
    orders.length > 0 ? Math.min(...orders.map((obj) => obj.id)) : 0;
  const maxId =
    orders.length > 0 ? Math.max(...orders.map((obj) => obj.id)) : 0;

  return (
    <>
      <div>
        <div className="flex flex-col items-center pt-2 gap-4">
          <div className="min-h-[5vh] w-[90vw] flex gap-5">
            <BackButton />
            <ReloadButton callback={getOrders} />
          </div>
          <div className="w-[85vw]">
            <IndexInvoiceFilter onChange={handleFilterChange} />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[80vw] my-4 overflow-x-auto shadow-gray-950 shadow-md rounded-xl">
            {loading ? (
              <h1 className="py-3 text-center font-cocon text-xl text-slate-950">
                Loading...
              </h1>
            ) : (
              <IndexTable data={orders} minId={minId} maxId={maxId} />
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
              onPageChange={getOrders}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Index;
