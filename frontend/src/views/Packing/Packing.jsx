import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PackingTable from "./components/PackingTable.jsx";
import SearchBox from "../../shared/components/SearchBox.jsx";
import BackButton from "../../shared/components/BackButton.jsx";
import SubmitInvoiceButton from "./components/SubmitInvoiceButton.jsx";
import "../../shared/styles/Loader.css";
import { usePacking } from "../../shared/hooks/usePacking.jsx";
import { useSFX } from "../../shared/hooks/useSFX.jsx";
import { useLoadingContext } from "../../shared/contexts/LoadingContext.jsx";

function Packing() {
  const { id } = useParams();
  const { state } = useLocation();
  const { packerId } = state || {};

  const {
    invoice,
    items,
    loading,
    canSubmit,
    getItems,
    incrementItem,
    decrementItem,
  } = usePacking(id);

  const { setProgressLoading } = useLoadingContext();

  const { playCanSubmitSound } = useSFX();

  const handleBarcode = (input) => {
    const numericBarcode = Number(input);
    incrementItem(numericBarcode);
  };

  const submit = (numberOfPackages) => {
    setProgressLoading(true);
    ipcRenderer
      .invoke("submit-order", {
        id: id,
        packerId: packerId,
        numberOfPackages: numberOfPackages,
        manually: false,
      })
      .then(async () => {
        playCanSubmitSound();
        setProgressLoading(false);
        await ipcRenderer.invoke("go-back");
      });
  };

  const reset = () => {
    getItems();
  };

  if (!packerId) {
    return (
      <>
        <div>Error: Missing required Packer ID</div>
        <Link to={"/"}>home</Link>
      </>
    );
  }

  return (
    <>
      <div>
        <div className="flex justify-between w-full px-5 py-4">
          <div className="flex justify-center">
            <div className="min-h-[5vh] w-full flex justify-start">
              <BackButton />
            </div>
          </div>
          <div className="flex justify-center px-4">
            <div className="w-full self-center font-sans text-xl text-slate-300">
              {invoice.invoice_id && `- ${invoice.invoice_id} -`}
            </div>
          </div>
        </div>

        <SearchBox action={handleBarcode} eraseOnPaste={true} />

        <div className="flex justify-center my-2">
          <div className="w-[80vw] my-4 overflow-x-auto shadow-gray-950 shadow-md rounded-xl">
            {loading ? (
              <h1 className="py-3 text-center font-cocon text-xl text-slate-950">
                Loading...
              </h1>
            ) : (
              <PackingTable items={items} decrementFunc={decrementItem} />
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-[90%] flex justify-between px-5">
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
            <SubmitInvoiceButton
              packerId={packerId}
              invoice={invoice}
              action={submit}
              disabled={!canSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Packing;
