import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PackingTable from "./components/PackingTable.jsx";
import SearchBox from "../../shared/components/SearchBox.jsx";
import BackButton from "../../shared/components/BackButton.jsx";
import SubmitInvoiceButton from "./components/SubmitInvoiceButton.jsx";
import "../../shared/styles/Loader.css";

function Packing() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [invoice, setInvoice] = useState({});
  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progress, setprogress] = useState(1);
  const [canSubmit, setCanSubmit] = useState(false);
  const { state } = useLocation();
  const { packerId } = state || {};

  ipcRenderer.on("sticker-generating-progress", (event, progress) => {
    setprogress(progress);
  });

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    if (!loading) {
      var complete = 0;
      items.forEach((item) => {
        if (item.current_count == item.total_count) {
          complete = complete + 1;
        }
      });

      if (complete == items.length) {
        setCanSubmit(true);
        playCanSubmitSound();
      } else {
        setCanSubmit(false);
      }
    }
  }, [items]);

  const getItems = async () => {
    setLoading(true);
    try {
      const data = await ipcRenderer.invoke("fetch-order", id);

      setInvoice(data.data);
      var items = data.data.items;

      //update items state
      items.forEach((item) => {
        updateItemState(item);
      });

      setItems(items);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const barcode = (input) => {
    var item = items.find((x) => x.barcode == input);
    if (item) {
      setItems((prevState) => {
        const updatedItems = [...prevState]; //create a copy
        let i = updatedItems.indexOf(item); //index of the item that needs updating
        updatedItems[i].current_count += 1; //update index in the copied array

        updateItemState(updatedItems[i], true);
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
        updatedItems[i].current_count = Math.max(
          updatedItems[i].current_count - 1,
          0
        ); //update index in the copied array

        updateItemState(updatedItems[i], false);
        return updatedItems;
      });
    }
  };

  const submit = (numberOfPackages) => {
    setProgressLoading(true);
    ipcRenderer
      .invoke("submit-order", {
        invoiceId: id,
        packerId: packerId,
        numberOfPackages: numberOfPackages,
      })
      .then(async () => {
        playCanSubmitSound();
        setProgressLoading(false);
        await ipcRenderer.invoke("go-back");
      });
  };

  const reset = () => {
    var newItems = [...items];
    for (var i = 0; i < newItems.length; i++) {
      newItems[i].current_count = 0;
      newItems[i] = setItemStateNormal(newItems[i]);
    }
    setItems(newItems);
  };

  const backWithAlert = () => {
    alert("progress will not be saved");
    //if alert submit then clear and go back
    //if not cancel
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
      {progressLoading && (
        <div className="fixed bg-[#00000090] w-full h-full z-10 flex justify-center items-center">
          <div className="pb-32">
            <div
              className="loader"
              style={{ backgroundSize: `${progress}% 3px` }}
            ></div>
            <div className="text-slate-100 text-xl font-sans text-center">
              {progress}%
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="flex justify-between w-full px-5 py-4">
          {/* Back Button */}
          <div className="flex justify-center">
            <div className="min-h-[5vh] w-full flex justify-start">
              <BackButton />
            </div>
          </div>
          {/* Logs */}
          <div className="flex justify-center px-4">
            <div className="w-full self-center font-sans text-xl text-slate-300">
              {invoice.id && `- ${invoice.id} -`}
            </div>
          </div>
        </div>

        {/* search */}
        <SearchBox action={barcode} eraseOnPaste={true} />

        <div className="flex justify-center my-2">
          <div className="w-[80vw] my-4 overflow-x-auto shadow-gray-950 shadow-md rounded-xl">
            {loading ? (
              <h1 className="py-3 text-center font-cocon text-xl text-slate-950">
                Loading...
              </h1>
            ) : (
              <PackingTable data={items} decrementFunc={decrement} />
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
            <SubmitInvoiceButton
              packerId={packerId}
              invoice={invoice}
              action={submit}
              disabled={!canSubmit}
            ></SubmitInvoiceButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default Packing;

function updateItemState(item, increasing) {
  //if undershoot
  if (item.current_count < item.total_count) {
    if (increasing) playItemScanSound();
    return setItemStateNormal(item);
  }

  //if completed
  if (item.current_count == item.total_count) {
    playPackingCompleteSound();
    if (increasing) playItemScanSound();
    return setItemStateComplete(item);
  }

  //if overshoot
  if (item.current_count > item.total_count) {
    if (increasing) playItemOverScanSound();
    return setItemStateOverShoot(item);
  }
}
function setItemStateNormal(item) {
  item.colorMain = "#1f2937";
  item.colorSecond = "#1c64f2";
  return item;
}
function setItemStateComplete(item) {
  item.colorMain = "#03543f";
  item.colorSecond = "#0e9f6e";
  return item;
}
function setItemStateOverShoot(item) {
  item.colorMain = "#c81e1e";
  item.colorSecond = "#771d1d";
  return item;
}

function playItemScanSound() {
  ipcRenderer.invoke("play-sound", "scannerBeep");
}

function playPackingCompleteSound() {
  ipcRenderer.invoke("play-sound", "complete");
}

function playItemOverScanSound() {
  ipcRenderer.invoke("play-sound", "error");
}

function playCanSubmitSound() {
  ipcRenderer.invoke("play-sound", "complete2");
}
