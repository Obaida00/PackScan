import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useParams } from "react-router-dom";
import PackingTable from "../components/TableComponents/Packing/PackingTable";
import SearchBox from "../components/SearchBox";

function Packing() {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        setLoading(true);
        axiosClient
            .get(`/invoices/${id}`)
            .then(({ data }) => {
                //adding a current counter set to 0 to each item
                var items = data.data.items.map((v) => {
                    return {
                        ...v,
                        count: 0,
                        colorMain: "#1f2937",
                        colorSecond: "#1c64f2",
                    };
                });

                //update items state
                setItems(items);
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                throw e;
            });
    };

    const barcode = (input) => {
        var item = items.find((x) => x.barcode == input);
        if (item) {
            setItems((prevState) => {
                const updatedItems = [...prevState]; //create a copy
                var i = updatedItems.indexOf(item); //index of the item that needs updating
                updatedItems[i].count += 1; //update index in the copied array

                //if completed
                if (updatedItems[i].count == updatedItems[i].totalCount) {
                    updatedItems[i].colorMain = "#03543f";
                    updatedItems[i].colorSecond = "#0e9f6e";
                }

                //if overshoot
                if (updatedItems[i].count > updatedItems[i].totalCount) {
                    updatedItems[i].colorMain = "#c81e1e";
                    updatedItems[i].colorSecond = "#771d1d";
                }

                return updatedItems;
            });
        }
    };

    const decrement = (input) => {
        var item = items.find((x) => x.barcode == input);
        if (item) {
            setItems((prevState) => {
                const updatedItems = [...prevState]; //create a copy
                var i = updatedItems.indexOf(item); //index of the item that needs updating
                updatedItems[i].count = Math.max(updatedItems[i].count - 1, 0); //update index in the copied array

                //if completed
                if (updatedItems[i].count == updatedItems[i].totalCount) {
                    updatedItems[i].colorMain = "#03543f";
                    updatedItems[i].colorSecond = "#0e9f6e";
                }

                //if undershoot
                if (updatedItems[i].count < updatedItems[i].totalCount) {
                    updatedItems[i].colorMain = "#1f2937";
                    updatedItems[i].colorSecond = "#1c64f2";
                }

                return updatedItems;
            });
        }
    };

    const submit = () => {};
    const reset = () => {
        var newItems = [...items];
        for (var i = 0; i < newItems.length; i++) {
            newItems.at(i).count = 0;
            newItems.at(i).colorMain = "#1f2937";
            newItems.at(i).colorSecond = "#1c64f2";
        }
        setItems(newItems);
    };
    const submitEnable = () => {
        return true;
    };
    const backWithAlert = () => {
        alert("progress will not be saved");
        //if alert submit then clear and go back
        //if not cancel
    };
    return (
        <>
            <div>
                {/* Back Button */}
                <div className="flex justify-center py-4">
                    <div className="min-h-[5vh] w-[90vw] flex justify-start">
                        <a
                            href="./"
                            // onClick={backWithAlert}
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

                {/* search */}
                <SearchBox action={barcode} />

                <div className="flex justify-center">
                    <div className="w-[80vw] my-4 overflow-x-auto shadow-gray-950 shadow-md rounded-xl">
                        {loading ? (
                            <h1 className="py-3 text-center font-cocon text-xl text-slate-950">
                                Loading...
                            </h1>
                        ) : (
                            <PackingTable
                                data={items}
                                decrementFunc={decrement}
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="w-[90%] flex justify-between px-5">
                        {/* Reset Button */}
                        <div className="flex justify-center py-4">
                            <div className="min-h-[5vh] w-[90%] flex justify-end">
                                <button
                                    onClick={reset}
                                    className="text-slate-100 border border-slate-400 bg-red-900 focus:ring-2 focus:outline-none focus:ring-slate-300 font-semibold rounded-xl text-sm px-4 py-2 text-center flex items-center transition-all duration-75"
                                >
                                    <p>Reset</p>
                                </button>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <div className="flex justify-center py-4">
                            <div className="min-h-[5vh] w-[90%] flex justify-end">
                                <button
                                    onClick={submit}
                                    className="disabled:bg-slate-600 disabled:text-slate-400 text-slate-100 border border-slate-400 bg-green-700 focus:ring-2 focus:outline-none focus:ring-slate-300 font-semibold rounded-xl text-sm px-4 py-2 text-center flex items-center transition-all duration-75"
                                    disabled={submitEnable()}
                                >
                                    <p>Submit</p>
                                    &nbsp;
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20px"
                                        viewBox="0 -960 960 960"
                                        className="fill-slate-200"
                                    >
                                        <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Packing;
