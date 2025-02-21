import { useState, useEffect, useCallback } from "react";
import { useSFX } from "./useSFX.jsx";

export function usePacking(invoiceId) {
  const [invoice, setInvoice] = useState({});
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);

  const {
    playItemScanSound,
    playPackingCompleteSound,
    playItemOverScanSound,
    playCanSubmitSound,
  } = useSFX();

  const updateItemState = useCallback(
    (item, { increasing = true, playSounds = true } = {}) => {
      if (item.current_count < item.total_count) {
        if (increasing && playSounds) playItemScanSound();
        return { ...item, colorMain: "#1f2937", colorSecond: "#1c64f2" };
      }
      if (item.current_count === item.total_count) {
        playPackingCompleteSound();
        if (increasing && playSounds) playItemScanSound();
        return { ...item, colorMain: "#03543f", colorSecond: "#0e9f6e" };
      }
      if (item.current_count > item.total_count) {
        if (increasing && playSounds) playItemOverScanSound();
        return { ...item, colorMain: "#c81e1e", colorSecond: "#771d1d" };
      }
      return item;
    },
    [playItemScanSound, playPackingCompleteSound, playItemOverScanSound]
  );

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ipcRenderer.invoke("fetch-order", invoiceId);
      setInvoice(data.data);

      const items = data.data.items.map((item) =>
        updateItemState(item, { playSounds: false })
      );

      setItems(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [invoiceId, updateItemState]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  // Increment and decrement functions using loose equality (==) for barcode comparison
  const incrementItem = useCallback(
    (barcode) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.barcode == barcode // Using loose equality to match different types
            ? updateItemState(
                { ...item, current_count: item.current_count + 1 },
                { increasing: true }
              )
            : item
        )
      );
    },
    [updateItemState]
  );

  const decrementItem = useCallback(
    (barcode) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.barcode == barcode
            ? updateItemState(
                { ...item, current_count: Math.max(item.current_count - 1, 0) },
                { increasing: false }
              )
            : item
        )
      );
    },
    [updateItemState]
  );

  // Check if all items are complete and trigger sound if so.
  useEffect(() => {
    if (!loading && items.length > 0) {
      const complete = items.filter(
        (item) => item.current_count === item.total_count
      ).length;
      setCanSubmit(complete === items.length);
      if (complete === items.length) playCanSubmitSound();
    }
  }, [items, loading, playCanSubmitSound]);

  return {
    invoice,
    items,
    loading,
    canSubmit,
    getItems,
    incrementItem,
    decrementItem,
  };
}
