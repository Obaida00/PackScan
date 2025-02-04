import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PackingTable from "../components/TableComponents/Packing/PackingTable.jsx";
import SearchBox from "../components/SearchBox.jsx";
import BackButton from "../components/BackButton.jsx";
import SubmitInvoiceButton from "../components/TableComponents/Packing/SubmitInvoiceButton.jsx";

function Packing() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [invoice, setInvoice] = useState({});
  const [loading, setLoading] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);
  const { state } = useLocation();
  const { packerId } = state || {};

  if (!packerId) {
    return <div>Error: Missing required Packer ID</div>;
  }
  
  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    if (!loading) {
      var complete = 0;
      items.forEach((item) => {
        if (item.count == item.total_count) {
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

      //adding a current counter set to 0 to each item
      var items = data.data.items.map((item) => {
        return {
          ...item,
          count: 0,
          //progress bar colors
          colorMain: "#1f2937",
          colorSecond: "#1c64f2",
        };
      });

      //update items state
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
        updatedItems[i].count += 1; //update index in the copied array

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
        updatedItems[i].count = Math.max(updatedItems[i].count - 1, 0); //update index in the copied array

        updatedItems[i] = updateItemState(updatedItems[i], false);
        return updatedItems;
      });
    }
  };

  const submit = (numberOfPackages) => {
    ipcRenderer
      .invoke("submit-order", {
        invoiceId: id,
        packerId: packerId,
        numberOfPackages: numberOfPackages,
      })
      .then(async () => {
        playCanSubmitSound();
        await ipcRenderer.invoke("go-back");
      });
  };

  const reset = () => {
    var newItems = [...items];
    for (var i = 0; i < newItems.length; i++) {
      newItems[i].count = 0;
      newItems[i] = setItemStateNormal(newItems[i]);
    }
    setItems(newItems);
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
            <BackButton />
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
  if (item.count < item.total_count) {
    if (increasing) playItemScanSound();
    return setItemStateNormal(item);
  }

  //if completed
  if (item.count == item.total_count) {
    playPackingCompleteSound();
    if (increasing) playItemScanSound();
    return setItemStateComplete(item);
  }

  //if overshoot
  if (item.count > item.total_count) {
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
