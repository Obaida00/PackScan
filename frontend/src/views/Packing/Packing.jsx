import React, { useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PackingTable from "./components/PackingTable.jsx";
import SearchBox from "../../shared/components/SearchBox.jsx";
import BackButton from "../../shared/components/BackButton.jsx";
import SubmitInvoiceButton from "./components/SubmitInvoiceButton.jsx";
import "../../shared/styles/Loader.css";
import { usePacking } from "../../shared/hooks/usePacking.jsx";
import { useSFX } from "../../shared/hooks/useSFX.jsx";
import { useLoadingContext } from "../../shared/contexts/LoadingContext.jsx";
import { useTranslation } from "react-i18next";
import { Button } from "antd";

function Packing() {
  const { t } = useTranslation();
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

  const isSubmitted = useRef(false);

  useEffect(() => {
    ipcRenderer.invoke("mark-invoice-in-progress", { invoiceId: id, packerId: packerId });

    return () => {
      if (!isSubmitted.current) {
        ipcRenderer.invoke("mark-invoice-pending", id);
      }
    };
  }, []);

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
        isSubmitted.current = true;
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
            <div className="w-full self-center font-sans text-xl text-slate-800 dark:text-slate-300">
              {invoice.invoice_id && `- ${invoice.invoice_id} -`}
            </div>
          </div>
        </div>

        <SearchBox action={handleBarcode} eraseOnPaste={true} />

        <div className="flex justify-center my-2">
          <div className="w-[80vw] my-4 overflow-x-auto shadow-gray-950 shadow-md rounded-xl">
            {loading ? (
              <h1 className="py-3 text-center font-cocon text-xl dark:text-slate-200 text-slate-950">
                {t("common.loading")}
              </h1>
            ) : (
              <PackingTable items={items} decrementFunc={decrementItem} />
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-[90%] flex justify-between px-5">
            <div className="flex justify-center py-4">
              <div className="min-h-[5vh] w-[100%] flex justify-end">
                <Button type="primary" danger shape="rounded" className="border-red-600" onClick={reset}>
                {t("common.reset")}
                </Button>
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
