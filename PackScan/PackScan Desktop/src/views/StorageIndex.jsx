import { useState } from "react";
import axiosClient from "../axios-client";
import StorageTable from "../components/TableComponents/Storage/StorageTable";
import SearchBox from "../components/SearchBox";

function StorageIndex({ storageIndex }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const storageCode = storageIndex == 0 ? "mo" : "ad";

    //change to searchActionOnChange
    //define searchActionOnSubmit
    //if searchActionOnSubmit is called and there is 1 result then redirect immediately
    const searchAction = (input) => {
        fetchOrders(`/invoices?st[eq]=${storageCode}&id[li]=${input}%`);
    };
    const fetchOrders = (uri) => {
        setLoading(true);
        axiosClient
            .get(uri)
            .then(({ data }) => {
                setOrders(data.data);
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                throw e;
            });
    };

    return (
        <>
            <div>
                <div className="flex justify-center">
                    <div className="flex justify-between w-[90%]">
                        {/* Back Button */}
                        <div className="flex justify-center py-4">
                            <div className="min-h-[5vh] w-[90%] flex justify-start">
                                <a
                                    href={"./"}
                                    type="button"
                                    className="text-slate-400 hover:text-slate-100 border border-slate-400 hover:bg-slate-700 focus:ring-2 focus:outline-none focus:ring-slate-300 font-semibold rounded-xl text-sm px-4 py-2 text-center flex items-center transition-all duration-75 group/start"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20px"
                                        viewBox="0 -960 960 960"
                                        className="fill-slate-500 group-hover/start:fill-slate-200 rotate-180"
                                    >
                                        <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                                    </svg>
                                    &nbsp;
                                    <p>Back</p>
                                </a>
                            </div>
                        </div>
                        {/* Logs */}
                        <div className="flex justify-center py-4">
                            <div className="min-h-[5vh] w-[90%] flex justify-end">
                                <a
                                    href={`logs`}
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
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* search */}
                <SearchBox action={searchAction} />

                {/* table */}
                <div className="flex justify-center">
                    <div className="w-[80vw] my-4 overflow-x-auto shadow-gray-950 shadow-md rounded-xl">
                        {loading ? (
                            <h1 className="py-3 text-center font-cocon text-xl text-slate-950">
                                Loading...
                            </h1>
                        ) : (
                            <StorageTable data={orders} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default StorageIndex;
