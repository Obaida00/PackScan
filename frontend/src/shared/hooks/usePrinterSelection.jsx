import React, { useState, useEffect } from 'react';

export const usePrinterSelection = () => {
  const [printers, setPrinters] = useState([]);
  const [defaultPrinter, setDefaultPrinter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPrinters = async () => {
      try {
        setLoading(true);
        
        const availablePrinters = await ipcRenderer.invoke("get-printers");
        setPrinters(availablePrinters);
        
        const settings = await ipcRenderer.invoke("get-settings");
        if (settings && settings.defaultPrinter) {
          console.log("setting defualt printer to.. ", settings.defaultPrinter);
          setDefaultPrinter(settings.defaultPrinter);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading printers: ', err);
        setError('Failed to load printers. Please try again.');
        setLoading(false);
      }
    };

    loadPrinters();
  }, []);

  const updateDefaultPrinter = async (printerName) => {
    try {
      setDefaultPrinter(printerName);
      ipcRenderer.invoke("save-settings", { defaultPrinter: printerName });
      return true;
    } catch (err) {
      console.error('Error saving default printer:', err);
      setError('Failed to save printer setting. Please try again.');
      return false;
    }
  };

  return {
    printers,
    defaultPrinter,
    loading,
    error,
    updateDefaultPrinter
  };
};

export default usePrinterSelection;
