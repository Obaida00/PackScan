import * as React from "react";
import { useEffect, useState } from "react";
import { Pagination } from "flowbite-react";
import axiosClient from "../axios-client.js";
import IndexTable from "../components/TableComponents/Index/IndexTable.jsx";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagingMeta, setPagingMeta] = useState();

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async (page = 1) => {
    setLoading(true);
    try {
      const data = await ipcRenderer.invoke("fetch-orders", page);
      setOrders(data.data);
      setPagingMeta(data.meta);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-center pt-2">
          <div className="min-h-[5vh] w-[90vw] flex">
            <button onClick={getOrders} className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="40px"
                viewBox="0 -960 960 960"
                fill="#e8eaed"
              >
                <path d="M480-280q-73 0-127.5-45.5T284-440h62q13 44 49.5 72t84.5 28q58 0 99-41t41-99q0-58-41-99t-99-41q-29 0-54 10.5T382-580h58v60H280v-160h60v57q27-26 63-41.5t77-15.5q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-120q-33 0-56.5-23.5T120-200v-160h80v160h160v80H200Zm400 0v-80h160v-160h80v160q0 33-23.5 56.5T760-120H600ZM120-600v-160q0-33 23.5-56.5T200-840h160v80H200v160h-80Zm640 0v-160H600v-80h160q33 0 56.5 23.5T840-760v160h-80Z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[80vw] my-4 overflow-x-auto shadow-gray-950 shadow-md rounded-xl">
            {loading ? (
              <h1 className="py-3 text-center font-cocon text-xl text-slate-950">
                Loading...
              </h1>
            ) : (
              <IndexTable data={orders} />
            )}
          </div>
        </div>

        {/* Pagination Navigators */}
        <div className="flex justify-center pb-10">
          {!loading && (
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
