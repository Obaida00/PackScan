import React, { useState, useEffect } from "react";

export const usePrinterSelection = () => {
  const [printers, setPrinters] = useState([]);
  const [defaultReceiptPrinter, setDefaultReceiptPrinter] = useState("");
  const [defaultStickerPrinter, setDefaultStickerPrinter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPrinters = async () => {
      try {
        setLoading(true);

        const availablePrinters = await ipcRenderer.invoke("get-printers");
        setPrinters(availablePrinters);

        const settings = await ipcRenderer.invoke("get-settings");
        if (settings && settings.defaultReceiptPrinter) {
          console.log(
            "setting defualt receipt printer to.. ",
            settings.defaultReceiptPrinter
          );
          setDefaultReceiptPrinter(settings.defaultReceiptPrinter);
        }

        if (settings && settings.defaultStickerPrinter) {
          console.log(
            "setting defualt sticker printer to.. ",
            settings.defaultStickerPrinter
          );
          setDefaultStickerPrinter(settings.defaultStickerPrinter);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading printers: ", err);
        setError("Failed to load printers. Please try again.");
        setLoading(false);
      }
    };

    loadPrinters();
  }, []);

  const updateDefaultReceiptPrinter = async (printerName) => {
    try {
      setDefaultReceiptPrinter(printerName);
      ipcRenderer.invoke("save-settings", {
        defaultReceiptPrinter: printerName,
      });
      return true;
    } catch (err) {
      console.error("Error saving default receipt printer:", err);
      setError("Failed to save printer setting. Please try again.");
      return false;
    }
  };

  const updateDefaultStickerPrinter = async (printerName) => {
    try {
      setDefaultStickerPrinter(printerName);
      ipcRenderer.invoke("save-settings", {
        defaultStickerPrinter: printerName,
      });
      return true;
    } catch (err) {
      console.error("Error saving default sticker printer:", err);
      setError("Failed to save printer setting. Please try again.");
      return false;
    }
  };

  return {
    printers,
    defaultReceiptPrinter,
    defaultStickerPrinter,
    loading,
    error,
    updateDefaultReceiptPrinter,
    updateDefaultStickerPrinter,
  };
};

export default usePrinterSelection;
